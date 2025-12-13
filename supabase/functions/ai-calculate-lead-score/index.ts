import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScoreBreakdown {
  factor: string;
  label: string;
  weight: number;
  value: any;
  points: number;
  impact: 'positive' | 'negative' | 'neutral';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { lead_id, tenant_id, save_history = true } = await req.json();

    if (!lead_id || !tenant_id) {
      throw new Error('lead_id and tenant_id are required');
    }

    console.log(`Calculating AI score for lead ${lead_id}`);

    // Fetch the active model for this tenant
    const { data: model, error: modelError } = await supabase
      .from('ai_scoring_models')
      .select('*')
      .eq('tenant_id', tenant_id)
      .eq('is_active', true)
      .single();

    if (modelError || !model) {
      // No model exists - return rule-based score
      console.log('No AI model found, using basic scoring');
      return new Response(JSON.stringify({
        success: true,
        ai_score: 50,
        score_breakdown: [],
        model_type: 'none',
        message: 'No AI model trained yet. Train a model to get AI-powered scores.',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract features for this lead
    const featuresResponse = await supabase.functions.invoke('ai-extract-lead-features', {
      body: { lead_id, tenant_id }
    });

    if (!featuresResponse.data?.success) {
      throw new Error('Failed to extract lead features');
    }

    const features = featuresResponse.data.features;
    const featureWeights = model.feature_weights || {};

    // Calculate score based on features and weights
    let totalScore = 50; // Base score
    const breakdown: ScoreBreakdown[] = [];

    // Feature labels for display
    const featureLabels: Record<string, string> = {
      source_is_referral: 'Referral source',
      source_is_organic: 'Organic source',
      source_is_paid: 'Paid advertising',
      source_is_webform: 'Web form submission',
      has_email: 'Email provided',
      has_phone: 'Phone provided',
      has_country: 'Country specified',
      has_city: 'City specified',
      has_program_interest: 'Program interest indicated',
      has_preferred_intake: 'Preferred intake selected',
      has_been_contacted: 'Been contacted',
      document_completion_rate: 'Document completion',
      form_submissions: 'Form submissions',
      is_reenquiry: 'Re-enquiry',
      is_assigned: 'Advisor assigned',
      has_tags: 'Has tags',
      has_notes: 'Has notes',
      has_utm_source: 'Has UTM tracking',
      days_since_created_penalty: 'Age penalty',
      days_since_last_contact_penalty: 'Contact recency penalty',
      call_count: 'Call interactions',
      meeting_count: 'Meeting interactions',
      total_activities: 'Total activities',
      reenquiry_count: 'Re-enquiry count',
    };

    // Apply each weight
    for (const [feature, weight] of Object.entries(featureWeights)) {
      const numericWeight = Number(weight) || 0;
      let featureValue = features[feature];
      let points = 0;

      // Handle special penalty features
      if (feature === 'days_since_created_penalty') {
        // Penalty increases with age
        const days = features.days_since_created || 0;
        const penaltyFactor = Math.min(days / 30, 3); // Max 3x penalty after 90 days
        points = numericWeight * penaltyFactor * 10;
        featureValue = `${days} days`;
      } else if (feature === 'days_since_last_contact_penalty') {
        const days = features.days_since_last_contact || 0;
        if (days > 0) {
          const penaltyFactor = Math.min(days / 14, 2); // Max 2x penalty after 28 days
          points = numericWeight * penaltyFactor * 10;
          featureValue = `${days} days ago`;
        }
      } else if (typeof featureValue === 'boolean') {
        // Boolean features: apply weight if true
        if (featureValue) {
          points = numericWeight * 10;
        }
      } else if (typeof featureValue === 'number') {
        // Numeric features: scale by value
        if (feature === 'document_completion_rate') {
          points = numericWeight * featureValue * 10;
          featureValue = `${Math.round(featureValue * 100)}%`;
        } else if (feature === 'form_submissions' || feature === 'reenquiry_count') {
          points = numericWeight * Math.min(featureValue, 5) * 2;
        } else if (feature.includes('count') || feature === 'total_activities') {
          points = numericWeight * Math.min(featureValue, 10);
        } else {
          points = numericWeight * 10;
        }
      }

      if (points !== 0) {
        totalScore += points;
        breakdown.push({
          factor: feature,
          label: featureLabels[feature] || feature.replace(/_/g, ' '),
          weight: numericWeight,
          value: featureValue,
          points: Math.round(points * 10) / 10,
          impact: points > 0 ? 'positive' : points < 0 ? 'negative' : 'neutral',
        });
      }
    }

    // Normalize score to 0-100
    const normalizedScore = Math.max(0, Math.min(100, Math.round(totalScore)));

    // Sort breakdown by impact magnitude
    breakdown.sort((a, b) => Math.abs(b.points) - Math.abs(a.points));

    // Update lead with new AI score
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        ai_score: normalizedScore,
        ai_score_breakdown: breakdown,
        ai_score_updated_at: new Date().toISOString(),
      })
      .eq('id', lead_id);

    if (updateError) {
      console.error('Failed to update lead AI score:', updateError);
    }

    // Save to history if requested
    if (save_history) {
      await supabase
        .from('lead_ai_score_history')
        .insert({
          lead_id,
          tenant_id,
          ai_score: normalizedScore,
          score_breakdown: breakdown,
          model_version: model.model_version,
        });
    }

    // Save prediction for accuracy tracking
    await supabase
      .from('ai_scoring_predictions')
      .insert({
        tenant_id,
        lead_id,
        predicted_score: normalizedScore,
      });

    console.log(`Calculated AI score ${normalizedScore} for lead ${lead_id}`);

    return new Response(JSON.stringify({
      success: true,
      ai_score: normalizedScore,
      score_breakdown: breakdown.slice(0, 10), // Top 10 factors
      model_version: model.model_version,
      model_type: model.performance_metrics?.type || 'unknown',
      calculated_at: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error calculating AI score:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
