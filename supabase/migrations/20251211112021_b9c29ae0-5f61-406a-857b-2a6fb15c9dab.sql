-- Fix function search_path security warnings
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::json ->> 'tenant_id')::uuid,
    (SELECT tenant_id FROM public.tenant_users 
     WHERE user_id = auth.uid() 
     AND is_primary = true 
     LIMIT 1)
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.current_tenant_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json ->> 'tenant_role',
    (SELECT role FROM public.tenant_users 
     WHERE user_id = auth.uid() 
     AND tenant_id = public.current_tenant_id()
     LIMIT 1)
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_users
    WHERE user_id = auth.uid()
    AND tenant_id = check_tenant_id
    AND status = 'active'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_tenant_admin()
RETURNS BOOLEAN AS $$
  SELECT public.current_tenant_role() IN ('owner', 'admin');
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.can_access_tenant_resource(resource_tenant_id UUID, resource_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
  SELECT 
    resource_tenant_id = public.current_tenant_id()
    AND (
      public.is_tenant_admin()
      OR resource_user_id IS NULL
      OR resource_user_id = auth.uid()
    );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;