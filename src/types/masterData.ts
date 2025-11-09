export interface MasterProgram {
  id?: string;
  user_id: string;
  name: string;
  code?: string;
  description?: string;
  type: string;
  duration?: string;
  campus?: string;
  delivery_method: string;
  status: string;
  color: string;
  category?: string;
  tags?: string[];
  entry_requirements: any[];
  document_requirements: any[];
  fee_structure: any;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MasterCampus {
  id?: string;
  user_id: string;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone: string;
  is_active: boolean;
  capacity?: number;
  facilities?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface MasterMarketingSource {
  id?: string;
  user_id: string;
  name: string;
  category: string;
  description?: string;
  cost_per_lead?: number;
  conversion_rate: number;
  is_active: boolean;
  tracking_parameters: any;
  created_at?: string;
  updated_at?: string;
}

export interface MasterLeadStatus {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  stage: string;
  is_active: boolean;
  order_index: number;
  auto_transition_rules: any;
  created_at?: string;
  updated_at?: string;
}

export interface MasterCallType {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  duration_estimate?: number;
  follow_up_required: boolean;
  template_notes?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MasterCommunicationTemplate {
  id?: string;
  user_id: string;
  name: string;
  type: string;
  category?: string;
  subject?: string;
  content: string;
  variables: any;
  conditional_logic: any;
  is_system_template: boolean;
  is_active: boolean;
  usage_count: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface MasterDocumentTemplate {
  id?: string;
  user_id: string;
  name: string;
  type: string;
  category?: string;
  description?: string;
  stage: string;
  mandatory: boolean;
  accepted_formats: string[];
  max_size: number;
  instructions?: string;
  examples?: string[];
  applicable_programs: string[];
  is_system_template: boolean;
  is_active: boolean;
  usage_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface MasterRequirement {
  id?: string;
  user_id: string;
  name: string;
  type: string;
  category?: string;
  description?: string;
  minimum_value?: string;
  maximum_value?: string;
  units?: string;
  is_mandatory: boolean;
  applicable_programs: string[];
  verification_method?: string;
  documentation_required?: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MasterLeadPriority {
  id?: string;
  user_id: string;
  name: string;
  level: number;
  color: string;
  description?: string;
  auto_assignment_rules: any;
  sla_hours?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MasterTeam {
  id?: string;
  user_id: string;
  name: string;
  type: string;
  description?: string;
  specializations?: string[];
  region?: string;
  max_daily_assignments: number;
  working_hours: any;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  performance_metrics: any;
  created_at?: string;
  updated_at?: string;
}

export interface MasterNotificationFilter {
  id?: string;
  user_id: string;
  name: string;
  type: string;
  event_types: string[];
  conditions: any;
  recipients: any[];
  template_id?: string;
  is_active: boolean;
  frequency: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConfigurationMetadata {
  id?: string;
  user_id: string;
  category: string;
  key: string;
  value: any;
  data_type: string;
  description?: string;
  is_system_setting: boolean;
  is_encrypted: boolean;
  validation_rules: any;
  created_at?: string;
  updated_at?: string;
}

export interface MasterStage {
  id?: string;
  user_id: string;
  stage_type: string;
  stage_key: string;
  stage_name: string;
  stage_description?: string;
  substages: any[];
  order_index: number;
  is_active: boolean;
  transition_rules: any;
  required_fields?: string[];
  automation_triggers: any[];
  created_at?: string;
  updated_at?: string;
}

export type MasterDataType = 
  | MasterProgram
  | MasterCampus
  | MasterMarketingSource
  | MasterLeadStatus
  | MasterCallType
  | MasterCommunicationTemplate
  | MasterDocumentTemplate
  | MasterRequirement
  | MasterLeadPriority
  | MasterTeam
  | MasterNotificationFilter
  | ConfigurationMetadata
  | MasterStage;