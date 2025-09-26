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
    clock_in_latitude?: number;
    clock_in_longitude?: number;
    clock_in_address?: string;
    clock_out_latitude?: number;
    clock_out_longitude?: number;
    clock_out_address?: string;
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
          // Store location data in the new geolocation fields
          clock_in_latitude: data.clock_in_latitude,
          clock_in_longitude: data.clock_in_longitude,
          clock_in_address: data.clock_in_address,
          clock_out_latitude: data.clock_out_latitude,
          clock_out_longitude: data.clock_out_longitude,
          clock_out_address: data.clock_out_address
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

  // Get student's practicum records using demo data
  static async getStudentRecords(assignmentId: string): Promise<{
    attendance: StudentAttendanceRecord[];
    journals: StudentJournalEntry[];
    competencies: StudentCompetencyRecord[];
    evaluations: StudentSelfEvaluation[];
  }> {
    return supabaseWrapper.withRetry(async () => {
      // Return mock records for demo
      return {
        attendance: [
          {
            id: 'att-001',
            assignment_id: assignmentId,
            date: '2024-01-15',
            time_in: '08:00',
            time_out: '16:00',
            total_hours: 8,
            activities: 'Patient care and medication administration',
            status: 'approved' as const,
            preceptor_notes: 'Excellent performance with medication safety protocols',
            created_at: '2024-01-15T16:30:00Z'
          },
          {
            id: 'att-002',
            assignment_id: assignmentId,
            date: '2024-01-16',
            time_in: '08:00',
            time_out: '16:00',
            total_hours: 8,
            activities: 'Wound care and patient education',
            status: 'pending' as const,
            created_at: '2024-01-16T16:30:00Z'
          }
        ],
        
        journals: [
          {
            id: 'jour-001',
            assignment_id: assignmentId,
            week_of: '2024-01-15',
            reflection_content: 'This week I gained valuable experience in patient care. I learned about the importance of clear communication and empathy when working with patients.',
            learning_objectives: ['Improve patient communication skills', 'Master medication administration'],
            resources_links: ['https://nursingjournal.com/communication'],
            instructor_feedback: 'Good reflection on communication skills',
            status: 'reviewed' as const,
            created_at: '2024-01-19T10:00:00Z'
          }
        ],
        
        competencies: [
          {
            id: 'comp-001',
            assignment_id: assignmentId,
            competency_id: 'vital-signs',
            completion_status: 'approved' as const,
            notes: 'Successfully demonstrated proper vital signs measurement',
            created_at: '2024-01-15T14:00:00Z'
          },
          {
            id: 'comp-002',
            assignment_id: assignmentId,
            competency_id: 'medication-admin',
            completion_status: 'pending' as const,
            notes: 'Practiced medication administration under supervision',
            created_at: '2024-01-16T11:00:00Z'
          }
        ],
        
        evaluations: [
          {
            id: 'eval-001',
            assignment_id: assignmentId,
            evaluation_type: 'midterm' as const,
            competency_ratings: {
              communication: { self_rating: 'satisfactory', comments: 'Good rapport with patients' },
              clinical_skills: { self_rating: 'making_progress', comments: 'Improving with practice' }
            },
            overall_reflection: 'I am developing confidence in my clinical skills and building better relationships with patients.',
            learning_goals: ['Improve time management', 'Enhance assessment skills'],
            submitted_at: '2024-01-20T15:00:00Z',
            status: 'pending' as const
          }
        ]
      };
    });
  }

  // Get student progress using demo data
  static async getStudentProgress(assignmentId: string) {
    return supabaseWrapper.withRetry(async () => {
      // Return mock progress data for demo
      return {
        assignment_id: assignmentId,
        student_name: 'Demo Student',
        program_name: 'Clinical Nursing Program - Advanced Practice',
        site_name: "St. Mary's General Hospital",
        hours_submitted: 45,
        hours_approved: 35,
        hours_required: 120,
        competencies_completed: 7,
        competencies_required: 15,
        forms_pending: 2,
        overall_progress: 65,
        status: 'active'
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