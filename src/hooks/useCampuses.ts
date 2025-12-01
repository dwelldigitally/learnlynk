import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Campus = Database['public']['Tables']['master_campuses']['Row'];

// Hook to fetch all campuses for authenticated users
export function useCampuses() {
  return useQuery({
    queryKey: ['campuses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('master_campuses')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return (data || []) as Campus[];
    },
  });
}

// Hook to fetch only active campuses
export function useActiveCampuses() {
  return useQuery({
    queryKey: ['campuses', 'active'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('master_campuses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data || []) as Campus[];
    },
  });
}

// Hook to fetch campuses for public forms (no auth required)
export function usePublicCampuses() {
  return useQuery({
    queryKey: ['campuses', 'public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_campuses')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data || []) as Campus[];
    },
  });
}
