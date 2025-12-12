-- Enable realtime for lead_activity_logs table
ALTER TABLE lead_activity_logs REPLICA IDENTITY FULL;

-- Add to realtime publication (ignore error if already added)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE lead_activity_logs;
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Table already in publication, ignore
END $$;

-- Also ensure other timeline-related tables have realtime enabled
ALTER TABLE lead_communications REPLICA IDENTITY FULL;
ALTER TABLE lead_tasks REPLICA IDENTITY FULL;
ALTER TABLE lead_documents REPLICA IDENTITY FULL;
ALTER TABLE lead_notes REPLICA IDENTITY FULL;

-- Add them to realtime publication
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE lead_communications;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE lead_tasks;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE lead_documents;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE lead_notes;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;