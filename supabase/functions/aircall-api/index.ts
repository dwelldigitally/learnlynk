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

      // Test Aircall API connection first
      console.log('Testing Aircall API connection...');
      
      const pingResponse = await fetch('https://api.aircall.io/v1/ping', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${settings.api_id}:${settings.api_token_encrypted}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (!pingResponse.ok) {
        throw new Error('Aircall API connection failed - please check your credentials');
      }

      console.log('Aircall API connection successful');

      // Make actual Aircall API call to initiate the call
      console.log('Initiating actual call via Aircall API for:', phoneNumber);

      const callPayload = {
        to: phoneNumber,
        from: settings.api_id, // Use the configured number or agent
      };

      const aircallResponse = await fetch('https://api.aircall.io/v1/calls', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${settings.api_id}:${settings.api_token_encrypted}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callPayload),
      });

      const aircallData = await aircallResponse.json();

      if (!aircallResponse.ok) {
        console.error('Aircall API error:', aircallData);
        throw new Error(`Aircall API error: ${aircallData.message || 'Failed to initiate call'}`);
      }

      console.log('Call initiated successfully via Aircall:', aircallData);

      // Create call record in database with real Aircall data
      const callData = {
        user_id: user.id,
        lead_id: leadId || null,
        phone_number: phoneNumber,
        direction: 'outbound',
        status: 'initial',
        aircall_call_id: aircallData.call?.id?.toString() || `aircall_${Date.now()}`,
        started_at: new Date().toISOString(),
        aircall_metadata: aircallData,
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
            activity_type: 'call',
            activity_description: `Initiated call to ${phoneNumber} via Aircall`,
            activity_data: { 
              call_id: callRecord.id, 
              phone_number: phoneNumber,
              aircall_call_id: aircallData.call?.id 
            },
            created_at: new Date().toISOString(),
          });

        if (activityError) {
          console.error('Error creating activity log:', activityError);
        }
      }

      // Return success response with real Aircall data
      const response = {
        success: true,
        call_id: callRecord.id,
        aircall_call_id: aircallData.call?.id,
        phone_number: phoneNumber,
        status: 'initiated',
        aircall_data: aircallData,
        message: 'Call initiated successfully via Aircall API',
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