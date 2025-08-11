-- Create lead scoring settings table
CREATE TABLE public.lead_scoring_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  scoring_algorithm TEXT NOT NULL DEFAULT 'weighted',
  max_score INTEGER NOT NULL DEFAULT 100,
  auto_qualification_threshold INTEGER DEFAULT 75,
  settings_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead scoring rules table  
CREATE TABLE public.lead_scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  field_name TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value TEXT NOT NULL,
  score_points INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.lead_scoring_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for lead_scoring_settings
CREATE POLICY "Users can manage their own scoring settings" 
ON public.lead_scoring_settings 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for lead_scoring_rules
CREATE POLICY "Users can manage their own scoring rules" 
ON public.lead_scoring_rules 
FOR ALL 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_lead_scoring_settings_updated_at
BEFORE UPDATE ON public.lead_scoring_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_scoring_rules_updated_at
BEFORE UPDATE ON public.lead_scoring_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();