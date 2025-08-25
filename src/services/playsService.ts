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
    // Mock lead data for demo - students not in journeys
    const mockLeads = [
      { id: '1', name: 'Sarah Johnson', program: 'Business Administration', stage: 'inquiry', lastContact: '2024-01-20' },
      { id: '2', name: 'Mike Chen', program: 'Healthcare Assistant', stage: 'application', lastContact: '2024-01-18' },
      { id: '3', name: 'Emma Davis', program: 'Business Administration', stage: 'documentation', lastContact: '2024-01-15' },
    ];

    const actions: StudentActionInsert[] = [];
    
    switch (play.play_type) {
      case 'immediate_response':
        // Speed-to-Lead actions
        actions.push(...mockLeads.filter(l => l.stage === 'inquiry').map(lead => ({
          user_id: play.user_id!,
          student_id: lead.id,
          play_id: play.id,
          action_type: 'call' as const,
          instruction: `Call ${lead.name} now - new inquiry`,
          reason_chips: ['Recent engagement', 'Speed policy'],
          priority: 1,
          scheduled_at: new Date().toISOString(),
        })));
        break;

      case 'nurture_sequence':
        // Stalled 7-Day actions
        actions.push(...mockLeads.filter(l => l.stage === 'application').map(lead => ({
          user_id: play.user_id!,
          student_id: lead.id,
          play_id: play.id,
          action_type: 'email' as const,
          instruction: `Send gentle nudge to ${lead.name}`,
          reason_chips: ['7-day stall', 'Application incomplete'],
          priority: 2,
          scheduled_at: new Date().toISOString(),
        })));
        break;

      case 'document_follow_up':
        // Document Chase actions
        actions.push(...mockLeads.filter(l => l.stage === 'documentation').map(lead => ({
          user_id: play.user_id!,
          student_id: lead.id,
          play_id: play.id,
          action_type: 'document_request' as const,
          instruction: `Send document checklist to ${lead.name}`,
          reason_chips: ['Doc missing', 'Documentation stage'],
          priority: 2,
          scheduled_at: new Date().toISOString(),
        })));
        break;
    }

    if (actions.length > 0) {
      const { error } = await supabase
        .from('student_actions')
        .insert(actions);
      
      if (error) throw error;
    }

    return actions.length;
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