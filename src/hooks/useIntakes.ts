import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Intake {
  id: string;
  name: string;
  program_id: string;
  program_name?: string;
  start_date: string;
  application_deadline?: string;
  capacity?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to fetch all intakes from the database
 */
export function useIntakes() {
  return useQuery({
    queryKey: ['intakes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch intakes
      const { data: intakes, error } = await supabase
        .from('intakes')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching intakes:', error);
        throw error;
      }

      // Fetch programs to get names
      const { data: programs } = await supabase
        .from('programs')
        .select('id, name')
        .eq('user_id', user.id);

      const programMap = new Map((programs || []).map(p => [p.id, p.name]));

      // Map program name from joined data
      return (intakes || []).map(intake => ({
        ...intake,
        program_name: programMap.get(intake.program_id) || 'Unknown Program'
      })) as Intake[];
    },
  });
}

/**
 * Hook to fetch intakes filtered by program ID
 */
export function useIntakesByProgram(programId: string | null) {
  return useQuery({
    queryKey: ['intakes', 'by-program', programId],
    queryFn: async () => {
      if (!programId) return [];

      const currentDate = new Date().toISOString();

      const { data, error } = await supabase
        .from('intakes')
        .select('*')
        .eq('program_id', programId)
        .eq('status', 'open')
        .gte('start_date', currentDate)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching intakes by program:', error);
        throw error;
      }

      return (data || []) as Intake[];
    },
    enabled: !!programId,
  });
}

/**
 * Hook to fetch intakes filtered by program name (for components using program names)
 */
export function useIntakesByProgramName(programName: string | null) {
  return useQuery({
    queryKey: ['intakes', 'by-program-name', programName],
    queryFn: async () => {
      if (!programName) return [];

      // First get the program ID by name
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .select('id')
        .eq('name', programName)
        .maybeSingle();

      if (programError) {
        console.error('Error finding program:', programError);
        return [];
      }

      if (!programData) {
        return [];
      }

      const currentDate = new Date().toISOString();

      const { data, error } = await supabase
        .from('intakes')
        .select('*')
        .eq('program_id', programData.id)
        .eq('status', 'open')
        .gte('start_date', currentDate)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching intakes by program name:', error);
        throw error;
      }

      return (data || []).map(intake => ({
        ...intake,
        program_name: programName
      })) as Intake[];
    },
    enabled: !!programName,
  });
}

/**
 * Hook to fetch future open intakes (for public forms)
 */
export function usePublicIntakesByProgramName(programName: string | null) {
  return useQuery({
    queryKey: ['public-intakes', 'by-program-name', programName],
    queryFn: async () => {
      if (!programName) return [];

      // First get the program ID by name
      const { data: programData, error: programError } = await supabase
        .from('programs')
        .select('id')
        .eq('name', programName)
        .maybeSingle();

      if (programError) {
        console.error('Error finding program:', programError);
        return [];
      }

      if (!programData) {
        return [];
      }

      const currentDate = new Date().toISOString();

      const { data, error } = await supabase
        .from('intakes')
        .select('id, name, start_date, capacity, status')
        .eq('program_id', programData.id)
        .eq('status', 'open')
        .gte('start_date', currentDate)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching public intakes:', error);
        throw error;
      }

      return (data || []) as Intake[];
    },
    enabled: !!programName,
  });
}
