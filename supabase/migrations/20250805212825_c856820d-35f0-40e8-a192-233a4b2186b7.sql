-- Assign demo students to current authenticated user
-- This will give the current user some sample data to work with
UPDATE students 
SET user_id = auth.uid() 
WHERE id IN (
  SELECT id 
  FROM students 
  WHERE user_id IS NOT NULL 
  ORDER BY created_at DESC 
  LIMIT 5
);