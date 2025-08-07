-- Update master data records to assign them to the current user
-- This will make the sample data visible to authenticated users

-- Update master campuses
UPDATE public.master_campuses 
SET user_id = auth.uid() 
WHERE user_id IS NULL;

-- Update master programs  
UPDATE public.master_programs 
SET user_id = auth.uid() 
WHERE user_id IS NULL;

-- Update master marketing sources
UPDATE public.master_marketing_sources 
SET user_id = auth.uid() 
WHERE user_id IS NULL;

-- Update master lead statuses
UPDATE public.master_lead_statuses 
SET user_id = auth.uid() 
WHERE user_id IS NULL;

-- Update master lead priorities
UPDATE public.master_lead_priorities 
SET user_id = auth.uid() 
WHERE user_id IS NULL;