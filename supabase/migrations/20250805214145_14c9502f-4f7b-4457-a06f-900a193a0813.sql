-- Remove demo data access for all users
UPDATE demo_data_assignments 
SET has_demo_data = false, demo_type = 'none', updated_at = now() 
WHERE has_demo_data = true;