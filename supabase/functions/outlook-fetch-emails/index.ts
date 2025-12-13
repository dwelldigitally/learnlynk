import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FetchEmailsRequest {
  folderId?: string;
  since?: string;
  top?: number;
  skip?: number;
  filter?: string;
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

async function matchEmailToLead(
  supabaseClient: any,
  tenantId: string,
  fromEmail: string,
  toEmails: string[],
  conversationId: string
): Promise<string | null> {
  // First, try to find by conversation_id in existing threads
  const { data: existingThread } = await supabaseClient
    .from('outlook_email_threads')
    .select('lead_id')
    .eq('conversation_id', conversationId)
    .single();

  if (existingThread?.lead_id) {
    return existingThread.lead_id;
  }

  // Then try to match by email address
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

    const requestBody: FetchEmailsRequest = await req.json();
    const { folderId = 'inbox', since, top = 50, skip = 0, filter } = requestBody;

    // Get valid access token
    const { accessToken, email: userEmail } = await getValidAccessToken(supabaseUrl, user.id, authHeader);

    // Get tenant_id for the user
    const { data: tenantUser } = await supabaseClient
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single();

    const tenantId = tenantUser?.tenant_id;

    // Build Graph API query
    let graphUrl = `https://graph.microsoft.com/v1.0/me/mailFolders/${folderId}/messages`;
    const queryParams: string[] = [];
    
    queryParams.push(`$top=${top}`);
    queryParams.push(`$skip=${skip}`);
    queryParams.push('$orderby=receivedDateTime desc');
    queryParams.push('$select=id,conversationId,internetMessageId,subject,bodyPreview,body,from,toRecipients,ccRecipients,receivedDateTime,sentDateTime,hasAttachments,isRead,isDraft,importance');
    
    if (since) {
      queryParams.push(`$filter=receivedDateTime ge ${since}`);
    }

    if (filter) {
      queryParams.push(`$filter=${filter}`);
    }

    graphUrl += '?' + queryParams.join('&');

    const graphResponse = await fetch(graphUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!graphResponse.ok) {
      const errorText = await graphResponse.text();
      console.error('Graph API fetch error:', errorText);
      throw new Error(`Failed to fetch emails: ${errorText}`);
    }

    const graphData = await graphResponse.json();
    const messages = graphData.value || [];

    console.log(`Fetched ${messages.length} emails from Outlook for user:`, user.id);

    // Process and sync each message
    const syncedEmails: any[] = [];
    const newEmails: any[] = [];

    for (const message of messages) {
      // Check if already synced
      const { data: existingEmail } = await supabaseClient
        .from('emails')
        .select('id')
        .eq('microsoft_message_id', message.id)
        .single();

      if (existingEmail) {
        syncedEmails.push({ id: existingEmail.id, microsoft_id: message.id, status: 'already_synced' });
        continue;
      }

      // Extract email addresses
      const fromEmail = message.from?.emailAddress?.address?.toLowerCase() || '';
      const toEmails = (message.toRecipients || []).map((r: any) => r.emailAddress?.address?.toLowerCase()).filter(Boolean);
      const ccEmails = (message.ccRecipients || []).map((r: any) => r.emailAddress?.address?.toLowerCase()).filter(Boolean);

      // Determine direction
      const isInbound = fromEmail !== userEmail.toLowerCase();
      const direction = isInbound ? 'inbound' : 'outbound';

      // Try to match to a lead
      const leadId = await matchEmailToLead(supabaseClient, tenantId, fromEmail, toEmails, message.conversationId);

      // Create email record
      const emailRecord = {
        tenant_id: tenantId,
        user_id: user.id,
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
        console.error('Failed to save email:', saveError, 'for message:', message.id);
        continue;
      }

      // Update or create thread tracking
      await supabaseClient
        .from('outlook_email_threads')
        .upsert({
          tenant_id: tenantId,
          user_id: user.id,
          lead_id: leadId,
          conversation_id: message.conversationId,
          internet_message_id: message.internetMessageId,
          subject: message.subject,
          last_message_at: message.receivedDateTime || message.sentDateTime,
          message_count: 1, // This will be incremented by trigger or manual update
        }, {
          onConflict: 'user_id,conversation_id',
          ignoreDuplicates: false,
        });

      // Log activity if matched to lead
      if (leadId && isInbound) {
        await supabaseClient
          .from('lead_activity_logs')
          .insert({
            tenant_id: tenantId,
            lead_id: leadId,
            user_id: user.id,
            action_type: 'email_received',
            action_category: 'communication',
            description: `Email received: ${message.subject}`,
            new_value: JSON.stringify({ from: fromEmail, subject: message.subject }),
          });

        // Also log to lead_communications
        await supabaseClient
          .from('lead_communications')
          .insert({
            tenant_id: tenantId,
            lead_id: leadId,
            user_id: user.id,
            type: 'email',
            direction: 'inbound',
            subject: message.subject,
            content: message.bodyPreview,
            status: 'received',
            channel: 'outlook',
          });
      }

      newEmails.push({ id: savedEmail.id, microsoft_id: message.id, lead_id: leadId, status: 'synced' });
    }

    console.log(`Synced ${newEmails.length} new emails, ${syncedEmails.length} already synced`);

    return new Response(
      JSON.stringify({
        success: true,
        totalFetched: messages.length,
        newlySynced: newEmails.length,
        alreadySynced: syncedEmails.length,
        emails: newEmails,
        hasMore: messages.length === top,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in outlook-fetch-emails function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
