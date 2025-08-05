import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { currentRules, leadData, analysisType } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    if (analysisType === 'suggestions') {
      systemPrompt = `You are a lead scoring expert. Analyze the current scoring rules and lead data to suggest improvements. Consider the 3 pillars of lead scoring:
1. Contact Information (demographics, firmographics)
2. Interactions & Behaviours (website activity, email engagement)  
3. Negatives (disqualifying factors)

Provide specific, actionable suggestions for improving lead scoring accuracy.`;

      userPrompt = `Current Scoring Rules:
${JSON.stringify(currentRules, null, 2)}

Sample Lead Data:
${JSON.stringify(leadData, null, 2)}

Please suggest:
1. Improvements to existing rules (point adjustments, condition changes)
2. New rules to add (including negative scoring rules)
3. Rules to remove if they're not effective

Format your response as JSON with this structure:
{
  "ruleImprovements": [{"ruleId": "rule-1", "suggestion": "description", "newPoints": 15}],
  "newRules": [{"name": "Rule Name", "field": "field", "condition": "equals", "value": "value", "points": -10, "reasoning": "why this rule helps"}],
  "rulesToRemove": [{"ruleId": "rule-2", "reasoning": "why to remove"}],
  "summary": "Overall assessment and recommendations"
}`;
    } else if (analysisType === 'revamp') {
      systemPrompt = `You are a lead scoring expert. Create a complete new lead scoring system based on best practices and the provided lead data. Focus on the 3 pillars: Contact Info, Interactions/Behaviours, and Negatives.`;

      userPrompt = `Lead Data:
${JSON.stringify(leadData, null, 2)}

Create a complete new lead scoring system with 8-12 rules covering:
- Demographics/Contact info (positive points)
- Behavioral indicators (positive points) 
- Disqualifying factors (negative points)

Format as JSON:
{
  "newScoringSystem": [{"name": "Rule Name", "field": "field", "condition": "condition", "value": "value", "points": 20, "category": "contact|behavior|negative", "reasoning": "why this rule"}],
  "summary": "Explanation of the new scoring approach"
}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      const parsedResponse = JSON.parse(aiResponse);
      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      return new Response(JSON.stringify({ 
        error: 'Failed to parse AI response', 
        rawResponse: aiResponse 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in ai-lead-scoring function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});