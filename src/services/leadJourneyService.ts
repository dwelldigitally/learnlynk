import { supabase } from '@/integrations/supabase/client';
import type { Lead } from '@/types/lead';
import { leadActivityService } from './leadActivityService';

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
   * Get program ID from program name
   */
  static async getProgramIdByName(programName: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('programs')
      .select('id')
      .eq('name', programName)
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching program by name:', error);
      return null;
    }

    return data?.id || null;
  }

  /**
   * Get the journey for a lead's program interest (supports multi-program links via junction table)
   */
  static async getJourneyForProgram(programId: string) {
    // First try the junction table (new approach - supports multiple programs)
    const { data: linkData, error: linkError } = await supabase
      .from('program_journey_links')
      .select(`
        journey_id,
        is_primary,
        academic_journeys!inner (
          *,
          journey_stages (
            *,
            journey_requirements (*)
          )
        )
      `)
      .eq('program_id', programId)
      .eq('academic_journeys.is_active', true)
      .order('is_primary', { ascending: false })
      .limit(1);

    if (!linkError && linkData && linkData.length > 0) {
      return (linkData[0] as any).academic_journeys;
    }

    // Fallback to legacy direct program_id link
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
   * Get journey for program by name (convenience method)
   */
  static async getJourneyForProgramName(programName: string) {
    const programId = await this.getProgramIdByName(programName);
    if (!programId) return null;
    return this.getJourneyForProgram(programId);
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
   * Initializes progress records for ALL stages (first is active, rest are pending)
   */
  static async createJourneyInstanceForLead(leadId: string, journeyId: string) {
    try {
      // Check if instance already exists
      const { data: existing } = await supabase
        .from('student_journey_instances')
        .select('id')
        .eq('lead_id', leadId)
        .eq('journey_id', journeyId)
        .eq('status', 'active')
        .single();

      if (existing) {
        console.log('Journey instance already exists for lead:', leadId);
        return existing;
      }

      // Get ALL stages of the journey
      const { data: allStages } = await supabase
        .from('journey_stages')
        .select('id, order_index')
        .eq('journey_id', journeyId)
        .order('order_index', { ascending: true });

      if (!allStages || allStages.length === 0) {
        console.error('No stages found for journey:', journeyId);
        return null;
      }

      const firstStageId = allStages[0].id;

      // Create the journey instance
      const { data: instance, error } = await supabase
        .from('student_journey_instances')
        .insert({
          lead_id: leadId,
          journey_id: journeyId,
          current_stage_id: firstStageId,
          student_type: 'domestic',
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

      // Initialize progress for ALL stages (first is active, rest are pending)
      const progressRecords = allStages.map((stage, index) => ({
        journey_instance_id: instance.id,
        stage_id: stage.id,
        status: index === 0 ? 'active' : 'pending',
        started_at: index === 0 ? new Date().toISOString() : new Date().toISOString()
      }));

      const { error: progressError } = await supabase
        .from('journey_stage_progress')
        .insert(progressRecords);

      if (progressError) {
        console.error('Error creating stage progress:', progressError);
      }

      return instance;
    } catch (error) {
      console.error('Error in createJourneyInstanceForLead:', error);
      return null;
    }
  }

  /**
   * Get journey stages for a program (for use in LeadStageTracker)
   * Supports multi-program links via junction table
   */
  static async getJourneyStagesForProgram(programId: string) {
    // First try the junction table (new approach)
    const { data: linkData, error: linkError } = await supabase
      .from('program_journey_links')
      .select(`
        journey_id,
        is_primary,
        academic_journeys!inner (
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
        )
      `)
      .eq('program_id', programId)
      .eq('academic_journeys.is_active', true)
      .order('is_primary', { ascending: false })
      .limit(1);

    if (!linkError && linkData && linkData.length > 0) {
      return (linkData[0] as any).academic_journeys;
    }

    // Fallback to legacy direct program_id link
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

      // Get stage names for activity logging
      const { data: stages } = await supabase
        .from('journey_stages')
        .select('id, name')
        .in('id', [instance.current_stage_id, newStageId].filter(Boolean));
      
      const oldStageName = stages?.find(s => s.id === instance.current_stage_id)?.name || 'Unknown';
      const newStageName = stages?.find(s => s.id === newStageId)?.name || 'Unknown';

      // Complete current stage if requested
      if (options?.completeCurrentStage && instance.current_stage_id) {
        await supabase
          .from('journey_stage_progress')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
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
            started_at: new Date().toISOString()
          });
      } else {
        // Update existing progress to active
        await supabase
          .from('journey_stage_progress')
          .update({ status: 'active' })
          .eq('id', existingProgress.id);
      }

      // Log stage change activity
      await leadActivityService.logStageChange(
        leadId,
        oldStageName,
        newStageName,
        'manual'
      );

      return true;
    } catch (error) {
      console.error('Error updating lead stage:', error);
      return null;
    }
  }
}

// React Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

export function useJourneyForProgramName(programName: string | undefined) {
  return useQuery({
    queryKey: ['journey-for-program-name', programName],
    queryFn: () => LeadJourneyService.getJourneyForProgramName(programName!),
    enabled: !!programName,
  });
}

export function useLeadCountsPerStage(journeyId: string | undefined) {
  return useQuery({
    queryKey: ['lead-counts-per-stage', journeyId],
    queryFn: () => LeadJourneyService.getLeadCountsPerStage(journeyId!),
    enabled: !!journeyId,
  });
}

export function useUpdateLeadStage(leadId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ stageId, completeCurrentStage }: { stageId: string; completeCurrentStage?: boolean }) => 
      LeadJourneyService.updateLeadStage(leadId, stageId, { completeCurrentStage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-journey-instance', leadId] });
    },
  });
}

export function useCreateJourneyInstance(leadId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (journeyId: string) => 
      LeadJourneyService.createJourneyInstanceForLead(leadId, journeyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-journey-instance', leadId] });
    },
  });
}
