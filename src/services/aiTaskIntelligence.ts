import { supabase } from "@/integrations/supabase/client";
import { UniversalTask } from "@/types/universalTask";

export interface TaskIntelligence {
  confidence_score: number;
  reasoning: string;
  auto_executable: boolean;
  suggested_action: string;
  priority_adjustment: number;
  deadline_urgency: number;
  yield_impact: number;
}

export interface StudentEngagement {
  student_id: string;
  last_interaction: string;
  engagement_score: number;
  conversion_probability: number;
  next_best_action: string;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
}

export class AITaskIntelligenceService {
  
  static async analyzeLeadEngagement(leadId: string): Promise<StudentEngagement | null> {
    try {
      // Get lead data
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (!lead) return null;

      // Get recent communications separately
      const { data: communications } = await supabase
        .from('lead_communications')
        .select('*')
        .eq('lead_id', leadId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      const recentCommunications = communications || [];

      const engagementScore = this.calculateEngagementScore(lead, recentCommunications);
      const conversionProbability = this.calculateConversionProbability(lead, engagementScore);
      
      return {
        student_id: leadId,
        last_interaction: recentCommunications[0]?.created_at || lead.created_at,
        engagement_score: engagementScore,
        conversion_probability: conversionProbability,
        next_best_action: this.determineNextBestAction(lead, engagementScore, conversionProbability),
        urgency_level: this.calculateUrgencyLevel(lead, engagementScore)
      };
    } catch (error) {
      console.error('Error analyzing lead engagement:', error);
      return null;
    }
  }

  static async generateIntelligentTasks(userId: string): Promise<any[]> {
    try {
      // Get all assigned leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('assigned_to', userId)
        .in('status', ['new', 'contacted', 'qualified', 'nurturing']);

      if (!leads) return [];

      const intelligentTasks = [];

      for (const lead of leads) {
        const engagement = await this.analyzeLeadEngagement(lead.id);
        if (!engagement) continue;

        // Generate tasks based on engagement analysis
        const tasks = await this.generateTasksForLead(lead, engagement);
        intelligentTasks.push(...tasks);
      }

      return intelligentTasks.sort((a, b) => b.intelligence.confidence_score - a.intelligence.confidence_score);
    } catch (error) {
      console.error('Error generating intelligent tasks:', error);
      return [];
    }
  }

  private static async generateTasksForLead(lead: any, engagement: StudentEngagement): Promise<any[]> {
    const tasks = [];
    const daysSinceLastContact = Math.floor(
      (Date.now() - new Date(engagement.last_interaction).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Inactivity-based tasks
    if (daysSinceLastContact >= 3 && engagement.engagement_score < 0.3) {
      tasks.push({
        title: `Re-engage ${lead.first_name} ${lead.last_name} - ${daysSinceLastContact} days inactive`,
        description: `Student hasn't been contacted in ${daysSinceLastContact} days. Engagement score: ${Math.round(engagement.engagement_score * 100)}%`,
        category: 'follow_up',
        priority: engagement.urgency_level === 'critical' ? 'urgent' : 'high',
        entity_type: 'lead',
        entity_id: lead.id,
        intelligence: {
          confidence_score: 0.85,
          reasoning: `${daysSinceLastContact} days of inactivity requires immediate follow-up`,
          auto_executable: engagement.conversion_probability > 0.6,
          suggested_action: engagement.next_best_action,
          priority_adjustment: daysSinceLastContact * 0.1,
          deadline_urgency: this.calculateDeadlineUrgency(lead),
          yield_impact: engagement.conversion_probability
        }
      });
    }

    // High engagement tasks
    if (engagement.engagement_score > 0.7 && engagement.conversion_probability > 0.5) {
      tasks.push({
        title: `Strike while hot: Follow up with highly engaged ${lead.first_name}`,
        description: `High engagement detected (${Math.round(engagement.engagement_score * 100)}%). Conversion probability: ${Math.round(engagement.conversion_probability * 100)}%`,
        category: 'follow_up',
        priority: 'urgent',
        entity_type: 'lead',
        entity_id: lead.id,
        intelligence: {
          confidence_score: 0.92,
          reasoning: 'High engagement and conversion probability indicate immediate opportunity',
          auto_executable: true,
          suggested_action: 'Call within 1 hour',
          priority_adjustment: 0.5,
          deadline_urgency: this.calculateDeadlineUrgency(lead),
          yield_impact: engagement.conversion_probability
        }
      });
    }

    // Application deadline urgency
    const deadlineUrgency = this.calculateDeadlineUrgency(lead);
    if (deadlineUrgency > 0.7) {
      tasks.push({
        title: `Urgent: Application deadline approaching for ${lead.first_name}`,
        description: `Program application deadline is approaching. Immediate action required.`,
        category: 'administrative',
        priority: 'urgent',
        entity_type: 'lead',
        entity_id: lead.id,
        intelligence: {
          confidence_score: 0.88,
          reasoning: 'Application deadline creates time-sensitive opportunity',
          auto_executable: false,
          suggested_action: 'Schedule application assistance call',
          priority_adjustment: deadlineUrgency,
          deadline_urgency: deadlineUrgency,
          yield_impact: engagement.conversion_probability
        }
      });
    }

    return tasks;
  }

  private static calculateEngagementScore(lead: any, communications: any[]): number {
    let score = 0;
    
    // Base score from lead score
    score += (lead.lead_score || 0) / 100 * 0.3;
    
    // Communication frequency
    const commCount = communications.length;
    score += Math.min(commCount * 0.1, 0.4);
    
    // Recency bonus
    if (communications.length > 0) {
      const hoursSinceLastComm = (Date.now() - new Date(communications[0].created_at).getTime()) / (1000 * 60 * 60);
      score += hoursSinceLastComm < 24 ? 0.3 : hoursSinceLastComm < 72 ? 0.2 : 0.1;
    }
    
    return Math.min(score, 1);
  }

  private static calculateConversionProbability(lead: any, engagementScore: number): number {
    let probability = engagementScore * 0.4;
    
    // Status impact
    const statusBonus = {
      'qualified': 0.3,
      'contacted': 0.2,
      'nurturing': 0.15,
      'new': 0.1
    };
    probability += statusBonus[lead.status as keyof typeof statusBonus] || 0;
    
    // AI score impact
    if (lead.ai_score) {
      probability += lead.ai_score * 0.3;
    }
    
    return Math.min(probability, 1);
  }

  private static determineNextBestAction(lead: any, engagementScore: number, conversionProbability: number): string {
    if (conversionProbability > 0.7) return 'Call immediately';
    if (engagementScore > 0.6) return 'Send personalized email';
    if (conversionProbability > 0.4) return 'Schedule consultation call';
    return 'Send re-engagement sequence';
  }

  private static calculateUrgencyLevel(lead: any, engagementScore: number): 'low' | 'medium' | 'high' | 'critical' {
    const deadlineUrgency = this.calculateDeadlineUrgency(lead);
    
    if (deadlineUrgency > 0.8 || engagementScore > 0.8) return 'critical';
    if (deadlineUrgency > 0.6 || engagementScore > 0.6) return 'high';
    if (deadlineUrgency > 0.3 || engagementScore > 0.3) return 'medium';
    return 'low';
  }

  private static calculateDeadlineUrgency(lead: any): number {
    // Mock implementation - in real scenario, would check program application deadlines
    const programDeadlines = {
      'Computer Science': new Date('2024-12-15'),
      'Business Administration': new Date('2024-12-01'),
      'Engineering': new Date('2024-11-30')
    };
    
    const programInterest = lead.program_interest?.[0];
    const deadline = programDeadlines[programInterest as keyof typeof programDeadlines];
    
    if (!deadline) return 0;
    
    const daysUntilDeadline = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline <= 7) return 1;
    if (daysUntilDeadline <= 14) return 0.8;
    if (daysUntilDeadline <= 30) return 0.6;
    if (daysUntilDeadline <= 60) return 0.4;
    return 0.2;
  }

  static async executeConfidentTask(taskData: any): Promise<{ success: boolean; message: string }> {
    try {
      const { intelligence } = taskData;
      
      if (!intelligence.auto_executable || intelligence.confidence_score < 0.85) {
        return { success: false, message: 'Task not suitable for auto-execution' };
      }

      // Execute based on suggested action
      switch (intelligence.suggested_action) {
        case 'Call within 1 hour':
          return await this.scheduleUrgentCall(taskData);
        case 'Send personalized email':
          return await this.sendPersonalizedEmail(taskData);
        case 'Send re-engagement sequence':
          return await this.triggerReengagementSequence(taskData);
        default:
          return { success: false, message: 'Unknown action type' };
      }
    } catch (error) {
      console.error('Error executing confident task:', error);
      return { success: false, message: 'Execution failed' };
    }
  }

  private static async scheduleUrgentCall(taskData: any): Promise<{ success: boolean; message: string }> {
    // In real implementation, would integrate with calendar/CRM system
    console.log('Scheduling urgent call for task:', taskData.title);
    return { success: true, message: 'Urgent call scheduled successfully' };
  }

  private static async sendPersonalizedEmail(taskData: any): Promise<{ success: boolean; message: string }> {
    // In real implementation, would integrate with email system
    console.log('Sending personalized email for task:', taskData.title);
    return { success: true, message: 'Personalized email sent successfully' };
  }

  private static async triggerReengagementSequence(taskData: any): Promise<{ success: boolean; message: string }> {
    // In real implementation, would trigger email sequence
    console.log('Triggering re-engagement sequence for task:', taskData.title);
    return { success: true, message: 'Re-engagement sequence started successfully' };
  }
}