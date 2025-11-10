import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, code } = await req.json();

    if (action === 'get-auth-url') {
      // Generate Microsoft OAuth URL
      const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
      const appUrl = req.headers.get('origin') || Deno.env.get('SUPABASE_URL');
      const redirectUri = `${appUrl}/outlook/callback`;
      
      const scopes = [
        'https://graph.microsoft.com/Calendars.ReadWrite',
        'https://graph.microsoft.com/Mail.ReadWrite',
        'https://graph.microsoft.com/Mail.Send',
        'offline_access',
        'openid',
        'profile',
        'email'
      ].join(' ');

      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${clientId}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&state=${user.id}`;

      console.log('Generated auth URL for user:', user.id);

      return new Response(
        JSON.stringify({ authUrl }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (action === 'exchange-code') {
      // Exchange authorization code for tokens
      const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
      const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
      const appUrl = req.headers.get('origin') || Deno.env.get('SUPABASE_URL');
      const redirectUri = `${appUrl}/outlook/callback`;

      const tokenResponse = await fetch(
        'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId!,
            client_secret: clientSecret!,
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          }),
        }
      );

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', errorText);
        throw new Error('Failed to exchange authorization code');
      }

      const tokens = await tokenResponse.json();

      // Get user info from Microsoft Graph
      const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      const userInfo = await userInfoResponse.json();

      // Calculate token expiry
      const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

      // Store tokens in database
      const { error: dbError } = await supabaseClient
        .from('user_settings')
        .upsert({
          user_id: user.id,
          outlook_connected: true,
          outlook_access_token: tokens.access_token,
          outlook_refresh_token: tokens.refresh_token,
          outlook_token_expires_at: expiresAt,
          outlook_email: userInfo.mail || userInfo.userPrincipalName,
          updated_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save Outlook connection');
      }

      console.log('Successfully connected Outlook for user:', user.id);

      return new Response(
        JSON.stringify({ 
          success: true,
          email: userInfo.mail || userInfo.userPrincipalName
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (action === 'disconnect') {
      // Disconnect Outlook
      const { error: dbError } = await supabaseClient
        .from('user_settings')
        .update({
          outlook_connected: false,
          outlook_access_token: null,
          outlook_refresh_token: null,
          outlook_token_expires_at: null,
          outlook_email: null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to disconnect Outlook');
      }

      console.log('Successfully disconnected Outlook for user:', user.id);

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in outlook-auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
