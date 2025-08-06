-- Create Aircall integration tables for call management and CTI features

-- Call logs table to store all call information
CREATE TABLE public.aircall_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aircall_call_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  
  -- Call details
  phone_number TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT NOT NULL CHECK (status IN ('initial', 'answered', 'hungup', 'busy', 'no_answer', 'failed', 'canceled')),
  duration INTEGER DEFAULT 0,
  
  -- Call participants
  agent_id TEXT,
  agent_name TEXT,
  caller_name TEXT,
  caller_company TEXT,
  
  -- Call timing
  started_at TIMESTAMP WITH TIME ZONE,
  answered_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Call content
  recording_url TEXT,
  transcription TEXT,
  summary TEXT,
  tags TEXT[],
  
  -- Call outcome
  outcome TEXT CHECK (outcome IN ('connected', 'no_answer', 'busy', 'failed', 'voicemail', 'callback_requested')),
  disposition TEXT,
  notes TEXT,
  
  -- Metadata
  aircall_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for aircall_calls
ALTER TABLE public.aircall_calls ENABLE ROW LEVEL SECURITY;

-- RLS policies for aircall_calls
CREATE POLICY "Users can manage their own aircall calls"
ON public.aircall_calls
FOR ALL
USING (auth.uid() = user_id);

-- Aircall integration settings table
CREATE TABLE public.aircall_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  
  -- API credentials
  api_id TEXT,
  api_token_encrypted TEXT,
  
  -- Configuration
  auto_create_leads BOOLEAN DEFAULT true,
  auto_log_calls BOOLEAN DEFAULT true,
  call_recording_enabled BOOLEAN DEFAULT true,
  transcription_enabled BOOLEAN DEFAULT false,
  
  -- CTI settings
  click_to_call_enabled BOOLEAN DEFAULT true,
  call_popup_enabled BOOLEAN DEFAULT true,
  auto_dial_enabled BOOLEAN DEFAULT false,
  
  -- Webhook settings
  webhook_url TEXT,
  webhook_secret TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  connection_status TEXT DEFAULT 'disconnected' CHECK (connection_status IN ('connected', 'disconnected', 'error')),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for aircall_settings
ALTER TABLE public.aircall_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for aircall_settings
CREATE POLICY "Users can manage their own aircall settings"
ON public.aircall_settings
FOR ALL
USING (auth.uid() = user_id);

-- Call activities table for tracking call-related activities
CREATE TABLE public.aircall_call_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID NOT NULL REFERENCES public.aircall_calls(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call_started', 'call_answered', 'call_ended', 'call_transferred', 'note_added', 'outcome_set')),
  activity_data JSONB DEFAULT '{}',
  performed_by TEXT,
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for aircall_call_activities
ALTER TABLE public.aircall_call_activities ENABLE ROW LEVEL SECURITY;

-- RLS policies for aircall_call_activities
CREATE POLICY "Users can view call activities for their calls"
ON public.aircall_call_activities
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.aircall_calls 
  WHERE aircall_calls.id = aircall_call_activities.call_id 
  AND aircall_calls.user_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_aircall_calls_user_id ON public.aircall_calls(user_id);
CREATE INDEX idx_aircall_calls_lead_id ON public.aircall_calls(lead_id);
CREATE INDEX idx_aircall_calls_phone_number ON public.aircall_calls(phone_number);
CREATE INDEX idx_aircall_calls_aircall_id ON public.aircall_calls(aircall_call_id);
CREATE INDEX idx_aircall_calls_created_at ON public.aircall_calls(created_at);

-- Create trigger for updating aircall_calls updated_at
CREATE TRIGGER update_aircall_calls_updated_at
  BEFORE UPDATE ON public.aircall_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating aircall_settings updated_at
CREATE TRIGGER update_aircall_settings_updated_at
  BEFORE UPDATE ON public.aircall_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();