-- Phase 1: Practicum Management Database Schema

-- Create practicum sites table
CREATE TABLE public.practicum_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  max_capacity_per_month INTEGER DEFAULT 0,
  max_capacity_per_semester INTEGER DEFAULT 0,
  max_capacity_per_year INTEGER DEFAULT 0,
  specializations TEXT[],
  requirements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practicum programs table
CREATE TABLE public.practicum_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_name TEXT NOT NULL,
  total_hours_required INTEGER NOT NULL DEFAULT 0,
  weeks_duration INTEGER,
  competencies_required JSONB DEFAULT '[]'::jsonb,
  documents_required JSONB DEFAULT '[]'::jsonb,
  evaluation_criteria JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practicum journeys table
CREATE TABLE public.practicum_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id UUID REFERENCES public.practicum_programs(id) ON DELETE CASCADE,
  journey_name TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practicum assignments table
CREATE TABLE public.practicum_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.practicum_programs(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.practicum_sites(id) ON DELETE CASCADE,
  journey_id UUID REFERENCES public.practicum_journeys(id) ON DELETE SET NULL,
  instructor_id UUID,
  preceptor_id UUID,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'active', 'completed', 'suspended', 'cancelled')),
  current_step INTEGER DEFAULT 1,
  hours_completed INTEGER DEFAULT 0,
  hours_approved INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practicum records table (for attendance, competencies, journals)
CREATE TABLE public.practicum_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.practicum_assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('attendance', 'competency', 'journal', 'evaluation')),
  record_date DATE NOT NULL,
  hours_submitted DECIMAL(4,2),
  time_in TIME,
  time_out TIME,
  competency_id TEXT,
  competency_name TEXT,
  journal_content TEXT,
  evaluation_data JSONB,
  student_notes TEXT,
  preceptor_status TEXT DEFAULT 'pending' CHECK (preceptor_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  preceptor_id UUID,
  preceptor_feedback TEXT,
  preceptor_approved_at TIMESTAMP WITH TIME ZONE,
  instructor_status TEXT DEFAULT 'pending' CHECK (instructor_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  instructor_id UUID,
  instructor_feedback TEXT,
  instructor_approved_at TIMESTAMP WITH TIME ZONE,
  final_status TEXT DEFAULT 'pending' CHECK (final_status IN ('pending', 'approved', 'rejected')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practicum evaluations table
CREATE TABLE public.practicum_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.practicum_assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  evaluation_type TEXT NOT NULL CHECK (evaluation_type IN ('midterm', 'final', 'weekly')),
  student_self_evaluation JSONB,
  preceptor_evaluation JSONB,
  instructor_evaluation JSONB,
  overall_rating TEXT,
  competencies_evaluation JSONB DEFAULT '[]'::jsonb,
  strengths TEXT,
  areas_for_improvement TEXT,
  recommendations TEXT,
  is_completed BOOLEAN DEFAULT false,
  due_date DATE,
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practicum competencies table
CREATE TABLE public.practicum_competencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id UUID REFERENCES public.practicum_programs(id) ON DELETE CASCADE,
  competency_name TEXT NOT NULL,
  competency_description TEXT,
  category TEXT,
  required_occurrences INTEGER DEFAULT 1,
  rubric_criteria JSONB DEFAULT '[]'::jsonb,
  is_required BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practicum user roles table
CREATE TABLE public.practicum_user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role_type TEXT NOT NULL CHECK (role_type IN ('instructor', 'preceptor', 'scheduler', 'manager')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  specializations TEXT[],
  site_ids UUID[],
  is_active BOOLEAN DEFAULT true,
  max_students_per_semester INTEGER,
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.practicum_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practicum_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practicum_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practicum_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practicum_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practicum_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practicum_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practicum_user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can manage their own practicum sites" ON public.practicum_sites
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own practicum programs" ON public.practicum_programs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own practicum journeys" ON public.practicum_journeys
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage practicum assignments for their students" ON public.practicum_assignments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Students can view their own practicum records" ON public.practicum_records
  FOR SELECT USING (
    student_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.practicum_assignments pa 
      WHERE pa.id = assignment_id AND pa.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create their own practicum records" ON public.practicum_records
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Instructors and preceptors can manage records for their students" ON public.practicum_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.practicum_assignments pa 
      WHERE pa.id = assignment_id AND (
        pa.user_id = auth.uid() OR 
        pa.instructor_id = auth.uid() OR 
        pa.preceptor_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage evaluations for their students" ON public.practicum_evaluations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.practicum_assignments pa 
      WHERE pa.id = assignment_id AND pa.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own practicum competencies" ON public.practicum_competencies
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage practicum user roles" ON public.practicum_user_roles
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_practicum_assignments_lead_id ON public.practicum_assignments(lead_id);
CREATE INDEX idx_practicum_assignments_site_id ON public.practicum_assignments(site_id);
CREATE INDEX idx_practicum_assignments_status ON public.practicum_assignments(status);
CREATE INDEX idx_practicum_records_assignment_id ON public.practicum_records(assignment_id);
CREATE INDEX idx_practicum_records_type_status ON public.practicum_records(record_type, final_status);
CREATE INDEX idx_practicum_records_date ON public.practicum_records(record_date);
CREATE INDEX idx_practicum_evaluations_assignment_id ON public.practicum_evaluations(assignment_id);
CREATE INDEX idx_practicum_sites_location ON public.practicum_sites(latitude, longitude);

-- Create triggers for updated_at
CREATE TRIGGER update_practicum_sites_updated_at
  BEFORE UPDATE ON public.practicum_sites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practicum_programs_updated_at
  BEFORE UPDATE ON public.practicum_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practicum_journeys_updated_at
  BEFORE UPDATE ON public.practicum_journeys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practicum_assignments_updated_at
  BEFORE UPDATE ON public.practicum_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practicum_records_updated_at
  BEFORE UPDATE ON public.practicum_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practicum_evaluations_updated_at
  BEFORE UPDATE ON public.practicum_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practicum_competencies_updated_at
  BEFORE UPDATE ON public.practicum_competencies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practicum_user_roles_updated_at
  BEFORE UPDATE ON public.practicum_user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();