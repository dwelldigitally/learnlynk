import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { supabaseWrapper } from './supabaseWrapper';

type PolicyConfiguration = Database['public']['Tables']['policy_configurations']['Row'];
type PolicyConfigurationInsert = Database['public']['Tables']['policy_configurations']['Insert'];

export interface PolicyConfig extends PolicyConfiguration {}
export type PolicyConfigInsert = PolicyConfigurationInsert;

export class PolicyConfigurationService {
  // Get all policy configurations
  static async getAllConfigurations(): Promise<PolicyConfig[]> {
    return supabaseWrapper.retryOperation(async () => {
      const { data, error } = await supabase
        .from('policy_configurations')
        .select('*')
        .order('created_at');

      if (error) throw error;
      return data || [];
    });
  }

  // Get playbook configurations (policy_name like playbooks)
  static async getPlaybooks(): Promise<PolicyConfig[]> {
    const { data, error } = await supabase
      .from('policy_configurations')
      .select('*')
      .in('policy_name', ['5-minute-callback', 'stalled-7day-reengage', 'event-rsvp-interview', 'document-chase'])
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  // Get policy configurations (non-playbook policies)
  static async getPolicies(): Promise<PolicyConfig[]> {
    const { data, error } = await supabase
      .from('policy_configurations')
      .select('*')
      .in('policy_name', ['quiet_hours', 'message_pacing', 'stop_triggers', 'confidence_bands', 'stage_communication_rules'])
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  // Update a policy configuration
  static async updateConfiguration(id: string, updates: Partial<PolicyConfig>): Promise<PolicyConfig> {
    const { data, error } = await supabase
      .from('policy_configurations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Toggle enabled state
  static async toggleEnabled(id: string, enabled: boolean): Promise<PolicyConfig> {
    return this.updateConfiguration(id, { enabled });
  }

  // Update settings
  static async updateSettings(id: string, settings: Record<string, any>): Promise<PolicyConfig> {
    return this.updateConfiguration(id, { settings });
  }

  // Create or update configuration
  static async upsertConfiguration(policyName: string, config: Partial<PolicyConfigInsert>): Promise<PolicyConfig> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if exists
    const { data: existing } = await supabase
      .from('policy_configurations')
      .select('*')
      .eq('policy_name', policyName)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      // Update existing
      return this.updateConfiguration(existing.id, config);
    } else {
      // Create new
      const { data, error } = await supabase
        .from('policy_configurations')
        .insert({
          user_id: user.id,
          policy_name: policyName,
          ...config
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Check policy violation (enhanced from original service)
  static async checkPolicyViolation(actionType: string, studentData: any): Promise<{ allowed: boolean; reason?: string }> {
    const configs = await this.getPolicies();
    const activeConfigs = configs.filter(c => c.enabled);

    for (const config of activeConfigs) {
      const settings = config.settings as Record<string, any>;

      switch (config.policy_name) {
        case 'quiet_hours':
          if (settings.enabled && (actionType === 'call' || actionType === 'sms')) {
            const now = new Date();
            const hour = now.getHours();
            const startHour = parseInt(settings.start_time?.split(':')[0] || '21');
            const endHour = parseInt(settings.end_time?.split(':')[0] || '8');
            
            if (hour >= startHour || hour < endHour) {
              return { allowed: false, reason: 'Queued for morning (quiet hours)' };
            }
          }
          break;

        case 'message_pacing':
          if (settings.enabled) {
            const maxPerDay = settings.max_messages_per_day || 2;
            // In real implementation, check actual message count
            if (Math.random() < 0.3) { // Placeholder logic
              return { allowed: false, reason: 'Too many recent messages' };
            }
          }
          break;

        case 'stop_triggers':
          if (settings.enabled && studentData?.hasDeposit) {
            if (actionType === 'email' && settings.stop_on_deposit) {
              return { allowed: false, reason: 'Marketing stopped after deposit' };
            }
          }
          break;
      }
    }

    return { allowed: true };
  }

  // Get policy preview
  static async getPolicyPreview(): Promise<string> {
    const configs = await this.getPolicies();
    const activeConfigs = configs.filter(c => c.enabled);
    
    if (activeConfigs.length === 0) {
      return "No active policies configured.";
    }

    const descriptions = activeConfigs.map(c => {
      const settings = c.settings as Record<string, any>;
      
      switch (c.policy_name) {
        case 'quiet_hours':
          return settings.enabled ? `messages wait until morning` : null;
        case 'stop_triggers':
          return settings.enabled ? `marketing stops instantly after deposit` : null;
        case 'message_pacing':
          return settings.enabled ? `limit ${settings.max_messages_per_day || 2} messages per day` : null;
        default:
          return null;
      }
    }).filter(Boolean);

    return `With these policies: ${descriptions.join(', ')}.`;
  }

  // Seed default policies if they don't exist
  static async seedDefaultPolicies(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const defaultPolicies = [
      {
        policy_name: 'quiet_hours',
        enabled: true,
        settings: {
          enabled: true,
          start_time: '20:00',
          end_time: '09:00'
        },
        expected_lift: 15
      },
      {
        policy_name: 'message_pacing',
        enabled: true,
        settings: {
          enabled: true,
          max_messages_per_day: 3,
          min_hours_between: 4
        },
        expected_lift: 23
      },
      {
        policy_name: 'stop_triggers',
        enabled: true,
        settings: {
          enabled: true,
          stop_on_deposit: true,
          stop_on_enrollment: true
        },
        expected_lift: 41
      }
    ];

    for (const policy of defaultPolicies) {
      await this.upsertConfiguration(policy.policy_name, policy);
    }
  }

  // Demo policy activity data
  static async getDemoPolicyActivity(): Promise<{
    totalBlocked: number;
    queuedMessages: number;
    complianceRate: number;
    weeklyActivity: Array<{ day: string; blocked: number; queued: number }>;
    recentActions: Array<{ time: string; action: string; policy: string; reason: string }>;
  }> {
    // Simulate realistic demo data
    return {
      totalBlocked: 247,
      queuedMessages: 52,
      complianceRate: 98.5,
      weeklyActivity: [
        { day: 'Mon', blocked: 23, queued: 8 },
        { day: 'Tue', blocked: 31, queued: 12 },
        { day: 'Wed', blocked: 28, queued: 7 },
        { day: 'Thu', blocked: 35, queued: 15 },
        { day: 'Fri', blocked: 42, queued: 18 },
        { day: 'Sat', blocked: 19, queued: 4 },
        { day: 'Sun', blocked: 15, queued: 3 }
      ],
      recentActions: [
        { time: '2 min ago', action: 'SMS blocked', policy: 'Quiet Hours', reason: 'Outside business hours' },
        { time: '15 min ago', action: 'Email queued', policy: 'Message Pacing', reason: 'Too many recent messages' },
        { time: '32 min ago', action: 'Call blocked', policy: 'Stop Triggers', reason: 'Student has deposited' },
        { time: '1 hr ago', action: 'SMS queued', policy: 'Quiet Hours', reason: 'Weekend quiet period' },
        { time: '2 hr ago', action: 'Email blocked', policy: 'Stop Triggers', reason: 'Enrollment complete' }
      ]
    };
  }
}