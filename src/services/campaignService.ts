import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { supabaseWrapper } from './supabaseWrapper';
import { CampaignAnalyticsService } from './campaignAnalyticsService';

type DbCampaign = Database['public']['Tables']['campaigns']['Row'];
type DbCampaignStep = Database['public']['Tables']['campaign_steps']['Row'];
type DbCampaignExecution = Database['public']['Tables']['campaign_executions']['Row'];

export interface Campaign extends DbCampaign {}
export interface CampaignStep extends DbCampaignStep {}
export interface CampaignExecution extends DbCampaignExecution {}

export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
export type CampaignStepInsert = Database['public']['Tables']['campaign_steps']['Insert'];

export class CampaignService {
  static async getCampaigns(): Promise<Campaign[]> {
    return supabaseWrapper.retryOperation(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    });
  }

  static async getCampaignById(id: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  static async createCampaign(campaignData: Omit<CampaignInsert, 'user_id'>): Promise<Campaign> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        ...campaignData,
        user_id: user.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Sync elements to campaign_steps table
    const elements = (campaignData.campaign_data as any)?.elements || [];
    if (elements.length > 0) {
      await this.syncCampaignSteps(data.id, elements);
    }

    return data;
  }

  static async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    // Track status changes
    if (updates.status) {
      const oldCampaign = await this.getCampaigns().then(campaigns => 
        campaigns.find(c => c.id === id)
      );
      
      if (oldCampaign && oldCampaign.status !== updates.status) {
        const actionType = updates.status === 'active' ? 'started' : 'paused';
        await CampaignAnalyticsService.trackAction(id, actionType, {
          previousStatus: oldCampaign.status,
          newStatus: updates.status,
        });
      }
    }

    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Sync elements to campaign_steps table if campaign_data is being updated
    if (updates.campaign_data) {
      const elements = (updates.campaign_data as any)?.elements || [];
      await this.syncCampaignSteps(id, elements);
    }

    return data;
  }

  // Sync campaign elements to campaign_steps table
  static async syncCampaignSteps(campaignId: string, elements: any[]): Promise<void> {
    // First, delete existing steps
    await supabase
      .from('campaign_steps')
      .delete()
      .eq('campaign_id', campaignId);

    // Then insert new steps
    if (elements.length > 0) {
      const steps = elements.map((element: any, index: number) => ({
        campaign_id: campaignId,
        step_type: element.type,
        step_config: {
          ...element.config,
          title: element.title,
          description: element.description,
        },
        order_index: index,
        is_active: true,
      }));

      const { error } = await supabase
        .from('campaign_steps')
        .insert(steps);

      if (error) {
        console.error('Failed to sync campaign steps:', error);
      }
    }
  }

  // Convert campaign_steps back to builder elements
  static async getCampaignElements(campaignId: string): Promise<any[]> {
    const { data: steps, error } = await supabase
      .from('campaign_steps')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('order_index');

    if (error || !steps) return [];

    return steps.map((step) => {
      const stepConfig = step.step_config as Record<string, any> | null;
      return {
        id: step.id,
        type: step.step_type,
        title: stepConfig?.title || step.step_type,
        description: stepConfig?.description || '',
        position: step.order_index,
        config: stepConfig || {},
        elementType: 'campaign',
      };
    });
  }

  static async deleteCampaign(id: string): Promise<void> {
    // Delete campaign steps first
    await supabase
      .from('campaign_steps')
      .delete()
      .eq('campaign_id', id);

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getCampaignSteps(campaignId: string): Promise<CampaignStep[]> {
    const { data, error } = await supabase
      .from('campaign_steps')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('order_index');

    if (error) throw error;
    return data || [];
  }

  static async updateCampaignStep(id: string, updates: Partial<CampaignStep>): Promise<CampaignStep> {
    const { data, error } = await supabase
      .from('campaign_steps')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCampaignStep(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaign_steps')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async createCampaignStep(stepData: CampaignStepInsert): Promise<CampaignStep> {
    const { data, error } = await supabase
      .from('campaign_steps')
      .insert(stepData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCampaignExecutions(campaignId: string): Promise<CampaignExecution[]> {
    const { data, error } = await supabase
      .from('campaign_executions')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async executeCampaign(campaignId: string, testMode: boolean = false): Promise<void> {
    // Track execution
    await CampaignAnalyticsService.trackAction(campaignId, 'executed');

    const { data, error } = await supabase.functions.invoke('execute-campaign', {
      body: { campaignId, testMode }
    });

    if (error) throw error;
  }

  static async getCampaignAnalytics() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { totalCampaigns: 0, activeCampaigns: 0, totalExecutions: 0, successRate: 0 };

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('id, status')
      .eq('user_id', user.id);

    if (error) throw error;

    const campaignIds = campaigns?.map(c => c.id) || [];
    
    // Get execution stats
    let totalExecutions = 0;
    let successfulExecutions = 0;

    if (campaignIds.length > 0) {
      const { data: executions } = await supabase
        .from('campaign_executions')
        .select('id, status')
        .in('campaign_id', campaignIds);

      totalExecutions = executions?.length || 0;
      successfulExecutions = executions?.filter(e => e.status === 'completed' || e.status === 'started').length || 0;
    }

    const successRate = totalExecutions > 0 
      ? Math.round((successfulExecutions / totalExecutions) * 100) 
      : 0;

    return {
      totalCampaigns: campaigns?.length || 0,
      activeCampaigns: campaigns?.filter(c => c.status === 'active').length || 0,
      totalExecutions,
      successRate,
    };
  }
}