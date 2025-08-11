-- Create lead routing rules table
CREATE TABLE public.lead_routing_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  priority integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  sources text[] DEFAULT '{}',
  condition_groups jsonb NOT NULL DEFAULT '[]',
  assignment_config jsonb NOT NULL DEFAULT '{}',
  schedule jsonb,
  performance_config jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create lead scoring rules table  
CREATE TABLE public.lead_scoring_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  field text NOT NULL,
  condition text NOT NULL,
  value text NOT NULL,
  points integer NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create lead scoring settings table
CREATE TABLE public.lead_scoring_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  auto_scoring_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lead_routing_rules
CREATE POLICY "Users can manage their own routing rules" 
ON public.lead_routing_rules 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for lead_scoring_rules  
CREATE POLICY "Users can manage their own scoring rules"
ON public.lead_scoring_rules
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for lead_scoring_settings
CREATE POLICY "Users can manage their own scoring settings"
ON public.lead_scoring_settings  
FOR ALL
USING (auth.uid() = user_id);

-- Create update triggers
CREATE TRIGGER update_lead_routing_rules_updated_at
BEFORE UPDATE ON public.lead_routing_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_scoring_rules_updated_at  
BEFORE UPDATE ON public.lead_scoring_rules
FOR EACH ROW  
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_scoring_settings_updated_at
BEFORE UPDATE ON public.lead_scoring_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();