-- Create Invoice Templates Table
CREATE TABLE invoice_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  financial_record_id UUID REFERENCES financial_records(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  invoice_template_id UUID REFERENCES invoice_templates(id),
  invoice_sent_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_currency CHECK (currency IN ('USD', 'CAD')),
  CONSTRAINT valid_payment_type CHECK (payment_type IN ('application_fee', 'tuition', 'deposit', 'other')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'invoice_sent', 'paid', 'failed', 'refunded'))
);

-- Create Payment Transactions Table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL,
  amount DECIMAL(10,2),
  stripe_transaction_id TEXT,
  status TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('charge', 'refund', 'invoice_sent', 'reminder_sent')),
  CONSTRAINT valid_transaction_status CHECK (status IN ('success', 'pending', 'failed'))
);

-- Create Receipt Templates Table
CREATE TABLE receipt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoice_templates
CREATE POLICY "Authenticated users can view invoice templates"
  ON invoice_templates FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage invoice templates"
  ON invoice_templates FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS Policies for payments
CREATE POLICY "Users can manage payments for their leads"
  ON payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = payments.lead_id 
      AND leads.user_id = auth.uid()
    )
  );

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view transactions for their payments"
  ON payment_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM payments 
      JOIN leads ON leads.id = payments.lead_id
      WHERE payments.id = payment_transactions.payment_id 
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create payment transactions"
  ON payment_transactions FOR INSERT
  WITH CHECK (true);

-- RLS Policies for receipt_templates
CREATE POLICY "Authenticated users can view receipt templates"
  ON receipt_templates FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage receipt templates"
  ON receipt_templates FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert Default Invoice Templates
INSERT INTO invoice_templates (name, template_type, subject_line, body_html, body_text, is_default) VALUES
('Standard Invoice', 'standard', 'Invoice for {{program_name}} - {{student_name}}', 
 '<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: #f8f9fa; padding: 20px; border-radius: 8px;"><h1 style="color: #1a1a1a; margin-top: 0;">Application Fee Invoice</h1><p style="color: #4a5568; font-size: 16px;">Dear {{student_name}},</p><p style="color: #4a5568; font-size: 16px;">Please find your invoice for <strong>{{program_name}}</strong>.</p><div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;"><p style="font-size: 14px; color: #718096; margin: 5px 0;">Amount Due</p><p style="font-size: 32px; font-weight: bold; color: #2d3748; margin: 5px 0;">{{amount}} {{currency}}</p><p style="font-size: 14px; color: #718096; margin: 5px 0;">Due Date: {{due_date}}</p></div><a href="{{payment_link}}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0;">Pay Now</a><p style="color: #718096; font-size: 14px; margin-top: 30px;">If you have any questions, please contact us.</p></div></body></html>',
 'Dear {{student_name}},\n\nPlease find your invoice for {{program_name}}.\n\nAmount Due: {{amount}} {{currency}}\nDue Date: {{due_date}}\n\nClick here to pay: {{payment_link}}\n\nIf you have any questions, please contact us.\n\nBest regards',
 true),
('Urgent Payment Invoice', 'urgent', 'URGENT: Payment Due for {{program_name}}',
 '<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;"><h1 style="color: #dc2626; margin-top: 0;">⚠️ Urgent Payment Required</h1><p style="color: #4a5568; font-size: 16px;">Dear {{student_name}},</p><p style="color: #4a5568; font-size: 16px;">This is an urgent reminder that payment is due for <strong>{{program_name}}</strong>.</p><div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;"><p style="font-size: 14px; color: #718096; margin: 5px 0;">Amount Due</p><p style="font-size: 32px; font-weight: bold; color: #dc2626; margin: 5px 0;">{{amount}} {{currency}}</p><p style="font-size: 14px; color: #dc2626; font-weight: 600; margin: 5px 0;">Due Date: {{due_date}}</p></div><a href="{{payment_link}}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0;">Pay Now</a><p style="color: #718096; font-size: 14px; margin-top: 30px;">Please process this payment immediately to avoid any delays.</p></div></body></html>',
 'URGENT: Payment Required\n\nDear {{student_name}},\n\nThis is an urgent reminder that payment is due for {{program_name}}.\n\nAmount Due: {{amount}} {{currency}}\nDue Date: {{due_date}}\n\nPay now: {{payment_link}}\n\nPlease process this payment immediately to avoid any delays.\n\nBest regards',
 false);

-- Insert Default Receipt Templates
INSERT INTO receipt_templates (name, template_type, body_html, body_text, is_default) VALUES
('Standard Receipt', 'standard',
 '<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;"><h1 style="color: #059669; margin-top: 0;">✓ Payment Receipt</h1><p style="color: #4a5568; font-size: 16px;">Dear {{student_name}},</p><p style="color: #4a5568; font-size: 16px;">Thank you for your payment. Your transaction has been processed successfully.</p><div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;"><p style="font-size: 14px; color: #718096; margin: 5px 0;">Amount Paid</p><p style="font-size: 32px; font-weight: bold; color: #059669; margin: 5px 0;">{{amount}} {{currency}}</p><hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;"/><p style="font-size: 14px; color: #718096; margin: 5px 0;">Transaction ID</p><p style="font-size: 16px; color: #2d3748; margin: 5px 0; font-family: monospace;">{{transaction_id}}</p><p style="font-size: 14px; color: #718096; margin: 5px 0;">Payment Date</p><p style="font-size: 16px; color: #2d3748; margin: 5px 0;">{{payment_date}}</p><p style="font-size: 14px; color: #718096; margin: 5px 0;">Payment Method</p><p style="font-size: 16px; color: #2d3748; margin: 5px 0;">{{payment_method}}</p></div><p style="color: #718096; font-size: 14px; margin-top: 30px;">Please keep this receipt for your records.</p></div></body></html>',
 'Payment Receipt\n\nDear {{student_name}},\n\nThank you for your payment. Your transaction has been processed successfully.\n\nAmount Paid: {{amount}} {{currency}}\nTransaction ID: {{transaction_id}}\nPayment Date: {{payment_date}}\nPayment Method: {{payment_method}}\n\nPlease keep this receipt for your records.\n\nBest regards',
 true);

-- Create indexes for better performance
CREATE INDEX idx_payments_lead_id ON payments(lead_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payment_transactions_payment_id ON payment_transactions(payment_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);