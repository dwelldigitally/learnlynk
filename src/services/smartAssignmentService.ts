import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { TeamCapacityService } from "./teamCapacityService";

export interface AssignmentRecommendation {
  advisorId: string;
  advisorName: string;
  score: number;
  reasoning: string[];
  confidence: number;
  workloadImpact: 'low' | 'medium' | 'high';
  estimatedResponseTime: number; // in hours
  specializations: string[];
  currentLoad: number;
  maxCapacity: number;
  availability: 'available' | 'busy' | 'unavailable';
}

export interface AssignmentCriteria {
  prioritizeWorkload: boolean;
  prioritizePerformance: boolean;
  prioritizeSpecialization: boolean;
  prioritizeGeography: boolean;
  minimumScore?: number;
  maxRecommendations?: number;
}

export interface AssignmentMetrics {
  totalAssignments: number;
  averageResponseTime: number;
  conversionRate: number;
  workloadDistribution: Array<{
    advisorId: string;
    advisorName: string;
    currentLoad: number;
    capacity: number;
    utilization: number;
  }>;
  performanceMetrics: Array<{
    advisorId: string;
    advisorName: string;
    conversionRate: number;
    averageResponseTime: number;
    totalLeads: number;
  }>;
}

export class SmartAssignmentService {
  
  static async getAssignmentRecommendations(
    lead: Lead, 
    criteria: AssignmentCriteria = {
      prioritizeWorkload: true,
      prioritizePerformance: true,
      prioritizeSpecialization: true,
      prioritizeGeography: false,
      maxRecommendations: 5
    }
  ): Promise<AssignmentRecommendation[]> {
    try {
      // Get available advisors
      const advisors = await this.getAvailableAdvisors();
      
      if (advisors.length === 0) {
        return [];
      }

      // Score each advisor
      const recommendations: AssignmentRecommendation[] = [];
      
      for (const advisor of advisors) {
        const recommendation = await this.scoreAdvisor(advisor, lead, criteria);
        if (recommendation.score >= (criteria.minimumScore || 0)) {
          recommendations.push(recommendation);
        }
      }

      // Sort by score and limit results
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, criteria.maxRecommendations || 5);
        
    } catch (error) {
      console.error('Failed to get assignment recommendations:', error);
      return [];
    }
  }

  static async assignLeadToAdvisor(
    leadId: string, 
    advisorId: string, 
    method: 'ai_based' | 'manual' | 'round_robin' = 'ai_based'
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update lead assignment
    const { error: leadError } = await supabase
      .from('leads')
      .update({
        assigned_to: advisorId,
        assigned_at: new Date().toISOString(),
        assignment_method: method as any
      })
      .eq('id', leadId);

    if (leadError) {
      throw new Error(`Failed to assign lead: ${leadError.message}`);
    }

    // Log the assignment activity
    await supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        activity_type: 'assignment',
        activity_description: `Lead assigned to advisor via ${method} assignment`,
        activity_data: { advisor_id: advisorId, assignment_method: method },
        performed_by: user.id
      });

    // Update advisor performance tracking
    await this.updateAdvisorAssignmentCount(advisorId);
  }

  static async getAssignmentMetrics(
    dateRange?: { start: Date; end: Date }
  ): Promise<AssignmentMetrics> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Build date filter
    let dateFilter = '';
    if (dateRange) {
      dateFilter = `AND assigned_at >= '${dateRange.start.toISOString()}' AND assigned_at <= '${dateRange.end.toISOString()}'`;
    }

    // Get assignment data
    const { data: assignments } = await supabase
      .from('leads')
      .select(`
        id,
        assigned_to,
        assigned_at,
        status,
        created_at
      `)
      .eq('user_id', user.id)
      .not('assigned_to', 'is', null);

    // Get advisor performance data
    const { data: advisorPerformance } = await supabase
      .from('advisor_performance')
      .select('*');

    // Calculate metrics
    const totalAssignments = assignments?.length || 0;
    
    // Calculate average response time (placeholder - would need actual response data)
    const averageResponseTime = 4.5; // hours
    
    // Calculate conversion rate
    const convertedLeads = assignments?.filter(a => a.status === 'converted').length || 0;
    const conversionRate = totalAssignments > 0 ? (convertedLeads / totalAssignments) * 100 : 0;

    // Get workload distribution
    const workloadDistribution = await this.calculateWorkloadDistribution();
    
    // Get performance metrics
    const performanceMetrics = await this.calculatePerformanceMetrics(assignments || []);

    return {
      totalAssignments,
      averageResponseTime,
      conversionRate,
      workloadDistribution,
      performanceMetrics
    };
  }

  static async optimizeTeamWorkload(): Promise<{
    recommendations: Array<{
      type: 'redistribute' | 'increase_capacity' | 'reduce_load';
      description: string;
      impact: string;
      advisorId?: string;
    }>;
    balanceScore: number;
  }> {
    const workloadData = await this.calculateWorkloadDistribution();
    const recommendations = [];
    
    // Find overloaded advisors
    const overloaded = workloadData.filter(w => w.utilization > 90);
    const underutilized = workloadData.filter(w => w.utilization < 50);
    
    for (const advisor of overloaded) {
      recommendations.push({
        type: 'reduce_load' as const,
        description: `${advisor.advisorName} is at ${advisor.utilization}% capacity. Consider redistributing leads.`,
        impact: 'High - prevent burnout and maintain quality',
        advisorId: advisor.advisorId
      });
    }
    
    for (const advisor of underutilized) {
      recommendations.push({
        type: 'redistribute' as const,
        description: `${advisor.advisorName} has capacity for ${advisor.capacity - advisor.currentLoad} more leads.`,
        impact: 'Medium - improve resource utilization',
        advisorId: advisor.advisorId
      });
    }

    // Calculate balance score (0-100, higher is better)
    const utilizationVariance = this.calculateVariance(workloadData.map(w => w.utilization));
    const balanceScore = Math.max(0, 100 - utilizationVariance);

    return {
      recommendations,
      balanceScore
    };
  }

  // Private helper methods
  private static async getAvailableAdvisors(): Promise<Array<{
    id: string;
    name: string;
    email: string;
    specializations: string[];
    currentLoad: number;
    maxCapacity: number;
    performanceScore: number;
    averageResponseTime: number;
    conversionRate: number;
    isAvailable: boolean;
  }>> {
    // Get advisor performance data
    const { data: advisorPerformance } = await supabase
      .from('advisor_performance')
      .select('*')
      .eq('is_available', true);

    if (!advisorPerformance) return [];

    // Get team capacity data for specializations
    const teams = await TeamCapacityService.getTeamCapacity();
    
    const advisors = [];
    
    for (const perf of advisorPerformance) {
      // Find advisor in teams for additional data
      const teamMember = teams
        .flatMap(team => team.members)
        .find(member => member.id === perf.advisor_id);

      advisors.push({
        id: perf.advisor_id,
        name: teamMember?.name || `Advisor ${perf.advisor_id.slice(0, 8)}`,
        email: teamMember?.email || '',
        specializations: teams.find(t => t.members.some(m => m.id === perf.advisor_id))?.specializations || [],
        currentLoad: perf.leads_assigned - perf.leads_converted,
        maxCapacity: perf.max_daily_assignments || 10,
        performanceScore: (perf.conversion_rate || 0) * 100,
        averageResponseTime: perf.response_time_avg || 4,
        conversionRate: perf.conversion_rate || 0,
        isAvailable: perf.is_available
      });
    }

    return advisors;
  }

  private static async scoreAdvisor(
    advisor: any,
    lead: Lead,
    criteria: AssignmentCriteria
  ): Promise<AssignmentRecommendation> {
    let totalScore = 0;
    const reasoning: string[] = [];
    let confidence = 100;

    // Workload score (0-30 points)
    if (criteria.prioritizeWorkload) {
      const utilization = (advisor.currentLoad / advisor.maxCapacity) * 100;
      const workloadScore = Math.max(0, 30 - (utilization / 100 * 30));
      totalScore += workloadScore;
      
      if (utilization < 50) {
        reasoning.push(`Low workload (${utilization.toFixed(0)}% utilization)`);
      } else if (utilization > 80) {
        reasoning.push(`High workload (${utilization.toFixed(0)}% utilization)`);
        confidence -= 20;
      }
    }

    // Performance score (0-25 points)
    if (criteria.prioritizePerformance) {
      const performanceScore = (advisor.conversionRate * 25);
      totalScore += performanceScore;
      
      if (advisor.conversionRate > 0.8) {
        reasoning.push(`High conversion rate (${(advisor.conversionRate * 100).toFixed(0)}%)`);
      } else if (advisor.conversionRate < 0.3) {
        reasoning.push(`Lower conversion rate (${(advisor.conversionRate * 100).toFixed(0)}%)`);
        confidence -= 15;
      }
    }

    // Specialization match (0-25 points)
    if (criteria.prioritizeSpecialization && lead.program_interest) {
      const leadPrograms = lead.program_interest || [];
      const matchingSpecializations = advisor.specializations.filter(spec =>
        leadPrograms.some(program => 
          program.toLowerCase().includes(spec.toLowerCase()) ||
          spec.toLowerCase().includes(program.toLowerCase())
        )
      );
      
      const specializationScore = (matchingSpecializations.length / Math.max(leadPrograms.length, 1)) * 25;
      totalScore += specializationScore;
      
      if (matchingSpecializations.length > 0) {
        reasoning.push(`Specialization match: ${matchingSpecializations.join(', ')}`);
      } else {
        reasoning.push('No direct specialization match');
        confidence -= 10;
      }
    }

    // Response time score (0-20 points)
    const responseScore = Math.max(0, 20 - (advisor.averageResponseTime / 24 * 20));
    totalScore += responseScore;
    
    if (advisor.averageResponseTime < 2) {
      reasoning.push(`Fast response time (${advisor.averageResponseTime.toFixed(1)} hours)`);
    } else if (advisor.averageResponseTime > 8) {
      reasoning.push(`Slower response time (${advisor.averageResponseTime.toFixed(1)} hours)`);
      confidence -= 10;
    }

    // Geography bonus (optional)
    if (criteria.prioritizeGeography) {
      // This could match timezone, country, etc.
      // For now, just a placeholder
      totalScore += 5;
      reasoning.push('Geographic alignment');
    }

    // Determine workload impact
    const utilization = (advisor.currentLoad / advisor.maxCapacity) * 100;
    let workloadImpact: 'low' | 'medium' | 'high';
    
    if (utilization < 60) {
      workloadImpact = 'low';
    } else if (utilization < 80) {
      workloadImpact = 'medium';
    } else {
      workloadImpact = 'high';
    }

    // Determine availability
    let availability: 'available' | 'busy' | 'unavailable';
    
    if (utilization < 70) {
      availability = 'available';
    } else if (utilization < 90) {
      availability = 'busy';
    } else {
      availability = 'unavailable';
    }

    return {
      advisorId: advisor.id,
      advisorName: advisor.name,
      score: Math.round(totalScore),
      reasoning,
      confidence: Math.max(0, confidence),
      workloadImpact,
      estimatedResponseTime: advisor.averageResponseTime,
      specializations: advisor.specializations,
      currentLoad: advisor.currentLoad,
      maxCapacity: advisor.maxCapacity,
      availability
    };
  }

  private static async updateAdvisorAssignmentCount(advisorId: string): Promise<void> {
    // Update or insert advisor performance record
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existing } = await supabase
      .from('advisor_performance')
      .select('*')
      .eq('advisor_id', advisorId)
      .eq('period_start', today)
      .single();

    if (existing) {
      await supabase
        .from('advisor_performance')
        .update({
          leads_assigned: existing.leads_assigned + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('advisor_performance')
        .insert({
          advisor_id: advisorId,
          period_start: today,
          period_end: today,
          leads_assigned: 1,
          leads_contacted: 0,
          leads_converted: 0,
          response_time_avg: 0,
          conversion_rate: 0,
          performance_tier: 'C',
          is_available: true
        });
    }
  }

  private static async calculateWorkloadDistribution(): Promise<Array<{
    advisorId: string;
    advisorName: string;
    currentLoad: number;
    capacity: number;
    utilization: number;
  }>> {
    const advisors = await this.getAvailableAdvisors();
    
    return advisors.map(advisor => ({
      advisorId: advisor.id,
      advisorName: advisor.name,
      currentLoad: advisor.currentLoad,
      capacity: advisor.maxCapacity,
      utilization: (advisor.currentLoad / advisor.maxCapacity) * 100
    }));
  }

  private static async calculatePerformanceMetrics(assignments: any[]): Promise<Array<{
    advisorId: string;
    advisorName: string;
    conversionRate: number;
    averageResponseTime: number;
    totalLeads: number;
  }>> {
    const advisors = await this.getAvailableAdvisors();
    
    return advisors.map(advisor => {
      const advisorAssignments = assignments.filter(a => a.assigned_to === advisor.id);
      const conversions = advisorAssignments.filter(a => a.status === 'converted').length;
      
      return {
        advisorId: advisor.id,
        advisorName: advisor.name,
        conversionRate: advisorAssignments.length > 0 ? (conversions / advisorAssignments.length) * 100 : 0,
        averageResponseTime: advisor.averageResponseTime,
        totalLeads: advisorAssignments.length
      };
    });
  }

  private static calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    
    return Math.sqrt(variance);
  }
}