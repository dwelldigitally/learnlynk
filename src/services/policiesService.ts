import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DbPolicy = Database['public']['Tables']['policies']['Row'];
type DbPolicyInsert = Database['public']['Tables']['policies']['Insert'];

export interface Policy extends DbPolicy {}
export type PolicyInsert = DbPolicyInsert;

export class PoliciesService {
  static async getPolicies(): Promise<Policy[]> {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .order('created_at');

    if (error) throw error;
    return data || [];
  }

  static async updatePolicy(id: string, updates: Partial<Policy>): Promise<Policy> {
    const { data, error } = await supabase
      .from('policies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async togglePolicy(id: string, isActive: boolean): Promise<Policy> {
    return this.updatePolicy(id, { is_active: isActive });
  }

  static async updatePolicyConfiguration(id: string, configuration: Record<string, any>): Promise<Policy> {
    return this.updatePolicy(id, { configuration });
  }

  static async checkPolicyViolation(actionType: string, studentData: any): Promise<{ allowed: boolean; reason?: string }> {
    const policies = await this.getPolicies();
    const activePolicies = policies.filter(p => p.is_active);

    for (const policy of activePolicies) {
      const config = policy.configuration as Record<string, any>;

      switch (policy.policy_type) {
        case 'quiet_hours':
          if (config.enabled && (actionType === 'call' || actionType === 'sms')) {
            const now = new Date();
            const hour = now.getHours();
            const startHour = parseInt(config.start_time?.split(':')[0] || '21');
            const endHour = parseInt(config.end_time?.split(':')[0] || '8');
            
            if (hour >= startHour || hour < endHour) {
              return { allowed: false, reason: 'Queued for morning (quiet hours)' };
            }
          }
          break;

        case 'message_pacing':
          if (config.enabled) {
            // In real implementation, check recent message history
            // For demo, randomly enforce pacing
            if (Math.random() < 0.2) {
              return { allowed: false, reason: 'Too many recent messages' };
            }
          }
          break;

        case 'stop_triggers':
          if (config.enabled && studentData?.hasDeposit) {
            if (actionType === 'email' && actionType !== 'onboarding') {
              return { allowed: false, reason: 'Marketing stopped after deposit' };
            }
          }
          break;
      }
    }

    return { allowed: true };
  }

  static async getPolicyPreview(): Promise<string> {
    const policies = await this.getPolicies();
    const activePolicies = policies.filter(p => p.is_active);
    
    if (activePolicies.length === 0) {
      return "No active policies configured.";
    }

    const descriptions = activePolicies.map(p => {
      const config = p.configuration as Record<string, any>;
      
      switch (p.policy_type) {
        case 'quiet_hours':
          return config.enabled ? `messages wait until morning` : null;
        case 'stop_triggers':
          return config.enabled ? `marketing stops instantly after deposit` : null;
        case 'message_pacing':
          return config.enabled ? `limit ${config.max_messages_per_day || 2} messages per day` : null;
        default:
          return null;
      }
    }).filter(Boolean);

    return `With these policies: ${descriptions.join(', ')}.`;
  }
}