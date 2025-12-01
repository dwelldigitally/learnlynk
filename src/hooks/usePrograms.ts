import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Program {
  id: string;
  name: string;
  description?: string;
  type?: string;
  duration?: string;
  enrollment_status?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to fetch programs from the database
 */
export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('programs')
        .select('id, name, description, type, duration, enrollment_status, created_at, updated_at')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching programs:', error);
        throw error;
      }

      return (data || []) as Program[];
    },
  });
}

/**
 * Hook to fetch all programs (for public forms without auth)
 */
export function usePublicPrograms() {
  return useQuery({
    queryKey: ['public-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('id, name, description, type, duration, enrollment_status, created_at, updated_at')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching public programs:', error);
        throw error;
      }

      return (data || []) as Program[];
    },
  });
}
