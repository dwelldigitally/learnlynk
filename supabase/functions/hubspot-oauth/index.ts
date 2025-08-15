import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET') {
      // Return HubSpot OAuth configuration
      const clientId = Deno.env.get('HUBSPOT_CLIENT_ID')
      const clientSecret = Deno.env.get('HUBSPOT_CLIENT_SECRET')
      
      console.log('Environment variables check:', {
        clientId: clientId ? 'EXISTS' : 'MISSING',
        clientSecret: clientSecret ? 'EXISTS' : 'MISSING'
      })
      
      if (!clientId) {
        console.error('HubSpot CLIENT_ID is missing from environment variables')
        return new Response(
          JSON.stringify({ error: 'HubSpot OAuth not configured', details: 'CLIENT_ID missing' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const redirectUri = `${req.headers.get('origin')}/hubspot/oauth/callback`
      const scopes = [
        'crm.objects.line_items.read',
        'crm.schemas.deals.read',
        'crm.objects.line_items.write',
        'crm.schemas.deals.write',
        'crm.objects.goals.write',
        'oauth',
        'crm.objects.owners.read',
        'settings.users.teams.read',
        'crm.objects.users.read',
        'crm.objects.contacts.write',
        'crm.objects.users.write',
        'crm.objects.goals.read',
        'settings.users.read',
        'crm.objects.deals.read',
        'crm.schemas.contacts.read',
        'crm.objects.deals.write',
        'crm.objects.contacts.read',
        'crm.schemas.companies.read'
      ].join(' ')

      const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`

      return new Response(
        JSON.stringify({ 
          authUrl,
          clientId,
          redirectUri,
          scopes: scopes.split(' ')
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      // Handle OAuth token exchange
      const { code } = await req.json()
      
      if (!code) {
        return new Response(
          JSON.stringify({ error: 'Authorization code required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const clientId = Deno.env.get('HUBSPOT_CLIENT_ID')
      const clientSecret = Deno.env.get('HUBSPOT_CLIENT_SECRET')
      const redirectUri = `${req.headers.get('origin')}/hubspot/oauth/callback`

      if (!clientId || !clientSecret) {
        return new Response(
          JSON.stringify({ error: 'HubSpot OAuth credentials not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: code,
        }),
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to exchange code for token', details: tokenData }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Store the tokens securely in the database
      const { error: insertError } = await supabaseClient
        .from('hubspot_connections')
        .upsert({
          user_id: user.id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
          hub_id: tokenData.hub_id.toString(),
          scopes: tokenData.scope ? tokenData.scope.split(' ') : [],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (insertError) {
        console.error('Error storing HubSpot tokens:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to store connection' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          hubId: tokenData.hub_id,
          expiresIn: tokenData.expires_in
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('HubSpot OAuth error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})