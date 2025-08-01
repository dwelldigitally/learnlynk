-- Create advisor teams table for team-based routing
CREATE TABLE public.advisor_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_daily_assignments INTEGER DEFAULT 50,
  region TEXT,
  specializations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team membership table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.advisor_teams(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  is_active BOOLEAN NOT NULL DEFAULT true,
  assigned_leads_today INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, advisor_id)
);

-- Create routing rule conditions table for better structured conditions
CREATE TABLE public.routing_rule_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID NOT NULL REFERENCES public.lead_routing_rules(id) ON DELETE CASCADE,
  condition_type TEXT NOT NULL, -- 'source', 'location', 'program', 'score', 'time', 'custom'
  operator TEXT NOT NULL, -- 'equals', 'in', 'not_in', 'greater_than', 'less_than', 'contains', 'between'
  field_name TEXT NOT NULL,
  field_value JSONB NOT NULL,
  is_required BOOLEAN DEFAULT false,
  group_id TEXT DEFAULT 'default', -- for AND/OR grouping
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rule execution logs for analytics
CREATE TABLE public.rule_execution_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID NOT NULL REFERENCES public.lead_routing_rules(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  execution_result TEXT NOT NULL, -- 'matched', 'no_match', 'error'
  assigned_to UUID,
  execution_time_ms INTEGER,
  error_message TEXT,
  execution_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routing templates for common scenarios
CREATE TABLE public.routing_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'geographic', 'program', 'source', 'score', 'hybrid'
  template_data JSONB NOT NULL,
  is_system_template BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add expanded lead sources enum values
ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'chatbot';
ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'ads';
ALTER TYPE lead_source ADD VALUE IF NOT EXISTS 'forms';

-- Add new assignment methods
ALTER TYPE assignment_method ADD VALUE IF NOT EXISTS 'team_based';
ALTER TYPE assignment_method ADD VALUE IF NOT EXISTS 'territory_based';
ALTER TYPE assignment_method ADD VALUE IF NOT EXISTS 'workload_based';

-- Enable RLS
ALTER TABLE public.advisor_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_rule_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can manage advisor teams" 
ON public.advisor_teams 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can manage team members" 
ON public.team_members 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can manage routing conditions" 
ON public.routing_rule_conditions 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can view execution logs" 
ON public.rule_execution_logs 
FOR SELECT 
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "System can create execution logs" 
ON public.rule_execution_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage routing templates" 
ON public.routing_templates 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create triggers for updated_at
CREATE TRIGGER update_advisor_teams_updated_at
BEFORE UPDATE ON public.advisor_teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routing_templates_updated_at
BEFORE UPDATE ON public.routing_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert system templates
INSERT INTO public.routing_templates (name, description, category, template_data, is_system_template) VALUES
('Geographic Routing - Canada', 'Route Canadian leads to local advisors', 'geographic', '{
  "conditions": [
    {"type": "location", "field": "country", "operator": "equals", "value": "Canada"}
  ],
  "assignment": {"method": "geography", "fallback": "round_robin"}
}', true),
('High Priority Web Leads', 'Route urgent web leads to top performers', 'score', '{
  "conditions": [
    {"type": "source", "field": "source", "operator": "in", "value": ["web", "forms"]},
    {"type": "score", "field": "priority", "operator": "in", "value": ["urgent", "high"]}
  ],
  "assignment": {"method": "performance", "tier": "A"}
}', true),
('Program-Based Routing', 'Route by program interest', 'program', '{
  "conditions": [
    {"type": "program", "field": "program_interest", "operator": "contains", "value": ["Health Care Assistant"]}
  ],
  "assignment": {"method": "team_based", "specialization": "healthcare"}
}', true);