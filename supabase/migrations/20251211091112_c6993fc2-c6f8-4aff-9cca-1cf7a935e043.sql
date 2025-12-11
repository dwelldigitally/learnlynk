-- Add enhanced columns to plays table for workflow execution
ALTER TABLE public.plays 
ADD COLUMN IF NOT EXISTS enrollment_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS schedule_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS goal_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS execution_stats JSONB DEFAULT '{"total_enrolled": 0, "completed": 0, "active": 0, "exited": 0}';

-- Create workflow_enrollments table to track lead enrollment in workflows
CREATE TABLE IF NOT EXISTS public.workflow_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.plays(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  current_step_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'exited', 'failed')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  exited_at TIMESTAMP WITH TIME ZONE,
  exit_reason TEXT,
  step_history JSONB DEFAULT '[]',
  next_step_scheduled_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(workflow_id, lead_id)
);

-- Create workflow_step_executions table to track individual step executions
CREATE TABLE IF NOT EXISTS public.workflow_step_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES public.workflow_enrollments(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL,
  step_type TEXT NOT NULL,
  step_config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'executing', 'completed', 'failed', 'skipped')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  result JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workflow_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_step_executions ENABLE ROW LEVEL SECURITY;

-- RLS policies for workflow_enrollments
CREATE POLICY "Users can view their own workflow enrollments"
ON public.workflow_enrollments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create workflow enrollments"
ON public.workflow_enrollments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflow enrollments"
ON public.workflow_enrollments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflow enrollments"
ON public.workflow_enrollments FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for workflow_step_executions (through enrollment ownership)
CREATE POLICY "Users can view step executions for their enrollments"
ON public.workflow_step_executions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.workflow_enrollments 
  WHERE id = workflow_step_executions.enrollment_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create step executions for their enrollments"
ON public.workflow_step_executions FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.workflow_enrollments 
  WHERE id = workflow_step_executions.enrollment_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update step executions for their enrollments"
ON public.workflow_step_executions FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.workflow_enrollments 
  WHERE id = workflow_step_executions.enrollment_id 
  AND user_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workflow_enrollments_workflow_id ON public.workflow_enrollments(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_enrollments_lead_id ON public.workflow_enrollments(lead_id);
CREATE INDEX IF NOT EXISTS idx_workflow_enrollments_status ON public.workflow_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_workflow_enrollments_next_step ON public.workflow_enrollments(next_step_scheduled_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_workflow_step_executions_enrollment ON public.workflow_step_executions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_workflow_step_executions_status ON public.workflow_step_executions(status);

-- Trigger for updated_at
CREATE TRIGGER update_workflow_enrollments_updated_at
BEFORE UPDATE ON public.workflow_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();