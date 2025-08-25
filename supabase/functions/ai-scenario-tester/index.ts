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
    const { action, scenarioData, currentConfig, batchScenarios } = await req.json();

    let result;

    switch (action) {
      case 'run_scenario':
        result = await runSingleScenario(scenarioData, currentConfig, openAIApiKey);
        break;
      case 'run_batch':
        result = await runBatchScenarios(batchScenarios, currentConfig, openAIApiKey);
        break;
      case 'generate_scenarios':
        result = await generateTestScenarios(currentConfig, openAIApiKey);
        break;
      case 'compare_configs':
        result = await compareConfigurations(scenarioData, currentConfig, openAIApiKey);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    // Log the test execution
    await supabase.from('ai_decision_logs').insert({
      decision_type: 'scenario_testing',
      recommended_action: action,
      confidence_score: 1.0,
      reasoning: { 
        test_type: action, 
        scenario_count: batchScenarios?.length || 1,
        model_used: 'gpt-5-2025-08-07'
      },
      contributing_factors: { 
        config_version: currentConfig?.version || 'unknown',
        timestamp: new Date().toISOString()
      }
    });

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI scenario tester:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function runSingleScenario(scenarioData: any, currentConfig: any, apiKey: string) {
  const startTime = Date.now();

  const prompt = `You are an AI enrollment management system. Given this configuration and scenario, make a decision.

Current AI Configuration:
${JSON.stringify(currentConfig, null, 2)}

Scenario Data:
${JSON.stringify(scenarioData, null, 2)}

Based on the configuration and scenario, provide a decision in this exact JSON format:
{
  "recommended_action": "Call Student" | "Send Email" | "Send SMS" | "Schedule Meeting" | "Mark for Review" | "No Action",
  "confidence_score": number (0.0 to 1.0),
  "reasoning": {
    "primary_factors": ["list of key factors"],
    "risk_factors": ["list of risks considered"],
    "opportunity_factors": ["list of opportunities identified"]
  },
  "urgency_level": "low" | "medium" | "high" | "critical",
  "expected_outcome": "description of expected result",
  "alternative_actions": [
    {
      "action": "alternative action",
      "probability": number,
      "why_not_chosen": "explanation"
    }
  ]
}

Consider all relevant factors from the configuration when making your decision.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are an AI enrollment management decision system. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 1000,
    }),
  });

  const data = await response.json();
  const executionTime = Date.now() - startTime;

  try {
    const decision = JSON.parse(data.choices[0].message.content);
    return {
      ...decision,
      execution_time_ms: executionTime,
      test_status: 'completed'
    };
  } catch (parseError) {
    console.error('Failed to parse AI decision:', data.choices[0].message.content);
    return {
      recommended_action: 'No Action',
      confidence_score: 0.0,
      reasoning: { error: 'Failed to generate valid decision' },
      execution_time_ms: executionTime,
      test_status: 'failed'
    };
  }
}

async function runBatchScenarios(batchScenarios: any[], currentConfig: any, apiKey: string) {
  const results = [];
  const startTime = Date.now();

  for (const scenario of batchScenarios) {
    const result = await runSingleScenario(scenario, currentConfig, apiKey);
    results.push({
      scenario_id: scenario.id || `scenario_${results.length}`,
      scenario_name: scenario.name || `Test ${results.length + 1}`,
      ...result
    });
  }

  const totalExecutionTime = Date.now() - startTime;
  const successfulTests = results.filter(r => r.test_status === 'completed').length;

  return {
    total_scenarios: batchScenarios.length,
    successful_tests: successfulTests,
    failed_tests: batchScenarios.length - successfulTests,
    total_execution_time_ms: totalExecutionTime,
    average_confidence: results.reduce((sum, r) => sum + r.confidence_score, 0) / results.length,
    results: results
  };
}

async function generateTestScenarios(currentConfig: any, apiKey: string) {
  const prompt = `Generate comprehensive test scenarios for an AI enrollment management system with this configuration:

${JSON.stringify(currentConfig, null, 2)}

Create 8-10 diverse test scenarios that cover:
1. High engagement students
2. Low engagement students  
3. International students
4. Students near deadlines
5. High-value program applicants
6. Students with incomplete applications
7. Edge cases and unusual situations

For each scenario, provide:
- Scenario name and description
- Student data (engagement_score, program_match, demographics, etc.)
- Expected outcome or action
- Why this scenario is important to test

Format as a JSON array of scenario objects.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are a test scenario generator for AI systems. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 1500,
    }),
  });

  const data = await response.json();
  
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (parseError) {
    console.error('Failed to parse generated scenarios:', data.choices[0].message.content);
    return [];
  }
}

async function compareConfigurations(scenarioData: any, configurations: any[], apiKey: string) {
  const results = [];

  for (const config of configurations) {
    const decision = await runSingleScenario(scenarioData, config, apiKey);
    results.push({
      config_id: config.id,
      config_name: config.name,
      config_version: config.version,
      decision: decision
    });
  }

  // Analyze differences
  const analysis = await analyzeConfigComparison(results, apiKey);

  return {
    scenario: scenarioData,
    config_results: results,
    analysis: analysis
  };
}

async function analyzeConfigComparison(results: any[], apiKey: string) {
  const prompt = `Analyze these AI configuration comparison results:

${JSON.stringify(results, null, 2)}

Provide insights on:
1. How different configurations led to different decisions
2. Which configuration seems most appropriate and why
3. Key differences in decision-making logic
4. Recommendations for optimization

Keep the analysis concise and actionable.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: 'You are an AI configuration analysis expert.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 600,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}