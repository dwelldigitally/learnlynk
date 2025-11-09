-- Add linked_document_templates column to master_requirements table
ALTER TABLE master_requirements 
  ADD COLUMN IF NOT EXISTS linked_document_templates uuid[] DEFAULT '{}';

-- Add comment explaining the column
COMMENT ON COLUMN master_requirements.linked_document_templates IS 
  'Array of document template IDs that can be used to verify this requirement';

-- Create index for faster queries when looking up requirements by document template
CREATE INDEX IF NOT EXISTS idx_master_requirements_linked_templates 
  ON master_requirements USING GIN (linked_document_templates);