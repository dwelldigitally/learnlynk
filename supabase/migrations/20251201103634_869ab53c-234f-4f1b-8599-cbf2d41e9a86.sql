-- Add preferred_intake_id and academic_term_id columns to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS preferred_intake_id UUID REFERENCES public.intakes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS academic_term_id UUID REFERENCES public.academic_terms(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_leads_preferred_intake_id ON public.leads(preferred_intake_id);
CREATE INDEX IF NOT EXISTS idx_leads_academic_term_id ON public.leads(academic_term_id);

-- Add comments for documentation
COMMENT ON COLUMN public.leads.preferred_intake_id IS 'Reference to the preferred intake date for this lead';
COMMENT ON COLUMN public.leads.academic_term_id IS 'Reference to the academic term for this lead';