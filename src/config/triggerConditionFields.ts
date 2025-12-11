// Comprehensive trigger condition fields for automation builder

export interface TriggerConditionField {
  key: string;
  label: string;
  category: string;
  type: 'text' | 'select' | 'number' | 'date' | 'boolean' | 'array';
  operators: string[];
  options?: { label: string; value: string }[];
  dynamicOptions?: string;
  placeholder?: string;
}

export const triggerConditionFields: TriggerConditionField[] = [
  // Personal Information
  { key: 'first_name', label: 'First Name', category: 'Personal', type: 'text', operators: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'] },
  { key: 'last_name', label: 'Last Name', category: 'Personal', type: 'text', operators: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'] },
  { key: 'email', label: 'Email', category: 'Personal', type: 'text', operators: ['equals', 'not_equals', 'contains', 'not_contains', 'ends_with', 'is_empty', 'is_not_empty'] },
  { key: 'phone', label: 'Phone', category: 'Personal', type: 'text', operators: ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty'] },

  // Location
  { key: 'country', label: 'Country', category: 'Location', type: 'text', operators: ['equals', 'not_equals', 'in_list', 'not_in_list', 'is_empty', 'is_not_empty'] },
  { key: 'state', label: 'State/Province', category: 'Location', type: 'text', operators: ['equals', 'not_equals', 'in_list', 'not_in_list', 'is_empty', 'is_not_empty'] },
  { key: 'city', label: 'City', category: 'Location', type: 'text', operators: ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty'] },

  // Lead Classification
  { 
    key: 'source', 
    label: 'Lead Source', 
    category: 'Classification', 
    type: 'select', 
    operators: ['equals', 'not_equals', 'in_list', 'not_in_list'],
    options: [
      { label: 'Website', value: 'website' },
      { label: 'Referral', value: 'referral' },
      { label: 'Web Form', value: 'webform' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Walk-in', value: 'walk_in' },
      { label: 'Event', value: 'event' },
      { label: 'Social Media', value: 'social' },
      { label: 'Google Ads', value: 'google_ads' },
      { label: 'Facebook Ads', value: 'facebook_ads' },
      { label: 'LinkedIn', value: 'linkedin' },
      { label: 'Partner', value: 'partner' },
      { label: 'Agent', value: 'agent' },
      { label: 'Import', value: 'import' },
      { label: 'Other', value: 'other' }
    ]
  },
  { key: 'source_details', label: 'Source Details', category: 'Classification', type: 'text', operators: ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty'] },
  { 
    key: 'status', 
    label: 'Lead Status', 
    category: 'Classification', 
    type: 'select', 
    operators: ['equals', 'not_equals', 'in_list', 'not_in_list'],
    options: [
      { label: 'New Inquiry', value: 'New Inquiry' },
      { label: 'Requirements Approved', value: 'Requirements Approved' },
      { label: 'Payment Received', value: 'Payment Received' },
      { label: 'Registered', value: 'Registered' },
      { label: 'Admitted', value: 'Admitted' },
      { label: 'Dismissed', value: 'Dismissed' }
    ]
  },
  { 
    key: 'stage', 
    label: 'Pipeline Stage', 
    category: 'Classification', 
    type: 'select', 
    operators: ['equals', 'not_equals', 'in_list', 'not_in_list'],
    options: [
      { label: 'NEW_INQUIRY', value: 'NEW_INQUIRY' },
      { label: 'QUALIFICATION', value: 'QUALIFICATION' },
      { label: 'NURTURING', value: 'NURTURING' },
      { label: 'APPLICATION', value: 'APPLICATION' },
      { label: 'REVIEW', value: 'REVIEW' },
      { label: 'DECISION', value: 'DECISION' },
      { label: 'ENROLLMENT', value: 'ENROLLMENT' }
    ]
  },
  { 
    key: 'priority', 
    label: 'Priority', 
    category: 'Classification', 
    type: 'select', 
    operators: ['equals', 'not_equals', 'in_list'],
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Urgent', value: 'urgent' }
    ]
  },
  { 
    key: 'student_type', 
    label: 'Student Type', 
    category: 'Classification', 
    type: 'select', 
    operators: ['equals', 'not_equals'],
    options: [
      { label: 'Domestic', value: 'domestic' },
      { label: 'International', value: 'international' }
    ]
  },
  { 
    key: 'qualification_stage', 
    label: 'Qualification Stage', 
    category: 'Classification', 
    type: 'select', 
    operators: ['equals', 'not_equals', 'in_list'],
    options: [
      { label: 'New', value: 'new' },
      { label: 'Contacted', value: 'contacted' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'Unqualified', value: 'unqualified' }
    ]
  },

  // Scoring
  { key: 'lead_score', label: 'Lead Score', category: 'Scoring', type: 'number', operators: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equals', 'less_than_or_equals', 'between'], placeholder: 'Enter score' },
  { key: 'ai_score', label: 'AI Score', category: 'Scoring', type: 'number', operators: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equals', 'less_than_or_equals', 'between'], placeholder: 'Enter score' },

  // Program & Intake
  { key: 'program_interest', label: 'Program Interest', category: 'Program', type: 'select', operators: ['equals', 'not_equals', 'in_list', 'not_in_list', 'is_empty', 'is_not_empty'], dynamicOptions: 'programs' },
  { key: 'intake_period', label: 'Intake Period', category: 'Program', type: 'text', operators: ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty'] },
  { key: 'preferred_intake_id', label: 'Preferred Intake', category: 'Program', type: 'select', operators: ['equals', 'not_equals', 'is_empty', 'is_not_empty'], dynamicOptions: 'intakes' },
  { key: 'academic_term_id', label: 'Academic Term', category: 'Program', type: 'select', operators: ['equals', 'not_equals', 'is_empty', 'is_not_empty'], dynamicOptions: 'academicTerms' },

  // Assignment
  { key: 'assigned_to', label: 'Assigned Advisor', category: 'Assignment', type: 'select', operators: ['equals', 'not_equals', 'is_empty', 'is_not_empty'], dynamicOptions: 'advisors' },
  { key: 'assignment_method', label: 'Assignment Method', category: 'Assignment', type: 'text', operators: ['equals', 'not_equals', 'is_empty', 'is_not_empty'] },
  { key: 'ai_agent_id', label: 'AI Agent', category: 'Assignment', type: 'select', operators: ['equals', 'not_equals', 'is_empty', 'is_not_empty'], dynamicOptions: 'aiAgents' },
  { key: 'ai_managed', label: 'AI Managed', category: 'Assignment', type: 'boolean', operators: ['equals'] },

  // Engagement
  { key: 'tags', label: 'Tags', category: 'Engagement', type: 'array', operators: ['contains', 'not_contains', 'contains_any', 'contains_all', 'is_empty', 'is_not_empty'], placeholder: 'Enter tag' },
  { key: 'notes', label: 'Notes', category: 'Engagement', type: 'text', operators: ['contains', 'not_contains', 'is_empty', 'is_not_empty'] },
  { key: 'last_contacted_at', label: 'Last Contacted', category: 'Engagement', type: 'date', operators: ['equals', 'before', 'after', 'between', 'days_ago', 'is_empty', 'is_not_empty'] },
  { key: 'next_follow_up_at', label: 'Next Follow-up', category: 'Engagement', type: 'date', operators: ['equals', 'before', 'after', 'between', 'is_empty', 'is_not_empty'] },

  // Marketing / UTM
  { key: 'utm_source', label: 'UTM Source', category: 'Marketing', type: 'text', operators: ['equals', 'not_equals', 'contains', 'in_list', 'is_empty', 'is_not_empty'] },
  { key: 'utm_medium', label: 'UTM Medium', category: 'Marketing', type: 'text', operators: ['equals', 'not_equals', 'contains', 'in_list', 'is_empty', 'is_not_empty'] },
  { key: 'utm_campaign', label: 'UTM Campaign', category: 'Marketing', type: 'text', operators: ['equals', 'not_equals', 'contains', 'in_list', 'is_empty', 'is_not_empty'] },
  { key: 'utm_content', label: 'UTM Content', category: 'Marketing', type: 'text', operators: ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty'] },
  { key: 'utm_term', label: 'UTM Term', category: 'Marketing', type: 'text', operators: ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty'] },
  { key: 'referrer_url', label: 'Referrer URL', category: 'Marketing', type: 'text', operators: ['equals', 'not_equals', 'contains', 'starts_with', 'is_empty', 'is_not_empty'] },

  // Form Submission
  { key: 'form_id', label: 'Form Submitted', category: 'Forms', type: 'select', operators: ['equals', 'not_equals', 'in_list'], dynamicOptions: 'forms' },

  // Documents
  { key: 'documents_pending', label: 'Pending Documents Count', category: 'Documents', type: 'number', operators: ['equals', 'greater_than', 'less_than', 'greater_than_or_equals'] },
  { key: 'documents_approved', label: 'Approved Documents Count', category: 'Documents', type: 'number', operators: ['equals', 'greater_than', 'less_than', 'greater_than_or_equals'] },

  // Payments
  { 
    key: 'payment_status', 
    label: 'Payment Status', 
    category: 'Payments', 
    type: 'select', 
    operators: ['equals', 'not_equals'],
    options: [
      { label: 'Not Started', value: 'not_started' },
      { label: 'Pending', value: 'pending' },
      { label: 'Partial', value: 'partial' },
      { label: 'Paid', value: 'paid' },
      { label: 'Overdue', value: 'overdue' }
    ]
  },

  // System / Dates
  { key: 'created_at', label: 'Created Date', category: 'System', type: 'date', operators: ['equals', 'before', 'after', 'between', 'days_ago', 'today', 'this_week', 'this_month'] },
  { key: 'updated_at', label: 'Last Updated', category: 'System', type: 'date', operators: ['equals', 'before', 'after', 'between', 'days_ago'] }
];

export const operatorLabels: Record<string, string> = {
  equals: 'equals',
  not_equals: 'does not equal',
  contains: 'contains',
  not_contains: 'does not contain',
  starts_with: 'starts with',
  ends_with: 'ends with',
  greater_than: 'is greater than',
  less_than: 'is less than',
  greater_than_or_equals: 'is greater than or equals',
  less_than_or_equals: 'is less than or equals',
  between: 'is between',
  in_list: 'is any of',
  not_in_list: 'is none of',
  contains_any: 'contains any of',
  contains_all: 'contains all of',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
  before: 'is before',
  after: 'is after',
  days_ago: 'was days ago',
  today: 'is today',
  this_week: 'is this week',
  this_month: 'is this month'
};

export const fieldCategories = [
  'Personal',
  'Location',
  'Classification',
  'Scoring',
  'Program',
  'Assignment',
  'Engagement',
  'Marketing',
  'Forms',
  'Documents',
  'Payments',
  'System'
];
