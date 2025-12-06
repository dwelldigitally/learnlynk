import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { TeamGoal, GoalAnalytics } from '@/types/teamGoals';

interface UseTeamGoalAnalyticsReturn {
  analytics: GoalAnalytics;
  loading: boolean;
  refreshAnalytics: () => Promise<void>;
}

const DEFAULT_ANALYTICS: GoalAnalytics = {
  totalGoals: 0,
  achievedGoals: 0,
  atRiskGoals: 0,
  onTrackGoals: 0,
  offTrackGoals: 0,
  overallAttainmentRate: 0,
  teamMetrics: {
    totalRevenue: 0,
    targetRevenue: 0,
    totalCalls: 0,
    targetCalls: 0,
    totalEmails: 0,
    targetEmails: 0,
    totalActivities: 0,
    targetActivities: 0,
    futureRevenue: 0,
    targetFutureRevenue: 0,
    contractValue: 0,
    targetContractValue: 0,
  },
  topPerformers: [],
  trends: [],
};

export function useTeamGoalAnalytics(goals: TeamGoal[]): UseTeamGoalAnalyticsReturn {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<GoalAnalytics>(DEFAULT_ANALYTICS);
  const [loading, setLoading] = useState(true);

  const calculateAnalytics = useCallback(async () => {
    if (!user) {
      setAnalytics(DEFAULT_ANALYTICS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Calculate goal status counts
      const totalGoals = goals.length;
      const achievedGoals = goals.filter(g => g.status === 'achieved').length;
      const atRiskGoals = goals.filter(g => g.status === 'at_risk').length;
      const onTrackGoals = goals.filter(g => g.status === 'on_track').length;
      const offTrackGoals = goals.filter(g => g.status === 'off_track').length;

      // Calculate overall attainment rate
      const overallAttainmentRate = totalGoals > 0
        ? Math.round((achievedGoals / totalGoals) * 100)
        : 0;

      // Get current month date range for metrics
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      // Fetch real metrics from database
      const [revenueResult, callsResult, emailsResult, activitiesResult] = await Promise.all([
        // Revenue from financial_records
        supabase
          .from('financial_records')
          .select('amount')
          .eq('status', 'paid')
          .gte('created_at', startOfMonth)
          .lte('created_at', endOfMonth),
        // Calls from lead_communications
        supabase
          .from('lead_communications')
          .select('id')
          .eq('type', 'phone')
          .eq('direction', 'outbound')
          .gte('created_at', startOfMonth)
          .lte('created_at', endOfMonth),
        // Emails from lead_communications
        supabase
          .from('lead_communications')
          .select('id')
          .eq('type', 'email')
          .eq('direction', 'outbound')
          .gte('created_at', startOfMonth)
          .lte('created_at', endOfMonth),
        // Activities from lead_tasks
        supabase
          .from('lead_tasks')
          .select('id')
          .eq('status', 'completed')
          .gte('created_at', startOfMonth)
          .lte('created_at', endOfMonth),
      ]);

      // Calculate totals
      const totalRevenue = (revenueResult.data || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
      const totalCalls = callsResult.data?.length || 0;
      const totalEmails = emailsResult.data?.length || 0;
      const totalActivities = activitiesResult.data?.length || 0;

      // Calculate targets from goals
      const revenueGoals = goals.filter(g => g.metric_type === 'revenue');
      const callGoals = goals.filter(g => g.metric_type === 'calls');
      const emailGoals = goals.filter(g => g.metric_type === 'emails');
      const activityGoals = goals.filter(g => g.metric_type === 'activities');
      const futureRevenueGoals = goals.filter(g => g.metric_type === 'future_revenue');
      const contractValueGoals = goals.filter(g => g.metric_type === 'contract_value');

      const targetRevenue = revenueGoals.reduce((sum, g) => sum + g.target_value, 0);
      const targetCalls = callGoals.reduce((sum, g) => sum + g.target_value, 0);
      const targetEmails = emailGoals.reduce((sum, g) => sum + g.target_value, 0);
      const targetActivities = activityGoals.reduce((sum, g) => sum + g.target_value, 0);
      const targetFutureRevenue = futureRevenueGoals.reduce((sum, g) => sum + g.target_value, 0);
      const targetContractValue = contractValueGoals.reduce((sum, g) => sum + g.target_value, 0);

      // Update goals' current_value with real metrics from database
      for (const goal of goals) {
        let newCurrentValue = goal.current_value;
        
        switch (goal.metric_type) {
          case 'revenue':
            newCurrentValue = totalRevenue;
            break;
          case 'calls':
            newCurrentValue = totalCalls;
            break;
          case 'emails':
            newCurrentValue = totalEmails;
            break;
          case 'activities':
            newCurrentValue = totalActivities;
            break;
        }
        
        // Update goal in database if current_value changed
        if (newCurrentValue !== goal.current_value) {
          await supabase
            .from('team_goals')
            .update({ current_value: newCurrentValue })
            .eq('id', goal.id);
        }
      }

      // Calculate top performers from individual goals
      const individualGoals = goals.filter(g => g.goal_type === 'individual' && g.assignee_ids?.length);
      const performerMap = new Map<string, { achieved: number; total: number; name: string }>();

      individualGoals.forEach(goal => {
        goal.assignee_ids?.forEach((userId, index) => {
          const existing = performerMap.get(userId) || { achieved: 0, total: 0, name: goal.assignee_names?.[index] || 'Unknown' };
          existing.total += 1;
          if (goal.status === 'achieved') {
            existing.achieved += 1;
          }
          performerMap.set(userId, existing);
        });
      });

      const topPerformers = Array.from(performerMap.entries())
        .map(([userId, data]) => ({
          userId,
          userName: data.name,
          attainmentRate: data.total > 0 ? Math.round((data.achieved / data.total) * 100) : 0,
          goalsAchieved: data.achieved,
        }))
        .sort((a, b) => b.attainmentRate - a.attainmentRate)
        .slice(0, 5);

      // Generate trends data (last 7 days)
      const trends = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Calculate cumulative progress for that day
        const dayValue = goals.reduce((sum, g) => {
          const progress = (g.current_value / g.target_value) * 100;
          return sum + Math.min(progress, 100);
        }, 0);
        
        trends.push({
          date: dateStr,
          value: Math.round(goals.length > 0 ? dayValue / goals.length : 0),
        });
      }

      setAnalytics({
        totalGoals,
        achievedGoals,
        atRiskGoals,
        onTrackGoals,
        offTrackGoals,
        overallAttainmentRate,
        teamMetrics: {
          totalRevenue,
          targetRevenue,
          totalCalls,
          targetCalls,
          totalEmails,
          targetEmails,
          totalActivities,
          targetActivities,
          futureRevenue: 0, // Would need specific tracking
          targetFutureRevenue,
          contractValue: 0, // Would need specific tracking
          targetContractValue,
        },
        topPerformers,
        trends,
      });
    } catch (err) {
      console.error('Error calculating analytics:', err);
      setAnalytics(DEFAULT_ANALYTICS);
    } finally {
      setLoading(false);
    }
  }, [user, goals]);

  useEffect(() => {
    calculateAnalytics();
  }, [calculateAnalytics]);

  return {
    analytics,
    loading,
    refreshAnalytics: calculateAnalytics,
  };
}
