import { supabase } from '@/integrations/supabase/client';

class ProgramRequirementsService {
  /**
   * Assign a requirement to a program
   */
  async assignRequirementToProgram(
    programId: string,
    requirementId: string,
    overrides?: {
      minimum_value_override?: string;
      maximum_value_override?: string;
      is_mandatory?: boolean;
      custom_verification_notes?: string;
    }
  ): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await (supabase as any)
      .from('program_requirements')
      .insert({
        program_id: programId,
        requirement_id: requirementId,
        user_id: user.id,
        ...overrides
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get all requirements for a program
   */
  async getRequirementsForProgram(programId: string): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('program_requirements')
      .select(`
        *,
        requirement:master_requirements(*)
      `)
      .eq('program_id', programId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Update a program requirement
   */
  async updateProgramRequirement(
    programRequirementId: string,
    updates: any
  ): Promise<void> {
    const { error } = await (supabase as any)
      .from('program_requirements')
      .update(updates)
      .eq('id', programRequirementId);

    if (error) throw error;
  }

  /**
   * Remove a requirement from a program
   */
  async removeRequirementFromProgram(
    programId: string,
    requirementId: string
  ): Promise<void> {
    const { error } = await (supabase as any)
      .from('program_requirements')
      .delete()
      .eq('program_id', programId)
      .eq('requirement_id', requirementId);

    if (error) throw error;
  }

  /**
   * Bulk assign requirements to a program
   */
  async bulkAssignRequirements(
    programId: string,
    requirementIds: string[]
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const inserts = requirementIds.map(reqId => ({
      program_id: programId,
      requirement_id: reqId,
      user_id: user.id
    }));

    const { error } = await (supabase as any)
      .from('program_requirements')
      .insert(inserts);

    if (error) throw error;
  }
}

export const programRequirementsService = new ProgramRequirementsService();
