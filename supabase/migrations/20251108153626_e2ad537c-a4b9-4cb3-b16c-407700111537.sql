-- Enable demo data for the demo user
UPDATE demo_data_assignments 
SET 
  has_demo_data = true, 
  demo_type = 'full', 
  updated_at = now()
WHERE email = 'malhotratushar37@gmail.com';