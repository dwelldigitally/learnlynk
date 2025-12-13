-- Delete duplicate company_profile records, keeping only the oldest one per tenant
DELETE FROM company_profile
WHERE id NOT IN (
  SELECT DISTINCT ON (tenant_id) id
  FROM company_profile
  WHERE tenant_id IS NOT NULL
  ORDER BY tenant_id, created_at ASC
);

-- Add unique constraint to prevent future duplicates
ALTER TABLE company_profile 
ADD CONSTRAINT company_profile_tenant_id_unique UNIQUE (tenant_id);