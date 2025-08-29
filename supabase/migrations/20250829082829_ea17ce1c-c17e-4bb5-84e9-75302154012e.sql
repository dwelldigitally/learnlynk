-- Add missing columns to lead_communications table for AI support
ALTER TABLE public.lead_communications 
ADD COLUMN is_ai_generated boolean DEFAULT false,
ADD COLUMN ai_agent_id uuid;

-- Add index for better performance on AI-generated communications
CREATE INDEX idx_lead_communications_ai_generated ON public.lead_communications(is_ai_generated);
CREATE INDEX idx_lead_communications_ai_agent_id ON public.lead_communications(ai_agent_id);