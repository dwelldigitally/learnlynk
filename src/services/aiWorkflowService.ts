import { supabase } from "@/integrations/supabase/client";
import type { Lead } from "@/types/lead";

export interface AIWorkflowPrediction {
  leadId: string;
  conversionProbability: number;
  recommendedActions: string[];
  timeToConversion: number;
  riskFactors: string[];
  optimizationSuggestions: string[];
}

export interface WorkflowOptimization {
  type: 'routing' | 'timing' | 'communication' | 'prioritization';
  description: string;
  impact: 'high' | 'medium' | 'low';
  implementation: string;
  expectedImprovement: number;
}

export class AIWorkflowService {
  
  static async predictLeadConversion(lead: Lead): Promise<AIWorkflowPrediction> {
    // Enhanced AI scoring algorithm
    let conversionProbability = 0.5;
    const recommendedActions: string[] = [];
    const riskFactors: string[] = [];
    const optimizationSuggestions: string[] = [];

    // Score based on lead data completeness
    const dataCompleteness = this.calculateDataCompleteness(lead);
    conversionProbability += dataCompleteness * 0.2;

    // Score based on engagement level
    const { data: activities } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', lead.id)
      .order('performed_at', { ascending: false })
      .limit(10);

    const engagementScore = this.calculateEngagementScore(activities || []);
    conversionProbability += engagementScore * 0.3;

    // Score based on response time
    if (lead.last_contacted_at) {
      const daysSinceContact = Math.floor(
        (Date.now() - new Date(lead.last_contacted_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceContact > 7) {
        riskFactors.push('No contact in over 7 days');
        recommendedActions.push('Schedule immediate follow-up call');
      } else if (daysSinceContact > 3) {
        recommendedActions.push('Send personalized email with program details');
      }
    }

    // Program match scoring
    if (lead.program_interest && lead.program_interest.length > 0) {
      conversionProbability += 0.15;
      optimizationSuggestions.push('Highlight matching program benefits');
    } else {
      riskFactors.push('No specific program interest indicated');
      recommendedActions.push('Discovery call to identify program preferences');
    }

    // Geographic and demographic factors
    if (lead.country) {
      conversionProbability += 0.1;
    }

    // Lead score integration
    if (lead.lead_score && lead.lead_score > 70) {
      conversionProbability += 0.2;
      recommendedActions.push('Fast-track to enrollment consultation');
    } else if (lead.lead_score && lead.lead_score < 30) {
      riskFactors.push('Low initial lead score');
      recommendedActions.push('Implement lead nurturing sequence');
    }

    // Time to conversion prediction
    const timeToConversion = this.predictTimeToConversion(conversionProbability, activities || []);

    return {
      leadId: lead.id,
      conversionProbability: Math.min(Math.max(conversionProbability, 0), 1),
      recommendedActions,
      timeToConversion,
      riskFactors,
      optimizationSuggestions
    };
  }

  static async generateWorkflowOptimizations(): Promise<WorkflowOptimization[]> {
    const optimizations: WorkflowOptimization[] = [];

    // Analyze current workflow performance
    const { data: recentLeads } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (recentLeads && recentLeads.length > 0) {
      // Routing optimization
      const unassignedLeads = recentLeads.filter(lead => !lead.assigned_to);
      if (unassignedLeads.length > recentLeads.length * 0.2) {
        optimizations.push({
          type: 'routing',
          description: 'High number of unassigned leads detected',
          impact: 'high',
          implementation: 'Enable auto-assignment rules based on advisor availability',
          expectedImprovement: 25
        });
      }

      // Response time optimization
      const slowResponseLeads = recentLeads.filter(lead => {
        if (!lead.last_contacted_at || !lead.created_at) return false;
        const responseTime = new Date(lead.last_contacted_at).getTime() - new Date(lead.created_at).getTime();
        return responseTime > 24 * 60 * 60 * 1000; // More than 24 hours
      });

      if (slowResponseLeads.length > recentLeads.length * 0.3) {
        optimizations.push({
          type: 'timing',
          description: 'Response times exceed optimal threshold',
          impact: 'high',
          implementation: 'Implement automated response triggers within 2 hours',
          expectedImprovement: 35
        });
      }

      // Communication optimization
      const lowEngagementLeads = recentLeads.filter(lead => 
        lead.status === 'contacted' && 
        (!lead.last_contacted_at || 
          Date.now() - new Date(lead.last_contacted_at).getTime() > 7 * 24 * 60 * 60 * 1000)
      );

      if (lowEngagementLeads.length > 0) {
        optimizations.push({
          type: 'communication',
          description: 'Multiple leads showing engagement drop-off',
          impact: 'medium',
          implementation: 'Deploy re-engagement email sequence with personalized content',
          expectedImprovement: 20
        });
      }
    }

    return optimizations;
  }

  static async updateLeadAIScore(leadId: string): Promise<void> {
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) return;

    const prediction = await this.predictLeadConversion(lead as any);
    const aiScore = Math.round(prediction.conversionProbability * 100);

    await supabase
      .from('leads')
      .update({ ai_score: aiScore })
      .eq('id', leadId);
  }

  static async getSmartRoutingRecommendation(lead: Lead): Promise<{
    advisorId: string;
    confidence: number;
    reasoning: string[];
  } | null> {
    // Get available advisors with performance data
    const { data: advisors } = await supabase
      .from('advisor_performance')
      .select(`
        advisor_id,
        conversion_rate,
        response_time_avg,
        is_available,
        profiles:advisor_id (
          first_name,
          last_name,
          department
        )
      `)
      .eq('is_available', true);

    if (!advisors || advisors.length === 0) return null;

    // Score advisors based on lead characteristics
    const scoredAdvisors = advisors.map((advisor: any) => {
      let score = 0;
      const reasoning: string[] = [];

      // Conversion rate weight (40%)
      const conversionScore = (advisor.conversion_rate || 0) / 100;
      score += conversionScore * 0.4;
      reasoning.push(`Conversion rate: ${advisor.conversion_rate || 0}%`);

      // Response time weight (30%)
      const responseScore = Math.max(0, 1 - (advisor.response_time_avg || 60) / 120);
      score += responseScore * 0.3;
      reasoning.push(`Avg response time: ${advisor.response_time_avg || 'N/A'} minutes`);

      // Program specialization match (20%)
      if (lead.program_interest && advisor.profiles?.department) {
        const departmentMatch = lead.program_interest.some(program => 
          advisor.profiles.department.toLowerCase().includes(program.toLowerCase())
        );
        if (departmentMatch) {
          score += 0.2;
          reasoning.push('Department specialization match');
        }
      }

      // Current workload weight (10%)
      // This would need to be calculated from current assignments
      score += 0.1; // Placeholder

      return {
        advisorId: advisor.advisor_id,
        score,
        reasoning,
        name: `${advisor.profiles?.first_name || ''} ${advisor.profiles?.last_name || ''}`.trim()
      };
    });

    const bestAdvisor = scoredAdvisors.sort((a, b) => b.score - a.score)[0];

    return {
      advisorId: bestAdvisor.advisorId,
      confidence: Math.round(bestAdvisor.score * 100),
      reasoning: bestAdvisor.reasoning
    };
  }

  private static calculateDataCompleteness(lead: Lead): number {
    const fields = ['first_name', 'last_name', 'email', 'phone', 'country', 'program_interest'];
    const completedFields = fields.filter(field => {
      const value = lead[field as keyof Lead];
      return value && (Array.isArray(value) ? value.length > 0 : value.toString().trim().length > 0);
    }).length;
    
    return completedFields / fields.length;
  }

  private static calculateEngagementScore(activities: any[]): number {
    if (activities.length === 0) return 0;
    
    // Score based on activity frequency and recency
    const recentActivities = activities.filter(activity => {
      const activityDate = new Date(activity.performed_at);
      const daysSince = (Date.now() - activityDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 14; // Last 2 weeks
    });

    return Math.min(recentActivities.length / 5, 1); // Max score at 5+ activities
  }

  private static predictTimeToConversion(probability: number, activities: any[]): number {
    // Base time to conversion (days)
    let baseDays = 21;
    
    // Adjust based on probability
    baseDays = baseDays * (1 - probability * 0.5);
    
    // Adjust based on activity level
    const activityFactor = Math.max(0.5, 1 - activities.length * 0.1);
    baseDays = baseDays * activityFactor;
    
    return Math.round(Math.max(1, baseDays));
  }
}