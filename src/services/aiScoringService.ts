import { supabase } from '@/integrations/supabase/client';

export interface AIScoreBreakdown {
  factor: string;
  label: string;
  weight: number;
  value: any;
  points: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface AIScoreResult {
  success: boolean;
  ai_score: number;
  score_breakdown: AIScoreBreakdown[];
  model_version?: number;
  model_type?: string;
  calculated_at?: string;
  error?: string;
}

export interface AIModelInfo {
  id: string;
  tenant_id: string;
  model_version: number;
  feature_weights: Record<string, number>;
  performance_metrics: {
    type: string;
    confidence?: number;
    key_insights?: string[];
    top_positive_factors?: string[];
    top_negative_factors?: string[];
    trained_on?: {
      converted_count: number;
      lost_count: number;
    };
  };
  training_sample_size: number;
  last_trained_at: string;
  is_active: boolean;
}

export interface TrainingDataStats {
  total: number;
  converted: number;
  lost: number;
  pending: number;
  ready_for_training: boolean;
  min_required: number;
}

export const aiScoringService = {
  /**
   * Calculate AI score for a single lead
   */
  async calculateScore(leadId: string, tenantId: string): Promise<AIScoreResult> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-calculate-lead-score', {
        body: { lead_id: leadId, tenant_id: tenantId }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error calculating AI score:', error);
      return {
        success: false,
        ai_score: 0,
        score_breakdown: [],
        error: error.message
      };
    }
  },

  /**
   * Calculate AI scores for multiple leads in batch
   */
  async calculateScoresBatch(leadIds: string[], tenantId: string, onProgress?: (completed: number, total: number) => void): Promise<Map<string, AIScoreResult>> {
    const results = new Map<string, AIScoreResult>();
    
    // Process in parallel batches of 10
    const batchSize = 10;
    let completed = 0;
    
    for (let i = 0; i < leadIds.length; i += batchSize) {
      const batch = leadIds.slice(i, i + batchSize);
      const promises = batch.map(leadId => 
        this.calculateScore(leadId, tenantId).then(result => ({ leadId, result }))
      );
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ leadId, result }) => {
        results.set(leadId, result);
      });
      
      completed += batch.length;
      onProgress?.(completed, leadIds.length);
    }
    
    return results;
  },

  /**
   * Train or retrain the AI scoring model for a tenant
   */
  async trainModel(tenantId: string, forceRetrain = false): Promise<{ success: boolean; model?: AIModelInfo; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-train-scoring-model', {
        body: { tenant_id: tenantId, force_retrain: forceRetrain }
      });

      if (error) throw error;
      return { success: true, model: data.model };
    } catch (error: any) {
      console.error('Error training AI model:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Snapshot training data when a lead outcome is known
   */
  async snapshotTrainingData(leadId: string, tenantId: string, outcome: 'converted' | 'lost' | 'pending'): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-snapshot-training-data', {
        body: { lead_id: leadId, tenant_id: tenantId, outcome }
      });

      if (error) throw error;
      return data.success;
    } catch (error) {
      console.error('Error snapshotting training data:', error);
      return false;
    }
  },

  /**
   * Get the active AI model for a tenant
   */
  async getActiveModel(tenantId: string): Promise<AIModelInfo | null> {
    try {
      const { data, error } = await supabase
        .from('ai_scoring_models')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No model found
        throw error;
      }

      return data as unknown as AIModelInfo;
    } catch (error) {
      console.error('Error fetching active model:', error);
      return null;
    }
  },

  /**
   * Get training data statistics for a tenant
   */
  async getTrainingDataStats(tenantId: string): Promise<TrainingDataStats> {
    try {
      const { data, error } = await supabase
        .from('ai_scoring_training_data')
        .select('outcome')
        .eq('tenant_id', tenantId);

      if (error) throw error;

      const converted = data?.filter(d => d.outcome === 'converted').length || 0;
      const lost = data?.filter(d => d.outcome === 'lost').length || 0;
      const pending = data?.filter(d => d.outcome === 'pending').length || 0;
      const minRequired = 10;

      return {
        total: data?.length || 0,
        converted,
        lost,
        pending,
        ready_for_training: converted >= minRequired && lost >= minRequired,
        min_required: minRequired
      };
    } catch (error) {
      console.error('Error fetching training data stats:', error);
      return {
        total: 0,
        converted: 0,
        lost: 0,
        pending: 0,
        ready_for_training: false,
        min_required: 10
      };
    }
  },

  /**
   * Get score history for a lead
   */
  async getScoreHistory(leadId: string, limit = 10): Promise<Array<{ ai_score: number; calculated_at: string; model_version: number }>> {
    try {
      const { data, error } = await supabase
        .from('lead_ai_score_history')
        .select('ai_score, calculated_at, model_version')
        .eq('lead_id', leadId)
        .order('calculated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as any[]) || [];
    } catch (error) {
      console.error('Error fetching score history:', error);
      return [];
    }
  },

  /**
   * Get model prediction accuracy
   */
  async getModelAccuracy(tenantId: string): Promise<{ total: number; accurate: number; accuracy_rate: number }> {
    try {
      const { data, error } = await supabase
        .from('ai_scoring_predictions')
        .select('was_accurate')
        .eq('tenant_id', tenantId)
        .not('was_accurate', 'is', null);

      if (error) throw error;

      const total = data?.length || 0;
      const accurate = data?.filter(d => d.was_accurate).length || 0;

      return {
        total,
        accurate,
        accuracy_rate: total > 0 ? (accurate / total) * 100 : 0
      };
    } catch (error) {
      console.error('Error fetching model accuracy:', error);
      return { total: 0, accurate: 0, accuracy_rate: 0 };
    }
  },

  /**
   * Backfill training data from existing converted/lost leads
   */
  async backfillTrainingData(tenantId: string, onProgress?: (completed: number, total: number) => void): Promise<{ success: number; failed: number }> {
    try {
      // Get all leads with known outcomes that don't have training data yet
      const { data: existingTrainingData } = await supabase
        .from('ai_scoring_training_data')
        .select('lead_id')
        .eq('tenant_id', tenantId);

      const existingLeadIds = new Set(existingTrainingData?.map(d => d.lead_id) || []);

      const { data: leads, error } = await supabase
        .from('leads')
        .select('id, status')
        .eq('tenant_id', tenantId)
        .in('status', ['converted', 'lost']);

      if (error) throw error;

      // Filter leads that don't have training data yet
      const leadsToBackfill = (leads || []).filter(lead => !existingLeadIds.has(lead.id));
      
      let success = 0;
      let failed = 0;
      
      for (let i = 0; i < leadsToBackfill.length; i++) {
        const lead = leadsToBackfill[i];
        try {
          const result = await this.snapshotTrainingData(
            lead.id, 
            tenantId, 
            lead.status.toLowerCase() as 'converted' | 'lost'
          );
          if (result) {
            success++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
        onProgress?.(i + 1, leadsToBackfill.length);
      }

      return { success, failed };
    } catch (error) {
      console.error('Error in backfillTrainingData:', error);
      return { success: 0, failed: 0 };
    }
  },

  /**
   * Score all active leads for a tenant
   */
  async scoreAllLeads(tenantId: string, onProgress?: (completed: number, total: number) => void): Promise<{ success: number; failed: number }> {
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('id')
        .eq('tenant_id', tenantId)
        .not('status', 'in', '("converted","lost")');

      if (error) throw error;

      const leadIds = (leads || []).map(l => l.id);
      const results = await this.calculateScoresBatch(leadIds, tenantId, onProgress);

      let success = 0;
      let failed = 0;
      results.forEach(result => {
        if (result.success) success++;
        else failed++;
      });

      return { success, failed };
    } catch (error) {
      console.error('Error in scoreAllLeads:', error);
      return { success: 0, failed: 0 };
    }
  }
};
