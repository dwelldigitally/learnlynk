-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('lead-documents', 'lead-documents', false);

-- Create programs table
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, code)
);

-- Create program document requirements table
CREATE TABLE public.program_document_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL,
  user_id UUID NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN NOT NULL DEFAULT true,
  acceptance_criteria TEXT,
  max_file_size_mb INTEGER DEFAULT 10,
  allowed_file_types TEXT[] DEFAULT ARRAY['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead documents table
CREATE TABLE public.lead_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  requirement_id UUID,
  user_id UUID NOT NULL,
  document_name TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  upload_status TEXT NOT NULL DEFAULT 'uploaded',
  admin_status TEXT NOT NULL DEFAULT 'pending',
  admin_reviewed_by UUID,
  admin_reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_comments TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for programs
CREATE POLICY "Users can manage their own programs" ON public.programs
FOR ALL USING (auth.uid() = user_id);

-- RLS policies for program document requirements
CREATE POLICY "Users can manage requirements for their programs" ON public.program_document_requirements
FOR ALL USING (auth.uid() = user_id);

-- RLS policies for lead documents
CREATE POLICY "Users can manage documents for their leads" ON public.lead_documents
FOR ALL USING (auth.uid() = user_id);

-- RLS policies for storage
CREATE POLICY "Users can upload lead documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'lead-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their lead documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'lead-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their lead documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'lead-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their lead documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'lead-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add triggers for updated_at
CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_program_document_requirements_updated_at
  BEFORE UPDATE ON public.program_document_requirements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_documents_updated_at
  BEFORE UPDATE ON public.lead_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample programs and requirements
INSERT INTO public.programs (user_id, name, code, description) VALUES
  ('6a151e45-8580-4c55-a953-dce232583255', 'Master of Landscape Architecture', 'MLA', 'Professional degree in landscape architecture'),
  ('6a151e45-8580-4c55-a953-dce232583255', 'Health Care Assistant', 'HCA', 'Certificate program for healthcare assistants'),
  ('6a151e45-8580-4c55-a953-dce232583255', 'Computer Science', 'CS', 'Bachelor degree in computer science');

-- Insert MLA document requirements
INSERT INTO public.program_document_requirements (program_id, user_id, document_name, document_type, description, is_required, order_index) 
SELECT 
  p.id,
  '6a151e45-8580-4c55-a953-dce232583255',
  req.name,
  req.type,
  req.description,
  req.required,
  req.order_idx
FROM public.programs p
CROSS JOIN (VALUES
  ('Official Transcripts', 'transcript', 'Official transcripts from all post-secondary institutions attended', true, 1),
  ('Statement of Purpose', 'essay', 'Personal statement outlining academic and professional goals', true, 2),
  ('Portfolio', 'portfolio', 'Design portfolio showcasing creative work', true, 3),
  ('Letters of Recommendation', 'recommendation', 'Three letters of recommendation from academic or professional references', true, 4),
  ('English Proficiency Test', 'language', 'IELTS, TOEFL, or equivalent (if applicable)', false, 5),
  ('CV/Resume', 'resume', 'Current curriculum vitae or resume', true, 6)
) AS req(name, type, description, required, order_idx)
WHERE p.code = 'MLA';

-- Insert HCA document requirements
INSERT INTO public.program_document_requirements (program_id, user_id, document_name, document_type, description, is_required, order_index)
SELECT 
  p.id,
  '6a151e45-8580-4c55-a953-dce232583255',
  req.name,
  req.type,
  req.description,
  req.required,
  req.order_idx
FROM public.programs p
CROSS JOIN (VALUES
  ('High School Diploma', 'diploma', 'Official high school diploma or equivalent', true, 1),
  ('Medical Certificate', 'medical', 'Medical fitness certificate from licensed physician', true, 2),
  ('Criminal Record Check', 'background', 'Clean criminal record check', true, 3),
  ('English Proficiency Test', 'language', 'IELTS, TOEFL, or equivalent (if applicable)', false, 4),
  ('Immunization Records', 'medical', 'Complete immunization records', true, 5)
) AS req(name, type, description, required, order_idx)
WHERE p.code = 'HCA';

-- Insert CS document requirements
INSERT INTO public.program_document_requirements (program_id, user_id, document_name, document_type, description, is_required, order_index)
SELECT 
  p.id,
  '6a151e45-8580-4c55-a953-dce232583255',
  req.name,
  req.type,
  req.description,
  req.required,
  req.order_idx
FROM public.programs p
CROSS JOIN (VALUES
  ('Official Transcripts', 'transcript', 'Official high school transcripts with mathematics prerequisites', true, 1),
  ('English Proficiency Test', 'language', 'IELTS, TOEFL, or equivalent (if applicable)', false, 2),
  ('Personal Statement', 'essay', 'Statement of interest in computer science', false, 3),
  ('Programming Portfolio', 'portfolio', 'Examples of programming projects (if applicable)', false, 4)
) AS req(name, type, description, required, order_idx)
WHERE p.code = 'CS';