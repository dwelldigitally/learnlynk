-- Add INSERT policy for plays table
CREATE POLICY "Users can create their own plays" 
ON public.plays 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy for plays table if missing
CREATE POLICY "Users can update their own plays" 
ON public.plays 
FOR UPDATE 
USING (auth.uid() = user_id);