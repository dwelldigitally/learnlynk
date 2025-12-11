-- Add RLS policies for permission-based access control

-- Leads Table: INSERT policy with permission check
DROP POLICY IF EXISTS "create_leads_with_permission" ON leads;
CREATE POLICY "create_leads_with_permission" ON leads
FOR INSERT TO authenticated
WITH CHECK (
  tenant_id = current_tenant_id() 
  AND has_permission(auth.uid(), 'create_leads')
);

-- Leads Table: UPDATE policy with permission check  
DROP POLICY IF EXISTS "edit_leads_with_permission" ON leads;
CREATE POLICY "edit_leads_with_permission" ON leads
FOR UPDATE TO authenticated
USING (
  tenant_id = current_tenant_id() 
  AND has_permission(auth.uid(), 'edit_leads')
);

-- User Roles Table: Manage permissions
DROP POLICY IF EXISTS "manage_roles_with_permission" ON user_roles;
CREATE POLICY "manage_roles_with_permission" ON user_roles
FOR ALL TO authenticated
USING (has_permission(auth.uid(), 'manage_roles'))
WITH CHECK (has_permission(auth.uid(), 'manage_roles'));

-- Role Permissions Table: Manage permissions
DROP POLICY IF EXISTS "manage_role_permissions_with_permission" ON role_permissions;
CREATE POLICY "manage_role_permissions_with_permission" ON role_permissions
FOR ALL TO authenticated
USING (has_permission(auth.uid(), 'manage_roles'))
WITH CHECK (has_permission(auth.uid(), 'manage_roles'));

-- User Permissions Table: Manage permissions
DROP POLICY IF EXISTS "manage_user_permissions_with_permission" ON user_permissions;
CREATE POLICY "manage_user_permissions_with_permission" ON user_permissions
FOR ALL TO authenticated
USING (has_permission(auth.uid(), 'manage_users'))
WITH CHECK (has_permission(auth.uid(), 'manage_users'));