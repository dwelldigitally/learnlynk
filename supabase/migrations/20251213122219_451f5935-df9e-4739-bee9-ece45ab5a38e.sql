-- Phase 1: Infrastructure for HubSpot-like Outlook Integration

-- Add encrypted token columns to user_settings
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS outlook_access_token_encrypted text,
ADD COLUMN IF NOT EXISTS outlook_refresh_token_encrypted text,
ADD COLUMN IF NOT EXISTS outlook_token_expires_at timestamptz,
ADD COLUMN IF NOT EXISTS outlook_user_id text;

-- Create outlook_email_threads table for conversation tracking
CREATE TABLE IF NOT EXISTS public.outlook_email_threads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  conversation_id text NOT NULL,
  internet_message_id text,
  subject text,
  last_message_at timestamptz DEFAULT now(),
  message_count integer DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, conversation_id)
);

-- Create outlook_webhook_subscriptions table
CREATE TABLE IF NOT EXISTS public.outlook_webhook_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  subscription_id text NOT NULL UNIQUE,
  resource text NOT NULL,
  change_types text[] NOT NULL,
  expiration_datetime timestamptz NOT NULL,
  client_state text NOT NULL,
  notification_url text NOT NULL,
  is_active boolean DEFAULT true,
  last_notification_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add Microsoft sync columns to calendar_events
ALTER TABLE public.calendar_events
ADD COLUMN IF NOT EXISTS microsoft_event_id text,
ADD COLUMN IF NOT EXISTS microsoft_calendar_id text,
ADD COLUMN IF NOT EXISTS microsoft_change_key text,
ADD COLUMN IF NOT EXISTS sync_status text DEFAULT 'local_only' CHECK (sync_status IN ('synced', 'pending', 'failed', 'local_only')),
ADD COLUMN IF NOT EXISTS last_synced_at timestamptz,
ADD COLUMN IF NOT EXISTS sync_direction text CHECK (sync_direction IN ('to_outlook', 'from_outlook', 'bidirectional'));

-- Add Microsoft tracking columns to emails table for thread matching
ALTER TABLE public.emails
ADD COLUMN IF NOT EXISTS microsoft_message_id text,
ADD COLUMN IF NOT EXISTS microsoft_conversation_id text,
ADD COLUMN IF NOT EXISTS microsoft_internet_message_id text,
ADD COLUMN IF NOT EXISTS microsoft_change_key text,
ADD COLUMN IF NOT EXISTS sync_status text DEFAULT 'local_only' CHECK (sync_status IN ('synced', 'pending', 'failed', 'local_only')),
ADD COLUMN IF NOT EXISTS sent_via_outlook boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_synced_at timestamptz;

-- Create index for faster conversation lookups
CREATE INDEX IF NOT EXISTS idx_outlook_email_threads_conversation ON public.outlook_email_threads(conversation_id);
CREATE INDEX IF NOT EXISTS idx_outlook_email_threads_lead ON public.outlook_email_threads(lead_id);
CREATE INDEX IF NOT EXISTS idx_emails_microsoft_conversation ON public.emails(microsoft_conversation_id);
CREATE INDEX IF NOT EXISTS idx_emails_microsoft_message ON public.emails(microsoft_message_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_microsoft ON public.calendar_events(microsoft_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_user ON public.outlook_webhook_subscriptions(user_id);

-- Enable RLS on new tables
ALTER TABLE public.outlook_email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outlook_webhook_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for outlook_email_threads
CREATE POLICY "Users can view their own email threads"
ON public.outlook_email_threads FOR SELECT
USING (user_id = auth.uid() OR tenant_id = public.current_tenant_id());

CREATE POLICY "Users can insert their own email threads"
ON public.outlook_email_threads FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own email threads"
ON public.outlook_email_threads FOR UPDATE
USING (user_id = auth.uid());

-- RLS policies for outlook_webhook_subscriptions
CREATE POLICY "Users can view their own webhook subscriptions"
ON public.outlook_webhook_subscriptions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own webhook subscriptions"
ON public.outlook_webhook_subscriptions FOR ALL
USING (user_id = auth.uid());

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_outlook_email_threads_updated_at
  BEFORE UPDATE ON public.outlook_email_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_outlook_webhook_subscriptions_updated_at
  BEFORE UPDATE ON public.outlook_webhook_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();