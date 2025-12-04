-- Create security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role::text = _role
  )
$$;

-- Drop existing problematic policies on user_roles
DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;

-- Create non-recursive policies for user_roles
CREATE POLICY "Users can view their own roles" ON user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user roles" ON user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop existing policies on role_permissions
DROP POLICY IF EXISTS "Anyone can view role permissions" ON role_permissions;
DROP POLICY IF EXISTS "Admins can insert role permissions" ON role_permissions;
DROP POLICY IF EXISTS "Admins can update role permissions" ON role_permissions;
DROP POLICY IF EXISTS "Admins can delete role permissions" ON role_permissions;

-- Create policies for role_permissions
CREATE POLICY "Anyone can view role permissions" ON role_permissions
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can insert role permissions" ON role_permissions
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update role permissions" ON role_permissions
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete role permissions" ON role_permissions
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));