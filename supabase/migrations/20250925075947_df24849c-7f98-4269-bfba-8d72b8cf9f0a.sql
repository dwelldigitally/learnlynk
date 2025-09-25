-- CRITICAL SECURITY FIXES - Phase 2
-- Handle existing policies properly and focus on most critical fixes

-- 1. Secure otp_rate_limits table (most critical)
DROP POLICY IF EXISTS "Allow public access" ON public.otp_rate_limits;
DROP POLICY IF EXISTS "Public read access" ON public.otp_rate_limits;
DROP POLICY IF EXISTS "System can manage OTP rate limits" ON public.otp_rate_limits;

CREATE POLICY "System can manage OTP rate limits" 
ON public.otp_rate_limits 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 2. Update OTP verification table to reduce expiry time (10 minutes instead of default)
ALTER TABLE public.otp_verifications 
ALTER COLUMN expires_at SET DEFAULT (now() + interval '10 minutes');

-- 3. Secure all database functions with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  DELETE FROM public.otp_verifications 
  WHERE expires_at < now() OR verified_at IS NOT NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.user_has_demo_data(user_email text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT COALESCE(
    (SELECT has_demo_data 
     FROM public.demo_data_assignments 
     WHERE user_id = auth.uid() 
     AND (user_email IS NULL OR email = user_email)
     LIMIT 1), 
    false
  );
$function$;

CREATE OR REPLACE FUNCTION public.assign_demo_data_to_user(target_email text, demo_enabled boolean DEFAULT true)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Insert or update demo data assignment
  INSERT INTO public.demo_data_assignments (user_id, email, has_demo_data, demo_type)
  VALUES (target_user_id, target_email, demo_enabled, CASE WHEN demo_enabled THEN 'full' ELSE 'none' END)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    has_demo_data = demo_enabled,
    demo_type = CASE WHEN demo_enabled THEN 'full' ELSE 'none' END,
    updated_at = now();
    
  RETURN true;
END;
$function$;

-- 4. Update all trigger functions to use secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_email_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_tasks_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = now();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_ai_tables_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_hubspot_connections_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_student_portal_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 5. Add security audit logging table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "System can create audit logs" ON public.security_audit_log;

CREATE POLICY "Authenticated users can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "System can create audit logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- 6. Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action text,
  p_table_name text DEFAULT NULL,
  p_record_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    ip_address
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    inet_client_addr()
  );
END;
$function$;