import { supabase } from '@/integrations/supabase/client';
import { JourneyTemplate, StudentJourneyInstance, JourneyStageProgress } from '@/types/academicJourney';

export class MasterJourneyService {
  /**
   * Check if master journey templates exist for the current user
   */
  static async checkMasterTemplatesExist(): Promise<boolean> {
    const { data } = await supabase
      .from('journey_templates')
      .select('id')
      .eq('is_master_template', true)
      .limit(1);

    return !!(data && data.length > 0);
  }

  /**
   * Get master journey templates (domestic and international)
   */
  static async getMasterTemplates(): Promise<JourneyTemplate[]> {
    const { data, error } = await supabase
      .from('journey_templates')
      .select('*')
      .eq('is_master_template', true)
      .order('student_type');

    if (error) {
      throw error;
    }

    return (data || []) as unknown as JourneyTemplate[];
  }

  /**
   * Create master journey templates if they don't exist
   */
  static async createMasterTemplates(): Promise<void> {
    const masterTemplates = [
      {
        name: 'Master Domestic Student Journey',
        description: 'Standard journey template for domestic students',
        category: 'master',
        student_type: 'domestic',
        is_master_template: true,
        complexity_level: 'medium',
        template_data: {
          stages: [
            {
              name: 'Lead Capture',
              stage_type: 'lead_capture',
              order_index: 1,
              description: 'Initial lead inquiry received',
              timing_config: { expected_duration_days: 1, stall_threshold_days: 2 },
              is_required: true
            },
            {
              name: 'Application Start',
              stage_type: 'application_start',
              order_index: 2,
              description: 'Student begins application process',
              timing_config: { expected_duration_days: 7, stall_threshold_days: 14 },
              is_required: true
            },
            {
              name: 'Prerequisites Review',
              stage_type: 'prerequisites',
              order_index: 3,
              description: 'Verify academic prerequisites are met',
              timing_config: { expected_duration_days: 5, stall_threshold_days: 10 },
              is_required: true
            },
            {
              name: 'Document Submission',
              stage_type: 'documents',
              order_index: 4,
              description: 'Submit required academic documents',
              timing_config: { expected_duration_days: 14, stall_threshold_days: 21 },
              is_required: true
            },
            {
              name: 'Admission Interview',
              stage_type: 'interview',
              order_index: 5,
              description: 'Conduct admission interview',
              timing_config: { expected_duration_days: 7, stall_threshold_days: 14 },
              is_required: true
            },
            {
              name: 'Admission Decision',
              stage_type: 'admission_decision',
              order_index: 6,
              description: 'Review application and make admission decision',
              timing_config: { expected_duration_days: 10, stall_threshold_days: 15 },
              is_required: true
            },
            {
              name: 'Contract Signing',
              stage_type: 'contract_signing',
              order_index: 7,
              description: 'Sign enrollment contract',
              timing_config: { expected_duration_days: 14, stall_threshold_days: 21 },
              is_required: true
            },
            {
              name: 'Deposit Payment',
              stage_type: 'deposit_payment',
              order_index: 8,
              description: 'Submit enrollment deposit',
              timing_config: { expected_duration_days: 7, stall_threshold_days: 14 },
              is_required: true
            },
            {
              name: 'Enrollment Complete',
              stage_type: 'enrollment_complete',
              order_index: 9,
              description: 'Student enrollment is finalized',
              timing_config: { expected_duration_days: 1, stall_threshold_days: 1 },
              is_required: true
            }
          ],
          default_timings: {
            stall_threshold_days: 7
          },
          communication_rules: []
        }
      },
      {
        name: 'Master International Student Journey',
        description: 'Standard journey template for international students',
        category: 'master',
        student_type: 'international',
        is_master_template: true,
        complexity_level: 'complex',
        template_data: {
          stages: [
            {
              name: 'Lead Capture',
              stage_type: 'lead_capture',
              order_index: 1,
              description: 'Initial lead inquiry received',
              timing_config: { expected_duration_days: 1, stall_threshold_days: 2 },
              is_required: true
            },
            {
              name: 'Application Start',
              stage_type: 'application_start',
              order_index: 2,
              description: 'Student begins application process',
              timing_config: { expected_duration_days: 7, stall_threshold_days: 14 },
              is_required: true
            },
            {
              name: 'Prerequisites Review',
              stage_type: 'prerequisites',
              order_index: 3,
              description: 'Verify academic prerequisites and credential evaluation',
              timing_config: { expected_duration_days: 14, stall_threshold_days: 21 },
              is_required: true
            },
            {
              name: 'English Proficiency Test',
              stage_type: 'language_test',
              order_index: 4,
              description: 'Complete English proficiency testing (IELTS/TOEFL)',
              timing_config: { expected_duration_days: 30, stall_threshold_days: 45 },
              is_required: true
            },
            {
              name: 'Document Submission',
              stage_type: 'documents',
              order_index: 5,
              description: 'Submit required academic and visa documents',
              timing_config: { expected_duration_days: 21, stall_threshold_days: 30 },
              is_required: true
            },
            {
              name: 'Admission Interview',
              stage_type: 'interview',
              order_index: 6,
              description: 'Conduct admission interview (online/in-person)',
              timing_config: { expected_duration_days: 10, stall_threshold_days: 14 },
              is_required: true
            },
            {
              name: 'Admission Decision',
              stage_type: 'admission_decision',
              order_index: 7,
              description: 'Review application and make admission decision',
              timing_config: { expected_duration_days: 14, stall_threshold_days: 21 },
              is_required: true
            },
            {
              name: 'Visa Application Support',
              stage_type: 'visa_support',
              order_index: 8,
              description: 'Provide visa application documentation and support',
              timing_config: { expected_duration_days: 21, stall_threshold_days: 30 },
              is_required: true
            },
            {
              name: 'Contract Signing',
              stage_type: 'contract_signing',
              order_index: 9,
              description: 'Sign enrollment contract',
              timing_config: { expected_duration_days: 14, stall_threshold_days: 21 },
              is_required: true
            },
            {
              name: 'Deposit Payment',
              stage_type: 'deposit_payment',
              order_index: 10,
              description: 'Submit enrollment deposit',
              timing_config: { expected_duration_days: 7, stall_threshold_days: 14 },
              is_required: true
            },
            {
              name: 'Enrollment Complete',
              stage_type: 'enrollment_complete',
              order_index: 11,
              description: 'Student enrollment is finalized',
              timing_config: { expected_duration_days: 1, stall_threshold_days: 1 },
              is_required: true
            }
          ],
          default_timings: {
            stall_threshold_days: 7
          },
          communication_rules: []
        }
      }
    ];

    const { error } = await supabase
      .from('journey_templates')
      .insert(masterTemplates);

    if (error) {
      throw error;
    }
  }

  /**
   * Detect student type based on country or other criteria
   */
  static detectStudentType(country?: string): 'domestic' | 'international' {
    // Simple logic - can be enhanced based on business rules
    const domesticCountries = ['United States', 'USA', 'US'];
    
    if (!country) return 'domestic'; // Default to domestic if no country provided
    
    return domesticCountries.includes(country) ? 'domestic' : 'international';
  }

  /**
   * Get appropriate journey template for a student type and program
   */
  static async getJourneyForStudent(
    studentType: 'domestic' | 'international',
    programId?: string
  ): Promise<JourneyTemplate | null> {
    // First, try to find a program-specific journey
    if (programId) {
      const { data: programJourney } = await supabase
        .from('academic_journeys')
        .select('*, journey_templates!inner(*)')
        .eq('program_id', programId)
        .eq('is_active', true)
        .eq('journey_templates.student_type', studentType)
        .single();

      if (programJourney?.journey_templates) {
        return programJourney.journey_templates as JourneyTemplate;
      }
    }

    // Fallback to master template
    const { data: masterTemplate } = await supabase
      .from('journey_templates')
      .select('*')
      .eq('is_master_template', true)
      .eq('student_type', studentType)
      .single();

    return masterTemplate as unknown as JourneyTemplate;
  }

  /**
   * Create a journey instance for a lead
   */
  static async createJourneyInstance(
    leadId: string,
    journeyId: string,
    studentType: 'domestic' | 'international'
  ): Promise<StudentJourneyInstance> {
    const { data, error } = await supabase
      .from('student_journey_instances')
      .insert({
        lead_id: leadId,
        journey_id: journeyId,
        student_type: studentType,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as StudentJourneyInstance;
  }

  /**
   * Update journey stage progress
   */
  static async updateStageProgress(
    journeyInstanceId: string,
    stageId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed',
    notes?: string,
    completionData?: Record<string, any>
  ): Promise<JourneyStageProgress> {
    const { data, error } = await supabase
      .from('journey_stage_progress')
      .upsert({
        journey_instance_id: journeyInstanceId,
        stage_id: stageId,
        status,
        notes,
        completion_data: completionData || {},
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as JourneyStageProgress;
  }

  /**
   * Get journey progress for a lead
   */
  static async getJourneyProgress(leadId: string): Promise<StudentJourneyInstance | null> {
    const { data, error } = await supabase
      .from('student_journey_instances')
      .select('*, journey_stage_progress(*)')
      .eq('lead_id', leadId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data as StudentJourneyInstance;
  }
}