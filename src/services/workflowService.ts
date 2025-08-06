import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DbWorkflow = Database['public']['Tables']['workflows']['Row'];
type DbWorkflowAction = Database['public']['Tables']['workflow_actions']['Row'];
type DbWorkflowExecution = Database['public']['Tables']['workflow_executions']['Row'];

export interface Workflow extends DbWorkflow {}
export interface WorkflowAction extends DbWorkflowAction {}
export interface WorkflowExecution extends DbWorkflowExecution {}

export type WorkflowInsert = Database['public']['Tables']['workflows']['Insert'];
export type WorkflowActionInsert = Database['public']['Tables']['workflow_actions']['Insert'];

export class WorkflowService {
  static async getWorkflows(): Promise<Workflow[]> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createWorkflow(workflowData: WorkflowInsert): Promise<Workflow> {
    const { data, error } = await supabase
      .from('workflows')
      .insert(workflowData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    const { data, error } = await supabase
      .from('workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteWorkflow(id: string): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getWorkflowActions(workflowId: string): Promise<WorkflowAction[]> {
    const { data, error } = await supabase
      .from('workflow_actions')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('order_index');

    if (error) throw error;
    return data || [];
  }

  static async getWorkflowExecutions(workflowId: string): Promise<WorkflowExecution[]> {
    const { data, error } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getWorkflowAnalytics() {
    const { data: workflows, error } = await supabase
      .from('workflows')
      .select(`
        *,
        workflow_executions(count)
      `);

    if (error) throw error;

    return {
      totalWorkflows: workflows?.length || 0,
      activeWorkflows: workflows?.filter(w => w.is_active).length || 0,
      totalExecutions: workflows?.reduce((sum, w) => sum + (w.workflow_executions?.length || 0), 0) || 0,
    };
  }
}