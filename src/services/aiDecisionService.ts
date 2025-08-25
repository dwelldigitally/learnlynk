import { supabase } from '@/integrations/supabase/client';
import { 
  AIDecisionLog, 
  AILogicConfiguration, 
  AIScenarioTest, 
  AIPerformanceBaseline,
  AIDecisionExplanation,
  DecisionFactorBreakdown
} from '@/types/aiDecisionIntelligence';

export class AIDecisionService {
  // AI Decision Logs
  static async getDecisionLogs(filters?: {
    decision_type?: string;
    date_from?: string;
    date_to?: string;
    student_id?: string;
  }): Promise<AIDecisionLog[]> {
    let query = supabase.from('ai_decision_logs').select('*').order('created_at', { ascending: false });
    
    if (filters?.decision_type) {
      query = query.eq('decision_type', filters.decision_type);
    }
    if (filters?.student_id) {
      query = query.eq('student_id', filters.student_id);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createDecisionLog(decision: Partial<AIDecisionLog>): Promise<AIDecisionLog> {
    const { data, error } = await supabase
      .from('ai_decision_logs')
      .insert(decision)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateDecisionExecution(id: string, executed: boolean, result?: string): Promise<void> {
    const { error } = await supabase
      .from('ai_decision_logs')
      .update({ 
        executed, 
        execution_result: result,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }

  // AI Logic Configurations
  static async getConfigurations(): Promise<AILogicConfiguration[]> {
    const { data, error } = await supabase
      .from('ai_logic_configurations')
      .select('*')
      .order('version', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getActiveConfiguration(): Promise<AILogicConfiguration | null> {
    const { data, error } = await supabase
      .from('ai_logic_configurations')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async createConfiguration(config: Partial<AILogicConfiguration>): Promise<AILogicConfiguration> {
    // Deactivate existing active configuration
    await supabase
      .from('ai_logic_configurations')
      .update({ is_active: false })
      .eq('is_active', true);

    const { data, error } = await supabase
      .from('ai_logic_configurations')
      .insert({
        ...config,
        is_active: true,
        version: 1
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateConfiguration(id: string, updates: Partial<AILogicConfiguration>): Promise<void> {
    const { error } = await supabase
      .from('ai_logic_configurations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }

  static async activateConfiguration(id: string): Promise<void> {
    // Deactivate all other configurations
    await supabase
      .from('ai_logic_configurations')
      .update({ is_active: false })
      .neq('id', id);

    // Activate the selected configuration
    const { error } = await supabase
      .from('ai_logic_configurations')
      .update({ is_active: true })
      .eq('id', id);
    
    if (error) throw error;
  }

  // AI Scenario Tests
  static async getScenarioTests(): Promise<AIScenarioTest[]> {
    const { data, error } = await supabase
      .from('ai_scenario_tests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createScenarioTest(test: Partial<AIScenarioTest>): Promise<AIScenarioTest> {
    const { data, error } = await supabase
      .from('ai_scenario_tests')
      .insert(test)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async runScenarioTest(testId: string): Promise<AIScenarioTest> {
    // Update test status to running
    await supabase
      .from('ai_scenario_tests')
      .update({ test_status: 'running' })
      .eq('id', testId);

    // Get test data
    const { data: test, error: testError } = await supabase
      .from('ai_scenario_tests')
      .select('*')
      .eq('id', testId)
      .single();

    if (testError) throw testError;

    // Simulate AI decision making (in real implementation, call AI service)
    const startTime = Date.now();
    const actualOutcome = await this.simulateAIDecision(test.scenario_data);
    const executionTime = Date.now() - startTime;

    // Update test with results
    const { data, error } = await supabase
      .from('ai_scenario_tests')
      .update({
        actual_outcome: actualOutcome,
        test_status: 'completed',
        execution_time_ms: executionTime,
        updated_at: new Date().toISOString()
      })
      .eq('id', testId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Performance Baselines
  static async getPerformanceBaselines(configurationId?: string): Promise<AIPerformanceBaseline[]> {
    let query = supabase.from('ai_performance_baselines').select('*');
    
    if (configurationId) {
      query = query.eq('configuration_id', configurationId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async createPerformanceBaseline(baseline: Partial<AIPerformanceBaseline>): Promise<AIPerformanceBaseline> {
    const { data, error } = await supabase
      .from('ai_performance_baselines')
      .insert(baseline)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // AI Decision Explanation
  static async explainDecision(decisionId: string): Promise<AIDecisionExplanation> {
    const { data: decision, error } = await supabase
      .from('ai_decision_logs')
      .select('*')
      .eq('id', decisionId)
      .single();

    if (error) throw error;

    // Generate detailed explanation based on decision data
    return this.generateDecisionExplanation(decision);
  }

  // Private helper methods
  private static async simulateAIDecision(scenarioData: any): Promise<any> {
    // Simulate AI decision making based on scenario
    const actions = ['Call Student', 'Send Email', 'Schedule Meeting', 'Send SMS', 'Mark for Review'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      recommended_action: randomAction,
      confidence_score: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
      reasoning: {
        primary_factors: ['Student engagement score', 'Program interest match', 'Response history'],
        risk_factors: ['Late application', 'Incomplete documents'],
        opportunity_factors: ['High-yield program', 'Immediate follow-up possible']
      }
    };
  }

  private static generateDecisionExplanation(decision: AIDecisionLog): AIDecisionExplanation {
    const factors: DecisionFactorBreakdown[] = [
      {
        factor: 'Student Engagement',
        weight: 0.3,
        value: 'High',
        influence: 'positive',
        description: 'Student has opened 3 emails and visited website 5 times'
      },
      {
        factor: 'Program Match',
        weight: 0.25,
        value: '85%',
        influence: 'positive',
        description: 'Strong alignment between student interests and program offerings'
      },
      {
        factor: 'Urgency Level',
        weight: 0.2,
        value: 'Medium',
        influence: 'neutral',
        description: 'Application deadline is in 2 weeks'
      },
      {
        factor: 'Response History',
        weight: 0.15,
        value: 'Good',
        influence: 'positive',
        description: 'Student has responded within 24 hours on average'
      },
      {
        factor: 'Data Completeness',
        weight: 0.1,
        value: '90%',
        influence: 'positive',
        description: 'Most required information has been provided'
      }
    ];

    return {
      decision_id: decision.id,
      primary_reasoning: 'Student shows high engagement and strong program alignment, making them an excellent candidate for immediate follow-up.',
      confidence_breakdown: {
        data_quality: 0.9,
        historical_patterns: 0.85,
        urgency_factors: 0.7,
        program_alignment: 0.85
      },
      contributing_factors: factors,
      alternative_actions: [
        {
          action: 'Send Email',
          probability: 0.35,
          why_not_chosen: 'Student has already received 2 emails in the past week'
        },
        {
          action: 'Schedule Meeting',
          probability: 0.25,
          why_not_chosen: 'Student is in a different timezone, making immediate scheduling difficult'
        },
        {
          action: 'Send SMS',
          probability: 0.15,
          why_not_chosen: 'Phone number not verified, lower success rate expected'
        }
      ],
      trust_indicators: {
        similar_decisions_count: 247,
        success_rate: 0.73,
        data_completeness: 0.9
      }
    };
  }

  // Natural Language Processing for AI Logic Modification
  static async processNaturalLanguageCommand(command: string): Promise<{
    understood: boolean;
    proposed_changes: Record<string, any>;
    preview: string;
  }> {
    // Simulate NLP processing
    const lowercaseCommand = command.toLowerCase();
    let understood = false;
    let proposed_changes = {};
    let preview = '';

    if (lowercaseCommand.includes('prioritize') && lowercaseCommand.includes('high-yield')) {
      understood = true;
      proposed_changes = {
        scoring_weights: {
          program_yield: 0.4,
          engagement: 0.3,
          urgency: 0.2,
          data_quality: 0.1
        }
      };
      preview = 'AI will now weight high-yield programs 40% higher in decision making';
    } else if (lowercaseCommand.includes('aggressive') && lowercaseCommand.includes('follow-up')) {
      understood = true;
      proposed_changes = {
        follow_up_rules: {
          max_follow_ups: 5,
          follow_up_interval_hours: 24,
          escalation_threshold: 3
        }
      };
      preview = 'AI will now be more aggressive with follow-ups, reducing intervals to 24 hours';
    } else if (lowercaseCommand.includes('international') && lowercaseCommand.includes('students')) {
      understood = true;
      proposed_changes = {
        student_segmentation: {
          international_weight_modifier: 1.2,
          timezone_consideration: true,
          cultural_sensitivity: true
        }
      };
      preview = 'AI will now apply special consideration rules for international students';
    }

    return { understood, proposed_changes, preview };
  }
}