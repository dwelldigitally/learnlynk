import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateTemplateRequest {
  action: 'generate' | 'improve';
  templateType: 'email' | 'sms';
  purpose?: string;
  tone?: string;
  audience?: string;
  keyPoints?: string[];
  existingContent?: string;
  existingSubject?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const {
      action,
      templateType,
      purpose,
      tone,
      audience,
      keyPoints,
      existingContent,
      existingSubject
    }: GenerateTemplateRequest = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'generate') {
      systemPrompt = `You are an expert communication template writer specializing in ${templateType} templates for educational institutions and lead generation. 

Your task is to create professional, engaging, and effective ${templateType} templates that:
- Are appropriate for ${audience || 'general audience'} 
- Have a ${tone || 'professional'} tone
- Serve the purpose of ${purpose || 'general communication'}
- Include personalization variables in {{variable_name}} format
- Follow best practices for ${templateType} communication

For EMAIL templates:
- Create compelling subject lines
- Structure with clear introduction, body, and call-to-action
- Keep professional but engaging tone
- Include appropriate personalization variables like {{first_name}}, {{last_name}}, {{program_interest}}

For SMS templates:
- Keep under 160 characters when possible
- Be concise and direct
- Include clear call-to-action
- Use personalization sparingly due to character limits

Return your response as JSON with this exact structure:
{
  "subject": "subject line here" (for email only, null for SMS),
  "content": "template content here with {{variables}}",
  "variables": ["{{first_name}}", "{{last_name}}", "etc"],
  "suggestions": ["tip 1", "tip 2", "tip 3"]
}`;

      userPrompt = `Create a ${templateType} template with these requirements:
- Purpose: ${purpose || 'General communication'}
- Tone: ${tone || 'Professional'}
- Target audience: ${audience || 'General audience'}
- Key points to include: ${keyPoints?.join(', ') || 'None specified'}

Make it engaging and actionable.`;

    } else { // improve
      systemPrompt = `You are an expert communication optimizer specializing in improving ${templateType} templates for educational institutions and lead generation.

Analyze the existing template and provide improvements for:
- Clarity and readability
- Engagement and persuasiveness
- Professional tone while remaining approachable
- Better use of personalization variables
- Call-to-action effectiveness
- ${templateType === 'sms' ? 'Character count optimization' : 'Email deliverability and structure'}

Return your response as JSON with this exact structure:
{
  "subject": "improved subject line" (for email only, null for SMS),
  "content": "improved template content with {{variables}}",
  "variables": ["{{first_name}}", "{{last_name}}", "etc"],
  "suggestions": ["improvement 1", "improvement 2", "improvement 3"],
  "improvements": ["what was changed 1", "what was changed 2"]
}`;

      userPrompt = `Improve this ${templateType} template:

${templateType === 'email' ? `Subject: ${existingSubject || 'No subject'}` : ''}
Content: ${existingContent}

Focus on making it more engaging and effective while maintaining professionalism.`;
    }

    console.log('Calling OpenAI API...');
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
        max_tokens: 1000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const generatedContent = openAIData.choices[0].message.content;

    console.log('Generated content:', generatedContent);

    // Parse the JSON response from OpenAI
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', generatedContent);
      throw new Error('Invalid response format from AI');
    }

    // Validate the response structure
    if (!parsedResponse.content) {
      throw new Error('AI response missing required content field');
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        subject: parsedResponse.subject || null,
        content: parsedResponse.content,
        variables: parsedResponse.variables || [],
        suggestions: parsedResponse.suggestions || [],
        improvements: parsedResponse.improvements || [],
        generationPrompt: `${action}: ${purpose || ''} - ${tone || ''} tone for ${audience || 'general audience'}`
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-template-assistant function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});