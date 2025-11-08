-- Create Stripe sync tables

-- 1. Stripe Customers Table
CREATE TABLE public.stripe_customers (
  id TEXT PRIMARY KEY, -- Stripe customer ID (cus_xxx)
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  description TEXT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL, -- Link to lead
  currency TEXT,
  balance INTEGER DEFAULT 0, -- Account balance in cents
  delinquent BOOLEAN DEFAULT false,
  created TIMESTAMPTZ NOT NULL, -- When created in Stripe
  metadata JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL -- Who owns this data
);

CREATE INDEX idx_stripe_customers_email ON public.stripe_customers(email);
CREATE INDEX idx_stripe_customers_lead_id ON public.stripe_customers(lead_id);
CREATE INDEX idx_stripe_customers_user_id ON public.stripe_customers(user_id);

-- 2. Stripe Products Table
CREATE TABLE public.stripe_products (
  id TEXT PRIMARY KEY, -- Stripe product ID (prod_xxx)
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  default_price_id TEXT, -- Reference to default price
  images TEXT[], -- Array of image URLs
  metadata JSONB DEFAULT '{}',
  created TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

CREATE INDEX idx_stripe_products_user_id ON public.stripe_products(user_id);
CREATE INDEX idx_stripe_products_active ON public.stripe_products(active);

-- 3. Stripe Prices Table
CREATE TABLE public.stripe_prices (
  id TEXT PRIMARY KEY, -- Stripe price ID (price_xxx)
  product_id TEXT REFERENCES public.stripe_products(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  currency TEXT NOT NULL,
  unit_amount INTEGER, -- Amount in cents
  recurring_interval TEXT, -- 'month', 'year', NULL for one-time
  recurring_interval_count INTEGER,
  type TEXT, -- 'one_time' or 'recurring'
  metadata JSONB DEFAULT '{}',
  created TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

CREATE INDEX idx_stripe_prices_product_id ON public.stripe_prices(product_id);
CREATE INDEX idx_stripe_prices_user_id ON public.stripe_prices(user_id);
CREATE INDEX idx_stripe_prices_active ON public.stripe_prices(active);

-- 4. Stripe Payment Intents Table
CREATE TABLE public.stripe_payment_intents (
  id TEXT PRIMARY KEY, -- Stripe payment intent ID (pi_xxx)
  customer_id TEXT REFERENCES public.stripe_customers(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL,
  status TEXT NOT NULL, -- 'succeeded', 'pending', 'failed', 'canceled'
  payment_method TEXT, -- Type of payment method used
  description TEXT,
  receipt_email TEXT,
  created TIMESTAMPTZ NOT NULL,
  metadata JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

CREATE INDEX idx_stripe_payment_intents_customer_id ON public.stripe_payment_intents(customer_id);
CREATE INDEX idx_stripe_payment_intents_status ON public.stripe_payment_intents(status);
CREATE INDEX idx_stripe_payment_intents_user_id ON public.stripe_payment_intents(user_id);
CREATE INDEX idx_stripe_payment_intents_created ON public.stripe_payment_intents(created DESC);

-- 5. Stripe Sync Log Table
CREATE TABLE public.stripe_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  sync_type TEXT NOT NULL, -- 'customers', 'products', 'payments', 'full', 'auto'
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
  records_synced JSONB DEFAULT '{}', -- {"customers": 150, "products": 45, "payments": 320}
  customers_matched INTEGER DEFAULT 0, -- How many auto-matched to leads
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER
);

CREATE INDEX idx_stripe_sync_log_user_id ON public.stripe_sync_log(user_id);
CREATE INDEX idx_stripe_sync_log_started_at ON public.stripe_sync_log(started_at DESC);
CREATE INDEX idx_stripe_sync_log_status ON public.stripe_sync_log(status);

-- Enable RLS on all tables
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_sync_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stripe_customers
CREATE POLICY "Users can view their own stripe customers"
  ON public.stripe_customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stripe customers"
  ON public.stripe_customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stripe customers"
  ON public.stripe_customers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stripe customers"
  ON public.stripe_customers FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for stripe_products
CREATE POLICY "Users can view their own stripe products"
  ON public.stripe_products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stripe products"
  ON public.stripe_products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stripe products"
  ON public.stripe_products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stripe products"
  ON public.stripe_products FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for stripe_prices
CREATE POLICY "Users can view their own stripe prices"
  ON public.stripe_prices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stripe prices"
  ON public.stripe_prices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stripe prices"
  ON public.stripe_prices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stripe prices"
  ON public.stripe_prices FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for stripe_payment_intents
CREATE POLICY "Users can view their own stripe payment intents"
  ON public.stripe_payment_intents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stripe payment intents"
  ON public.stripe_payment_intents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stripe payment intents"
  ON public.stripe_payment_intents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stripe payment intents"
  ON public.stripe_payment_intents FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for stripe_sync_log
CREATE POLICY "Users can view their own sync logs"
  ON public.stripe_sync_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync logs"
  ON public.stripe_sync_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync logs"
  ON public.stripe_sync_log FOR UPDATE
  USING (auth.uid() = user_id);