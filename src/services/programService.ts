import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { AcademicJourneyService } from './academicJourneyService';

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

    console.log('🔵 ProgramService.createProgram - Input program:', program);
    console.log('🔵 ProgramService.createProgram - Input feeStructure:', program.feeStructure);

    // Parse fields with proper fallbacks (prefer camelCase from UI)
    const entryRequirements = program.entryRequirements ?? program.entry_requirements ?? [];
    const documentRequirements = program.documentRequirements ?? program.document_requirements ?? [];
    const feeStructure = program.feeStructure ?? program.fee_structure ?? { domesticFees: [], internationalFees: [], paymentPlans: [], scholarships: [] };
    const customQuestions = program.customQuestions ?? program.custom_questions ?? [];
    const courses = program.courses ?? [];
    const journeyConfig = program.journeyConfiguration ?? program.journey_config ?? {};
    const practicumConfig = program.practicumConfig ?? program.practicum ?? {};

    console.log('🔵 ProgramService.createProgram - Parsed feeStructure:', feeStructure);
    console.log('🔵 ProgramService.createProgram - Domestic fees count:', feeStructure?.domesticFees?.length);
    console.log('🔵 ProgramService.createProgram - International fees count:', feeStructure?.internationalFees?.length);

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
      // JSONB fields - use parsed values
      entry_requirements: entryRequirements,
      document_requirements: documentRequirements,
      fee_structure: feeStructure,
      custom_questions: customQuestions,
      courses: courses,
      journey_config: journeyConfig,
      practicum_config: practicumConfig,
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

    console.log('🔵 ProgramService.createProgram - Final programData:', programData);
    console.log('🔵 ProgramService.createProgram - Final fee_structure in programData:', programData.fee_structure);

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

    // Create academic journeys based on journey configuration
    if (journeyConfig && Object.keys(journeyConfig).length > 0) {
      await this.createProgramJourneys(data.id, journeyConfig, user.id);
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

    console.log('🔵 ProgramService.updateProgram - Input program:', program);
    console.log('🔵 ProgramService.updateProgram - Input feeStructure:', JSON.stringify(program.feeStructure, null, 2));

    // Prepare the update data with proper JSONB field mapping
    // Always prefer camelCase (from UI) over snake_case (from DB)
    const entryRequirements = program.entryRequirements ?? program.entry_requirements ?? [];
    const documentRequirements = program.documentRequirements ?? program.document_requirements ?? [];
    const feeStructure = program.feeStructure ?? program.fee_structure ?? { domesticFees: [], internationalFees: [], paymentPlans: [], scholarships: [] };
    const customQuestions = program.customQuestions ?? program.custom_questions ?? [];
    const courses = program.courses ?? [];
    const journeyConfig = program.journeyConfiguration ?? program.journey_config ?? {};
    const practicumConfig = program.practicumConfig ?? program.practicum ?? program.practicum_config ?? {};

    console.log('🔵 ProgramService.updateProgram - Parsed feeStructure:', JSON.stringify(feeStructure, null, 2));
    console.log('🔵 ProgramService.updateProgram - Domestic fees count:', feeStructure?.domesticFees?.length);
    console.log('🔵 ProgramService.updateProgram - International fees count:', feeStructure?.internationalFees?.length);

    // Calculate total tuition from fee structure for backward compatibility with legacy tuition column
    const totalDomesticTuition = feeStructure?.domesticFees?.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0) || 0;

    const updateData: Record<string, any> = {
      name: program.name,
      type: program.type,
      description: program.description,
      duration: program.duration,
      // Sync tuition column with fee_structure total for backward compatibility
      tuition: totalDomesticTuition > 0 ? totalDomesticTuition : (program.tuition || 0),
      next_intake: program.next_intake,
      enrollment_status: program.enrollment_status,
      requirements: program.requirements,
      // JSONB fields - always use parsed values
      entry_requirements: entryRequirements,
      document_requirements: documentRequirements,
      fee_structure: feeStructure,
      custom_questions: customQuestions,
      courses: courses,
      journey_config: journeyConfig,
      practicum_config: practicumConfig,
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

    console.log('🔵 ProgramService.updateProgram - Final updateData fee_structure:', JSON.stringify(updateData.fee_structure, null, 2));

    // Remove undefined values but keep empty arrays/objects
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('ProgramService.updateProgram - Final updateData:', updateData);

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

    // Update academic journeys if configuration changed
    if (program.journeyConfiguration || program.journey_config) {
      const journeyConfig = program.journeyConfiguration || program.journey_config;
      await this.updateProgramJourneys(id, journeyConfig, user.id);
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
      status: intake.status || 'planning',
      study_mode: intake.studyMode || 'full-time',
      delivery_method: intake.deliveryMethod || 'in-class',
      campus: intake.campusLocation || intake.campus || intake.location || null,
      sales_approach: 'balanced'
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
      .select('*, journey_templates(*)')
      .eq('program_id', programId);

    if (error) {
      console.error('Error fetching program journeys:', error);
      return [];
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

  /**
   * Create academic journeys for a program based on journey configuration
   */
  private static async createProgramJourneys(
    programId: string,
    journeyConfig: any,
    userId: string
  ) {
    const mode = journeyConfig.mode;
    
    try {
      if (mode === 'master') {
        // Link to master templates
        const studentTypes: ('domestic' | 'international')[] = [];
        if (journeyConfig.domestic?.enabled !== false) studentTypes.push('domestic');
        if (journeyConfig.international?.enabled !== false) studentTypes.push('international');
        
        if (studentTypes.length > 0) {
          await this.linkMasterJourney(programId, studentTypes);
        }
        
        // Also create custom stages if provided
        await this.createCustomStagesFromConfig(programId, journeyConfig, userId);
        
      } else if (mode === 'copy' && journeyConfig.sourceProgram?.programId) {
        // Copy from another program
        await this.copyJourneyFromProgram(
          journeyConfig.sourceProgram.programId,
          programId
        );
        
      } else if (mode === 'existing' && journeyConfig.existingJourneyId) {
        // Link to existing journey by updating its program_id
        await AcademicJourneyService.updateAcademicJourney(journeyConfig.existingJourneyId, {
          program_id: programId
        } as any);
        
      } else if (mode === 'custom' && journeyConfig.selectedTemplate) {
        // Create from custom template
        await AcademicJourneyService.createJourneyFromTemplate(
          journeyConfig.selectedTemplate,
          programId,
          {
            name: journeyConfig.name,
            description: journeyConfig.description
          }
        );
      }
      
      // If stages are directly configured, create them
      await this.createCustomStagesFromConfig(programId, journeyConfig, userId);
      
    } catch (error) {
      console.error('Error creating program journeys:', error);
      // Don't throw - journey creation failure shouldn't block program creation
    }
  }

  /**
   * Create custom stages from journey configuration
   */
  private static async createCustomStagesFromConfig(
    programId: string,
    journeyConfig: any,
    userId: string
  ) {
    // Check if we already have journeys for this program
    const existingJourneys = await this.getProgramJourneys(programId);
    
    const createJourneyWithStages = async (
      studentType: 'domestic' | 'international',
      stages: any[],
      templateId?: string
    ) => {
      if (!stages || stages.length === 0) return;
      
      // Check if journey already exists for this student type
      const existingJourney = existingJourneys.find((j: any) => {
        const meta = j.metadata || {};
        return meta.student_type === studentType;
      });
      
      if (existingJourney) {
        // Update existing journey stages if needed
        return;
      }
      
      // Create new journey
      const journey = await AcademicJourneyService.createAcademicJourney({
        user_id: userId,
        program_id: programId,
        template_id: templateId || null,
        name: `${studentType.charAt(0).toUpperCase() + studentType.slice(1)} Student Journey`,
        description: `Academic journey for ${studentType} students`,
        version: 1,
        is_active: true,
        metadata: {
          student_type: studentType,
          created_from_config: true,
          created_at: new Date().toISOString()
        }
      } as any);
      
      // Create stages
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        await AcademicJourneyService.createJourneyStage({
          journey_id: journey.id,
          name: stage.name,
          description: stage.description || '',
          stage_type: stage.stage_type || 'milestone',
          order_index: i,
          is_required: stage.is_required ?? true,
          is_parallel: false,
          status: 'active',
          timing_config: stage.timing_config || {},
          completion_criteria: stage.completion_criteria || {},
          escalation_rules: stage.escalation_rules || {}
        } as any);
      }
    };
    
    // Create journeys for domestic and international if stages are configured
    if (journeyConfig.domestic?.enabled !== false && journeyConfig.domestic?.stages?.length > 0) {
      await createJourneyWithStages(
        'domestic',
        journeyConfig.domestic.stages,
        journeyConfig.domestic.templateId
      );
    }
    
    if (journeyConfig.international?.enabled !== false && journeyConfig.international?.stages?.length > 0) {
      await createJourneyWithStages(
        'international',
        journeyConfig.international.stages,
        journeyConfig.international.templateId
      );
    }
  }

  /**
   * Update academic journeys for a program
   */
  private static async updateProgramJourneys(
    programId: string,
    journeyConfig: any,
    userId: string
  ) {
    // Get existing journeys
    const existingJourneys = await this.getProgramJourneys(programId);
    
    // If no existing journeys, create new ones
    if (!existingJourneys || existingJourneys.length === 0) {
      return this.createProgramJourneys(programId, journeyConfig, userId);
    }
    
    // Update existing journey metadata
    for (const journey of existingJourneys) {
      const meta = journey.metadata || {};
      const studentType = (meta as any).student_type as 'domestic' | 'international';
      const configForType = journeyConfig[studentType];
      
      if (configForType) {
        // Update journey active status based on enabled flag
        if (configForType.enabled === false && journey.is_active) {
          await AcademicJourneyService.updateAcademicJourney(journey.id, {
            is_active: false
          });
        } else if (configForType.enabled !== false && !journey.is_active) {
          await AcademicJourneyService.updateAcademicJourney(journey.id, {
            is_active: true
          });
        }
      }
    }
    
    // Create any new journeys that don't exist
    await this.createCustomStagesFromConfig(programId, journeyConfig, userId);
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
