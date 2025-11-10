-- Create setup_tasks table to track post-onboarding setup progress
CREATE TABLE IF NOT EXISTS public.setup_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT setup_tasks_unique_user_task UNIQUE(user_id, task_id),
  CONSTRAINT setup_tasks_status_check CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped'))
);

-- Add indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_setup_tasks_user_id ON public.setup_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_setup_tasks_status ON public.setup_tasks(status);

-- Add setup tracking columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS setup_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS setup_progress INTEGER DEFAULT 0;

-- Enable RLS for setup_tasks
ALTER TABLE public.setup_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for setup_tasks
CREATE POLICY "Users can view their own setup tasks"
ON public.setup_tasks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own setup tasks"
ON public.setup_tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own setup tasks"
ON public.setup_tasks
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own setup tasks"
ON public.setup_tasks
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_setup_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_setup_tasks_updated_at
BEFORE UPDATE ON public.setup_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_setup_tasks_updated_at();