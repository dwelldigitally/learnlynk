import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscriptionRequest {
  action: 'create' | 'renew' | 'delete' | 'list';
  resource?: 'inbox' | 'calendar' | 'sentItems';
  subscriptionId?: string;
}

async function getValidAccessToken(supabaseUrl: string, userId: string, authHeader: string): Promise<{ accessToken: string; email: string }> {
  const response = await fetch(`${supabaseUrl}/functions/v1/outlook-auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify({ action: 'get-valid-token', userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get valid access token');
  }

  return response.json();
}

function generateClientState(): string {
  return crypto.randomUUID();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const authHeader = req.headers.get('Authorization')!;
    
    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, resource = 'inbox', subscriptionId }: SubscriptionRequest = await req.json();

    // Get tenant_id
    const { data: tenantUser } = await supabaseClient
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single();

    const tenantId = tenantUser?.tenant_id;

    if (action === 'list') {
      const { data: subscriptions } = await supabaseClient
        .from('outlook_webhook_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      return new Response(
        JSON.stringify({ subscriptions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Get valid access token
    const { accessToken } = await getValidAccessToken(supabaseUrl, user.id, authHeader);

    if (action === 'delete') {
      if (!subscriptionId) {
        throw new Error('subscriptionId is required for delete action');
      }

      // Delete from Graph API
      const deleteResponse = await fetch(
        `https://graph.microsoft.com/v1.0/subscriptions/${subscriptionId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      // Mark as inactive in database
      await supabaseClient
        .from('outlook_webhook_subscriptions')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('subscription_id', subscriptionId);

      console.log('Deleted subscription:', subscriptionId);

      return new Response(
        JSON.stringify({ success: true, deleted: subscriptionId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'renew') {
      if (!subscriptionId) {
        throw new Error('subscriptionId is required for renew action');
      }

      // Renew subscription (max 3 days for most resources)
      const expirationDateTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 - 60000).toISOString();

      const renewResponse = await fetch(
        `https://graph.microsoft.com/v1.0/subscriptions/${subscriptionId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expirationDateTime,
          }),
        }
      );

      if (!renewResponse.ok) {
        const errorText = await renewResponse.text();
        console.error('Failed to renew subscription:', errorText);
        
        // Mark as inactive if renewal fails
        await supabaseClient
          .from('outlook_webhook_subscriptions')
          .update({ is_active: false })
          .eq('subscription_id', subscriptionId);

        throw new Error('Failed to renew subscription - will need to recreate');
      }

      const renewedSub = await renewResponse.json();

      // Update in database
      await supabaseClient
        .from('outlook_webhook_subscriptions')
        .update({
          expiration_datetime: renewedSub.expirationDateTime,
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', subscriptionId);

      console.log('Renewed subscription:', subscriptionId);

      return new Response(
        JSON.stringify({ success: true, subscription: renewedSub }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'create') {
      // Map resource to Graph API path
      const resourceMap: Record<string, string> = {
        inbox: 'me/mailFolders/inbox/messages',
        sentItems: 'me/mailFolders/sentItems/messages',
        calendar: 'me/events',
      };

      const graphResource = resourceMap[resource];
      if (!graphResource) {
        throw new Error('Invalid resource type');
      }

      const clientState = generateClientState();
      const notificationUrl = `${supabaseUrl}/functions/v1/outlook-webhook`;
      
      // Set expiration to just under 3 days (Graph API maximum)
      const expirationDateTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 - 60000).toISOString();

      const subscriptionPayload = {
        changeType: 'created,updated',
        notificationUrl,
        resource: graphResource,
        expirationDateTime,
        clientState,
      };

      console.log('Creating subscription:', subscriptionPayload);

      const createResponse = await fetch(
        'https://graph.microsoft.com/v1.0/subscriptions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscriptionPayload),
        }
      );

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Failed to create subscription:', errorText);
        throw new Error(`Failed to create subscription: ${errorText}`);
      }

      const subscription = await createResponse.json();

      // Store subscription in database
      const { error: dbError } = await supabaseClient
        .from('outlook_webhook_subscriptions')
        .insert({
          tenant_id: tenantId,
          user_id: user.id,
          subscription_id: subscription.id,
          resource: graphResource,
          change_types: ['created', 'updated'],
          expiration_datetime: subscription.expirationDateTime,
          client_state: clientState,
          notification_url: notificationUrl,
          is_active: true,
        });

      if (dbError) {
        console.error('Failed to store subscription:', dbError);
        // Try to delete the subscription we just created
        await fetch(`https://graph.microsoft.com/v1.0/subscriptions/${subscription.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        throw new Error('Failed to store subscription in database');
      }

      console.log('Created subscription:', subscription.id, 'for resource:', resource);

      return new Response(
        JSON.stringify({
          success: true,
          subscription: {
            id: subscription.id,
            resource,
            expirationDateTime: subscription.expirationDateTime,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in outlook-subscription function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
