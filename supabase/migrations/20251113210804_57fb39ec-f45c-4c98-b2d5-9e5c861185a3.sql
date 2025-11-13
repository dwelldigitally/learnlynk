-- Fix Forms Table RLS
-- Users should only see and manage their own forms

CREATE POLICY "Users can view their own forms"
ON forms
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own forms"
ON forms
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms"
ON forms
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms"
ON forms
FOR DELETE
USING (auth.uid() = user_id);