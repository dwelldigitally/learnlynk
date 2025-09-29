-- Create the missing tables with proper syntax for PostgreSQL

-- Create student_batches table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.student_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  batch_name TEXT NOT NULL,
  program_id UUID,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_batches
ALTER TABLE public.student_batches ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "Users can manage their own student batches" ON public.student_batches;
CREATE POLICY "Users can manage their own student batches"
ON public.student_batches
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create batch_students table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.batch_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL,
  assignment_id UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(batch_id, assignment_id)
);

-- Enable RLS on batch_students
ALTER TABLE public.batch_students ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "Users can manage students for their own batches" ON public.batch_students;
CREATE POLICY "Users can manage students for their own batches"
ON public.batch_students
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.student_batches sb 
    WHERE sb.id = batch_students.batch_id 
    AND sb.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.student_batches sb 
    WHERE sb.id = batch_students.batch_id 
    AND sb.user_id = auth.uid()
  )
);

-- Create site_capacity_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_capacity_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL,
  program_id UUID NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 0,
  current_assignments INTEGER NOT NULL DEFAULT 0,
  available_spots INTEGER NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(site_id, program_id, period_start, period_end)
);

-- Enable RLS on site_capacity_tracking
ALTER TABLE public.site_capacity_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "Users can manage capacity for their own sites" ON public.site_capacity_tracking;
CREATE POLICY "Users can manage capacity for their own sites"
ON public.site_capacity_tracking
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.practicum_sites ps 
    WHERE ps.id = site_capacity_tracking.site_id 
    AND ps.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.practicum_sites ps 
    WHERE ps.id = site_capacity_tracking.site_id 
    AND ps.user_id = auth.uid()
  )
);

-- Update practicum_assignments to ensure proper structure
ALTER TABLE public.practicum_assignments 
ADD COLUMN IF NOT EXISTS batch_id UUID;

-- Create triggers for automatic timestamp updates using existing function
DROP TRIGGER IF EXISTS update_student_batches_updated_at ON public.student_batches;
CREATE TRIGGER update_student_batches_updated_at
  BEFORE UPDATE ON public.student_batches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_capacity_tracking_updated_at ON public.site_capacity_tracking;
CREATE TRIGGER update_site_capacity_tracking_updated_at
  BEFORE UPDATE ON public.site_capacity_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();