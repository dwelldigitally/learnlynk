-- Create entry_requirements table
CREATE TABLE public.entry_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('academic', 'language', 'experience', 'health', 'age', 'other')),
  mandatory BOOLEAN NOT NULL DEFAULT false,
  details TEXT,
  minimum_grade TEXT,
  alternatives TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Custom',
  usage_count INTEGER DEFAULT 0,
  is_system_template BOOLEAN DEFAULT false,
  applicable_programs TEXT[] DEFAULT '{"All Programs"}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.entry_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies for entry requirements
CREATE POLICY "Users can view all entry requirements" 
ON public.entry_requirements 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own entry requirements" 
ON public.entry_requirements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR is_system_template = true);

CREATE POLICY "Users can update their own entry requirements" 
ON public.entry_requirements 
FOR UPDATE 
USING (auth.uid() = user_id OR is_system_template = true);

CREATE POLICY "Users can delete their own entry requirements" 
ON public.entry_requirements 
FOR DELETE 
USING (auth.uid() = user_id AND is_system_template = false);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_entry_requirements_updated_at
BEFORE UPDATE ON public.entry_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some common system templates
INSERT INTO public.entry_requirements (title, description, type, mandatory, details, minimum_grade, alternatives, category, usage_count, is_system_template, applicable_programs) VALUES
('High School Diploma or Equivalent', 'Completion of Grade 12 or equivalent certification (GED)', 'academic', true, 'Must provide official transcripts showing graduation from an accredited high school or equivalent certification.', 'Grade 12', '{"GED Certificate", "International Baccalaureate", "Adult High School Diploma"}', 'Academic', 45, true, '{"All Programs"}'),
('English Proficiency - IELTS', 'International English Language Testing System (IELTS) Academic', 'language', true, 'Minimum overall band score of 6.5 with no individual band below 6.0.', '6.5', '{"TOEFL iBT (80+)", "CAEL (60+)", "PTE Academic (58+)"}', 'Language', 32, true, '{"All Programs - International Students"}'),
('Relevant Work Experience', 'Minimum 2 years of relevant work experience in the field', 'experience', false, 'Employment verification letters and detailed job descriptions required.', null, '{"Volunteer Experience (3 years)", "Internship + Coursework", "Related Field Experience"}', 'Experience', 22, true, '{"Healthcare", "Business", "Technology"}'),
('Medical Clearance', 'Medical examination and clearance from licensed physician', 'health', true, 'Complete physical examination within 6 months of program start date.', null, '{"Nurse Practitioner Assessment", "Occupational Health Assessment"}', 'Health', 25, true, '{"Healthcare", "Childcare", "Food Services"}'),
('Minimum Age - 18 Years', 'Must be at least 18 years of age at program commencement', 'age', true, 'Proof of age required with government-issued photo identification.', null, '{"Mature Student Status (17 with conditions)", "Early Admission Assessment"}', 'Age', 42, true, '{"Most Adult Programs"}'),
('Criminal Background Check', 'Clear criminal background check including vulnerable sector screening', 'other', true, 'Police background check dated within 6 months of program start date.', null, '{"International Police Clearance", "RCMP Check"}', 'Other', 35, true, '{"Healthcare", "Childcare", "Education"}');