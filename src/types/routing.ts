export interface AdvisorTeam {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  max_daily_assignments: number;
  region?: string;
  specializations: string[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  advisor_id: string;
  role: string;
  is_active: boolean;
  assigned_leads_today: number;
  created_at: string;
}

export interface RoutingCondition {
  id: string;
  rule_id: string;
  condition_type: 'source' | 'location' | 'program' | 'score' | 'time' | 'custom';
  operator: 'equals' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'contains' | 'between';
  field_name: string;
  field_value: any;
  is_required: boolean;
  group_id: string;
  created_at: string;
}

export interface RuleExecutionLog {
  id: string;
  rule_id: string;
  lead_id: string;
  execution_result: 'matched' | 'no_match' | 'error';
  assigned_to?: string;
  execution_time_ms?: number;
  error_message?: string;
  execution_data?: Record<string, any>;
  created_at: string;
}

export interface RoutingTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'geographic' | 'program' | 'source' | 'score' | 'hybrid';
  template_data: Record<string, any>;
  is_system_template: boolean;
  usage_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ConditionGroup {
  id: string;
  operator: 'AND' | 'OR';
  conditions: RuleCondition[];
}

export interface RuleCondition {
  id: string;
  type: 'source' | 'location' | 'program' | 'score' | 'time' | 'custom';
  field: string;
  operator: 'equals' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: any;
  label?: string;
}

export interface EnhancedRoutingRule {
  id: string;
  name: string;
  description?: string;
  priority: number;
  is_active: boolean;
  sources?: string[]; // Optional now - sources moved to conditions
  condition_groups: ConditionGroup[];
  assignment_config: {
    method: string;
    target_type?: 'advisors' | 'teams';
    teams?: string[];
    advisors?: string[];
    fallback_method?: string;
    max_assignments_per_advisor?: number;
  };
  schedule?: {
    enabled: boolean;
    days: string[];
    start_time: string;
    end_time: string;
    timezone: string;
  };
  performance_config?: {
    track_analytics: boolean;
    conversion_weight: number;
    response_time_weight: number;
  };
  created_at: string;
  updated_at: string;
}

export interface RoutingRuleFormData extends Omit<EnhancedRoutingRule, 'id' | 'created_at' | 'updated_at'> {}