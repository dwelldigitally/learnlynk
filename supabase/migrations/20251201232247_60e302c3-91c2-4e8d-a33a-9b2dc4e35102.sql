-- Fix infinite recursion in user_roles RLS policies
-- First, drop all existing policies on user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can delete their own roles" ON public.user_roles;

-- Create simple non-recursive policies
-- Allow all authenticated users to view roles (client-side filtering)
CREATE POLICY "Authenticated users can view roles"
  ON public.user_roles
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to manage their own roles (for signup flow)
CREATE POLICY "Users can manage own roles"
  ON public.user_roles
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());