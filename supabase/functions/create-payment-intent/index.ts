import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT-INTENT] ${step}${detailsStr}`);
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
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { lead_id, amount, currency, payment_type, notes } = await req.json();
    logStep("Request body parsed", { lead_id, amount, currency, payment_type });

    // Validate currency
    if (!['USD', 'CAD'].includes(currency)) {
      throw new Error("Currency must be USD or CAD");
    }

    // Verify lead exists and belongs to user
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('id, first_name, last_name, email')
      .eq('id', lead_id)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      throw new Error("Lead not found or access denied");
    }
    logStep("Lead verified", { leadId: lead.id, leadEmail: lead.email });

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        lead_id,
        amount,
        currency,
        payment_type,
        status: 'pending',
        notes
      })
      .select()
      .single();

    if (paymentError) throw new Error(`Failed to create payment: ${paymentError.message}`);
    logStep("Payment record created", { paymentId: payment.id });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: lead.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: lead.email,
        name: `${lead.first_name} ${lead.last_name}`,
        metadata: {
          lead_id: lead_id,
          user_id: user.id
        }
      });
      customerId = customer.id;
      logStep("New Stripe customer created", { customerId });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: customerId,
      metadata: {
        payment_id: payment.id,
        lead_id: lead_id,
        payment_type
      },
      description: `${payment_type.replace('_', ' ')} for ${lead.first_name} ${lead.last_name}`
    });

    logStep("Stripe payment intent created", { paymentIntentId: paymentIntent.id });

    // Update payment record with Stripe payment intent ID
    await supabaseClient
      .from('payments')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', payment.id);

    return new Response(
      JSON.stringify({
        payment_id: payment.id,
        client_secret: paymentIntent.client_secret,
        status: 'success'
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
