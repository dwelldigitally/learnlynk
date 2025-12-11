import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpxygdaimdiarjpfmswl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweHlnZGFpbWRpYXJqcGZtc3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTY1MDcsImV4cCI6MjA2OTQ5MjUwN30.sR7gSV1I9CCtibU6sdk5FRH6r5m9Y1ZGrQ6ivRhNEcM';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface WorkflowEnrollment {
  id: string;
  workflow_id: string;
  lead_id: string;
  current_step: number;
  status: 'active' | 'completed' | 'paused' | 'exited';
  enrolled_at: string;
  completed_at?: string;
  exit_reason?: string;
  execution_data?: Record<string, any>;
  user_id: string;
}

export class WorkflowExecutionService {
  /**
   * Enroll a lead in a workflow
   */
  static async enrollLead(workflowId: string, leadId: string): Promise<WorkflowEnrollment | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if lead is already enrolled
    const { data: existing } = await supabase
      .from('workflow_enrollments' as any)
      .select('*')
      .eq('workflow_id', workflowId)
      .eq('lead_id', leadId)
      .eq('status', 'active')
      .single();

    if (existing) {
      console.log('Lead already enrolled in this workflow');
      return existing as WorkflowEnrollment;
    }

    const { data, error } = await supabase
      .from('workflow_enrollments' as any)
      .insert({
        workflow_id: workflowId,
        lead_id: leadId,
        current_step: 0,
        status: 'active',
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
   * Get all active enrollments for a workflow
   */
  static async getWorkflowEnrollments(workflowId: string): Promise<WorkflowEnrollment[]> {
    const { data, error } = await supabase
      .from('workflow_enrollments' as any)
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
    const { data, error } = await supabase
      .from('workflow_enrollments' as any)
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
  static async advanceStep(enrollmentId: string): Promise<void> {
    const { data: enrollment, error: fetchError } = await supabase
      .from('workflow_enrollments' as any)
      .select('*')
      .eq('id', enrollmentId)
      .single();

    if (fetchError || !enrollment) {
      console.error('Error fetching enrollment:', fetchError);
      throw fetchError || new Error('Enrollment not found');
    }

    const { error: updateError } = await supabase
      .from('workflow_enrollments' as any)
      .update({
        current_step: (enrollment as any).current_step + 1
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
  static async completeEnrollment(enrollmentId: string, exitReason?: string): Promise<void> {
    const { error } = await supabase
      .from('workflow_enrollments' as any)
      .update({
        status: exitReason ? 'exited' : 'completed',
        completed_at: new Date().toISOString(),
        exit_reason: exitReason
      })
      .eq('id', enrollmentId);

    if (error) {
      console.error('Error completing enrollment:', error);
      throw error;
    }
  }

  /**
   * Pause an enrollment
   */
  static async pauseEnrollment(enrollmentId: string): Promise<void> {
    const { error } = await supabase
      .from('workflow_enrollments' as any)
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
    const { error } = await supabase
      .from('workflow_enrollments' as any)
      .update({ status: 'active' })
      .eq('id', enrollmentId);

    if (error) {
      console.error('Error resuming enrollment:', error);
      throw error;
    }
  }

  /**
   * Get workflow analytics
   */
  static async getWorkflowAnalytics(workflowId: string) {
    const { data: enrollments, error } = await supabase
      .from('workflow_enrollments' as any)
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
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Group by current step
    const stepDistribution: Record<number, number> = {};
    enrollments?.forEach((e: any) => {
      if (e.status === 'active') {
        stepDistribution[e.current_step] = (stepDistribution[e.current_step] || 0) + 1;
      }
    });

    return {
      totalEnrollments: total,
      activeEnrollments: active,
      completedEnrollments: completed,
      exitedEnrollments: exited,
      completionRate,
      stepDistribution
    };
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
      .from('workflows')
      .select('*')
      .eq('is_active', true)
      .eq('trigger_type', triggerType);

    if (error) {
      console.error('Error fetching workflows:', error);
      return [];
    }

    // Filter workflows whose conditions match the lead
    return (workflows || []).filter((workflow: any) => {
      const triggerConfig = workflow.trigger_config;
      const conditions = triggerConfig?.conditionGroups?.[0]?.conditions || 
                        triggerConfig?.elements?.find((e: any) => e.type === 'trigger')?.conditionGroups?.[0]?.conditions || 
                        [];
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
}
