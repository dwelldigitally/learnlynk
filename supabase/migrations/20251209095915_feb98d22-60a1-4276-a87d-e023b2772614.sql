-- Add routing-specific columns to advisor_performance table
ALTER TABLE advisor_performance 
ADD COLUMN IF NOT EXISTS working_schedule JSONB DEFAULT '{"days": ["monday","tuesday","wednesday","thursday","friday"], "start_time": "09:00", "end_time": "17:00"}'::jsonb,
ADD COLUMN IF NOT EXISTS capacity_per_week INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS current_weekly_assignments INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_assignment_reset TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS routing_enabled BOOLEAN DEFAULT true;

-- Create index for faster lookups on routing-enabled advisors
CREATE INDEX IF NOT EXISTS idx_advisor_performance_routing 
ON advisor_performance(advisor_id, routing_enabled, is_available);

-- Create function to increment weekly assignments
CREATE OR REPLACE FUNCTION increment_advisor_weekly_assignments(p_advisor_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE advisor_performance 
  SET current_weekly_assignments = current_weekly_assignments + 1
  WHERE advisor_id = p_advisor_id;
END;
$$;

-- Create function to reset weekly assignments (can be called by cron job)
CREATE OR REPLACE FUNCTION reset_weekly_advisor_assignments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE advisor_performance 
  SET 
    current_weekly_assignments = 0,
    last_assignment_reset = now()
  WHERE last_assignment_reset < date_trunc('week', now());
END;
$$;