-- Make stage_id nullable in lead_journey_progress table
ALTER TABLE lead_journey_progress 
ALTER COLUMN stage_id DROP NOT NULL;