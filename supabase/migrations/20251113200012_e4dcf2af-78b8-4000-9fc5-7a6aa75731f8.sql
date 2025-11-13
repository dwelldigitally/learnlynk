-- Fix Programs Table RLS
-- Drop the overly permissive public viewing policy
DROP POLICY IF EXISTS "Allow public to view open programs" ON programs;

-- The correct policies already exist:
-- "Users can view their own programs" (auth.uid() = user_id)
-- "Users can create their own programs"
-- "Users can update their own programs"
-- "Users can delete their own programs"

-- Fix Plays/Workflows Table RLS
-- Drop the overly permissive policy that allows all authenticated users
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON plays;

-- The correct policy already exists:
-- "Users can manage their own workflows" (auth.uid() = user_id)

-- Fix Academic Journeys Table RLS
-- Drop the overly permissive policy that allows viewing all journeys
DROP POLICY IF EXISTS "Authenticated users can view all academic journeys" ON academic_journeys;

-- Create a proper restrictive SELECT policy
CREATE POLICY "Users can view their own academic journeys"
ON academic_journeys
FOR SELECT
USING (auth.uid() = user_id);

-- The other correct policies already exist:
-- "Users can create academic journeys"
-- "Users can update their own academic journeys"
-- "Users can delete their own academic journeys"

-- Fix Intakes Table RLS
-- Drop the overly permissive public viewing policy
DROP POLICY IF EXISTS "Allow public to view open intakes" ON intakes;

-- The correct policies already exist:
-- "Users can view their own intakes" (auth.uid() = user_id)
-- "Users can create their own intakes"
-- "Users can update their own intakes"
-- "Users can delete their own intakes"