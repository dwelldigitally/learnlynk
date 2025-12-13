import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AircallWebhookPayload {
  event: string;
  token?: string;
  data: {
    id: number;
    direct_link: string;
    status: string;
    direction: string;
    duration: number;
    started_at: number;
    answered_at?: number;
    ended_at?: number;
    user?: {
      id: number;
      name: string;
      email?: string;
    };
    number?: {
      id: number;
      digits: string;
      name?: string;
    };
    raw_digits?: string;
    recording?: string;
    voicemail?: string;
    asset?: string;
    transferred_to?: {
      id: number;
      name: string;
    };
    comments?: Array<{
      id: number;
      content: string;
    }>;
    tags?: Array<{
      id: number;
      name: string;
    }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: AircallWebhookPayload = await req.json();
    console.log('Received Aircall webhook:', payload.event, payload.data?.id);

    // Find tenant by webhook token if provided
    let tenantId: string | null = null;
    if (payload.token) {
      const { data: connection } = await supabase
        .from('tenant_aircall_connections')
        .select('tenant_id')
        .eq('webhook_secret', payload.token)
        .eq('is_active', true)
        .single();
      
      if (connection) {
        tenantId = connection.tenant_id;
      }
    }

    // If no token, try to find tenant by matching phone number to existing calls
    if (!tenantId && payload.data?.raw_digits) {
      const { data: existingCall } = await supabase
        .from('aircall_calls')
        .select('tenant_id')
        .eq('phone_number', payload.data.raw_digits)
        .not('tenant_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (existingCall) {
        tenantId = existingCall.tenant_id;
      }
    }

    // Handle different webhook events
    switch (payload.event) {
      case 'call.created':
        await handleCallCreated(supabase, payload.data, tenantId);
        break;
      case 'call.ringing_on_agent':
        await handleCallRinging(supabase, payload.data, tenantId);
        break;
      case 'call.answered':
        await handleCallAnswered(supabase, payload.data);
        break;
      case 'call.ended':
      case 'call.hungup':
        await handleCallEnded(supabase, payload.data);
        break;
      case 'call.transferred':
        await handleCallTransferred(supabase, payload.data);
        break;
      case 'call.voicemail_left':
        await handleVoicemailLeft(supabase, payload.data);
        break;
      case 'call.commented':
        await handleCallCommented(supabase, payload.data);
        break;
      case 'call.tagged':
        await handleCallTagged(supabase, payload.data);
        break;
      default:
        console.log('Unhandled webhook event:', payload.event);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleCallCreated(supabase: any, callData: any, tenantId: string | null) {
  console.log('Processing call.created:', callData.id);

  const phoneNumber = callData.raw_digits || callData.number?.digits || 'unknown';
  let leadId: string | null = null;
  let userId: string | null = null;

  // Try to match with existing lead
  if (phoneNumber && phoneNumber !== 'unknown') {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const { data: leads } = await supabase
      .from('leads')
      .select('id, user_id, tenant_id')
      .or(`phone.ilike.%${cleanPhone}%,phone.ilike.%${phoneNumber}%`)
      .limit(1);

    if (leads && leads.length > 0) {
      leadId = leads[0].id;
      userId = leads[0].user_id;
      if (!tenantId) tenantId = leads[0].tenant_id;
    }
  }

  // Find a user from tenant if no lead match
  if (!userId && tenantId) {
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('user_id')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .limit(1)
      .single();
    
    if (tenantUser) userId = tenantUser.user_id;
  }

  // Insert call record
  if (userId) {
    const { error } = await supabase
      .from('aircall_calls')
      .insert({
        aircall_call_id: String(callData.id),
        user_id: userId,
        tenant_id: tenantId,
        lead_id: leadId,
        phone_number: phoneNumber,
        direction: callData.direction,
        status: callData.status || 'created',
        duration: callData.duration || 0,
        agent_id: callData.user?.id ? String(callData.user.id) : null,
        agent_name: callData.user?.name,
        caller_name: callData.number?.name,
        started_at: callData.started_at ? new Date(callData.started_at * 1000).toISOString() : new Date().toISOString(),
        aircall_metadata: callData
      });

    if (error) console.error('Error inserting call:', error);

    // Log activity
    await logCallActivity(supabase, callData.id, 'call_started', callData);
  }
}

async function handleCallRinging(supabase: any, callData: any, tenantId: string | null) {
  console.log('Processing call.ringing_on_agent:', callData.id);
  
  await supabase
    .from('aircall_calls')
    .update({
      status: 'ringing',
      agent_id: callData.user?.id ? String(callData.user.id) : null,
      agent_name: callData.user?.name,
      aircall_metadata: callData
    })
    .eq('aircall_call_id', String(callData.id));
}

async function handleCallAnswered(supabase: any, callData: any) {
  console.log('Processing call.answered:', callData.id);

  await supabase
    .from('aircall_calls')
    .update({
      status: 'answered',
      answered_at: callData.answered_at ? new Date(callData.answered_at * 1000).toISOString() : new Date().toISOString(),
      duration: callData.duration || 0,
      aircall_metadata: callData
    })
    .eq('aircall_call_id', String(callData.id));

  await logCallActivity(supabase, callData.id, 'call_answered', callData);
}

async function handleCallEnded(supabase: any, callData: any) {
  console.log('Processing call.ended:', callData.id);

  const updateData: any = {
    status: 'ended',
    ended_at: callData.ended_at ? new Date(callData.ended_at * 1000).toISOString() : new Date().toISOString(),
    duration: callData.duration || 0,
    aircall_metadata: callData
  };

  if (callData.recording) {
    updateData.recording_url = callData.recording;
  }

  await supabase
    .from('aircall_calls')
    .update(updateData)
    .eq('aircall_call_id', String(callData.id));

  await logCallActivity(supabase, callData.id, 'call_ended', callData);

  // Also log to lead_communications if there's a lead
  const { data: call } = await supabase
    .from('aircall_calls')
    .select('lead_id, user_id, tenant_id, direction, duration')
    .eq('aircall_call_id', String(callData.id))
    .single();

  if (call?.lead_id) {
    await supabase
      .from('lead_communications')
      .insert({
        lead_id: call.lead_id,
        user_id: call.user_id,
        tenant_id: call.tenant_id,
        type: 'phone',
        direction: call.direction === 'inbound' ? 'inbound' : 'outbound',
        subject: `${call.direction === 'inbound' ? 'Incoming' : 'Outgoing'} Call`,
        content: `Call duration: ${Math.floor((call.duration || 0) / 60)}m ${(call.duration || 0) % 60}s`,
        status: 'completed',
        metadata: { aircall_call_id: callData.id, recording_url: callData.recording }
      });
  }
}

async function handleCallTransferred(supabase: any, callData: any) {
  console.log('Processing call.transferred:', callData.id);

  await supabase
    .from('aircall_calls')
    .update({
      agent_id: callData.transferred_to?.id ? String(callData.transferred_to.id) : null,
      agent_name: callData.transferred_to?.name,
      aircall_metadata: callData
    })
    .eq('aircall_call_id', String(callData.id));

  await logCallActivity(supabase, callData.id, 'call_transferred', callData);
}

async function handleVoicemailLeft(supabase: any, callData: any) {
  console.log('Processing call.voicemail_left:', callData.id);

  const updateData: any = {
    status: 'voicemail',
    aircall_metadata: callData
  };

  if (callData.voicemail || callData.asset) {
    updateData.recording_url = callData.voicemail || callData.asset;
  }

  await supabase
    .from('aircall_calls')
    .update(updateData)
    .eq('aircall_call_id', String(callData.id));

  await logCallActivity(supabase, callData.id, 'voicemail_left', callData);
}

async function handleCallCommented(supabase: any, callData: any) {
  console.log('Processing call.commented:', callData.id);

  const comments = callData.comments?.map((c: any) => c.content).join('\n') || '';
  
  await supabase
    .from('aircall_calls')
    .update({
      notes: comments,
      aircall_metadata: callData
    })
    .eq('aircall_call_id', String(callData.id));

  await logCallActivity(supabase, callData.id, 'comment_added', callData);
}

async function handleCallTagged(supabase: any, callData: any) {
  console.log('Processing call.tagged:', callData.id);

  const tags = callData.tags?.map((t: any) => t.name) || [];
  
  await supabase
    .from('aircall_calls')
    .update({
      tags: tags,
      aircall_metadata: callData
    })
    .eq('aircall_call_id', String(callData.id));

  await logCallActivity(supabase, callData.id, 'tags_updated', callData);
}

async function logCallActivity(supabase: any, aircallCallId: number, activityType: string, data: any) {
  const { data: call } = await supabase
    .from('aircall_calls')
    .select('id')
    .eq('aircall_call_id', String(aircallCallId))
    .single();

  if (call) {
    await supabase
      .from('aircall_call_activities')
      .insert({
        call_id: call.id,
        activity_type: activityType,
        activity_data: data,
        performed_by: data.user?.name || 'System'
      });
  }
}
