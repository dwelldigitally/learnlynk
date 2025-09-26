import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ScheduleTemplate {
  id: string;
  user_id: string;
  template_name: string;
  description?: string;
  schedule_type: string;
  time_slots: any[];
  days_of_week: string[];
  duration_weeks?: number;
  max_capacity?: number;
  location_requirements?: string;
  is_template?: boolean;
  is_active?: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export function useScheduleTemplates() {
  return useQuery({
    queryKey: ['schedule-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_schedules')
        .select('*')
        .eq('is_template', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ScheduleTemplate[];
    },
  });
}

export function useCreateScheduleTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (schedule: Omit<ScheduleTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('academic_schedules')
        .insert([{ ...schedule, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-templates'] });
      toast({
        title: 'Schedule template created',
        description: 'The schedule template has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create schedule template: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}