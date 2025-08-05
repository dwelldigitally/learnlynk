-- Fix security warning: Function Search Path Mutable
-- Set search_path for the function to make it secure

DROP FUNCTION IF EXISTS update_email_updated_at_column();

CREATE OR REPLACE FUNCTION update_email_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;