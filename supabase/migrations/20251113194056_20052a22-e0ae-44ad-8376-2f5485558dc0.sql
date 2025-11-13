-- Delete demo campuses with the test user_id
DELETE FROM master_campuses WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Drop the overly permissive policy that allows viewing all campuses
DROP POLICY IF EXISTS "Users can view all campuses" ON master_campuses;

-- Create a policy so users can only view their own campuses
CREATE POLICY "Users can view their own campuses"
  ON master_campuses
  FOR SELECT
  USING (auth.uid() = user_id);