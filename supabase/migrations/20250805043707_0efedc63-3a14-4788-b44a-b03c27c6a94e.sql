-- Fix security warning by recreating function with proper search_path
-- Drop triggers first, then recreate function and triggers

-- Drop all triggers that depend on the function
DROP TRIGGER IF EXISTS update_email_accounts_updated_at ON email_accounts;
DROP TRIGGER IF EXISTS update_team_inboxes_updated_at ON team_inboxes;
DROP TRIGGER IF EXISTS update_emails_updated_at ON emails;
DROP TRIGGER IF EXISTS update_email_drafts_updated_at ON email_drafts;

-- Drop the function
DROP FUNCTION IF EXISTS update_email_updated_at_column();

-- Recreate function with secure search_path
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

-- Recreate all triggers
CREATE TRIGGER update_email_accounts_updated_at 
BEFORE UPDATE ON email_accounts 
FOR EACH ROW EXECUTE FUNCTION update_email_updated_at_column();

CREATE TRIGGER update_team_inboxes_updated_at 
BEFORE UPDATE ON team_inboxes 
FOR EACH ROW EXECUTE FUNCTION update_email_updated_at_column();

CREATE TRIGGER update_emails_updated_at 
BEFORE UPDATE ON emails 
FOR EACH ROW EXECUTE FUNCTION update_email_updated_at_column();

CREATE TRIGGER update_email_drafts_updated_at 
BEFORE UPDATE ON email_drafts 
FOR EACH ROW EXECUTE FUNCTION update_email_updated_at_column();