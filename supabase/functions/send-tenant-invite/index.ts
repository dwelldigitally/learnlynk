import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  tenantId: string;
  tenantName: string;
  inviterName: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { email, role, tenantId, tenantName, inviterName }: InviteRequest = await req.json();

    // Validate input
    if (!email || !role || !tenantId) {
      throw new Error("Missing required fields");
    }

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabase
      .from("tenant_invitations")
      .insert({
        tenant_id: tenantId,
        email: email.toLowerCase(),
        role,
        created_by: user.id,
      })
      .select()
      .single();

    if (inviteError) {
      throw new Error(`Failed to create invitation: ${inviteError.message}`);
    }

    // Build signup URL with invitation token
    const baseUrl = req.headers.get("origin") || "https://learnlynk.app";
    const signupUrl = `${baseUrl}/sign-up?tenant_invite=${invitation.token}`;

    // Role descriptions
    const roleDescriptions: Record<string, string> = {
      admin: "Full administrative access to manage the institution",
      member: "Standard access to view and manage assigned areas",
      viewer: "Read-only access to view institution data",
    };

    // Send invitation email via Resend
    const resend = new Resend(resendApiKey);
    
    const { error: emailError } = await resend.emails.send({
      from: "Learnlynk <noreply@learnlynk.app>",
      to: [email],
      subject: `You're invited to join ${tenantName} on Learnlynk`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7c3aed; margin: 0;">Learnlynk</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-radius: 12px; padding: 30px; margin-bottom: 20px;">
            <h2 style="margin-top: 0; color: #5b21b6;">You're Invited! 🎉</h2>
            <p><strong>${inviterName}</strong> has invited you to join <strong>${tenantName}</strong> on Learnlynk.</p>
            
            <div style="background: white; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Your Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">${roleDescriptions[role]}</p>
            </div>
            
            <a href="${signupUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 10px;">
              Accept Invitation
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Learnlynk. All rights reserved.
          </p>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't fail the whole operation if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        invitation: { 
          id: invitation.id, 
          email: invitation.email,
          role: invitation.role 
        } 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-tenant-invite:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
