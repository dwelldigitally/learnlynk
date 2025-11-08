import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-RECEIPT-EMAIL] ${step}${detailsStr}`);
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
          email
        )
      `)
      .eq('id', payment_id)
      .single();

    if (paymentError || !payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== 'paid') {
      throw new Error("Payment must be paid before sending receipt");
    }
    logStep("Payment fetched and verified", { paymentId: payment.id, status: payment.status });

    // Fetch template
    const { data: template, error: templateError } = await supabaseClient
      .from('receipt_templates')
      .select('*')
      .eq('id', template_id || (await supabaseClient
        .from('receipt_templates')
        .select('id')
        .eq('is_default', true)
        .single()).data?.id)
      .single();

    if (templateError || !template) {
      throw new Error("Template not found");
    }
    logStep("Template fetched", { templateId: template.id });

    // Replace template variables
    const studentName = `${payment.leads.first_name} ${payment.leads.last_name}`;
    const paymentDate = payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : new Date().toLocaleDateString();
    
    let emailBody = template.body_html
      .replace(/{{student_name}}/g, studentName)
      .replace(/{{amount}}/g, payment.amount.toString())
      .replace(/{{currency}}/g, payment.currency)
      .replace(/{{transaction_id}}/g, payment.stripe_payment_intent_id || payment.id)
      .replace(/{{payment_date}}/g, paymentDate)
      .replace(/{{payment_method}}/g, payment.payment_method || 'Card');

    // Send email via Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const emailResponse = await resend.emails.send({
      from: "Lovable <onboarding@resend.dev>",
      to: [payment.leads.email],
      subject: "Payment Receipt",
      html: emailBody,
    });

    logStep("Receipt email sent", { emailId: emailResponse.id });

    // Create transaction record
    await supabaseClient
      .from('payment_transactions')
      .insert({
        payment_id: payment_id,
        transaction_type: 'charge',
        amount: payment.amount,
        status: 'success',
        metadata: {
          template_id: template.id,
          email_id: emailResponse.id,
          receipt_sent: true
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Receipt sent successfully',
        receipt_sent_at: new Date().toISOString()
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
