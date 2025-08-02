-- Create demo data assignments table
CREATE TABLE public.demo_data_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  has_demo_data BOOLEAN NOT NULL DEFAULT false,
  demo_type TEXT NOT NULL DEFAULT 'full', -- 'full', 'partial', 'none'
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.demo_data_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own demo data assignment" 
ON public.demo_data_assignments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage demo data assignments" 
ON public.demo_data_assignments 
FOR ALL 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_demo_data_assignments_updated_at
BEFORE UPDATE ON public.demo_data_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo data assignment for the specified email
-- This will be created when users sign up, but we can pre-create for existing user
INSERT INTO public.demo_data_assignments (user_id, email, has_demo_data, demo_type)
SELECT id, email, true, 'full'
FROM auth.users 
WHERE email = 'malhotratushar37@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Function to check if user has demo data access
CREATE OR REPLACE FUNCTION public.user_has_demo_data(user_email TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
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

-- Function to assign demo data to user
CREATE OR REPLACE FUNCTION public.assign_demo_data_to_user(target_email TEXT, demo_enabled BOOLEAN DEFAULT true)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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