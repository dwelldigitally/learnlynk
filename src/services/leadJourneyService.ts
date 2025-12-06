import { supabase } from '@/integrations/supabase/client';
import type { Lead } from '@/types/lead';

export interface LeadJourneyInstance {
  id: string;
  lead_id: string;
  journey_id: string;
  current_stage_id: string | null;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  started_at: string;
  completed_at: string | null;
  metadata: Record<string, any>;
}

export interface JourneyStageProgress {
  id: string;
  journey_instance_id: string;
  stage_id: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  started_at: string | null;
  completed_at: string | null;
  completion_percentage: number;
  metadata: Record<string, any>;
}

export class LeadJourneyService {
  /**
   * Get the journey for a lead's program interest
   */
  static async getJourneyForProgram(programId: string) {
    const { data, error } = await supabase
      .from('academic_journeys')
      .select(`
        *,
        journey_stages (
          *,
          journey_requirements (*)
        )
      `)
      .eq('program_id', programId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching journey for program:', error);
      return null;
    }

    return data;
  }

  /**
   * Get journey instance for a lead
   */
  static async getLeadJourneyInstance(leadId: string) {
    const { data, error } = await supabase
      .from('student_journey_instances')
      .select(`
        *,
        academic_journeys (
          *,
          journey_stages (
            *,
            journey_requirements (*)
          )
        )
      `)
      .eq('lead_id', leadId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching lead journey instance:', error);
      return null;
    }

    return data;
  }

  /**
   * Create a journey instance for a lead when they're associated with a program
   */
  static async createJourneyInstanceForLead(leadId: string, journeyId: string) {
    try {
      // Get the first stage of the journey
      const { data: stages } = await supabase
        .from('journey_stages')
        .select('id')
        .eq('journey_id', journeyId)
        .order('order_index', { ascending: true })
        .limit(1);

      const firstStageId = stages?.[0]?.id || null;

      // Create the journey instance
      const { data: instance, error } = await supabase
        .from('student_journey_instances')
        .insert({
          lead_id: leadId,
          journey_id: journeyId,
          current_stage_id: firstStageId,
          student_type: 'domestic', // Default student type
          status: 'active',
          started_at: new Date().toISOString(),
          progress_data: {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating journey instance:', error);
        return null;
      }

      // Initialize progress for the first stage
      if (firstStageId && instance) {
        await supabase
          .from('journey_stage_progress')
          .insert({
            journey_instance_id: instance.id,
            stage_id: firstStageId,
            status: 'active',
            started_at: new Date().toISOString(),
            completion_percentage: 0
          });
      }

      return instance;
    } catch (error) {
      console.error('Error in createJourneyInstanceForLead:', error);
      return null;
    }
  }

  /**
   * Get journey stages for a program (for use in LeadStageTracker)
   */
  static async getJourneyStagesForProgram(programId: string) {
    const { data, error } = await supabase
      .from('academic_journeys')
      .select(`
        id,
        name,
        journey_stages (
          id,
          name,
          stage_type,
          order_index,
          is_required,
          timing_config
        )
      `)
      .eq('program_id', programId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching journey stages:', error);
      return null;
    }

    return data;
  }

  /**
   * Get lead counts per stage for a journey
   */
  static async getLeadCountsPerStage(journeyId: string) {
    const { data, error } = await supabase
      .from('journey_stage_progress')
      .select(`
        stage_id,
        journey_instance_id,
        status,
        student_journey_instances!inner (
          journey_id,
          status
        )
      `)
      .eq('student_journey_instances.journey_id', journeyId)
      .eq('student_journey_instances.status', 'active')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching lead counts per stage:', error);
      return {};
    }

    // Count leads per stage
    const counts: Record<string, number> = {};
    data?.forEach((progress: any) => {
      counts[progress.stage_id] = (counts[progress.stage_id] || 0) + 1;
    });

    return counts;
  }

  /**
   * Update lead's current stage in their journey
   */
  static async updateLeadStage(
    leadId: string, 
    newStageId: string, 
    options?: { completeCurrentStage?: boolean }
  ) {
    try {
      // Get the lead's journey instance
      const instance = await this.getLeadJourneyInstance(leadId);
      if (!instance) {
        console.error('No journey instance found for lead:', leadId);
        return null;
      }

      // Complete current stage if requested
      if (options?.completeCurrentStage && instance.current_stage_id) {
        await supabase
          .from('journey_stage_progress')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            completion_percentage: 100
          })
          .eq('journey_instance_id', instance.id)
          .eq('stage_id', instance.current_stage_id);
      }

      // Update current stage in instance
      await supabase
        .from('student_journey_instances')
        .update({ current_stage_id: newStageId })
        .eq('id', instance.id);

      // Check if progress exists for new stage
      const { data: existingProgress } = await supabase
        .from('journey_stage_progress')
        .select('id')
        .eq('journey_instance_id', instance.id)
        .eq('stage_id', newStageId)
        .single();

      if (!existingProgress) {
        // Create progress for new stage
        await supabase
          .from('journey_stage_progress')
          .insert({
            journey_instance_id: instance.id,
            stage_id: newStageId,
            status: 'active',
            started_at: new Date().toISOString(),
            completion_percentage: 0,
            metadata: {}
          });
      } else {
        // Update existing progress to active
        await supabase
          .from('journey_stage_progress')
          .update({ status: 'active' })
          .eq('id', existingProgress.id);
      }

      return true;
    } catch (error) {
      console.error('Error updating lead stage:', error);
      return null;
    }
  }
}

// React Hooks
import { useQuery } from '@tanstack/react-query';

export function useLeadJourneyInstance(leadId: string | undefined) {
  return useQuery({
    queryKey: ['lead-journey-instance', leadId],
    queryFn: () => LeadJourneyService.getLeadJourneyInstance(leadId!),
    enabled: !!leadId,
  });
}

export function useJourneyStagesForProgram(programId: string | undefined) {
  return useQuery({
    queryKey: ['journey-stages-program', programId],
    queryFn: () => LeadJourneyService.getJourneyStagesForProgram(programId!),
    enabled: !!programId,
  });
}

export function useLeadCountsPerStage(journeyId: string | undefined) {
  return useQuery({
    queryKey: ['lead-counts-per-stage', journeyId],
    queryFn: () => LeadJourneyService.getLeadCountsPerStage(journeyId!),
    enabled: !!journeyId,
  });
}
