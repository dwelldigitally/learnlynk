-- Create comprehensive application tables
CREATE TABLE IF NOT EXISTS public.student_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  session_id UUID NOT NULL,
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
USING (session_id IN (
  SELECT student_portal_sessions.id
  FROM student_portal_sessions
  WHERE student_portal_sessions.access_token IN (
    SELECT student_portal_access.access_token
    FROM student_portal_access
    WHERE student_portal_access.access_token IS NOT NULL
  )
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
  SELECT id FROM public.student_applications
  WHERE session_id IN (
    SELECT student_portal_sessions.id
    FROM student_portal_sessions
    WHERE student_portal_sessions.access_token IN (
      SELECT student_portal_access.access_token
      FROM student_portal_access
      WHERE student_portal_access.access_token IS NOT NULL
    )
  )
));

CREATE POLICY "Admins can manage essays for their applications" 
ON public.application_essays 
FOR ALL
USING (application_id IN (
  SELECT id FROM public.student_applications sa
  WHERE EXISTS (
    SELECT 1 FROM leads l
    WHERE l.id = sa.lead_id 
    AND l.user_id = auth.uid()
  )
));

-- Create application responses table
CREATE TABLE IF NOT EXISTS public.application_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.student_applications(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer TEXT NOT NULL,
  question_type TEXT NOT NULL,
  category TEXT NOT NULL,
  ai_score INTEGER,
  admin_grade TEXT,
  admin_feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.application_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for application responses
CREATE POLICY "Students can manage responses for their applications" 
ON public.application_responses 
FOR ALL
USING (application_id IN (
  SELECT id FROM public.student_applications
  WHERE session_id IN (
    SELECT student_portal_sessions.id
    FROM student_portal_sessions
    WHERE student_portal_sessions.access_token IN (
      SELECT student_portal_access.access_token
      FROM student_portal_access
      WHERE student_portal_access.access_token IS NOT NULL
    )
  )
));

CREATE POLICY "Admins can manage responses for their applications" 
ON public.application_responses 
FOR ALL
USING (application_id IN (
  SELECT id FROM public.student_applications sa
  WHERE EXISTS (
    SELECT 1 FROM leads l
    WHERE l.id = sa.lead_id 
    AND l.user_id = auth.uid()
  )
));

-- Create application academic background table
CREATE TABLE IF NOT EXISTS public.application_academic_background (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.student_applications(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  gpa DECIMAL,
  max_gpa DECIMAL DEFAULT 4.0,
  graduation_date DATE,
  honors TEXT[],
  relevant_coursework TEXT[],
  transcript_submitted BOOLEAN DEFAULT false,
  transcript_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.application_academic_background ENABLE ROW LEVEL SECURITY;

-- Create policies for academic background
CREATE POLICY "Students can manage academic background for their applications" 
ON public.application_academic_background 
FOR ALL
USING (application_id IN (
  SELECT id FROM public.student_applications
  WHERE session_id IN (
    SELECT student_portal_sessions.id
    FROM student_portal_sessions
    WHERE student_portal_sessions.access_token IN (
      SELECT student_portal_access.access_token
      FROM student_portal_access
      WHERE student_portal_access.access_token IS NOT NULL
    )
  )
));

CREATE POLICY "Admins can manage academic background for their applications" 
ON public.application_academic_background 
FOR ALL
USING (application_id IN (
  SELECT id FROM public.student_applications sa
  WHERE EXISTS (
    SELECT 1 FROM leads l
    WHERE l.id = sa.lead_id 
    AND l.user_id = auth.uid()
  )
));

-- Create application work experience table
CREATE TABLE IF NOT EXISTS public.application_work_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.student_applications(id) ON DELETE CASCADE,
  experience_type TEXT NOT NULL DEFAULT 'professional', -- professional, volunteer, internship
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL,
  skills TEXT[],
  relevance_to_program INTEGER DEFAULT 5, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.application_work_experience ENABLE ROW LEVEL SECURITY;

-- Create policies for work experience
CREATE POLICY "Students can manage work experience for their applications" 
ON public.application_work_experience 
FOR ALL
USING (application_id IN (
  SELECT id FROM public.student_applications
  WHERE session_id IN (
    SELECT student_portal_sessions.id
    FROM student_portal_sessions
    WHERE student_portal_sessions.access_token IN (
      SELECT student_portal_access.access_token
      FROM student_portal_access
      WHERE student_portal_access.access_token IS NOT NULL
    )
  )
));

CREATE POLICY "Admins can manage work experience for their applications" 
ON public.application_work_experience 
FOR ALL
USING (application_id IN (
  SELECT id FROM public.student_applications sa
  WHERE EXISTS (
    SELECT 1 FROM leads l
    WHERE l.id = sa.lead_id 
    AND l.user_id = auth.uid()
  )
));

-- Create application references table
CREATE TABLE IF NOT EXISTS public.application_references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.student_applications(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  institution TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  relationship TEXT NOT NULL,
  submitted BOOLEAN DEFAULT false,
  submission_token TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  reference_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.application_references ENABLE ROW LEVEL SECURITY;

-- Create policies for application references
CREATE POLICY "Students can manage references for their applications" 
ON public.application_references 
FOR ALL
USING (application_id IN (
  SELECT id FROM public.student_applications
  WHERE session_id IN (
    SELECT student_portal_sessions.id
    FROM student_portal_sessions
    WHERE student_portal_sessions.access_token IN (
      SELECT student_portal_access.access_token
      FROM student_portal_access
      WHERE student_portal_access.access_token IS NOT NULL
    )
  )
));

CREATE POLICY "Admins can manage references for their applications" 
ON public.application_references 
FOR ALL
USING (application_id IN (
  SELECT id FROM public.student_applications sa
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

CREATE TRIGGER update_application_responses_updated_at
  BEFORE UPDATE ON public.application_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_application_updated_at();

CREATE TRIGGER update_application_academic_background_updated_at
  BEFORE UPDATE ON public.application_academic_background
  FOR EACH ROW
  EXECUTE FUNCTION public.update_application_updated_at();

CREATE TRIGGER update_application_work_experience_updated_at
  BEFORE UPDATE ON public.application_work_experience
  FOR EACH ROW
  EXECUTE FUNCTION public.update_application_updated_at();

CREATE TRIGGER update_application_references_updated_at
  BEFORE UPDATE ON public.application_references
  FOR EACH ROW
  EXECUTE FUNCTION public.update_application_updated_at();