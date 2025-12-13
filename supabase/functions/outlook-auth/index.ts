import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Encryption utilities using Web Crypto API
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyString = Deno.env.get('OUTLOOK_TOKEN_ENCRYPTION_KEY');
  if (!keyString) {
    throw new Error('Encryption key not configured');
  }
  
  // Convert the key string to a CryptoKey
  const keyData = new TextEncoder().encode(keyString.padEnd(32, '0').slice(0, 32));
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptToken(token: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedToken = new TextEncoder().encode(token);
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedToken
  );
  
  // Combine IV and encrypted data, then base64 encode
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

async function decryptToken(encryptedToken: string): Promise<string> {
  const key = await getEncryptionKey();
  
  // Decode base64 and split IV from data
  const combined = new Uint8Array(atob(encryptedToken).split('').map(c => c.charCodeAt(0)));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return new TextDecoder().decode(decryptedBuffer);
}

async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
  const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
  
  const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Token refresh failed:', errorText);
    throw new Error('Failed to refresh access token');
  }
  
  const tokens = await response.json();
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || refreshToken,
    expiresIn: tokens.expires_in,
  };
}

serve(async (req) => {
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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, code, userId } = await req.json();

    // Get valid token - refreshes if needed
    if (action === 'get-valid-token') {
      const targetUserId = userId || user.id;
      
      // Use service role to get tokens for any user (for edge functions)
      const serviceClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const { data: settings, error: settingsError } = await serviceClient
        .from('user_settings')
        .select('outlook_access_token_encrypted, outlook_refresh_token_encrypted, outlook_token_expires_at, outlook_connected, outlook_email')
        .eq('user_id', targetUserId)
        .single();
      
      if (settingsError || !settings?.outlook_connected) {
        throw new Error('Outlook not connected');
      }
      
      const expiresAt = new Date(settings.outlook_token_expires_at);
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      
      let accessToken: string;
      
      // If token expires within 5 minutes, refresh it
      if (expiresAt <= fiveMinutesFromNow) {
        console.log('Token expiring soon, refreshing...');
        const refreshToken = await decryptToken(settings.outlook_refresh_token_encrypted);
        const newTokens = await refreshAccessToken(refreshToken);
        
        // Store new encrypted tokens
        const encryptedAccess = await encryptToken(newTokens.accessToken);
        const encryptedRefresh = await encryptToken(newTokens.refreshToken);
        const newExpiresAt = new Date(Date.now() + newTokens.expiresIn * 1000).toISOString();
        
        await serviceClient
          .from('user_settings')
          .update({
            outlook_access_token_encrypted: encryptedAccess,
            outlook_refresh_token_encrypted: encryptedRefresh,
            outlook_token_expires_at: newExpiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', targetUserId);
        
        accessToken = newTokens.accessToken;
        console.log('Token refreshed successfully');
      } else {
        accessToken = await decryptToken(settings.outlook_access_token_encrypted);
      }
      
      return new Response(
        JSON.stringify({ 
          accessToken,
          email: settings.outlook_email,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'get-auth-url') {
      const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
      const appUrl = req.headers.get('origin') || Deno.env.get('SUPABASE_URL');
      const redirectUri = `${appUrl}/outlook/callback`;
      
      const scopes = [
        'https://graph.microsoft.com/Calendars.ReadWrite',
        'https://graph.microsoft.com/Mail.ReadWrite',
        'https://graph.microsoft.com/Mail.Send',
        'https://graph.microsoft.com/User.Read',
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'exchange-code') {
      const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
      const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
      const appUrl = req.headers.get('origin') || Deno.env.get('SUPABASE_URL');
      const redirectUri = `${appUrl}/outlook/callback`;

      const tokenResponse = await fetch(
        'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
        headers: { 'Authorization': `Bearer ${tokens.access_token}` },
      });

      const userInfo = await userInfoResponse.json();
      
      // Encrypt tokens before storing
      const encryptedAccessToken = await encryptToken(tokens.access_token);
      const encryptedRefreshToken = await encryptToken(tokens.refresh_token);
      const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

      // Get user's tenant_id
      const { data: tenantUser } = await supabaseClient
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single();

      // Store encrypted tokens in database
      const { error: dbError } = await supabaseClient
        .from('user_settings')
        .upsert({
          user_id: user.id,
          outlook_connected: true,
          outlook_access_token_encrypted: encryptedAccessToken,
          outlook_refresh_token_encrypted: encryptedRefreshToken,
          outlook_token_expires_at: expiresAt,
          outlook_email: userInfo.mail || userInfo.userPrincipalName,
          outlook_user_id: userInfo.id,
          updated_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save Outlook connection');
      }

      console.log('Successfully connected Outlook for user:', user.id, 'email:', userInfo.mail || userInfo.userPrincipalName);

      return new Response(
        JSON.stringify({ 
          success: true,
          email: userInfo.mail || userInfo.userPrincipalName
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'disconnect') {
      const { error: dbError } = await supabaseClient
        .from('user_settings')
        .update({
          outlook_connected: false,
          outlook_access_token_encrypted: null,
          outlook_refresh_token_encrypted: null,
          outlook_token_expires_at: null,
          outlook_email: null,
          outlook_user_id: null,
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'check-connection') {
      const { data: settings } = await supabaseClient
        .from('user_settings')
        .select('outlook_connected, outlook_email, outlook_token_expires_at')
        .eq('user_id', user.id)
        .single();
      
      const isConnected = settings?.outlook_connected && 
        settings?.outlook_token_expires_at && 
        new Date(settings.outlook_token_expires_at) > new Date();
      
      return new Response(
        JSON.stringify({ 
          connected: isConnected,
          email: settings?.outlook_email
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in outlook-auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
