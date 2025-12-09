import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface WorkingSchedule {
  days: string[];
  start_time: string;
  end_time: string;
}

export interface AdvisorRoutingSettings {
  id: string;
  advisor_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  routing_enabled: boolean;
  is_available: boolean;
  capacity_per_week: number;
  current_weekly_assignments: number;
  max_daily_assignments: number;
  performance_tier: string;
  working_schedule: WorkingSchedule;
  response_time_avg: number;
  conversion_rate: number;
  leads_assigned: number;
  leads_converted: number;
}

const defaultSchedule: WorkingSchedule = {
  days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  start_time: '09:00',
  end_time: '17:00'
};

function parseWorkingSchedule(json: Json | null | undefined): WorkingSchedule {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return defaultSchedule;
  }
  const obj = json as Record<string, unknown>;
  return {
    days: Array.isArray(obj.days) ? obj.days.filter((d): d is string => typeof d === 'string') : defaultSchedule.days,
    start_time: typeof obj.start_time === 'string' ? obj.start_time : defaultSchedule.start_time,
    end_time: typeof obj.end_time === 'string' ? obj.end_time : defaultSchedule.end_time
  };
}

export function useAdvisorRoutingSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchAdvisors = async (): Promise<AdvisorRoutingSettings[]> => {
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, email, avatar_url');

    if (profilesError) throw profilesError;
    if (!profiles || profiles.length === 0) return [];

    // Get advisor performance data
    const { data: performanceData, error: perfError } = await supabase
      .from('advisor_performance')
      .select('*');

    if (perfError) throw perfError;

    // Get current assignment counts from leads table
    const { data: assignmentCounts, error: countsError } = await supabase
      .from('leads')
      .select('assigned_to')
      .not('assigned_to', 'is', null);

    if (countsError) throw countsError;

    // Count assignments per advisor
    const countMap = new Map<string, number>();
    assignmentCounts?.forEach(lead => {
      const current = countMap.get(lead.assigned_to) || 0;
      countMap.set(lead.assigned_to, current + 1);
    });

    // Merge profile and performance data
    return profiles.map(profile => {
      const perf = performanceData?.find(p => p.advisor_id === profile.user_id);
      const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email || 'Unknown';

      return {
        id: perf?.id || profile.user_id,
        advisor_id: profile.user_id,
        name: fullName,
        email: profile.email || '',
        avatar_url: profile.avatar_url || undefined,
        routing_enabled: perf?.routing_enabled ?? true,
        is_available: perf?.is_available ?? true,
        capacity_per_week: perf?.capacity_per_week ?? 50,
        current_weekly_assignments: perf?.current_weekly_assignments ?? 0,
        max_daily_assignments: perf?.max_daily_assignments ?? 10,
        performance_tier: perf?.performance_tier || 'Standard',
        working_schedule: parseWorkingSchedule(perf?.working_schedule),
        response_time_avg: perf?.response_time_avg ?? 0,
        conversion_rate: perf?.conversion_rate ?? 0,
        leads_assigned: countMap.get(profile.user_id) || 0,
        leads_converted: perf?.leads_converted ?? 0
      };
    });
  };

  const query = useQuery({
    queryKey: ['advisor-routing-settings'],
    queryFn: fetchAdvisors
  });

  const updateSettings = useMutation({
    mutationFn: async (params: { 
      advisorId: string; 
      updates: Partial<{
        routing_enabled: boolean;
        is_available: boolean;
        capacity_per_week: number;
        max_daily_assignments: number;
        performance_tier: string;
        working_schedule: WorkingSchedule;
      }> 
    }) => {
      const { advisorId, updates } = params;

      // Convert WorkingSchedule to Json for database
      const dbUpdates: Record<string, unknown> = { ...updates };
      if (updates.working_schedule) {
        dbUpdates.working_schedule = updates.working_schedule as unknown as Json;
      }

      // Check if record exists
      const { data: existing } = await supabase
        .from('advisor_performance')
        .select('id')
        .eq('advisor_id', advisorId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('advisor_performance')
          .update({
            ...dbUpdates,
            updated_at: new Date().toISOString()
          })
          .eq('advisor_id', advisorId);

        if (error) throw error;
      } else {
        // Create new record with default period dates
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const insertData = {
          advisor_id: advisorId,
          period_start: periodStart,
          period_end: periodEnd,
          routing_enabled: updates.routing_enabled ?? true,
          is_available: updates.is_available ?? true,
          capacity_per_week: updates.capacity_per_week ?? 50,
          max_daily_assignments: updates.max_daily_assignments ?? 10,
          performance_tier: updates.performance_tier ?? 'Standard',
          working_schedule: (updates.working_schedule ?? defaultSchedule) as unknown as Json
        };

        const { error } = await supabase
          .from('advisor_performance')
          .insert(insertData);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-routing-settings'] });
      toast({
        title: 'Settings updated',
        description: 'Advisor routing settings have been saved.'
      });
    },
    onError: (error) => {
      console.error('Error updating advisor settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update advisor settings.',
        variant: 'destructive'
      });
    }
  });

  const toggleRoutingStatus = useMutation({
    mutationFn: async (params: { advisorId: string; enabled: boolean }) => {
      await updateSettings.mutateAsync({
        advisorId: params.advisorId,
        updates: { routing_enabled: params.enabled }
      });
    }
  });

  return {
    advisors: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateSettings: updateSettings.mutate,
    toggleRoutingStatus: toggleRoutingStatus.mutate,
    isUpdating: updateSettings.isPending
  };
}
