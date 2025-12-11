import { supabase } from '@/integrations/supabase/client';

export type AutomationType = 'workflow';
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
   * Get all automations (workflows only)
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
      return [];
    }

    // Normalize workflows
    return (workflows || []).map((w: any) => ({
      id: w.id,
      name: w.name,
      description: w.description,
      type: 'workflow' as AutomationType,
      status: w.is_active ? 'active' : 'paused',
      is_active: w.is_active,
      trigger_type: w.trigger_type,
      trigger_config: w.trigger_config,
      elements: w.trigger_config?.elements || [],
      enrollment_settings: w.enrollment_settings,
      execution_stats: w.execution_stats,
      created_at: w.created_at,
      updated_at: w.updated_at,
      user_id: w.user_id
    }));
  }

  /**
   * Get automation analytics
   */
  static async getAutomationAnalytics(automationId: string): Promise<AutomationAnalytics> {
    return this.getWorkflowAnalytics(automationId);
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

  /**
   * Toggle automation active state
   */
  static async toggleAutomation(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('plays')
      .update({ is_active: isActive })
      .eq('id', id);
    if (error) throw error;
  }

  /**
   * Delete automation
   */
  static async deleteAutomation(id: string): Promise<void> {
    const { error } = await supabase.from('plays').delete().eq('id', id);
    if (error) throw error;
  }

  /**
   * Execute automation
   */
  static async executeAutomation(
    id: string,
    options: { testMode?: boolean; leadIds?: string[] } = {}
  ): Promise<any> {
    const { data, error } = await supabase.functions.invoke('execute-workflow', {
      body: { workflowId: id, testMode: options.testMode, leadIds: options.leadIds }
    });
    if (error) throw error;
    return data;
  }

  /**
   * Re-enroll leads in automation
   */
  static async reEnrollLeads(
    automationId: string,
    leadIds: string[],
    options: { removeExisting?: boolean } = {}
  ): Promise<{ success: number; failed: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let success = 0;
    let failed = 0;

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
