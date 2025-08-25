import { supabase } from '@/integrations/supabase/client';

export class AIIntelligenceTestData {
  static async createSampleData() {
    try {
      // Create sample AI configuration
      const { data: config } = await supabase
        .from('ai_logic_configurations')
        .insert({
          name: 'Default Enrollment AI Configuration',
          description: 'Initial AI configuration for enrollment management',
          configuration_data: {
            scoring_weights: {
              engagement_score: 0.3,
              program_match: 0.25,
              urgency_factors: 0.2,
              data_completeness: 0.15,
              historical_success: 0.1
            },
            follow_up_rules: {
              max_follow_ups: 3,
              follow_up_interval_hours: 48,
              escalation_threshold: 2
            },
            urgency_thresholds: {
              high: 0.8,
              medium: 0.6,
              low: 0.4
            }
          },
          is_active: true,
          version: 1,
          natural_language_prompt: 'Initial configuration created by system'
        })
        .select()
        .single();

      // Create sample decision logs
      const sampleDecisions = [
        {
          decision_type: 'enrollment_action',
          recommended_action: 'Call Student',
          confidence_score: 0.87,
          reasoning: {
            primary_factors: ['High engagement score', 'Strong program match', 'Recent activity'],
            risk_assessment: 'Low risk - student shows consistent engagement',
            opportunity_assessment: 'High potential for immediate enrollment'
          },
          contributing_factors: {
            engagement_score: 0.9,
            program_match: 0.85,
            last_activity: '2024-01-20T14:30:00Z',
            response_rate: 0.8
          },
          alternative_actions: [
            { action: 'Send Email', probability: 0.13, reason: 'Lower priority due to recent email activity' }
          ],
          executed: true,
          execution_result: 'Call completed - student scheduled for program tour'
        },
        {
          decision_type: 'enrollment_action', 
          recommended_action: 'Send Email',
          confidence_score: 0.72,
          reasoning: {
            primary_factors: ['Moderate engagement', 'Good program fit', 'Email responsive'],
            risk_assessment: 'Medium risk - needs nurturing',
            opportunity_assessment: 'Good potential with proper follow-up'
          },
          contributing_factors: {
            engagement_score: 0.65,
            program_match: 0.75,
            email_open_rate: 0.8,
            timezone: 'PST'
          },
          alternative_actions: [
            { action: 'Send SMS', probability: 0.28, reason: 'Phone not verified' }
          ],
          executed: false
        },
        {
          decision_type: 'enrollment_action',
          recommended_action: 'Schedule Meeting',
          confidence_score: 0.91,
          reasoning: {
            primary_factors: ['Very high engagement', 'Perfect program match', 'Expressed urgency'],
            risk_assessment: 'Very low risk - highly qualified prospect',
            opportunity_assessment: 'Excellent conversion potential'
          },
          contributing_factors: {
            engagement_score: 0.95,
            program_match: 0.92,
            urgency_indicators: ['deadline_approaching', 'multiple_inquiries'],
            qualification_score: 0.89
          },
          alternative_actions: [
            { action: 'Call Student', probability: 0.09, reason: 'Scheduling preferred by student' }
          ],
          executed: true,
          execution_result: 'Meeting scheduled for January 25th - enrollment likely'
        }
      ];

      for (const decision of sampleDecisions) {
        await supabase
          .from('ai_decision_logs')
          .insert(decision);
      }

      // Create sample scenario tests
      const sampleScenarios = [
        {
          name: 'High Engagement International Student',
          description: 'Test scenario for international student with high engagement and strong program match',
          scenario_data: {
            student: {
              engagement_score: 0.88,
              program_match: 0.82,
              application_completeness: 0.75,
              country: 'Canada',
              timezone_offset: '-5:00',
              program_interest: ['Computer Science', 'Data Science'],
              source: 'university_fair',
              interactions: [
                { type: 'email_open', timestamp: '2024-01-18T10:00:00Z' },
                { type: 'website_visit', timestamp: '2024-01-19T15:30:00Z' },
                { type: 'brochure_download', timestamp: '2024-01-20T09:15:00Z' }
              ]
            }
          },
          expected_outcome: {
            recommended_action: 'Call Student',
            confidence_score: 0.85,
            urgency: 'medium'
          },
          test_status: 'pending'
        },
        {
          name: 'Low Engagement Domestic Student',
          description: 'Test scenario for domestic student with low engagement needing nurturing',
          scenario_data: {
            student: {
              engagement_score: 0.45,
              program_match: 0.68,
              application_completeness: 0.30,
              country: 'United States',
              state: 'California',
              program_interest: ['Business Administration'],
              source: 'google_ads',
              interactions: [
                { type: 'form_submission', timestamp: '2024-01-15T14:20:00Z' }
              ]
            }
          },
          expected_outcome: {
            recommended_action: 'Send Email',
            confidence_score: 0.65,
            urgency: 'low'
          },
          test_status: 'pending'
        }
      ];

      for (const scenario of sampleScenarios) {
        await supabase
          .from('ai_scenario_tests')
          .insert(scenario);
      }

      // Create sample performance baselines
      const performanceBaselines = [
        {
          configuration_id: config?.id,
          metric_name: 'decision_accuracy',
          metric_value: 0.73,
          baseline_period_start: '2024-01-01T00:00:00Z',
          baseline_period_end: '2024-01-20T23:59:59Z',
          sample_size: 150
        },
        {
          configuration_id: config?.id,
          metric_name: 'conversion_rate',
          metric_value: 0.68,
          baseline_period_start: '2024-01-01T00:00:00Z',
          baseline_period_end: '2024-01-20T23:59:59Z',
          sample_size: 89
        },
        {
          configuration_id: config?.id,
          metric_name: 'response_time_minutes',
          metric_value: 24.5,
          baseline_period_start: '2024-01-01T00:00:00Z',
          baseline_period_end: '2024-01-20T23:59:59Z',
          sample_size: 203
        }
      ];

      for (const baseline of performanceBaselines) {
        await supabase
          .from('ai_performance_baselines')
          .insert(baseline);
      }

      console.log('✅ Sample AI Intelligence data created successfully');
      return true;
    } catch (error) {
      console.error('❌ Error creating sample data:', error);
      return false;
    }
  }

  static async clearSampleData() {
    try {
      // Clear in reverse order to handle foreign key constraints
      await supabase.from('ai_performance_baselines').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('ai_scenario_tests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('ai_decision_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('ai_logic_configurations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      console.log('✅ Sample AI Intelligence data cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Error clearing sample data:', error);
      return false;
    }
  }
}