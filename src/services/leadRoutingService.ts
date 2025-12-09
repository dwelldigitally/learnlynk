import { supabase } from '@/integrations/supabase/client';
import type { Lead } from '@/types/lead';
import type { EnhancedRoutingRule, ConditionGroup, RuleCondition } from '@/types/routing';

export interface RoutingResult {
  matched: boolean;
  assignedTo?: string;
  method?: string;
  ruleId?: string;
  ruleName?: string;
}

interface AdvisorAvailability {
  advisor_id: string;
  routing_enabled: boolean;
  is_available: boolean;
  capacity_per_week: number;
  current_weekly_assignments: number;
  performance_tier: string;
  working_schedule: {
    days: string[];
    start_time: string;
    end_time: string;
  };
}

export class LeadRoutingService {
  /**
   * Evaluates all active routing rules against a lead and returns assignment result
   */
  static async evaluateRoutingRules(lead: Lead): Promise<RoutingResult> {
    try {
      // Fetch active routing rules ordered by priority
      const { data: rules, error } = await supabase
        .from('lead_routing_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error || !rules || rules.length === 0) {
        console.log('No active routing rules found');
        return { matched: false };
      }

      // Evaluate each rule in priority order
      for (const rule of rules) {
        const ruleData = rule as unknown as EnhancedRoutingRule;
        
        // Database column is 'conditions', not 'condition_groups'
        const conditionGroups = (rule as any).conditions || ruleData.condition_groups || [];
        const matched = this.evaluateConditionGroups(lead, conditionGroups);
        
        if (matched) {
          // Execute assignment based on rule configuration
          const assignmentResult = await this.executeAssignment(lead, ruleData);
          
          if (assignmentResult.assignedTo) {
            // Increment the advisor's weekly assignment count
            await this.incrementAdvisorAssignments(assignmentResult.assignedTo);
            
            // Log the routing execution
            await this.logRoutingExecution(lead.id, ruleData.id, assignmentResult.assignedTo, 'matched');
            
            return {
              matched: true,
              assignedTo: assignmentResult.assignedTo,
              method: ruleData.assignment_config.method,
              ruleId: ruleData.id,
              ruleName: ruleData.name
            };
          }
        }
      }

      return { matched: false };
    } catch (error) {
      console.error('Error evaluating routing rules:', error);
      return { matched: false };
    }
  }

  /**
   * Fetches advisor availability and routing settings
   */
  private static async getAdvisorAvailability(advisorIds: string[]): Promise<AdvisorAvailability[]> {
    const { data, error } = await supabase
      .from('advisor_performance')
      .select('advisor_id, routing_enabled, is_available, capacity_per_week, current_weekly_assignments, performance_tier, working_schedule')
      .in('advisor_id', advisorIds);

    if (error) {
      console.error('Error fetching advisor availability:', error);
      return [];
    }

    // Create default entries for advisors without performance records
    const availabilityMap = new Map<string, AdvisorAvailability>();
    
    data?.forEach(record => {
      availabilityMap.set(record.advisor_id, {
        advisor_id: record.advisor_id,
        routing_enabled: record.routing_enabled ?? true,
        is_available: record.is_available ?? true,
        capacity_per_week: record.capacity_per_week ?? 50,
        current_weekly_assignments: record.current_weekly_assignments ?? 0,
        performance_tier: record.performance_tier || 'Standard',
        working_schedule: (record.working_schedule as AdvisorAvailability['working_schedule']) || {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '09:00',
          end_time: '17:00'
        }
      });
    });

    // Add defaults for advisors without records
    advisorIds.forEach(id => {
      if (!availabilityMap.has(id)) {
        availabilityMap.set(id, {
          advisor_id: id,
          routing_enabled: true,
          is_available: true,
          capacity_per_week: 50,
          current_weekly_assignments: 0,
          performance_tier: 'Standard',
          working_schedule: {
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            start_time: '09:00',
            end_time: '17:00'
          }
        });
      }
    });

    return Array.from(availabilityMap.values());
  }

  /**
   * Filters advisors based on availability for routing
   */
  private static async filterAvailableAdvisors(advisorIds: string[]): Promise<string[]> {
    const availability = await this.getAdvisorAvailability(advisorIds);
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    return availability
      .filter(advisor => {
        // Check if routing is enabled
        if (!advisor.routing_enabled) {
          console.log(`Advisor ${advisor.advisor_id} skipped: routing disabled`);
          return false;
        }

        // Check if available
        if (!advisor.is_available) {
          console.log(`Advisor ${advisor.advisor_id} skipped: not available`);
          return false;
        }

        // Check capacity
        if (advisor.current_weekly_assignments >= advisor.capacity_per_week) {
          console.log(`Advisor ${advisor.advisor_id} skipped: at capacity (${advisor.current_weekly_assignments}/${advisor.capacity_per_week})`);
          return false;
        }

        // Check working schedule (optional - can be strict or lenient)
        const schedule = advisor.working_schedule;
        if (schedule.days && !schedule.days.includes(currentDay)) {
          console.log(`Advisor ${advisor.advisor_id} skipped: not working today (${currentDay})`);
          return false;
        }

        // Check working hours (optional)
        if (schedule.start_time && schedule.end_time) {
          if (currentTime < schedule.start_time || currentTime > schedule.end_time) {
            // Log but don't skip - leads can still be assigned for later handling
            console.log(`Advisor ${advisor.advisor_id}: outside working hours but still eligible`);
          }
        }

        return true;
      })
      .map(advisor => advisor.advisor_id);
  }

  /**
   * Gets the performance tier priority (higher = better)
   */
  private static getTierPriority(tier: string): number {
    switch (tier) {
      case 'Top': return 3;
      case 'Advanced': return 2;
      case 'Standard': return 1;
      default: return 1;
    }
  }

  /**
   * Gets advisor using performance-based assignment
   */
  private static async getPerformanceBasedAdvisor(advisorIds: string[]): Promise<string | undefined> {
    const availability = await this.getAdvisorAvailability(advisorIds);
    
    // Filter to available advisors only
    const availableAdvisors = availability.filter(a => 
      a.routing_enabled && 
      a.is_available && 
      a.current_weekly_assignments < a.capacity_per_week
    );

    if (availableAdvisors.length === 0) {
      return undefined;
    }

    // Sort by performance tier (descending), then by remaining capacity (descending)
    availableAdvisors.sort((a, b) => {
      const tierDiff = this.getTierPriority(b.performance_tier) - this.getTierPriority(a.performance_tier);
      if (tierDiff !== 0) return tierDiff;
      
      // Within same tier, prefer advisor with more remaining capacity
      const aRemaining = a.capacity_per_week - a.current_weekly_assignments;
      const bRemaining = b.capacity_per_week - b.current_weekly_assignments;
      return bRemaining - aRemaining;
    });

    return availableAdvisors[0]?.advisor_id;
  }

  /**
   * Increments advisor's weekly assignment count
   */
  private static async incrementAdvisorAssignments(advisorId: string): Promise<void> {
    try {
      // Try to use the database function first
      const { error } = await supabase.rpc('increment_advisor_weekly_assignments', {
        p_advisor_id: advisorId
      });

      if (error) {
        console.error('Error incrementing advisor assignments via RPC:', error);
        // Fallback: direct update using raw SQL increment
        const { data: current } = await supabase
          .from('advisor_performance')
          .select('current_weekly_assignments')
          .eq('advisor_id', advisorId)
          .maybeSingle();
        
        if (current) {
          await supabase
            .from('advisor_performance')
            .update({ 
              current_weekly_assignments: (current.current_weekly_assignments || 0) + 1
            })
            .eq('advisor_id', advisorId);
        }
      }
    } catch (error) {
      console.error('Error incrementing advisor assignments:', error);
    }
  }

  /**
   * Evaluates all condition groups (AND logic between groups, OR within groups)
   */
  private static evaluateConditionGroups(lead: Lead, conditionGroups: ConditionGroup[]): boolean {
    if (!conditionGroups || conditionGroups.length === 0) {
      return true; // No conditions means match all
    }

    // All condition groups must match (AND logic between groups)
    return conditionGroups.every(group => this.evaluateConditionGroup(lead, group));
  }

  /**
   * Evaluates a single condition group
   */
  private static evaluateConditionGroup(lead: Lead, group: ConditionGroup): boolean {
    if (!group.conditions || group.conditions.length === 0) {
      return true;
    }

    if (group.operator === 'AND') {
      return group.conditions.every(condition => this.evaluateCondition(lead, condition));
    } else {
      return group.conditions.some(condition => this.evaluateCondition(lead, condition));
    }
  }

  /**
   * Evaluates a single condition against lead properties
   */
  private static evaluateCondition(lead: Lead, condition: RuleCondition): boolean {
    const leadValue = this.getLeadPropertyValue(lead, condition.field);
    const conditionValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return leadValue === conditionValue;

      case 'in':
        if (Array.isArray(conditionValue)) {
          return Array.isArray(leadValue)
            ? leadValue.some(v => conditionValue.includes(v))
            : conditionValue.includes(leadValue);
        }
        return false;

      case 'not_in':
        if (Array.isArray(conditionValue)) {
          return Array.isArray(leadValue)
            ? !leadValue.some(v => conditionValue.includes(v))
            : !conditionValue.includes(leadValue);
        }
        return true;

      case 'greater_than':
        return Number(leadValue) > Number(conditionValue);

      case 'less_than':
        return Number(leadValue) < Number(conditionValue);

      case 'contains':
        if (typeof leadValue === 'string' && typeof conditionValue === 'string') {
          return leadValue.toLowerCase().includes(conditionValue.toLowerCase());
        }
        if (Array.isArray(leadValue)) {
          return leadValue.includes(conditionValue);
        }
        return false;

      case 'between':
        if (Array.isArray(conditionValue) && conditionValue.length === 2) {
          const numValue = Number(leadValue);
          return numValue >= Number(conditionValue[0]) && numValue <= Number(conditionValue[1]);
        }
        return false;

      default:
        return false;
    }
  }

  /**
   * Gets a lead property value by field name
   */
  private static getLeadPropertyValue(lead: Lead, field: string): any {
    switch (field) {
      case 'source':
        return lead.source;
      case 'status':
        return lead.status;
      case 'priority':
        return lead.priority;
      case 'lead_score':
        return lead.lead_score;
      case 'ai_score':
        return lead.ai_score;
      case 'country':
        return lead.country;
      case 'state':
        return lead.state;
      case 'city':
        return lead.city;
      case 'program_interest':
        return lead.program_interest;
      case 'preferred_intake_id':
        return lead.preferred_intake_id;
      case 'academic_term_id':
        return lead.academic_term_id;
      case 'utm_source':
        return lead.utm_source;
      case 'utm_medium':
        return lead.utm_medium;
      case 'utm_campaign':
        return lead.utm_campaign;
      case 'utm_content':
        return lead.utm_content;
      case 'utm_term':
        return lead.utm_term;
      case 'tags':
        return lead.tags;
      case 'qualification_stage':
        return lead.qualification_stage;
      case 'created_at':
        return lead.created_at;
      default:
        return null;
    }
  }

  /**
   * Executes assignment based on rule configuration
   */
  private static async executeAssignment(
    lead: Lead,
    rule: EnhancedRoutingRule
  ): Promise<{ assignedTo?: string }> {
    const { method, advisors, teams } = rule.assignment_config;

    // Filter to available advisors first
    let eligibleAdvisors: string[] = [];

    switch (method) {
      case 'round_robin':
        if (advisors && advisors.length > 0) {
          eligibleAdvisors = await this.filterAvailableAdvisors(advisors);
          if (eligibleAdvisors.length > 0) {
            const assignedTo = await this.getRoundRobinAdvisor(eligibleAdvisors);
            return { assignedTo };
          }
        }
        break;

      case 'direct':
        if (advisors && advisors.length > 0) {
          eligibleAdvisors = await this.filterAvailableAdvisors(advisors);
          if (eligibleAdvisors.length > 0) {
            return { assignedTo: eligibleAdvisors[0] };
          }
        }
        break;

      case 'team_based':
        if (teams && teams.length > 0) {
          const assignedTo = await this.getTeamAdvisor(teams);
          return { assignedTo };
        }
        break;

      case 'performance_based':
        if (advisors && advisors.length > 0) {
          const assignedTo = await this.getPerformanceBasedAdvisor(advisors);
          return { assignedTo };
        }
        break;

      case 'ai_based':
        // Performance-based is a good fallback for AI-based
        if (advisors && advisors.length > 0) {
          const assignedTo = await this.getPerformanceBasedAdvisor(advisors);
          return { assignedTo };
        }
        break;

      default:
        console.warn(`Unknown assignment method: ${method}`);
    }

    return {};
  }

  /**
   * Gets the next advisor in round-robin rotation (from available advisors only)
   */
  private static async getRoundRobinAdvisor(advisorIds: string[]): Promise<string> {
    try {
      // Get assignment counts for each advisor
      const { data: counts } = await supabase
        .from('leads')
        .select('assigned_to')
        .in('assigned_to', advisorIds)
        .not('assigned_to', 'is', null);

      // Count assignments per advisor
      const assignmentCounts = new Map<string, number>();
      advisorIds.forEach(id => assignmentCounts.set(id, 0));
      
      counts?.forEach(record => {
        const current = assignmentCounts.get(record.assigned_to) || 0;
        assignmentCounts.set(record.assigned_to, current + 1);
      });

      // Find advisor with minimum assignments
      let minAdvisor = advisorIds[0];
      let minCount = assignmentCounts.get(minAdvisor) || 0;

      for (const [advisorId, count] of assignmentCounts.entries()) {
        if (count < minCount) {
          minCount = count;
          minAdvisor = advisorId;
        }
      }

      return minAdvisor;
    } catch (error) {
      console.error('Error in round robin assignment:', error);
      return advisorIds[0]; // Fallback to first advisor
    }
  }

  /**
   * Gets an advisor from a team (respects availability)
   */
  private static async getTeamAdvisor(teamIds: string[]): Promise<string | undefined> {
    try {
      // Get active team members from the first team
      const { data: members } = await supabase
        .from('team_members')
        .select('advisor_id')
        .in('team_id', teamIds)
        .eq('is_active', true);

      if (members && members.length > 0) {
        const advisorIds = members.map(m => m.advisor_id);
        
        // Filter to available advisors
        const availableAdvisors = await this.filterAvailableAdvisors(advisorIds);
        
        if (availableAdvisors.length > 0) {
          // Use performance-based selection within team
          return this.getPerformanceBasedAdvisor(availableAdvisors);
        }
      }
    } catch (error) {
      console.error('Error getting team advisor:', error);
    }
    return undefined;
  }

  /**
   * Logs routing execution for analytics
   */
  private static async logRoutingExecution(
    leadId: string,
    ruleId: string,
    assignedTo: string,
    result: 'matched' | 'no_match' | 'error'
  ): Promise<void> {
    try {
      await supabase
        .from('rule_execution_logs')
        .insert({
          rule_id: ruleId,
          lead_id: leadId,
          execution_result: result,
          assigned_to: assignedTo,
          execution_time_ms: 0,
          execution_data: {}
        });
    } catch (error) {
      console.error('Error logging routing execution:', error);
    }
  }
}
