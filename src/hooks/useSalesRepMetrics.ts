import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { startOfDay, endOfDay } from 'date-fns';

export interface DailyMetrics {
  callsMade: number;
  emailsSent: number;
  tasksCompleted: number;
  appointmentsBooked: number;
}

export interface MetricTargets {
  calls: number;
  emails: number;
  tasks: number;
  meetings: number;
}

export function useSalesRepMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DailyMetrics>({
    callsMade: 0,
    emailsSent: 0,
    tasksCompleted: 0,
    appointmentsBooked: 0
  });
  const [targets, setTargets] = useState<MetricTargets>({
    calls: 15,
    emails: 12,
    tasks: 8,
    meetings: 5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTodaysMetrics();
      loadUserTargets();
    }
  }, [user]);

  const loadTodaysMetrics = async () => {
    if (!user) return;

    const today = new Date();
    const startOfToday = startOfDay(today).toISOString();
    const endOfToday = endOfDay(today).toISOString();

    try {
      // Fetch calls made today
      const { count: callsCount } = await supabase
        .from('lead_communications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'phone')
        .eq('direction', 'outbound')
        .gte('communication_date', startOfToday)
        .lte('communication_date', endOfToday);

      // Fetch emails sent today
      const { count: emailsCount } = await supabase
        .from('lead_communications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'email')
        .eq('direction', 'outbound')
        .gte('communication_date', startOfToday)
        .lte('communication_date', endOfToday);

      // Fetch tasks completed today
      const { count: tasksCount } = await supabase
        .from('lead_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', startOfToday)
        .lte('completed_at', endOfToday);

      // Fetch meetings booked today
      const { count: meetingsCount } = await supabase
        .from('calendar_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfToday)
        .lte('created_at', endOfToday);

      setMetrics({
        callsMade: callsCount || 0,
        emailsSent: emailsCount || 0,
        tasksCompleted: tasksCount || 0,
        appointmentsBooked: meetingsCount || 0
      });
    } catch (error) {
      console.error('Error loading today\'s metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserTargets = async () => {
    if (!user) return;

    const today = new Date();

    try {
      const { data } = await supabase
        .from('sales_targets')
        .select('*')
        .eq('user_id', user.id)
        .eq('period_type', 'daily')
        .eq('is_active', true)
        .lte('period_start', today.toISOString().split('T')[0])
        .gte('period_end', today.toISOString().split('T')[0]);

      if (data && data.length > 0) {
        const newTargets = { ...targets };
        data.forEach((target: any) => {
          if (target.category === 'calls') newTargets.calls = Number(target.target_value);
          if (target.category === 'emails') newTargets.emails = Number(target.target_value);
          if (target.category === 'tasks') newTargets.tasks = Number(target.target_value);
          if (target.category === 'meetings') newTargets.meetings = Number(target.target_value);
        });
        setTargets(newTargets);
      }
    } catch (error) {
      console.error('Error loading user targets:', error);
    }
  };

  return { metrics, targets, loading, refresh: loadTodaysMetrics };
}
