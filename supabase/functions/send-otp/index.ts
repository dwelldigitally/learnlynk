import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Temporarily disable Resend to fix build issues
// import { Resend } from "npm:resend@2.0.0";
// const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  name?: string;
}

// Helper function to hash OTP
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper function to check rate limits
async function checkRateLimit(email: string, ipAddress: string): Promise<{ allowed: boolean; error?: string }> {
  const now = new Date();
  const oneHour = new Date(now.getTime() - 60 * 60 * 1000);
  const oneMinute = new Date(now.getTime() - 60 * 1000);

  // Check email rate limit (5 per hour)
  const { data: emailLimits } = await supabase
    .from('otp_rate_limits')
    .select('attempts')
    .eq('identifier', email)
    .eq('limit_type', 'email')
    .gte('window_start', oneHour.toISOString())
    .single();

  if (emailLimits && emailLimits.attempts >= 5) {
    return { allowed: false, error: "Too many OTP requests for this email. Please try again in an hour." };
  }

  // Check IP rate limit (10 per hour)
  const { data: ipLimits } = await supabase
    .from('otp_rate_limits')
    .select('attempts')
    .eq('identifier', ipAddress)
    .eq('limit_type', 'ip')
    .gte('window_start', oneHour.toISOString())
    .single();

  if (ipLimits && ipLimits.attempts >= 10) {
    return { allowed: false, error: "Too many OTP requests from this IP. Please try again in an hour." };
  }

  return { allowed: true };
}

// Helper function to update rate limits
async function updateRateLimit(identifier: string, limitType: string) {
  const oneHour = new Date(Date.now() - 60 * 60 * 1000);
  
  // Check if there's an existing rate limit entry in the current window
  const { data: existing } = await supabase
    .from('otp_rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('limit_type', limitType)
    .gte('window_start', oneHour.toISOString())
    .single();

  if (existing) {
    // Update existing entry
    await supabase
      .from('otp_rate_limits')
      .update({ attempts: existing.attempts + 1 })
      .eq('id', existing.id);
  } else {
    // Create new entry
    await supabase
      .from('otp_rate_limits')
      .insert({
        identifier,
        limit_type: limitType,
        attempts: 1,
        window_start: new Date().toISOString()
      });
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Send OTP function called - v2.0 with secure database storage");

  try {
    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable not found");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email, name }: SendOTPRequest = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    console.log("Attempting to send OTP to:", email);

    // Check rate limits
    const rateLimitResult = await checkRateLimit(email, ipAddress);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: rateLimitResult.error }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update rate limits
    await updateRateLimit(email, 'email');
    await updateRateLimit(ipAddress, 'ip');

    // Clean up old OTPs for this email
    await supabase
      .from('otp_verifications')
      .delete()
      .eq('email', email);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await hashOTP(otp);

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('otp_verifications')
      .insert({
        email,
        otp_hash: otpHash,
        ip_address: ipAddress,
        user_agent: userAgent
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to store OTP" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Temporarily disabled email sending to fix build issues
    console.log("OTP function temporarily disabled for build stability");
    
    return new Response(JSON.stringify({ 
      error: "OTP email service temporarily disabled for build stability",
      message: "Please contact support for email verification"
    }), {
      status: 503,
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