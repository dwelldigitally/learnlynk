-- Add future intake dates for Health Care Assistant, Education Assistant, and Hospitality programs
-- Using existing user ID from the system

WITH program_ids AS (
  SELECT 
    id,
    name
  FROM programs 
  WHERE name IN ('Health Care Assistant', 'Education Assistant', 'Hospitality')
)

-- Insert future intakes for Health Care Assistant
INSERT INTO intakes (name, program_id, start_date, capacity, application_deadline, status, user_id)
SELECT 
  'Health Care Assistant - September 2025',
  id,
  '2025-09-15'::date,
  25,
  '2025-09-01'::date,
  'open',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'::uuid
FROM program_ids WHERE name = 'Health Care Assistant'

UNION ALL

SELECT 
  'Health Care Assistant - November 2025',
  id,
  '2025-11-10'::date,
  25,
  '2025-10-27'::date,
  'open',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'::uuid
FROM program_ids WHERE name = 'Health Care Assistant'

UNION ALL

SELECT 
  'Health Care Assistant - January 2026',
  id,
  '2026-01-12'::date,
  25,
  '2025-12-29'::date,
  'open',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'::uuid
FROM program_ids WHERE name = 'Health Care Assistant'

UNION ALL

-- Insert future intakes for Education Assistant
SELECT 
  'Education Assistant - October 2025',
  id,
  '2025-10-06'::date,
  20,
  '2025-09-23'::date,
  'open',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'::uuid
FROM program_ids WHERE name = 'Education Assistant'

UNION ALL

SELECT 
  'Education Assistant - December 2025',
  id,
  '2025-12-02'::date,
  20,
  '2025-11-18'::date,
  'open',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'::uuid
FROM program_ids WHERE name = 'Education Assistant'

UNION ALL

SELECT 
  'Education Assistant - February 2026',
  id,
  '2026-02-09'::date,
  20,
  '2026-01-26'::date,
  'open',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'::uuid
FROM program_ids WHERE name = 'Education Assistant'

UNION ALL

-- Insert future intakes for Hospitality
SELECT 
  'Hospitality - October 2025',
  id,
  '2025-10-14'::date,
  30,
  '2025-09-30'::date,
  'open',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'::uuid
FROM program_ids WHERE name = 'Hospitality'

UNION ALL

SELECT 
  'Hospitality - December 2025',
  id,
  '2025-12-16'::date,
  30,
  '2025-12-02'::date,
  'open',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'::uuid
FROM program_ids WHERE name = 'Hospitality'

UNION ALL

SELECT 
  'Hospitality - February 2026',
  id,
  '2026-02-23'::date,
  30,
  '2026-02-09'::date,
  'open',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'::uuid
FROM program_ids WHERE name = 'Hospitality';