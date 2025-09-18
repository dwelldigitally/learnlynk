-- Create program fit assessments table
CREATE TABLE public.program_fit_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  program_fit_score INTEGER NOT NULL DEFAULT 0 CHECK (program_fit_score >= 0 AND program_fit_score <= 100),
  yield_propensity_score INTEGER NOT NULL DEFAULT 0 CHECK (yield_propensity_score >= 0 AND yield_propensity_score <= 100),
  hard_eligibility_passed BOOLEAN NOT NULL DEFAULT false,
  academic_alignment_score INTEGER DEFAULT 0,
  engagement_intent_score INTEGER DEFAULT 0,
  behavioral_signals_score INTEGER DEFAULT 0,
  financial_readiness_score INTEGER DEFAULT 0,
  risk_flags_count INTEGER DEFAULT 0,
  assessment_data JSONB DEFAULT '{}',
  ai_confidence_score NUMERIC DEFAULT 0,
  assessment_notes TEXT,
  assessed_by UUID,
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create program capacity table
CREATE TABLE public.program_capacity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_name TEXT NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 0,
  filled_seats INTEGER NOT NULL DEFAULT 0,
  target_gpa_min NUMERIC DEFAULT 0,
  target_gpa_max NUMERIC DEFAULT 4.0,
  target_domestic_ratio NUMERIC DEFAULT 0.7,
  target_international_ratio NUMERIC DEFAULT 0.3,
  diversity_targets JSONB DEFAULT '{}',
  intake_period TEXT,
  class_shaping_rules JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create engagement tracking table
CREATE TABLE public.applicant_engagement_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID NOT NULL,
  portal_login_count INTEGER DEFAULT 0,
  portal_time_spent_minutes INTEGER DEFAULT 0,
  email_open_rate NUMERIC DEFAULT 0,
  sms_response_rate NUMERIC DEFAULT 0,
  event_attendance_count INTEGER DEFAULT 0,
  interview_show_rate NUMERIC DEFAULT 1.0,
  first_response_time_hours INTEGER,
  application_velocity_days INTEGER,
  nudge_responsiveness_score INTEGER DEFAULT 0,
  self_scheduling_speed_hours INTEGER,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.program_fit_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicant_engagement_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for program_fit_assessments
CREATE POLICY "Users can manage their own program fit assessments"
ON public.program_fit_assessments
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for program_capacity
CREATE POLICY "Users can manage their own program capacity"
ON public.program_capacity
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for applicant_engagement_metrics
CREATE POLICY "Users can manage engagement metrics for their applicants"
ON public.applicant_engagement_metrics
FOR ALL
USING (EXISTS (
  SELECT 1 FROM applicants a
  WHERE a.id = applicant_engagement_metrics.applicant_id
  AND a.user_id = auth.uid()
));

-- Create triggers for updated_at
CREATE TRIGGER update_program_fit_assessments_updated_at
  BEFORE UPDATE ON public.program_fit_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_program_capacity_updated_at
  BEFORE UPDATE ON public.program_capacity
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applicant_engagement_metrics_updated_at
  BEFORE UPDATE ON public.applicant_engagement_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();