export type SetupTaskId = 
  | 'add_campuses'
  | 'import_templates'
  | 'add_requirements'
  | 'add_programs'
  | 'configure_lead_form'
  | 'connect_integrations'
  | 'configure_payments'
  | 'invite_team_members'
  | 'additional_settings';

export type SetupTaskStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export interface SetupTask {
  id: string;
  user_id: string;
  task_id: SetupTaskId;
  status: SetupTaskStatus;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SetupTaskDefinition {
  id: SetupTaskId;
  title: string;
  description: string;
  link: string;
  icon: any;
  required: boolean;
  estimatedMinutes: number;
  order: number;
}
