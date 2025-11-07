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