-- Create audience templates table
CREATE TABLE IF NOT EXISTS public.audience_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  audience_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT audience_templates_name_user_unique UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.audience_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own audience templates"
  ON public.audience_templates
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own audience templates"
  ON public.audience_templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audience templates"
  ON public.audience_templates
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audience templates"
  ON public.audience_templates
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_audience_templates_updated_at
  BEFORE UPDATE ON public.audience_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_audience_templates_user_id ON public.audience_templates(user_id);
CREATE INDEX idx_audience_templates_created_at ON public.audience_templates(created_at DESC);