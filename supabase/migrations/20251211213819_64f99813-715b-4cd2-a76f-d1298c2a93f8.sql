-- Create has_permission function for checking user permissions
-- This is a SECURITY DEFINER function to bypass RLS when checking permissions
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Check role-based permissions
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role = ur.role
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id AND p.permission_name = _permission_name
  )
  OR EXISTS (
    -- Check direct user permissions
    SELECT 1 FROM user_permissions up
    JOIN permissions p ON p.id = up.permission_id
    WHERE up.user_id = _user_id AND p.permission_name = _permission_name
  );
$$;

-- Drop the existing permissive delete policy on leads if it exists
DROP POLICY IF EXISTS "Users can delete own leads" ON leads;
DROP POLICY IF EXISTS "allow_delete_leads" ON leads;
DROP POLICY IF EXISTS "delete_leads_with_permission" ON leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON leads;

-- Create permission-based delete policy for leads
-- Users can only delete leads if they have the delete_leads permission
CREATE POLICY "delete_leads_with_permission" ON leads
FOR DELETE
TO authenticated
USING (
  tenant_id = current_tenant_id() 
  AND has_permission(auth.uid(), 'delete_leads')
);