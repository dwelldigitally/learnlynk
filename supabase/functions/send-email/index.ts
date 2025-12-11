import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: string;
    contentType?: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      to, 
      subject, 
      html, 
      text,
      fromName = "Notifications",
      fromEmail = "onboarding@resend.dev",
      replyTo,
      cc,
      bcc,
      attachments
    }: EmailRequest = await req.json();

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending email to ${Array.isArray(to) ? to.join(', ') : to}: ${subject}`);

    const emailPayload: any = {
      from: `${fromName} <${fromEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
    };

    // Add optional fields
    if (text) emailPayload.text = text;
    if (replyTo) emailPayload.reply_to = replyTo;
    if (cc && cc.length > 0) emailPayload.cc = cc;
    if (bcc && bcc.length > 0) emailPayload.bcc = bcc;
    if (attachments && attachments.length > 0) {
      emailPayload.attachments = attachments.map(att => ({
        filename: att.filename,
        content: att.content,
        content_type: att.contentType
      }));
    }

    const emailResponse = await resend.emails.send(emailPayload);

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
