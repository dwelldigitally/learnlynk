import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { action, decisionData, studentData } = await req.json();

    let explanation;

    switch (action) {
      case 'generate_explanation':
        explanation = await generateDecisionExplanation(decisionData, studentData, openAIApiKey);
        break;
      case 'analyze_patterns':
        explanation = await analyzeDecisionPatterns(decisionData, openAIApiKey);
        break;
      case 'suggest_improvements':
        explanation = await suggestImprovements(decisionData, openAIApiKey);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    // Log the explanation generation
    await supabase.from('ai_decision_logs').insert({
      decision_type: 'explanation_generation',
      recommended_action: action,
      confidence_score: 1.0,
      reasoning: { explanation_type: action, input_data: decisionData },
      contributing_factors: { ai_model: 'gpt-5-2025-08-07', timestamp: new Date().toISOString() }
    });

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI decision explainer:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateDecisionExplanation(decisionData: any, studentData: any, apiKey: string) {
  const prompt = `You are an AI decision explainer for enrollment management. 
  
  Given this AI decision:
  - Recommended Action: ${decisionData.recommended_action}
  - Confidence Score: ${decisionData.confidence_score}
  - Decision Type: ${decisionData.decision_type}
  
  And this student context:
  ${JSON.stringify(studentData, null, 2)}
  
  Provide a detailed explanation that includes:
  1. Why this specific action was recommended
  2. Key factors that influenced the decision
  3. Risk factors that were considered
  4. Alternative actions that were considered and why they weren't chosen
  5. Confidence breakdown for different aspects
  
  Format your response as a clear, human-readable explanation that admissions staff can understand and trust.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are an expert AI decision explainer for educational institutions.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 1000,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function analyzeDecisionPatterns(decisionData: any, apiKey: string) {
  const prompt = `Analyze the following AI decision patterns and identify:
  1. Common decision factors across similar cases
  2. Success patterns in historical decisions
  3. Potential biases or blind spots
  4. Recommendations for improving decision accuracy
  
  Decision data: ${JSON.stringify(decisionData, null, 2)}
  
  Provide actionable insights for improving the AI decision-making process.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are an AI analytics expert specializing in decision pattern analysis.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 800,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function suggestImprovements(decisionData: any, apiKey: string) {
  const prompt = `Based on this AI decision analysis, suggest specific improvements:
  
  ${JSON.stringify(decisionData, null, 2)}
  
  Provide:
  1. Specific areas where the AI logic could be enhanced
  2. Additional data points that could improve accuracy
  3. Rule modifications that might lead to better outcomes
  4. Testing scenarios to validate improvements
  
  Focus on practical, implementable suggestions.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are an AI optimization consultant for educational technology systems.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 800,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}