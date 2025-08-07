import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { leadName, leadContext, communicationHistory } = await req.json();

    const prompt = `You are a helpful admissions advisor assistant. Generate a professional, personalized follow-up email reply for a lead named ${leadName}.

Context: ${leadContext || 'Student interested in academic programs'}

Recent communication history:
${communicationHistory || 'Initial inquiry about programs'}

Generate a warm, helpful email reply that:
- Addresses the lead by name
- Shows genuine interest in their goals
- Provides helpful next steps
- Maintains a professional but friendly tone
- Is concise but informative

Keep the response to 2-3 paragraphs maximum.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional admissions advisor assistant that generates thoughtful, personalized email replies to prospective students.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    const data = await response.json();
    const generatedReply = data.choices[0].message.content;

    return new Response(JSON.stringify({ generatedReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-reply-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});