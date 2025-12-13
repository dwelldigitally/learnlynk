import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
  leadId?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  bodyType?: 'html' | 'text';
  attachments?: Array<{
    name: string;
    contentBytes: string;
    contentType: string;
  }>;
  replyToMessageId?: string;
  saveToSentItems?: boolean;
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

    const requestBody: SendEmailRequest = await req.json();
    const { leadId, to, cc, bcc, subject, body, bodyType = 'html', attachments, replyToMessageId, saveToSentItems = true } = requestBody;

    // Get valid access token
    const { accessToken, email: senderEmail } = await getValidAccessToken(supabaseUrl, user.id, authHeader);

    let graphResponse;
    let messageData: any;

    if (replyToMessageId) {
      // Reply to existing message - preserves threading
      console.log('Replying to message:', replyToMessageId);
      
      graphResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/messages/${replyToMessageId}/reply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              body: {
                contentType: bodyType === 'html' ? 'HTML' : 'Text',
                content: body,
              },
              toRecipients: to.map(email => ({ emailAddress: { address: email } })),
              ccRecipients: cc?.map(email => ({ emailAddress: { address: email } })) || [],
            },
            comment: '', // Required but can be empty
          }),
        }
      );
      
      // Reply endpoint returns 202 Accepted with no body
      if (!graphResponse.ok) {
        const errorText = await graphResponse.text();
        console.error('Graph API reply error:', errorText);
        throw new Error(`Failed to send reply: ${errorText}`);
      }
    } else {
      // New email - use sendMail endpoint
      const emailMessage = {
        message: {
          subject,
          body: {
            contentType: bodyType === 'html' ? 'HTML' : 'Text',
            content: body,
          },
          toRecipients: to.map(email => ({ emailAddress: { address: email } })),
          ccRecipients: cc?.map(email => ({ emailAddress: { address: email } })) || [],
          bccRecipients: bcc?.map(email => ({ emailAddress: { address: email } })) || [],
          attachments: attachments?.map(att => ({
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: att.name,
            contentBytes: att.contentBytes,
            contentType: att.contentType,
          })) || [],
        },
        saveToSentItems,
      };

      graphResponse = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailMessage),
      });

      if (!graphResponse.ok) {
        const errorText = await graphResponse.text();
        console.error('Graph API sendMail error:', errorText);
        throw new Error(`Failed to send email: ${errorText}`);
      }
    }

    // Get tenant_id for the user
    const { data: tenantUser } = await supabaseClient
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single();

    // Log the email in LearnLynk database
    const emailRecord = {
      tenant_id: tenantUser?.tenant_id,
      user_id: user.id,
      lead_id: leadId || null,
      from_email: senderEmail,
      to_emails: to,
      cc_emails: cc || [],
      bcc_emails: bcc || [],
      subject,
      body_preview: body.substring(0, 500),
      body_html: bodyType === 'html' ? body : null,
      body_text: bodyType === 'text' ? body : null,
      direction: 'outbound',
      status: 'sent',
      sent_via_outlook: true,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const { data: savedEmail, error: emailError } = await supabaseClient
      .from('emails')
      .insert(emailRecord)
      .select()
      .single();

    if (emailError) {
      console.error('Failed to log email:', emailError);
      // Don't throw - email was sent successfully
    }

    // Log activity if lead_id was provided
    if (leadId) {
      await supabaseClient
        .from('lead_activity_logs')
        .insert({
          tenant_id: tenantUser?.tenant_id,
          lead_id: leadId,
          user_id: user.id,
          action_type: 'email_sent',
          action_category: 'communication',
          description: `Email sent: ${subject}`,
          new_value: JSON.stringify({ to, subject, sentViaOutlook: true }),
        });

      // Also log to lead_communications for timeline
      await supabaseClient
        .from('lead_communications')
        .insert({
          tenant_id: tenantUser?.tenant_id,
          lead_id: leadId,
          user_id: user.id,
          type: 'email',
          direction: 'outbound',
          subject,
          content: body.substring(0, 1000),
          status: 'sent',
          channel: 'outlook',
        });
    }

    console.log('Email sent successfully via Outlook for user:', user.id, 'to:', to.join(', '));

    return new Response(
      JSON.stringify({
        success: true,
        emailId: savedEmail?.id,
        sentFrom: senderEmail,
        sentAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in outlook-send-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
