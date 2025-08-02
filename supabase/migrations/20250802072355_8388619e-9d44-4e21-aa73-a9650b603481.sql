-- Fix security definer functions by setting proper search path
CREATE OR REPLACE FUNCTION public.user_has_demo_data(user_email TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE(
    (SELECT has_demo_data 
     FROM public.demo_data_assignments 
     WHERE user_id = auth.uid() 
     AND (user_email IS NULL OR email = user_email)
     LIMIT 1), 
    false
  );
$$;

-- Fix assign demo data function
CREATE OR REPLACE FUNCTION public.assign_demo_data_to_user(target_email TEXT, demo_enabled BOOLEAN DEFAULT true)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;