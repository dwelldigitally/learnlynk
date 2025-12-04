
-- Create custom_reports table for saved reports
CREATE TABLE public.custom_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  data_source TEXT NOT NULL,
  selected_fields JSONB NOT NULL DEFAULT '[]',
  filters JSONB NOT NULL DEFAULT '[]',
  visualization_type TEXT NOT NULL DEFAULT 'table',
  chart_config JSONB DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_reports ENABLE ROW LEVEL SECURITY;

-- Users can manage their own reports
CREATE POLICY "Users can manage their own custom reports"
  ON public.custom_reports
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_custom_reports_user_id ON public.custom_reports(user_id);
CREATE INDEX idx_custom_reports_data_source ON public.custom_reports(data_source);
