-- Add AI-related columns to communication_templates table
ALTER TABLE public.communication_templates 
ADD COLUMN ai_generated boolean DEFAULT false,
ADD COLUMN generation_prompt text,
ADD COLUMN ai_suggestions jsonb DEFAULT '[]'::jsonb;