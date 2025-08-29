import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Program {
  id: string;
  name: string;
  type: string;
  description?: string;
  duration?: string;
  enrollment_status?: string;
  next_intake?: string;
  metadata?: any;
}

/**
 * Hook to fetch active programs for student application
 */
export function useApplicationPrograms() {
  return useQuery({
    queryKey: ['application-programs'],
    queryFn: async (): Promise<Program[]> => {
      const { data, error } = await supabase
        .from('programs')
        .select('id, name, type, description, duration, enrollment_status, next_intake, metadata')
        .eq('enrollment_status', 'open')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching application programs:', error);
        return [];
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}