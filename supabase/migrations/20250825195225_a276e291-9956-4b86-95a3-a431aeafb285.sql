-- Create the new Policies and Plays system tables

-- Policies table for system-wide guardrails
CREATE TABLE public.policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  policy_type TEXT NOT NULL, -- 'quiet_hours', 'message_pacing', 'stage_rules', 'stop_triggers'
  configuration JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rename workflows to plays and update structure
ALTER TABLE public.workflows RENAME TO plays;
ALTER TABLE public.plays ADD COLUMN IF NOT EXISTS play_type TEXT DEFAULT 'sequence';
ALTER TABLE public.plays ADD COLUMN IF NOT EXISTS target_stage TEXT;
ALTER TABLE public.plays ADD COLUMN IF NOT EXISTS estimated_impact TEXT;

-- Student actions table for Today dashboard
CREATE TABLE public.student_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id UUID NOT NULL,
  play_id UUID REFERENCES public.plays(id),
  action_type TEXT NOT NULL, -- 'call', 'email', 'sms', 'task', 'document_request'
  instruction TEXT NOT NULL,
  reason_chips TEXT[] DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 3, -- 1=high, 2=medium, 3=low
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'skipped', 'queued'
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Program configurations table
CREATE TABLE public.program_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id UUID,
  program_name TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}', -- stall_days, requires_interview, etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Play-Program assignments
CREATE TABLE public.play_program_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  play_id UUID NOT NULL REFERENCES public.plays(id),
  program_configuration_id UUID NOT NULL REFERENCES public.program_configurations(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Action execution logs for outcomes tracking
CREATE TABLE public.action_execution_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_id UUID NOT NULL REFERENCES public.student_actions(id),
  play_id UUID REFERENCES public.plays(id),
  execution_result TEXT NOT NULL, -- 'success', 'failed', 'policy_blocked'
  execution_data JSONB DEFAULT '{}',
  response_time_minutes INTEGER,
  outcome_achieved BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_program_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_execution_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own policies" 
ON public.policies FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own student actions" 
ON public.student_actions FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own program configurations" 
ON public.program_configurations FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view play program assignments for their data" 
ON public.play_program_assignments FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.plays p 
  WHERE p.id = play_program_assignments.play_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can manage play program assignments for their plays" 
ON public.play_program_assignments FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.plays p 
  WHERE p.id = play_program_assignments.play_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can view action execution logs for their actions" 
ON public.action_execution_logs FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.student_actions sa 
  WHERE sa.id = action_execution_logs.action_id 
  AND sa.user_id = auth.uid()
));

CREATE POLICY "System can create action execution logs" 
ON public.action_execution_logs FOR INSERT 
WITH CHECK (true);

-- Insert default policies
INSERT INTO public.policies (user_id, name, description, policy_type, configuration) 
SELECT 
  auth.uid(),
  'Quiet Hours',
  'Don''t call or text after 9pm or before 8am in student''s local time',
  'quiet_hours',
  '{"start_time": "21:00", "end_time": "08:00", "enabled": true}'::jsonb
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.policies (user_id, name, description, policy_type, configuration) 
SELECT 
  auth.uid(),
  'Message Pacing',
  'No more than two messages a day with at least a few hours between them',
  'message_pacing',
  '{"max_messages_per_day": 2, "min_hours_between": 3, "enabled": true}'::jsonb
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.policies (user_id, name, description, policy_type, configuration) 
SELECT 
  auth.uid(),
  'Stop After Deposit',
  'Stop all marketing plays immediately when deposit is paid',
  'stop_triggers',
  '{"stop_on_deposit": true, "stop_on_enrollment": true, "enabled": true}'::jsonb
WHERE auth.uid() IS NOT NULL;

-- Insert default plays
INSERT INTO public.plays (user_id, name, description, is_active, play_type, target_stage, estimated_impact) 
SELECT 
  auth.uid(),
  'Speed-to-Lead (5 minutes)',
  'When someone inquires or fills a form, get them a quick call task right away and a short backup message soon after. Moves response time and app starts.',
  false,
  'immediate_response',
  'inquiry',
  'High impact on response time and application starts'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.plays (user_id, name, description, is_active, play_type, target_stage, estimated_impact) 
SELECT 
  auth.uid(),
  'Stalled 7-Day',
  'If an application sits untouched for a week, send a friendly nudge, a follow-up email later, and a call task next day. Moves application completion.',
  false,
  'nurture_sequence',
  'application',
  'Improves application completion rates'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.plays (user_id, name, description, is_active, play_type, target_stage, estimated_impact) 
SELECT 
  auth.uid(),
  'Document Chase',
  'If a key document (like a transcript) is missing, add a call task and send a simple checklist email. Shortens time to complete documents.',
  false,
  'document_follow_up',
  'documentation',
  'Reduces document completion time'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.plays (user_id, name, description, is_active, play_type, target_stage, estimated_impact) 
SELECT 
  auth.uid(),
  'RSVP → Interview',
  'If a student attended a webinar and the program uses interviews, send a "book your interview" invite and a follow-up task if they don''t book. Improves show-rate and momentum.',
  false,
  'interview_booking',
  'qualified',
  'Improves interview show rates'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.plays (user_id, name, description, is_active, play_type, target_stage, estimated_impact) 
SELECT 
  auth.uid(),
  'Deposit → Onboarding',
  'When a deposit is paid, stop all marketing touches and send a welcome "next steps" note. Prevents awkward messages and reduces melt.',
  false,
  'onboarding',
  'enrolled',
  'Reduces student melt and confusion'
WHERE auth.uid() IS NOT NULL;