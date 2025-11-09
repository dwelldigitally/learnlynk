-- Create entry_requirements table
CREATE TABLE IF NOT EXISTS public.entry_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('academic', 'language', 'experience', 'health', 'age', 'other')),
  mandatory BOOLEAN NOT NULL DEFAULT true,
  details TEXT,
  minimum_grade TEXT,
  alternatives TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Custom',
  usage_count INTEGER DEFAULT 0,
  is_system_template BOOLEAN DEFAULT false,
  applicable_programs TEXT[] DEFAULT ARRAY['All Programs'],
  linked_document_templates UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for linked_document_templates (GIN index for array queries)
CREATE INDEX IF NOT EXISTS idx_entry_requirements_linked_templates 
  ON public.entry_requirements USING GIN (linked_document_templates);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_entry_requirements_user_id 
  ON public.entry_requirements (user_id);

CREATE INDEX IF NOT EXISTS idx_entry_requirements_type 
  ON public.entry_requirements (type);

CREATE INDEX IF NOT EXISTS idx_entry_requirements_usage_count 
  ON public.entry_requirements (usage_count DESC);

-- Add RLS policies
ALTER TABLE public.entry_requirements ENABLE ROW LEVEL SECURITY;

-- Users can view all entry requirements
CREATE POLICY "Anyone can view entry requirements"
  ON public.entry_requirements
  FOR SELECT
  USING (true);

-- Users can create their own entry requirements
CREATE POLICY "Users can create entry requirements"
  ON public.entry_requirements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own entry requirements
CREATE POLICY "Users can update their own entry requirements"
  ON public.entry_requirements
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own entry requirements
CREATE POLICY "Users can delete their own entry requirements"
  ON public.entry_requirements
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_entry_requirements_updated_at
  BEFORE UPDATE ON public.entry_requirements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.entry_requirements IS 'Stores entry requirements that can be reused across programs';
COMMENT ON COLUMN public.entry_requirements.linked_document_templates IS 'Array of document template IDs that can be used to verify this requirement';