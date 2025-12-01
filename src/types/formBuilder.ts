export type FormFieldType = 
  | 'text'
  | 'email' 
  | 'tel'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'multi-select'
  | 'intake-date'
  | 'switch'
  | 'file'
  | 'url'
  | 'consent'
  | 'program-list';

export interface FormFieldOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ConditionalLogic {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: any;
  logic?: 'AND' | 'OR';
}

export interface ValidationRule {
  type: 'required' | 'min_length' | 'max_length' | 'pattern' | 'min_value' | 'max_value' | 'file_size' | 'file_type';
  value?: any;
  message?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  enabled?: boolean;
  options?: FormFieldOption[];
  validation?: ValidationRule[];
  showWhen?: ConditionalLogic[];
  hideWhen?: ConditionalLogic[];
  // Field-specific properties
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  accept?: string;
  rows?: number;
  cols?: number;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // field IDs
  showWhen?: ConditionalLogic[];
  hideWhen?: ConditionalLogic[];
}

export interface EmailNotificationConfig {
  enabled: boolean;
  recipients: Array<{
    id: string;
    type: 'admin' | 'user' | 'program_advisor' | 'custom';
    email?: string;
    programId?: string;
  }>;
  template: {
    id: string;
    name: string;
    subject: string;
    body: string;
    variables: string[];
  };
  triggerConditions?: any[];
  deliveryTiming: 'immediate' | 'delayed' | 'scheduled';
  delayMinutes?: number;
  scheduledTime?: string;
  attachments: boolean;
  format: 'html' | 'plain';
}

export interface FormConfig {
  id?: string;
  title: string;
  description: string;
  fields: FormField[];
  sections?: FormSection[];
  submitButtonText: string;
  privacyText?: string;
  successMessage?: string;
  errorMessage?: string;
  multiStep?: boolean;
  showProgress?: boolean;
  theme?: 'default' | 'modern' | 'minimal';
  layoutMode?: 'list' | 'grid';
  rows?: Array<{
    id: string;
    fields: (FormField | null)[];
    columns: number;
  }>;
  emailNotifications?: EmailNotificationConfig;
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}