import { supabase } from '@/integrations/supabase/client';
import { PlaysService } from './playsService';
import { PoliciesService } from './policiesService';
import { AcademicJourneyService } from './academicJourneyService';
import type { Database } from '@/integrations/supabase/types';

type DbStudentJourneyProgress = Database['public']['Tables']['student_journey_progress']['Row'];
type DbJourneyPlayMapping = Database['public']['Tables']['journey_play_mappings']['Row'];
type DbJourneyPolicyOverride = Database['public']['Tables']['journey_policy_overrides']['Row'];

export interface StudentJourneyProgress extends DbStudentJourneyProgress {}
export interface JourneyPlayMapping extends DbJourneyPlayMapping {}
export interface JourneyPolicyOverride extends DbJourneyPolicyOverride {}

export interface JourneyContext {
  studentId: string;
  journeyId: string;
  currentStageId: string | null;
  currentSubstage: string | null;
  stageStatus: string;
  requirementsCompleted: string[];
  metadata: Record<string, any>;
}

export interface ActionGenerationContext {
  journeyContext: JourneyContext;
  playMappings: JourneyPlayMapping[];
  policyOverrides: JourneyPolicyOverride[];
  studentData: any;
}

/**
 * Phase 2-3: Journey-Aware Orchestration Service
 * 
 * This service coordinates Plays and Policies with Academic Journey state,
 * providing intelligent action generation and policy enforcement based on
 * where students are in their journey.
 */
export class JourneyOrchestrator {
  
  // ============= JOURNEY PROGRESS TRACKING =============
  
  static async getStudentJourneyProgress(studentId: string): Promise<StudentJourneyProgress | null> {
    const { data, error } = await supabase
      .from('student_journey_progress')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Not found is ok
    return data;
  }

  static async updateStudentJourneyProgress(
    studentId: string, 
    updates: Partial<StudentJourneyProgress>
  ): Promise<StudentJourneyProgress> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('student_journey_progress')
      .upsert({
        student_id: studentId,
        user_id: user.user.id,
        journey_id: updates.journey_id || '', // Required field
        ...updates,
        updated_at: new Date().toISOString()
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async advanceStudentToNextStage(
    studentId: string, 
    nextStageId: string, 
    reason?: string
  ): Promise<StudentJourneyProgress> {
    const progress = await this.getStudentJourneyProgress(studentId);
    if (!progress) throw new Error('Student journey progress not found');

    return this.updateStudentJourneyProgress(studentId, {
      current_stage_id: nextStageId,
      stage_status: 'active',
      stage_started_at: new Date().toISOString(),
      stage_completed_at: null,
      metadata: {
        ...(progress.metadata as Record<string, any> || {}),
        last_stage_transition: {
          from_stage_id: progress.current_stage_id,
          to_stage_id: nextStageId,
          timestamp: new Date().toISOString(),
          reason
        }
      }
    });
  }

  // ============= JOURNEY-PLAY MAPPINGS =============

  static async getJourneyPlayMappings(journeyId: string, stageId?: string): Promise<JourneyPlayMapping[]> {
    const query = supabase
      .from('journey_play_mappings')
      .select('*')
      .eq('journey_id', journeyId)
      .eq('is_enabled', true);

    if (stageId) {
      query.eq('stage_id', stageId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createJourneyPlayMapping(mapping: Partial<JourneyPlayMapping>): Promise<JourneyPlayMapping> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('journey_play_mappings')
      .insert([{
        ...mapping,
        user_id: user.user.id,
        journey_id: mapping.journey_id || '',
        stage_id: mapping.stage_id || '',
        play_id: mapping.play_id || ''
      } as any])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ============= JOURNEY-POLICY OVERRIDES =============

  static async getJourneyPolicyOverrides(
    journeyId: string, 
    stageId?: string
  ): Promise<JourneyPolicyOverride[]> {
    const query = supabase
      .from('journey_policy_overrides')
      .select('*')
      .eq('journey_id', journeyId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (stageId) {
      query.or(`stage_id.eq.${stageId},stage_id.is.null`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // ============= JOURNEY-AWARE PLAY EXECUTION =============

  /**
   * Phase 3: Generate actions for a play, but only if permitted by journey context
   */
  static async generateJourneyAwareActions(
    playId: string, 
    studentId: string
  ): Promise<{ actionsGenerated: number; reason?: string }> {
    // Get student's current journey context
    const progress = await this.getStudentJourneyProgress(studentId);
    if (!progress) {
      return { actionsGenerated: 0, reason: 'Student not enrolled in any journey' };
    }

    if (!progress.current_stage_id) {
      return { actionsGenerated: 0, reason: 'Student not in active journey stage' };
    }

    // Check if play is permitted for current stage
    const mappings = await this.getJourneyPlayMappings(
      progress.journey_id, 
      progress.current_stage_id
    );

    const playMapping = mappings.find(m => m.play_id === playId);
    if (!playMapping || !playMapping.is_enabled) {
      return { 
        actionsGenerated: 0, 
        reason: `Play not permitted for current journey stage` 
      };
    }

    // Get journey-specific policy overrides
    const policyOverrides = await this.getJourneyPolicyOverrides(
      progress.journey_id,
      progress.current_stage_id
    );

    // Check journey-aware policy violations
    const policyCheck = await this.checkJourneyAwarePolicies(
      playId,
      progress,
      policyOverrides
    );

    if (!policyCheck.allowed) {
      return { 
        actionsGenerated: 0, 
        reason: policyCheck.reason 
      };
    }

    // Generate actions with journey context
    const play = await this.getPlay(playId);
    if (!play) {
      return { actionsGenerated: 0, reason: 'Play not found' };
    }

    const actionsCount = await this.generateContextualActions(play, progress, playMapping);
    
    return { actionsGenerated: actionsCount };
  }

  private static async checkJourneyAwarePolicies(
    playId: string,
    progress: StudentJourneyProgress,
    overrides: JourneyPolicyOverride[]
  ): Promise<{ allowed: boolean; reason?: string }> {
    // First check standard policies
    const standardCheck = await PoliciesService.checkPolicyViolation(
      'play_execution',
      { 
        studentId: progress.student_id,
        journeyStage: progress.current_stage_id,
        journeyId: progress.journey_id
      }
    );

    if (!standardCheck.allowed) {
      return standardCheck;
    }

    // Then check journey-specific overrides
    for (const override of overrides) {
      const config = override.override_config as Record<string, any>;
      
      // Example: Stage-specific timing restrictions
      if (config.type === 'timing_restriction') {
        const stageStartTime = new Date(progress.stage_started_at!).getTime();
        const now = Date.now();
        const hoursInStage = (now - stageStartTime) / (1000 * 60 * 60);
        
        if (config.min_hours_in_stage && hoursInStage < config.min_hours_in_stage) {
          return { 
            allowed: false, 
            reason: `Must wait ${config.min_hours_in_stage} hours in current stage` 
          };
        }
      }

      // Example: Requirement-based restrictions
      if (config.type === 'requirement_gate') {
        const requiredCompletions = config.required_requirements || [];
        const completedRequirements = progress.requirements_completed as string[];
        
        const missingRequirements = requiredCompletions.filter(
          (req: string) => !completedRequirements.includes(req)
        );
        
        if (missingRequirements.length > 0) {
          return { 
            allowed: false, 
            reason: `Missing required completions: ${missingRequirements.join(', ')}` 
          };
        }
      }
    }

    return { allowed: true };
  }

  private static async generateContextualActions(
    play: any,
    progress: StudentJourneyProgress,
    mapping: JourneyPlayMapping
  ): Promise<number> {
    // Get journey and stage information for context
    const journey = await AcademicJourneyService.getAcademicJourney(progress.journey_id);
    const currentStage = (journey as any).journey_stages?.find((s: any) => s.id === progress.current_stage_id);

    // Apply timing overrides from mapping
    const timingOverride = mapping.timing_override as Record<string, any>;
    const priorityOverride = mapping.priority_override;

    // Generate actions with journey context
    const actions = [{
      user_id: play.user_id,
      student_id: progress.student_id,
      play_id: play.id,
      action_type: this.getContextualActionType(play, currentStage),
      instruction: this.generateContextualInstruction(play, progress, currentStage),
      reason_chips: this.generateContextualReasonChips(play, currentStage, progress),
      priority: priorityOverride || this.calculateContextualPriority(play, currentStage),
      scheduled_at: this.calculateContextualTiming(timingOverride),
      metadata: {
        journey_id: progress.journey_id,
        stage_id: progress.current_stage_id,
        stage_name: currentStage?.name,
        journey_context: true
      }
    }];

    const { error } = await supabase
      .from('student_actions')
      .insert(actions);

    if (error) throw error;
    return actions.length;
  }

  private static getContextualActionType(play: any, stage: any): string {
    // Return action type based on stage context
    if (stage?.stage_type === 'document_collection') return 'document_request';
    if (stage?.stage_type === 'interview') return 'call';
    if (stage?.stage_type === 'application_review') return 'email';
    return play.play_type === 'immediate_response' ? 'call' : 'email';
  }

  private static generateContextualInstruction(
    play: any, 
    progress: StudentJourneyProgress, 
    stage: any
  ): string {
    // Get student info from action_queue if available
    const stageContext = stage ? ` (${stage.name} stage)` : '';
    const actionType = this.getContextualActionType(play, stage);
    
    switch (play.play_type) {
      case 'immediate_response':
        return `Call student now - new ${stage?.name || 'inquiry'}${stageContext}`;
      case 'nurture_sequence':
        const daysSinceStage = Math.floor(
          (Date.now() - new Date(progress.stage_started_at!).getTime()) / (1000 * 60 * 60 * 24)
        );
        return `Follow up on stalled ${stage?.name || 'stage'} (${daysSinceStage} days)`;
      case 'document_follow_up':
        return `Request missing documents for ${stage?.name || 'current stage'}`;
      case 'interview_scheduler':
        return `Schedule interview for ${stage?.name || 'application'} review`;
      case 'deposit_follow_up':
        return `Process deposit and begin onboarding`;
      default:
        return `${play.name} action for student${stageContext}`;
    }
  }

  private static generateContextualReasonChips(
    play: any, 
    stage: any, 
    progress: StudentJourneyProgress
  ): string[] {
    const chips: string[] = [];
    
    // Primary trigger
    chips.push(play.name);
    
    // Journey context
    if (stage?.name) {
      chips.push(stage.name);
    }
    
    // Time-based urgency
    const stageAge = progress.stage_started_at 
      ? Math.floor((Date.now() - new Date(progress.stage_started_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    if (stageAge > 7) {
      chips.push(`${stageAge}d stalled`);
    } else if (stageAge > 3) {
      chips.push(`${stageAge}d in stage`);
    }
    
    // Journey-specific context
    const metadata = progress.metadata as Record<string, any> || {};
    
    // Requirements status
    const totalRequirements = stage?.total_requirements || 0;
    const completedRequirements = (progress.requirements_completed as string[] || []).length;
    const completionRatio = totalRequirements > 0 ? completedRequirements / totalRequirements : 0;
    
    if (completionRatio > 0.8) {
      chips.push('Nearly complete');
    } else if (completionRatio < 0.3 && stageAge > 2) {
      chips.push('Low progress');
    }
    
    // Stage type specific context
    switch (stage?.stage_type) {
      case 'document_collection':
        chips.push('Doc missing');
        break;
      case 'application_review':
        chips.push('Review pending');
        break;
      case 'interview':
        chips.push('Interview needed');
        break;
      case 'enrollment':
        chips.push('Ready to enroll');
        break;
    }
    
    // Journey momentum
    if (metadata.last_stage_transition) {
      const lastTransition = new Date(metadata.last_stage_transition.timestamp);
      const daysSinceTransition = Math.floor((Date.now() - lastTransition.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceTransition === 0) {
        chips.push('Recent progress');
      }
    }
    
    return chips.slice(0, 4); // Limit to 4 chips for UI clarity
  }

  private static calculateContextualPriority(play: any, stage: any): number {
    let basePriority = 2;
    
    // Higher priority for certain stage types
    if (stage?.stage_type === 'application_review') basePriority = 1;
    if (stage?.stage_type === 'enrollment') basePriority = 1;
    
    return basePriority;
  }

  private static calculateContextualTiming(timingOverride: Record<string, any>): string {
    const now = new Date();
    
    if (timingOverride.delay_hours) {
      now.setHours(now.getHours() + timingOverride.delay_hours);
    }
    
    return now.toISOString();
  }

  private static async getPlay(playId: string): Promise<any> {
    const { data, error } = await supabase
      .from('plays')
      .select('*')
      .eq('id', playId)
      .single();

    if (error) throw error;
    return data;
  }

  // ============= JOURNEY ANALYTICS =============

  static async getJourneyOrchestrationAnalytics() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // Get journey-aware action counts
    const { data: actions, error: actionsError } = await supabase
      .from('student_actions')
      .select('*')
      .eq('user_id', user.user.id);

    if (actionsError) throw actionsError;

    const journeyAwareActions = actions?.filter(a => 
      a.metadata && typeof a.metadata === 'object' && (a.metadata as any).journey_context
    ) || [];
    const standardActions = actions?.filter(a => 
      !a.metadata || typeof a.metadata !== 'object' || !(a.metadata as any).journey_context
    ) || [];

    return {
      totalActions: actions?.length || 0,
      journeyAwareActions: journeyAwareActions.length,
      standardActions: standardActions.length,
      journeyAwarePercentage: actions?.length 
        ? Math.round((journeyAwareActions.length / actions.length) * 100)
        : 0
    };
  }
}