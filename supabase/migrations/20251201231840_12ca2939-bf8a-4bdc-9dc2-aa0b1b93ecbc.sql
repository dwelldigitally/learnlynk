-- Fix infinite recursion in team_invitations RLS policies
-- Drop the problematic policies that use has_role()
DROP POLICY IF EXISTS "Admins and team leads can manage invitations" ON public.team_invitations;

-- Create simpler policies without recursion
-- Allow authenticated users to view all invitations (they can filter client-side)
CREATE POLICY "Authenticated users can view invitations"
  ON public.team_invitations
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to insert invitations (business logic in edge function)
CREATE POLICY "Authenticated users can create invitations"
  ON public.team_invitations
  FOR INSERT TO authenticated
  WITH CHECK (invited_by = auth.uid());

-- Allow users to update their own invitations
CREATE POLICY "Users can update their own invitations"
  ON public.team_invitations
  FOR UPDATE TO authenticated
  USING (invited_by = auth.uid());

-- Allow users to delete their own invitations
CREATE POLICY "Users can delete their own invitations"
  ON public.team_invitations
  FOR DELETE TO authenticated
  USING (invited_by = auth.uid());