import { supabase } from '@/integrations/supabase/client';

export interface WorkflowEnrollment {
  id: string;
  workflow_id: string;
  lead_id: string;
  current_step_index: number;
  status: 'active' | 'completed' | 'paused' | 'exited';
  enrolled_at: string;
  completed_at?: string;
  exited_at?: string;
  exit_reason?: string;
  step_history?: any[];
  next_step_scheduled_at?: string;
  metadata?: Record<string, any>;
  user_id: string;
}

export interface StepExecution {
  id: string;
  enrollment_id: string;
  step_index: number;
  step_type: string;
  step_config: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  result?: Record<string, any>;
  error_message?: string;
}

export class WorkflowExecutionService {
  /**
   * Enroll a lead in a workflow
   */
  static async enrollLead(workflowId: string, leadId: string): Promise<WorkflowEnrollment | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if lead is already enrolled
    const { data: existing } = await (supabase
      .from('workflow_enrollments') as any)
      .select('*')
      .eq('workflow_id', workflowId)
      .eq('lead_id', leadId)
      .eq('status', 'active')
      .single();

    if (existing) {
      console.log('Lead already enrolled in this workflow');
      return existing as WorkflowEnrollment;
    }

    const { data, error } = await (supabase
      .from('workflow_enrollments') as any)
      .insert({
        workflow_id: workflowId,
        lead_id: leadId,
        current_step_index: 0,
        status: 'active',
        step_history: [],
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error enrolling lead:', error);
      throw error;
    }

    return data as WorkflowEnrollment;
  }

  /**
   * Get all enrollments for a workflow
   */
  static async getWorkflowEnrollments(workflowId: string): Promise<WorkflowEnrollment[]> {
    const { data, error } = await (supabase
      .from('workflow_enrollments') as any)
      .select('*')
      .eq('workflow_id', workflowId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }

    return (data || []) as WorkflowEnrollment[];
  }

  /**
   * Get enrollment status for a specific lead
   */
  static async getLeadEnrollments(leadId: string): Promise<WorkflowEnrollment[]> {
    const { data, error } = await (supabase
      .from('workflow_enrollments') as any)
      .select('*')
      .eq('lead_id', leadId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error fetching lead enrollments:', error);
      throw error;
    }

    return (data || []) as WorkflowEnrollment[];
  }

  /**
   * Advance lead to next step in workflow
   */
  static async advanceStep(enrollmentId: string, stepResult?: any): Promise<void> {
    const { data: enrollment, error: fetchError } = await (supabase
      .from('workflow_enrollments') as any)
      .select('*')
      .eq('id', enrollmentId)
      .single();

    if (fetchError || !enrollment) {
      console.error('Error fetching enrollment:', fetchError);
      throw fetchError || new Error('Enrollment not found');
    }

    const stepHistory = enrollment.step_history || [];
    stepHistory.push({
      step_index: enrollment.current_step_index,
      completed_at: new Date().toISOString(),
      result: stepResult
    });

    const { error: updateError } = await (supabase
      .from('workflow_enrollments') as any)
      .update({
        current_step_index: enrollment.current_step_index + 1,
        step_history: stepHistory
      })
      .eq('id', enrollmentId);

    if (updateError) {
      console.error('Error advancing step:', updateError);
      throw updateError;
    }
  }

  /**
   * Complete a workflow enrollment
   */
  static async completeEnrollment(enrollmentId: string): Promise<void> {
    const { error } = await (supabase
      .from('workflow_enrollments') as any)
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', enrollmentId);

    if (error) {
      console.error('Error completing enrollment:', error);
      throw error;
    }
  }

  /**
   * Exit a workflow enrollment with reason
   */
  static async exitEnrollment(enrollmentId: string, exitReason: string): Promise<void> {
    const { error } = await (supabase
      .from('workflow_enrollments') as any)
      .update({
        status: 'exited',
        exited_at: new Date().toISOString(),
        exit_reason: exitReason
      })
      .eq('id', enrollmentId);

    if (error) {
      console.error('Error exiting enrollment:', error);
      throw error;
    }
  }

  /**
   * Pause an enrollment
   */
  static async pauseEnrollment(enrollmentId: string): Promise<void> {
    const { error } = await (supabase
      .from('workflow_enrollments') as any)
      .update({ status: 'paused' })
      .eq('id', enrollmentId);

    if (error) {
      console.error('Error pausing enrollment:', error);
      throw error;
    }
  }

  /**
   * Resume a paused enrollment
   */
  static async resumeEnrollment(enrollmentId: string): Promise<void> {
    const { error } = await (supabase
      .from('workflow_enrollments') as any)
      .update({ status: 'active' })
      .eq('id', enrollmentId);

    if (error) {
      console.error('Error resuming enrollment:', error);
      throw error;
    }
  }

  /**
   * Log step execution
   */
  static async logStepExecution(
    enrollmentId: string,
    stepIndex: number,
    stepType: string,
    stepConfig: Record<string, any>,
    status: StepExecution['status'],
    result?: Record<string, any>,
    errorMessage?: string
  ): Promise<void> {
    const { error } = await (supabase
      .from('workflow_step_executions') as any)
      .insert({
        enrollment_id: enrollmentId,
        step_index: stepIndex,
        step_type: stepType,
        step_config: stepConfig,
        status,
        started_at: new Date().toISOString(),
        completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null,
        result,
        error_message: errorMessage
      });

    if (error) {
      console.error('Error logging step execution:', error);
    }
  }

  /**
   * Get step executions for an enrollment
   */
  static async getStepExecutions(enrollmentId: string): Promise<StepExecution[]> {
    const { data, error } = await (supabase
      .from('workflow_step_executions') as any)
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('step_index', { ascending: true });

    if (error) {
      console.error('Error fetching step executions:', error);
      return [];
    }

    return (data || []) as StepExecution[];
  }

  /**
   * Get workflow analytics
   */
  static async getWorkflowAnalytics(workflowId: string) {
    const { data: enrollments, error } = await (supabase
      .from('workflow_enrollments') as any)
      .select('*')
      .eq('workflow_id', workflowId);

    if (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }

    const total = enrollments?.length || 0;
    const active = enrollments?.filter((e: any) => e.status === 'active').length || 0;
    const completed = enrollments?.filter((e: any) => e.status === 'completed').length || 0;
    const exited = enrollments?.filter((e: any) => e.status === 'exited').length || 0;
    const paused = enrollments?.filter((e: any) => e.status === 'paused').length || 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Group by current step
    const stepDistribution: Record<number, number> = {};
    enrollments?.forEach((e: any) => {
      if (e.status === 'active') {
        stepDistribution[e.current_step_index] = (stepDistribution[e.current_step_index] || 0) + 1;
      }
    });

    return {
      totalEnrollments: total,
      activeEnrollments: active,
      completedEnrollments: completed,
      exitedEnrollments: exited,
      pausedEnrollments: paused,
      completionRate,
      stepDistribution
    };
  }

  /**
   * Execute workflow via edge function
   */
  static async executeWorkflow(
    workflowId: string,
    workflowConfig: any,
    options: {
      testMode?: boolean;
      leadIds?: string[];
    } = {}
  ): Promise<{ success: boolean; enrolledCount: number; results: any[] }> {
    const { data, error } = await supabase.functions.invoke('execute-workflow', {
      body: {
        workflowId,
        workflowConfig,
        testMode: options.testMode || false,
        leadIds: options.leadIds
      }
    });

    if (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }

    return data;
  }

  /**
   * Evaluate if a lead matches workflow trigger conditions
   */
  static evaluateTriggerConditions(lead: any, conditions: any[]): boolean {
    if (!conditions || conditions.length === 0) return true;

    return conditions.every(condition => {
      const leadValue = lead[condition.field];
      const conditionValue = condition.value;

      switch (condition.operator) {
        case 'equals':
        case 'is':
          return leadValue === conditionValue;
        case 'not_equals':
        case 'is_not':
          return leadValue !== conditionValue;
        case 'contains':
          return String(leadValue).toLowerCase().includes(String(conditionValue).toLowerCase());
        case 'not_contains':
          return !String(leadValue).toLowerCase().includes(String(conditionValue).toLowerCase());
        case 'greater_than':
          return Number(leadValue) > Number(conditionValue);
        case 'less_than':
          return Number(leadValue) < Number(conditionValue);
        case 'is_empty':
          return !leadValue || leadValue === '';
        case 'is_not_empty':
          return leadValue && leadValue !== '';
        case 'in':
          return Array.isArray(conditionValue) && conditionValue.includes(leadValue);
        default:
          return true;
      }
    });
  }

  /**
   * Get workflows that should trigger for a lead event
   */
  static async getMatchingWorkflows(triggerType: string, lead: any): Promise<any[]> {
    const { data: workflows, error } = await supabase
      .from('plays')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching workflows:', error);
      return [];
    }

    // Filter workflows whose conditions match the lead
    return (workflows || []).filter((workflow: any) => {
      const elements = workflow.elements || [];
      const triggerElement = elements.find((e: any) => e.type === 'trigger');
      if (!triggerElement) return false;

      const triggerConfig = triggerElement.config || {};
      if (triggerConfig.triggerEvent !== triggerType) return false;

      const conditions = triggerElement.conditionGroups?.[0]?.conditions || [];
      return this.evaluateTriggerConditions(lead, conditions);
    });
  }

  /**
   * Bulk enroll leads in a workflow
   */
  static async bulkEnrollLeads(workflowId: string, leadIds: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const leadId of leadIds) {
      try {
        await this.enrollLead(workflowId, leadId);
        success++;
      } catch (error) {
        console.error(`Failed to enroll lead ${leadId}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Update workflow execution stats
   */
  static async updateWorkflowStats(workflowId: string): Promise<void> {
    const analytics = await this.getWorkflowAnalytics(workflowId);

    const { error } = await supabase
      .from('plays')
      .update({
        execution_stats: {
          total_enrollments: analytics.totalEnrollments,
          active_enrollments: analytics.activeEnrollments,
          completed_enrollments: analytics.completedEnrollments,
          exited_enrollments: analytics.exitedEnrollments,
          completion_rate: analytics.completionRate,
          last_updated: new Date().toISOString()
        }
      })
      .eq('id', workflowId);

    if (error) {
      console.error('Error updating workflow stats:', error);
    }
  }
}
