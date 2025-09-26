-- Create academic terms table
CREATE TABLE public.academic_terms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  term_type TEXT NOT NULL DEFAULT 'semester', -- semester, quarter, trimester
  academic_year TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  registration_start_date DATE,
  registration_end_date DATE,
  add_drop_deadline DATE,
  withdrawal_deadline DATE,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, completed, cancelled
  is_current BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create academic schedules table
CREATE TABLE public.academic_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_name TEXT NOT NULL,
  description TEXT,
  schedule_type TEXT NOT NULL DEFAULT 'regular', -- regular, intensive, weekend, evening
  time_slots JSONB NOT NULL DEFAULT '[]', -- array of time slot objects
  days_of_week JSONB NOT NULL DEFAULT '[]', -- array of weekdays
  duration_weeks INTEGER DEFAULT 16,
  max_capacity INTEGER DEFAULT 30,
  location_requirements TEXT,
  is_template BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create program term schedules table (linking programs to terms and schedules)
CREATE TABLE public.program_term_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id UUID,
  term_id UUID NOT NULL,
  schedule_id UUID NOT NULL,
  capacity_limit INTEGER DEFAULT 30,
  enrollment_count INTEGER DEFAULT 0,
  prerequisites JSONB DEFAULT '[]',
  special_requirements TEXT,
  instructor_assigned UUID,
  classroom_location TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planned', -- planned, active, full, cancelled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_term_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for academic_terms
CREATE POLICY "Users can manage their own academic terms"
ON public.academic_terms
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for academic_schedules  
CREATE POLICY "Users can manage their own academic schedules"
ON public.academic_schedules
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for program_term_schedules
CREATE POLICY "Users can manage their own program term schedules"
ON public.program_term_schedules
FOR ALL
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_academic_terms_user_id ON public.academic_terms(user_id);
CREATE INDEX idx_academic_terms_academic_year ON public.academic_terms(academic_year);
CREATE INDEX idx_academic_terms_status ON public.academic_terms(status);
CREATE INDEX idx_academic_schedules_user_id ON public.academic_schedules(user_id);
CREATE INDEX idx_program_term_schedules_user_id ON public.program_term_schedules(user_id);
CREATE INDEX idx_program_term_schedules_term_id ON public.program_term_schedules(term_id);
CREATE INDEX idx_program_term_schedules_program_id ON public.program_term_schedules(program_id);

-- Add triggers for updated_at
CREATE TRIGGER update_academic_terms_updated_at
BEFORE UPDATE ON public.academic_terms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_schedules_updated_at
BEFORE UPDATE ON public.academic_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_program_term_schedules_updated_at
BEFORE UPDATE ON public.program_term_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();