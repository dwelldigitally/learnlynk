import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
}

serve(async (req) => {
  console.log(`🚀 HubSpot OAuth Function - ${req.method} request started at:`, new Date().toISOString())
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      authHeader: !!req.headers.get('Authorization')
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } }
    )

    // Get the authenticated user
    console.log('🔐 Checking user authentication...')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError) {
      console.error('❌ Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Authentication failed', details: authError.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!user) {
      console.error('❌ No user found')
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ User authenticated:', user.id)

    // Add test endpoint for both GET and POST
    const url = new URL(req.url);
    if (url.pathname.endsWith('/test')) {
      console.log('🧪 Test endpoint called');
      return new Response(
        JSON.stringify({ 
          status: 'ok', 
          user: user.id,
          timestamp: new Date().toISOString(),
          message: 'HubSpot OAuth function is working'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET') {
      console.log('📋 Getting HubSpot OAuth configuration...')
      
      // Return HubSpot OAuth configuration
      const clientId = Deno.env.get('HUBSPOT_CLIENT_ID')
      const clientSecret = Deno.env.get('HUBSPOT_CLIENT_SECRET')
      
      console.log('🔍 Environment variables check:', {
        clientId: clientId ? 'EXISTS' : 'MISSING',
        clientSecret: clientSecret ? 'EXISTS' : 'MISSING',
        timestamp: new Date().toISOString()
      })
      
      if (!clientId) {
        console.error('❌ HubSpot CLIENT_ID is missing from environment variables')
        return new Response(
          JSON.stringify({ error: 'HubSpot OAuth not configured', details: 'CLIENT_ID missing' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const redirectUri = 'https://effa936e-da4f-49df-b4e9-293871d5adb4.lovableproject.com/hubspot/oauth/callback'
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

      console.log('✅ OAuth configuration generated successfully')
      
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
      console.log('🔄 Handling OAuth token exchange...')
      
      // Handle OAuth token exchange
      let requestBody
      try {
        requestBody = await req.json()
      } catch (error) {
        console.error('❌ Failed to parse request body:', error)
        return new Response(
          JSON.stringify({ error: 'Invalid request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { code } = requestBody
      
      if (!code) {
        console.error('❌ Authorization code missing')
        return new Response(
          JSON.stringify({ error: 'Authorization code required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('📝 Authorization code received, length:', code.length)

      const clientId = Deno.env.get('HUBSPOT_CLIENT_ID')
      const clientSecret = Deno.env.get('HUBSPOT_CLIENT_SECRET')
      const redirectUri = 'https://effa936e-da4f-49df-b4e9-293871d5adb4.lovableproject.com/hubspot/oauth/callback'

      if (!clientId || !clientSecret) {
        console.error('❌ HubSpot OAuth credentials not configured')
        return new Response(
          JSON.stringify({ error: 'HubSpot OAuth credentials not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('🔄 Exchanging code for access token...')
      
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

      console.log('📊 Token exchange response:', {
        status: tokenResponse.status,
        ok: tokenResponse.ok,
        hasAccessToken: !!tokenData.access_token,
        hasRefreshToken: !!tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        hubId: tokenData.hub_id
      })

      if (!tokenResponse.ok) {
        console.error('❌ Token exchange failed:', tokenData)
        return new Response(
          JSON.stringify({ error: 'Failed to exchange code for token', details: tokenData }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('💾 Storing tokens in database...')
      
      // Store the tokens securely in the database
      const connectionData = {
        user_id: user.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
        hub_id: tokenData.hub_id.toString(),
        scopes: tokenData.scope ? tokenData.scope.split(' ') : [],
        updated_at: new Date().toISOString()
      }

      console.log('📝 Connection data to store:', {
        user_id: connectionData.user_id,
        hub_id: connectionData.hub_id,
        expires_at: connectionData.expires_at,
        scopesCount: connectionData.scopes.length
      })

      const { error: insertError } = await supabaseClient
        .from('hubspot_connections')
        .upsert(connectionData, {
          onConflict: 'user_id'
        })

      if (insertError) {
        console.error('❌ Error storing HubSpot tokens:', insertError)
        return new Response(
          JSON.stringify({ 
            error: 'Failed to store connection', 
            details: insertError.message,
            code: insertError.code
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('✅ HubSpot connection stored successfully')

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
    console.error('❌ HubSpot OAuth error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
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