-- Allow anonymous users to create leads from public forms
CREATE POLICY "Allow anonymous lead creation from public forms" 
ON public.leads 
FOR INSERT 
WITH CHECK (user_id IS NULL);