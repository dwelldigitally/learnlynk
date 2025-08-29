import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

// Helper function to hash OTP
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Verify OTP function called");

  try {
    const { email, otp }: VerifyOTPRequest = await req.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: "Email and OTP are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Clean up expired OTPs first
    await supabase.rpc('cleanup_expired_otps');

    // Find valid OTP record
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (fetchError || !otpRecord) {
      console.log("No valid OTP found for email:", email);
      return new Response(
        JSON.stringify({ 
          error: "Invalid or expired OTP. Please request a new code.",
          code: "OTP_NOT_FOUND"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      console.log("Max attempts exceeded for email:", email);
      return new Response(
        JSON.stringify({ 
          error: "Maximum verification attempts exceeded. Please request a new code.",
          code: "MAX_ATTEMPTS_EXCEEDED"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Hash the provided OTP and compare
    const otpHash = await hashOTP(otp);
    const isValidOTP = otpHash === otpRecord.otp_hash;

    if (!isValidOTP) {
      // Increment attempts
      const newAttempts = otpRecord.attempts + 1;
      await supabase
        .from('otp_verifications')
        .update({ attempts: newAttempts })
        .eq('id', otpRecord.id);

      const remainingAttempts = otpRecord.max_attempts - newAttempts;
      
      console.log(`Invalid OTP attempt ${newAttempts} for email:`, email);
      
      return new Response(
        JSON.stringify({ 
          error: remainingAttempts > 0 
            ? `Invalid OTP. ${remainingAttempts} attempts remaining.`
            : "Invalid OTP. Maximum attempts exceeded. Please request a new code.",
          code: "INVALID_OTP",
          remainingAttempts: Math.max(0, remainingAttempts)
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // OTP is valid - mark as verified
    await supabase
      .from('otp_verifications')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', otpRecord.id);

    console.log("OTP verified successfully for email:", email);

    return new Response(JSON.stringify({ 
      success: true,
      message: "OTP verified successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);