-- Create student batches table for grouping students
CREATE TABLE public.student_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  batch_name TEXT NOT NULL,
  program_id UUID REFERENCES public.practicum_programs(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived'))
);

-- Create batch student members table
CREATE TABLE public.batch_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.student_batches(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES public.practicum_assignments(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(batch_id, assignment_id)
);

-- Create scheduling sessions to track bulk operations
CREATE TABLE public.scheduling_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_name TEXT NOT NULL,
  batch_id UUID REFERENCES public.student_batches(id),
  total_students INTEGER NOT NULL DEFAULT 0,
  assigned_students INTEGER NOT NULL DEFAULT 0,
  session_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled'))
);

-- Add capacity column to practicum_site_programs if not exists
ALTER TABLE public.practicum_site_programs 
ADD COLUMN IF NOT EXISTS max_students_per_term INTEGER DEFAULT 10;

-- Create site capacity tracking
CREATE TABLE public.site_capacity_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL REFERENCES public.practicum_sites(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.practicum_programs(id) ON DELETE CASCADE,
  max_capacity INTEGER NOT NULL DEFAULT 10,
  current_assignments INTEGER NOT NULL DEFAULT 0,
  available_spots INTEGER GENERATED ALWAYS AS (max_capacity - current_assignments) STORED,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(site_id, program_id, period_start, period_end)
);

-- Create scheduling preferences
CREATE TABLE public.scheduling_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  preference_type TEXT NOT NULL,
  preference_value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, preference_type)
);

-- Enable RLS
ALTER TABLE public.student_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_capacity_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for student_batches
CREATE POLICY "Users can manage their own student batches"
ON public.student_batches
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for batch_students
CREATE POLICY "Users can manage batch students for their batches"
ON public.batch_students
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.student_batches sb
    WHERE sb.id = batch_students.batch_id
    AND sb.user_id = auth.uid()
  )
);

-- Create RLS policies for scheduling_sessions
CREATE POLICY "Users can manage their own scheduling sessions"
ON public.scheduling_sessions
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for site_capacity_tracking
CREATE POLICY "Users can manage site capacity tracking"
ON public.site_capacity_tracking
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.practicum_sites ps
    WHERE ps.id = site_capacity_tracking.site_id
    AND ps.user_id = auth.uid()
  )
);

-- Create RLS policies for scheduling_preferences
CREATE POLICY "Users can manage their own scheduling preferences"
ON public.scheduling_preferences
FOR ALL
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_student_batches_updated_at
    BEFORE UPDATE ON public.student_batches
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_capacity_tracking_updated_at
    BEFORE UPDATE ON public.site_capacity_tracking
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduling_preferences_updated_at
    BEFORE UPDATE ON public.scheduling_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing site-program relationships with capacity
UPDATE public.practicum_site_programs 
SET max_students_per_term = 10
WHERE max_students_per_term IS NULL;

-- Insert initial site capacity tracking data
INSERT INTO public.site_capacity_tracking (site_id, program_id, max_capacity, current_assignments, period_start, period_end)
SELECT 
    psp.site_id,
    psp.program_id,
    COALESCE(psp.max_students_per_term, 10) as max_capacity,
    0 as current_assignments,
    CURRENT_DATE as period_start,
    CURRENT_DATE + INTERVAL '6 months' as period_end
FROM public.practicum_site_programs psp
WHERE psp.is_active = true
ON CONFLICT (site_id, program_id, period_start, period_end) DO NOTHING;