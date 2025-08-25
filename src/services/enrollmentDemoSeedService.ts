import { supabase } from '@/integrations/supabase/client';

export interface Play {
  name: string;
  description: string;
  play_type: string;
  trigger_type: string;
  trigger_configuration: any;
  actions: any[];
  is_active: boolean;
  expected_lift: number;
  attribution_window_days: number;
}

export interface Policy {
  name: string;
  description: string;
  configuration: any;
  is_active: boolean;
  category: string;
}

export interface StudentAction {
  student_name: string;
  program: string;
  yield_score: number;
  yield_band: 'high' | 'medium' | 'low';
  action_type: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  reason_codes: string[];
  suggested_action: string;
  contact_info: {
    email: string;
    phone: string;
    location: string;
  };
  sla_due_at: string;
  play_source?: string;
}

class EnrollmentDemoSeedService {
  /**
   * Generate the 5 specific starter plays with exact configurations
   */
  private generateStarterPlays(): Play[] {
    return [
      {
        name: 'Speed-to-Lead (5 minutes)',
        description: 'Creates immediate callback tasks for new inquiries from high-yield prospects',
        play_type: 'immediate_response', 
        trigger_type: 'form_submission',
        trigger_configuration: {
          conditions: [
            { field: 'yield_score', operator: 'gte', value: 70 },
            { field: 'time_since_submission', operator: 'lte', value: 300 } // 5 minutes
          ],
          business_hours_only: false
        },
        actions: [
          {
            type: 'create_task',
            action: 'call_student',
            priority: 'urgent',
            delay_minutes: 0,
            assign_to: 'auto',
            template: 'speed_callback'
          }
        ],
        is_active: false,
        expected_lift: 15.3,
        attribution_window_days: 7
      },
      {
        name: 'Stalled 7-Day Re-engage',
        description: 'Nudges applications sitting for a week with multi-channel outreach',
        play_type: 'nurture_sequence',
        trigger_type: 'time_based',
        trigger_configuration: {
          conditions: [
            { field: 'days_since_last_activity', operator: 'gte', value: 7 },
            { field: 'stage', operator: 'in', value: ['application_started', 'document_pending'] }
          ],
          recurrence: 'daily'
        },
        actions: [
          {
            type: 'send_sms',
            message: 'quick_check_in',
            delay_minutes: 0
          },
          {
            type: 'send_email', 
            template: 'stalled_application_reminder',
            delay_minutes: 180 // 3 hours after SMS
          },
          {
            type: 'create_task',
            action: 'call_student',
            priority: 'high',
            delay_minutes: 1440 // Next day
          }
        ],
        is_active: false,
        expected_lift: 23.7,
        attribution_window_days: 14
      },
      {
        name: 'Document Chase',
        description: 'Follows up on missing transcripts and required documents',
        play_type: 'document_follow_up',
        trigger_type: 'document_status',
        trigger_configuration: {
          conditions: [
            { field: 'missing_documents', operator: 'exists', value: true },
            { field: 'days_since_request', operator: 'gte', value: 3 }
          ],
          document_types: ['transcript', 'diploma', 'id_document']
        },
        actions: [
          {
            type: 'send_email',
            template: 'document_reminder',
            delay_minutes: 0
          },
          {
            type: 'create_task',
            action: 'call_student',
            priority: 'medium',
            delay_minutes: 1440,
            note: 'Follow up on missing documents'
          }
        ],
        is_active: false,
        expected_lift: 12.1,
        attribution_window_days: 10
      },
      {
        name: 'RSVP → Interview Booking',
        description: 'Books interviews after webinar attendance for qualified prospects',
        play_type: 'event_response',
        trigger_type: 'event_attendance',
        trigger_configuration: {
          conditions: [
            { field: 'event_type', operator: 'eq', value: 'webinar' },
            { field: 'attendance_duration', operator: 'gte', value: 15 }, // minutes
            { field: 'yield_score', operator: 'gte', value: 60 }
          ],
          immediate_trigger: true
        },
        actions: [
          {
            type: 'send_sms',
            message: 'webinar_followup_interview',
            delay_minutes: 60
          },
          {
            type: 'create_task',
            action: 'schedule_interview',
            priority: 'high',
            delay_minutes: 120,
            metadata: { booking_window: '48_hours' }
          }
        ],
        is_active: false,
        expected_lift: 18.9,
        attribution_window_days: 3
      },
      {
        name: 'Deposit → Onboarding',
        description: 'Stops marketing and starts welcome sequence when deposit is received',
        play_type: 'status_transition',
        trigger_type: 'payment_received',
        trigger_configuration: {
          conditions: [
            { field: 'payment_type', operator: 'eq', value: 'deposit' },
            { field: 'payment_status', operator: 'eq', value: 'confirmed' }
          ],
          immediate_trigger: true
        },
        actions: [
          {
            type: 'update_lead_status',
            status: 'enrolled',
            stop_marketing: true
          },
          {
            type: 'create_task',
            action: 'send_welcome_package',
            priority: 'high',
            delay_minutes: 30
          },
          {
            type: 'enroll_sequence',
            sequence: 'new_student_onboarding',
            delay_minutes: 60
          }
        ],
        is_active: false,
        expected_lift: 8.2,
        attribution_window_days: 1
      }
    ];
  }

  /**
   * Generate the default policies with exact configurations
   */
  private generateDefaultPolicies(): Policy[] {
    return [
      {
        name: 'Quiet Hours',
        description: 'Block calls and texts between 9pm-8am in student\'s local timezone',
        configuration: {
          enabled: true,
          quiet_start: '21:00',
          quiet_end: '08:00',
          timezone_aware: true,
          blocked_actions: ['call_student', 'send_sms'],
          queue_for_morning: true,
          emergency_override: false
        },
        is_active: true,
        category: 'communication_timing'
      },
      {
        name: 'Stop After Deposit',
        description: 'Halt all marketing activities when student pays deposit',
        configuration: {
          enabled: true,
          trigger_events: ['deposit_received', 'enrollment_confirmed'],
          stop_actions: ['marketing_email', 'promotional_sms', 'advertising_call'],
          allow_actions: ['administrative_email', 'welcome_sequence', 'onboarding_tasks'],
          permanent_stop: false
        },
        is_active: true,
        category: 'lifecycle_management'
      },
      {
        name: 'Message Pacing',
        description: 'Maximum 2 messages per day with 3+ hours between communications',
        configuration: {
          enabled: true,
          max_messages_per_day: 2,
          min_hours_between: 3,
          message_types: ['email', 'sms'],
          reset_time: '00:00',
          priority_override: true,
          urgent_bypass: ['deposit_deadline', 'enrollment_deadline']
        },
        is_active: true,
        category: 'communication_frequency'
      },
      {
        name: 'Stage-Based Communication Rules',
        description: 'Email/SMS for early stages, calls only for high-intent prospects',
        configuration: {
          enabled: true,
          stage_rules: {
            'inquiry': { allowed: ['email', 'sms'], forbidden: ['call'] },
            'application_started': { allowed: ['email', 'sms', 'call'], preferred: ['email', 'sms'] },
            'document_review': { allowed: ['email', 'sms', 'call'], preferred: ['call'] },
            'interview_scheduled': { allowed: ['email', 'sms', 'call'], preferred: ['call'] }
          },
          yield_score_overrides: {
            'high': { min_score: 80, allow_calls: true },
            'medium': { min_score: 60, allow_calls: false },
            'low': { min_score: 0, allow_calls: false }
          }
        },
        is_active: true,
        category: 'stage_management'
      },
      {
        name: 'Confidence Bands',
        description: 'Auto-approve high confidence actions, queue others for review',
        configuration: {
          enabled: true,
          confidence_thresholds: {
            'auto_approve': 85,
            'recommend': 65,
            'review_required': 0
          },
          auto_approve_actions: ['send_email', 'send_sms'],
          always_review_actions: ['call_student', 'schedule_interview'],
          ml_model_version: 'v2.1',
          fallback_to_review: true
        },
        is_active: false, // Start disabled
        category: 'automation_control'
      }
    ];
  }

  /**
   * Generate realistic student actions with proper contact info and reasoning
   */
  private generateStudentActions(): StudentAction[] {
    const students = [
      {
        name: 'Emma Rodriguez',
        program: 'Computer Science',
        yield_score: 87,
        yield_band: 'high' as const,
        email: 'emma.rodriguez@email.com',
        phone: '+1-555-0142',
        location: 'San Francisco, CA',
        reasonCodes: ['New inquiry - high intent', 'Speed-to-lead triggered', 'Tech background confirmed'],
        action: 'Call within 5 minutes',
        priority: 'urgent' as const,
        play: 'Speed-to-Lead'
      },
      {
        name: 'Marcus Thompson',
        program: 'Business Administration',
        yield_score: 92,
        yield_band: 'high' as const,
        email: 'marcus.thompson@email.com',
        phone: '+1-555-0143',
        location: 'Austin, TX',
        reasonCodes: ['Application stalled 8 days', 'Documents missing', 'Previous engagement high'],
        action: 'Call and follow up on documents',
        priority: 'high' as const,
        play: 'Stalled 7-Day Re-engage'
      },
      {
        name: 'Sofia Chen',
        program: 'Data Science',
        yield_score: 78,
        yield_band: 'medium' as const,
        email: 'sofia.chen@email.com',
        phone: '+1-555-0144',
        location: 'Seattle, WA',
        reasonCodes: ['Transcript still pending', '4 days since request', 'Application 75% complete'],
        action: 'Email transcript reminder',
        priority: 'medium' as const,
        play: 'Document Chase'
      },
      {
        name: 'James Wilson',
        program: 'Cybersecurity',
        yield_score: 85,
        yield_band: 'high' as const,
        email: 'james.wilson@email.com',
        phone: '+1-555-0145',
        location: 'Denver, CO',
        reasonCodes: ['Attended full webinar', '22 mins engagement', 'Asked specific questions'],
        action: 'Schedule interview within 48hrs',
        priority: 'high' as const,
        play: 'RSVP → Interview Booking'
      },
      {
        name: 'Isabella Martinez',
        program: 'Nursing',
        yield_score: 94,
        yield_band: 'high' as const,
        email: 'isabella.martinez@email.com',
        phone: '+1-555-0146',
        location: 'Phoenix, AZ',
        reasonCodes: ['Deposit received confirmed', 'Stop marketing triggered', 'Begin onboarding'],
        action: 'Send welcome package',
        priority: 'high' as const,
        play: 'Deposit → Onboarding'
      },
      {
        name: 'Ryan Park',
        program: 'Engineering',
        yield_score: 73,
        yield_band: 'medium' as const,
        email: 'ryan.park@email.com',
        phone: '+1-555-0147',
        location: 'Portland, OR',
        reasonCodes: ['Application in progress', '5d since last contact', 'Moderate engagement'],
        action: 'Send check-in email',
        priority: 'medium' as const,
        play: 'Stalled 7-Day Re-engage'
      },
      {
        name: 'Chloe Anderson',
        program: 'Psychology',
        yield_score: 89,
        yield_band: 'high' as const,
        email: 'chloe.anderson@email.com',
        phone: '+1-555-0148',
        location: 'Chicago, IL',
        reasonCodes: ['New form submission', 'High yield score detected', 'Immediate response required'],
        action: 'Call within 5 minutes',
        priority: 'urgent' as const,
        play: 'Speed-to-Lead'
      },
      {
        name: 'Tyler Davis',
        program: 'Digital Marketing',
        yield_score: 81,
        yield_band: 'high' as const,
        email: 'tyler.davis@email.com',
        phone: '+1-555-0149',
        location: 'Miami, FL',
        reasonCodes: ['Missing diploma copy', '6 days overdue', 'Application otherwise complete'],
        action: 'Call about missing documents',
        priority: 'high' as const,
        play: 'Document Chase'
      }
    ];

    return students.map((student, index) => ({
      student_name: student.name,
      program: student.program,
      yield_score: student.yield_score,
      yield_band: student.yield_band,
      action_type: student.action.includes('Call') ? 'call' : student.action.includes('Email') ? 'email' : 'task',
      priority: student.priority,
      reason_codes: student.reasonCodes,
      suggested_action: student.action,
      contact_info: {
        email: student.email,
        phone: student.phone,
        location: student.location
      },
      sla_due_at: this.generateSLATime(student.priority, index),
      play_source: student.play
    }));
  }

  /**
   * Generate realistic SLA times based on priority
   */
  private generateSLATime(priority: string, index: number): string {
    const now = new Date();
    let minutes: number;

    switch (priority) {
      case 'urgent':
        // 0-30 minutes (some overdue)
        minutes = index < 2 ? -Math.random() * 30 : Math.random() * 30;
        break;
      case 'high':
        // 1-6 hours
        minutes = (1 + Math.random() * 5) * 60;
        break;
      case 'medium':
        // 6-24 hours
        minutes = (6 + Math.random() * 18) * 60;
        break;
      default:
        // 1-3 days
        minutes = (24 + Math.random() * 48) * 60;
    }

    return new Date(now.getTime() + minutes * 60 * 1000).toISOString();
  }

  /**
   * Generate program configurations with realistic settings
   */
  private generateProgramConfigurations() {
    return [
      {
        program_name: 'Computer Science',
        settings: {
          stall_days: 7,
          requires_interview: true,
          requires_documents: true,
          auto_nurture: true,
          response_time_target: 120 // 2 hours
        },
        is_active: true
      },
      {
        program_name: 'Business Administration',
        settings: {
          stall_days: 5,
          requires_interview: false,
          requires_documents: true,
          auto_nurture: true,
          response_time_target: 240 // 4 hours
        },
        is_active: true
      },
      {
        program_name: 'Nursing',
        settings: {
          stall_days: 3,
          requires_interview: true,
          requires_documents: true,
          auto_nurture: true,
          response_time_target: 60 // 1 hour
        },
        is_active: true
      },
      {
        program_name: 'Data Science',
        settings: {
          stall_days: 10,
          requires_interview: true,
          requires_documents: true,
          auto_nurture: false,
          response_time_target: 180 // 3 hours
        },
        is_active: true
      }
    ];
  }

  /**
   * Seed plays table with the 5 starter plays
   */
  async seedPlays() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const plays = this.generateStarterPlays();
      
      const { data, error } = await supabase
        .from('plays')
        .insert(
          plays.map(play => ({
            user_id: user.id,
            name: play.name,
            description: play.description,
            play_type: play.play_type,
            trigger_type: play.trigger_type,
            trigger_config: play.trigger_configuration, // Fixed field name
            is_active: play.is_active,
            estimated_impact: `${play.expected_lift}% improvement`
          }))
        )
        .select();

      if (error) throw error;
      console.log('✅ Successfully seeded starter plays');
      return data;
    } catch (error) {
      console.error('❌ Error seeding plays:', error);
      throw error;
    }
  }

  /**
   * Seed policy_configurations table with default policies
   */
  async seedPolicies() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const policies = this.generateDefaultPolicies();
      
      const { data, error } = await supabase
        .from('policy_configurations')
        .insert(
          policies.map(policy => ({
            user_id: user.id,
            policy_name: policy.name, // Fixed field name
            enabled: policy.is_active,
            settings: policy.configuration,
            expected_lift: 15.0 // Default expected lift
          }))
        )
        .select();

      if (error) throw error;
      console.log('✅ Successfully seeded default policies');
      return data;
    } catch (error) {
      console.error('❌ Error seeding policies:', error);
      throw error;
    }
  }

  /**
   * Seed student_actions table with realistic data
   */
  async seedStudentActions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const actions = this.generateStudentActions();
      
      const { data, error } = await supabase
        .from('student_actions')
        .insert(
          actions.map(action => ({
            user_id: user.id,
            student_id: crypto.randomUUID(),
            action_type: action.action_type,
            instruction: action.suggested_action, // Fixed field name
            reason_chips: action.reason_codes,
            priority: this.mapPriorityToNumber(action.priority),
            status: 'pending',
            scheduled_at: action.sla_due_at,
            metadata: {
              student_name: action.student_name,
              program: action.program,
              yield_score: action.yield_score,
              yield_band: action.yield_band,
              contact_info: action.contact_info,
              play_source: action.play_source
            }
          }))
        )
        .select();

      if (error) throw error;
      console.log('✅ Successfully seeded student actions');
      return data;
    } catch (error) {
      console.error('❌ Error seeding student actions:', error);
      throw error;
    }
  }

  /**
   * Map priority strings to numbers
   */
  private mapPriorityToNumber(priority: string): number {
    switch (priority) {
      case 'urgent': return 1;
      case 'high': return 2;
      case 'medium': return 3;
      case 'low': return 4;
      default: return 3;
    }
  }

  /**
   * Seed program_configurations table
   */
  async seedProgramConfigurations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const programs = this.generateProgramConfigurations();
      
      const { data, error } = await supabase
        .from('program_configurations')
        .insert(
          programs.map(program => ({
            user_id: user.id,
            program_name: program.program_name,
            settings: program.settings,
            is_active: program.is_active
          }))
        )
        .select();

      if (error) throw error;
      console.log('✅ Successfully seeded program configurations');
      return data;
    } catch (error) {
      console.error('❌ Error seeding program configurations:', error);
      throw error;
    }
  }

  /**
   * Clear existing data for fresh seeding
   */
  async clearExistingData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await Promise.all([
        supabase.from('student_actions').delete().eq('user_id', user.id),
        supabase.from('plays').delete().eq('user_id', user.id),
        supabase.from('policy_configurations').delete().eq('user_id', user.id),
        supabase.from('program_configurations').delete().eq('user_id', user.id)
      ]);

      console.log('✅ Cleared existing demo data');
    } catch (error) {
      console.error('❌ Error clearing existing data:', error);
      throw error;
    }
  }

  /**
   * Seed all demo data for Phase 1
   */
  async seedAllDemoData() {
    try {
      console.log('🚀 Starting Phase 1: Database Foundation & Demo Data seeding...');
      
      // Clear existing data first
      await this.clearExistingData();
      
      // Seed all components
      await Promise.all([
        this.seedPlays(),
        this.seedPolicies(),
        this.seedStudentActions(),
        this.seedProgramConfigurations()
      ]);

      console.log('🎉 Phase 1 seeding completed successfully!');
      return true;
    } catch (error) {
      console.error('💥 Phase 1 seeding failed:', error);
      throw error;
    }
  }
}

export const enrollmentDemoSeedService = new EnrollmentDemoSeedService();