export type GoalType = 'team' | 'individual' | 'role_based';

export type GoalPeriod = 'annual' | 'quarterly' | 'monthly' | 'weekly' | 'daily';

export type MetricType = 
  | 'revenue' 
  | 'calls' 
  | 'emails' 
  | 'activities' 
  | 'future_revenue' 
  | 'contract_value' 
  | 'conversions' 
  | 'response_time';

export type GoalStatus = 'active' | 'achieved' | 'at_risk' | 'on_track' | 'off_track' | 'archived';

export type GoalPriority = 'high' | 'medium' | 'low';

export interface TeamGoal {
  id: string;
  user_id: string;
  goal_name: string;
  goal_type: GoalType;
  goal_period: GoalPeriod;
  metric_type: MetricType;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: string;
  end_date: string;
  assignee_ids?: string[];
  assignee_names?: string[];
  role_filter?: string;
  priority: GoalPriority;
  status: GoalStatus;
  description?: string;
  is_cascading: boolean;
  parent_goal_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  metadata?: Record<string, any>;
}

export interface GoalProgress {
  id: string;
  goal_id: string;
  tracking_date: string;
  progress_value: number;
  contributed_by?: string;
  activity_type?: string;
  activity_id?: string;
  notes?: string;
  created_at: string;
}

export interface GoalAdjustment {
  id: string;
  goal_id: string;
  previous_target: number;
  new_target: number;
  adjustment_reason: string;
  adjusted_by: string;
  adjusted_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface GoalFormData {
  goal_name: string;
  goal_type: GoalType;
  goal_period: GoalPeriod;
  metric_type: MetricType;
  target_value: number;
  start_date: string;
  end_date: string;
  assignee_ids?: string[];
  role_filter?: string;
  priority: GoalPriority;
  description?: string;
  is_cascading?: boolean;
}

export interface GoalAnalytics {
  totalGoals: number;
  achievedGoals: number;
  atRiskGoals: number;
  onTrackGoals: number;
  offTrackGoals: number;
  overallAttainmentRate: number;
  teamMetrics: {
    totalRevenue: number;
    targetRevenue: number;
    totalCalls: number;
    targetCalls: number;
    totalEmails: number;
    targetEmails: number;
    totalActivities: number;
    targetActivities: number;
    futureRevenue: number;
    targetFutureRevenue: number;
    contractValue: number;
    targetContractValue: number;
  };
  topPerformers: {
    userId: string;
    userName: string;
    attainmentRate: number;
    goalsAchieved: number;
  }[];
  trends: {
    date: string;
    value: number;
  }[];
}
