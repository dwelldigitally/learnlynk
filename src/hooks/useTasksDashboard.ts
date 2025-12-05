import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  lead_id?: string;
  entity_type?: string;
  entity_id?: string;
  assigned_to?: string;
  created_at: string;
  completed_at?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  overdue: number;
  dueToday: number;
  completed: number;
}

export function useTasksDashboard() {
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, pending: 0, overdue: 0, dueToday: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      // Fetch tasks from lead_tasks table (user's tasks)
      const { data: leadTasks, error: leadTasksError } = await supabase
        .from('lead_tasks')
        .select('*')
        .or(`user_id.eq.${user.id},assigned_to.eq.${user.id}`)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (leadTasksError) {
        console.error('Error fetching lead tasks:', leadTasksError);
      }

      // Fetch tasks from universal tasks table
      const { data: universalTasks, error: universalTasksError } = await supabase
        .from('tasks')
        .select('*')
        .or(`user_id.eq.${user.id},assigned_to.eq.${user.id}`)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (universalTasksError) {
        console.error('Error fetching universal tasks:', universalTasksError);
      }

      // Combine and normalize tasks
      const allTasks: DashboardTask[] = [];
      
      // Add lead tasks
      (leadTasks || []).forEach(task => {
        allTasks.push({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          priority: task.priority as DashboardTask['priority'] || 'medium',
          status: task.status as DashboardTask['status'] || 'pending',
          due_date: task.due_date || undefined,
          lead_id: task.lead_id || undefined,
          assigned_to: task.assigned_to || undefined,
          created_at: task.created_at,
          completed_at: task.completed_at || undefined
        });
      });

      // Add universal tasks
      (universalTasks || []).forEach(task => {
        allTasks.push({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          priority: task.priority as DashboardTask['priority'] || 'medium',
          status: task.status as DashboardTask['status'] || 'pending',
          due_date: task.due_date || undefined,
          entity_type: task.entity_type || undefined,
          entity_id: task.entity_id || undefined,
          assigned_to: task.assigned_to || undefined,
          created_at: task.created_at,
          completed_at: task.completed_at || undefined
        });
      });

      // Calculate stats
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const taskStats: TaskStats = {
        total: allTasks.length,
        pending: allTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
        overdue: allTasks.filter(t => {
          if (!t.due_date || t.status === 'completed' || t.status === 'cancelled') return false;
          return new Date(t.due_date) < now;
        }).length,
        dueToday: allTasks.filter(t => {
          if (!t.due_date || t.status === 'completed' || t.status === 'cancelled') return false;
          const dueDate = new Date(t.due_date);
          return dueDate >= todayStart && dueDate < todayEnd;
        }).length,
        completed: allTasks.filter(t => t.status === 'completed').length
      };

      setTasks(allTasks);
      setStats(taskStats);
      setError(null);
    } catch (err) {
      console.error('Error in useTasksDashboard:', err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const completeTask = useCallback(async (taskId: string, isLeadTask: boolean = true) => {
    try {
      const table = isLeadTask ? 'lead_tasks' : 'tasks';
      const { error } = await supabase
        .from(table)
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      
      await fetchTasks();
      return true;
    } catch (err) {
      console.error('Error completing task:', err);
      return false;
    }
  }, [fetchTasks]);

  return { tasks, stats, loading, error, refetch: fetchTasks, completeTask };
}
