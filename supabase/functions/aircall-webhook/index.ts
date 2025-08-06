import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AircallWebhookPayload {
  event: string;
  data: {
    id: string;
    direct_link: string;
    status: string;
    direction: string;
    duration: number;
    started_at: string;
    answered_at?: string;
    ended_at?: string;
    user?: {
      id: string;
      name: string;
    };
    number?: {
      digits: string;
      name?: string;
      company_name?: string;
    };
    recording_url?: string;
    transcription?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse webhook payload
    const payload: AircallWebhookPayload = await req.json();
    console.log('Received Aircall webhook:', payload.event, payload.data);

    // Handle different webhook events
    switch (payload.event) {
      case 'call.created':
        await handleCallCreated(supabase, payload.data);
        break;
      case 'call.answered':
        await handleCallAnswered(supabase, payload.data);
        break;
      case 'call.hungup':
        await handleCallEnded(supabase, payload.data);
        break;
      case 'call.transferred':
        await handleCallTransferred(supabase, payload.data);
        break;
      default:
        console.log('Unhandled webhook event:', payload.event);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleCallCreated(supabase: any, callData: any) {
  console.log('Processing call.created event:', callData.id);

  // Find lead by phone number
  const phoneNumber = callData.number?.digits;
  let leadId = null;
  let userId = null;

  if (phoneNumber) {
    // Try to match with existing lead
    const { data: leads } = await supabase
      .from('leads')
      .select('id, user_id')
      .ilike('phone', `%${phoneNumber.replace(/\D/g, '')}%`)
      .limit(1);

    if (leads && leads.length > 0) {
      leadId = leads[0].id;
      userId = leads[0].user_id;
    } else {
      // Check if auto-create is enabled for any user
      const { data: settings } = await supabase
        .from('aircall_settings')
        .select('user_id, auto_create_leads')
        .eq('is_active', true)
        .eq('auto_create_leads', true)
        .limit(1);

      if (settings && settings.length > 0) {
        userId = settings[0].user_id;
        
        // Create new lead
        const names = callData.number?.name?.split(' ') || ['Unknown', 'Caller'];
        const firstName = names[0] || 'Unknown';
        const lastName = names.slice(1).join(' ') || 'Caller';

        const { data: newLead } = await supabase
          .from('leads')
          .insert({
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@temp.com`,
            source: 'phone',
            status: 'new',
            priority: 'medium',
            lead_score: 0,
            program_interest: [],
            tags: ['phone-lead', 'aircall-auto-created']
          })
          .select('id')
          .single();

        if (newLead) {
          leadId = newLead.id;
        }
      }
    }
  }

  // Create call record
  if (userId) {
    await supabase
      .from('aircall_calls')
      .insert({
        aircall_call_id: callData.id,
        user_id: userId,
        lead_id: leadId,
        phone_number: phoneNumber || 'unknown',
        direction: callData.direction,
        status: callData.status,
        duration: callData.duration || 0,
        agent_id: callData.user?.id,
        agent_name: callData.user?.name,
        caller_name: callData.number?.name,
        caller_company: callData.number?.company_name,
        started_at: callData.started_at,
        aircall_metadata: callData
      });

    // Create activity log
    await supabase
      .from('aircall_call_activities')
      .insert({
        call_id: (await supabase
          .from('aircall_calls')
          .select('id')
          .eq('aircall_call_id', callData.id)
          .single()).data?.id,
        activity_type: 'call_started',
        activity_data: { event: 'call.created', data: callData },
        performed_by: callData.user?.name
      });
  }
}

async function handleCallAnswered(supabase: any, callData: any) {
  console.log('Processing call.answered event:', callData.id);

  await supabase
    .from('aircall_calls')
    .update({
      status: 'answered',
      answered_at: callData.answered_at,
      duration: callData.duration || 0,
      aircall_metadata: callData
    })
    .eq('aircall_call_id', callData.id);

  // Create activity log
  const { data: call } = await supabase
    .from('aircall_calls')
    .select('id')
    .eq('aircall_call_id', callData.id)
    .single();

  if (call) {
    await supabase
      .from('aircall_call_activities')
      .insert({
        call_id: call.id,
        activity_type: 'call_answered',
        activity_data: { event: 'call.answered', data: callData },
        performed_by: callData.user?.name
      });
  }
}

async function handleCallEnded(supabase: any, callData: any) {
  console.log('Processing call.hungup event:', callData.id);

  const updateData: any = {
    status: 'hungup',
    ended_at: callData.ended_at,
    duration: callData.duration || 0,
    aircall_metadata: callData
  };

  // Add recording URL if available
  if (callData.recording_url) {
    updateData.recording_url = callData.recording_url;
  }

  // Add transcription if available
  if (callData.transcription) {
    updateData.transcription = callData.transcription;
  }

  await supabase
    .from('aircall_calls')
    .update(updateData)
    .eq('aircall_call_id', callData.id);

  // Create activity log
  const { data: call } = await supabase
    .from('aircall_calls')
    .select('id')
    .eq('aircall_call_id', callData.id)
    .single();

  if (call) {
    await supabase
      .from('aircall_call_activities')
      .insert({
        call_id: call.id,
        activity_type: 'call_ended',
        activity_data: { event: 'call.hungup', data: callData },
        performed_by: callData.user?.name
      });
  }
}

async function handleCallTransferred(supabase: any, callData: any) {
  console.log('Processing call.transferred event:', callData.id);

  await supabase
    .from('aircall_calls')
    .update({
      agent_id: callData.user?.id,
      agent_name: callData.user?.name,
      aircall_metadata: callData
    })
    .eq('aircall_call_id', callData.id);

  // Create activity log
  const { data: call } = await supabase
    .from('aircall_calls')
    .select('id')
    .eq('aircall_call_id', callData.id)
    .single();

  if (call) {
    await supabase
      .from('aircall_call_activities')
      .insert({
        call_id: call.id,
        activity_type: 'call_transferred',
        activity_data: { event: 'call.transferred', data: callData },
        performed_by: callData.user?.name
      });
  }
}