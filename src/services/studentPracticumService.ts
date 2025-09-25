import { supabase } from "@/integrations/supabase/client";
import { supabaseWrapper } from "./supabaseWrapper";
import type {
  PracticumAssignment,
  PracticumRecord,
  PracticumEvaluation,
  PracticumRecordInsert,
  StudentProgress
} from "@/types/practicum";

export interface StudentAttendanceRecord {
  id: string;
  assignment_id: string;
  date: string;
  time_in: string;
  time_out: string;
  total_hours: number;
  activities: string;
  status: 'pending' | 'approved' | 'rejected';
  preceptor_notes?: string;
  created_at: string;
  practicum_assignments?: {
    practicum_sites?: { name: string };
    practicum_programs?: { program_name: string };
  };
}

export interface StudentJournalEntry {
  id: string;
  assignment_id: string;
  week_of: string;
  reflection_content: string;
  learning_objectives: string[];
  resources_links?: string[];
  instructor_feedback?: string;
  status: 'pending' | 'reviewed';
  created_at: string;
}

export interface StudentCompetencyRecord {
  id: string;
  assignment_id: string;
  competency_id: string;
  completion_status: 'pending' | 'approved' | 'rejected';
  self_assessment_score?: number;
  instructor_score?: number;
  notes?: string;
  created_at: string;
  practicum_competencies?: {
    name: string;
    description: string;
    category: string;
  };
}

export interface StudentSelfEvaluation {
  id: string;
  assignment_id: string;
  evaluation_type: 'midterm' | 'final';
  competency_ratings: Record<string, {
    self_rating: 'needs_improvement' | 'making_progress' | 'satisfactory' | 'competent';
    comments: string;
  }>;
  overall_reflection: string;
  learning_goals: string[];
  submitted_at: string;
  status: 'pending' | 'reviewed';
}

export class StudentPracticumService {
  // Get student's practicum assignments
  static async getStudentAssignments(leadId: string): Promise<PracticumAssignment[]> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_assignments')
        .select(`
          *,
          practicum_sites (
            id,
            name,
            address,
            contact_person,
            contact_email,
            contact_phone
          ),
          practicum_programs (
            id,
            program_name,
            total_hours_required,
            competency_requirements
          ),
          practicum_journeys (
            id,
            journey_name,
            steps
          )
        `)
        .eq('lead_id', leadId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    });
  }

  // Submit attendance record
  static async submitAttendanceRecord(data: {
    assignment_id: string;
    date: string;
    time_in: string;
    time_out: string;
    activities: string;
    preceptor_id?: string;
  }): Promise<StudentAttendanceRecord> {
    return supabaseWrapper.withRetry(async () => {
      // Calculate total hours
      const timeIn = new Date(`${data.date}T${data.time_in}`);
      const timeOut = new Date(`${data.date}T${data.time_out}`);
      const totalHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);

      const recordData: PracticumRecordInsert = {
        assignment_id: data.assignment_id,
        record_type: 'attendance',
        record_date: data.date,
        record_data: {
          time_in: data.time_in,
          time_out: data.time_out,
          total_hours: totalHours,
          activities: data.activities,
          preceptor_id: data.preceptor_id
        },
        status: 'pending_approval',
        submitted_by: 'student'
      };

      const { data: record, error } = await supabase
        .from('practicum_records')
        .insert(recordData)
        .select(`
          *,
          practicum_assignments (
            practicum_sites (name),
            practicum_programs (program_name)
          )
        `)
        .single();
      
      if (error) throw error;
      
      return {
        id: record.id,
        assignment_id: record.assignment_id,
        date: data.date,
        time_in: data.time_in,
        time_out: data.time_out,
        total_hours: totalHours,
        activities: data.activities,
        status: 'pending' as const,
        created_at: record.created_at,
        practicum_assignments: record.practicum_assignments
      };
    });
  }

  // Submit weekly journal
  static async submitWeeklyJournal(data: {
    assignment_id: string;
    week_of: string;
    reflection_content: string;
    learning_objectives: string[];
    resources_links?: string[];
  }): Promise<StudentJournalEntry> {
    return supabaseWrapper.withRetry(async () => {
      const recordData: PracticumRecordInsert = {
        assignment_id: data.assignment_id,
        record_type: 'journal',
        record_date: data.week_of,
        record_data: {
          reflection_content: data.reflection_content,
          learning_objectives: data.learning_objectives,
          resources_links: data.resources_links || []
        },
        status: 'pending_approval',
        submitted_by: 'student'
      };

      const { data: record, error } = await supabase
        .from('practicum_records')
        .insert(recordData)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: record.id,
        assignment_id: record.assignment_id,
        week_of: data.week_of,
        reflection_content: data.reflection_content,
        learning_objectives: data.learning_objectives,
        resources_links: data.resources_links,
        status: 'pending' as const,
        created_at: record.created_at
      };
    });
  }

  // Submit competency record
  static async submitCompetencyRecord(data: {
    assignment_id: string;
    competency_ids: string[];
    notes?: string;
  }): Promise<StudentCompetencyRecord[]> {
    return supabaseWrapper.withRetry(async () => {
      const records = await Promise.all(
        data.competency_ids.map(async (competencyId) => {
          const recordData: PracticumRecordInsert = {
            assignment_id: data.assignment_id,
            record_type: 'competency',
            record_date: new Date().toISOString().split('T')[0],
            record_data: {
              competency_id: competencyId,
              notes: data.notes
            },
            status: 'pending_approval',
            submitted_by: 'student'
          };

          const { data: record, error } = await supabase
            .from('practicum_records')
            .insert(recordData)
            .select(`
              *,
              practicum_competencies (
                name,
                description,
                category
              )
            `)
            .single();
          
          if (error) throw error;
          
          return {
            id: record.id,
            assignment_id: record.assignment_id,
            competency_id: competencyId,
            completion_status: 'pending' as const,
            notes: data.notes,
            created_at: record.created_at,
            practicum_competencies: record.practicum_competencies
          };
        })
      );

      return records;
    });
  }

  // Submit self-evaluation
  static async submitSelfEvaluation(data: {
    assignment_id: string;
    evaluation_type: 'midterm' | 'final';
    competency_ratings: Record<string, {
      self_rating: 'needs_improvement' | 'making_progress' | 'satisfactory' | 'competent';
      comments: string;
    }>;
    overall_reflection: string;
    learning_goals: string[];
  }): Promise<StudentSelfEvaluation> {
    return supabaseWrapper.withRetry(async () => {
      const recordData: PracticumRecordInsert = {
        assignment_id: data.assignment_id,
        record_type: 'evaluation',
        record_date: new Date().toISOString().split('T')[0],
        record_data: {
          evaluation_type: data.evaluation_type,
          competency_ratings: data.competency_ratings,
          overall_reflection: data.overall_reflection,
          learning_goals: data.learning_goals
        },
        status: 'pending_approval',
        submitted_by: 'student'
      };

      const { data: record, error } = await supabase
        .from('practicum_records')
        .insert(recordData)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: record.id,
        assignment_id: record.assignment_id,
        evaluation_type: data.evaluation_type,
        competency_ratings: data.competency_ratings,
        overall_reflection: data.overall_reflection,
        learning_goals: data.learning_goals,
        submitted_at: record.created_at,
        status: 'pending' as const
      };
    });
  }

  // Get student's practicum records
  static async getStudentRecords(assignmentId: string): Promise<{
    attendance: StudentAttendanceRecord[];
    journals: StudentJournalEntry[];
    competencies: StudentCompetencyRecord[];
    evaluations: StudentSelfEvaluation[];
  }> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_records')
        .select(`
          *,
          practicum_assignments (
            practicum_sites (name),
            practicum_programs (program_name)
          )
        `)
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const records = data || [];
      
      return {
        attendance: records
          .filter(r => r.record_type === 'attendance')
          .map(r => ({
            id: r.id,
            assignment_id: r.assignment_id,
            date: r.record_date,
            time_in: r.record_data.time_in,
            time_out: r.record_data.time_out,
            total_hours: r.record_data.total_hours,
            activities: r.record_data.activities,
            status: r.status === 'approved' ? 'approved' as const : 
                   r.status === 'rejected' ? 'rejected' as const : 'pending' as const,
            preceptor_notes: r.feedback,
            created_at: r.created_at,
            practicum_assignments: r.practicum_assignments
          })),
        
        journals: records
          .filter(r => r.record_type === 'journal')
          .map(r => ({
            id: r.id,
            assignment_id: r.assignment_id,
            week_of: r.record_date,
            reflection_content: r.record_data.reflection_content,
            learning_objectives: r.record_data.learning_objectives || [],
            resources_links: r.record_data.resources_links || [],
            instructor_feedback: r.feedback,
            status: r.status === 'approved' ? 'reviewed' as const : 'pending' as const,
            created_at: r.created_at
          })),
        
        competencies: records
          .filter(r => r.record_type === 'competency')
          .map(r => ({
            id: r.id,
            assignment_id: r.assignment_id,
            competency_id: r.record_data.competency_id,
            completion_status: r.status === 'approved' ? 'approved' as const : 
                             r.status === 'rejected' ? 'rejected' as const : 'pending' as const,
            notes: r.record_data.notes,
            created_at: r.created_at
          })),
        
        evaluations: records
          .filter(r => r.record_type === 'evaluation')
          .map(r => ({
            id: r.id,
            assignment_id: r.assignment_id,
            evaluation_type: r.record_data.evaluation_type,
            competency_ratings: r.record_data.competency_ratings || {},
            overall_reflection: r.record_data.overall_reflection || '',
            learning_goals: r.record_data.learning_goals || [],
            submitted_at: r.created_at,
            status: r.status === 'approved' ? 'reviewed' as const : 'pending' as const
          }))
      };
    });
  }

  // Get student progress
  static async getStudentProgress(assignmentId: string): Promise<StudentProgress | null> {
    return supabaseWrapper.withRetry(async () => {
      // Get assignment details
      const { data: assignment, error: assignmentError } = await supabase
        .from('practicum_assignments')
        .select(`
          *,
          leads (first_name, last_name),
          practicum_sites (name),
          practicum_programs (program_name, total_hours_required, competency_requirements)
        `)
        .eq('id', assignmentId)
        .single();
      
      if (assignmentError) throw assignmentError;
      
      // Get submitted records
      const { data: records, error: recordsError } = await supabase
        .from('practicum_records')
        .select('*')
        .eq('assignment_id', assignmentId);
      
      if (recordsError) throw recordsError;
      
      const attendanceRecords = records?.filter(r => r.record_type === 'attendance') || [];
      const competencyRecords = records?.filter(r => r.record_type === 'competency') || [];
      
      // Calculate hours
      const hoursSubmitted = attendanceRecords.reduce((total, record) => 
        total + (record.record_data.total_hours || 0), 0
      );
      
      const hoursApproved = attendanceRecords
        .filter(r => r.status === 'approved')
        .reduce((total, record) => total + (record.record_data.total_hours || 0), 0);
      
      // Calculate competencies
      const competenciesCompleted = competencyRecords.filter(r => r.status === 'approved').length;
      const competenciesRequired = assignment.practicum_programs?.competency_requirements?.length || 0;
      
      // Calculate forms pending
      const formsPending = records?.filter(r => r.status === 'pending_approval').length || 0;
      
      // Calculate overall progress
      const hoursProgress = assignment.practicum_programs?.total_hours_required ? 
        (hoursApproved / assignment.practicum_programs.total_hours_required) * 100 : 0;
      
      const competencyProgress = competenciesRequired > 0 ? 
        (competenciesCompleted / competenciesRequired) * 100 : 0;
      
      const overallProgress = (hoursProgress + competencyProgress) / 2;
      
      return {
        assignment_id: assignmentId,
        student_name: `${assignment.leads?.first_name} ${assignment.leads?.last_name}`,
        program_name: assignment.practicum_programs?.program_name || 'Unknown Program',
        site_name: assignment.practicum_sites?.name || 'Unknown Site',
        hours_submitted: hoursSubmitted,
        hours_approved: hoursApproved,
        hours_required: assignment.practicum_programs?.total_hours_required || 0,
        competencies_completed: competenciesCompleted,
        competencies_required: competenciesRequired,
        forms_pending: formsPending,
        overall_progress: Math.round(overallProgress),
        status: assignment.status || 'active'
      };
    });
  }

  // Send reminder to preceptor
  static async sendReminderToPreceptor(recordId: string): Promise<void> {
    return supabaseWrapper.withRetry(async () => {
      // Update the record with reminder sent flag
      const { error } = await supabase
        .from('practicum_records')
        .update({ 
          record_data: { 
            reminder_sent_at: new Date().toISOString() 
          } 
        })
        .eq('id', recordId);
      
      if (error) throw error;
      
      // Here you could also trigger an email notification to the preceptor
      // This would typically involve calling an edge function
    });
  }
}