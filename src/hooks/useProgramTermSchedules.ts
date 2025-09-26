import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProgramTermSchedule {
  id: string;
  user_id: string;
  program_id?: string;
  term_id: string;
  schedule_id: string;
  capacity_limit?: number;
  enrollment_count?: number;
  prerequisites?: any[];
  special_requirements?: string;
  instructor_assigned?: string;
  classroom_location?: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useProgramTermSchedules() {
  return useQuery({
    queryKey: ['program-term-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('program_term_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProgramTermSchedule[];
    },
  });
}

export function useCreateProgramTermSchedule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (schedule: Omit<ProgramTermSchedule, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('program_term_schedules')
        .insert([{ ...schedule, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program-term-schedules'] });
      toast({
        title: 'Program schedule created',
        description: 'The program schedule has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create program schedule: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}