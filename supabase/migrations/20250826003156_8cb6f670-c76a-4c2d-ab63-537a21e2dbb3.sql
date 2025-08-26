-- Temporarily make academic journeys visible to all authenticated users for demo purposes
-- This allows any logged-in user to see all journeys, not just their own

DROP POLICY IF EXISTS "Users can manage their own academic journeys" ON public.academic_journeys;

-- Create more permissive policies for demo/development
CREATE POLICY "Authenticated users can view all academic journeys"
ON public.academic_journeys
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create academic journeys"
ON public.academic_journeys
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own academic journeys"
ON public.academic_journeys
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own academic journeys"
ON public.academic_journeys
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);