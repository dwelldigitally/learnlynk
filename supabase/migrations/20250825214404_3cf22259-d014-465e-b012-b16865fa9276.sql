-- Create journey_templates table first for pre-built journey patterns
CREATE TABLE public.journey_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_system_template BOOLEAN NOT NULL DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  program_type TEXT,
  complexity_level TEXT NOT NULL DEFAULT 'medium',
  estimated_duration_days INTEGER,
  template_data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create academic_journeys table for program-specific journey definitions
CREATE TABLE public.academic_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id UUID REFERENCES public.master_programs(id),
  template_id UUID REFERENCES public.journey_templates(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create journey_stages table for custom stages per program with timing rules
CREATE TABLE public.journey_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES public.academic_journeys(id) ON DELETE CASCADE,
  parent_stage_id UUID REFERENCES public.journey_stages(id),
  order_index INTEGER NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_parallel BOOLEAN NOT NULL DEFAULT false,
  timing_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  stage_type TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'active',
  completion_criteria JSONB DEFAULT '{}'::jsonb,
  escalation_rules JSONB DEFAULT '{}'::jsonb
);

-- Create journey_requirements table for stage-based requirements
CREATE TABLE public.journey_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_id UUID NOT NULL REFERENCES public.journey_stages(id) ON DELETE CASCADE,
  document_template_id UUID REFERENCES public.document_templates(id),
  verification_method TEXT NOT NULL DEFAULT 'manual',
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  reminder_schedule JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  requirement_type TEXT NOT NULL,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  special_instructions TEXT
);

-- Create journey_channel_rules table for communication permissions per stage
CREATE TABLE public.journey_channel_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_id UUID NOT NULL REFERENCES public.journey_stages(id) ON DELETE CASCADE,
  priority_threshold TEXT NOT NULL DEFAULT 'medium',
  time_restrictions JSONB DEFAULT '{}'::jsonb,
  frequency_limits JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  channel_type TEXT NOT NULL,
  is_allowed BOOLEAN NOT NULL DEFAULT true,
  conditions JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.academic_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_channel_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for journey_templates  
CREATE POLICY "Users can view all journey templates"
ON public.journey_templates FOR SELECT
USING (true);

CREATE POLICY "Users can create custom journey templates"
ON public.journey_templates FOR INSERT
WITH CHECK (is_system_template = false);

CREATE POLICY "Users can update their custom journey templates"
ON public.journey_templates FOR UPDATE
USING (is_system_template = false);

-- Create RLS policies for academic_journeys
CREATE POLICY "Users can manage their own academic journeys"
ON public.academic_journeys FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for journey_stages
CREATE POLICY "Users can manage stages for their journeys"
ON public.journey_stages FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.academic_journeys aj 
  WHERE aj.id = journey_stages.journey_id 
  AND aj.user_id = auth.uid()
));

-- Create RLS policies for journey_requirements
CREATE POLICY "Users can manage requirements for their journey stages"
ON public.journey_requirements FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.journey_stages js
  JOIN public.academic_journeys aj ON aj.id = js.journey_id
  WHERE js.id = journey_requirements.stage_id 
  AND aj.user_id = auth.uid()
));

-- Create RLS policies for journey_channel_rules
CREATE POLICY "Users can manage channel rules for their journey stages"
ON public.journey_channel_rules FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.journey_stages js
  JOIN public.academic_journeys aj ON aj.id = js.journey_id
  WHERE js.id = journey_channel_rules.stage_id 
  AND aj.user_id = auth.uid()
));

-- Create indexes for better performance
CREATE INDEX idx_academic_journeys_user_program ON public.academic_journeys(user_id, program_id);
CREATE INDEX idx_journey_stages_journey_order ON public.journey_stages(journey_id, order_index);
CREATE INDEX idx_journey_requirements_stage ON public.journey_requirements(stage_id, order_index);
CREATE INDEX idx_journey_channel_rules_stage ON public.journey_channel_rules(stage_id, channel_type);
CREATE INDEX idx_journey_templates_category ON public.journey_templates(category, program_type);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_academic_journeys_updated_at
  BEFORE UPDATE ON public.academic_journeys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journey_templates_updated_at
  BEFORE UPDATE ON public.journey_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journey_stages_updated_at
  BEFORE UPDATE ON public.journey_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journey_requirements_updated_at
  BEFORE UPDATE ON public.journey_requirements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journey_channel_rules_updated_at
  BEFORE UPDATE ON public.journey_channel_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();