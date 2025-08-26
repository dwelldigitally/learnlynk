export type BuilderType = 'form' | 'workflow' | 'campaign' | 'journey';

export interface BaseElement {
  id: string;
  type: string;
  title: string;
  description?: string;
  position: number;
  config: Record<string, any>;
}

export interface FormElement extends BaseElement {
  elementType: 'form';
  type: 'text' | 'email' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file' | 'date' | 'number';
  fieldType: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: any[];
  options?: { label: string; value: string }[];
}

export interface WorkflowElement extends BaseElement {
  elementType: 'workflow';
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'assignment';
  triggerType?: string;
  actionType?: string;
  conditions?: any[];
  delay?: { value: number; unit: string };
}

export interface CampaignElement extends BaseElement {
  elementType: 'campaign';
  type: 'email' | 'sms' | 'wait' | 'condition' | 'split';
  subject?: string;
  content?: string;
  template?: string;
  waitTime?: { value: number; unit: string };
  splitPercentage?: number;
}

export interface JourneyElement extends BaseElement {
  elementType: 'journey';
  type: 'phone-interview' | 'video-interview' | 'in-person-interview' | 'document-upload' | 'verification' | 
        'typing-test' | 'aptitude-test' | 'skills-assessment' | 'application-review' | 'committee-review' | 
        'notification' | 'reminder';
  duration?: number;
  instructions?: string;
  required?: boolean;
  schedulingRequired?: boolean;
  documentType?: string;
  verificationType?: string;
  testType?: string;
  reviewType?: string;
  notificationType?: string;
}

export type UniversalElement = FormElement | WorkflowElement | CampaignElement | JourneyElement;

export interface BuilderConfig {
  id?: string;
  name: string;
  description: string;
  type: BuilderType;
  elements: UniversalElement[];
  settings: Record<string, any>;
  metadata?: {
    created_at?: string;
    updated_at?: string;
    created_by?: string;
  };
}

export interface ElementTypeConfig {
  type: string;
  label: string;
  icon: string;
  category: string;
  defaultConfig: Record<string, any>;
  configSchema: PropertySchema[];
}

export interface PropertySchema {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'array';
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  helpText?: string;
}

export interface BuilderState {
  config: BuilderConfig;
  selectedElementId: string | null;
  draggedElement: UniversalElement | null;
  isPreviewMode: boolean;
  history: BuilderConfig[];
  historyIndex: number;
}