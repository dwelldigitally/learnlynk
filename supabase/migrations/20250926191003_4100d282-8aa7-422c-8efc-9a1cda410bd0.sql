-- Create preceptors table linked to practicum sites
CREATE TABLE public.preceptors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  site_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  title TEXT,
  department TEXT,
  specialization TEXT,
  years_experience INTEGER,
  license_number TEXT,
  license_expiry DATE,
  is_primary_contact BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  max_students INTEGER DEFAULT 3,
  current_students INTEGER DEFAULT 0,
  availability_notes TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  bio TEXT,
  qualifications JSONB DEFAULT '[]',
  schedule_preferences JSONB DEFAULT '{}',
  communication_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.preceptors ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for preceptors
CREATE POLICY "Users can manage preceptors for their sites"
ON public.preceptors
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.practicum_sites ps 
    WHERE ps.id = preceptors.site_id 
    AND ps.user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_preceptors_user_id ON public.preceptors(user_id);
CREATE INDEX idx_preceptors_site_id ON public.preceptors(site_id);
CREATE INDEX idx_preceptors_email ON public.preceptors(email);
CREATE INDEX idx_preceptors_is_active ON public.preceptors(is_active);

-- Add trigger for updated_at
CREATE TRIGGER update_preceptors_updated_at
BEFORE UPDATE ON public.preceptors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraint
ALTER TABLE public.preceptors 
ADD CONSTRAINT fk_preceptors_site_id 
FOREIGN KEY (site_id) REFERENCES public.practicum_sites(id) ON DELETE CASCADE;