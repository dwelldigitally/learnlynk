-- Create simplified application tables using existing structure
CREATE TABLE IF NOT EXISTS public.student_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  student_portal_session_id UUID NOT NULL,
  program_name TEXT NOT NULL,
  program_id UUID,
  intake_date DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  stage TEXT NOT NULL DEFAULT 'personal_info',
  progress INTEGER NOT NULL DEFAULT 0,
  acceptance_likelihood INTEGER,
  application_deadline DATE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  decision_at TIMESTAMP WITH TIME ZONE,
  application_data JSONB DEFAULT '{}'::jsonb,
  payment_status TEXT DEFAULT 'pending',
  payment_amount DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for student applications
CREATE POLICY "Students can manage their own applications" 
ON public.student_applications 
FOR ALL
USING (student_portal_session_id IN (
  SELECT sps.id
  FROM student_portal_sessions sps
  JOIN student_portal_access spa ON sps.access_token = spa.access_token
  WHERE spa.access_token IS NOT NULL
  AND spa.expires_at > now()
  AND spa.status = 'active'
));

CREATE POLICY "Admins can manage applications for their leads" 
ON public.student_applications 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM leads l
  WHERE l.id = student_applications.lead_id 
  AND l.user_id = auth.uid()
));

-- Create application essays table
CREATE TABLE IF NOT EXISTS public.application_essays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.student_applications(id) ON DELETE CASCADE,
  essay_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  admin_grade TEXT,
  admin_feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.application_essays ENABLE ROW LEVEL SECURITY;

-- Create policies for application essays
CREATE POLICY "Students can manage essays for their applications" 
ON public.application_essays 
FOR ALL
USING (application_id IN (
  SELECT sa.id FROM public.student_applications sa
  WHERE sa.student_portal_session_id IN (
    SELECT sps.id
    FROM student_portal_sessions sps
    JOIN student_portal_access spa ON sps.access_token = spa.access_token
    WHERE spa.access_token IS NOT NULL
    AND spa.expires_at > now()
    AND spa.status = 'active'
  )
));

CREATE POLICY "Admins can manage essays for their applications" 
ON public.application_essays 
FOR ALL
USING (application_id IN (
  SELECT sa.id FROM public.student_applications sa
  WHERE EXISTS (
    SELECT 1 FROM leads l
    WHERE l.id = sa.lead_id 
    AND l.user_id = auth.uid()
  )
));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_application_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_student_applications_updated_at
  BEFORE UPDATE ON public.student_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_application_updated_at();

CREATE TRIGGER update_application_essays_updated_at
  BEFORE UPDATE ON public.application_essays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_application_updated_at();