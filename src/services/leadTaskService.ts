import { supabase } from '@/integrations/supabase/client';
import { LeadTask, TaskFormData, TaskStatus } from '@/types/leadEnhancements';
import { DummyLeadDataService } from './dummyLeadDataService';

export class LeadTaskService {
  static async getTasks(leadId: string): Promise<LeadTask[]> {
    try {
      const { data, error } = await supabase
        .from('lead_tasks')
        .select('*')
        .eq('lead_id', leadId)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching tasks:', error);
        // Return dummy data if database fetch fails
        return DummyLeadDataService.generateDummyTasks(leadId);
      }

      // If no data found, return dummy data for demonstration
      if (!data || data.length === 0) {
        return DummyLeadDataService.generateDummyTasks(leadId);
      }

      return data as LeadTask[];
    } catch (error) {
      console.error('Database connection error:', error);
      return DummyLeadDataService.generateDummyTasks(leadId);
    }
  }

  static async createTask(leadId: string, taskData: TaskFormData): Promise<LeadTask> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('lead_tasks')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        assigned_to: taskData.assigned_to || user.id,
        ...taskData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }

    return data as LeadTask;
  }

  static async updateTask(id: string, updates: Partial<TaskFormData & { status?: TaskStatus }>): Promise<LeadTask> {
    const updateData: any = { ...updates };
    
    // Set completed_at when marking as completed
    if (updates.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    } else if (updates.status && ['pending', 'in_progress', 'cancelled'].includes(updates.status)) {
      updateData.completed_at = null;
    }

    const { data, error } = await supabase
      .from('lead_tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }

    return data as LeadTask;
  }

  static async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('lead_tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }

  static async getTaskStats(leadId?: string): Promise<{
    total: number;
    pending: number;
    overdue: number;
    completed: number;
    by_priority: Record<string, number>;
  }> {
    let query = supabase
      .from('lead_tasks')
      .select('status, priority, due_date');
    
    if (leadId) {
      query = query.eq('lead_id', leadId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching task stats:', error);
      return { total: 0, pending: 0, overdue: 0, completed: 0, by_priority: {} };
    }

    const total = data.length;
    const pending = data.filter(task => task.status === 'pending').length;
    const completed = data.filter(task => task.status === 'completed').length;
    
    const now = new Date();
    const overdue = data.filter(task => 
      task.status !== 'completed' && 
      task.due_date && 
      new Date(task.due_date) < now
    ).length;

    const by_priority = data.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, pending, overdue, completed, by_priority };
  }

  static async getUpcomingTasks(limit: number = 10): Promise<LeadTask[]> {
    const { data, error } = await supabase
      .from('lead_tasks')
      .select('*')
      .in('status', ['pending', 'in_progress'])
      .not('due_date', 'is', null)
      .gte('due_date', new Date().toISOString())
      .order('due_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming tasks:', error);
      return [];
    }

    return (data || []) as LeadTask[];
  }

  static async getOverdueTasks(): Promise<LeadTask[]> {
    const { data, error } = await supabase
      .from('lead_tasks')
      .select('*')
      .in('status', ['pending', 'in_progress'])
      .not('due_date', 'is', null)
      .lt('due_date', new Date().toISOString())
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching overdue tasks:', error);
      return [];
    }

    return (data || []) as LeadTask[];
  }
}