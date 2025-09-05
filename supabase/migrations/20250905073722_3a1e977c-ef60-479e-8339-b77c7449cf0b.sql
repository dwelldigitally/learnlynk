-- Create storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
SELECT 'lead-documents', 'lead-documents', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'lead-documents');

-- Add foreign key column to lead_documents table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lead_documents' AND column_name = 'requirement_id') THEN
    ALTER TABLE public.lead_documents ADD COLUMN requirement_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lead_documents' AND column_name = 'original_filename') THEN
    ALTER TABLE public.lead_documents ADD COLUMN original_filename TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lead_documents' AND column_name = 'admin_status') THEN
    ALTER TABLE public.lead_documents ADD COLUMN admin_status TEXT DEFAULT 'pending';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lead_documents' AND column_name = 'admin_reviewed_by') THEN
    ALTER TABLE public.lead_documents ADD COLUMN admin_reviewed_by UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lead_documents' AND column_name = 'admin_reviewed_at') THEN
    ALTER TABLE public.lead_documents ADD COLUMN admin_reviewed_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create storage policies if they don't exist
DO $$
BEGIN
  -- Check if policies exist and create them if they don't
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload lead documents') THEN
    CREATE POLICY "Users can upload lead documents" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'lead-documents' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can view their lead documents') THEN
    CREATE POLICY "Users can view their lead documents" ON storage.objects
    FOR SELECT USING (
      bucket_id = 'lead-documents' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update their lead documents') THEN
    CREATE POLICY "Users can update their lead documents" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'lead-documents' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete their lead documents') THEN
    CREATE POLICY "Users can delete their lead documents" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'lead-documents' AND
      auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- Update programs with document requirements for MLA, HCA, and CS
UPDATE public.programs 
SET document_requirements = jsonb_build_array(
  jsonb_build_object(
    'id', 'transcript',
    'name', 'Official Transcripts',
    'type', 'transcript',
    'description', 'Official transcripts from all post-secondary institutions attended',
    'required', true,
    'order', 1
  ),
  jsonb_build_object(
    'id', 'statement',
    'name', 'Statement of Purpose',
    'type', 'essay',
    'description', 'Personal statement outlining academic and professional goals',
    'required', true,
    'order', 2
  ),
  jsonb_build_object(
    'id', 'portfolio',
    'name', 'Portfolio',
    'type', 'portfolio',
    'description', 'Design portfolio showcasing creative work',
    'required', true,
    'order', 3
  ),
  jsonb_build_object(
    'id', 'recommendation',
    'name', 'Letters of Recommendation',
    'type', 'recommendation',
    'description', 'Three letters of recommendation from academic or professional references',
    'required', true,
    'order', 4
  ),
  jsonb_build_object(
    'id', 'language',
    'name', 'English Proficiency Test',
    'type', 'language',
    'description', 'IELTS, TOEFL, or equivalent (if applicable)',
    'required', false,
    'order', 5
  ),
  jsonb_build_object(
    'id', 'resume',
    'name', 'CV/Resume',
    'type', 'resume',
    'description', 'Current curriculum vitae or resume',
    'required', true,
    'order', 6
  )
)
WHERE name = 'Master of Landscape Architecture' AND user_id = '6a151e45-8580-4c55-a953-dce232583255';

-- Add HCA program document requirements
INSERT INTO public.programs (user_id, name, type, duration, description, document_requirements)
SELECT 
  '6a151e45-8580-4c55-a953-dce232583255',
  'Health Care Assistant',
  'Certificate',
  '8 months',
  'Certificate program for healthcare assistants',
  jsonb_build_array(
    jsonb_build_object(
      'id', 'diploma',
      'name', 'High School Diploma',
      'type', 'diploma',
      'description', 'Official high school diploma or equivalent',
      'required', true,
      'order', 1
    ),
    jsonb_build_object(
      'id', 'medical',
      'name', 'Medical Certificate',
      'type', 'medical',
      'description', 'Medical fitness certificate from licensed physician',
      'required', true,
      'order', 2
    ),
    jsonb_build_object(
      'id', 'background',
      'name', 'Criminal Record Check',
      'type', 'background',
      'description', 'Clean criminal record check',
      'required', true,
      'order', 3
    ),
    jsonb_build_object(
      'id', 'immunization',
      'name', 'Immunization Records',
      'type', 'medical',
      'description', 'Complete immunization records',
      'required', true,
      'order', 4
    )
  )
WHERE NOT EXISTS (
  SELECT 1 FROM public.programs 
  WHERE name = 'Health Care Assistant' AND user_id = '6a151e45-8580-4c55-a953-dce232583255'
);