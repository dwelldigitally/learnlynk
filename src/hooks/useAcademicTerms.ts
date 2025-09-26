import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AcademicTerm {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  term_type: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  registration_start_date?: string;
  registration_end_date?: string;
  add_drop_deadline?: string;
  withdrawal_deadline?: string;
  status: string;
  is_current?: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export function useAcademicTerms() {
  return useQuery({
    queryKey: ['academic-terms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_terms')
        .select('*')
        .order('academic_year', { ascending: false })
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as AcademicTerm[];
    },
  });
}

export function useCreateAcademicTerm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (term: Omit<AcademicTerm, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('academic_terms')
        .insert([{ ...term, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-terms'] });
      toast({
        title: 'Academic term created',
        description: 'The academic term has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create academic term: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}