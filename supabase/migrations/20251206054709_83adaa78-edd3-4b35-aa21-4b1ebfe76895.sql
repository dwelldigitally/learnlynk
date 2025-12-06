-- Create lead_activity_logs table for comprehensive activity tracking
CREATE TABLE public.lead_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  action_category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  old_value JSONB,
  new_value JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_lead_activity_logs_lead_id ON public.lead_activity_logs(lead_id);
CREATE INDEX idx_lead_activity_logs_created_at ON public.lead_activity_logs(created_at DESC);
CREATE INDEX idx_lead_activity_logs_action_type ON public.lead_activity_logs(action_type);
CREATE INDEX idx_lead_activity_logs_action_category ON public.lead_activity_logs(action_category);

-- Enable RLS
ALTER TABLE public.lead_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view activity logs for leads they have access to"
ON public.lead_activity_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = lead_activity_logs.lead_id
    AND leads.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create activity logs"
ON public.lead_activity_logs
FOR INSERT
WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE public.lead_activity_logs IS 'Comprehensive activity log for all lead-related actions including updates, document changes, stage transitions, etc.';