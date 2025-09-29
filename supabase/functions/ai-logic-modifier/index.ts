import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { command, currentConfig } = await req.json();

    console.log('Processing natural language command:', command);

    // Use AI to interpret the natural language command
    const interpretation = await interpretCommand(command, currentConfig, openAIApiKey);
    
    // Validate the proposed changes
    const validation = await validateChanges(interpretation.proposedChanges, openAIApiKey);

    // If validation passes, create a preview
    const preview = await generatePreview(interpretation.proposedChanges, command, openAIApiKey);

    const result = {
      understood: interpretation.understood,
      proposedChanges: interpretation.proposedChanges,
      preview: preview,
      validation: validation,
      explanation: interpretation.explanation
    };

    // Log the command processing
    await supabase.from('ai_decision_logs').insert({
      decision_type: 'logic_modification',
      recommended_action: 'process_command',
      confidence_score: interpretation.confidence,
      reasoning: { 
        command, 
        interpretation: result,
        model_used: 'gpt-5-2025-08-07'
      },
      contributing_factors: { 
        command_complexity: command.length,
        current_config_size: JSON.stringify(currentConfig).length
      }
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI logic modifier:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function interpretCommand(command: string, currentConfig: any, apiKey: string) {
  const prompt = `You are an AI system configuration interpreter for enrollment management software.

Current AI Configuration:
${JSON.stringify(currentConfig, null, 2)}

User Command: "${command}"

Analyze this command and provide:
1. Whether you understand the command (true/false)
2. Proposed configuration changes in JSON format
3. Confidence level (0.0 to 1.0)
4. Explanation of what will change

Respond in this exact JSON format:
{
  "understood": boolean,
  "proposedChanges": { /* configuration object */ },
  "confidence": number,
  "explanation": "string"
}

Common configuration areas:
- scoring_weights: Controls how different factors are weighted
- follow_up_rules: Controls timing and frequency of follow-ups
- student_segmentation: Controls how different student types are handled
- urgency_thresholds: Controls when urgent action is needed
- communication_preferences: Controls which communication methods to use

Be specific and only make changes that clearly relate to the user's command.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are an expert AI configuration interpreter. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 1000,
    }),
  });

  const data = await response.json();
  
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (parseError) {
    console.error('Failed to parse AI response:', data.choices[0].message.content);
    return {
      understood: false,
      proposedChanges: {},
      confidence: 0.0,
      explanation: "Failed to interpret the command. Please try rephrasing."
    };
  }
}

async function validateChanges(proposedChanges: any, apiKey: string) {
  const prompt = `Validate these proposed AI configuration changes for potential issues:

${JSON.stringify(proposedChanges, null, 2)}

Check for:
1. Invalid values (e.g., weights that don't sum to 1.0, negative numbers where inappropriate)
2. Logical conflicts (e.g., contradictory rules)
3. Potential negative impacts on system performance
4. Missing required fields

Respond with a JSON object:
{
  "isValid": boolean,
  "warnings": ["list of warnings"],
  "errors": ["list of errors"],
  "suggestions": ["list of suggestions for improvement"]
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are a configuration validation expert. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 500,
    }),
  });

  const data = await response.json();
  
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (parseError) {
    return {
      isValid: true,
      warnings: [],
      errors: ["Failed to validate changes"],
      suggestions: []
    };
  }
}

async function generatePreview(proposedChanges: any, originalCommand: string, apiKey: string) {
  const prompt = `Generate a human-readable preview of what will change in the AI system:

Original Command: "${originalCommand}"
Proposed Changes: ${JSON.stringify(proposedChanges, null, 2)}

Create a clear, concise explanation that non-technical staff can understand. Focus on:
1. What behavior will change
2. How this affects decision-making
3. Expected impact on outcomes

Keep it under 150 words and avoid technical jargon.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are a technical translator who explains complex changes in simple terms.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 200,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}