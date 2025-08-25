import { supabase } from '@/integrations/supabase/client';

// Generate proper UUID
function generateUUID(): string {
  return crypto.randomUUID();
}

export interface ActionQueueItem {
  id: string;
  student_name: string;
  program: string;
  yield_score: number;
  yield_band: 'high' | 'medium' | 'low';
  reason_codes: string[];
  suggested_action: string;
  sla_due_at: string;
  status: 'pending' | 'completed';
}

export interface SignalData {
  student_id: string;
  webinar_attended: boolean;
  form_submitted_at?: string;
  last_email_open_at?: string;
  pageviews_7d: number;
  yield_score: number;
}

export interface WasteRadarItem {
  id: string;
  student_name: string;
  unresponsive_30d: boolean;
  wrong_intake: boolean;
  duplicate_flag: boolean;
  touch_count: number;
}

class EnrollmentSeedService {
  private generateMockActionQueue(): Partial<ActionQueueItem>[] {
    const students = [
      'Emma Johnson', 'Michael Chen', 'Sarah Williams', 'David Rodriguez', 'Ashley Thompson',
      'James Wilson', 'Maria Garcia', 'Robert Brown', 'Jennifer Davis', 'Christopher Lee',
      'Amanda Martinez', 'Daniel Anderson', 'Jessica Taylor', 'Kevin Thomas', 'Lauren Jackson',
      'Brandon White', 'Samantha Harris', 'Justin Martin', 'Nicole Thompson', 'Andrew Garcia'
    ];

    const programs = [
      'Computer Science', 'Business Administration', 'Nursing', 'Engineering', 'Psychology',
      'Marketing', 'Data Science', 'Criminal Justice', 'Education', 'Healthcare Administration'
    ];

    const reasonCodes = [
      ['Application in progress', '7d stalled', 'Transcript missing'],
      ['Webinar high intent', 'Recent engagement', 'Application in progress'],
      ['7d stalled', 'Transcript missing', 'Last contact 5d ago'],
      ['Webinar high intent', 'Application in progress', 'Document uploaded'],
      ['Recent engagement', 'Form submitted', 'High pageviews'],
      ['7d stalled', 'Wrong intake source', 'Needs callback'],
      ['Application in progress', 'Transcript missing', 'High intent signals'],
      ['Webinar high intent', 'Document gap', 'SLA approaching'],
      ['Recent engagement', '7d stalled', 'Program interest confirmed'],
      ['Application in progress', 'High pageviews', 'Email engagement']
    ];

    const actions = [
      'Call now', 'Re-engage sequence', 'Call + doc email', 'Document follow-up',
      'Priority callback', 'Application assistance', 'Transcript reminder', 'Intent confirmation'
    ];

    return students.map((name, index) => {
      const yieldScore = Math.random() * 100;
      const yieldBand: 'high' | 'medium' | 'low' = yieldScore > 70 ? 'high' : yieldScore > 40 ? 'medium' : 'low';
      const slaHours = Math.floor(Math.random() * 48) + 1;
      
      return {
        student_name: name,
        program: programs[index % programs.length],
        yield_score: Number(yieldScore.toFixed(1)),
        yield_band: yieldBand,
        reason_codes: reasonCodes[index % reasonCodes.length],
        suggested_action: actions[index % actions.length],
        sla_due_at: new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const
      };
    }).sort((a, b) => (b.yield_score || 0) - (a.yield_score || 0));
  }

  private generateMockSignals(): Partial<SignalData>[] {
    return Array.from({ length: 20 }, (_, index) => ({
      student_id: generateUUID(),
      webinar_attended: Math.random() > 0.6,
      form_submitted_at: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      last_email_open_at: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      pageviews_7d: Math.floor(Math.random() * 50),
      yield_score: Math.random() * 100
    }));
  }

  private generateMockWasteRadar(): Partial<WasteRadarItem>[] {
    const wasteNames = [
      'John Inactive', 'Lisa Duplicate', 'Mark Unresponsive', 'Kelly Wrongintake', 'Tom Stalled',
      'Rachel Bounce', 'Steve Nocontact', 'Monica Duplicate2', 'Frank Deadlead', 'Carol Inactive2'
    ];

    return wasteNames.map((name, index) => ({
      student_name: name,
      unresponsive_30d: index % 3 === 0,
      wrong_intake: index % 4 === 0,
      duplicate_flag: index % 5 === 0,
      touch_count: Math.floor(Math.random() * 15) + 1
    }));
  }

  async seedActionQueue() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const mockData = this.generateMockActionQueue();
      
      const { data, error } = await supabase
        .from('action_queue')
        .insert(
          mockData.map(item => ({
            user_id: user.id,
            student_id: generateUUID(),
            student_name: item.student_name!,
            program: item.program!,
            yield_score: item.yield_score!,
            yield_band: item.yield_band!,
            reason_codes: JSON.stringify(item.reason_codes),
            suggested_action: item.suggested_action!,
            sla_due_at: item.sla_due_at!,
            status: item.status!
          }))
        )
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error seeding action queue:', error);
      throw error;
    }
  }

  async seedSignals() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const mockData = this.generateMockSignals();
      
      const { data, error } = await supabase
        .from('signals')
        .insert(
          mockData.map(item => ({
            user_id: user.id,
            student_id: item.student_id!,
            webinar_attended: item.webinar_attended!,
            form_submitted_at: item.form_submitted_at,
            last_email_open_at: item.last_email_open_at,
            pageviews_7d: item.pageviews_7d!,
            yield_score: item.yield_score!
          }))
        )
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error seeding signals:', error);
      throw error;
    }
  }

  async seedWasteRadar() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const mockData = this.generateMockWasteRadar();
      
      const { data, error } = await supabase
        .from('waste_radar')
        .insert(
          mockData.map(item => ({
            user_id: user.id,
            student_id: generateUUID(),
            student_name: item.student_name!,
            unresponsive_30d: item.unresponsive_30d!,
            wrong_intake: item.wrong_intake!,
            duplicate_flag: item.duplicate_flag!,
            touch_count: item.touch_count!
          }))
        )
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error seeding waste radar:', error);
      throw error;
    }
  }

  async seedPolicyConfigurations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const policies = [
        {
          policy_name: '5-minute-callback',
          enabled: false,
          settings: { target_band: 'high', callback_delay_minutes: 5 },
          expected_lift: 15.3
        },
        {
          policy_name: 'stalled-7day-reengage',
          enabled: false,
          settings: { days_threshold: 7, sequence_type: 'sms+email+callback' },
          expected_lift: 23.7
        },
        {
          policy_name: 'document-chase',
          enabled: false,
          settings: { reminder_frequency: 'daily', include_callback: true },
          expected_lift: 12.1
        }
      ];

      const { data, error } = await supabase
        .from('policy_configurations')
        .insert(
          policies.map(policy => ({
            ...policy,
            user_id: user.id
          }))
        )
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error seeding policy configurations:', error);
      throw error;
    }
  }

  async seedOutcomeMetrics() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const metrics = [
        {
          metric_name: 'median_response_time',
          before_value: 4.2,
          after_value: 2.8,
          time_period: '30d',
          attribution_source: 'speed_policy'
        },
        {
          metric_name: 'actions_per_counselor_day',
          before_value: 12.5,
          after_value: 18.3,
          time_period: '30d',
          attribution_source: 'waste_radar'
        },
        {
          metric_name: 'completed_applications',
          before_value: 67,
          after_value: 89,
          time_period: '30d',
          attribution_source: 'stalled_7day'
        },
        {
          metric_name: 'offer_to_deposit_high_risk',
          before_value: 23,
          after_value: 34,
          time_period: '60d',
          attribution_source: 'speed_policy'
        },
        {
          metric_name: 'offer_to_deposit_medium_risk',
          before_value: 45,
          after_value: 52,
          time_period: '60d',
          attribution_source: 'stalled_7day'
        },
        {
          metric_name: 'offer_to_deposit_low_risk',
          before_value: 78,
          after_value: 81,
          time_period: '60d',
          attribution_source: 'waste_radar'
        }
      ];

      const { data, error } = await supabase
        .from('outcome_metrics')
        .insert(
          metrics.map(metric => ({
            ...metric,
            user_id: user.id
          }))
        )
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error seeding outcome metrics:', error);
      throw error;
    }
  }

  async seedAll() {
    try {
      console.log('Seeding enrollment optimization data...');
      
      await Promise.all([
        this.seedActionQueue(),
        this.seedSignals(),
        this.seedWasteRadar(),
        this.seedPolicyConfigurations(),
        this.seedOutcomeMetrics()
      ]);

      console.log('Successfully seeded all enrollment optimization data');
      return true;
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  }

  async initializeAllData() {
    return this.seedAll();
  }

  // Initialize data on service creation
  static async initialize() {
    const service = new EnrollmentSeedService();
    await service.initializeAllData();
    return service;
  }
}

export const enrollmentSeedService = new EnrollmentSeedService();