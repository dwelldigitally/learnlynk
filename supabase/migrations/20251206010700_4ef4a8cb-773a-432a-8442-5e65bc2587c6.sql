-- Create team_goals table for storing team and individual performance goals
CREATE TABLE public.team_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  goal_name TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('team', 'individual', 'role_based')),
  goal_period TEXT NOT NULL CHECK (goal_period IN ('annual', 'quarterly', 'monthly', 'weekly', 'daily')),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('revenue', 'calls', 'emails', 'activities', 'future_revenue', 'contract_value', 'conversions', 'response_time')),
  target_value NUMERIC NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  assignee_ids UUID[] DEFAULT '{}',
  assignee_names TEXT[] DEFAULT '{}',
  role_filter TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'at_risk', 'on_track', 'off_track', 'archived')),
  description TEXT,
  is_cascading BOOLEAN NOT NULL DEFAULT false,
  parent_goal_id UUID REFERENCES public.team_goals(id) ON DELETE SET NULL,
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_goals ENABLE ROW LEVEL SECURITY;

-- RLS policies - all authenticated users can view team goals
CREATE POLICY "Authenticated users can view team goals" 
ON public.team_goals 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Users can create their own goals
CREATE POLICY "Users can create team goals" 
ON public.team_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own goals
CREATE POLICY "Users can update own goals" 
ON public.team_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own goals
CREATE POLICY "Users can delete own goals" 
ON public.team_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_team_goals_user_id ON public.team_goals(user_id);
CREATE INDEX idx_team_goals_status ON public.team_goals(status);
CREATE INDEX idx_team_goals_goal_type ON public.team_goals(goal_type);
CREATE INDEX idx_team_goals_metric_type ON public.team_goals(metric_type);
CREATE INDEX idx_team_goals_dates ON public.team_goals(start_date, end_date);

-- Create trigger for updated_at
CREATE TRIGGER update_team_goals_updated_at
BEFORE UPDATE ON public.team_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();