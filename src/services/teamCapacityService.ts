import { supabase } from "@/integrations/supabase/client";
import type { Lead, AssignmentMethod } from "@/types/lead";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  maxDailyAssignments: number;
  currentAssignments: number;
  performance: {
    conversionRate: number;
    averageResponseTime: number;
    leadScore: number;
  };
}

export interface TeamCapacity {
  teamId: string;
  teamName: string;
  totalCapacity: number;
  currentLoad: number;
  utilizationRate: number;
  members: TeamMember[];
  specializations: string[];
  region: string;
}

export interface AssignmentRecommendation {
  advisorId: string;
  advisorName: string;
  score: number;
  reasoning: string[];
  workloadImpact: number;
  estimatedResponseTime: number;
}

export class TeamCapacityService {
  
  static async getTeamCapacity(teamId?: string): Promise<TeamCapacity[]> {
    let query = supabase
      .from('advisor_teams')
      .select('*')
      .eq('is_active', true);

    if (teamId) {
      query = query.eq('id', teamId);
    }

    const { data: teams } = await query;
    if (!teams) return [];

    const capacityData: TeamCapacity[] = [];

    for (const team of teams) {
      // Get advisor performance data to simulate team capacity
      const { data: advisorData } = await supabase
        .from('advisor_performance')
        .select(`
          *,
          profiles:advisor_id (
            first_name,
            last_name,
            email,
            department
          )
        `)
        .eq('is_available', true);

      const userIds = advisorData?.map(ad => ad.advisor_id) || [];

      // Get current assignments for team members
      const { data: assignments } = await supabase
        .from('leads')
        .select('assigned_to')
        .in('assigned_to', userIds)
        .in('status', ['new', 'contacted', 'qualified', 'nurturing']);

      const assignmentCounts = assignments?.reduce((acc, assignment) => {
        acc[assignment.assigned_to] = (acc[assignment.assigned_to] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Get performance data
      const { data: performance } = await supabase
        .from('advisor_performance')
        .select('*')
        .in('advisor_id', userIds)
        .order('period_start', { ascending: false })
        .limit(1);

      const members: TeamMember[] = advisorData?.map((advisor: any) => ({
        id: advisor.advisor_id,
        name: `${advisor.profiles?.first_name || ''} ${advisor.profiles?.last_name || ''}`.trim(),
        email: advisor.profiles?.email || '',
        role: 'Advisor',
        department: advisor.profiles?.department || '',
        isActive: advisor.is_available,
        maxDailyAssignments: advisor.max_daily_assignments || 10,
        currentAssignments: assignmentCounts[advisor.advisor_id] || 0,
        performance: {
          conversionRate: advisor.conversion_rate || 0,
          averageResponseTime: advisor.response_time_avg || 0,
          leadScore: 75 // Placeholder calculation
        }
      })) || [];

      const totalCapacity = members.reduce((sum, member) => sum + member.maxDailyAssignments, 0);
      const currentLoad = members.reduce((sum, member) => sum + member.currentAssignments, 0);

      capacityData.push({
        teamId: team.id,
        teamName: team.name,
        totalCapacity,
        currentLoad,
        utilizationRate: totalCapacity > 0 ? (currentLoad / totalCapacity) * 100 : 0,
        members,
        specializations: team.specializations || [],
        region: team.region || 'Global'
      });
    }

    return capacityData;
  }

  static async getOptimalAssignment(lead: Lead): Promise<AssignmentRecommendation[]> {
    const teams = await this.getTeamCapacity();
    const recommendations: AssignmentRecommendation[] = [];

    for (const team of teams) {
      for (const member of team.members) {
        if (!member.isActive || member.currentAssignments >= member.maxDailyAssignments) {
          continue;
        }

        let score = 100;
        const reasoning: string[] = [];

        // Workload factor (higher score for lower workload)
        const workloadFactor = 1 - (member.currentAssignments / member.maxDailyAssignments);
        score *= workloadFactor;
        reasoning.push(`Workload: ${member.currentAssignments}/${member.maxDailyAssignments} assignments`);

        // Performance factor
        const performanceFactor = (member.performance.conversionRate / 100) || 0.5;
        score *= (0.5 + performanceFactor);
        reasoning.push(`Conversion rate: ${member.performance.conversionRate.toFixed(1)}%`);

        // Specialization match
        if (lead.program_interest && team.specializations.some(spec => 
          lead.program_interest.includes(spec))) {
          score *= 1.3;
          reasoning.push('Program specialization match');
        }

        // Geographic preference
        if (lead.country && team.region !== 'Global') {
          const regionMatch = this.checkRegionMatch(lead.country, team.region);
          if (regionMatch) {
            score *= 1.2;
            reasoning.push('Geographic region match');
          }
        }

        // Response time factor
        const responseTimeFactor = Math.max(0.5, 1 - (member.performance.averageResponseTime / 120)); // 2 hours baseline
        score *= responseTimeFactor;

        const workloadImpact = (member.currentAssignments + 1) / member.maxDailyAssignments;
        const estimatedResponseTime = member.performance.averageResponseTime * workloadImpact;

        recommendations.push({
          advisorId: member.id,
          advisorName: member.name,
          score: Math.round(score),
          reasoning,
          workloadImpact: Math.round(workloadImpact * 100),
          estimatedResponseTime: Math.round(estimatedResponseTime)
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  static async updateTeamCapacity(teamId: string, updates: Partial<TeamCapacity>) {
    const { error } = await supabase
      .from('advisor_teams')
      .update({
        max_daily_assignments: updates.totalCapacity,
        specializations: updates.specializations,
        region: updates.region
      })
      .eq('id', teamId);

    if (error) {
      throw new Error(`Failed to update team capacity: ${error.message}`);
    }
  }

  static async assignLeadToAdvisor(leadId: string, advisorId: string, method: AssignmentMethod = 'ai_based') {
    const { error } = await supabase
      .from('leads')
      .update({
        assigned_to: advisorId,
        assigned_at: new Date().toISOString(),
        assignment_method: method
      })
      .eq('id', leadId);

    if (error) {
      throw new Error(`Failed to assign lead: ${error.message}`);
    }

    // Log the assignment
    await supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        activity_type: 'assignment',
        activity_description: `Lead assigned to advisor via ${method}`,
        performed_by: (await supabase.auth.getUser()).data.user?.id
      });
  }

  static async getTeamPerformanceMetrics(teamId: string, period: { start: Date; end: Date }) {
    const { data: team } = await supabase
      .from('advisor_teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (!team) return null;

    // Get team member performance
    const { data: performance } = await supabase
      .from('advisor_performance')
      .select('*')
      .gte('period_start', period.start.toISOString())
      .lte('period_end', period.end.toISOString());

    const { data: assignments } = await supabase
      .from('leads')
      .select('*')
      .gte('assigned_at', period.start.toISOString())
      .lte('assigned_at', period.end.toISOString());

    return {
      team,
      totalAssignments: assignments?.length || 0,
      averageConversionRate: performance?.reduce((sum, p) => sum + (p.conversion_rate || 0), 0) / (performance?.length || 1),
      averageResponseTime: performance?.reduce((sum, p) => sum + (p.response_time_avg || 0), 0) / (performance?.length || 1),
      memberCount: performance?.length || 0
    };
  }

  private static checkRegionMatch(country: string, teamRegion: string): boolean {
    const regionMap: Record<string, string[]> = {
      'North America': ['USA', 'Canada', 'Mexico'],
      'Europe': ['UK', 'Germany', 'France', 'Spain', 'Italy'],
      'Asia Pacific': ['Australia', 'New Zealand', 'Singapore', 'Japan'],
      'Global': []
    };

    return regionMap[teamRegion]?.includes(country) || false;
  }
}