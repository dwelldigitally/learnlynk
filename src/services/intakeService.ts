import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface IntakeData {
  id?: string;
  name: string;
  program_id: string;
  start_date: string;
  application_deadline?: string;
  capacity: number;
  sales_approach?: 'aggressive' | 'balanced' | 'neutral';
  status?: 'open' | 'closed' | 'full';
  delivery_method?: 'on-campus' | 'online' | 'hybrid';
  study_mode?: 'full-time' | 'part-time';
  campus?: string;
  user_id?: string;
}

export class IntakeService {
  /**
   * Get all intakes for a specific program
   */
  static async getIntakesByProgramId(programId: string) {
    const { data, error } = await supabase
      .from('intakes')
      .select('*')
      .eq('program_id', programId)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching intakes:', error);
      toast.error('Failed to fetch intakes');
      return [];
    }

    return data || [];
  }

  /**
   * Get all intakes for the current user
   */
  static async getAllIntakes() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First fetch intakes
    const { data: intakes, error: intakesError } = await supabase
      .from('intakes')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: true });

    if (intakesError) {
      console.error('Error fetching intakes:', intakesError);
      toast.error('Failed to fetch intakes');
      return [];
    }

    if (!intakes || intakes.length === 0) {
      return [];
    }

    // Get unique program IDs
    const programIds = [...new Set(intakes.map(intake => intake.program_id))];
    
    // Fetch programs separately
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .select('id, name, type, duration')
      .eq('user_id', user.id)
      .in('id', programIds);

    if (programsError) {
      console.error('Error fetching programs:', programsError);
      // Return intakes without program data if programs fetch fails
      return intakes.map(intake => ({
        ...intake,
        program_name: 'Unknown Program'
      }));
    }

    // Create program lookup map
    const programMap = new Map();
    programs?.forEach(program => {
      programMap.set(program.id, program);
    });

    // Combine intakes with program data
    return intakes.map(intake => {
      const program = programMap.get(intake.program_id);
      return {
        ...intake,
        program_name: program?.name || 'Unknown Program',
        program_type: program?.type || 'Unknown',
        program_duration: program?.duration || 'Unknown'
      };
    });
  }

  /**
   * Create a new intake
   */
  static async createIntake(intake: IntakeData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('intakes')
      .insert({
        ...intake,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating intake:', error);
      toast.error('Failed to create intake');
      throw error;
    }

    toast.success('Intake created successfully');
    return data;
  }

  /**
   * Update an intake
   */
  static async updateIntake(id: string, intake: Partial<IntakeData>) {
    const { data, error } = await supabase
      .from('intakes')
      .update(intake)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating intake:', error);
      toast.error('Failed to update intake');
      throw error;
    }

    toast.success('Intake updated successfully');
    return data;
  }

  /**
   * Delete an intake
   */
  static async deleteIntake(id: string) {
    const { error } = await supabase
      .from('intakes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting intake:', error);
      toast.error('Failed to delete intake');
      throw error;
    }

    toast.success('Intake deleted successfully');
  }

  /**
   * Update sales approach for an intake
   */
  static async updateSalesApproach(id: string, approach: 'aggressive' | 'balanced' | 'neutral') {
    const { error } = await supabase
      .from('intakes')
      .update({ sales_approach: approach })
      .eq('id', id);

    if (error) {
      console.error('Error updating sales approach:', error);
      toast.error('Failed to update sales approach');
      throw error;
    }

    toast.success(`Sales approach updated to ${approach}`);
  }
}