import { supabase } from '@/integrations/supabase/client';

export type AutomationType = 'workflow' | 'campaign';
export type AutomationStatus = 'active' | 'paused' | 'draft' | 'completed';

export interface Automation {
  id: string;
  name: string;
  description?: string;
  type: AutomationType;
  status: AutomationStatus;
  is_active: boolean;
  trigger_type?: string;
  trigger_config?: any;
  elements?: any[];
  campaign_type?: string;
  workflow_config?: any;
  target_audience?: any;
  enrollment_settings?: any;
  execution_stats?: {
    total_enrollments?: number;
    active_enrollments?: number;
    completed_enrollments?: number;
    exited_enrollments?: number;
    completion_rate?: number;
    total_executions?: number;
    success_rate?: number;
  };
  created_at: string;
  updated_at?: string;
  user_id: string;
}

export interface AutomationAnalytics {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  exitedEnrollments: number;
  completionRate: number;
  totalExecutions: number;
  successRate: number;
  stepDistribution: Record<number, number>;
  recentActivity: any[];
  enrolledLeads: any[];
}

export class AutomationService {
  /**
   * Get all automations (workflows + campaigns)
   */
  static async getAutomations(): Promise<Automation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Fetch workflows from plays table
    const { data: workflows, error: workflowError } = await supabase
      .from('plays')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (workflowError) {
      console.error('Error fetching workflows:', workflowError);
    }

    // Fetch campaigns
    const { data: campaigns, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (campaignError) {
      console.error('Error fetching campaigns:', campaignError);
    }

    // Normalize workflows
    const normalizedWorkflows: Automation[] = (workflows || []).map((w: any) => ({
      id: w.id,
      name: w.name,
      description: w.description,
      type: 'workflow' as AutomationType,
      status: w.is_active ? 'active' : 'paused',
      is_active: w.is_active,
      trigger_type: w.trigger_type,
      trigger_config: w.trigger_config,
      elements: w.elements,
      enrollment_settings: w.enrollment_settings,
      execution_stats: w.execution_stats,
      created_at: w.created_at,
      updated_at: w.updated_at,
      user_id: w.user_id
    }));

    // Normalize campaigns
    const normalizedCampaigns: Automation[] = (campaigns || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      type: 'campaign' as AutomationType,
      status: c.status as AutomationStatus,
      is_active: c.status === 'active',
      campaign_type: c.campaign_type,
      workflow_config: c.workflow_config,
      target_audience: c.target_audience,
      execution_stats: {
        total_executions: c.total_executions || 0,
        success_rate: 0
      },
      created_at: c.created_at,
      updated_at: c.updated_at,
      user_id: c.user_id
    }));

    return [...normalizedWorkflows, ...normalizedCampaigns].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  /**
   * Get automation analytics
   */
  static async getAutomationAnalytics(automationId: string, type: AutomationType): Promise<AutomationAnalytics> {
    if (type === 'workflow') {
      return this.getWorkflowAnalytics(automationId);
    } else {
      return this.getCampaignAnalytics(automationId);
    }
  }

  private static async getWorkflowAnalytics(workflowId: string): Promise<AutomationAnalytics> {
    const { data: enrollments, error } = await (supabase
      .from('workflow_enrollments') as any)
      .select('*, leads(first_name, last_name, email)')
      .eq('workflow_id', workflowId);

    if (error) {
      console.error('Error fetching workflow analytics:', error);
    }

    const total = enrollments?.length || 0;
    const active = enrollments?.filter((e: any) => e.status === 'active').length || 0;
    const completed = enrollments?.filter((e: any) => e.status === 'completed').length || 0;
    const exited = enrollments?.filter((e: any) => e.status === 'exited').length || 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const stepDistribution: Record<number, number> = {};
    enrollments?.forEach((e: any) => {
      if (e.status === 'active') {
        stepDistribution[e.current_step_index] = (stepDistribution[e.current_step_index] || 0) + 1;
      }
    });

    // Get recent activity from step executions
    const { data: recentSteps } = await (supabase
      .from('workflow_step_executions') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      totalEnrollments: total,
      activeEnrollments: active,
      completedEnrollments: completed,
      exitedEnrollments: exited,
      completionRate,
      totalExecutions: total,
      successRate: completionRate,
      stepDistribution,
      recentActivity: recentSteps || [],
      enrolledLeads: enrollments?.map((e: any) => ({
        id: e.lead_id,
        name: e.leads ? `${e.leads.first_name || ''} ${e.leads.last_name || ''}`.trim() : 'Unknown',
        email: e.leads?.email || '',
        status: e.status,
        currentStep: e.current_step_index,
        enrolledAt: e.enrolled_at
      })) || []
    };
  }

  private static async getCampaignAnalytics(campaignId: string): Promise<AutomationAnalytics> {
    const { data: executions, error } = await supabase
      .from('campaign_executions')
      .select('*, leads(first_name, last_name, email)')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaign analytics:', error);
    }

    const total = executions?.length || 0;
    const completed = executions?.filter((e: any) => e.status === 'completed').length || 0;
    const failed = executions?.filter((e: any) => e.status === 'failed').length || 0;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalEnrollments: total,
      activeEnrollments: executions?.filter((e: any) => e.status === 'running').length || 0,
      completedEnrollments: completed,
      exitedEnrollments: failed,
      completionRate: successRate,
      totalExecutions: total,
      successRate,
      stepDistribution: {},
      recentActivity: (executions || []).slice(0, 10),
      enrolledLeads: executions?.map((e: any) => ({
        id: e.lead_id,
        name: e.leads ? `${e.leads.first_name || ''} ${e.leads.last_name || ''}`.trim() : 'Unknown',
        email: e.leads?.email || '',
        status: e.status,
        executedAt: e.started_at
      })) || []
    };
  }

  /**
   * Toggle automation active state
   */
  static async toggleAutomation(id: string, type: AutomationType, isActive: boolean): Promise<void> {
    if (type === 'workflow') {
      const { error } = await supabase
        .from('plays')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: isActive ? 'active' : 'paused' })
        .eq('id', id);
      if (error) throw error;
    }
  }

  /**
   * Delete automation
   */
  static async deleteAutomation(id: string, type: AutomationType): Promise<void> {
    if (type === 'workflow') {
      const { error } = await supabase.from('plays').delete().eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) throw error;
    }
  }

  /**
   * Execute automation
   */
  static async executeAutomation(
    id: string,
    type: AutomationType,
    options: { testMode?: boolean; leadIds?: string[] } = {}
  ): Promise<any> {
    if (type === 'workflow') {
      const { data, error } = await supabase.functions.invoke('execute-workflow', {
        body: { workflowId: id, testMode: options.testMode, leadIds: options.leadIds }
      });
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.functions.invoke('execute-campaign', {
        body: { campaignId: id, testMode: options.testMode }
      });
      if (error) throw error;
      return data;
    }
  }

  /**
   * Re-enroll leads in automation
   */
  static async reEnrollLeads(
    automationId: string,
    type: AutomationType,
    leadIds: string[],
    options: { removeExisting?: boolean } = {}
  ): Promise<{ success: number; failed: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let success = 0;
    let failed = 0;

    if (type === 'workflow') {
      // Remove existing enrollments if requested
      if (options.removeExisting) {
        await (supabase.from('workflow_enrollments') as any)
          .delete()
          .eq('workflow_id', automationId)
          .in('lead_id', leadIds);
      }

      // Enroll each lead
      for (const leadId of leadIds) {
        const { error } = await (supabase.from('workflow_enrollments') as any)
          .insert({
            workflow_id: automationId,
            lead_id: leadId,
            current_step_index: 0,
            status: 'active',
            step_history: [],
            user_id: user.id
          });

        if (error) {
          console.error(`Failed to enroll lead ${leadId}:`, error);
          failed++;
        } else {
          success++;
        }
      }
    } else {
      // For campaigns, create execution records
      for (const leadId of leadIds) {
        const { error } = await supabase
          .from('campaign_executions')
          .insert({
            campaign_id: automationId,
            lead_id: leadId,
            status: 'pending'
          });

        if (error) {
          console.error(`Failed to enroll lead ${leadId}:`, error);
          failed++;
        } else {
          success++;
        }
      }
    }

    return { success, failed };
  }

  /**
   * Get summary stats for dashboard
   */
  static async getSummaryStats(): Promise<{
    totalAutomations: number;
    activeAutomations: number;
    totalEnrollments: number;
    avgCompletionRate: number;
  }> {
    const automations = await this.getAutomations();
    
    const totalAutomations = automations.length;
    const activeAutomations = automations.filter(a => a.is_active).length;
    
    let totalEnrollments = 0;
    let totalCompletionRate = 0;
    let ratedCount = 0;

    for (const automation of automations) {
      if (automation.execution_stats) {
        totalEnrollments += automation.execution_stats.total_enrollments || automation.execution_stats.total_executions || 0;
        if (automation.execution_stats.completion_rate !== undefined) {
          totalCompletionRate += automation.execution_stats.completion_rate;
          ratedCount++;
        }
      }
    }

    return {
      totalAutomations,
      activeAutomations,
      totalEnrollments,
      avgCompletionRate: ratedCount > 0 ? Math.round(totalCompletionRate / ratedCount) : 0
    };
  }
}
