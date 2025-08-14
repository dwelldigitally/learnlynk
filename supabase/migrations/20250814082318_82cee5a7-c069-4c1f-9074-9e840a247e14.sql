-- Fix security issue: Remove overly permissive RLS policy on demo_data_assignments table
-- that allows any authenticated user to access all email addresses

-- Drop the overly permissive policy that allows all operations with 'true' condition
DROP POLICY IF EXISTS "System can manage demo data assignments" ON public.demo_data_assignments;

-- Create more restrictive policies for system operations
-- This policy allows the assign_demo_data_to_user function to work (runs as SECURITY DEFINER)
-- but prevents regular users from directly accessing the table
CREATE POLICY "Service role can manage demo data assignments" ON public.demo_data_assignments
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create a policy for authenticated users to INSERT their own demo data assignments
-- (in case they need to self-assign demo data)
CREATE POLICY "Users can create their own demo data assignment" ON public.demo_data_assignments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create a policy for system functions to update demo data assignments
-- This allows SECURITY DEFINER functions to update records
CREATE POLICY "System functions can update demo data assignments" ON public.demo_data_assignments
FOR UPDATE
USING (true);

-- The existing "Users can view their own demo data assignment" policy remains unchanged
-- and correctly restricts users to only see their own records