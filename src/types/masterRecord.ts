export type Stage = 'lead' | 'applicant' | 'student';

export type LeadSubstage = 'new_inquiry' | 'qualification' | 'nurturing' | 'ready_to_apply';
export type ApplicantSubstage = 'application_started' | 'documents_submitted' | 'under_review' | 'decision_pending' | 'approved' | 'rejected';
export type StudentSubstage = 'enrolled' | 'orientation' | 'active' | 'graduated' | 'alumni' | 'withdrawn';

export type Substage = LeadSubstage | ApplicantSubstage | StudentSubstage;

export interface MasterRecord {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  current_stage: Stage;
  current_substage?: Substage;
  source: string;
  source_details?: string;
  program_interest?: string[];
  tags?: string[];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer_url?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
  stage_entered_at: string;
}

export interface StageHistory {
  id: string;
  master_record_id: string;
  from_stage?: Stage;
  to_stage: Stage;
  from_substage?: Substage;
  to_substage?: Substage;
  transition_reason?: string;
  transitioned_by?: string;
  transitioned_at: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface StageTransitionRequest {
  master_record_id: string;
  to_stage: Stage;
  to_substage?: Substage;
  transition_reason?: string;
  metadata?: Record<string, any>;
}

export interface CustomField {
  id: string;
  user_id: string;
  stage: Stage;
  field_name: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'radio';
  field_label: string;
  field_options?: string[];
  is_required: boolean;
  is_enabled: boolean;
  order_index: number;
  validation_rules?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface StageSubstage {
  id: string;
  user_id: string;
  stage: Stage;
  substage_key: string;
  substage_name: string;
  substage_description?: string;
  order_index: number;
  is_active: boolean;
  transition_criteria?: Record<string, any>;
  created_at: string;
  updated_at: string;
}