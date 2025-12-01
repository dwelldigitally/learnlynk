-- Add enrollment_config column to lead_routing_rules
ALTER TABLE lead_routing_rules
ADD COLUMN enrollment_config JSONB DEFAULT '{
  "enroll_existing": false,
  "enrollment_status": "not_started",
  "leads_enrolled": 0
}'::jsonb;

-- Create routing_enrollment_logs table to track enrollment history
CREATE TABLE routing_enrollment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES lead_routing_rules(id) ON DELETE CASCADE,
  enrollment_type TEXT NOT NULL CHECK (enrollment_type IN ('initial', 're_enrollment')),
  leads_processed INTEGER NOT NULL DEFAULT 0,
  leads_assigned INTEGER NOT NULL DEFAULT 0,
  leads_skipped INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  options JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add indexes for performance
CREATE INDEX idx_routing_enrollment_logs_rule_id ON routing_enrollment_logs(rule_id);
CREATE INDEX idx_routing_enrollment_logs_status ON routing_enrollment_logs(status);
CREATE INDEX idx_routing_enrollment_logs_started_at ON routing_enrollment_logs(started_at DESC);

-- Enable RLS
ALTER TABLE routing_enrollment_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own enrollment logs"
  ON routing_enrollment_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lead_routing_rules
      WHERE lead_routing_rules.id = routing_enrollment_logs.rule_id
      AND lead_routing_rules.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create enrollment logs for their rules"
  ON routing_enrollment_logs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lead_routing_rules
      WHERE lead_routing_rules.id = routing_enrollment_logs.rule_id
      AND lead_routing_rules.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own enrollment logs"
  ON routing_enrollment_logs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM lead_routing_rules
      WHERE lead_routing_rules.id = routing_enrollment_logs.rule_id
      AND lead_routing_rules.user_id = auth.uid()
    )
  );