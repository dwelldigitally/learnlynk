import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export class ProgramService {
  /**
   * Get all programs for the current user
   */
  static async getPrograms() {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching programs:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create a new program
   */
  static async createProgram(program: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('programs')
      .insert({
        ...program,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating program:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update a program
   */
  static async updateProgram(id: string, program: any) {
    const { data, error } = await supabase
      .from('programs')
      .update(program)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating program:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a program
   */
  static async deleteProgram(id: string) {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }
}

/**
 * React hook to get programs with conditional demo data
 */
export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: () => ProgramService.getPrograms(),
    staleTime: 5 * 60 * 1000,
  });
}