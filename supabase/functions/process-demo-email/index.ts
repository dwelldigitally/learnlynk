import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  from_name: string;
  from_email: string;
  subject: string;
  body_content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: { email: EmailData } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the current user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    console.log('Processing email from:', email.from_email);

    // Analyze email with AI
    const aiAnalysis = await analyzeEmailWithAI(email);
    console.log('AI Analysis completed:', aiAnalysis);

    // Try to find matching lead
    const leadMatch = await findMatchingLead(supabase, user.id, email);
    console.log('Lead match result:', leadMatch);

    // Create email account if needed (for demo purposes)
    let emailAccount = await getOrCreateDemoEmailAccount(supabase, user.id);
    console.log('Email account:', emailAccount.id);

    // Insert email with AI analysis
    const { data: insertedEmail, error: emailError } = await supabase
      .from('emails')
      .insert({
        microsoft_id: `demo-${Date.now()}`,
        email_account_id: emailAccount.id,
        from_name: email.from_name,
        from_email: email.from_email,
        subject: email.subject,
        body_content: email.body_content,
        body_preview: email.body_content.substring(0, 150) + '...',
        received_datetime: new Date().toISOString(),
        ai_priority_score: aiAnalysis.priority_score,
        ai_suggested_actions: aiAnalysis.suggested_actions,
        ai_lead_match_confidence: leadMatch?.confidence || 0,
        lead_id: leadMatch?.lead_id || null,
        is_read: false,
        status: 'new',
        importance: aiAnalysis.priority_score > 70 ? 'high' : 'normal',
        to_emails: [],
        cc_emails: [],
        bcc_emails: []
      })
      .select()
      .single();

    if (emailError) {
      console.error('Error inserting email:', emailError);
      throw emailError;
    }

    console.log('Email inserted successfully:', insertedEmail.id);

    return new Response(JSON.stringify({
      success: true,
      email_id: insertedEmail.id,
      ai_analysis: aiAnalysis,
      lead_match: leadMatch
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-demo-email function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeEmailWithAI(email: EmailData) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.log('No OpenAI key, using mock analysis');
    return getMockAnalysis(email);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI email analyst for an educational institution. Analyze the email and provide:
            1. Priority score (0-100) based on urgency and potential value
            2. Category (inquiry, application, complaint, follow_up)
            3. Suggested actions
            4. Brief summary
            
            Response must be valid JSON with this structure:
            {
              "priority_score": number,
              "category": "inquiry|application|complaint|follow_up",
              "summary": "brief summary",
              "suggested_actions": [
                {
                  "type": "action_type",
                  "description": "action description",
                  "confidence": number
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Subject: ${email.subject}\nFrom: ${email.from_name} <${email.from_email}>\n\nContent:\n${email.body_content}`
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);
    
    return {
      priority_score: analysis.priority_score,
      category: analysis.category,
      summary: analysis.summary,
      suggested_actions: analysis.suggested_actions || []
    };
  } catch (error) {
    console.error('AI analysis failed, using mock:', error);
    return getMockAnalysis(email);
  }
}

function getMockAnalysis(email: EmailData) {
  const hasInquiryKeywords = /interest|inquiry|program|course|information|learn|apply/i.test(email.body_content);
  const hasUrgentKeywords = /urgent|asap|deadline|immediately/i.test(email.body_content);
  
  let priority_score = 50;
  if (hasInquiryKeywords) priority_score += 30;
  if (hasUrgentKeywords) priority_score += 20;
  
  return {
    priority_score: Math.min(priority_score, 100),
    category: hasInquiryKeywords ? 'inquiry' : 'follow_up',
    summary: `Email from ${email.from_name} regarding: ${email.subject}`,
    suggested_actions: [
      {
        type: 'send_program_info',
        description: 'Send program information brochure',
        confidence: 80
      },
      {
        type: 'schedule_consultation',
        description: 'Schedule a consultation call',
        confidence: 70
      }
    ]
  };
}

async function findMatchingLead(supabase: any, userId: string, email: EmailData) {
  // Try to find lead by email
  const { data: leads } = await supabase
    .from('leads')
    .select('id, first_name, last_name, email, program_interest, lead_score')
    .eq('user_id', userId)
    .eq('email', email.from_email);

  if (leads && leads.length > 0) {
    return {
      lead_id: leads[0].id,
      confidence: 95,
      match_reason: 'Email address match'
    };
  }

  // Try to find by name similarity
  const nameParts = email.from_name.toLowerCase().split(' ');
  if (nameParts.length >= 2) {
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    
    const { data: nameMatches } = await supabase
      .from('leads')
      .select('id, first_name, last_name, email, program_interest, lead_score')
      .eq('user_id', userId)
      .ilike('first_name', `%${firstName}%`)
      .ilike('last_name', `%${lastName}%`);

    if (nameMatches && nameMatches.length > 0) {
      return {
        lead_id: nameMatches[0].id,
        confidence: 75,
        match_reason: 'Name similarity match'
      };
    }
  }

  return null;
}

async function getOrCreateDemoEmailAccount(supabase: any, userId: string) {
  // Check if demo email account exists
  const { data: existingAccount } = await supabase
    .from('email_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('email_address', 'demo@example.com')
    .single();

  if (existingAccount) {
    return existingAccount;
  }

  // Create demo email account
  const { data: newAccount, error } = await supabase
    .from('email_accounts')
    .insert({
      user_id: userId,
      email_address: 'demo@example.com',
      display_name: 'Demo Email Account',
      provider: 'demo',
      account_type: 'individual',
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating demo email account:', error);
    throw error;
  }

  return newAccount;
}