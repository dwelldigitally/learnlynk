export type DataSource = 
  | 'leads' 
  | 'students' 
  | 'applicants' 
  | 'programs' 
  | 'intakes' 
  | 'financial_records' 
  | 'lead_communications' 
  | 'lead_tasks'
  | 'campaigns'
  | 'form_submissions';

export type VisualizationType = 'table' | 'bar' | 'line' | 'pie' | 'area';

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than' 
  | 'less_than' 
  | 'greater_equal'
  | 'less_equal'
  | 'between'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'is_not_null';

export type AggregationType = 'count' | 'sum' | 'avg' | 'min' | 'max';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number | string[] | [number, number] | null;
  logic?: 'AND' | 'OR';
}

export interface ChartConfig {
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregation?: AggregationType;
  aggregationField?: string;
  colorScheme?: string;
  showLegend?: boolean;
  showGrid?: boolean;
}

export interface ReportConfig {
  name: string;
  description?: string;
  dataSource: DataSource;
  selectedFields: string[];
  filters: FilterCondition[];
  visualizationType: VisualizationType;
  chartConfig: ChartConfig;
}

export interface SavedReport extends ReportConfig {
  id: string;
  user_id: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  category: 'dimension' | 'measure' | 'date';
  aggregatable?: boolean;
}

export interface DataSourceDefinition {
  id: DataSource;
  name: string;
  description: string;
  icon: string;
  fields: FieldDefinition[];
  table: string;
}

// Data source configurations with fields
export const DATA_SOURCES: DataSourceDefinition[] = [
  {
    id: 'leads',
    name: 'Leads',
    description: 'Lead and prospect data',
    icon: 'Users',
    table: 'leads',
    fields: [
      { name: 'id', label: 'Lead ID', type: 'string', category: 'dimension' },
      { name: 'first_name', label: 'First Name', type: 'string', category: 'dimension' },
      { name: 'last_name', label: 'Last Name', type: 'string', category: 'dimension' },
      { name: 'email', label: 'Email', type: 'string', category: 'dimension' },
      { name: 'status', label: 'Status', type: 'string', category: 'dimension' },
      { name: 'source', label: 'Source', type: 'string', category: 'dimension' },
      { name: 'priority', label: 'Priority', type: 'string', category: 'dimension' },
      { name: 'country', label: 'Country', type: 'string', category: 'dimension' },
      { name: 'program_interest', label: 'Program Interest', type: 'string', category: 'dimension' },
      { name: 'lead_score', label: 'Lead Score', type: 'number', category: 'measure', aggregatable: true },
      { name: 'ai_score', label: 'AI Score', type: 'number', category: 'measure', aggregatable: true },
      { name: 'created_at', label: 'Created Date', type: 'date', category: 'date' },
      { name: 'updated_at', label: 'Updated Date', type: 'date', category: 'date' },
    ]
  },
  {
    id: 'students',
    name: 'Students',
    description: 'Enrolled student records',
    icon: 'GraduationCap',
    table: 'students',
    fields: [
      { name: 'id', label: 'Student ID', type: 'string', category: 'dimension' },
      { name: 'student_name', label: 'Name', type: 'string', category: 'dimension' },
      { name: 'email', label: 'Email', type: 'string', category: 'dimension' },
      { name: 'program', label: 'Program', type: 'string', category: 'dimension' },
      { name: 'status', label: 'Status', type: 'string', category: 'dimension' },
      { name: 'enrollment_date', label: 'Enrollment Date', type: 'date', category: 'date' },
      { name: 'created_at', label: 'Created Date', type: 'date', category: 'date' },
    ]
  },
  {
    id: 'applicants',
    name: 'Applicants',
    description: 'Application submissions',
    icon: 'FileText',
    table: 'applicants',
    fields: [
      { name: 'id', label: 'Applicant ID', type: 'string', category: 'dimension' },
      { name: 'program', label: 'Program', type: 'string', category: 'dimension' },
      { name: 'substage', label: 'Stage', type: 'string', category: 'dimension' },
      { name: 'decision', label: 'Decision', type: 'string', category: 'dimension' },
      { name: 'priority', label: 'Priority', type: 'string', category: 'dimension' },
      { name: 'payment_status', label: 'Payment Status', type: 'string', category: 'dimension' },
      { name: 'payment_amount', label: 'Payment Amount', type: 'number', category: 'measure', aggregatable: true },
      { name: 'created_at', label: 'Created Date', type: 'date', category: 'date' },
      { name: 'decision_date', label: 'Decision Date', type: 'date', category: 'date' },
    ]
  },
  {
    id: 'programs',
    name: 'Programs',
    description: 'Academic programs',
    icon: 'BookOpen',
    table: 'programs',
    fields: [
      { name: 'id', label: 'Program ID', type: 'string', category: 'dimension' },
      { name: 'name', label: 'Program Name', type: 'string', category: 'dimension' },
      { name: 'program_type', label: 'Type', type: 'string', category: 'dimension' },
      { name: 'delivery_mode', label: 'Delivery Mode', type: 'string', category: 'dimension' },
      { name: 'status', label: 'Status', type: 'string', category: 'dimension' },
      { name: 'duration_value', label: 'Duration', type: 'number', category: 'measure', aggregatable: true },
      { name: 'created_at', label: 'Created Date', type: 'date', category: 'date' },
    ]
  },
  {
    id: 'intakes',
    name: 'Intakes',
    description: 'Program intakes and cohorts',
    icon: 'Calendar',
    table: 'intakes',
    fields: [
      { name: 'id', label: 'Intake ID', type: 'string', category: 'dimension' },
      { name: 'name', label: 'Intake Name', type: 'string', category: 'dimension' },
      { name: 'status', label: 'Status', type: 'string', category: 'dimension' },
      { name: 'capacity', label: 'Capacity', type: 'number', category: 'measure', aggregatable: true },
      { name: 'enrolled_count', label: 'Enrolled', type: 'number', category: 'measure', aggregatable: true },
      { name: 'start_date', label: 'Start Date', type: 'date', category: 'date' },
      { name: 'application_deadline', label: 'Deadline', type: 'date', category: 'date' },
    ]
  },
  {
    id: 'financial_records',
    name: 'Financial Records',
    description: 'Payments and transactions',
    icon: 'DollarSign',
    table: 'financial_records',
    fields: [
      { name: 'id', label: 'Record ID', type: 'string', category: 'dimension' },
      { name: 'type', label: 'Type', type: 'string', category: 'dimension' },
      { name: 'category', label: 'Category', type: 'string', category: 'dimension' },
      { name: 'status', label: 'Status', type: 'string', category: 'dimension' },
      { name: 'amount', label: 'Amount', type: 'number', category: 'measure', aggregatable: true },
      { name: 'date', label: 'Date', type: 'date', category: 'date' },
      { name: 'created_at', label: 'Created Date', type: 'date', category: 'date' },
    ]
  },
  {
    id: 'lead_communications',
    name: 'Communications',
    description: 'Emails, calls, and messages',
    icon: 'MessageSquare',
    table: 'lead_communications',
    fields: [
      { name: 'id', label: 'Communication ID', type: 'string', category: 'dimension' },
      { name: 'type', label: 'Type', type: 'string', category: 'dimension' },
      { name: 'direction', label: 'Direction', type: 'string', category: 'dimension' },
      { name: 'status', label: 'Status', type: 'string', category: 'dimension' },
      { name: 'created_at', label: 'Date', type: 'date', category: 'date' },
    ]
  },
  {
    id: 'lead_tasks',
    name: 'Tasks',
    description: 'Tasks and activities',
    icon: 'CheckSquare',
    table: 'lead_tasks',
    fields: [
      { name: 'id', label: 'Task ID', type: 'string', category: 'dimension' },
      { name: 'title', label: 'Title', type: 'string', category: 'dimension' },
      { name: 'type', label: 'Type', type: 'string', category: 'dimension' },
      { name: 'status', label: 'Status', type: 'string', category: 'dimension' },
      { name: 'priority', label: 'Priority', type: 'string', category: 'dimension' },
      { name: 'due_date', label: 'Due Date', type: 'date', category: 'date' },
      { name: 'created_at', label: 'Created Date', type: 'date', category: 'date' },
    ]
  },
  {
    id: 'campaigns',
    name: 'Campaigns',
    description: 'Marketing campaigns',
    icon: 'Megaphone',
    table: 'campaigns',
    fields: [
      { name: 'id', label: 'Campaign ID', type: 'string', category: 'dimension' },
      { name: 'name', label: 'Name', type: 'string', category: 'dimension' },
      { name: 'campaign_type', label: 'Type', type: 'string', category: 'dimension' },
      { name: 'status', label: 'Status', type: 'string', category: 'dimension' },
      { name: 'total_executions', label: 'Executions', type: 'number', category: 'measure', aggregatable: true },
      { name: 'total_views', label: 'Views', type: 'number', category: 'measure', aggregatable: true },
      { name: 'start_date', label: 'Start Date', type: 'date', category: 'date' },
      { name: 'created_at', label: 'Created Date', type: 'date', category: 'date' },
    ]
  },
  {
    id: 'form_submissions',
    name: 'Form Submissions',
    description: 'Web form submissions',
    icon: 'ClipboardList',
    table: 'form_submissions',
    fields: [
      { name: 'id', label: 'Submission ID', type: 'string', category: 'dimension' },
      { name: 'form_id', label: 'Form ID', type: 'string', category: 'dimension' },
      { name: 'status', label: 'Status', type: 'string', category: 'dimension' },
      { name: 'created_at', label: 'Submitted Date', type: 'date', category: 'date' },
    ]
  }
];

export const FILTER_OPERATORS: { value: FilterOperator; label: string; types: ('string' | 'number' | 'date' | 'boolean')[] }[] = [
  { value: 'equals', label: 'Equals', types: ['string', 'number', 'date', 'boolean'] },
  { value: 'not_equals', label: 'Not Equals', types: ['string', 'number', 'date', 'boolean'] },
  { value: 'contains', label: 'Contains', types: ['string'] },
  { value: 'not_contains', label: 'Does Not Contain', types: ['string'] },
  { value: 'starts_with', label: 'Starts With', types: ['string'] },
  { value: 'ends_with', label: 'Ends With', types: ['string'] },
  { value: 'greater_than', label: 'Greater Than', types: ['number', 'date'] },
  { value: 'less_than', label: 'Less Than', types: ['number', 'date'] },
  { value: 'greater_equal', label: 'Greater or Equal', types: ['number', 'date'] },
  { value: 'less_equal', label: 'Less or Equal', types: ['number', 'date'] },
  { value: 'between', label: 'Between', types: ['number', 'date'] },
  { value: 'in', label: 'In List', types: ['string'] },
  { value: 'is_null', label: 'Is Empty', types: ['string', 'number', 'date'] },
  { value: 'is_not_null', label: 'Is Not Empty', types: ['string', 'number', 'date'] },
];

export const AGGREGATIONS: { value: AggregationType; label: string }[] = [
  { value: 'count', label: 'Count' },
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
];
