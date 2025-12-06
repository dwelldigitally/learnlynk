-- Add version history columns to lead_documents table
ALTER TABLE public.lead_documents
ADD COLUMN IF NOT EXISTS version integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_document_id uuid REFERENCES public.lead_documents(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_latest boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS superseded_at timestamp with time zone;

-- Create index for faster version queries
CREATE INDEX IF NOT EXISTS idx_lead_documents_parent ON public.lead_documents(parent_document_id);
CREATE INDEX IF NOT EXISTS idx_lead_documents_version ON public.lead_documents(requirement_id, lead_id, is_latest);

-- Comment for clarity
COMMENT ON COLUMN public.lead_documents.version IS 'Version number of this document (1 = original, 2+ = re-uploads)';
COMMENT ON COLUMN public.lead_documents.parent_document_id IS 'Links to the first version of this document for version chain';
COMMENT ON COLUMN public.lead_documents.is_latest IS 'Whether this is the latest version of the document';
COMMENT ON COLUMN public.lead_documents.superseded_at IS 'When this version was replaced by a newer version';