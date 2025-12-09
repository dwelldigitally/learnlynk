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
      // All conditions must match
      return group.conditions.every(condition => this.evaluateCondition(lead, condition));
    } else {
      // At least one condition must match (OR)
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

    switch (method) {
      case 'round_robin':
        if (advisors && advisors.length > 0) {
          const assignedTo = await this.getRoundRobinAdvisor(advisors);
          return { assignedTo };
        }
        break;

      case 'direct':
        if (advisors && advisors.length > 0) {
          return { assignedTo: advisors[0] };
        }
        break;

      case 'team_based':
        if (teams && teams.length > 0) {
          const assignedTo = await this.getTeamAdvisor(teams);
          return { assignedTo };
        }
        break;

      case 'ai_based':
        // For now, fallback to round robin
        if (advisors && advisors.length > 0) {
          const assignedTo = await this.getRoundRobinAdvisor(advisors);
          return { assignedTo };
        }
        break;

      default:
        console.warn(`Unknown assignment method: ${method}`);
    }

    return {};
  }

  /**
   * Gets the next advisor in round-robin rotation
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
   * Gets an advisor from a team
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
        return this.getRoundRobinAdvisor(advisorIds);
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
