-- Add re-enquiry tracking columns to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS last_form_submission_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reenquiry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reenquiry_at TIMESTAMP WITH TIME ZONE;

-- Add index for re-enquiry queries
CREATE INDEX IF NOT EXISTS idx_leads_reenquiry_count ON public.leads(reenquiry_count) WHERE reenquiry_count > 0;
CREATE INDEX IF NOT EXISTS idx_leads_last_reenquiry_at ON public.leads(last_reenquiry_at) WHERE last_reenquiry_at IS NOT NULL;

-- Add notification type for re-enquiry if not exists
INSERT INTO public.notification_types (type_key, display_name, description, category, available_channels, default_enabled)
SELECT 'lead_reenquiry', 'Lead Re-enquiry', 'When an assigned lead submits a form again', 'leads', ARRAY['in_app', 'email']::text[], true
WHERE NOT EXISTS (SELECT 1 FROM public.notification_types WHERE type_key = 'lead_reenquiry');