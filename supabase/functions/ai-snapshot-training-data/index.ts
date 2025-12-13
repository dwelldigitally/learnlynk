import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { lead_id, tenant_id, outcome } = await req.json();

    if (!lead_id || !tenant_id || !outcome) {
      throw new Error('lead_id, tenant_id, and outcome are required');
    }

    if (!['converted', 'lost', 'pending'].includes(outcome)) {
      throw new Error('outcome must be converted, lost, or pending');
    }

    console.log(`Snapshotting training data for lead ${lead_id} with outcome ${outcome}`);

    // Check if we already have training data for this lead
    const { data: existingData } = await supabase
      .from('ai_scoring_training_data')
      .select('id')
      .eq('lead_id', lead_id)
      .single();

    if (existingData) {
      // Update existing record
      const featuresResponse = await supabase.functions.invoke('ai-extract-lead-features', {
        body: { lead_id, tenant_id }
      });

      if (!featuresResponse.data?.success) {
        throw new Error('Failed to extract features');
      }

      const { error: updateError } = await supabase
        .from('ai_scoring_training_data')
        .update({
          features: featuresResponse.data.features,
          outcome,
          outcome_date: new Date().toISOString(),
        })
        .eq('id', existingData.id);

      if (updateError) {
        throw new Error(`Failed to update training data: ${updateError.message}`);
      }

      console.log(`Updated training data for lead ${lead_id}`);

      return new Response(JSON.stringify({
        success: true,
        message: 'Training data updated',
        action: 'updated',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract current features
    const featuresResponse = await supabase.functions.invoke('ai-extract-lead-features', {
      body: { lead_id, tenant_id }
    });

    if (!featuresResponse.data?.success) {
      throw new Error('Failed to extract features');
    }

    // Create training data snapshot
    const { error: insertError } = await supabase
      .from('ai_scoring_training_data')
      .insert({
        tenant_id,
        lead_id,
        features: featuresResponse.data.features,
        outcome,
        outcome_date: new Date().toISOString(),
      });

    if (insertError) {
      throw new Error(`Failed to save training data: ${insertError.message}`);
    }

    console.log(`Created training data snapshot for lead ${lead_id}`);

    // Update prediction accuracy if we had a prediction
    if (outcome !== 'pending') {
      const { data: prediction } = await supabase
        .from('ai_scoring_predictions')
        .select('*')
        .eq('lead_id', lead_id)
        .order('predicted_at', { ascending: false })
        .limit(1)
        .single();

      if (prediction) {
        // High score + converted = accurate, Low score + lost = accurate
        const wasAccurate = 
          (outcome === 'converted' && prediction.predicted_score >= 60) ||
          (outcome === 'lost' && prediction.predicted_score < 40);

        await supabase
          .from('ai_scoring_predictions')
          .update({
            actual_outcome: outcome,
            outcome_date: new Date().toISOString(),
            was_accurate: wasAccurate,
          })
          .eq('id', prediction.id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Training data snapshot created',
      action: 'created',
      features_count: Object.keys(featuresResponse.data.features).length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error snapshotting training data:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
