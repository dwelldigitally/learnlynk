// Lead Communication Types
export type CommunicationType = 'email' | 'phone' | 'sms' | 'meeting' | 'note';
export type CommunicationDirection = 'inbound' | 'outbound';
export type CommunicationStatus = 'completed' | 'scheduled' | 'failed';

export interface LeadCommunication {
  id: string;
  lead_id: string;
  user_id: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  subject?: string;
  content: string;
  communication_date: string;
  status: CommunicationStatus;
  scheduled_for?: string;
  metadata?: Record<string, any>;
  // AI-related fields
  is_ai_generated?: boolean;
  ai_agent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunicationFormData {
  type: CommunicationType;
  direction: CommunicationDirection;
  subject?: string;
  content: string;
  communication_date?: string;
  scheduled_for?: string;
  metadata?: Record<string, any>;
}

// Lead Task Types
export type TaskType = 'follow_up' | 'call' | 'email' | 'meeting' | 'research' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface LeadTask {
  id: string;
  lead_id: string;
  user_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  task_type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  completed_at?: string;
  reminder_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  task_type: TaskType;
  priority: TaskPriority;
  status?: TaskStatus;
  due_date?: string;
  assigned_to?: string;
  reminder_at?: string;
}

// Communication Template Types
export type TemplateType = 'email' | 'sms';

export interface CommunicationTemplate {
  id: string;
  user_id: string;
  name: string;
  type: TemplateType;
  subject?: string;
  content: string;
  variables: string[];
  is_active: boolean;
  usage_count: number;
  ai_generated?: boolean;
  generation_prompt?: string;
  ai_suggestions?: string[];
  created_at: string;
  updated_at: string;
}

export interface TemplateFormData {
  name: string;
  type: TemplateType;
  subject?: string;
  content: string;
  variables?: string[];
}

// Lead Notes Types
export type NoteType = 'general' | 'qualification' | 'objection' | 'interest' | 'follow_up';

export interface LeadNote {
  id: string;
  lead_id: string;
  user_id: string;
  note_type: NoteType;
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteFormData {
  note_type: NoteType;
  content: string;
  is_private?: boolean;
}

// Enhanced Lead Timeline Entry
export interface LeadTimelineEntry {
  id: string;
  type: 'communication' | 'task' | 'note' | 'status_change' | 'assignment' | 'system' | 'interest_change' | 'ai_insight';
  title: string;
  description: string;
  timestamp: string;
  user_name?: string;
  metadata?: Record<string, any>;
}

// Lead Dashboard Metrics
export interface LeadMetrics {
  total_communications: number;
  pending_tasks: number;
  overdue_tasks: number;
  last_contact_date?: string;
  response_rate: number;
  engagement_score: number;
}

// Filters and Search
export interface EnhancedLeadFilters {
  communication_types?: CommunicationType[];
  task_statuses?: TaskStatus[];
  task_priorities?: TaskPriority[];
  has_pending_tasks?: boolean;
  has_overdue_tasks?: boolean;
  last_contact_range?: {
    start: Date;
    end: Date;
  };
  note_types?: NoteType[];
}

// Template Variables for personalization
export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  example: string;
}

export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  { key: '{{first_name}}', label: 'First Name', description: 'Lead\'s first name', example: 'John' },
  { key: '{{last_name}}', label: 'Last Name', description: 'Lead\'s last name', example: 'Doe' },
  { key: '{{email}}', label: 'Email', description: 'Lead\'s email address', example: 'john@example.com' },
  { key: '{{phone}}', label: 'Phone', description: 'Lead\'s phone number', example: '+1 234 567 8900' },
  { key: '{{company}}', label: 'Company', description: 'Lead\'s company name', example: 'ACME Corp' },
  { key: '{{program_interest}}', label: 'Program Interest', description: 'Programs the lead is interested in', example: 'MBA, Executive Education' },
  { key: '{{agent_name}}', label: 'Agent Name', description: 'Name of the assigned agent', example: 'Sarah Johnson' },
  { key: '{{today}}', label: 'Today\'s Date', description: 'Current date', example: 'January 15, 2024' },
];