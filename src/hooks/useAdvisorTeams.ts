import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AdvisorTeam } from '@/types/routing';

export function useAdvisorTeams() {
  return useQuery({
    queryKey: ['advisor-teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advisor_teams')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as AdvisorTeam[];
    },
  });
}

export function useCreateAdvisorTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (team: Omit<AdvisorTeam, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('advisor_teams')
        .insert({
          name: team.name,
          description: team.description,
          is_active: team.is_active,
          max_daily_assignments: team.max_daily_assignments,
          region: team.region,
          specializations: team.specializations,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-teams'] });
    },
  });
}

export function useUpdateAdvisorTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AdvisorTeam> & { id: string }) => {
      const { data, error } = await supabase
        .from('advisor_teams')
        .update({
          name: updates.name,
          description: updates.description,
          is_active: updates.is_active,
          max_daily_assignments: updates.max_daily_assignments,
          region: updates.region,
          specializations: updates.specializations,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-teams'] });
    },
  });
}

export function useDeleteAdvisorTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('advisor_teams')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-teams'] });
    },
  });
}

export function useToggleAdvisorTeamStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('advisor_teams')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-teams'] });
    },
  });
}
