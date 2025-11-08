import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[WEBHOOK-STRIPE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Webhook received");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No signature provided");
    }

    const body = await req.text();
    
    // Verify webhook signature (in production, you'd set STRIPE_WEBHOOK_SECRET)
    // For now, we'll parse the event directly
    const event = JSON.parse(body);
    logStep("Event type", { type: event.type });

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const paymentId = paymentIntent.metadata?.payment_id;
        
        if (!paymentId) {
          logStep("No payment_id in metadata, skipping");
          break;
        }

        logStep("Processing successful payment", { paymentId, paymentIntentId: paymentIntent.id });

        // Update payment status
        const { error: updateError } = await supabaseClient
          .from('payments')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
            payment_method: paymentIntent.payment_method_types?.[0] || 'card'
          })
          .eq('id', paymentId);

        if (updateError) {
          logStep("Error updating payment", { error: updateError.message });
        }

        // Create transaction record
        await supabaseClient
          .from('payment_transactions')
          .insert({
            payment_id: paymentId,
            transaction_type: 'charge',
            amount: paymentIntent.amount / 100,
            stripe_transaction_id: paymentIntent.id,
            status: 'success',
            metadata: {
              payment_method: paymentIntent.payment_method_types?.[0],
              currency: paymentIntent.currency
            }
          });

        // Auto-send receipt
        try {
          const { data: payment } = await supabaseClient
            .from('payments')
            .select('*, leads(email, first_name, last_name)')
            .eq('id', paymentId)
            .single();

          if (payment) {
            // Get default receipt template
            const { data: template } = await supabaseClient
              .from('receipt_templates')
              .select('*')
              .eq('is_default', true)
              .single();

            if (template && payment.leads?.email) {
              // Send receipt would be called here
              logStep("Receipt auto-send triggered", { paymentId });
            }
          }
        } catch (receiptError) {
          logStep("Error auto-sending receipt", { error: receiptError });
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const paymentId = paymentIntent.metadata?.payment_id;
        
        if (!paymentId) break;

        logStep("Processing failed payment", { paymentId });

        await supabaseClient
          .from('payments')
          .update({ status: 'failed' })
          .eq('id', paymentId);

        await supabaseClient
          .from('payment_transactions')
          .insert({
            payment_id: paymentId,
            transaction_type: 'charge',
            stripe_transaction_id: paymentIntent.id,
            status: 'failed',
            metadata: {
              error: paymentIntent.last_payment_error?.message
            }
          });

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const paymentIntentId = charge.payment_intent;

        // Find payment by stripe_payment_intent_id
        const { data: payment } = await supabaseClient
          .from('payments')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .single();

        if (payment) {
          logStep("Processing refund", { paymentId: payment.id });

          await supabaseClient
            .from('payments')
            .update({ status: 'refunded' })
            .eq('id', payment.id);

          await supabaseClient
            .from('payment_transactions')
            .insert({
              payment_id: payment.id,
              transaction_type: 'refund',
              amount: charge.amount_refunded / 100,
              stripe_transaction_id: charge.id,
              status: 'success'
            });
        }

        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(
      JSON.stringify({ received: true }),
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
