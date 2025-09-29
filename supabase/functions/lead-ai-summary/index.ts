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
    const { leadId, action, question } = await req.json();
    
    if (!leadId) {
      return new Response(
        JSON.stringify({ error: 'Lead ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare lead context for AI
    const leadContext = {
      personal: {
        name: `${lead.first_name} ${lead.last_name}`,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
        birthDate: lead.birth_date,
      },
      academic: {
        previousEducation: lead.previous_education,
        gpaScore: lead.gpa_score,
        englishProficiency: lead.english_proficiency,
        studyPermit: lead.study_permit,
      },
      application: {
        status: lead.status,
        program: lead.program,
        campus: lead.campus,
        intake: lead.intake,
        source: lead.source,
        createdAt: lead.created_at,
        lastContact: lead.last_contact,
      },
      engagement: {
        // Use basic lead data for now since relationship queries are complex
        status: lead.status,
        lastContact: lead.last_contacted_at,
        createdDays: Math.floor((new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
      }
    };

    let response;

    if (action === 'summary') {
      // Generate AI summary
      response = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: `You are an AI assistant for an educational institution's CRM system. Generate a comprehensive, professional summary of a lead (prospective student) based on their profile data. 

              Focus on:
              - Key demographics and background
              - Academic qualifications and readiness
              - Application status and program fit
              - Engagement level and next steps
              - Risk factors or opportunities
              
              Keep the summary concise but informative (3-4 paragraphs). Use professional, helpful language appropriate for admissions staff.`
            },
            {
              role: 'user',
              content: `Please generate a summary for this lead:\n\n${JSON.stringify(leadContext, null, 2)}`
            }
          ],
          max_completion_tokens: 800,
        }),
      });
    } else if (action === 'question' && question) {
      // Answer question about lead
      response = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: `You are an AI assistant for an educational institution's CRM system. Answer questions about a specific lead (prospective student) based on their profile data. 

              Provide accurate, helpful answers based only on the available data. If information is not available, clearly state that. Be professional and concise.`
            },
            {
              role: 'user',
              content: `Lead data:\n${JSON.stringify(leadContext, null, 2)}\n\nQuestion: ${question}`
            }
          ],
          max_completion_tokens: 500,
        }),
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action or missing question' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to process AI request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully for lead:', leadId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        leadName: leadContext.personal.name 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in lead-ai-summary function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});