-- Insert sample programs for the standardized programs
INSERT INTO programs (user_id, name, type, description, duration) VALUES
('6a151e45-8580-4c55-a953-dce232583255', 'Health Care Assistant', 'Healthcare', 'Healthcare Assistant Program', '8 months'),
('6a151e45-8580-4c55-a953-dce232583255', 'Education Assistant', 'Education', 'Education Assistant Program', '10 months'),
('6a151e45-8580-4c55-a953-dce232583255', 'Aviation', 'Technical', 'Aviation Program', '18 months'),
('6a151e45-8580-4c55-a953-dce232583255', 'Hospitality', 'Business', 'Hospitality Management Program', '12 months'),
('6a151e45-8580-4c55-a953-dce232583255', 'ECE', 'Education', 'Early Childhood Education Program', '24 months'),
('6a151e45-8580-4c55-a953-dce232583255', 'MLA', 'Healthcare', 'Medical Laboratory Assistant Program', '12 months');

-- Insert sample intakes based on the constants we defined earlier
-- Get program IDs first, then insert intakes
WITH program_lookup AS (
  SELECT id, name FROM programs WHERE user_id = '6a151e45-8580-4c55-a953-dce232583255'
)
INSERT INTO intakes (user_id, name, program_id, start_date, capacity, study_mode, delivery_method, campus, status, sales_approach)
SELECT 
  '6a151e45-8580-4c55-a953-dce232583255',
  intake_name,
  program_id,
  start_date::date,
  capacity,
  'full-time',
  'on-campus',
  'Main Campus',
  'open',
  'balanced'
FROM (
  VALUES 
  -- Health Care Assistant intakes
  ((SELECT id FROM program_lookup WHERE name = 'Health Care Assistant'), 'Health Care Assistant - November 2024', '2024-11-05', 30),
  ((SELECT id FROM program_lookup WHERE name = 'Health Care Assistant'), 'Health Care Assistant - January 2025', '2025-01-07', 30),
  ((SELECT id FROM program_lookup WHERE name = 'Health Care Assistant'), 'Health Care Assistant - March 2025', '2025-03-04', 30),
  ((SELECT id FROM program_lookup WHERE name = 'Health Care Assistant'), 'Health Care Assistant - May 2025', '2025-05-06', 30),
  ((SELECT id FROM program_lookup WHERE name = 'Health Care Assistant'), 'Health Care Assistant - July 2025', '2025-07-08', 30),
  
  -- Education Assistant intakes
  ((SELECT id FROM program_lookup WHERE name = 'Education Assistant'), 'Education Assistant - December 2024', '2024-12-02', 25),
  ((SELECT id FROM program_lookup WHERE name = 'Education Assistant'), 'Education Assistant - February 2025', '2025-02-03', 25),
  ((SELECT id FROM program_lookup WHERE name = 'Education Assistant'), 'Education Assistant - April 2025', '2025-04-07', 25),
  ((SELECT id FROM program_lookup WHERE name = 'Education Assistant'), 'Education Assistant - June 2025', '2025-06-02', 25),
  ((SELECT id FROM program_lookup WHERE name = 'Education Assistant'), 'Education Assistant - August 2025', '2025-08-04', 25),
  
  -- Aviation intakes
  ((SELECT id FROM program_lookup WHERE name = 'Aviation'), 'Aviation - February 2025', '2025-02-17', 40),
  ((SELECT id FROM program_lookup WHERE name = 'Aviation'), 'Aviation - June 2025', '2025-06-16', 40),
  ((SELECT id FROM program_lookup WHERE name = 'Aviation'), 'Aviation - October 2025', '2025-10-20', 40),
  
  -- Hospitality intakes
  ((SELECT id FROM program_lookup WHERE name = 'Hospitality'), 'Hospitality - December 2024', '2024-12-10', 35),
  ((SELECT id FROM program_lookup WHERE name = 'Hospitality'), 'Hospitality - February 2025', '2025-02-11', 35),
  ((SELECT id FROM program_lookup WHERE name = 'Hospitality'), 'Hospitality - April 2025', '2025-04-15', 35),
  ((SELECT id FROM program_lookup WHERE name = 'Hospitality'), 'Hospitality - June 2025', '2025-06-17', 35),
  ((SELECT id FROM program_lookup WHERE name = 'Hospitality'), 'Hospitality - August 2025', '2025-08-19', 35),
  
  -- ECE intakes
  ((SELECT id FROM program_lookup WHERE name = 'ECE'), 'ECE - January 2025', '2025-01-13', 20),
  ((SELECT id FROM program_lookup WHERE name = 'ECE'), 'ECE - May 2025', '2025-05-12', 20),
  ((SELECT id FROM program_lookup WHERE name = 'ECE'), 'ECE - September 2025', '2025-09-15', 20),
  
  -- MLA intakes
  ((SELECT id FROM program_lookup WHERE name = 'MLA'), 'MLA - March 2025', '2025-03-17', 18),
  ((SELECT id FROM program_lookup WHERE name = 'MLA'), 'MLA - July 2025', '2025-07-21', 18),
  ((SELECT id FROM program_lookup WHERE name = 'MLA'), 'MLA - November 2025', '2025-11-17', 18)
) AS intake_data(program_id, intake_name, start_date, capacity);