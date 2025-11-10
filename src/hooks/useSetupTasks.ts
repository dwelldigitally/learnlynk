import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SetupTask, SetupTaskId, SetupTaskStatus } from '@/types/setup';
import { SETUP_TASKS } from '@/data/setupTasks';
import { toast } from 'sonner';

export const useSetupTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<SetupTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Initialize tasks for new user
  const initializeTasks = async () => {
    if (!user) return;

    try {
      // Create initial task records
      const taskRecords = SETUP_TASKS.map(taskDef => ({
        user_id: user.id,
        task_id: taskDef.id,
        status: 'not_started' as SetupTaskStatus
      }));

      const { error } = await supabase
        .from('setup_tasks')
        .upsert(taskRecords, { onConflict: 'user_id,task_id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error initializing setup tasks:', error);
    }
  };

  // Fetch user's setup tasks
  const fetchTasks = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('setup_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // If no tasks exist, initialize them
      if (!data || data.length === 0) {
        await initializeTasks();
        await fetchTasks(); // Refetch after initialization
        return;
      }

      setTasks(data as SetupTask[]);
      calculateProgress(data as SetupTask[]);
    } catch (error) {
      console.error('Error fetching setup tasks:', error);
      toast.error('Failed to load setup tasks');
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall progress
  const calculateProgress = (taskList: SetupTask[]) => {
    const totalTasks = SETUP_TASKS.length;
    const completedTasks = taskList.filter(
      t => t.status === 'completed' || t.status === 'skipped'
    ).length;
    
    const progressPercent = Math.round((completedTasks / totalTasks) * 100);
    setProgress(progressPercent);

    // Update profile progress
    if (user) {
      supabase
        .from('profiles')
        .update({ setup_progress: progressPercent })
        .eq('user_id', user.id)
        .then(() => {
          // If 100% complete, mark setup as complete
          if (progressPercent === 100) {
            supabase
              .from('profiles')
              .update({ setup_completed_at: new Date().toISOString() })
              .eq('user_id', user.id);
          }
        });
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: SetupTaskId, status: SetupTaskStatus) => {
    if (!user) return;

    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('setup_tasks')
        .update(updateData)
        .eq('user_id', user.id)
        .eq('task_id', taskId);

      if (error) throw error;

      // Refetch tasks to update state
      await fetchTasks();

      const taskDef = SETUP_TASKS.find(t => t.id === taskId);
      if (status === 'completed') {
        toast.success(`✓ ${taskDef?.title} completed!`);
      } else if (status === 'skipped') {
        toast.info(`${taskDef?.title} skipped`);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  // Mark task as complete
  const completeTask = (taskId: SetupTaskId) => {
    return updateTaskStatus(taskId, 'completed');
  };

  // Skip task
  const skipTask = (taskId: SetupTaskId) => {
    return updateTaskStatus(taskId, 'skipped');
  };

  // Mark task as in progress
  const startTask = (taskId: SetupTaskId) => {
    return updateTaskStatus(taskId, 'in_progress');
  };

  // Check if setup is complete
  const isSetupComplete = progress === 100;

  // Get required tasks that are incomplete
  const incompleteRequiredTasks = SETUP_TASKS.filter(taskDef => {
    const task = tasks.find(t => t.task_id === taskDef.id);
    return taskDef.required && task?.status !== 'completed';
  });

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    progress,
    isSetupComplete,
    incompleteRequiredTasks,
    completeTask,
    skipTask,
    startTask,
    refreshTasks: fetchTasks
  };
};
