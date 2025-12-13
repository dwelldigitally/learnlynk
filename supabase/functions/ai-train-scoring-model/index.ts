import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const { tenant_id, force_retrain = false } = await req.json();

    if (!tenant_id) {
      throw new Error('tenant_id is required');
    }

    console.log(`Training AI scoring model for tenant ${tenant_id}`);

    // Check existing model
    const { data: existingModel } = await supabase
      .from('ai_scoring_models')
      .select('*')
      .eq('tenant_id', tenant_id)
      .eq('is_active', true)
      .single();

    // Fetch training data
    const { data: trainingData, error: trainingError } = await supabase
      .from('ai_scoring_training_data')
      .select('*')
      .eq('tenant_id', tenant_id)
      .in('outcome', ['converted', 'lost']);

    if (trainingError) {
      throw new Error(`Failed to fetch training data: ${trainingError.message}`);
    }

    const convertedLeads = trainingData?.filter(d => d.outcome === 'converted') || [];
    const lostLeads = trainingData?.filter(d => d.outcome === 'lost') || [];

    console.log(`Found ${convertedLeads.length} converted leads and ${lostLeads.length} lost leads`);

    // Check minimum data requirements
    const MIN_CONVERTED = 10;
    const MIN_LOST = 10;
    
    if (convertedLeads.length < MIN_CONVERTED || lostLeads.length < MIN_LOST) {
      // Not enough data - use rule-based fallback
      const fallbackWeights = {
        source_is_referral: 0.15,
        source_is_organic: 0.10,
        has_program_interest: 0.12,
        has_preferred_intake: 0.10,
        has_phone: 0.08,
        has_email: 0.05,
        has_been_contacted: 0.10,
        document_completion_rate: 0.15,
        form_submissions: 0.08,
        is_reenquiry: 0.07,
        // Negative factors
        days_since_created_penalty: -0.05,
        days_since_last_contact_penalty: -0.03,
      };

      // Create or update model with fallback weights
      const modelData = {
        tenant_id,
        model_version: existingModel ? existingModel.model_version + 1 : 1,
        feature_weights: fallbackWeights,
        performance_metrics: {
          type: 'rule_based_fallback',
          reason: `Insufficient training data. Need at least ${MIN_CONVERTED} converted and ${MIN_LOST} lost leads.`,
          converted_count: convertedLeads.length,
          lost_count: lostLeads.length,
        },
        training_sample_size: trainingData?.length || 0,
        last_trained_at: new Date().toISOString(),
        is_active: true,
      };

      if (existingModel) {
        await supabase
          .from('ai_scoring_models')
          .update({ is_active: false })
          .eq('id', existingModel.id);
      }

      const { error: insertError } = await supabase
        .from('ai_scoring_models')
        .insert(modelData);

      if (insertError) {
        throw new Error(`Failed to save model: ${insertError.message}`);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Created rule-based fallback model due to insufficient training data',
        model: modelData,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sufficient data - use AI to analyze patterns
    const prompt = `You are an expert data scientist analyzing lead conversion patterns for an education institution.

## Training Data Summary

### Converted Leads (became students): ${convertedLeads.length} samples
Sample features from converted leads:
${JSON.stringify(convertedLeads.slice(0, 5).map(l => l.features), null, 2)}

### Lost Leads (did not convert): ${lostLeads.length} samples  
Sample features from lost leads:
${JSON.stringify(lostLeads.slice(0, 5).map(l => l.features), null, 2)}

## Available Features
- source (string): Lead source channel
- source_is_referral, source_is_organic, source_is_paid, source_is_webform (boolean)
- has_email, has_phone, has_country, has_city (boolean)
- days_since_created (number)
- call_count, meeting_count, email_count, form_submissions, total_activities (number)
- has_been_contacted (boolean)
- days_since_last_contact (number)
- response_time_hours (number)
- has_program_interest, has_preferred_intake (boolean)
- status, priority, lifecycle_stage (string)
- documents_submitted_count, documents_approved_count, document_completion_rate (number)
- current_lead_score (number)
- has_tags, tag_count, has_notes (number/boolean)
- is_assigned (boolean)
- has_utm_source (boolean)
- reenquiry_count, is_reenquiry (number/boolean)

## Your Task
Analyze the patterns and create a scoring model. Return ONLY valid JSON with this structure:

{
  "feature_weights": {
    "feature_name": weight_between_-1_and_1,
    ...
  },
  "scoring_formula": "description of how to calculate score",
  "key_insights": ["insight1", "insight2", ...],
  "confidence": 0.0_to_1.0,
  "top_positive_factors": ["factor1", "factor2", "factor3"],
  "top_negative_factors": ["factor1", "factor2"]
}

Important:
- Weights should be between -1 (strong negative indicator) and 1 (strong positive indicator)
- Focus on the most predictive features
- Include at least 10-15 feature weights
- Consider both positive and negative indicators`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a data scientist. Return only valid JSON, no markdown.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    let aiAnalysis;
    try {
      const content = data.choices[0].message.content.trim();
      // Remove markdown code blocks if present
      const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      aiAnalysis = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', data.choices[0].message.content);
      throw new Error('Failed to parse AI analysis');
    }

    // Create new model
    const newModelVersion = existingModel ? existingModel.model_version + 1 : 1;
    
    const modelData = {
      tenant_id,
      model_version: newModelVersion,
      feature_weights: aiAnalysis.feature_weights,
      performance_metrics: {
        type: 'ai_trained',
        confidence: aiAnalysis.confidence,
        key_insights: aiAnalysis.key_insights,
        top_positive_factors: aiAnalysis.top_positive_factors,
        top_negative_factors: aiAnalysis.top_negative_factors,
        scoring_formula: aiAnalysis.scoring_formula,
        trained_on: {
          converted_count: convertedLeads.length,
          lost_count: lostLeads.length,
        },
      },
      training_sample_size: trainingData.length,
      last_trained_at: new Date().toISOString(),
      is_active: true,
    };

    // Deactivate old model
    if (existingModel) {
      await supabase
        .from('ai_scoring_models')
        .update({ is_active: false })
        .eq('id', existingModel.id);
    }

    // Insert new model
    const { error: insertError } = await supabase
      .from('ai_scoring_models')
      .insert(modelData);

    if (insertError) {
      throw new Error(`Failed to save model: ${insertError.message}`);
    }

    console.log(`Successfully trained model v${newModelVersion} for tenant ${tenant_id}`);

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully trained AI model version ${newModelVersion}`,
      model: modelData,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error training scoring model:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
