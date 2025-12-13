export type LeadSource = 
  | 'web'
  | 'social_media'
  | 'event'
  | 'agent'
  | 'email'
  | 'referral'
  | 'phone'
  | 'walk_in'
  | 'api_import'
  | 'csv_import'
  | 'chatbot'
  | 'ads'
  | 'forms'
  | 'webform';

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'nurturing'
  | 'converted'
  | 'lost'
  | 'unqualified';

export type LeadStage = 
  | 'NEW_INQUIRY'
  | 'QUALIFICATION'
  | 'NURTURING'
  | 'PROPOSAL_SENT'
  | 'APPLICATION_STARTED'
  | 'CONVERTED'
  | 'LOST';

export type LeadPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type AssignmentMethod = 
  | 'manual'
  | 'round_robin'
  | 'ai_based'
  | 'geography'
  | 'performance'
  | 'team_based'
  | 'territory_based'
  | 'workload_based';

export type LifecycleStage = 
  | 'new'
  | 'lead'
  | 'marketing_qualified'
  | 'sales_qualified'
  | 'opportunity'
  | 'customer'
  | 'evangelist'
  | 'other';

export interface LeadStageHistoryEntry {
  id: string;
  lead_id: string;
  stage: string;
  entered_at: string;
  exited_at?: string;
  cumulative_time_seconds: number;
  latest_time_seconds: number;
  tenant_id?: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  source: LeadSource;
  source_details?: string;
  status: LeadStatus;
  stage?: LeadStage;
  priority: LeadPriority;
  lead_score: number;
  ai_score?: number;
  program_interest: string[];
  intake_period?: string;
  preferred_intake_id?: string;
  preferred_campus_id?: string;
  academic_term_id?: string;
  assigned_to?: string;
  assigned_at?: string;
  assignment_method?: AssignmentMethod;
  tags: string[];
  notes?: string;
  last_contacted_at?: string;
  next_follow_up_at?: string;
  qualification_stage?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer_url?: string;
  ip_address?: string;
  user_agent?: string;
  // AI Agent fields
  ai_agent_id?: string;
  ai_managed?: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;

  // NEW: Location extended
  postal_code?: string;
  time_zone?: string;

  // NEW: Activity Metrics (auto-calculated)
  call_count?: number;
  meeting_count?: number;
  number_of_sales_activities?: number;
  number_of_times_contacted?: number;
  number_of_form_submissions?: number;
  number_of_page_views?: number;

  // NEW: Conversion Tracking
  first_conversion?: string;
  first_conversion_date?: string;

  // NEW: Engagement Dates
  last_engagement_date?: string;
  date_of_first_engagement?: string;

  // NEW: Response Metrics (in milliseconds)
  lead_response_time?: number;
  time_to_first_touch?: number;

  // NEW: System Fields
  created_by_user_id?: string;
  updated_by_user_id?: string;

  // NEW: Email Preferences
  unsubscribed_from_all_email?: boolean;

  // NEW: Traffic Source
  latest_traffic_source_date?: string;

  // NEW: Lead Classification
  lead_type?: string;
  lifecycle_stage?: string; // Dynamic from system_properties

  // NEW: Merge Tracking
  merge_record_ids?: string[];

  // NEW: Owner Assignment
  owner_assigned_date?: string;

  // Computed fields (fetched via joins or calculated)
  days_to_intake_start?: number;
  stage_history?: LeadStageHistoryEntry[];
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  activity_description: string;
  activity_data?: any;
  performed_by?: string;
  performed_at: string;
  created_at: string;
}

export interface LeadRoutingRule {
  id: string;
  name: string;
  description?: string;
  priority: number;
  is_active: boolean;
  conditions: Record<string, any>;
  assignment_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AdvisorPerformance {
  id: string;
  advisor_id: string;
  period_start: string;
  period_end: string;
  leads_assigned: number;
  leads_contacted: number;
  leads_converted: number;
  response_time_avg?: number;
  conversion_rate?: number;
  performance_tier: string;
  is_available: boolean;
  max_daily_assignments: number;
  created_at: string;
  updated_at: string;
}

export interface LeadFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  source: LeadSource;
  source_details?: string;
  program_interest: string[];
  preferred_intake_id?: string;
  academic_term_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  notes?: string;
}

export interface LeadAssignmentRequest {
  lead_id: string;
  assigned_to: string;
  assignment_method: AssignmentMethod;
  notes?: string;
}

export interface LeadSearchFilters {
  status?: LeadStatus[];
  stage?: LeadStage[];
  source?: LeadSource[];
  priority?: LeadPriority[];
  assigned_to?: string[];
  program_interest?: string[];
  tags?: string[];
  date_range?: {
    start: Date;
    end: Date;
  };
  lead_score_range?: {
    min: number;
    max: number;
  };
}

// Property categories for organizing lead properties in UI
export const LEAD_PROPERTY_CATEGORIES = {
  personal: {
    label: 'Personal Information',
    properties: ['first_name', 'last_name', 'email', 'phone']
  },
  location: {
    label: 'Location',
    properties: ['city', 'state', 'country', 'postal_code', 'time_zone']
  },
  classification: {
    label: 'Classification',
    properties: ['source', 'source_details', 'status', 'stage', 'priority', 'lead_type', 'lifecycle_stage']
  },
  scores: {
    label: 'Scores',
    properties: ['lead_score', 'ai_score']
  },
  activity: {
    label: 'Activity Metrics',
    properties: ['call_count', 'meeting_count', 'number_of_sales_activities', 'number_of_times_contacted', 'number_of_form_submissions', 'number_of_page_views']
  },
  engagement: {
    label: 'Engagement',
    properties: ['last_contacted_at', 'last_engagement_date', 'date_of_first_engagement', 'lead_response_time', 'time_to_first_touch', 'next_follow_up_at']
  },
  conversion: {
    label: 'Conversion',
    properties: ['first_conversion', 'first_conversion_date']
  },
  assignment: {
    label: 'Assignment',
    properties: ['assigned_to', 'assigned_at', 'assignment_method', 'owner_assigned_date']
  },
  program: {
    label: 'Program & Intake',
    properties: ['program_interest', 'preferred_intake_id', 'preferred_campus_id', 'academic_term_id', 'intake_period', 'days_to_intake_start']
  },
  marketing: {
    label: 'Marketing / UTM',
    properties: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'referrer_url', 'latest_traffic_source_date']
  },
  email: {
    label: 'Email Preferences',
    properties: ['unsubscribed_from_all_email']
  },
  system: {
    label: 'System',
    properties: ['id', 'created_at', 'updated_at', 'created_by_user_id', 'updated_by_user_id', 'user_id', 'merge_record_ids']
  },
  ai: {
    label: 'AI Management',
    properties: ['ai_agent_id', 'ai_managed', 'ai_score']
  },
  tags: {
    label: 'Tags & Notes',
    properties: ['tags', 'notes', 'qualification_stage']
  }
} as const;

// Property display metadata
export const LEAD_PROPERTY_METADATA: Record<string, {
  label: string;
  type: 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'array' | 'duration' | 'email' | 'phone';
  editable: boolean;
  description?: string;
}> = {
  // Personal
  first_name: { label: 'First Name', type: 'text', editable: true },
  last_name: { label: 'Last Name', type: 'text', editable: true },
  email: { label: 'Email', type: 'email', editable: true },
  phone: { label: 'Phone', type: 'phone', editable: true },
  
  // Location
  city: { label: 'City', type: 'text', editable: true },
  state: { label: 'State/Province', type: 'text', editable: true },
  country: { label: 'Country/Region', type: 'text', editable: true },
  postal_code: { label: 'Postal Code', type: 'text', editable: true },
  time_zone: { label: 'Time Zone', type: 'text', editable: true },
  
  // Classification
  source: { label: 'Record Source', type: 'text', editable: true, description: 'How the contact was created' },
  source_details: { label: 'Source Details', type: 'text', editable: true },
  status: { label: 'Status', type: 'text', editable: true },
  stage: { label: 'Stage', type: 'text', editable: true },
  priority: { label: 'Priority', type: 'text', editable: true },
  lead_type: { label: 'Lead Type', type: 'text', editable: true },
  lifecycle_stage: { label: 'Lifecycle Stage', type: 'text', editable: true, description: 'Where the contact is in the marketing/sales process' },
  
  // Scores
  lead_score: { label: 'Lead Score', type: 'number', editable: true },
  ai_score: { label: 'AI Score', type: 'number', editable: false },
  
  // Activity Metrics
  call_count: { label: 'Call Count', type: 'number', editable: false, description: 'Total number of calls made to the lead' },
  meeting_count: { label: 'Meeting Count', type: 'number', editable: false, description: 'Total number of meetings booked with this lead' },
  number_of_sales_activities: { label: 'Number of Sales Activities', type: 'number', editable: false, description: 'Total sales activities including calls, emails, meetings, notes, and tasks' },
  number_of_times_contacted: { label: 'Number of Times Contacted', type: 'number', editable: false, description: 'Total logged sales activities (excludes tasks and notes)' },
  number_of_form_submissions: { label: 'Number of Form Submissions', type: 'number', editable: false, description: 'Number of forms the contact has submitted' },
  number_of_page_views: { label: 'Number of Page Views', type: 'number', editable: false, description: 'Sum of all pages the contact has seen' },
  
  // Engagement
  last_contacted_at: { label: 'Last Contacted', type: 'datetime', editable: false, description: 'Last date/time of chat, call, email, meeting, or message' },
  last_engagement_date: { label: 'Last Engagement Date', type: 'datetime', editable: false, description: 'Last date/time of email opens, clicks, revisits, meetings, or form submissions' },
  date_of_first_engagement: { label: 'Date of First Engagement', type: 'datetime', editable: false, description: 'When the current owner first engaged with the contact' },
  lead_response_time: { label: 'Lead Response Time', type: 'duration', editable: false, description: 'Time for first qualifying engagement (ms)' },
  time_to_first_touch: { label: 'Time to First Touch', type: 'duration', editable: false, description: 'Time between lead creation and first outreach activity' },
  next_follow_up_at: { label: 'Next Follow-up', type: 'datetime', editable: true },
  
  // Conversion
  first_conversion: { label: 'First Conversion', type: 'text', editable: false, description: 'First landing page and form the contact submitted on' },
  first_conversion_date: { label: 'First Conversion Date', type: 'datetime', editable: false, description: 'Date the contact first submitted a form' },
  
  // Assignment
  assigned_to: { label: 'Assigned To', type: 'text', editable: true },
  assigned_at: { label: 'Assigned At', type: 'datetime', editable: false },
  assignment_method: { label: 'Assignment Method', type: 'text', editable: false },
  owner_assigned_date: { label: 'Owner Assigned Date', type: 'datetime', editable: false, description: 'Most recent timestamp of when an owner was assigned' },
  
  // Program & Intake
  program_interest: { label: 'Program Interest', type: 'array', editable: true },
  preferred_intake_id: { label: 'Preferred Intake', type: 'text', editable: true },
  preferred_campus_id: { label: 'Preferred Campus', type: 'text', editable: true, description: 'The campus where the lead prefers to study' },
  academic_term_id: { label: 'Academic Term', type: 'text', editable: true },
  intake_period: { label: 'Intake Period', type: 'text', editable: true },
  days_to_intake_start: { label: 'Days to Intake Start', type: 'number', editable: false, description: 'Days until the intake starts' },
  
  // Marketing
  utm_source: { label: 'UTM Source', type: 'text', editable: true },
  utm_medium: { label: 'UTM Medium', type: 'text', editable: true },
  utm_campaign: { label: 'UTM Campaign', type: 'text', editable: true },
  utm_content: { label: 'UTM Content', type: 'text', editable: true },
  utm_term: { label: 'UTM Term', type: 'text', editable: true },
  referrer_url: { label: 'Referrer URL', type: 'text', editable: false },
  latest_traffic_source_date: { label: 'Latest Traffic Source Date', type: 'datetime', editable: false, description: 'Date of most recent interaction with your business' },
  
  // Email
  unsubscribed_from_all_email: { label: 'Unsubscribed from All Email', type: 'boolean', editable: true, description: 'Email address has opted out of all email' },
  
  // System
  id: { label: 'Record ID', type: 'text', editable: false, description: 'Unique identifier for the contact' },
  created_at: { label: 'Created Date', type: 'datetime', editable: false },
  updated_at: { label: 'Last Modified Date', type: 'datetime', editable: false, description: 'Most recent date any property was updated' },
  created_by_user_id: { label: 'Created By User ID', type: 'text', editable: false, description: 'User who created the contact' },
  updated_by_user_id: { label: 'Updated By User ID', type: 'text', editable: false, description: 'User who last updated the contact' },
  user_id: { label: 'User ID', type: 'text', editable: false },
  merge_record_ids: { label: 'Merge Record IDs', type: 'array', editable: false, description: 'List of record IDs merged into this record' },
  
  // AI
  ai_agent_id: { label: 'AI Agent ID', type: 'text', editable: false },
  ai_managed: { label: 'AI Managed', type: 'boolean', editable: false },
  
  // Tags & Notes
  tags: { label: 'Tags', type: 'array', editable: true },
  notes: { label: 'Notes', type: 'text', editable: true },
  qualification_stage: { label: 'Qualification Stage', type: 'text', editable: true },
};
