-- Add a unique constraint to prevent duplicate sites based on name, organization, and address
ALTER TABLE practicum_sites 
ADD CONSTRAINT unique_site_location 
UNIQUE (name, organization, address, city, state);