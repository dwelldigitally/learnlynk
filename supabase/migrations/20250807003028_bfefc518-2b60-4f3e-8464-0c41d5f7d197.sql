-- Create recruiter companies table
CREATE TABLE public.recruiter_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  assigned_contact UUID,
  commission_rate NUMERIC DEFAULT 0,
  commission_type TEXT DEFAULT 'percentage',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruiter users table
CREATE TABLE public.recruiter_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.recruiter_companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'recruiter' CHECK (role IN ('recruiter', 'company_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruiter applications table
CREATE TABLE public.recruiter_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID NOT NULL REFERENCES public.recruiter_users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.recruiter_companies(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id),
  application_id UUID REFERENCES public.applications(id),
  program TEXT NOT NULL,
  intake_date DATE,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_review', 'approved', 'rejected', 'payment_pending', 'completed')),
  assigned_to UUID,
  commission_amount NUMERIC DEFAULT 0,
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'approved', 'paid')),
  notes_to_registrar TEXT,
  internal_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruiter communications table
CREATE TABLE public.recruiter_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_application_id UUID NOT NULL REFERENCES public.recruiter_applications(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('recruiter', 'internal')),
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruiter documents table
CREATE TABLE public.recruiter_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_application_id UUID NOT NULL REFERENCES public.recruiter_applications(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.recruiter_users(id),
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recruiter_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recruiter_companies
CREATE POLICY "Authenticated users can view recruiter companies"
ON public.recruiter_companies FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage recruiter companies"
ON public.recruiter_companies FOR ALL
USING (auth.role() = 'authenticated');

-- RLS Policies for recruiter_users
CREATE POLICY "Users can view their own recruiter profile"
ON public.recruiter_users FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Company admins can view company users"
ON public.recruiter_users FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.recruiter_users 
    WHERE user_id = auth.uid() AND role = 'company_admin'
  )
);

CREATE POLICY "Authenticated users can manage recruiter users"
ON public.recruiter_users FOR ALL
USING (auth.role() = 'authenticated');

-- RLS Policies for recruiter_applications
CREATE POLICY "Recruiters can view their own applications"
ON public.recruiter_applications FOR SELECT
USING (
  recruiter_id IN (
    SELECT id FROM public.recruiter_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Company admins can view company applications"
ON public.recruiter_applications FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.recruiter_users 
    WHERE user_id = auth.uid() AND role = 'company_admin'
  )
);

CREATE POLICY "Recruiters can create applications"
ON public.recruiter_applications FOR INSERT
WITH CHECK (
  recruiter_id IN (
    SELECT id FROM public.recruiter_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can manage recruiter applications"
ON public.recruiter_applications FOR ALL
USING (auth.role() = 'authenticated');

-- RLS Policies for recruiter_communications
CREATE POLICY "Users can view communications for their applications"
ON public.recruiter_communications FOR SELECT
USING (
  recruiter_application_id IN (
    SELECT id FROM public.recruiter_applications ra
    JOIN public.recruiter_users ru ON ra.recruiter_id = ru.id
    WHERE ru.user_id = auth.uid()
  )
  OR auth.role() = 'authenticated'
);

CREATE POLICY "Users can create communications"
ON public.recruiter_communications FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for recruiter_documents
CREATE POLICY "Users can view documents for their applications"
ON public.recruiter_documents FOR SELECT
USING (
  recruiter_application_id IN (
    SELECT id FROM public.recruiter_applications ra
    JOIN public.recruiter_users ru ON ra.recruiter_id = ru.id
    WHERE ru.user_id = auth.uid()
  )
  OR auth.role() = 'authenticated'
);

CREATE POLICY "Recruiters can upload documents"
ON public.recruiter_documents FOR INSERT
WITH CHECK (
  uploaded_by IN (
    SELECT id FROM public.recruiter_users WHERE user_id = auth.uid()
  )
);

-- Add recruiter tracking to existing tables
ALTER TABLE public.leads ADD COLUMN recruiter_id UUID REFERENCES public.recruiter_users(id);
ALTER TABLE public.leads ADD COLUMN recruiter_company_id UUID REFERENCES public.recruiter_companies(id);

ALTER TABLE public.students ADD COLUMN recruiter_id UUID REFERENCES public.recruiter_users(id);
ALTER TABLE public.students ADD COLUMN recruiter_company_id UUID REFERENCES public.recruiter_companies(id);

ALTER TABLE public.applications ADD COLUMN recruiter_id UUID REFERENCES public.recruiter_users(id);
ALTER TABLE public.applications ADD COLUMN recruiter_company_id UUID REFERENCES public.recruiter_companies(id);

-- Create indexes for performance
CREATE INDEX idx_recruiter_users_company_id ON public.recruiter_users(company_id);
CREATE INDEX idx_recruiter_users_user_id ON public.recruiter_users(user_id);
CREATE INDEX idx_recruiter_applications_recruiter_id ON public.recruiter_applications(recruiter_id);
CREATE INDEX idx_recruiter_applications_company_id ON public.recruiter_applications(company_id);
CREATE INDEX idx_recruiter_applications_status ON public.recruiter_applications(status);
CREATE INDEX idx_recruiter_communications_application_id ON public.recruiter_communications(recruiter_application_id);
CREATE INDEX idx_recruiter_documents_application_id ON public.recruiter_documents(recruiter_application_id);

-- Create trigger for updated_at columns
CREATE TRIGGER update_recruiter_companies_updated_at
BEFORE UPDATE ON public.recruiter_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiter_users_updated_at
BEFORE UPDATE ON public.recruiter_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiter_applications_updated_at
BEFORE UPDATE ON public.recruiter_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiter_documents_updated_at
BEFORE UPDATE ON public.recruiter_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();