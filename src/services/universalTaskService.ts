import { supabase } from "@/integrations/supabase/client";
import { UniversalTask, TaskFormData, TaskStatus, EntityOption } from "@/types/universalTask";

export class UniversalTaskService {
  // Fetch all tasks
  static async getTasks(filters?: {
    entity_type?: string;
    entity_id?: string;
    assigned_to?: string;
    status?: TaskStatus;
  }): Promise<UniversalTask[]> {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      
      if (filters?.entity_id) {
        query = query.eq('entity_id', filters.entity_id);
      }
      
      if (filters?.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }

      return (data || []) as UniversalTask[];
    } catch (error) {
      console.error('Error in getTasks:', error);
      return [];
    }
  }

  // Create new task
  static async createTask(taskData: TaskFormData): Promise<UniversalTask | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const taskToInsert = {
        ...taskData,
        user_id: user.id,
        status: 'pending' as TaskStatus,
        tags: taskData.tags || [],
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskToInsert])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }

      return data as UniversalTask;
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  }

  // Update task
  static async updateTask(id: string, updates: Partial<TaskFormData & { status?: TaskStatus }>): Promise<UniversalTask | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }

      return data as UniversalTask;
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  }

  // Delete task
  static async deleteTask(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  }

  // Get task statistics
  static async getTaskStats(): Promise<{
    total: number;
    pending: number;
    overdue: number;
    completed: number;
    by_priority: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('status, priority, due_date');

      if (error) {
        console.error('Error fetching task stats:', error);
        return { total: 0, pending: 0, overdue: 0, completed: 0, by_priority: {} };
      }

      const now = new Date();
      const stats = {
        total: data.length,
        pending: 0,
        overdue: 0,
        completed: 0,
        by_priority: {} as Record<string, number>,
      };

      data.forEach(task => {
        // Count by status
        if (task.status === 'pending' || task.status === 'in_progress') {
          stats.pending++;
          
          // Check if overdue
          if (task.due_date && new Date(task.due_date) < now) {
            stats.overdue++;
          }
        } else if (task.status === 'completed') {
          stats.completed++;
        }

        // Count by priority
        stats.by_priority[task.priority] = (stats.by_priority[task.priority] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error in getTaskStats:', error);
      return { total: 0, pending: 0, overdue: 0, completed: 0, by_priority: {} };
    }
  }

  // Search entities for task assignment
  static async searchEntities(query: string, entityType?: string): Promise<EntityOption[]> {
    try {
      const entities: EntityOption[] = [];

      // Search leads
      if (!entityType || entityType === 'lead') {
        const { data: leads } = await supabase
          .from('leads')
          .select('id, first_name, last_name, email')
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(10);

        if (leads) {
          entities.push(...leads.map(lead => ({
            id: lead.id,
            label: `${lead.first_name} ${lead.last_name} (${lead.email})`,
            type: 'lead' as const,
          })));
        }
      }

      // Search applicants
      if (!entityType || entityType === 'applicant') {
        const { data: applicants } = await supabase
          .from('applicants')
          .select(`
            id,
            master_record_id,
            program
          `)
          .limit(10);

        if (applicants) {
          // Get master record details for applicants
          const masterRecordIds = applicants.map(app => app.master_record_id);
          const { data: masterRecords } = await supabase
            .from('leads')
            .select('id, first_name, last_name, email')
            .in('id', masterRecordIds);

          if (masterRecords) {
            entities.push(...applicants.map(applicant => {
              const masterRecord = masterRecords.find(mr => mr.id === applicant.master_record_id);
              return {
                id: applicant.id,
                label: masterRecord 
                  ? `${masterRecord.first_name} ${masterRecord.last_name} - ${applicant.program}`
                  : `Applicant - ${applicant.program}`,
                type: 'applicant' as const,
              };
            }));
          }
        }
      }

      return entities.slice(0, 20); // Limit total results
    } catch (error) {
      console.error('Error searching entities:', error);
      return [];
    }
  }

  // Get team members for assignment
  static async getTeamMembers(): Promise<Array<{ id: string; name: string; email: string }>> {
    try {
      // Since we can't access auth.users directly, we'll need to implement a profiles table
      // For now, return the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      return [{
        id: user.id,
        name: user.email?.split('@')[0] || 'Current User',
        email: user.email || '',
      }];
    } catch (error) {
      console.error('Error getting team members:', error);
      return [];
    }
  }
}