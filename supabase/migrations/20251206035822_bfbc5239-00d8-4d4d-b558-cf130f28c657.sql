-- Add entry_requirement_id column to lead_documents table
ALTER TABLE public.lead_documents 
ADD COLUMN IF NOT EXISTS entry_requirement_id TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.lead_documents.entry_requirement_id IS 'Links document to specific entry requirement it satisfies';

-- Drop existing restrictive storage policies for lead-documents bucket
DROP POLICY IF EXISTS "Users can upload lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update lead documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete lead documents" ON storage.objects;

-- Create new permissive policies for authenticated users on lead-documents bucket
CREATE POLICY "Authenticated users can upload lead documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'lead-documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can view lead documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'lead-documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update lead documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'lead-documents' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete lead documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'lead-documents' AND
  auth.role() = 'authenticated'
);