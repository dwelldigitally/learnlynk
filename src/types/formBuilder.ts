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
  | 'date'
  | 'range'
  | 'switch'
  | 'file'
  | 'url'
  | 'color'
  | 'consent';

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
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}