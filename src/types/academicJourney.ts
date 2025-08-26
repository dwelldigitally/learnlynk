// Academic Journey Types
export interface JourneyTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  program_type?: string;
  complexity_level: 'simple' | 'medium' | 'complex';
  estimated_duration_days?: number;
  is_system_template: boolean;
  is_master_template: boolean;
  student_type: 'domestic' | 'international' | 'all';
  inherits_from_template_id?: string;
  usage_count: number;
  template_data: JourneyTemplateData;
  created_at: string;
  updated_at: string;
}

export interface JourneyTemplateData {
  stages: JourneyStageTemplate[];
  default_timings: TimingConfig;
  communication_rules: ChannelRuleTemplate[];
}

export interface JourneyStageTemplate {
  name: string;
  description?: string;
  stage_type: StageType;
  order_index: number;
  timing_config: TimingConfig;
  requirements: RequirementTemplate[];
  channel_rules: ChannelRuleTemplate[];
}

export interface AcademicJourney {
  id: string;
  user_id: string;
  program_id?: string;
  template_id?: string;
  name: string;
  description?: string;
  version: number;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  stages?: JourneyStage[];
}

export interface JourneyStage {
  id: string;
  journey_id: string;
  parent_stage_id?: string;
  name: string;
  description?: string;
  stage_type: StageType;
  order_index: number;
  is_required: boolean;
  is_parallel: boolean;
  status: 'active' | 'inactive' | 'completed';
  timing_config: TimingConfig;
  completion_criteria: CompletionCriteria;
  escalation_rules: EscalationRules;
  created_at: string;
  updated_at: string;
  requirements?: JourneyRequirement[];
  channel_rules?: JourneyChannelRule[];
}

export interface JourneyRequirement {
  id: string;
  stage_id: string;
  document_template_id?: string;
  name: string;
  description?: string;
  requirement_type: RequirementType;
  is_mandatory: boolean;
  order_index: number;
  verification_method: 'manual' | 'automated' | 'document_upload' | 'test_score';
  validation_rules: ValidationRules;
  reminder_schedule: ReminderSchedule;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface JourneyChannelRule {
  id: string;
  stage_id: string;
  channel_type: ChannelType;
  is_allowed: boolean;
  priority_threshold: PriorityLevel;
  conditions: ChannelConditions;
  time_restrictions: TimeRestrictions;
  frequency_limits: FrequencyLimits;
  created_at: string;
  updated_at: string;
}

// Supporting Types
export type StageType = 'lead_capture' | 'application_start' | 'prerequisites' | 'language_test' | 'documents' | 'interview' | 'admission_decision' | 'visa_support' | 'contract_signing' | 'deposit_payment' | 'enrollment_complete' | 'custom';

export type RequirementType = 'document' | 'test' | 'interview' | 'payment' | 'form' | 'verification' | 'custom';

export type ChannelType = 'email' | 'sms' | 'call' | 'in_person' | 'video_call' | 'portal_message';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface TimingConfig {
  expected_duration_days?: number;
  stall_threshold_days: number;
  urgent_threshold_days?: number;
  auto_escalate_after_days?: number;
  business_hours_only?: boolean;
  timezone?: string;
}

export interface CompletionCriteria {
  all_requirements_met?: boolean;
  specific_requirements?: string[];
  approval_required?: boolean;
  auto_advance?: boolean;
  custom_logic?: Record<string, any>;
}

export interface EscalationRules {
  escalate_after_days?: number;
  escalate_to?: string[];
  escalation_actions?: string[];
  repeat_escalation?: boolean;
  max_escalations?: number;
}

export interface ValidationRules {
  min_score?: number;
  max_file_size_mb?: number;
  allowed_formats?: string[];
  expiration_days?: number;
  custom_validation?: Record<string, any>;
}

export interface ReminderSchedule {
  initial_delay_days?: number;
  reminder_intervals_days: number[];
  max_reminders?: number;
  escalate_after_reminders?: number;
}

export interface ChannelConditions {
  student_consent?: boolean;
  engagement_score_min?: number;
  previous_contact_hours?: number;
  program_stage?: string[];
  custom_conditions?: Record<string, any>;
}

export interface TimeRestrictions {
  business_hours_only?: boolean;
  timezone?: string;
  allowed_days?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  blackout_periods?: TimeRange[];
}

export interface FrequencyLimits {
  max_per_day?: number;
  max_per_week?: number;
  min_hours_between?: number;
  respect_quiet_hours?: boolean;
}

export interface TimeRange {
  start_time: string; // HH:MM format
  end_time: string;   // HH:MM format
  timezone?: string;
}

// Template Types for Builder
export interface RequirementTemplate {
  name: string;
  requirement_type: RequirementType;
  is_mandatory: boolean;
  validation_rules?: Partial<ValidationRules>;
}

export interface ChannelRuleTemplate {
  channel_type: ChannelType;
  is_allowed: boolean;
  priority_threshold: PriorityLevel;
  conditions?: Partial<ChannelConditions>;
}

// Wizard State Management
export interface JourneyWizardState {
  name: string;
  description: string;
  selectedTemplate: JourneyTemplate | null;
  programId: string | null;
  customStages: RequirementTemplate[];
  metadata: Record<string, any>;
}

// Pre-built Journey Templates
export const JOURNEY_STAGE_TYPES: Record<StageType, { label: string; description: string; icon: string }> = {
  lead_capture: { label: 'Lead Capture', description: 'Initial lead inquiry received', icon: '👤' },
  application_start: { label: 'Application Start', description: 'Student begins application process', icon: '📝' },
  prerequisites: { label: 'Prerequisites', description: 'Verify academic prerequisites', icon: '✅' },
  language_test: { label: 'Language Test', description: 'English proficiency testing', icon: '🗣️' },
  documents: { label: 'Documents', description: 'Document submission and verification', icon: '📄' },
  interview: { label: 'Interview', description: 'Admission interview', icon: '🎤' },
  admission_decision: { label: 'Admission Decision', description: 'Review and admission decision', icon: '🎓' },
  visa_support: { label: 'Visa Support', description: 'Visa application assistance', icon: '📋' },
  contract_signing: { label: 'Contract Signing', description: 'Sign enrollment contract', icon: '📋' },
  deposit_payment: { label: 'Deposit Payment', description: 'Submit enrollment deposit', icon: '💰' },
  enrollment_complete: { label: 'Enrollment Complete', description: 'Student enrollment finalized', icon: '🚀' },
  custom: { label: 'Custom', description: 'Program-specific custom stage', icon: '⚙️' }
};

export const REQUIREMENT_TYPES: Record<RequirementType, { label: string; description: string; icon: string }> = {
  document: { label: 'Document', description: 'File upload requirement', icon: '📎' },
  test: { label: 'Test', description: 'Standardized test or assessment', icon: '📊' },
  interview: { label: 'Interview', description: 'Personal or video interview', icon: '🎤' },
  payment: { label: 'Payment', description: 'Fee or deposit payment', icon: '💳' },
  form: { label: 'Form', description: 'Online form completion', icon: '📋' },
  verification: { label: 'Verification', description: 'Identity or credential verification', icon: '✅' },
  custom: { label: 'Custom', description: 'Program-specific requirement', icon: '⚙️' }
};

export const CHANNEL_TYPES: Record<ChannelType, { label: string; description: string; icon: string }> = {
  email: { label: 'Email', description: 'Email communication', icon: '✉️' },
  sms: { label: 'SMS', description: 'Text message communication', icon: '💬' },
  call: { label: 'Phone Call', description: 'Voice call communication', icon: '📞' },
  in_person: { label: 'In Person', description: 'Face-to-face meeting', icon: '👥' },
  video_call: { label: 'Video Call', description: 'Video conference call', icon: '📹' },
  portal_message: { label: 'Portal Message', description: 'Student portal message', icon: '🔔' }
};

// New types for student journey tracking
export interface StudentJourneyInstance {
  id: string;
  lead_id: string;
  journey_id: string;
  current_stage_id?: string;
  student_type: 'domestic' | 'international';
  started_at: string;
  completed_at?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  progress_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface JourneyStageProgress {
  id: string;
  journey_instance_id: string;
  stage_id: string;
  started_at: string;
  completed_at?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';
  completion_data: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}