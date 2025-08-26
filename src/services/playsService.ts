import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DbPlay = Database['public']['Tables']['plays']['Row'];
type DbPlayInsert = Database['public']['Tables']['plays']['Insert'];
type DbStudentAction = Database['public']['Tables']['student_actions']['Row'];
type DbStudentActionInsert = Database['public']['Tables']['student_actions']['Insert'];

export interface Play extends DbPlay {}
export interface StudentAction extends DbStudentAction {}
export type PlayInsert = DbPlayInsert;
export type StudentActionInsert = DbStudentActionInsert;

export class PlaysService {
  static async getPlays(): Promise<Play[]> {
    const { data, error } = await supabase
      .from('plays')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async togglePlay(id: string, isActive: boolean): Promise<Play> {
    const { data, error } = await supabase
      .from('plays')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // If activating a play, generate actions
    if (isActive) {
      await this.generateActionsForPlay(data);
    }
    
    return data;
  }

  static async generateActionsForPlay(play: Play): Promise<number> {
    // Try journey-aware generation first for any students in journeys
    const journeyAwareCount = await this.generateJourneyAwareActions(play);
    
    // Fallback to standard generation for non-journey students
    const standardCount = await this.generateStandardActions(play);
    
    return journeyAwareCount + standardCount;
  }

  private static async generateJourneyAwareActions(play: Play): Promise<number> {
    // Import here to avoid circular dependency
    const { JourneyOrchestrator } = await import('./journeyOrchestrator');
    
    // Get all students with journey progress
    const { data: journeyStudents, error } = await supabase
      .from('student_journey_progress')
      .select('student_id')
      .eq('user_id', play.user_id!)
      .eq('stage_status', 'active');

    if (error) throw error;

    let totalActions = 0;
    
    for (const student of journeyStudents || []) {
      const result = await JourneyOrchestrator.generateJourneyAwareActions(
        play.id, 
        student.student_id
      );
      totalActions += result.actionsGenerated;
    }

    return totalActions;
  }

  private static async generateStandardActions(play: Play): Promise<number> {
    // Get real students from action_queue that aren't in journeys
    const { data: actionQueueItems, error } = await supabase
      .from('action_queue')
      .select('*')
      .eq('user_id', play.user_id!)
      .eq('status', 'pending')
      .limit(10);

    if (error) throw error;

    const actions: StudentActionInsert[] = [];
    
    for (const item of actionQueueItems || []) {
      // Check if this student is already in a journey
      const { data: journeyProgress } = await supabase
        .from('student_journey_progress')
        .select('student_id')
        .eq('student_id', item.student_id || item.id)
        .single();

      // Skip if student is already in a journey (handled by journey-aware generation)
      if (journeyProgress) continue;

      // Check policy violations before generating action
      const { PoliciesService } = await import('./policiesService');
      const policyCheck = await PoliciesService.checkPolicyViolation(
        this.getActionTypeFromPlay(play.play_type),
        {
          studentId: item.student_id || item.id,
          yieldScore: item.yield_score,
          recentContact: item.updated_at,
          program: item.program
        }
      );

      if (!policyCheck.allowed) {
        // Action would violate policy - queue for later with policy reason
        actions.push({
          user_id: play.user_id!,
          student_id: item.student_id || item.id,
          play_id: play.id,
          action_type: this.getActionTypeFromPlay(play.play_type),
          instruction: this.generateEnhancedInstruction(play, item),
          reason_chips: this.generateEnhancedReasonChips(play, item, { 
            policyBlocked: true, 
            policyReason: policyCheck.reason 
          }),
          priority: this.calculatePriorityFromYield(item.yield_score),
          scheduled_at: this.calculatePolicyCompliantTiming(policyCheck.reason),
          metadata: {
            policy_blocked: true,
            policy_reason: policyCheck.reason,
            original_trigger: play.name
          }
        });
        continue;
      }

      // Generate policy-compliant action
      actions.push({
        user_id: play.user_id!,
        student_id: item.student_id || item.id,
        play_id: play.id,
        action_type: this.getActionTypeFromPlay(play.play_type),
        instruction: this.generateEnhancedInstruction(play, item),
        reason_chips: this.generateEnhancedReasonChips(play, item),
        priority: this.calculatePriorityFromYield(item.yield_score),
        scheduled_at: this.calculateOptimalTiming(play.play_type, item),
        metadata: {
          yield_score: item.yield_score,
          yield_band: item.yield_band,
          program: item.program,
          trigger_play: play.name,
          play_id: play.id,
          play_name: play.name,
          play_category: play.play_type,
          generation_source: 'standard-plays',
          student_name: item.student_name || 'Student'
        }
      });
    }

    if (actions.length > 0) {
      const { error } = await supabase
        .from('student_actions')
        .insert(actions);
      
      if (error) throw error;
    }

    return actions.length;
  }

  private static getActionTypeFromPlay(playType: string): string {
    switch (playType) {
      case 'immediate_response': return 'call';
      case 'nurture_sequence': return 'email';
      case 'document_follow_up': return 'document_request';
      case 'interview_scheduler': return 'call';
      case 'deposit_follow_up': return 'email';
      default: return 'email';
    }
  }

  private static generateEnhancedInstruction(play: Play, student: any): string {
    const baseAction = this.getBaseActionFromPlay(play.play_type);
    const studentName = student.student_name || 'Student';
    const context = this.getStudentContext(student);
    
    return `${baseAction} ${studentName}${context ? ` - ${context}` : ''}`;
  }

  private static getBaseActionFromPlay(playType: string): string {
    switch (playType) {
      case 'immediate_response': return 'Call now';
      case 'nurture_sequence': return 'Send follow-up email to';
      case 'document_follow_up': return 'Request documents from';
      case 'interview_scheduler': return 'Schedule interview with';
      case 'deposit_follow_up': return 'Follow up on deposit with';
      default: return 'Contact';
    }
  }

  private static getStudentContext(student: any): string {
    const reasonCodes = Array.isArray(student.reason_codes) 
      ? student.reason_codes 
      : JSON.parse(student.reason_codes || '[]');
    
    if (reasonCodes.includes('New inquiry')) return 'new inquiry';
    if (reasonCodes.includes('Application stalled')) return 'stalled application';
    if (reasonCodes.includes('Documents missing')) return 'missing documents';
    if (reasonCodes.includes('High yield score')) return 'high potential';
    
    return '';
  }

  private static generateEnhancedReasonChips(
    play: Play, 
    student: any, 
    options: { policyBlocked?: boolean; policyReason?: string } = {}
  ): string[] {
    const chips: string[] = [];
    
    // Play trigger
    chips.push(play.name);
    
    // Policy status
    if (options.policyBlocked) {
      chips.push('Queued (policy)');
    }
    
    // Student-specific reasons
    const reasonCodes = Array.isArray(student.reason_codes) 
      ? student.reason_codes 
      : JSON.parse(student.reason_codes || '[]');
    
    // Add contextual reasons
    if (reasonCodes.includes('Speed-to-lead triggered')) chips.push('Speed policy');
    if (reasonCodes.includes('Application stalled')) chips.push('7-day stall');
    if (reasonCodes.includes('Documents missing')) chips.push('Doc missing');
    if (reasonCodes.includes('High yield score')) chips.push('High yield');
    
    // Yield band context
    if (student.yield_band === 'high') chips.push('High potential');
    
    // Time-based context
    const lastUpdate = new Date(student.updated_at);
    const daysSince = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 0) chips.push(`${daysSince}d since update`);
    
    return chips.slice(0, 4); // Limit to 4 chips for UI
  }

  private static calculatePriorityFromYield(yieldScore: number): number {
    if (yieldScore >= 80) return 1; // High priority
    if (yieldScore >= 60) return 2; // Medium priority
    return 3; // Low priority
  }

  private static calculateOptimalTiming(playType: string, student: any): string {
    const now = new Date();
    
    // Immediate response plays should happen now
    if (playType === 'immediate_response') {
      return now.toISOString();
    }
    
    // High yield students get faster response
    if (student.yield_score >= 80) {
      now.setMinutes(now.getMinutes() + 15);
    } else if (student.yield_score >= 60) {
      now.setHours(now.getHours() + 2);
    } else {
      now.setHours(now.getHours() + 4);
    }
    
    return now.toISOString();
  }

  private static calculatePolicyCompliantTiming(policyReason?: string): string {
    const now = new Date();
    
    // If blocked by quiet hours, schedule for 8am next day
    if (policyReason?.includes('quiet hours')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0);
      return tomorrow.toISOString();
    }
    
    // If blocked by pacing, schedule for 4 hours later
    if (policyReason?.includes('messages')) {
      now.setHours(now.getHours() + 4);
      return now.toISOString();
    }
    
    // Default to 1 hour delay
    now.setHours(now.getHours() + 1);
    return now.toISOString();
  }

  static async getStudentActions(): Promise<StudentAction[]> {
    const { data, error } = await supabase
      .from('student_actions')
      .select(`
        *,
        plays:play_id (name, play_type)
      `)
      .eq('status', 'pending')
      .order('priority')
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  static async completeAction(actionId: string): Promise<void> {
    const { error } = await supabase
      .from('student_actions')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        completed_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', actionId);

    if (error) throw error;
  }

  static async getPlayAnalytics() {
    const { data: plays, error: playsError } = await supabase
      .from('plays')
      .select(`
        *,
        student_actions(count)
      `);

    if (playsError) throw playsError;

    const { data: actions, error: actionsError } = await supabase
      .from('student_actions')
      .select('*');

    if (actionsError) throw actionsError;

    return {
      totalPlays: plays?.length || 0,
      activePlays: plays?.filter(p => p.is_active).length || 0,
      pendingActions: actions?.filter(a => a.status === 'pending').length || 0,
      completedToday: actions?.filter(a => 
        a.status === 'completed' && 
        new Date(a.completed_at!).toDateString() === new Date().toDateString()
      ).length || 0,
    };
  }
}