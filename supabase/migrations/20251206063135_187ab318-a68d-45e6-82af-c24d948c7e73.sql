-- Create lead_entry_requirements table to track entry requirement status per lead
CREATE TABLE public.lead_entry_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  entry_requirement_id TEXT NOT NULL,
  requirement_title TEXT NOT NULL,
  requirement_type TEXT NOT NULL DEFAULT 'other',
  requirement_description TEXT,
  is_mandatory BOOLEAN DEFAULT true,
  threshold_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  notes TEXT,
  linked_document_id UUID REFERENCES public.lead_documents(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID NOT NULL,
  UNIQUE(lead_id, entry_requirement_id)
);

-- Enable RLS
ALTER TABLE public.lead_entry_requirements ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage their own lead entry requirements"
ON public.lead_entry_requirements
FOR ALL
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_lead_entry_requirements_lead_id ON public.lead_entry_requirements(lead_id);
CREATE INDEX idx_lead_entry_requirements_status ON public.lead_entry_requirements(status);

-- Create trigger for updated_at
CREATE TRIGGER update_lead_entry_requirements_updated_at
BEFORE UPDATE ON public.lead_entry_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();