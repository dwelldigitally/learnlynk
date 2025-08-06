import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AircallCallRequest {
  phoneNumber: string;
  leadId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user from the JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    console.log('Aircall API call initiated by user:', user.id);

    if (req.method === 'POST') {
      const { phoneNumber, leadId }: AircallCallRequest = await req.json();

      if (!phoneNumber) {
        throw new Error('Phone number is required');
      }

      // Get user's Aircall settings
      const { data: settings, error: settingsError } = await supabase
        .from('aircall_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError || !settings) {
        throw new Error('Aircall settings not found');
      }

      if (!settings.is_active || !settings.click_to_call_enabled) {
        throw new Error('Aircall integration is not active');
      }

      // For demo purposes, we'll create a call record without actually calling Aircall API
      // In production, you would decrypt the api_token_encrypted and make the actual API call
      
      console.log('Creating demo call record for:', phoneNumber);

      // Create call record in database
      const callData = {
        user_id: user.id,
        lead_id: leadId || null,
        phone_number: phoneNumber,
        direction: 'outbound',
        status: 'initial', // Use 'initial' status which is allowed by DB constraint
        aircall_call_id: `demo_${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      const { data: callRecord, error: callError } = await supabase
        .from('aircall_calls')
        .insert(callData)
        .select()
        .single();

      if (callError) {
        console.error('Error creating call record:', callError);
        throw new Error('Failed to create call record');
      }

      console.log('Call record created:', callRecord.id);

      // Create activity log
      if (leadId) {
        const { error: activityError } = await supabase
          .from('lead_activities')
          .insert({
            lead_id: leadId,
            user_id: user.id,
            type: 'call',
            description: `Initiated call to ${phoneNumber}`,
            metadata: { call_id: callRecord.id, phone_number: phoneNumber },
            created_at: new Date().toISOString(),
          });

        if (activityError) {
          console.error('Error creating activity log:', activityError);
        }
      }

      // Simulate call initiation success
      const response = {
        success: true,
        call_id: callRecord.id,
        aircall_call_id: callData.aircall_call_id,
        phone_number: phoneNumber,
        status: 'initiated',
        demo_mode: true,
        message: 'Call initiated successfully (Demo Mode)',
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error('Aircall API error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      demo_mode: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});