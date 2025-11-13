-- Create proper RLS policies for plays/workflows table
-- These ensure users can only see and manage their own workflows

CREATE POLICY "Users can view their own workflows"
ON plays
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workflows"
ON plays
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows"
ON plays
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows"
ON plays
FOR DELETE
USING (auth.uid() = user_id);