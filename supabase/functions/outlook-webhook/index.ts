import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Encryption utilities (must match outlook-auth)
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyString = Deno.env.get('OUTLOOK_TOKEN_ENCRYPTION_KEY');
  if (!keyString) {
    throw new Error('Encryption key not configured');
  }
  
  const keyData = new TextEncoder().encode(keyString.padEnd(32, '0').slice(0, 32));
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

async function decryptToken(encryptedToken: string): Promise<string> {
  const key = await getEncryptionKey();
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

async function matchEmailToLead(
  supabaseClient: any,
  tenantId: string,
  fromEmail: string,
  toEmails: string[],
  conversationId: string
): Promise<string | null> {
  const { data: existingThread } = await supabaseClient
    .from('outlook_email_threads')
    .select('lead_id')
    .eq('conversation_id', conversationId)
    .single();

  if (existingThread?.lead_id) {
    return existingThread.lead_id;
  }

  const allEmails = [fromEmail, ...toEmails].filter(Boolean);
  
  for (const email of allEmails) {
    const { data: lead } = await supabaseClient
      .from('leads')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('email', email.toLowerCase())
      .single();

    if (lead?.id) {
      return lead.id;
    }
  }

  return null;
}

serve(async (req) => {
  // Handle Microsoft validation request
  const url = new URL(req.url);
  const validationToken = url.searchParams.get('validationToken');
  
  if (validationToken) {
    console.log('Validation request received');
    return new Response(validationToken, {
      headers: { 'Content-Type': 'text/plain' },
      status: 200,
    });
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const notifications = body.value || [];

    console.log(`Received ${notifications.length} webhook notifications`);

    for (const notification of notifications) {
      try {
        const { clientState, resourceData, changeType, resource } = notification;

        // Validate client state by looking up subscription
        const { data: subscription, error: subError } = await supabaseClient
          .from('outlook_webhook_subscriptions')
          .select('*')
          .eq('client_state', clientState)
          .eq('is_active', true)
          .single();

        if (subError || !subscription) {
          console.error('Invalid or inactive subscription for client state:', clientState);
          continue;
        }

        // Update last notification timestamp
        await supabaseClient
          .from('outlook_webhook_subscriptions')
          .update({ last_notification_at: new Date().toISOString() })
          .eq('id', subscription.id);

        const userId = subscription.user_id;
        const tenantId = subscription.tenant_id;

        // Get user's Outlook tokens
        const { data: settings } = await supabaseClient
          .from('user_settings')
          .select('outlook_access_token_encrypted, outlook_email')
          .eq('user_id', userId)
          .single();

        if (!settings?.outlook_access_token_encrypted) {
          console.error('No Outlook tokens found for user:', userId);
          continue;
        }

        const accessToken = await decryptToken(settings.outlook_access_token_encrypted);

        // Fetch the full message from Graph API
        const messageId = resourceData?.id || resource.split('/').pop();
        
        const graphResponse = await fetch(
          `https://graph.microsoft.com/v1.0/me/messages/${messageId}?$select=id,conversationId,internetMessageId,subject,bodyPreview,body,from,toRecipients,ccRecipients,receivedDateTime,sentDateTime,hasAttachments,isRead,isDraft,importance`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!graphResponse.ok) {
          console.error('Failed to fetch message from Graph:', await graphResponse.text());
          continue;
        }

        const message = await graphResponse.json();

        // Check if already synced
        const { data: existingEmail } = await supabaseClient
          .from('emails')
          .select('id')
          .eq('microsoft_message_id', message.id)
          .single();

        if (existingEmail) {
          // Update if it's a status change
          if (changeType === 'updated') {
            await supabaseClient
              .from('emails')
              .update({
                is_read: message.isRead,
                last_synced_at: new Date().toISOString(),
              })
              .eq('id', existingEmail.id);
          }
          continue;
        }

        // Extract email addresses
        const fromEmail = message.from?.emailAddress?.address?.toLowerCase() || '';
        const toEmails = (message.toRecipients || []).map((r: any) => r.emailAddress?.address?.toLowerCase()).filter(Boolean);
        const ccEmails = (message.ccRecipients || []).map((r: any) => r.emailAddress?.address?.toLowerCase()).filter(Boolean);

        // Determine direction
        const isInbound = fromEmail !== settings.outlook_email?.toLowerCase();
        const direction = isInbound ? 'inbound' : 'outbound';

        // Try to match to a lead
        const leadId = await matchEmailToLead(supabaseClient, tenantId, fromEmail, toEmails, message.conversationId);

        // Create email record
        const emailRecord = {
          tenant_id: tenantId,
          user_id: userId,
          lead_id: leadId,
          microsoft_message_id: message.id,
          microsoft_conversation_id: message.conversationId,
          microsoft_internet_message_id: message.internetMessageId,
          from_email: fromEmail,
          from_name: message.from?.emailAddress?.name,
          to_emails: toEmails,
          cc_emails: ccEmails,
          subject: message.subject,
          body_preview: message.bodyPreview,
          body_html: message.body?.contentType === 'html' ? message.body?.content : null,
          body_text: message.body?.contentType === 'text' ? message.body?.content : null,
          direction,
          status: message.isDraft ? 'draft' : (isInbound ? 'received' : 'sent'),
          is_read: message.isRead,
          has_attachments: message.hasAttachments,
          importance: message.importance,
          sent_via_outlook: true,
          sync_status: 'synced',
          last_synced_at: new Date().toISOString(),
          received_at: message.receivedDateTime,
          sent_at: message.sentDateTime,
          created_at: new Date().toISOString(),
        };

        const { data: savedEmail, error: saveError } = await supabaseClient
          .from('emails')
          .insert(emailRecord)
          .select()
          .single();

        if (saveError) {
          console.error('Failed to save email:', saveError);
          continue;
        }

        // Update thread tracking
        await supabaseClient
          .from('outlook_email_threads')
          .upsert({
            tenant_id: tenantId,
            user_id: userId,
            lead_id: leadId,
            conversation_id: message.conversationId,
            internet_message_id: message.internetMessageId,
            subject: message.subject,
            last_message_at: message.receivedDateTime || message.sentDateTime,
          }, {
            onConflict: 'user_id,conversation_id',
          });

        // Log activity and create notification if matched to lead and inbound
        if (leadId && isInbound) {
          await supabaseClient
            .from('lead_activity_logs')
            .insert({
              tenant_id: tenantId,
              lead_id: leadId,
              user_id: userId,
              action_type: 'email_received',
              action_category: 'communication',
              description: `Email received: ${message.subject}`,
              new_value: JSON.stringify({ from: fromEmail, subject: message.subject }),
            });

          await supabaseClient
            .from('lead_communications')
            .insert({
              tenant_id: tenantId,
              lead_id: leadId,
              user_id: userId,
              type: 'email',
              direction: 'inbound',
              subject: message.subject,
              content: message.bodyPreview,
              status: 'received',
              channel: 'outlook',
            });

          // Create in-app notification
          await supabaseClient
            .from('notifications')
            .insert({
              tenant_id: tenantId,
              user_id: userId,
              type: 'email_received',
              title: 'New Email from Lead',
              message: `${message.from?.emailAddress?.name || fromEmail}: ${message.subject}`,
              data: { leadId, emailId: savedEmail.id },
              is_read: false,
            });
        }

        console.log(`Synced email via webhook: ${message.id}, lead: ${leadId || 'unmatched'}`);

      } catch (notifError) {
        console.error('Error processing notification:', notifError);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 202 }
    );

  } catch (error) {
    console.error('Error in outlook-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
