import { Resend } from 'npm:resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendLeadEmailRequest {
  leadId: string
  leadEmail: string
  leadName: string
  emailType: 'nurture' | 'follow_up' | 'program_info' | 'ai_generated' | 'reengagement' | 'discovery'
  subject: string
  content: string
  programInterest?: string[]
  metadata?: any
}

const getEmailTemplate = (type: string, leadName: string, content: string, programInterest?: string[]) => {
  const programText = programInterest && programInterest.length > 0 
    ? `<p>Based on your interest in <strong>${programInterest.join(', ')}</strong>, we'd love to help you explore your options.</p>`
    : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Learnlynk</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Connecting You to Your Educational Future</p>
      </div>
      
      <div style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 8px 8px;">
        <h2 style="color: #334155; margin: 0 0 20px 0;">Hello ${leadName},</h2>
        
        ${programText}
        
        <div style="margin: 20px 0; line-height: 1.6; color: #475569;">
          ${content}
        </div>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #e0e7ff; border-radius: 8px; border-left: 4px solid #667eea;">
          <p style="margin: 0; color: #374151; font-weight: 500;">
            Ready to take the next step? Our education advisors are here to help you navigate your options and find the perfect program for your goals.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://calendly.com/learnlynk" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Schedule a Call
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <div style="text-align: center;">
          <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
            Best regards,<br>
            <strong>The Learnlynk Team</strong>
          </p>
          
          <div style="margin: 20px 0;">
            <a href="mailto:support@learnlynk.com" style="color: #667eea; text-decoration: none; margin: 0 10px;">support@learnlynk.com</a>
            <span style="color: #cbd5e1;">|</span>
            <a href="https://learnlynk.com" style="color: #667eea; text-decoration: none; margin: 0 10px;">learnlynk.com</a>
          </div>
          
          <p style="color: #94a3b8; font-size: 12px; margin: 20px 0 0 0;">
            You're receiving this email because you expressed interest in educational programs through Learnlynk.
            <br>
            <a href="#" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </div>
  `;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    console.log("Send lead email function called")
    
    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found")
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      )
    }

    const { 
      leadId, 
      leadEmail, 
      leadName, 
      emailType, 
      subject, 
      content, 
      programInterest,
      metadata 
    }: SendLeadEmailRequest = await req.json()

    console.log("Sending email to lead:", leadEmail, "Type:", emailType)

    // Validate required fields
    if (!leadEmail || !leadEmail.trim()) {
      console.error("Lead email is missing or empty")
      return new Response(
        JSON.stringify({ error: "Lead email address is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      )
    }

    if (!leadName || !leadName.trim()) {
      console.error("Lead name is missing or empty")
      return new Response(
        JSON.stringify({ error: "Lead name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      )
    }

    // Generate professional HTML template
    const html = getEmailTemplate(emailType, leadName, content, programInterest)
    console.log("Email template generated successfully")

    const { data, error } = await resend.emails.send({
      from: 'Learnlynk <hello@learnlynk.com>', // Update with your verified domain
      to: leadEmail, // Remove array wrapper - Resend expects string not array
      subject,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      throw error
    }

    console.log("Lead email sent successfully:", data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data?.id,
        leadId,
        emailType,
        sentAt: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  } catch (error) {
    console.error("Error in send-lead-email function:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send lead email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  }
})