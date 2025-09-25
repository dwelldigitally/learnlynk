// Practicum Management TypeScript interfaces matching actual database schema

import type { Database } from "@/integrations/supabase/types";

// Direct database table types
export type PracticumSite = Database['public']['Tables']['practicum_sites']['Row'];
export type PracticumProgram = Database['public']['Tables']['practicum_programs']['Row'];
export type PracticumJourney = Database['public']['Tables']['practicum_journeys']['Row'];
export type PracticumAssignment = Database['public']['Tables']['practicum_assignments']['Row'];
export type PracticumRecord = Database['public']['Tables']['practicum_records']['Row'];
export type PracticumEvaluation = Database['public']['Tables']['practicum_evaluations']['Row'];
export type PracticumCompetency = Database['public']['Tables']['practicum_competencies']['Row'];
export type PracticumUserRole = Database['public']['Tables']['practicum_user_roles']['Row'];

// Insert types (without auto-generated fields)
export type PracticumSiteInsert = Database['public']['Tables']['practicum_sites']['Insert'];
export type PracticumProgramInsert = Database['public']['Tables']['practicum_programs']['Insert'];
export type PracticumJourneyInsert = Database['public']['Tables']['practicum_journeys']['Insert'];
export type PracticumAssignmentInsert = Database['public']['Tables']['practicum_assignments']['Insert'];
export type PracticumRecordInsert = Database['public']['Tables']['practicum_records']['Insert'];
export type PracticumEvaluationInsert = Database['public']['Tables']['practicum_evaluations']['Insert'];
export type PracticumCompetencyInsert = Database['public']['Tables']['practicum_competencies']['Insert'];
export type PracticumUserRoleInsert = Database['public']['Tables']['practicum_user_roles']['Insert'];

// Custom business logic types
export interface PracticumJourneyStep {
  [key: string]: any; // Make it compatible with Json type
  id: string;
  name: string;
  description: string;
  type: 'agreement' | 'attendance' | 'competency' | 'journal' | 'evaluation' | 'document_upload';
  required: boolean;
  approvers: string[];
  order_index: number;
  configuration: Record<string, any>;
}

// Dashboard overview types
export interface PracticumOverview {
  ready_to_end: (PracticumAssignment & {
    leads?: { first_name: string; last_name: string; };
    practicum_sites?: { name: string; };
    practicum_programs?: { program_name: string; };
  })[];
  ready_to_begin: (PracticumAssignment & {
    leads?: { first_name: string; last_name: string; };
    practicum_sites?: { name: string; };
    practicum_programs?: { program_name: string; };
  })[];
  missing_documents: (PracticumAssignment & {
    leads?: { first_name: string; last_name: string; };
    practicum_sites?: { name: string; };
    practicum_programs?: { program_name: string; };
  })[];
  delayed_students: (PracticumAssignment & {
    leads?: { first_name: string; last_name: string; };
    practicum_sites?: { name: string; };
    practicum_programs?: { program_name: string; };
  })[];
  pending_approvals: (PracticumRecord & {
    practicum_assignments?: {
      leads?: { first_name: string; last_name: string; };
      practicum_sites?: { name: string; };
    };
  })[];
}

// Progress tracking types
export interface StudentProgress {
  assignment_id: string;
  student_name: string;
  program_name: string;
  site_name: string;
  hours_submitted: number;
  hours_approved: number;
  hours_required: number;
  competencies_completed: number;
  competencies_required: number;
  forms_pending: number;
  overall_progress: number;
  status: string;
}

// Attendance specific types
export interface AttendanceRecord {
  id: string;
  assignment_id: string;
  date: string;
  time_in: string;
  time_out: string;
  total_hours: number;
  activities: string;
  preceptor_notes?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Journal specific types
export interface JournalEntry {
  id: string;
  assignment_id: string;
  week_of: string;
  reflection_content: string;
  learning_objectives: string[];
  resources_links?: string[];
  instructor_feedback?: string;
  status: 'pending' | 'reviewed';
}

// Filter and search types
export interface PracticumFilters {
  program_id?: string;
  site_id?: string;
  status?: string;
  date_range?: {
    start: string;
    end: string;
  };
  search_term?: string;
}