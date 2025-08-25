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

    // Check journey-aware policies first if journey context is provided
    if (studentData?.journeyId && studentData?.journeyStage) {
      const journeyCheck = await this.checkJourneyPolicies(
        actionType, 
        studentData,
        activePolicies
      );
      if (!journeyCheck.allowed) {
        return journeyCheck;
      }
    }

    // Standard policy checks
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
            // Enhanced with journey context
            const paceLimit = this.getJourneyAwarePaceLimit(config, studentData);
            if (Math.random() < paceLimit) {
              return { allowed: false, reason: 'Too many recent messages' };
            }
          }
          break;

        case 'stop_triggers':
          if (config.enabled && studentData?.hasDeposit) {
            if (actionType === 'email') {
              return { allowed: false, reason: 'Marketing stopped after deposit' };
            }
          }
          break;
      }
    }

    return { allowed: true };
  }

  private static async checkJourneyPolicies(
    actionType: string,
    studentData: any,
    activePolicies: any[]
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Import here to avoid circular dependency
    const { JourneyOrchestrator } = await import('./journeyOrchestrator');
    
    // Get journey-specific policy overrides
    const policyOverrides = await JourneyOrchestrator.getJourneyPolicyOverrides(
      studentData.journeyId,
      studentData.journeyStage
    );

    for (const override of policyOverrides) {
      const config = override.override_config as Record<string, any>;

      if (config.policy_type === 'stage_communication_rules') {
        // Stage-specific communication restrictions
        if (config.blocked_channels?.includes(actionType)) {
          return { 
            allowed: false, 
            reason: `${actionType} not allowed in ${studentData.journeyStage} stage` 
          };
        }
      }

      if (config.policy_type === 'stage_timing_rules') {
        // Enhanced timing rules based on journey progression
        const stageAge = this.getStageAge(studentData);
        if (config.min_stage_age_hours && stageAge < config.min_stage_age_hours) {
          return { 
            allowed: false, 
            reason: `Must wait ${config.min_stage_age_hours}h in current stage` 
          };
        }
      }
    }

    return { allowed: true };
  }

  private static getJourneyAwarePaceLimit(config: any, studentData: any): number {
    // Adjust pacing based on journey urgency
    let basePace = 0.2; // 20% chance of triggering pace limit
    
    if (studentData?.journeyStage === 'enrollment') {
      basePace = 0.1; // More lenient for enrollment stage
    } else if (studentData?.journeyStage === 'application') {
      basePace = 0.3; // Stricter for application stage
    }
    
    return basePace;
  }

  private static getStageAge(studentData: any): number {
    if (!studentData?.stageStartedAt) return 999; // Very old if unknown
    
    const stageStart = new Date(studentData.stageStartedAt).getTime();
    const now = Date.now();
    return (now - stageStart) / (1000 * 60 * 60); // Hours
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