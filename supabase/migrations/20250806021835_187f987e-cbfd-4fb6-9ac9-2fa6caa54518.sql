-- Add user_id column to workflows table
ALTER TABLE public.workflows ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update RLS policies for workflows table to use user_id
DROP POLICY IF EXISTS "Users can manage their own workflows" ON public.workflows;

CREATE POLICY "Users can manage their own workflows" 
ON public.workflows 
FOR ALL 
USING (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);