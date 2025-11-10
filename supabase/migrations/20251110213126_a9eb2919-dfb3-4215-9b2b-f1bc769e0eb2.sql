-- Add new columns to company_profile table for enhanced settings
ALTER TABLE company_profile
ADD COLUMN IF NOT EXISTS default_language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS data_residency_region TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Toronto',
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#10b981',
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS employee_count INTEGER,
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state_province TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Canada',
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS social_linkedin TEXT,
ADD COLUMN IF NOT EXISTS social_twitter TEXT,
ADD COLUMN IF NOT EXISTS social_facebook TEXT,
ADD COLUMN IF NOT EXISTS social_instagram TEXT,
ADD COLUMN IF NOT EXISTS mission_statement TEXT,
ADD COLUMN IF NOT EXISTS vision_statement TEXT,
ADD COLUMN IF NOT EXISTS core_values TEXT,
ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00", "enabled": true}, "tuesday": {"start": "09:00", "end": "17:00", "enabled": true}, "wednesday": {"start": "09:00", "end": "17:00", "enabled": true}, "thursday": {"start": "09:00", "end": "17:00", "enabled": true}, "friday": {"start": "09:00", "end": "17:00", "enabled": true}, "saturday": {"start": "09:00", "end": "17:00", "enabled": false}, "sunday": {"start": "09:00", "end": "17:00", "enabled": false}}'::jsonb,
ADD COLUMN IF NOT EXISTS holidays JSONB DEFAULT '[]'::jsonb;

-- Create storage bucket for company logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for company-assets bucket
CREATE POLICY "Company assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-assets');

CREATE POLICY "Authenticated users can upload company assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'company-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update company assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'company-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete company assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'company-assets' AND auth.role() = 'authenticated');