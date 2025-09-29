export interface StudentBatch {
  id: string;
  user_id: string;
  batch_name: string;
  program_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export interface BatchStudent {
  id: string;
  batch_id: string;
  assignment_id: string;
  added_at: string;
}

export interface SchedulingSession {
  id: string;
  user_id: string;
  session_name: string;
  batch_id?: string;
  total_students: number;
  assigned_students: number;
  session_data: Record<string, any>;
  started_at: string;
  completed_at?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
}

export interface SiteCapacityTracking {
  id: string;
  site_id: string;
  program_id: string;
  max_capacity: number;
  current_assignments: number;
  available_spots: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export interface SchedulingPreference {
  id: string;
  user_id: string;
  preference_type: string;
  preference_value: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SmartAssignmentSuggestion {
  assignment_id: string;
  student_name: string;
  program_name: string;
  suggested_sites: SiteSuggestion[];
  confidence_score: number;
  reasoning: string[];
}

export interface SiteSuggestion {
  site_id: string;
  site_name: string;
  program_match_score: number;
  capacity_score: number;
  overall_score: number;
  available_spots: number;
  max_capacity: number;
  specializations: string[];
  distance?: number;
  reasoning: string[];
}

export interface BatchAssignmentRequest {
  batch_id: string;
  assignments: Array<{
    assignment_id: string;
    site_id: string;
  }>;
}

export interface SchedulingConflict {
  type: 'capacity_exceeded' | 'program_mismatch' | 'date_conflict';
  assignment_id: string;
  site_id: string;
  message: string;
  suggested_alternatives?: string[];
}

export interface SchedulingStats {
  total_batches: number;
  active_assignments: number;
  available_capacity: number;
  utilization_rate: number;
  programs_overview: Array<{
    program_id: string;
    program_name: string;
    total_students: number;
    assigned_students: number;
    available_sites: number;
  }>;
}