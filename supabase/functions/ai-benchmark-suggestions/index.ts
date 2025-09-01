import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JourneyStep {
  id: string;
  type: string;
  title: string;
  description?: string;
  config?: any;
}

interface BenchmarkRequest {
  type: 'journey' | 'step';
  journeyConfig?: {
    name: string;
    description: string;
    targetPrograms?: string;
    studentType?: string;
    academicLevel?: string;
    applicationSeason?: string;
    steps: JourneyStep[];
  };
  stepConfig?: {
    step: JourneyStep;
    journeyContext: {
      totalSteps: number;
      targetPrograms?: string;
      studentType?: string;
      academicLevel?: string;
    };
  };
}

function generateJourneyPrompt(config: BenchmarkRequest['journeyConfig']) {
  return `You are an academic enrollment expert. Analyze this academic journey and suggest realistic benchmarks.

Journey Details:
- Name: ${config.name}
- Description: ${config.description}
- Target Programs: ${config.targetPrograms || 'All Programs'}
- Student Type: ${config.studentType || 'All Students'}
- Academic Level: ${config.academicLevel || 'All Levels'}
- Application Season: ${config.applicationSeason || 'Rolling'}
- Total Steps: ${config.steps.length}

Journey Steps:
${config.steps.map((step, index) => `${index + 1}. ${step.title} (${step.type})${step.description ? ` - ${step.description}` : ''}`).join('\n')}

Please suggest appropriate benchmarks considering:
- Industry standards for academic enrollment processes
- Complexity and time requirements of each step type
- Student experience and completion rates
- Administrative processing times
- Seasonal variations and deadlines

Respond with a JSON object containing:
{
  "overall": {
    "targetDays": number,
    "maxDays": number,
    "completionRate": number (percentage),
    "applicationDeadline": string (ISO date, if applicable),
    "decisionDeadline": string (ISO date, if applicable),
    "reasoning": "explanation of overall timeline"
  },
  "steps": {
    "defaultDuration": number,
    "stallThreshold": number,
    "escalationThreshold": number,
    "completionTarget": number (percentage),
    "reasoning": "explanation of step-level defaults"
  },
  "recommendations": [
    "specific recommendation 1",
    "specific recommendation 2"
  ]
}

Be realistic and consider that academic processes often take longer than expected. Factor in weekends, holidays, and administrative processing times.`;
}

function generateStepPrompt(config: BenchmarkRequest['stepConfig']) {
  const step = config.step;
  const context = config.journeyContext;
  
  return `You are an academic enrollment expert. Analyze this specific journey step and suggest realistic benchmarks.

Step Details:
- Title: ${step.title}
- Type: ${step.type}
- Description: ${step.description || 'No description provided'}

Journey Context:
- Total Journey Steps: ${context.totalSteps}
- Target Programs: ${context.targetPrograms || 'All Programs'}
- Student Type: ${context.studentType || 'All Students'}
- Academic Level: ${context.academicLevel || 'All Levels'}

Step Configuration:
${JSON.stringify(step.config || {}, null, 2)}

Please suggest appropriate benchmarks for this specific step considering:
- Typical time requirements for this type of activity
- Student preparation and response times
- Administrative review and processing
- Complexity and dependencies
- Best practices for this step type

Respond with a JSON object containing:
{
  "benchmarks": {
    "expectedDuration": number (days),
    "maxDuration": number (days),
    "stallAlert": number (days),
    "escalationAlert": number (days),
    "priority": "low" | "medium" | "high" | "urgent",
    "deadline": string (ISO date, if applicable)
  },
  "behavior": {
    "required": boolean,
    "autoAdvance": boolean,
    "allowSkip": boolean,
    "sendReminders": boolean
  },
  "reasoning": "detailed explanation of suggested benchmarks",
  "recommendations": [
    "specific recommendation 1",
    "specific recommendation 2"
  ]
}

Consider that this step is part of a ${context.totalSteps}-step journey and should fit appropriately within the overall timeline.`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const requestData: BenchmarkRequest = await req.json();

    let prompt: string;
    if (requestData.type === 'journey' && requestData.journeyConfig) {
      prompt = generateJourneyPrompt(requestData.journeyConfig);
    } else if (requestData.type === 'step' && requestData.stepConfig) {
      prompt = generateStepPrompt(requestData.stepConfig);
    } else {
      throw new Error('Invalid request format');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert academic enrollment consultant with deep knowledge of admissions processes, student onboarding, and institutional best practices. Always provide realistic, evidence-based recommendations in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the JSON response
    let suggestions;
    try {
      suggestions = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid response format from AI');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      suggestions,
      type: requestData.type 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-benchmark-suggestions function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});