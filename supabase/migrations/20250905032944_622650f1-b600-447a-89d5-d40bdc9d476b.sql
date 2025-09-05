-- Create documents table for lead documents (if not exists)
CREATE TABLE IF NOT EXISTS public.lead_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'approved', 'rejected', 'missing')),
  upload_date TIMESTAMP WITH TIME ZONE,
  required BOOLEAN DEFAULT false,
  ai_insight TEXT,
  admin_comments TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create academic journey stages table
CREATE TABLE IF NOT EXISTS public.academic_journey_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  auto_progression_rules JSONB DEFAULT '{}',
  estimated_duration_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead academic journeys table
CREATE TABLE IF NOT EXISTS public.lead_academic_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  journey_name TEXT NOT NULL,
  current_stage_id UUID REFERENCES public.academic_journey_stages(id),
  current_stage_name TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  estimated_completion_date DATE,
  next_required_action TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journey stage progress table
CREATE TABLE IF NOT EXISTS public.lead_journey_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  journey_id UUID NOT NULL REFERENCES public.lead_academic_journeys(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.academic_journey_stages(id),
  stage_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.lead_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_journey_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_academic_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_journey_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lead_documents
DROP POLICY IF EXISTS "Users can manage documents for their leads" ON public.lead_documents;
CREATE POLICY "Users can manage documents for their leads" 
ON public.lead_documents 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for academic_journey_stages
DROP POLICY IF EXISTS "Users can manage their own journey stages" ON public.academic_journey_stages;
CREATE POLICY "Users can manage their own journey stages" 
ON public.academic_journey_stages 
FOR ALL 
USING (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Create RLS policies for lead_academic_journeys
DROP POLICY IF EXISTS "Users can manage journeys for their leads" ON public.lead_academic_journeys;
CREATE POLICY "Users can manage journeys for their leads" 
ON public.lead_academic_journeys 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for lead_journey_progress
DROP POLICY IF EXISTS "Users can manage journey progress for their leads" ON public.lead_journey_progress;
CREATE POLICY "Users can manage journey progress for their leads" 
ON public.lead_journey_progress 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.lead_academic_journeys laj 
  WHERE laj.id = lead_journey_progress.journey_id 
  AND laj.user_id = auth.uid()
));

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_lead_documents_updated_at ON public.lead_documents;
CREATE TRIGGER update_lead_documents_updated_at
BEFORE UPDATE ON public.lead_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_academic_journey_stages_updated_at ON public.academic_journey_stages;
CREATE TRIGGER update_academic_journey_stages_updated_at
BEFORE UPDATE ON public.academic_journey_stages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_lead_academic_journeys_updated_at ON public.lead_academic_journeys;
CREATE TRIGGER update_lead_academic_journeys_updated_at
BEFORE UPDATE ON public.lead_academic_journeys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_lead_journey_progress_updated_at ON public.lead_journey_progress;
CREATE TRIGGER update_lead_journey_progress_updated_at
BEFORE UPDATE ON public.lead_journey_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default academic journey stages (only if they don't exist)
INSERT INTO public.academic_journey_stages (user_id, name, description, order_index, estimated_duration_days) 
SELECT '00000000-0000-0000-0000-000000000000'::uuid, stage_name, stage_description, stage_order, duration_days
FROM (VALUES 
  ('Inquiry', 'Initial student inquiry and interest capture', 1, 1),
  ('Qualification', 'Student qualification and needs assessment', 2, 3),
  ('Nurturing', 'Relationship building and program education', 3, 14),
  ('Application Initiated', 'Student has started the application process', 4, 7),
  ('Application Submitted', 'Complete application has been submitted', 5, 1),
  ('Documents Pending / Submitted', 'Required documents collection and verification', 6, 14),
  ('Interview / Counseling', 'Student interview and academic counseling session', 7, 7),
  ('Offer Sent', 'Admission offer has been sent to student', 8, 1),
  ('Offer Accepted', 'Student has accepted the admission offer', 9, 7),
  ('Enrollment Confirmed', 'Enrollment process completed and confirmed', 10, 3),
  ('Orientation & Onboarding', 'Student orientation and onboarding process', 11, 7),
  ('Enrolled / Active', 'Student is actively enrolled and attending', 12, null)
) AS v(stage_name, stage_description, stage_order, duration_days)
WHERE NOT EXISTS (
  SELECT 1 FROM public.academic_journey_stages 
  WHERE name = v.stage_name 
  AND user_id = '00000000-0000-0000-0000-000000000000'::uuid
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lead_documents_lead_id ON public.lead_documents(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_documents_status ON public.lead_documents(status);

CREATE INDEX IF NOT EXISTS idx_lead_academic_journeys_lead_id ON public.lead_academic_journeys(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_journey_progress_journey_id ON public.lead_journey_progress(journey_id);
CREATE INDEX IF NOT EXISTS idx_lead_journey_progress_stage_id ON public.lead_journey_progress(stage_id);