-- Create stage_transition_triggers table for configuring automatic transitions
CREATE TABLE IF NOT EXISTS public.stage_transition_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID REFERENCES public.journey_stages(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'all_documents_approved',
    'specific_document_approved', 
    'payment_received',
    'form_submitted',
    'manual_approval',
    'time_elapsed',
    'all_requirements_completed'
  )),
  condition_config JSONB DEFAULT '{}',
  target_stage_id UUID REFERENCES public.journey_stages(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  notify_student BOOLEAN DEFAULT true,
  notify_admin BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL
);

-- Create stage_transition_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.stage_transition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  journey_id UUID REFERENCES public.academic_journeys(id) ON DELETE CASCADE,
  from_stage_id UUID,
  to_stage_id UUID,
  trigger_type TEXT,
  trigger_id UUID,
  triggered_by TEXT DEFAULT 'system',
  transition_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable RLS
ALTER TABLE public.stage_transition_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_transition_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stage_transition_triggers
CREATE POLICY "Users can manage their own transition triggers"
ON public.stage_transition_triggers
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for stage_transition_logs
CREATE POLICY "Users can view their own transition logs"
ON public.stage_transition_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert transition logs"
ON public.stage_transition_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_stage_transition_triggers_stage_id ON public.stage_transition_triggers(stage_id);
CREATE INDEX IF NOT EXISTS idx_stage_transition_triggers_user_id ON public.stage_transition_triggers(user_id);
CREATE INDEX IF NOT EXISTS idx_stage_transition_logs_lead_id ON public.stage_transition_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_stage_transition_logs_journey_id ON public.stage_transition_logs(journey_id);

-- Add transition_triggers column to journey_stages if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'journey_stages' 
    AND column_name = 'auto_transition_enabled'
  ) THEN
    ALTER TABLE public.journey_stages ADD COLUMN auto_transition_enabled BOOLEAN DEFAULT false;
  END IF;
END $$;