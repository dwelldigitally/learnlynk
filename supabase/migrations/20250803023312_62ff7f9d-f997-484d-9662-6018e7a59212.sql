-- Add new JSONB columns to programs table to store rich data structures
ALTER TABLE public.programs 
ADD COLUMN entry_requirements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN document_requirements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN fee_structure JSONB DEFAULT '{}'::jsonb,
ADD COLUMN custom_questions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;

-- Add some indexes for better performance on JSONB columns
CREATE INDEX idx_programs_entry_requirements ON public.programs USING GIN(entry_requirements);
CREATE INDEX idx_programs_document_requirements ON public.programs USING GIN(document_requirements);
CREATE INDEX idx_programs_fee_structure ON public.programs USING GIN(fee_structure);
CREATE INDEX idx_programs_custom_questions ON public.programs USING GIN(custom_questions);