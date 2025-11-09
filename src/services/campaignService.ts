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
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    });
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
    return data;
  }

  static async deleteCampaign(id: string): Promise<void> {
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

  static async executeCampaign(campaignId: string): Promise<void> {
    // Track execution
    await CampaignAnalyticsService.trackAction(campaignId, 'executed');

    const { data, error } = await supabase.functions.invoke('execute-campaign', {
      body: { campaignId }
    });

    if (error) throw error;
  }

  static async getCampaignAnalytics() {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        campaign_executions(count)
      `);

    if (error) throw error;

    return {
      totalCampaigns: campaigns?.length || 0,
      activeCampaigns: campaigns?.filter(c => c.status === 'active').length || 0,
      totalExecutions: campaigns?.reduce((sum, c) => sum + (c.campaign_executions?.length || 0), 0) || 0,
    };
  }
}