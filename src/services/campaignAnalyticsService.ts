import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type CampaignAnalytic = Database['public']['Tables']['campaign_analytics']['Row'];
type CampaignAnalyticInsert = Database['public']['Tables']['campaign_analytics']['Insert'];

export type ActionType = 'started' | 'paused' | 'viewed' | 'executed' | 'edited' | 'completed';

export class CampaignAnalyticsService {
  /**
   * Track a campaign action
   */
  static async trackAction(
    campaignId: string,
    actionType: ActionType,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('No authenticated user for tracking campaign action');
        return;
      }

      const { error } = await supabase
        .from('campaign_analytics')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          action_type: actionType,
          action_metadata: metadata || {},
          user_agent: navigator.userAgent,
        });

      if (error) {
        console.error('Error tracking campaign action:', error);
      }
    } catch (error) {
      console.error('Error tracking campaign action:', error);
    }
  }

  /**
   * Get analytics for a specific campaign
   */
  static async getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytic[]> {
    const { data, error } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get analytics summary for a campaign
   */
  static async getCampaignAnalyticsSummary(campaignId: string) {
    const analytics = await this.getCampaignAnalytics(campaignId);

    const summary = {
      totalActions: analytics.length,
      actionsByType: {} as Record<ActionType, number>,
      uniqueUsers: new Set(analytics.map(a => a.user_id)).size,
      recentActions: analytics.slice(0, 10),
      timeline: analytics.map(a => ({
        action: a.action_type,
        timestamp: a.created_at,
        userId: a.user_id,
        metadata: a.action_metadata,
      })),
    };

    // Count actions by type
    analytics.forEach(action => {
      const type = action.action_type as ActionType;
      summary.actionsByType[type] = (summary.actionsByType[type] || 0) + 1;
    });

    return summary;
  }

  /**
   * Get all campaigns with their analytics
   */
  static async getCampaignsWithAnalytics() {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        campaign_analytics (
          id,
          action_type,
          created_at,
          user_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user analytics for campaigns they've interacted with
   */
  static async getUserCampaignActivity(userId: string) {
    const { data, error } = await supabase
      .from('campaign_analytics')
      .select(`
        *,
        campaigns (
          id,
          name,
          status,
          campaign_type
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get campaign performance metrics
   */
  static async getCampaignPerformance(campaignId: string) {
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error) throw error;

    const analytics = await this.getCampaignAnalytics(campaignId);

    return {
      campaign,
      metrics: {
        totalViews: campaign.total_views || 0,
        totalExecutions: campaign.total_executions || 0,
        startedBy: campaign.started_by_user_id,
        startedAt: campaign.started_at,
        lastExecutedAt: campaign.last_executed_at,
        lastExecutedBy: campaign.last_executed_by_user_id,
      },
      activityLog: analytics,
    };
  }
}
