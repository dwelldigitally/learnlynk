
-- Create junction table for many-to-many relationship between programs and journeys
CREATE TABLE IF NOT EXISTS program_journey_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  journey_id UUID NOT NULL REFERENCES academic_journeys(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(program_id, journey_id)
);

-- Enable RLS
ALTER TABLE program_journey_links ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view program journey links"
ON program_journey_links FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage program journey links"
ON program_journey_links FOR ALL
USING (auth.uid() IS NOT NULL);

-- Migrate existing program_id relationships to the junction table
INSERT INTO program_journey_links (program_id, journey_id, is_primary)
SELECT program_id, id, true
FROM academic_journeys
WHERE program_id IS NOT NULL
ON CONFLICT (program_id, journey_id) DO NOTHING;

-- Create index for performance
CREATE INDEX idx_program_journey_links_program ON program_journey_links(program_id);
CREATE INDEX idx_program_journey_links_journey ON program_journey_links(journey_id);
