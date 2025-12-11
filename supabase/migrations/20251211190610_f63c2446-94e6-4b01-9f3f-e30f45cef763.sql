-- Fix circular dependency in current_tenant_role() function
-- The function was depending on current_tenant_id() which caused NULL propagation
-- when JWT custom claims weren't set

CREATE OR REPLACE FUNCTION public.current_tenant_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json ->> 'tenant_role',
    (SELECT role FROM public.tenant_users 
     WHERE user_id = auth.uid() 
     AND is_primary = true
     LIMIT 1)
  );
$function$;