-- Remove duplicate practicum sites, keeping only the oldest entry for each unique combination
WITH duplicates AS (
  SELECT id, name, organization, address, city, state,
         ROW_NUMBER() OVER (PARTITION BY name, organization, address, city, state ORDER BY created_at ASC) as row_num
  FROM practicum_sites
)
DELETE FROM practicum_sites 
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);