export type TaskEntityType = 'lead' | 'student' | 'applicant';
export type TaskCategory = 
  | 'general'
  | 'review_documents'
  | 'approve_payments'
  | 'follow_up'
  | 'communication'
  | 'administrative'
  | 'academic'
  | 'verification'
  | 'scheduling';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface UniversalTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  
  // Entity reference
  entity_type: TaskEntityType;
  entity_id: string;
  
  // Assignment and scheduling
  assigned_to?: string;
  assigned_at?: string;
  due_date?: string;
  reminder_at?: string;
  completed_at?: string;
  
  // Additional data
  notes?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  entity_type: TaskEntityType;
  entity_id: string;
  assigned_to?: string;
  due_date?: string;
  reminder_at?: string;
  notes?: string;
  tags?: string[];
}

export interface EntityOption {
  id: string;
  label: string;
  type: TaskEntityType;
}

export const TASK_CATEGORIES: Array<{ value: TaskCategory; label: string; description: string }> = [
  { value: 'general', label: 'General Task', description: 'General task or reminder' },
  { value: 'review_documents', label: 'Review Documents', description: 'Review submitted documents' },
  { value: 'approve_payments', label: 'Approve Payments', description: 'Review and approve payment requests' },
  { value: 'follow_up', label: 'Follow Up', description: 'Follow up with lead, student, or applicant' },
  { value: 'communication', label: 'Communication', description: 'Send email, make call, or schedule meeting' },
  { value: 'administrative', label: 'Administrative', description: 'Administrative tasks and updates' },
  { value: 'academic', label: 'Academic Review', description: 'Academic consultation or review' },
  { value: 'verification', label: 'Verification', description: 'Verify information or credentials' },
  { value: 'scheduling', label: 'Scheduling', description: 'Schedule appointments or meetings' },
];