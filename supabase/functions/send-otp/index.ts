import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || Deno.env.get("RESEND"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Send OTP function called, method:", req.method);
  console.log("RESEND_API_KEY configured:", !!Deno.env.get("RESEND_API_KEY"));

  try {
    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || Deno.env.get("RESEND");
    console.log("Checking RESEND_API_KEY:", !!Deno.env.get("RESEND_API_KEY"));
    console.log("Checking RESEND:", !!Deno.env.get("RESEND"));
    
    if (!resendApiKey) {
      console.error("Neither RESEND_API_KEY nor RESEND environment variable found");
      return new Response(
        JSON.stringify({ error: "Email service not configured - no API key found" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email, name }: SendOTPRequest = await req.json();
    console.log("Attempting to send OTP to:", email);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);
    
    const emailResponse = await resend.emails.send({
      from: "Learnlynk <onboarding@resend.dev>", // Using Resend's verified domain
      to: [email],
      subject: "Verify Your Email - EduCRM",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Email Verification</h1>
          <p>Hello ${name || 'there'},</p>
          <p>Welcome to EduCRM! Please use the verification code below to verify your email address:</p>
          
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h2 style="color: #2563eb; font-size: 32px; letter-spacing: 4px; margin: 0;">${otp}</h2>
          </div>
          
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create an account with EduCRM, please ignore this email.</p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px; text-align: center;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      otp: otp, // In production, don't return OTP in response
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);