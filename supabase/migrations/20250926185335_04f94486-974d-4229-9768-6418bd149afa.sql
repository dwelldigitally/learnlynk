-- Add a junction table to link practicum sites with programs (many-to-many relationship)
CREATE TABLE public.practicum_site_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID NOT NULL REFERENCES practicum_sites(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES practicum_programs(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(site_id, program_id)
);

-- Enable RLS
ALTER TABLE public.practicum_site_programs ENABLE ROW LEVEL SECURITY;

-- Create policies for practicum_site_programs
CREATE POLICY "Users can manage their own site-program links" 
ON public.practicum_site_programs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM practicum_sites ps 
    WHERE ps.id = practicum_site_programs.site_id 
    AND ps.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_practicum_site_programs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_practicum_site_programs_updated_at
BEFORE UPDATE ON public.practicum_site_programs
FOR EACH ROW
EXECUTE FUNCTION public.update_practicum_site_programs_updated_at();