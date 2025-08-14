import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'

// Simple HTML template instead of React Email for now
const createOTPEmailHTML = (otp: string, name?: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; text-align: center;">Email Verification</h1>
      <p>Hello ${name || 'there'},</p>
      <p>Welcome to Learnlynk! Please use the verification code below to verify your email address:</p>
      
      <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
        <h2 style="color: #2563eb; font-size: 32px; letter-spacing: 4px; margin: 0;">${otp}</h2>
      </div>
      
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't create an account with Learnlynk, please ignore this email.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px; text-align: center;">
        This is an automated message, please do not reply to this email.
      </p>
    </div>
  `;
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendEmailRequest {
  to: string
  subject: string
  otp: string
  name?: string
}

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
    console.log("Send email function called")
    
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

    const { to, subject, otp, name }: SendEmailRequest = await req.json()
    console.log("Sending email to:", to, "with OTP:", otp)

    // Use simple HTML template instead of React Email
    const html = createOTPEmailHTML(otp, name)
    console.log("HTML template created successfully")

    const { data, error } = await resend.emails.send({
      from: 'Learnlynk <onboarding@resend.dev>', // Using Resend's verified domain temporarily
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      throw error
    }

    console.log("Email sent successfully:", data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data?.id,
        otp: otp // For testing purposes
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  } catch (error) {
    console.error("Error in send-email function:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  }
})