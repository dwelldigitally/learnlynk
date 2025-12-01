import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  first_name: string;
  last_name?: string;
  email: string;
  role: string;
  personal_message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get JWT token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decode JWT to get user ID (JWT verification is handled by Supabase)
    const token = authHeader.replace("Bearer ", "");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", userId);

    // Create admin client with service role for database operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse request body
    const { first_name, last_name, email, role, personal_message } = await req.json() as InviteRequest;

    console.log(`Creating invitation for ${first_name} ${last_name || ''} (${email}) with role ${role}`);

    // Validate input
    if (!first_name || !email || !role) {
      return new Response(
        JSON.stringify({ error: 'First name, email, and role are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validRoles = ['admin', 'team_lead', 'advisor', 'finance_officer', 'registrar', 'viewer'];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User already exists with this email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get inviter's name
    const { data: inviterProfile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('user_id', userId)
      .single();

    const inviterName = inviterProfile?.full_name || inviterProfile?.email || 'Team Administrator';

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('team_invitations')
      .insert({
        first_name,
        last_name,
        email,
        role,
        invited_by: userId,
        personal_message,
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating invitation:', inviteError);
      return new Response(
        JSON.stringify({ error: "Failed to create invitation" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const appUrl = Deno.env.get("APP_URL") || "http://localhost:5173";
    const inviteUrl = `${appUrl}/?invite=${invitation.invite_token}`;

    // Role descriptions
    const roleDescriptions: Record<string, string> = {
      admin: "Full system access with ability to manage all settings, users, and data",
      team_lead: "Manage team members, leads, and view team reports",
      advisor: "Manage leads and students, view team reports",
      finance_officer: "Manage payments, process refunds, and view financial data",
      registrar: "Manage student records and academic information",
      viewer: "View-only access to leads, students, and team reports"
    };

    // Send invitation email
    const fullName = `${first_name}${last_name ? ' ' + last_name : ''}`;
    
    const emailResponse = await resend.emails.send({
      from: "Team Invitation <onboarding@resend.dev>",
      to: [email],
      subject: `${first_name}, you've been invited to join ${inviterName}'s team!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Hi ${first_name}!</h1>
          
          <p style="font-size: 16px; color: #555;">
            ${inviterName} has invited you to join their team with the role of <strong>${role.replace('_', ' ')}</strong>.
          </p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Role Permissions:</h3>
            <p style="color: #666; margin-bottom: 0;">${roleDescriptions[role]}</p>
          </div>
          
          ${personal_message ? `
            <div style="border-left: 4px solid #6366f1; padding-left: 15px; margin: 20px 0;">
              <p style="font-style: italic; color: #666;">"${personal_message}"</p>
              <p style="color: #999; font-size: 14px; margin-bottom: 0;">- ${inviterName}</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" 
               style="background: #6366f1; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;
                      font-weight: bold;">
              Accept Invitation & Sign Up
            </a>
          </div>
          
          <p style="font-size: 14px; color: #999; text-align: center;">
            This invitation expires in 7 days.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Invitation email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        invitation_id: invitation.id,
        message: "Invitation sent successfully"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-team-invite function:", error);
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
