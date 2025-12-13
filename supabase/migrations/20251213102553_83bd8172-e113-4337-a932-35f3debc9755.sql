-- Add preferred_campus_id column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_campus_id UUID REFERENCES master_campuses(id);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_leads_preferred_campus_id ON leads(preferred_campus_id);