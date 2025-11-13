-- Delete demo requirements with the test user_id
DELETE FROM master_requirements WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Drop any overly permissive policies on master_requirements
DROP POLICY IF EXISTS "Users can view all requirements" ON master_requirements;
DROP POLICY IF EXISTS "Enable read access for all users" ON master_requirements;
DROP POLICY IF EXISTS "Public can view requirements" ON master_requirements;

-- Create policies so users can only manage their own requirements
CREATE POLICY "Users can view their own requirements"
  ON master_requirements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own requirements"
  ON master_requirements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requirements"
  ON master_requirements
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requirements"
  ON master_requirements
  FOR DELETE
  USING (auth.uid() = user_id);