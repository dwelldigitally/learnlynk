export interface EmailRecipient {
  id: string;
  type: 'admin' | 'user' | 'program_advisor' | 'custom';
  email?: string;
  programId?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface EmailNotificationConfig {
  enabled: boolean;
  recipients: EmailRecipient[];
  template: EmailTemplate;
  triggerConditions: any[];
  deliveryTiming: 'immediate' | 'delayed' | 'scheduled';
  delayMinutes?: number;
  scheduledTime?: string;
  attachments: boolean;
  format: 'html' | 'plain';
}

export interface ProgramIntegrationConfig {
  enabled: boolean;
  autoPopulatePrograms: boolean;
  defaultProgram?: string;
  routingRules: ProgramRoutingRule[];
  customMappings: ProgramFieldMapping[];
  intakeIntegration: boolean;
  advisorAssignment: boolean;
}

export interface ProgramRoutingRule {
  id: string;
  condition: string;
  operator: 'equals' | 'contains' | 'starts_with';
  value: string;
  targetProgramId: string;
  advisorId?: string;
}

export interface ProgramFieldMapping {
  id: string;
  formFieldId: string;
  programField: string;
  transformation?: string;
}