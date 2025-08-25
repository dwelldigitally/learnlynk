-- Create action_queue table for prioritized actions
CREATE TABLE public.action_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id UUID,
  student_name TEXT NOT NULL,
  program TEXT NOT NULL,
  yield_score NUMERIC NOT NULL DEFAULT 0,
  yield_band TEXT NOT NULL DEFAULT 'medium',
  reason_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggested_action TEXT NOT NULL,
  sla_due_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  priority_band TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID
);

-- Create signals table for student engagement tracking
CREATE TABLE public.signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id UUID NOT NULL,
  webinar_attended BOOLEAN DEFAULT false,
  form_submitted_at TIMESTAMP WITH TIME ZONE,
  last_email_open_at TIMESTAMP WITH TIME ZONE,
  pageviews_7d INTEGER DEFAULT 0,
  yield_score NUMERIC DEFAULT 0,
  intent_signals JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create waste_radar table for low-value touch identification
CREATE TABLE public.waste_radar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  unresponsive_30d BOOLEAN DEFAULT false,
  wrong_intake BOOLEAN DEFAULT false,
  duplicate_flag BOOLEAN DEFAULT false,
  last_meaningful_contact TIMESTAMP WITH TIME ZONE,
  touch_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create policy_configurations table
CREATE TABLE public.policy_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  policy_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}'::jsonb,
  expected_lift NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create outcome_metrics table
CREATE TABLE public.outcome_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  before_value NUMERIC DEFAULT 0,
  after_value NUMERIC DEFAULT 0,
  time_period TEXT NOT NULL DEFAULT '30d',
  attribution_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.action_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_radar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcome_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own action queue" ON public.action_queue
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own signals" ON public.signals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own waste radar" ON public.waste_radar
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own policy configurations" ON public.policy_configurations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own outcome metrics" ON public.outcome_metrics
  FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_action_queue_updated_at
  BEFORE UPDATE ON public.action_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_signals_updated_at
  BEFORE UPDATE ON public.signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_waste_radar_updated_at
  BEFORE UPDATE ON public.waste_radar
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_policy_configurations_updated_at
  BEFORE UPDATE ON public.policy_configurations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_outcome_metrics_updated_at
  BEFORE UPDATE ON public.outcome_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();