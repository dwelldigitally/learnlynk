import { supabase } from "@/integrations/supabase/client";
import { supabaseWrapper } from "./supabaseWrapper";

// Using actual database schema from Supabase types
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
  notes?: string;
  created_at: string;
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
  // Get student's practicum assignments with proper joins
  static async getStudentAssignments(leadId: string) {
    return supabaseWrapper.withRetry(async () => {
      // For demo purposes, create a mock assignment since we don't have real data
      const mockAssignment = {
        id: 'demo-assignment-1',
        lead_id: leadId,
        site_id: 'demo-site-1',
        program_id: 'demo-program-1',
        journey_id: 'demo-journey-1',
        instructor_id: 'demo-instructor-1',
        start_date: '2024-01-01',
        end_date: '2024-06-01',
        hours_completed: 0,
        hours_approved: 0,
        completion_percentage: 0,
        current_step: 1,
        status: 'active',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'demo-user',
        practicum_sites: {
          id: 'demo-site-1',
          name: 'St. Mary\'s General Hospital',
          address: '123 Medical Center Drive, Suite 400, Healthcare City, HC 12345',
          contact_person: 'Dr. Sarah Johnson, RN',
          contact_email: 'sarah.johnson@stmarys.hospital.com',
          contact_phone: '(555) 123-4567'
        },
        practicum_programs: {
          id: 'demo-program-1',
          program_name: 'Clinical Nursing Program - Advanced Practice',
          total_hours_required: 120
        },
        practicum_journeys: {
          id: 'demo-journey-1',
          journey_name: 'Nursing Clinical Experience',
          steps: []
        },
        // Additional instructor/preceptor information
        instructor: {
          name: 'Prof. Michael Thompson, MSN',
          email: 'mthompson@nursing.edu',
          phone: '(555) 987-6543',
          role: 'Clinical Instructor'
        },
        preceptor: {
          name: 'Nurse Manager Lisa Rodriguez, BSN',
          email: 'lrodriguez@stmarys.hospital.com', 
          phone: '(555) 456-7890',
          role: 'Clinical Preceptor',
          department: 'Medical-Surgical Unit'
        }
      };
      
      return [mockAssignment];
    });
  }

  // Submit attendance record using actual schema
  static async submitAttendanceRecord(data: {
    assignment_id: string;
    date: string;
    time_in: string;
    time_out: string;
    activities: string;
    preceptor_id?: string;
    location_data?: {
      clock_in: any;
      clock_out: any;
    };
  }): Promise<StudentAttendanceRecord> {
    return supabaseWrapper.withRetry(async () => {
      // Calculate total hours
      const timeIn = new Date(`${data.date}T${data.time_in}`);
      const timeOut = new Date(`${data.date}T${data.time_out}`);
      const totalHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);

      const { data: record, error } = await supabase
        .from('practicum_records')
        .insert({
          assignment_id: data.assignment_id,
          student_id: 'demo-student', // Required field - would be from context in real app
          record_type: 'attendance',
          record_date: data.date,
          time_in: data.time_in,
          time_out: data.time_out,
          hours_submitted: totalHours,
          student_notes: data.activities,
          final_status: 'pending_approval',
          // Store location data in evaluation_data field as JSON
          evaluation_data: data.location_data ? {
            clock_in_location: data.location_data.clock_in,
            clock_out_location: data.location_data.clock_out
          } : null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: record.id,
        assignment_id: record.assignment_id!,
        date: data.date,
        time_in: data.time_in,
        time_out: data.time_out,
        total_hours: totalHours,
        activities: data.activities,
        status: 'pending' as const,
        created_at: record.created_at
      };
    });
  }

  // Submit weekly journal using actual schema
  static async submitWeeklyJournal(data: {
    assignment_id: string;
    week_of: string;
    reflection_content: string;
    learning_objectives: string[];
    resources_links?: string[];
  }): Promise<StudentJournalEntry> {
    return supabaseWrapper.withRetry(async () => {
      const { data: record, error } = await supabase
        .from('practicum_records')
        .insert({
          assignment_id: data.assignment_id,
          student_id: 'demo-student', // Required field - would be from context in real app
          record_type: 'journal',
          record_date: data.week_of,
          student_notes: data.reflection_content,
          evaluation_data: {
            learning_objectives: data.learning_objectives,
            resources_links: data.resources_links || []
          },
          final_status: 'pending_approval'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: record.id,
        assignment_id: record.assignment_id!,
        week_of: data.week_of,
        reflection_content: data.reflection_content,
        learning_objectives: data.learning_objectives,
        resources_links: data.resources_links,
        status: 'pending' as const,
        created_at: record.created_at
      };
    });
  }

  // Submit competency record using actual schema
  static async submitCompetencyRecord(data: {
    assignment_id: string;
    competency_ids: string[];
    notes?: string;
  }): Promise<StudentCompetencyRecord[]> {
    return supabaseWrapper.withRetry(async () => {
      const records = await Promise.all(
        data.competency_ids.map(async (competencyId) => {
          const { data: record, error } = await supabase
            .from('practicum_records')
            .insert({
              assignment_id: data.assignment_id,
              student_id: 'demo-student', // Required field - would be from context in real app
              record_type: 'competency',
              competency_id: competencyId,
              record_date: new Date().toISOString().split('T')[0],
              student_notes: data.notes,
              final_status: 'pending_approval'
            })
            .select()
            .single();
          
          if (error) throw error;
          
          return {
            id: record.id,
            assignment_id: record.assignment_id!,
            competency_id: competencyId,
            completion_status: 'pending' as const,
            notes: data.notes,
            created_at: record.created_at
          };
        })
      );

      return records;
    });
  }

  // Submit self-evaluation using actual schema
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
      const { data: record, error } = await supabase
        .from('practicum_records')
        .insert({
          assignment_id: data.assignment_id,
          student_id: 'demo-student', // Required field - would be from context in real app
          record_type: 'evaluation',
          record_date: new Date().toISOString().split('T')[0],
          evaluation_data: {
            evaluation_type: data.evaluation_type,
            competency_ratings: data.competency_ratings,
            overall_reflection: data.overall_reflection,
            learning_goals: data.learning_goals
          },
          final_status: 'pending_approval'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: record.id,
        assignment_id: record.assignment_id!,
        evaluation_type: data.evaluation_type,
        competency_ratings: data.competency_ratings,
        overall_reflection: data.overall_reflection,
        learning_goals: data.learning_goals,
        submitted_at: record.created_at,
        status: 'pending' as const
      };
    });
  }

  // Get student's practicum records using actual schema
  static async getStudentRecords(assignmentId: string): Promise<{
    attendance: StudentAttendanceRecord[];
    journals: StudentJournalEntry[];
    competencies: StudentCompetencyRecord[];
    evaluations: StudentSelfEvaluation[];
  }> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_records')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const records = data || [];
      
      return {
        attendance: records
          .filter(r => r.record_type === 'attendance')
          .map(r => ({
            id: r.id,
            assignment_id: r.assignment_id!,
            date: r.record_date!,
            time_in: r.time_in || '',
            time_out: r.time_out || '',
            total_hours: r.hours_submitted || 0,
            activities: r.student_notes || '',
            status: r.final_status === 'approved' ? 'approved' as const : 
                   r.final_status === 'rejected' ? 'rejected' as const : 'pending' as const,
            preceptor_notes: r.preceptor_feedback,
            created_at: r.created_at
          })),
        
        journals: records
          .filter(r => r.record_type === 'journal')
          .map(r => ({
            id: r.id,
            assignment_id: r.assignment_id!,
            week_of: r.record_date!,
            reflection_content: r.student_notes || '',
            learning_objectives: (r.evaluation_data as any)?.learning_objectives || [],
            resources_links: (r.evaluation_data as any)?.resources_links || [],
            instructor_feedback: r.preceptor_feedback,
            status: r.final_status === 'approved' ? 'reviewed' as const : 'pending' as const,
            created_at: r.created_at
          })),
        
        competencies: records
          .filter(r => r.record_type === 'competency')
          .map(r => ({
            id: r.id,
            assignment_id: r.assignment_id!,
            competency_id: r.competency_id!,
            completion_status: r.final_status === 'approved' ? 'approved' as const : 
                             r.final_status === 'rejected' ? 'rejected' as const : 'pending' as const,
            notes: r.student_notes,
            created_at: r.created_at
          })),
        
        evaluations: records
          .filter(r => r.record_type === 'evaluation')
          .map(r => ({
            id: r.id,
            assignment_id: r.assignment_id!,
            evaluation_type: (r.evaluation_data as any)?.evaluation_type || 'midterm',
            competency_ratings: (r.evaluation_data as any)?.competency_ratings || {},
            overall_reflection: (r.evaluation_data as any)?.overall_reflection || '',
            learning_goals: (r.evaluation_data as any)?.learning_goals || [],
            submitted_at: r.created_at,
            status: r.final_status === 'approved' ? 'reviewed' as const : 'pending' as const
          }))
      };
    });
  }

  // Get student progress using actual schema
  static async getStudentProgress(assignmentId: string) {
    return supabaseWrapper.withRetry(async () => {
      // Get assignment details
      const { data: assignment, error: assignmentError } = await supabase
        .from('practicum_assignments')
        .select(`
          *,
          leads!lead_id (first_name, last_name),
          practicum_sites!site_id (name),
          practicum_programs!program_id (program_name, total_hours_required)
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
        total + (record.hours_submitted || 0), 0
      );
      
      const hoursApproved = attendanceRecords
        .filter(r => r.final_status === 'approved')
        .reduce((total, record) => total + (record.hours_submitted || 0), 0);
      
      // Calculate competencies
      const competenciesCompleted = competencyRecords.filter(r => r.final_status === 'approved').length;
      const competenciesRequired = 10; // Default requirement
      
      // Calculate forms pending
      const formsPending = records?.filter(r => r.final_status === 'pending_approval').length || 0;
      
      // Calculate overall progress
      const totalHoursRequired = (assignment.practicum_programs as any)?.total_hours_required || 100;
      const hoursProgress = (hoursApproved / totalHoursRequired) * 100;
      const competencyProgress = competenciesRequired > 0 ? (competenciesCompleted / competenciesRequired) * 100 : 0;
      const overallProgress = (hoursProgress + competencyProgress) / 2;
      
      return {
        assignment_id: assignmentId,
        student_name: `${(assignment.leads as any)?.first_name} ${(assignment.leads as any)?.last_name}`,
        program_name: (assignment.practicum_programs as any)?.program_name || 'Unknown Program',
        site_name: (assignment.practicum_sites as any)?.name || 'Unknown Site',
        hours_submitted: Math.round(hoursSubmitted),
        hours_approved: Math.round(hoursApproved),
        hours_required: totalHoursRequired,
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
          preceptor_feedback: 'Reminder sent to preceptor'
        })
        .eq('id', recordId);
      
      if (error) throw error;
    });
  }
}