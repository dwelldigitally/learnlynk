-- Add future intake dates for Health Care Assistant, Education Assistant, and Hospitality programs
-- Using the first user ID found in the system for demonstration

WITH first_user AS (
  SELECT user_id FROM leads LIMIT 1
),
program_ids AS (
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
  p.id,
  '2025-09-15'::date,
  25,
  '2025-09-01'::date,
  'open',
  u.user_id
FROM program_ids p, first_user u WHERE p.name = 'Health Care Assistant'

UNION ALL

SELECT 
  'Health Care Assistant - November 2025',
  p.id,
  '2025-11-10'::date,
  25,
  '2025-10-27'::date,
  'open',
  u.user_id
FROM program_ids p, first_user u WHERE p.name = 'Health Care Assistant'

UNION ALL

SELECT 
  'Health Care Assistant - January 2026',
  p.id,
  '2026-01-12'::date,
  25,
  '2025-12-29'::date,
  'open',
  u.user_id
FROM program_ids p, first_user u WHERE p.name = 'Health Care Assistant'

UNION ALL

-- Insert future intakes for Education Assistant
SELECT 
  'Education Assistant - October 2025',
  p.id,
  '2025-10-06'::date,
  20,
  '2025-09-23'::date,
  'open',
  u.user_id
FROM program_ids p, first_user u WHERE p.name = 'Education Assistant'

UNION ALL

SELECT 
  'Education Assistant - December 2025',
  p.id,
  '2025-12-02'::date,
  20,
  '2025-11-18'::date,
  'open',
  u.user_id
FROM program_ids p, first_user u WHERE p.name = 'Education Assistant'

UNION ALL

SELECT 
  'Education Assistant - February 2026',
  p.id,
  '2026-02-09'::date,
  20,
  '2026-01-26'::date,
  'open',
  u.user_id
FROM program_ids p, first_user u WHERE p.name = 'Education Assistant'

UNION ALL

-- Insert future intakes for Hospitality
SELECT 
  'Hospitality - October 2025',
  p.id,
  '2025-10-14'::date,
  30,
  '2025-09-30'::date,
  'open',
  u.user_id
FROM program_ids p, first_user u WHERE p.name = 'Hospitality'

UNION ALL

SELECT 
  'Hospitality - December 2025',
  p.id,
  '2025-12-16'::date,
  30,
  '2025-12-02'::date,
  'open',
  u.user_id
FROM program_ids p, first_user u WHERE p.name = 'Hospitality'

UNION ALL

SELECT 
  'Hospitality - February 2026',
  p.id,
  '2026-02-23'::date,
  30,
  '2026-02-09'::date,
  'open',
  u.user_id
FROM program_ids p, first_user u WHERE p.name = 'Hospitality';