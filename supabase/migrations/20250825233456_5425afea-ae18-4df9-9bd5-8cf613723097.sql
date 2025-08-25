-- Create journey-play mappings and policy overrides tables for Phase 2-3 integration

-- Table to map which plays are allowed for specific journey stages
CREATE TABLE public.journey_play_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  journey_id UUID NOT NULL,
  stage_id UUID NOT NULL,
  play_id UUID NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  timing_override JSONB DEFAULT '{}',
  priority_override INTEGER DEFAULT NULL,
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for journey-specific policy overrides
CREATE TABLE public.journey_policy_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  journey_id UUID NOT NULL,
  stage_id UUID DEFAULT NULL,
  policy_id UUID NOT NULL,
  override_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to track student journey progress
CREATE TABLE public.student_journey_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id TEXT NOT NULL,
  journey_id UUID NOT NULL,
  current_stage_id UUID DEFAULT NULL,
  current_substage TEXT DEFAULT NULL,
  stage_status TEXT NOT NULL DEFAULT 'active',
  stage_started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  stage_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  requirements_completed JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.journey_play_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_policy_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_journey_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for journey_play_mappings
CREATE POLICY "Users can manage their own journey play mappings"
ON public.journey_play_mappings
FOR ALL
USING (auth.uid() = user_id);

-- RLS policies for journey_policy_overrides
CREATE POLICY "Users can manage their own journey policy overrides"
ON public.journey_policy_overrides
FOR ALL
USING (auth.uid() = user_id);

-- RLS policies for student_journey_progress
CREATE POLICY "Users can manage their own student journey progress"
ON public.student_journey_progress
FOR ALL
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_journey_play_mappings_journey_stage ON public.journey_play_mappings(journey_id, stage_id);
CREATE INDEX idx_journey_policy_overrides_journey_stage ON public.journey_policy_overrides(journey_id, stage_id);
CREATE INDEX idx_student_journey_progress_student ON public.student_journey_progress(student_id);
CREATE INDEX idx_student_journey_progress_journey ON public.student_journey_progress(journey_id, current_stage_id);

-- Add updated_at triggers
CREATE TRIGGER update_journey_play_mappings_updated_at
BEFORE UPDATE ON public.journey_play_mappings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journey_policy_overrides_updated_at
BEFORE UPDATE ON public.journey_policy_overrides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_journey_progress_updated_at
BEFORE UPDATE ON public.student_journey_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();