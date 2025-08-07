-- Create master records table to track all records across stages
CREATE TABLE public.master_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  current_stage TEXT NOT NULL CHECK (current_stage IN ('lead', 'applicant', 'student')),
  current_substage TEXT,
  source TEXT NOT NULL,
  source_details TEXT,
  program_interest TEXT[],
  tags TEXT[],
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer_url TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  stage_entered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stage history table for audit trail
CREATE TABLE public.stage_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  master_record_id UUID NOT NULL REFERENCES public.master_records(id) ON DELETE CASCADE,
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  from_substage TEXT,
  to_substage TEXT,
  transition_reason TEXT,
  transitioned_by UUID,
  transitioned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applicants table for the middle stage
CREATE TABLE public.applicants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  master_record_id UUID NOT NULL REFERENCES public.master_records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  application_type TEXT NOT NULL DEFAULT 'direct' CHECK (application_type IN ('lead_conversion', 'direct_enrollment', 'external_recruiter')),
  substage TEXT NOT NULL DEFAULT 'application_started' CHECK (substage IN ('application_started', 'documents_submitted', 'under_review', 'decision_pending', 'approved', 'rejected')),
  program TEXT NOT NULL,
  documents_submitted JSONB DEFAULT '[]'::jsonb,
  documents_approved JSONB DEFAULT '[]'::jsonb,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'completed', 'refunded')),
  payment_amount NUMERIC,
  decision TEXT CHECK (decision IN ('pending', 'approved', 'rejected', 'waitlisted')),
  decision_date TIMESTAMP WITH TIME ZONE,
  decision_notes TEXT,
  recruiter_id UUID,
  recruiter_company_id UUID,
  application_deadline TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notes TEXT,
  assigned_to UUID,
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update students table to reference master records
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS master_record_id UUID REFERENCES public.master_records(id) ON DELETE CASCADE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS substage TEXT DEFAULT 'enrolled' CHECK (substage IN ('enrolled', 'orientation', 'active', 'graduated', 'alumni', 'withdrawn'));
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS student_id_number TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS enrollment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS academic_progress NUMERIC DEFAULT 0;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high'));
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS graduation_timeline TIMESTAMP WITH TIME ZONE;

-- Update leads table to reference master records  
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS master_record_id UUID REFERENCES public.master_records(id) ON DELETE CASCADE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS substage TEXT DEFAULT 'new_inquiry' CHECK (substage IN ('new_inquiry', 'qualification', 'nurturing', 'ready_to_apply'));

-- Create custom fields table for stage-specific fields
CREATE TABLE public.custom_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('lead', 'applicant', 'student')),
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'textarea', 'number', 'date', 'select', 'multiselect', 'checkbox', 'radio')),
  field_label TEXT NOT NULL,
  field_options JSONB DEFAULT '[]'::jsonb,
  is_required BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stage, field_name)
);

-- Create substages configuration table
CREATE TABLE public.stage_substages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('lead', 'applicant', 'student')),
  substage_key TEXT NOT NULL,
  substage_name TEXT NOT NULL,
  substage_description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  transition_criteria JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stage, substage_key)
);

-- Enable RLS on all new tables
ALTER TABLE public.master_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_substages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for master_records
CREATE POLICY "Users can manage their own master records" ON public.master_records
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for stage_history
CREATE POLICY "Users can view stage history for their records" ON public.stage_history
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.master_records 
    WHERE master_records.id = stage_history.master_record_id 
    AND master_records.user_id = auth.uid()
  ));

CREATE POLICY "Users can create stage history for their records" ON public.stage_history
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.master_records 
    WHERE master_records.id = stage_history.master_record_id 
    AND master_records.user_id = auth.uid()
  ));

-- Create RLS policies for applicants
CREATE POLICY "Users can manage their own applicants" ON public.applicants
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for custom_fields
CREATE POLICY "Users can manage their own custom fields" ON public.custom_fields
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for stage_substages
CREATE POLICY "Users can manage their own stage substages" ON public.stage_substages
  FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_master_records_updated_at
  BEFORE UPDATE ON public.master_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON public.applicants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_fields_updated_at
  BEFORE UPDATE ON public.custom_fields
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stage_substages_updated_at
  BEFORE UPDATE ON public.stage_substages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();