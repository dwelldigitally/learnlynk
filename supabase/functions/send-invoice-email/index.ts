import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-INVOICE-EMAIL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { payment_id, template_id } = await req.json();
    logStep("Request parsed", { payment_id, template_id });

    // Fetch payment with lead data
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .select(`
        *,
        leads (
          first_name,
          last_name,
          email,
          program_interest
        )
      `)
      .eq('id', payment_id)
      .single();

    if (paymentError || !payment) {
      throw new Error("Payment not found");
    }
    logStep("Payment fetched", { paymentId: payment.id });

    // Fetch template
    const { data: template, error: templateError } = await supabaseClient
      .from('invoice_templates')
      .select('*')
      .eq('id', template_id || (await supabaseClient
        .from('invoice_templates')
        .select('id')
        .eq('is_default', true)
        .single()).data?.id)
      .single();

    if (templateError || !template) {
      throw new Error("Template not found");
    }
    logStep("Template fetched", { templateId: template.id });

    // Generate payment link (this should point to a payment page in your app)
    const paymentLink = `${req.headers.get("origin")}/pay/${payment.id}`;

    // Replace template variables
    const studentName = `${payment.leads.first_name} ${payment.leads.last_name}`;
    const programName = payment.leads.program_interest?.[0] || 'our program';
    const dueDate = payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'ASAP';
    
    let emailBody = template.body_html
      .replace(/{{student_name}}/g, studentName)
      .replace(/{{program_name}}/g, programName)
      .replace(/{{amount}}/g, payment.amount.toString())
      .replace(/{{currency}}/g, payment.currency)
      .replace(/{{due_date}}/g, dueDate)
      .replace(/{{payment_link}}/g, paymentLink);

    let emailSubject = template.subject_line
      .replace(/{{student_name}}/g, studentName)
      .replace(/{{program_name}}/g, programName);

    // Send email via Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const emailResponse = await resend.emails.send({
      from: "Lovable <onboarding@resend.dev>",
      to: [payment.leads.email],
      subject: emailSubject,
      html: emailBody,
    });

    logStep("Email sent", { emailId: emailResponse.id });

    // Update payment status
    await supabaseClient
      .from('payments')
      .update({
        status: 'invoice_sent',
        invoice_sent_at: new Date().toISOString(),
        invoice_template_id: template.id
      })
      .eq('id', payment_id);

    // Create transaction record
    await supabaseClient
      .from('payment_transactions')
      .insert({
        payment_id: payment_id,
        transaction_type: 'invoice_sent',
        status: 'success',
        metadata: {
          template_id: template.id,
          email_id: emailResponse.id
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invoice sent successfully',
        email_sent_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
