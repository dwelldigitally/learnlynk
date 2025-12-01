-- Add user_id column to lead_routing_rules table
ALTER TABLE public.lead_routing_rules
ADD COLUMN user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_lead_routing_rules_user_id ON public.lead_routing_rules(user_id);

-- Enable RLS on the table if not already enabled
ALTER TABLE public.lead_routing_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user access
CREATE POLICY "Users can view their own routing rules"
ON public.lead_routing_rules
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own routing rules"
ON public.lead_routing_rules
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routing rules"
ON public.lead_routing_rules
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routing rules"
ON public.lead_routing_rules
FOR DELETE
USING (auth.uid() = user_id);