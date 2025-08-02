-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  program TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'LEAD_FORM',
  acceptance_likelihood NUMERIC DEFAULT 0,
  risk_level TEXT DEFAULT 'low',
  progress NUMERIC DEFAULT 0,
  lead_score INTEGER DEFAULT 0,
  country TEXT,
  city TEXT,
  state TEXT,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students
CREATE POLICY "Users can view their own students" 
ON public.students 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own students" 
ON public.students 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own students" 
ON public.students 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own students" 
ON public.students 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create student_communications table
CREATE TABLE public.student_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id UUID NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound',
  status TEXT NOT NULL DEFAULT 'sent',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_communications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for communications
CREATE POLICY "Users can view their own student communications" 
ON public.student_communications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own student communications" 
ON public.student_communications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student communications" 
ON public.student_communications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own student communications" 
ON public.student_communications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create student_documents table
CREATE TABLE public.student_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Users can view their own student documents" 
ON public.student_documents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own student documents" 
ON public.student_documents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student documents" 
ON public.student_documents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own student documents" 
ON public.student_documents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create scholarship_applications table
CREATE TABLE public.scholarship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  scholarship_name TEXT NOT NULL,
  scholarship_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  application_date DATE NOT NULL,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'submitted',
  eligibility_score NUMERIC,
  documents_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for scholarship applications
CREATE POLICY "Users can view their own scholarship applications" 
ON public.scholarship_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scholarship applications" 
ON public.scholarship_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scholarship applications" 
ON public.scholarship_applications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scholarship applications" 
ON public.scholarship_applications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_communications_updated_at
  BEFORE UPDATE ON public.student_communications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_documents_updated_at
  BEFORE UPDATE ON public.student_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarship_applications_updated_at
  BEFORE UPDATE ON public.scholarship_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();