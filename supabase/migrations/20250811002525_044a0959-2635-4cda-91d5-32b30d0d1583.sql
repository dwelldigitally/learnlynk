-- Create AI agents configuration table
CREATE TABLE public.ai_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  personality TEXT,
  response_style TEXT NOT NULL DEFAULT 'professional',
  max_concurrent_leads INTEGER NOT NULL DEFAULT 50,
  handoff_threshold INTEGER NOT NULL DEFAULT 75,
  configuration JSONB NOT NULL DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent filter rules table
CREATE TABLE public.ai_agent_filter_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  conditions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent tasks table
CREATE TABLE public.ai_agent_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  is_active BOOLEAN NOT NULL DEFAULT true,
  schedule_config JSONB DEFAULT '{}',
  performance_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_filter_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own AI agents" 
ON public.ai_agents 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage rules for their agents" 
ON public.ai_agent_filter_rules 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM ai_agents 
  WHERE ai_agents.id = ai_agent_filter_rules.agent_id 
  AND ai_agents.user_id = auth.uid()
));

CREATE POLICY "Users can manage tasks for their agents" 
ON public.ai_agent_tasks 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM ai_agents 
  WHERE ai_agents.id = ai_agent_tasks.agent_id 
  AND ai_agents.user_id = auth.uid()
));

-- Create updated_at triggers
CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE ON public.ai_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_agent_filter_rules_updated_at
  BEFORE UPDATE ON public.ai_agent_filter_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_agent_tasks_updated_at
  BEFORE UPDATE ON public.ai_agent_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();