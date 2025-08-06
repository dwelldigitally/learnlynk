-- Create document_templates table for reusable document requirement templates
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'academic', 'language', 'experience', 'health', 'identity', 'financial', 'legal', 'portfolio', 'references', 'other'
  category TEXT NOT NULL,
  mandatory BOOLEAN NOT NULL DEFAULT false,
  accepted_formats TEXT[] NOT NULL DEFAULT ARRAY['pdf'],
  max_size INTEGER NOT NULL DEFAULT 5, -- in MB
  stage TEXT NOT NULL DEFAULT 'application', -- 'application', 'enrollment', 'pre-arrival', 'ongoing'
  instructions TEXT,
  examples TEXT[],
  usage_count INTEGER DEFAULT 0,
  is_system_template BOOLEAN DEFAULT false,
  applicable_programs TEXT[] DEFAULT ARRAY['All Programs'],
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for document templates
CREATE POLICY "Users can view all document templates" 
ON public.document_templates 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own document templates" 
ON public.document_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR is_system_template = true);

CREATE POLICY "Users can update their own document templates" 
ON public.document_templates 
FOR UPDATE 
USING (auth.uid() = user_id OR is_system_template = true);

CREATE POLICY "Users can delete their own document templates" 
ON public.document_templates 
FOR DELETE 
USING (auth.uid() = user_id AND is_system_template = false);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_document_templates_updated_at
BEFORE UPDATE ON public.document_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();