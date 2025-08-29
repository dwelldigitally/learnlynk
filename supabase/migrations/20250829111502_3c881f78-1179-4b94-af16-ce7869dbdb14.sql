-- Allow public access to view programs for student applications
CREATE POLICY "Allow public to view open programs" 
ON public.programs 
FOR SELECT 
TO public
USING (enrollment_status IN ('open', 'active'));

-- Allow public access to view intakes for student applications  
CREATE POLICY "Allow public to view open intakes" 
ON public.intakes 
FOR SELECT 
TO public
USING (status = 'open');