-- Create student_portals table for managing individual student portals
CREATE TABLE public.student_portals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  country TEXT,
  program TEXT NOT NULL,
  intake_date DATE,
  access_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64url'),
  portal_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_portals ENABLE ROW LEVEL SECURITY;

-- Create policies for student portals
CREATE POLICY "Students can view their own portal" 
ON public.student_portals 
FOR SELECT 
USING (true); -- Public read for now, will be secured by access token

CREATE POLICY "System can create student portals" 
ON public.student_portals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage student portals" 
ON public.student_portals 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Extend form_submissions table to link to portals and leads
ALTER TABLE public.form_submissions 
ADD COLUMN student_portal_id UUID REFERENCES public.student_portals(id),
ADD COLUMN lead_id UUID REFERENCES public.leads(id);

-- Create indexes for better performance
CREATE INDEX idx_student_portals_access_token ON public.student_portals(access_token);
CREATE INDEX idx_student_portals_email ON public.student_portals(email);
CREATE INDEX idx_form_submissions_portal_id ON public.form_submissions(student_portal_id);
CREATE INDEX idx_form_submissions_lead_id ON public.form_submissions(lead_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_portals_updated_at
BEFORE UPDATE ON public.student_portals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();