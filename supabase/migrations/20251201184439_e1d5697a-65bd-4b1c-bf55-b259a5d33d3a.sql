-- Enable public read access for published forms (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'forms' 
    AND policyname = 'Public can view published forms'
  ) THEN
    CREATE POLICY "Public can view published forms"
    ON forms
    FOR SELECT
    USING (status = 'published');
  END IF;
END $$;
