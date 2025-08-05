-- Create automation_rules table
CREATE TABLE public.automation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB NOT NULL DEFAULT '{}',
  conditions JSONB NOT NULL DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automation_executions table
CREATE TABLE public.automation_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID NOT NULL,
  lead_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  execution_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automation_action_logs table
CREATE TABLE public.automation_action_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'completed',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_action_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for automation_rules
CREATE POLICY "Users can manage their own automation rules" 
ON public.automation_rules 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for automation_executions
CREATE POLICY "Users can view executions for their rules" 
ON public.automation_executions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM automation_rules 
  WHERE automation_rules.id = automation_executions.rule_id 
  AND automation_rules.user_id = auth.uid()
));

-- Create RLS policies for automation_action_logs
CREATE POLICY "Users can view action logs for their executions" 
ON public.automation_action_logs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM automation_executions ae
  JOIN automation_rules ar ON ae.rule_id = ar.id
  WHERE ae.id = automation_action_logs.execution_id 
  AND ar.user_id = auth.uid()
));

-- Add indexes for performance
CREATE INDEX idx_automation_rules_user_id ON automation_rules(user_id);
CREATE INDEX idx_automation_rules_trigger_type ON automation_rules(trigger_type);
CREATE INDEX idx_automation_executions_rule_id ON automation_executions(rule_id);
CREATE INDEX idx_automation_executions_lead_id ON automation_executions(lead_id);
CREATE INDEX idx_automation_action_logs_execution_id ON automation_action_logs(execution_id);

-- Add trigger for updated_at
CREATE TRIGGER update_automation_rules_updated_at
  BEFORE UPDATE ON public.automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();