export interface RequirementVerification {
  id: string;
  document_id: string;
  requirement_id: string;
  extracted_value?: string;
  meets_requirement: boolean;
  verification_method: 'manual' | 'ai' | 'ocr';
  verified_by?: string;
  verified_at?: Date;
  verification_notes?: string;
  confidence_score?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProgramRequirement {
  id: string;
  program_id: string;
  requirement_id: string;
  minimum_value_override?: string;
  maximum_value_override?: string;
  is_mandatory: boolean;
  custom_verification_notes?: string;
  created_at: Date;
  updated_at: Date;
  requirement?: MasterRequirement;
}

export interface MasterRequirement {
  id: string;
  user_id: string;
  name: string;
  type: string;
  category?: string;
  description?: string;
  minimum_value?: string;
  maximum_value?: string;
  units?: string;
  is_mandatory: boolean;
  documentation_required?: string[];
  verification_method?: string;
  applicable_programs?: string[];
  linked_document_templates?: string[];
  usage_count: number;
  is_system_template: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type VerificationStatus = 'not_checked' | 'meets_requirement' | 'below_requirement' | 'manual_review_needed';

export interface DocumentWithVerification {
  id: string;
  document_name: string;
  document_type: string;
  requirement_id?: string;
  requirement_verification_status: VerificationStatus;
  extracted_value?: string;
  requirement_notes?: string;
  admin_status: string;
  file_path?: string;
  created_at: Date;
  verification?: RequirementVerification;
  requirement?: MasterRequirement;
}
