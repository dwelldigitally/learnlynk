-- Fix RLS policies on payments table by dropping ALL existing policies first
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'payments' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON public.payments';
    END LOOP;
    
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'payment_transactions' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON public.payment_transactions';
    END LOOP;
END $$;

-- Create corrected policies for payments that check through the leads table
CREATE POLICY "Users can view payments for their leads"
ON public.payments
FOR SELECT
USING (
  lead_id IN (
    SELECT id FROM public.leads WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert payments for their leads"
ON public.payments
FOR INSERT
WITH CHECK (
  lead_id IN (
    SELECT id FROM public.leads WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update payments for their leads"
ON public.payments
FOR UPDATE
USING (
  lead_id IN (
    SELECT id FROM public.leads WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete payments for their leads"
ON public.payments
FOR DELETE
USING (
  lead_id IN (
    SELECT id FROM public.leads WHERE user_id = auth.uid()
  )
);

-- Create corrected policies for payment_transactions
CREATE POLICY "Users can view transactions for their payments"
ON public.payment_transactions
FOR SELECT
USING (
  payment_id IN (
    SELECT id FROM public.payments WHERE lead_id IN (
      SELECT id FROM public.leads WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can insert transactions for their payments"
ON public.payment_transactions
FOR INSERT
WITH CHECK (
  payment_id IN (
    SELECT id FROM public.payments WHERE lead_id IN (
      SELECT id FROM public.leads WHERE user_id = auth.uid()
    )
  )
);