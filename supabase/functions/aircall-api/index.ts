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

    // Get user's tenant ID from JWT claims or tenant_users table
    const { data: tenantUser, error: tenantError } = await supabase
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single();

    if (tenantError || !tenantUser) {
      throw new Error('User not associated with a tenant');
    }

    const tenantId = tenantUser.tenant_id;
    console.log('Tenant ID:', tenantId);

    // Get tenant's Aircall connection
    const { data: connection, error: connectionError } = await supabase
      .from('tenant_aircall_connections')
      .select('*')
      .eq('tenant_id', tenantId)
      .single();

    if (connectionError || !connection) {
      throw new Error('Aircall connection not found for this institution');
    }

    if (!connection.is_active || connection.connection_status !== 'connected') {
      throw new Error('Aircall integration is not active');
    }

    const apiId = connection.api_id;
    const apiToken = connection.api_token_encrypted;

    if (req.method === 'POST') {
      const { phoneNumber, leadId }: AircallCallRequest = await req.json();

      if (!phoneNumber) {
        throw new Error('Phone number is required');
      }

      // Test Aircall API connection first
      console.log('Testing Aircall API connection...');
      
      const pingResponse = await fetch('https://api.aircall.io/v1/ping', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${apiId}:${apiToken}`)}`,
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
        from: apiId, // Use the configured number or agent
      };

      const aircallResponse = await fetch('https://api.aircall.io/v1/calls', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${apiId}:${apiToken}`)}`,
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

      // Create call record in database with tenant_id
      const callData = {
        tenant_id: tenantId,
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

    // GET request - fetch call history
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const leadId = url.searchParams.get('leadId');
      const limit = parseInt(url.searchParams.get('limit') || '20');

      let query = supabase
        .from('aircall_calls')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data: calls, error: callsError } = await query;

      if (callsError) {
        throw new Error('Failed to fetch call history');
      }

      return new Response(JSON.stringify({ calls }), {
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
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
