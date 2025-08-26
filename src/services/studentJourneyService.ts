import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type StudentJourneyProgress = Database['public']['Tables']['student_journey_progress']['Row'];
type StudentJourneyProgressInsert = Database['public']['Tables']['student_journey_progress']['Insert'];

export interface StudentSignal {
  studentId: string;
  signalType: 'form_submission' | 'email_open' | 'document_upload' | 'webinar_attendance' | 'website_visit';
  signalData: Record<string, any>;
  timestamp: string;
}

/**
 * Phase 2: Student Journey Progress Tracking Service
 * 
 * Manages real student journey progression, signals, and contextual data
 * that drives intelligent action generation
 */
export class StudentJourneyService {
  
  // ============= JOURNEY ENROLLMENT =============
  
  static async enrollStudentInJourney(
    studentId: string,
    journeyId: string,
    program?: string
  ): Promise<StudentJourneyProgress> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // Get the first stage of the journey
    const { data: stages, error: stagesError } = await supabase
      .from('journey_stages')
      .select('*')
      .eq('journey_id', journeyId)
      .order('order_index')
      .limit(1);

    if (stagesError) throw stagesError;
    const firstStage = stages?.[0];

    const progressData: StudentJourneyProgressInsert = {
      user_id: user.user.id,
      student_id: studentId,
      journey_id: journeyId,
      current_stage_id: firstStage?.id || null,
      current_substage: 'initial',
      stage_status: 'active',
      stage_started_at: new Date().toISOString(),
      requirements_completed: [],
      metadata: {
        enrollment_date: new Date().toISOString(),
        program: program,
        initial_stage: firstStage?.name,
        signals: []
      }
    };

    const { data, error } = await supabase
      .from('student_journey_progress')
      .upsert(progressData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ============= SIGNAL TRACKING =============
  
  static async recordStudentSignal(signal: StudentSignal): Promise<void> {
    // Get current journey progress
    const progress = await this.getStudentProgress(signal.studentId);
    if (!progress) return; // Student not in journey

    // Update metadata with new signal
    const currentMetadata = progress.metadata as Record<string, any> || {};
    const signals = currentMetadata.signals || [];
    
    signals.push({
      type: signal.signalType,
      data: signal.signalData,
      timestamp: signal.timestamp,
      stage_id: progress.current_stage_id
    });

    // Keep only last 50 signals to prevent metadata bloat
    const recentSignals = signals.slice(-50);

    await supabase
      .from('student_journey_progress')
      .update({
        metadata: {
          ...currentMetadata,
          signals: recentSignals,
          last_signal: signal.signalType,
          last_signal_at: signal.timestamp
        },
        updated_at: new Date().toISOString()
      })
      .eq('student_id', signal.studentId);
  }

  // ============= PROGRESS TRACKING =============
  
  static async getStudentProgress(studentId: string): Promise<StudentJourneyProgress | null> {
    const { data, error } = await supabase
      .from('student_journey_progress')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateStudentProgress(
    studentId: string,
    updates: Partial<StudentJourneyProgress>
  ): Promise<StudentJourneyProgress> {
    const { data, error } = await supabase
      .from('student_journey_progress')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('student_id', studentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async completeRequirement(
    studentId: string,
    requirementId: string
  ): Promise<StudentJourneyProgress> {
    const progress = await this.getStudentProgress(studentId);
    if (!progress) throw new Error('Student progress not found');

    const completedRequirements = progress.requirements_completed as string[] || [];
    
    if (!completedRequirements.includes(requirementId)) {
      completedRequirements.push(requirementId);
    }

    return this.updateStudentProgress(studentId, {
      requirements_completed: completedRequirements
    });
  }

  // ============= STAGE TRANSITIONS =============
  
  static async advanceToNextStage(
    studentId: string,
    reason?: string
  ): Promise<StudentJourneyProgress> {
    const progress = await this.getStudentProgress(studentId);
    if (!progress) throw new Error('Student progress not found');

    // Get next stage
    const { data: currentStage, error: currentStageError } = await supabase
      .from('journey_stages')
      .select('order_index')
      .eq('id', progress.current_stage_id!)
      .single();

    if (currentStageError) throw currentStageError;

    const { data: nextStage, error: nextStageError } = await supabase
      .from('journey_stages')
      .select('*')
      .eq('journey_id', progress.journey_id)
      .eq('order_index', currentStage.order_index + 1)
      .single();

    if (nextStageError) {
      // No next stage - journey complete
      return this.updateStudentProgress(studentId, {
        stage_status: 'completed',
        stage_completed_at: new Date().toISOString(),
        metadata: {
          ...(progress.metadata as Record<string, any> || {}),
          journey_completed_at: new Date().toISOString(),
          completion_reason: reason || 'All stages completed'
        }
      });
    }

    // Advance to next stage
    const currentMetadata = progress.metadata as Record<string, any> || {};
    
    return this.updateStudentProgress(studentId, {
      current_stage_id: nextStage.id,
      current_substage: 'initial',
      stage_status: 'active',
      stage_started_at: new Date().toISOString(),
      stage_completed_at: null,
      requirements_completed: [], // Reset for new stage
      metadata: {
        ...currentMetadata,
        stage_transitions: [
          ...(currentMetadata.stage_transitions || []),
          {
            from_stage_id: progress.current_stage_id,
            to_stage_id: nextStage.id,
            timestamp: new Date().toISOString(),
            reason: reason || 'Automatic progression'
          }
        ]
      }
    });
  }

  // ============= ANALYTICS & INSIGHTS =============
  
  static async getStudentJourneyAnalytics(studentId: string) {
    const progress = await this.getStudentProgress(studentId);
    if (!progress) return null;

    const metadata = progress.metadata as Record<string, any> || {};
    const signals = metadata.signals || [];
    
    // Calculate engagement metrics
    const signalCounts = signals.reduce((acc: Record<string, number>, signal: any) => {
      acc[signal.type] = (acc[signal.type] || 0) + 1;
      return acc;
    }, {});

    // Calculate time in current stage
    const stageStartTime = progress.stage_started_at ? new Date(progress.stage_started_at).getTime() : 0;
    const timeInStage = stageStartTime ? (Date.now() - stageStartTime) / (1000 * 60 * 60 * 24) : 0;

    // Calculate completion rate
    const totalRequirements = metadata.total_requirements || 0;
    const completedRequirements = (progress.requirements_completed as string[] || []).length;
    const completionRate = totalRequirements > 0 ? completedRequirements / totalRequirements : 0;

    return {
      studentId,
      journeyId: progress.journey_id,
      currentStage: progress.current_stage_id,
      stageStatus: progress.stage_status,
      timeInStage: Math.round(timeInStage * 10) / 10, // Round to 1 decimal
      completionRate: Math.round(completionRate * 100),
      signalCounts,
      totalSignals: signals.length,
      lastSignal: metadata.last_signal,
      lastSignalAt: metadata.last_signal_at,
      riskLevel: this.calculateRiskLevel(timeInStage, completionRate, signals.length)
    };
  }

  private static calculateRiskLevel(
    timeInStage: number, 
    completionRate: number, 
    signalCount: number
  ): 'low' | 'medium' | 'high' {
    let riskScore = 0;
    
    // Time risk (longer in stage = higher risk)
    if (timeInStage > 14) riskScore += 3;
    else if (timeInStage > 7) riskScore += 2;
    else if (timeInStage > 3) riskScore += 1;
    
    // Completion risk (lower completion = higher risk)
    if (completionRate < 0.3) riskScore += 3;
    else if (completionRate < 0.6) riskScore += 2;
    else if (completionRate < 0.8) riskScore += 1;
    
    // Engagement risk (fewer signals = higher risk)
    if (signalCount < 2) riskScore += 2;
    else if (signalCount < 5) riskScore += 1;
    
    if (riskScore >= 5) return 'high';
    if (riskScore >= 3) return 'medium';
    return 'low';
  }

  // ============= DEMO DATA SEEDING =============
  
  static async seedDemoJourneyProgress(): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // Get existing journeys
    const { data: journeys, error: journeysError } = await supabase
      .from('academic_journeys')
      .select('id, name')
      .eq('user_id', user.user.id)
      .limit(3);

    if (journeysError) throw journeysError;
    if (!journeys || journeys.length === 0) return;

    // Get existing action queue students
    const { data: students, error: studentsError } = await supabase
      .from('action_queue')
      .select('student_id, student_name, program')
      .eq('user_id', user.user.id)
      .limit(5);

    if (studentsError) throw studentsError;
    if (!students || students.length === 0) return;

    // Enroll students in journeys
    const enrollments = [];
    
    for (let i = 0; i < Math.min(students.length, 3); i++) {
      const student = students[i];
      const journey = journeys[i % journeys.length];
      
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('student_journey_progress')
        .select('id')
        .eq('student_id', student.student_id!)
        .single();

      if (existing) continue; // Already enrolled

      try {
        await this.enrollStudentInJourney(
          student.student_id!,
          journey.id,
          student.program
        );

        // Add some realistic signals
        await this.recordStudentSignal({
          studentId: student.student_id!,
          signalType: 'form_submission',
          signalData: { form_type: 'initial_inquiry', completion_rate: 1.0 },
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        });

        if (Math.random() > 0.5) {
          await this.recordStudentSignal({
            studentId: student.student_id!,
            signalType: 'email_open',
            signalData: { email_type: 'welcome', open_time: 30 },
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
          });
        }

        enrollments.push(student.student_name);
      } catch (error) {
        console.error(`Failed to enroll ${student.student_name}:`, error);
      }
    }

    console.log(`Enrolled ${enrollments.length} students in journeys:`, enrollments);
  }
}
