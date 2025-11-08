import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-STRIPE-DATA] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let syncLogId: string | null = null;

  try {
    logStep("Function started");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: { persistSession: false }
    });

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Parse request body
    const { sync_type = 'full', auto = false } = await req.json().catch(() => ({}));
    logStep("Request parsed", { sync_type, auto });

    // Create sync log record
    const { data: syncLog, error: logError } = await supabaseClient
      .from('stripe_sync_log')
      .insert({
        user_id: user.id,
        sync_type: auto ? 'auto' : sync_type,
        status: 'in_progress'
      })
      .select()
      .single();

    if (logError) throw new Error(`Failed to create sync log: ${logError.message}`);
    syncLogId = syncLog.id;
    logStep("Sync log created", { syncLogId });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const recordsSynced: any = {};
    let customersMatched = 0;

    // Sync Customers
    if (sync_type === 'full' || sync_type === 'customers') {
      logStep("Syncing customers");
      let hasMore = true;
      let startingAfter: string | undefined;
      let customerCount = 0;

      while (hasMore) {
        const customers = await stripe.customers.list({
          limit: 100,
          starting_after: startingAfter
        });

        for (const customer of customers.data) {
          // Upsert customer
          const { error: custError } = await supabaseClient
            .from('stripe_customers')
            .upsert({
              id: customer.id,
              email: customer.email || '',
              name: customer.name,
              phone: customer.phone,
              description: customer.description,
              currency: customer.currency,
              balance: customer.balance,
              delinquent: customer.delinquent,
              created: new Date(customer.created * 1000).toISOString(),
              metadata: customer.metadata,
              synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: user.id
            }, { onConflict: 'id' });

          if (custError) {
            logStep("Error upserting customer", { error: custError.message, customerId: customer.id });
            continue;
          }

          // Auto-match to lead by email
          if (customer.email) {
            const { data: matchedLead } = await supabaseClient
              .from('leads')
              .select('id')
              .eq('email', customer.email)
              .eq('user_id', user.id)
              .limit(1)
              .single();

            if (matchedLead) {
              await supabaseClient
                .from('stripe_customers')
                .update({ lead_id: matchedLead.id })
                .eq('id', customer.id);
              
              customersMatched++;
              logStep("Customer matched to lead", { customerId: customer.id, leadId: matchedLead.id });
            }
          }

          customerCount++;
        }

        hasMore = customers.has_more;
        if (hasMore && customers.data.length > 0) {
          startingAfter = customers.data[customers.data.length - 1].id;
        }
      }

      recordsSynced.customers = customerCount;
      logStep("Customers synced", { count: customerCount, matched: customersMatched });
    }

    // Sync Products
    if (sync_type === 'full' || sync_type === 'products') {
      logStep("Syncing products");
      let hasMore = true;
      let startingAfter: string | undefined;
      let productCount = 0;

      while (hasMore) {
        const products = await stripe.products.list({
          limit: 100,
          starting_after: startingAfter
        });

        for (const product of products.data) {
          const { error: prodError } = await supabaseClient
            .from('stripe_products')
            .upsert({
              id: product.id,
              name: product.name,
              description: product.description,
              active: product.active,
              default_price_id: typeof product.default_price === 'string' ? product.default_price : null,
              images: product.images,
              metadata: product.metadata,
              created: new Date(product.created * 1000).toISOString(),
              synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: user.id
            }, { onConflict: 'id' });

          if (prodError) {
            logStep("Error upserting product", { error: prodError.message, productId: product.id });
            continue;
          }

          productCount++;
        }

        hasMore = products.has_more;
        if (hasMore && products.data.length > 0) {
          startingAfter = products.data[products.data.length - 1].id;
        }
      }

      recordsSynced.products = productCount;
      logStep("Products synced", { count: productCount });

      // Sync Prices
      logStep("Syncing prices");
      hasMore = true;
      startingAfter = undefined;
      let priceCount = 0;

      while (hasMore) {
        const prices = await stripe.prices.list({
          limit: 100,
          starting_after: startingAfter
        });

        for (const price of prices.data) {
          const { error: priceError } = await supabaseClient
            .from('stripe_prices')
            .upsert({
              id: price.id,
              product_id: typeof price.product === 'string' ? price.product : null,
              active: price.active,
              currency: price.currency,
              unit_amount: price.unit_amount,
              recurring_interval: price.recurring?.interval,
              recurring_interval_count: price.recurring?.interval_count,
              type: price.type,
              metadata: price.metadata,
              created: new Date(price.created * 1000).toISOString(),
              synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: user.id
            }, { onConflict: 'id' });

          if (priceError) {
            logStep("Error upserting price", { error: priceError.message, priceId: price.id });
            continue;
          }

          priceCount++;
        }

        hasMore = prices.has_more;
        if (hasMore && prices.data.length > 0) {
          startingAfter = prices.data[prices.data.length - 1].id;
        }
      }

      recordsSynced.prices = priceCount;
      logStep("Prices synced", { count: priceCount });
    }

    // Sync Payment Intents
    if (sync_type === 'full' || sync_type === 'payments') {
      logStep("Syncing payment intents");
      let hasMore = true;
      let startingAfter: string | undefined;
      let paymentCount = 0;

      while (hasMore) {
        const paymentIntents = await stripe.paymentIntents.list({
          limit: 100,
          starting_after: startingAfter
        });

        for (const payment of paymentIntents.data) {
          const { error: payError } = await supabaseClient
            .from('stripe_payment_intents')
            .upsert({
              id: payment.id,
              customer_id: typeof payment.customer === 'string' ? payment.customer : null,
              amount: payment.amount,
              currency: payment.currency,
              status: payment.status,
              payment_method: typeof payment.payment_method === 'string' ? payment.payment_method : null,
              description: payment.description,
              receipt_email: payment.receipt_email,
              created: new Date(payment.created * 1000).toISOString(),
              metadata: payment.metadata,
              synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: user.id
            }, { onConflict: 'id' });

          if (payError) {
            logStep("Error upserting payment", { error: payError.message, paymentId: payment.id });
            continue;
          }

          paymentCount++;
        }

        hasMore = paymentIntents.has_more;
        if (hasMore && paymentIntents.data.length > 0) {
          startingAfter = paymentIntents.data[paymentIntents.data.length - 1].id;
        }
      }

      recordsSynced.payments = paymentCount;
      logStep("Payments synced", { count: paymentCount });
    }

    // Update sync log to completed
    const duration = Date.now() - startTime;
    await supabaseClient
      .from('stripe_sync_log')
      .update({
        status: 'completed',
        records_synced: recordsSynced,
        customers_matched: customersMatched,
        completed_at: new Date().toISOString(),
        duration_ms: duration
      })
      .eq('id', syncLogId);

    logStep("Sync completed successfully", { duration, recordsSynced, customersMatched });

    return new Response(JSON.stringify({
      success: true,
      sync_id: syncLogId,
      records_synced: recordsSynced,
      customers_matched: customersMatched,
      duration_ms: duration
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const duration = Date.now() - startTime;
    logStep("ERROR", { message: errorMessage });

    // Update sync log to failed
    if (syncLogId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      const supabaseClient = createClient(supabaseUrl!, supabaseServiceKey!, {
        auth: { persistSession: false }
      });

      await supabaseClient
        .from('stripe_sync_log')
        .update({
          status: 'failed',
          error_message: errorMessage,
          completed_at: new Date().toISOString(),
          duration_ms: duration
        })
        .eq('id', syncLogId);
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});