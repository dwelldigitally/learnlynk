-- Delete all programs except Health Care Assistant and Cha
DELETE FROM programs 
WHERE id NOT IN (
  '1e7f8030-c57f-4b26-ba21-ab9e01c595a0', -- Health Care Assistant (most recent)
  'e8b5c238-88ef-48c9-b9d2-746fbc5ac1f7'  -- Cha
);