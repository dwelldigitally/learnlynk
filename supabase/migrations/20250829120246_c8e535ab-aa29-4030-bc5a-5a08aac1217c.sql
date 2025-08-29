-- Add support for webform source in lead_source enum
-- First check if the enum needs to be updated
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_enum e 
        JOIN pg_type t ON e.enumtypid = t.oid 
        WHERE t.typname = 'lead_source' AND e.enumlabel = 'webform'
    ) THEN
        ALTER TYPE lead_source ADD VALUE 'webform';
    END IF;
END $$;

-- Create a proper portal access configuration table
CREATE TABLE IF NOT EXISTS public.student_portal_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_token TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    application_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    programs_applied TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '6 months'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_portal_access ENABLE ROW LEVEL SECURITY;

-- Create policies for portal access
CREATE POLICY "Public access via valid token" ON public.student_portal_access
FOR SELECT USING (
    access_token IS NOT NULL 
    AND expires_at > now() 
    AND status = 'active'
);

CREATE POLICY "Admin users can manage portal access" ON public.student_portal_access
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.leads l 
        WHERE l.id = student_portal_access.lead_id 
        AND l.user_id = auth.uid()
    )
);