import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Intake {
  id: string;
  name: string;
  program_id: string;
  start_date: string;
  application_deadline?: string;
  capacity: number;
  status?: string;
  delivery_method?: string;
  study_mode?: string;
  campus?: string;
}

/**
 * Hook to fetch available intakes for student application
 */
export function useApplicationIntakes(programId?: string) {
  return useQuery({
    queryKey: ['application-intakes', programId],
    queryFn: async (): Promise<Intake[]> => {
      let query = supabase
        .from('intakes')
        .select(`
          id,
          name,
          program_id,
          start_date,
          application_deadline,
          capacity,
          status,
          delivery_method,
          study_mode,
          campus
        `)
        .eq('status', 'open')
        .gte('start_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true });

      if (programId) {
        query = query.eq('program_id', programId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching application intakes:', error);
        return [];
      }

      return data || [];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
}