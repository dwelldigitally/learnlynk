// Central definition of ALL lead properties - Single Source of Truth
// All other files (useTablePreferences, triggerConditionFields, TriggerConditionBuilder, reports) import from here

export type LeadPropertyType = 'string' | 'number' | 'date' | 'boolean' | 'array';

export type LeadPropertyCategory = 
  | 'Core'
  | 'Personal'
  | 'Location'
  | 'Activity'
  | 'Engagement'
  | 'Conversion'
  | 'Classification'
  | 'Scores'
  | 'Assignment'
  | 'Program'
  | 'Marketing'
  | 'Email'
  | 'System'
  | 'Tags'
  | 'Documents'
  | 'Payments'
  | 'Forms';

export interface LeadPropertyDefinition {
  key: string;
  label: string;
  category: LeadPropertyCategory;
  type: LeadPropertyType;
  operators: string[];
  sortable?: boolean;
  aggregatable?: boolean;
  visible?: boolean;  // Default visibility in tables
  minWidth?: number;
  maxWidth?: number;
  options?: { label: string; value: string }[];
  dynamicOptions?: string;  // e.g., 'programs', 'advisors', 'forms'
  placeholder?: string;
  description?: string;
  isSystem?: boolean;  // Cannot be user-configured
  isAutoCalculated?: boolean;  // Auto-calculated by triggers
}

// Operator definitions
export const TEXT_OPERATORS = ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'];
export const NUMBER_OPERATORS = ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equals', 'less_than_or_equals', 'between', 'is_empty', 'is_not_empty'];
export const DATE_OPERATORS = ['equals', 'before', 'after', 'between', 'days_ago', 'today', 'this_week', 'this_month', 'is_empty', 'is_not_empty'];
export const SELECT_OPERATORS = ['equals', 'not_equals', 'in_list', 'not_in_list', 'is_empty', 'is_not_empty'];
export const BOOLEAN_OPERATORS = ['equals', 'not_equals'];
export const ARRAY_OPERATORS = ['contains', 'not_contains', 'contains_any', 'contains_all', 'is_empty', 'is_not_empty'];

// Status options
export const STATUS_OPTIONS = [
  { label: 'New Inquiry', value: 'New Inquiry' },
  { label: 'Requirements Approved', value: 'Requirements Approved' },
  { label: 'Payment Received', value: 'Payment Received' },
  { label: 'Registered', value: 'Registered' },
  { label: 'Admitted', value: 'Admitted' },
  { label: 'Dismissed', value: 'Dismissed' }
];

// Stage options
export const STAGE_OPTIONS = [
  { label: 'NEW_INQUIRY', value: 'NEW_INQUIRY' },
  { label: 'QUALIFICATION', value: 'QUALIFICATION' },
  { label: 'NURTURING', value: 'NURTURING' },
  { label: 'APPLICATION', value: 'APPLICATION' },
  { label: 'REVIEW', value: 'REVIEW' },
  { label: 'DECISION', value: 'DECISION' },
  { label: 'ENROLLMENT', value: 'ENROLLMENT' }
];

// Priority options
export const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' }
];

// Source options
export const SOURCE_OPTIONS = [
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
];

// Student type options
export const STUDENT_TYPE_OPTIONS = [
  { label: 'Domestic', value: 'domestic' },
  { label: 'International', value: 'international' }
];

// Qualification stage options
export const QUALIFICATION_STAGE_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Unqualified', value: 'unqualified' }
];

// Payment status options
export const PAYMENT_STATUS_OPTIONS = [
  { label: 'Not Started', value: 'not_started' },
  { label: 'Pending', value: 'pending' },
  { label: 'Partial', value: 'partial' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' }
];

// ============================================================================
// CENTRAL LEAD PROPERTIES DEFINITION
// ============================================================================

export const LEAD_PROPERTIES: LeadPropertyDefinition[] = [
  // ===== CORE PROPERTIES (visible by default) =====
  { 
    key: 'first_name', 
    label: 'First Name', 
    category: 'Core', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    visible: true, 
    sortable: true, 
    minWidth: 100, 
    maxWidth: 180 
  },
  { 
    key: 'last_name', 
    label: 'Last Name', 
    category: 'Core', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    visible: true, 
    sortable: true, 
    minWidth: 100, 
    maxWidth: 180 
  },
  { 
    key: 'email', 
    label: 'Email', 
    category: 'Core', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    visible: true, 
    sortable: true, 
    minWidth: 160, 
    maxWidth: 260 
  },
  { 
    key: 'phone', 
    label: 'Phone', 
    category: 'Core', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    visible: true, 
    sortable: false, 
    minWidth: 100, 
    maxWidth: 160 
  },
  { 
    key: 'source', 
    label: 'Source', 
    category: 'Core', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    options: SOURCE_OPTIONS,
    visible: true, 
    sortable: true, 
    minWidth: 80, 
    maxWidth: 130 
  },
  { 
    key: 'status', 
    label: 'Status', 
    category: 'Core', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    options: STATUS_OPTIONS,
    visible: true, 
    sortable: true, 
    minWidth: 90, 
    maxWidth: 140 
  },
  { 
    key: 'stage', 
    label: 'Stage', 
    category: 'Core', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    options: STAGE_OPTIONS,
    visible: true, 
    sortable: true, 
    minWidth: 80, 
    maxWidth: 130 
  },
  { 
    key: 'priority', 
    label: 'Priority', 
    category: 'Core', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    options: PRIORITY_OPTIONS,
    visible: true, 
    sortable: true, 
    minWidth: 80, 
    maxWidth: 120 
  },
  { 
    key: 'lead_score', 
    label: 'Lead Score', 
    category: 'Core', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    visible: true, 
    sortable: true, 
    aggregatable: true,
    minWidth: 90, 
    maxWidth: 130 
  },
  { 
    key: 'assigned_to', 
    label: 'Assigned To', 
    category: 'Core', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'advisors',
    visible: true, 
    sortable: false, 
    minWidth: 120, 
    maxWidth: 200 
  },
  { 
    key: 'created_at', 
    label: 'Created Date', 
    category: 'Core', 
    type: 'date', 
    operators: DATE_OPERATORS,
    visible: true, 
    sortable: true, 
    minWidth: 100, 
    maxWidth: 160 
  },

  // ===== PERSONAL PROPERTIES =====
  { 
    key: 'student_type', 
    label: 'Student Type', 
    category: 'Personal', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    options: STUDENT_TYPE_OPTIONS,
    sortable: true, 
    minWidth: 100, 
    maxWidth: 160 
  },
  { 
    key: 'source_details', 
    label: 'Source Details', 
    category: 'Personal', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 120, 
    maxWidth: 200 
  },
  { 
    key: 'lead_type', 
    label: 'Lead Type', 
    category: 'Personal', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 100, 
    maxWidth: 160 
  },
  { 
    key: 'lifecycle_stage', 
    label: 'Lifecycle Stage', 
    category: 'Personal', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'lifecycle_stages',
    sortable: true, 
    minWidth: 120, 
    maxWidth: 180,
    description: 'Lead lifecycle stage for the stage tracker buttons'
  },

  // ===== LOCATION PROPERTIES =====
  { 
    key: 'country', 
    label: 'Country/Region', 
    category: 'Location', 
    type: 'string', 
    operators: [...SELECT_OPERATORS, 'in_list', 'not_in_list'],
    sortable: true, 
    minWidth: 100, 
    maxWidth: 160 
  },
  { 
    key: 'state', 
    label: 'State/Province', 
    category: 'Location', 
    type: 'string', 
    operators: [...SELECT_OPERATORS, 'in_list', 'not_in_list'],
    sortable: true, 
    minWidth: 100, 
    maxWidth: 160 
  },
  { 
    key: 'city', 
    label: 'City', 
    category: 'Location', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 100, 
    maxWidth: 160 
  },
  { 
    key: 'postal_code', 
    label: 'Postal Code', 
    category: 'Location', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 90, 
    maxWidth: 140 
  },
  { 
    key: 'time_zone', 
    label: 'Time Zone', 
    category: 'Location', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 120, 
    maxWidth: 180 
  },

  // ===== ACTIVITY METRICS =====
  { 
    key: 'call_count', 
    label: 'Call Count', 
    category: 'Activity', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 90, 
    maxWidth: 130 
  },
  { 
    key: 'meeting_count', 
    label: 'Meeting Count', 
    category: 'Activity', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 100, 
    maxWidth: 140 
  },
  { 
    key: 'number_of_sales_activities', 
    label: 'Sales Activities', 
    category: 'Activity', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 110, 
    maxWidth: 160 
  },
  { 
    key: 'number_of_times_contacted', 
    label: 'Times Contacted', 
    category: 'Activity', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 110, 
    maxWidth: 160 
  },
  { 
    key: 'number_of_form_submissions', 
    label: 'Form Submissions', 
    category: 'Activity', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 120, 
    maxWidth: 170 
  },
  { 
    key: 'number_of_page_views', 
    label: 'Page Views', 
    category: 'Activity', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 100, 
    maxWidth: 140 
  },

  // ===== ENGAGEMENT PROPERTIES =====
  { 
    key: 'last_contacted_at', 
    label: 'Last Contacted', 
    category: 'Engagement', 
    type: 'date', 
    operators: DATE_OPERATORS,
    sortable: true, 
    minWidth: 130, 
    maxWidth: 180 
  },
  { 
    key: 'last_engagement_date', 
    label: 'Last Engagement', 
    category: 'Engagement', 
    type: 'date', 
    operators: DATE_OPERATORS,
    sortable: true, 
    isAutoCalculated: true,
    minWidth: 130, 
    maxWidth: 180 
  },
  { 
    key: 'date_of_first_engagement', 
    label: 'First Engagement', 
    category: 'Engagement', 
    type: 'date', 
    operators: DATE_OPERATORS,
    sortable: true, 
    isAutoCalculated: true,
    minWidth: 130, 
    maxWidth: 180 
  },
  { 
    key: 'lead_response_time', 
    label: 'Response Time', 
    category: 'Engagement', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 110, 
    maxWidth: 160,
    description: 'Time to first response in hours'
  },
  { 
    key: 'time_to_first_touch', 
    label: 'Time to First Touch', 
    category: 'Engagement', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 130, 
    maxWidth: 180 
  },
  { 
    key: 'next_follow_up_at', 
    label: 'Next Follow-up', 
    category: 'Engagement', 
    type: 'date', 
    operators: DATE_OPERATORS,
    sortable: true, 
    minWidth: 120, 
    maxWidth: 170 
  },

  // ===== CONVERSION PROPERTIES =====
  { 
    key: 'first_conversion', 
    label: 'First Conversion', 
    category: 'Conversion', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    isAutoCalculated: true,
    minWidth: 120, 
    maxWidth: 180 
  },
  { 
    key: 'first_conversion_date', 
    label: 'First Conversion Date', 
    category: 'Conversion', 
    type: 'date', 
    operators: DATE_OPERATORS,
    sortable: true, 
    isAutoCalculated: true,
    minWidth: 140, 
    maxWidth: 200 
  },

  // ===== CLASSIFICATION PROPERTIES =====
  { 
    key: 'qualification_stage', 
    label: 'Qualification Stage', 
    category: 'Classification', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    options: QUALIFICATION_STAGE_OPTIONS,
    sortable: true, 
    minWidth: 130, 
    maxWidth: 190 
  },

  // ===== SCORES PROPERTIES =====
  { 
    key: 'ai_score', 
    label: 'AI Score', 
    category: 'Scores', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    minWidth: 80, 
    maxWidth: 120 
  },

  // ===== ASSIGNMENT PROPERTIES =====
  { 
    key: 'assigned_at', 
    label: 'Assigned At', 
    category: 'Assignment', 
    type: 'date', 
    operators: DATE_OPERATORS,
    sortable: true, 
    minWidth: 120, 
    maxWidth: 180 
  },
  { 
    key: 'assignment_method', 
    label: 'Assignment Method', 
    category: 'Assignment', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 130, 
    maxWidth: 190 
  },
  { 
    key: 'owner_assigned_date', 
    label: 'Owner Assigned Date', 
    category: 'Assignment', 
    type: 'date', 
    operators: DATE_OPERATORS,
    sortable: true, 
    isAutoCalculated: true,
    minWidth: 140, 
    maxWidth: 200 
  },
  { 
    key: 'ai_agent_id', 
    label: 'AI Agent', 
    category: 'Assignment', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'aiAgents',
    sortable: false, 
    minWidth: 120, 
    maxWidth: 180 
  },
  { 
    key: 'ai_managed', 
    label: 'AI Managed', 
    category: 'Assignment', 
    type: 'boolean', 
    operators: BOOLEAN_OPERATORS,
    sortable: true, 
    minWidth: 90, 
    maxWidth: 130 
  },

  // ===== PROGRAM PROPERTIES =====
  { 
    key: 'program_interest', 
    label: 'Program Interest', 
    category: 'Program', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'programs',
    sortable: true, 
    minWidth: 130, 
    maxWidth: 200 
  },
  { 
    key: 'preferred_intake_id', 
    label: 'Preferred Intake', 
    category: 'Program', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'intakes',
    sortable: false, 
    minWidth: 120, 
    maxWidth: 180 
  },
  { 
    key: 'preferred_campus_id', 
    label: 'Preferred Campus', 
    category: 'Program', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'campuses',
    sortable: false, 
    minWidth: 120, 
    maxWidth: 180,
    description: 'The campus where the lead prefers to study'
  },
  { 
    key: 'academic_term_id', 
    label: 'Academic Term', 
    category: 'Program', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'academicTerms',
    sortable: false, 
    minWidth: 120, 
    maxWidth: 180 
  },
  { 
    key: 'intake_period', 
    label: 'Intake Period', 
    category: 'Program', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 110, 
    maxWidth: 160 
  },
  { 
    key: 'days_to_intake_start', 
    label: 'Days to Intake', 
    category: 'Program', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 110, 
    maxWidth: 160 
  },

  // ===== MARKETING PROPERTIES =====
  { 
    key: 'utm_source', 
    label: 'UTM Source', 
    category: 'Marketing', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 100, 
    maxWidth: 160 
  },
  { 
    key: 'utm_medium', 
    label: 'UTM Medium', 
    category: 'Marketing', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 100, 
    maxWidth: 160 
  },
  { 
    key: 'utm_campaign', 
    label: 'UTM Campaign', 
    category: 'Marketing', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 110, 
    maxWidth: 180 
  },
  { 
    key: 'utm_content', 
    label: 'UTM Content', 
    category: 'Marketing', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 100, 
    maxWidth: 160 
  },
  { 
    key: 'utm_term', 
    label: 'UTM Term', 
    category: 'Marketing', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: true, 
    minWidth: 90, 
    maxWidth: 150 
  },
  { 
    key: 'referrer_url', 
    label: 'Referrer URL', 
    category: 'Marketing', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: false, 
    minWidth: 140, 
    maxWidth: 250 
  },
  { 
    key: 'latest_traffic_source_date', 
    label: 'Traffic Source Date', 
    category: 'Marketing', 
    type: 'date', 
    operators: DATE_OPERATORS,
    sortable: true, 
    minWidth: 140, 
    maxWidth: 200 
  },

  // ===== EMAIL PROPERTIES =====
  { 
    key: 'unsubscribed_from_all_email', 
    label: 'Unsubscribed', 
    category: 'Email', 
    type: 'boolean', 
    operators: BOOLEAN_OPERATORS,
    sortable: true, 
    minWidth: 100, 
    maxWidth: 150 
  },

  // ===== TAGS PROPERTIES =====
  { 
    key: 'tags', 
    label: 'Tags', 
    category: 'Tags', 
    type: 'array', 
    operators: ARRAY_OPERATORS,
    sortable: false, 
    minWidth: 120, 
    maxWidth: 250 
  },
  { 
    key: 'notes', 
    label: 'Notes', 
    category: 'Tags', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: false, 
    minWidth: 150, 
    maxWidth: 300 
  },

  // ===== FORMS PROPERTIES =====
  { 
    key: 'form_id', 
    label: 'Form Submitted', 
    category: 'Forms', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'forms',
    sortable: false, 
    minWidth: 120, 
    maxWidth: 180 
  },

  // ===== DOCUMENTS PROPERTIES =====
  { 
    key: 'documents_pending', 
    label: 'Pending Documents', 
    category: 'Documents', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 120, 
    maxWidth: 170 
  },
  { 
    key: 'documents_approved', 
    label: 'Approved Documents', 
    category: 'Documents', 
    type: 'number', 
    operators: NUMBER_OPERATORS,
    sortable: true, 
    aggregatable: true,
    isAutoCalculated: true,
    minWidth: 130, 
    maxWidth: 180 
  },

  // ===== PAYMENTS PROPERTIES =====
  { 
    key: 'payment_status', 
    label: 'Payment Status', 
    category: 'Payments', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    options: PAYMENT_STATUS_OPTIONS,
    sortable: true, 
    minWidth: 110, 
    maxWidth: 160 
  },

  // ===== SYSTEM PROPERTIES =====
  { 
    key: 'id', 
    label: 'Lead ID', 
    category: 'System', 
    type: 'string', 
    operators: TEXT_OPERATORS,
    sortable: false, 
    isSystem: true,
    minWidth: 120, 
    maxWidth: 280 
  },
  { 
    key: 'updated_at', 
    label: 'Last Modified', 
    category: 'System', 
    type: 'date', 
    operators: DATE_OPERATORS,
    sortable: true, 
    minWidth: 120, 
    maxWidth: 180 
  },
  { 
    key: 'created_by_user_id', 
    label: 'Created By', 
    category: 'System', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'users',
    sortable: false, 
    isAutoCalculated: true,
    minWidth: 120, 
    maxWidth: 200 
  },
  { 
    key: 'updated_by_user_id', 
    label: 'Updated By', 
    category: 'System', 
    type: 'string', 
    operators: SELECT_OPERATORS,
    dynamicOptions: 'users',
    sortable: false, 
    minWidth: 120, 
    maxWidth: 200 
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all unique categories
 */
export function getLeadPropertyCategories(): LeadPropertyCategory[] {
  const categories = new Set<LeadPropertyCategory>();
  LEAD_PROPERTIES.forEach(prop => categories.add(prop.category));
  return Array.from(categories);
}

/**
 * Get properties by category
 */
export function getLeadPropertiesByCategory(category: LeadPropertyCategory): LeadPropertyDefinition[] {
  return LEAD_PROPERTIES.filter(prop => prop.category === category);
}

/**
 * Get a property by key
 */
export function getLeadPropertyByKey(key: string): LeadPropertyDefinition | undefined {
  return LEAD_PROPERTIES.find(prop => prop.key === key);
}

/**
 * Get properties formatted for table columns (useTablePreferences)
 */
export function getLeadPropertiesForTableColumns() {
  // Create a combined "name" column for first_name + last_name
  const columns = [
    {
      id: 'name',
      label: 'Name',
      visible: true,
      sortable: true,
      minWidth: 140,
      maxWidth: 220,
      category: 'Core'
    },
    ...LEAD_PROPERTIES
      .filter(p => p.key !== 'first_name' && p.key !== 'last_name')
      .map(prop => ({
        id: prop.key,
        label: prop.label,
        visible: prop.visible ?? false,
        sortable: prop.sortable ?? false,
        minWidth: prop.minWidth,
        maxWidth: prop.maxWidth,
        category: prop.category
      }))
  ];
  
  // Add suggested_action as a special column
  columns.push({
    id: 'suggested_action',
    label: 'Suggested Action',
    visible: true,
    sortable: false,
    minWidth: 130,
    maxWidth: 200,
    category: 'Core'
  });
  
  // Add last_activity as a special column
  const lastActivityIdx = columns.findIndex(c => c.id === 'created_at');
  if (lastActivityIdx !== -1) {
    columns.splice(lastActivityIdx + 1, 0, {
      id: 'last_activity',
      label: 'Last Activity',
      visible: true,
      sortable: false,
      minWidth: 100,
      maxWidth: 160,
      category: 'Core'
    });
  }
  
  return columns;
}

/**
 * Get properties formatted for trigger conditions (automation builder)
 */
export function getLeadPropertiesForConditions() {
  return LEAD_PROPERTIES.map(prop => ({
    key: prop.key,
    label: prop.label,
    category: prop.category,
    type: mapPropertyTypeToConditionType(prop.type),
    operators: prop.operators,
    options: prop.options,
    dynamicOptions: prop.dynamicOptions,
    placeholder: prop.placeholder
  }));
}

function mapPropertyTypeToConditionType(type: LeadPropertyType): 'text' | 'select' | 'number' | 'date' | 'boolean' | 'array' {
  switch (type) {
    case 'string': return 'text';
    case 'number': return 'number';
    case 'date': return 'date';
    case 'boolean': return 'boolean';
    case 'array': return 'array';
    default: return 'text';
  }
}

/**
 * Get properties formatted for report builder
 */
export function getLeadPropertiesForReports() {
  const dimensions: { name: string; label: string; type: 'string' | 'number' | 'date' | 'boolean'; category: 'dimension' | 'measure' | 'date'; aggregatable?: boolean }[] = [];
  const measures: { name: string; label: string; type: 'string' | 'number' | 'date' | 'boolean'; category: 'dimension' | 'measure' | 'date'; aggregatable?: boolean }[] = [];
  const dates: { name: string; label: string; type: 'string' | 'number' | 'date' | 'boolean'; category: 'dimension' | 'measure' | 'date'; aggregatable?: boolean }[] = [];

  LEAD_PROPERTIES.forEach(prop => {
    const reportField = {
      name: prop.key,
      label: prop.label,
      type: prop.type === 'array' ? 'string' as const : prop.type,
      category: 'dimension' as const,
      aggregatable: prop.aggregatable
    };

    if (prop.type === 'date') {
      dates.push({ ...reportField, category: 'date' });
    } else if (prop.type === 'number' && prop.aggregatable) {
      measures.push({ ...reportField, category: 'measure' });
    } else {
      dimensions.push(reportField);
    }
  });

  return { dimensions, measures, dates };
}

/**
 * Get properties formatted for TriggerConditionBuilder FIELDS constant
 */
export function getLeadPropertiesForBuilderFields() {
  return LEAD_PROPERTIES.map(prop => {
    let fieldType: 'text' | 'numeric' | 'array' | 'date' | 'select' = 'text';
    
    if (prop.type === 'number') fieldType = 'numeric';
    else if (prop.type === 'array') fieldType = 'array';
    else if (prop.type === 'date') fieldType = 'date';
    else if (prop.options || prop.dynamicOptions) fieldType = 'select';
    
    return {
      value: prop.key,
      label: prop.label,
      type: fieldType,
      category: prop.category
    };
  });
}

/**
 * Operator labels for display
 */
export const OPERATOR_LABELS: Record<string, string> = {
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
