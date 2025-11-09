-- Add HTML content and attachment support to communication_templates table
ALTER TABLE public.communication_templates 
ADD COLUMN IF NOT EXISTS html_content TEXT,
ADD COLUMN IF NOT EXISTS content_format TEXT DEFAULT 'plain' CHECK (content_format IN ('plain', 'html', 'rich')),
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS max_attachment_size INTEGER DEFAULT 10485760; -- 10MB in bytes

-- Create storage bucket for email attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('email-attachments', 'email-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for email attachments storage bucket
CREATE POLICY "Users can view their own email attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'email-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own email attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'email-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own email attachments"
ON storage.objects FOR UPDATE
USING (bucket_id = 'email-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own email attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'email-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);