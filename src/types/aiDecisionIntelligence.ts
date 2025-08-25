export interface AIDecisionLog {
  id: string;
  student_id?: string;
  decision_type: string;
  recommended_action: string;
  confidence_score: number;
  reasoning: Record<string, any>;
  contributing_factors: Record<string, any>;
  alternative_actions?: Record<string, any>[];
  executed: boolean;
  execution_result?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AILogicConfiguration {
  id: string;
  name: string;
  description?: string;
  configuration_data: Record<string, any>;
  version: number;
  is_active: boolean;
  natural_language_prompt?: string;
  performance_metrics?: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AIScenarioTest {
  id: string;
  name: string;
  description?: string;
  scenario_data: Record<string, any>;
  expected_outcome?: Record<string, any>;
  actual_outcome?: Record<string, any>;
  configuration_id?: string;
  test_status: 'pending' | 'running' | 'completed' | 'failed';
  execution_time_ms?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AIPerformanceBaseline {
  id: string;
  configuration_id?: string;
  metric_name: string;
  metric_value: number;
  baseline_period_start: string;
  baseline_period_end: string;
  sample_size?: number;
  created_at: string;
}

export interface DecisionFactorBreakdown {
  factor: string;
  weight: number;
  value: string | number;
  influence: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface AIDecisionExplanation {
  decision_id: string;
  primary_reasoning: string;
  confidence_breakdown: {
    data_quality: number;
    historical_patterns: number;
    urgency_factors: number;
    program_alignment: number;
  };
  contributing_factors: DecisionFactorBreakdown[];
  alternative_actions: {
    action: string;
    probability: number;
    why_not_chosen: string;
  }[];
  trust_indicators: {
    similar_decisions_count: number;
    success_rate: number;
    data_completeness: number;
  };
}