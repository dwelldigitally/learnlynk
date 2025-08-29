-- Fix RLS policy for anonymous lead creation from webform
-- Drop existing policy and recreate with proper conditions
DROP POLICY IF EXISTS "Allow anonymous lead creation from public forms" ON public.leads;

-- Create a clear policy for anonymous webform submissions
CREATE POLICY "Allow anonymous webform submissions" 
ON public.leads 
FOR INSERT 
WITH CHECK (
  user_id IS NULL 
  AND source = 'webform'
);

-- Ensure the existing policy for authenticated users still works
DROP POLICY IF EXISTS "Users can create their own leads" ON public.leads;
CREATE POLICY "Users can create their own leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);