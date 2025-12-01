import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export class ProgramService {
  /**
   * Get all programs for the current user
   */
  static async getPrograms() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching programs:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create a new program with all related data
   */
  static async createProgram(program: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Prepare the program data with proper JSONB field mapping
    const programData = {
      name: program.name,
      type: program.type,
      description: program.description,
      duration: program.duration,
      tuition: program.tuition || 0,
      next_intake: program.next_intake || null,
      enrollment_status: program.enrollment_status || 'open',
      requirements: program.requirements || [],
      // JSONB fields
      entry_requirements: program.entryRequirements || [],
      document_requirements: program.documentRequirements || [],
      fee_structure: program.feeStructure || {},
      custom_questions: program.customQuestions || [],
      courses: program.courses || [],
      journey_config: program.journeyConfiguration || {},
      practicum_config: program.practicum || null,
      metadata: {
        images: program.images || [],
        campus: program.campus || [],
        deliveryMethod: program.deliveryMethod || 'in-person',
        color: program.color || '#0ea5e9',
        status: program.status || 'draft',
        category: program.category || '',
        tags: program.tags || [],
        urlSlug: program.urlSlug || '',
        shortDescription: program.shortDescription || '',
        marketingCopy: program.marketingCopy || '',
        createdBy: user.id,
        ...program.metadata
      },
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('programs')
      .insert(programData)
      .select()
      .single();

    if (error) {
      console.error('Error creating program:', error);
      throw error;
    }

    // Save intakes to the intakes table
    if (program.intakes && program.intakes.length > 0) {
      await this.saveIntakes(data.id, program.intakes, user.id);
    }

    return data;
  }

  /**
   * Update a program with all related data
   */
  static async updateProgram(id: string, program: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Prepare the update data with proper JSONB field mapping
    const updateData: Record<string, any> = {
      name: program.name,
      type: program.type,
      description: program.description,
      duration: program.duration,
      tuition: program.tuition,
      next_intake: program.next_intake,
      enrollment_status: program.enrollment_status,
      requirements: program.requirements,
      // JSONB fields
      entry_requirements: program.entryRequirements || program.entry_requirements,
      document_requirements: program.documentRequirements || program.document_requirements,
      fee_structure: program.feeStructure || program.fee_structure,
      custom_questions: program.customQuestions || program.custom_questions,
      courses: program.courses,
      journey_config: program.journeyConfiguration || program.journey_config,
      practicum_config: program.practicum || program.practicum_config,
      metadata: {
        ...(program.metadata || {}),
        images: program.images || [],
        campus: program.campus || [],
        deliveryMethod: program.deliveryMethod,
        color: program.color,
        status: program.status,
        category: program.category,
        tags: program.tags || [],
        urlSlug: program.urlSlug,
        shortDescription: program.shortDescription,
        marketingCopy: program.marketingCopy
      }
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from('programs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating program:', error);
      throw error;
    }

    // Update intakes - delete existing and re-insert
    if (program.intakes) {
      await this.deleteIntakesByProgramId(id);
      if (program.intakes.length > 0) {
        await this.saveIntakes(id, program.intakes, user.id);
      }
    }

    return data;
  }

  /**
   * Save intakes to the intakes table
   */
  private static async saveIntakes(programId: string, intakes: any[], userId: string) {
    const intakeRecords = intakes.map((intake, index) => ({
      program_id: programId,
      user_id: userId,
      name: intake.name || `Intake ${index + 1}`,
      start_date: intake.date,
      capacity: intake.capacity || 30,
      application_deadline: intake.applicationDeadline || null,
      early_bird_deadline: intake.earlyBirdDeadline || null,
      status: intake.status || 'planning',
      study_mode: intake.studyMode || 'full-time',
      delivery_method: intake.deliveryMethod || 'in-class',
      campus_location: intake.campusLocation || intake.location || null,
      notes: intake.notes || null,
      metadata: {
        time: intake.time || null,
        waitlistCapacity: intake.waitlistCapacity || null,
        earlyBirdDiscount: intake.earlyBirdDiscount || null,
        notifications: intake.notifications || []
      }
    }));

    const { error } = await supabase
      .from('intakes')
      .insert(intakeRecords);

    if (error) {
      console.error('Error saving intakes:', error);
      throw error;
    }
  }

  /**
   * Delete all intakes for a program
   */
  private static async deleteIntakesByProgramId(programId: string) {
    const { error } = await supabase
      .from('intakes')
      .delete()
      .eq('program_id', programId);

    if (error) {
      console.error('Error deleting intakes:', error);
      // Don't throw - intakes might not exist yet
    }
  }

  /**
   * Delete a program
   */
  static async deleteProgram(id: string) {
    // Delete associated intakes first
    await this.deleteIntakesByProgramId(id);

    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }

  /**
   * Get journeys configured for a specific program
   */
  static async getProgramJourneys(programId: string) {
    const { data, error } = await supabase
      .from('academic_journeys')
      .select('*, journey_templates!inner(*)')
      .eq('program_id', programId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching program journeys:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Copy journey configuration from one program to another
   */
  static async copyJourneyFromProgram(
    sourceProgramId: string,
    targetProgramId: string,
    studentType?: 'domestic' | 'international' | 'both'
  ) {
    // Fetch source program's journeys
    const sourceJourneys = await this.getProgramJourneys(sourceProgramId);
    
    if (!sourceJourneys || sourceJourneys.length === 0) {
      throw new Error('Source program has no configured journeys');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Filter by student type if specified
    const journeysToCopy = studentType && studentType !== 'both'
      ? sourceJourneys.filter(j => j.journey_templates?.student_type === studentType)
      : sourceJourneys;

    // Copy each journey
    const copiedJourneys = await Promise.all(
      journeysToCopy.map(async (sourceJourney) => {
        const metadata = sourceJourney.metadata || {};
        const { data, error } = await supabase
          .from('academic_journeys')
          .insert({
            user_id: user.id,
            program_id: targetProgramId,
            template_id: sourceJourney.template_id,
            name: sourceJourney.name,
            description: sourceJourney.description,
            version: 1,
            is_active: true,
            metadata: {
              ...(typeof metadata === 'object' ? metadata : {}),
              copied_from_program: sourceProgramId,
              copied_at: new Date().toISOString()
            }
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      })
    );

    return copiedJourneys;
  }

  /**
   * Link a program to master journey templates
   */
  static async linkMasterJourney(
    programId: string,
    studentTypes: ('domestic' | 'international')[]
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get master templates
    const { data: masterTemplates, error: templateError } = await supabase
      .from('journey_templates')
      .select('*')
      .eq('is_master_template', true)
      .in('student_type', studentTypes);

    if (templateError) throw templateError;
    if (!masterTemplates || masterTemplates.length === 0) {
      throw new Error('No master templates found');
    }

    // Create journey instances linked to master templates
    const linkedJourneys = await Promise.all(
      masterTemplates.map(async (template) => {
        const { data, error } = await supabase
          .from('academic_journeys')
          .insert({
            user_id: user.id,
            program_id: programId,
            template_id: template.id,
            name: `${template.name} - Program Journey`,
            description: template.description,
            version: 1,
            is_active: true,
            metadata: {
              linked_to_master: true,
              student_type: template.student_type,
              linked_at: new Date().toISOString()
            }
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      })
    );

    return linkedJourneys;
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
