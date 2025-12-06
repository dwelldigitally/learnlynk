import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { TeamGoal, GoalFormData, GoalStatus, GoalPriority } from '@/types/teamGoals';

interface UseTeamGoalsReturn {
  goals: TeamGoal[];
  loading: boolean;
  error: string | null;
  createGoal: (data: GoalFormData) => Promise<TeamGoal | null>;
  updateGoal: (id: string, data: Partial<TeamGoal>) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  refreshGoals: () => Promise<void>;
  updateGoalProgress: (id: string, newValue: number) => Promise<boolean>;
}

export function useTeamGoals(): UseTeamGoalsReturn {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<TeamGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('team_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Map database fields to TeamGoal interface
      const mappedGoals: TeamGoal[] = (data || []).map((goal: any) => ({
        id: goal.id,
        user_id: goal.user_id,
        goal_name: goal.goal_name,
        goal_type: goal.goal_type,
        goal_period: goal.goal_period,
        metric_type: goal.metric_type,
        target_value: Number(goal.target_value),
        current_value: Number(goal.current_value),
        unit: goal.unit || '',
        start_date: goal.start_date,
        end_date: goal.end_date,
        assignee_ids: goal.assignee_ids || [],
        assignee_names: goal.assignee_names || [],
        role_filter: goal.role_filter,
        priority: goal.priority as GoalPriority,
        status: goal.status as GoalStatus,
        description: goal.description,
        is_cascading: goal.is_cascading,
        parent_goal_id: goal.parent_goal_id,
        created_at: goal.created_at,
        updated_at: goal.updated_at,
        created_by: goal.created_by,
        metadata: goal.metadata,
      }));

      setGoals(mappedGoals);
    } catch (err: any) {
      console.error('Error fetching team goals:', err);
      setError(err.message);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = useCallback(async (data: GoalFormData): Promise<TeamGoal | null> => {
    if (!user) return null;

    try {
      // Calculate initial status based on dates
      const now = new Date();
      const startDate = new Date(data.start_date);
      const initialStatus: GoalStatus = startDate > now ? 'active' : 'on_track';

      const insertData = {
        user_id: user.id,
        goal_name: data.goal_name,
        goal_type: data.goal_type,
        goal_period: data.goal_period,
        metric_type: data.metric_type,
        target_value: data.target_value,
        current_value: 0,
        unit: getUnitForMetric(data.metric_type),
        start_date: data.start_date,
        end_date: data.end_date,
        assignee_ids: data.assignee_ids || [],
        role_filter: data.role_filter,
        priority: data.priority,
        status: initialStatus,
        description: data.description,
        is_cascading: data.is_cascading || false,
        created_by: user.id,
      };

      const { data: newGoal, error: insertError } = await supabase
        .from('team_goals')
        .insert(insertData)
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: 'Goal Created',
        description: `"${data.goal_name}" has been created successfully.`,
      });

      await fetchGoals();
      return newGoal as unknown as TeamGoal;
    } catch (err: any) {
      console.error('Error creating goal:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to create goal',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast, fetchGoals]);

  const updateGoal = useCallback(async (id: string, data: Partial<TeamGoal>): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('team_goals')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({
        title: 'Goal Updated',
        description: 'Goal has been updated successfully.',
      });

      await fetchGoals();
      return true;
    } catch (err: any) {
      console.error('Error updating goal:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update goal',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, fetchGoals]);

  const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('team_goals')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({
        title: 'Goal Deleted',
        description: 'Goal has been deleted successfully.',
      });

      await fetchGoals();
      return true;
    } catch (err: any) {
      console.error('Error deleting goal:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete goal',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, fetchGoals]);

  const updateGoalProgress = useCallback(async (id: string, newValue: number): Promise<boolean> => {
    try {
      const goal = goals.find(g => g.id === id);
      if (!goal) return false;

      // Calculate new status based on progress
      const newStatus = calculateGoalStatus(newValue, goal.target_value, goal.start_date, goal.end_date);

      const { error: updateError } = await supabase
        .from('team_goals')
        .update({
          current_value: newValue,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchGoals();
      return true;
    } catch (err: any) {
      console.error('Error updating goal progress:', err);
      return false;
    }
  }, [goals, fetchGoals]);

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals: fetchGoals,
    updateGoalProgress,
  };
}

// Helper function to get unit based on metric type
function getUnitForMetric(metricType: string): string {
  switch (metricType) {
    case 'revenue':
    case 'future_revenue':
    case 'contract_value':
      return '$';
    case 'calls':
      return 'calls';
    case 'emails':
      return 'emails';
    case 'activities':
      return 'activities';
    case 'conversions':
      return 'conversions';
    case 'response_time':
      return 'minutes';
    default:
      return '';
  }
}

// Calculate goal status based on progress
function calculateGoalStatus(
  currentValue: number,
  targetValue: number,
  startDate: string,
  endDate: string
): GoalStatus {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // If goal is achieved
  if (currentValue >= targetValue) {
    return 'achieved';
  }

  // If end date has passed
  if (now > end) {
    return 'off_track';
  }

  // If not started yet
  if (now < start) {
    return 'active';
  }

  // Calculate expected progress based on time elapsed
  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  const expectedProgress = (elapsed / totalDuration) * targetValue;
  const actualProgressRate = currentValue / expectedProgress;

  if (actualProgressRate >= 0.9) {
    return 'on_track';
  } else if (actualProgressRate >= 0.7) {
    return 'at_risk';
  } else {
    return 'off_track';
  }
}
