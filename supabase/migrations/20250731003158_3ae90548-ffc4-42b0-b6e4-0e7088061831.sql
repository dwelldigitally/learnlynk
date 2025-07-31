-- Create custom stages table
CREATE TABLE public.custom_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workflows table
CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  trigger_type TEXT NOT NULL, -- 'stage_change', 'time_based', 'condition_based', 'event_based'
  trigger_config JSONB NOT NULL, -- Configuration for triggers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workflow actions table
CREATE TABLE public.workflow_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'send_email', 'send_sms', 'generate_document', 'send_payment_link'
  action_config JSONB NOT NULL, -- Configuration for actions
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workflow executions table for logging
CREATE TABLE public.workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE,
  student_id TEXT, -- Reference to student (could be from external system)
  status TEXT NOT NULL, -- 'pending', 'running', 'completed', 'failed'
  execution_data JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.custom_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

-- Create policies (admin access for now)
CREATE POLICY "Allow all operations for authenticated users" ON public.custom_stages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON public.workflows
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON public.workflow_actions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON public.workflow_executions
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default stages
INSERT INTO public.custom_stages (name, description, order_index, is_default) VALUES
  ('Lead Form', 'Initial application submitted', 1, true),
  ('Send Documents', 'Student needs to submit required documents', 2, true),
  ('Document Approval', 'Documents under review by admissions team', 3, true),
  ('Fee Payment', 'Student needs to pay application/enrollment fees', 4, true),
  ('Accepted', 'Student has been accepted into the program', 5, true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_custom_stages_updated_at
  BEFORE UPDATE ON public.custom_stages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();