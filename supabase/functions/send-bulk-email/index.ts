import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Recipient {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  program_interest?: string[];
}

interface BulkEmailRequest {
  recipients: Recipient[];
  subject: string;
  content: string;
  html_content?: string;
  from_name?: string;
  from_email?: string;
  template_id?: string;
  user_id: string;
}

interface EmailResult {
  recipient_id: string;
  email: string;
  success: boolean;
  error?: string;
  message_id?: string;
}

// Replace template variables with actual lead data
function personalizeContent(content: string, recipient: Recipient): string {
  let personalized = content;
  
  const variables: Record<string, string> = {
    '{{first_name}}': recipient.first_name || '',
    '{{last_name}}': recipient.last_name || '',
    '{{email}}': recipient.email || '',
    '{{phone}}': recipient.phone || '',
    '{{company}}': recipient.company || '',
    '{{program_interest}}': recipient.program_interest?.join(', ') || '',
    '{{lead_name}}': `${recipient.first_name || ''} ${recipient.last_name || ''}`.trim(),
    '{{lead_email}}': recipient.email || '',
    '{{today}}': new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
  };
  
  for (const [key, value] of Object.entries(variables)) {
    personalized = personalized.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  
  return personalized;
}

// Process emails in batches to avoid rate limits
async function processBatch(
  batch: Recipient[],
  subject: string,
  content: string,
  htmlContent: string | undefined,
  fromName: string,
  fromEmail: string
): Promise<EmailResult[]> {
  const results: EmailResult[] = [];
  
  // Resend allows batch sending up to 100 emails
  const emails = batch.map(recipient => ({
    from: `${fromName} <${fromEmail}>`,
    to: [recipient.email],
    subject: personalizeContent(subject, recipient),
    html: htmlContent ? personalizeContent(htmlContent, recipient) : undefined,
    text: personalizeContent(content, recipient),
  }));

  try {
    // Use Resend batch API for efficiency
    const batchResponse = await resend.batch.send(emails);
    
    if (batchResponse.error) {
      console.error("Batch send error:", batchResponse.error);
      // Mark all as failed
      batch.forEach(recipient => {
        results.push({
          recipient_id: recipient.id,
          email: recipient.email,
          success: false,
          error: batchResponse.error?.message || 'Batch send failed',
        });
      });
    } else if (batchResponse.data) {
      // Process batch results
      batchResponse.data.forEach((result, index) => {
        const recipient = batch[index];
        if (result.id) {
          results.push({
            recipient_id: recipient.id,
            email: recipient.email,
            success: true,
            message_id: result.id,
          });
        } else {
          results.push({
            recipient_id: recipient.id,
            email: recipient.email,
            success: false,
            error: 'No message ID returned',
          });
        }
      });
    }
  } catch (error) {
    console.error("Batch processing error:", error);
    // Fall back to individual sending
    for (const recipient of batch) {
      try {
        const response = await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: [recipient.email],
          subject: personalizeContent(subject, recipient),
          html: htmlContent ? personalizeContent(htmlContent, recipient) : undefined,
          text: personalizeContent(content, recipient),
        });
        
        if (response.error) {
          results.push({
            recipient_id: recipient.id,
            email: recipient.email,
            success: false,
            error: response.error.message,
          });
        } else {
          results.push({
            recipient_id: recipient.id,
            email: recipient.email,
            success: true,
            message_id: response.data?.id,
          });
        }
      } catch (err) {
        results.push({
          recipient_id: recipient.id,
          email: recipient.email,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
      
      // Small delay between individual sends to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      recipients,
      subject,
      content,
      html_content,
      from_name = "Admissions Team",
      from_email = "onboarding@resend.dev",
      template_id,
      user_id,
    }: BulkEmailRequest = await req.json();

    // Validate input
    if (!recipients || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No recipients provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!subject || !content) {
      return new Response(
        JSON.stringify({ error: "Subject and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Starting bulk email send to ${recipients.length} recipients`);

    // Process in batches of 50 (safe limit for Resend)
    const BATCH_SIZE = 50;
    const allResults: EmailResult[] = [];
    const totalBatches = Math.ceil(recipients.length / BATCH_SIZE);

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      console.log(`Processing batch ${batchNumber}/${totalBatches}`);
      
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const batchResults = await processBatch(
        batch,
        subject,
        content,
        html_content,
        from_name,
        from_email
      );
      allResults.push(...batchResults);
      
      // Delay between batches to respect rate limits
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Calculate summary
    const successCount = allResults.filter(r => r.success).length;
    const failureCount = allResults.filter(r => !r.success).length;

    console.log(`Bulk email complete: ${successCount} sent, ${failureCount} failed`);

    // Log communications to database (fire and forget)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Log successful sends as lead communications
    const successfulSends = allResults.filter(r => r.success);
    if (successfulSends.length > 0) {
      const communicationLogs = successfulSends.map(result => ({
        lead_id: result.recipient_id,
        user_id: user_id,
        type: 'email',
        direction: 'outbound',
        subject: subject,
        content: content.substring(0, 1000), // Truncate for storage
        communication_date: new Date().toISOString(),
        status: 'completed',
        metadata: {
          bulk_send: true,
          message_id: result.message_id,
          template_id: template_id,
        },
      }));

      const { error: logError } = await supabase
        .from('lead_communications')
        .insert(communicationLogs);

      if (logError) {
        console.error('Error logging communications:', logError);
      }
    }

    // Increment template usage if template was used
    if (template_id) {
      await supabase
        .from('communication_templates')
        .update({ usage_count: supabase.rpc('increment_usage_count') })
        .eq('id', template_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total: recipients.length,
          sent: successCount,
          failed: failureCount,
        },
        results: allResults,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-bulk-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
