-- Add onboarding_completed_at field to profiles table
ALTER TABLE public.profiles ADD COLUMN onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Mark existing users as having completed onboarding (legacy users)
UPDATE public.profiles 
SET onboarding_completed_at = NOW() 
WHERE onboarding_completed_at IS NULL;