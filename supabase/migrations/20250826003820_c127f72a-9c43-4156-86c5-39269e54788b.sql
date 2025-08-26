-- Seed journey stages for existing academic journeys
-- This will add dummy stages to make journeys functional

-- First, let's insert journey stages for the seeded academic journeys
-- We'll create stages for each journey type

-- Computer Science Journey stages
WITH cs_journey AS (
  SELECT id FROM academic_journeys WHERE name = 'Computer Science Journey' LIMIT 1
)
INSERT INTO journey_stages (journey_id, name, description, stage_type, order_index, is_required, is_parallel, status, timing_config, completion_criteria, escalation_rules)
SELECT 
  cs_journey.id,
  stage_data.name,
  stage_data.description,
  stage_data.stage_type::text,
  stage_data.order_index,
  stage_data.is_required,
  stage_data.is_parallel,
  'active'::text,
  stage_data.timing_config,
  '{}'::jsonb,
  '{}'::jsonb
FROM cs_journey,
(VALUES 
  ('Initial Inquiry', 'Student expresses interest in Computer Science program', 'inquiry', 0, true, false, '{"stall_threshold_days": 3, "expected_duration_days": 1}'::jsonb),
  ('Application Submission', 'Complete and submit formal application', 'application', 1, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 7}'::jsonb),
  ('Document Collection', 'Submit transcripts, test scores, and recommendations', 'documents', 2, true, false, '{"stall_threshold_days": 21, "expected_duration_days": 14}'::jsonb),
  ('Academic Evaluation', 'Review of academic credentials and requirements', 'evaluation', 3, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 5}'::jsonb),
  ('Technical Interview', 'Programming assessment and technical interview', 'interview', 4, true, false, '{"stall_threshold_days": 10, "expected_duration_days": 3}'::jsonb),
  ('Admission Decision', 'Final admission decision and offer presentation', 'offer', 5, true, false, '{"stall_threshold_days": 5, "expected_duration_days": 2}'::jsonb),
  ('Enrollment Deposit', 'Submit enrollment deposit to secure seat', 'deposit', 6, true, false, '{"stall_threshold_days": 30, "expected_duration_days": 7}'::jsonb),
  ('Pre-Program Setup', 'Orientation, course registration, and preparation', 'onboarding', 7, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 10}'::jsonb)
) AS stage_data(name, description, stage_type, order_index, is_required, is_parallel, timing_config);

-- Business Administration Journey stages  
WITH ba_journey AS (
  SELECT id FROM academic_journeys WHERE name = 'Business Administration Journey' LIMIT 1
)
INSERT INTO journey_stages (journey_id, name, description, stage_type, order_index, is_required, is_parallel, status, timing_config, completion_criteria, escalation_rules)
SELECT 
  ba_journey.id,
  stage_data.name,
  stage_data.description,
  stage_data.stage_type::text,
  stage_data.order_index,
  stage_data.is_required,
  stage_data.is_parallel,
  'active'::text,
  stage_data.timing_config,
  '{}'::jsonb,
  '{}'::jsonb
FROM ba_journey,
(VALUES 
  ('Program Inquiry', 'Initial interest in MBA program', 'inquiry', 0, true, false, '{"stall_threshold_days": 2, "expected_duration_days": 1}'::jsonb),
  ('Application Package', 'Submit application with GMAT scores', 'application', 1, true, false, '{"stall_threshold_days": 21, "expected_duration_days": 14}'::jsonb),
  ('Professional Documents', 'Work experience verification and references', 'documents', 2, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 10}'::jsonb),
  ('Experience Assessment', 'Evaluation of professional background', 'evaluation', 3, true, false, '{"stall_threshold_days": 10, "expected_duration_days": 5}'::jsonb),
  ('Leadership Interview', 'Management potential and leadership assessment', 'interview', 4, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 3}'::jsonb),
  ('Admission Offer', 'MBA program admission decision', 'offer', 5, true, false, '{"stall_threshold_days": 3, "expected_duration_days": 2}'::jsonb),
  ('Program Deposit', 'Enrollment confirmation and deposit', 'deposit', 6, true, false, '{"stall_threshold_days": 21, "expected_duration_days": 10}'::jsonb),
  ('Executive Orientation', 'Program orientation and networking events', 'onboarding', 7, true, false, '{"stall_threshold_days": 10, "expected_duration_days": 7}'::jsonb)
) AS stage_data(name, description, stage_type, order_index, is_required, is_parallel, timing_config);

-- Nursing Program Journey stages
WITH nursing_journey AS (
  SELECT id FROM academic_journeys WHERE name = 'Nursing Program Journey' LIMIT 1
)
INSERT INTO journey_stages (journey_id, name, description, stage_type, order_index, is_required, is_parallel, status, timing_config, completion_criteria, escalation_rules)
SELECT 
  nursing_journey.id,
  stage_data.name,
  stage_data.description,
  stage_data.stage_type::text,
  stage_data.order_index,
  stage_data.is_required,
  stage_data.is_parallel,
  'active'::text,
  stage_data.timing_config,
  '{}'::jsonb,
  '{}'::jsonb
FROM nursing_journey,
(VALUES 
  ('Healthcare Interest', 'Initial inquiry about nursing program', 'inquiry', 0, true, false, '{"stall_threshold_days": 3, "expected_duration_days": 1}'::jsonb),
  ('Nursing Application', 'Submit nursing program application', 'application', 1, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 7}'::jsonb),
  ('Prerequisites Verification', 'Science courses and CNA certification check', 'documents', 2, true, false, '{"stall_threshold_days": 21, "expected_duration_days": 14}'::jsonb),
  ('Academic Assessment', 'GPA and prerequisite course evaluation', 'evaluation', 3, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 5}'::jsonb),
  ('Clinical Interview', 'Healthcare aptitude and commitment assessment', 'interview', 4, true, false, '{"stall_threshold_days": 10, "expected_duration_days": 3}'::jsonb),
  ('Program Acceptance', 'Nursing program admission decision', 'offer', 5, true, false, '{"stall_threshold_days": 5, "expected_duration_days": 2}'::jsonb),
  ('Seat Confirmation', 'Nursing program enrollment deposit', 'deposit', 6, true, false, '{"stall_threshold_days": 30, "expected_duration_days": 14}'::jsonb),
  ('Clinical Preparation', 'Background check, immunizations, and orientation', 'onboarding', 7, true, false, '{"stall_threshold_days": 21, "expected_duration_days": 14}'::jsonb)
) AS stage_data(name, description, stage_type, order_index, is_required, is_parallel, timing_config);

-- Engineering Foundation stages
WITH eng_journey AS (
  SELECT id FROM academic_journeys WHERE name = 'Engineering Foundation' LIMIT 1
)
INSERT INTO journey_stages (journey_id, name, description, stage_type, order_index, is_required, is_parallel, status, timing_config, completion_criteria, escalation_rules)
SELECT 
  eng_journey.id,
  stage_data.name,
  stage_data.description,
  stage_data.stage_type::text,
  stage_data.order_index,
  stage_data.is_required,
  stage_data.is_parallel,
  'active'::text,
  stage_data.timing_config,
  '{}'::jsonb,
  '{}'::jsonb
FROM eng_journey,
(VALUES 
  ('Engineering Interest', 'Initial inquiry about engineering programs', 'inquiry', 0, true, false, '{"stall_threshold_days": 3, "expected_duration_days": 1}'::jsonb),
  ('Engineering Application', 'Submit engineering program application', 'application', 1, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 10}'::jsonb),
  ('Math & Science Transcripts', 'Advanced math and science course verification', 'documents', 2, true, false, '{"stall_threshold_days": 21, "expected_duration_days": 14}'::jsonb),
  ('STEM Assessment', 'Mathematical and scientific aptitude evaluation', 'evaluation', 3, true, false, '{"stall_threshold_days": 10, "expected_duration_days": 7}'::jsonb),
  ('Technical Interview', 'Problem-solving and analytical skills assessment', 'interview', 4, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 5}'::jsonb),
  ('Engineering Admission', 'Program admission and specialization selection', 'offer', 5, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 3}'::jsonb),
  ('Program Enrollment', 'Engineering program enrollment confirmation', 'deposit', 6, true, false, '{"stall_threshold_days": 30, "expected_duration_days": 10}'::jsonb),
  ('Technical Orientation', 'Lab access, safety training, and course planning', 'onboarding', 7, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 10}'::jsonb)
) AS stage_data(name, description, stage_type, order_index, is_required, is_parallel, timing_config);

-- Data Science Accelerated stages
WITH ds_journey AS (
  SELECT id FROM academic_journeys WHERE name = 'Data Science Accelerated' LIMIT 1
)
INSERT INTO journey_stages (journey_id, name, description, stage_type, order_index, is_required, is_parallel, status, timing_config, completion_criteria, escalation_rules)
SELECT 
  ds_journey.id,
  stage_data.name,
  stage_data.description,
  stage_data.stage_type::text,
  stage_data.order_index,
  stage_data.is_required,
  stage_data.is_parallel,
  'active'::text,
  stage_data.timing_config,
  '{}'::jsonb,
  '{}'::jsonb
FROM ds_journey,
(VALUES 
  ('Data Science Inquiry', 'Interest in accelerated data science program', 'inquiry', 0, true, false, '{"stall_threshold_days": 2, "expected_duration_days": 1}'::jsonb),
  ('Fast-Track Application', 'Submit application with technical background', 'application', 1, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 5}'::jsonb),
  ('Portfolio Review', 'Programming portfolio and project submissions', 'documents', 2, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 7}'::jsonb),
  ('Technical Screening', 'Coding skills and statistical knowledge assessment', 'evaluation', 3, true, false, '{"stall_threshold_days": 5, "expected_duration_days": 3}'::jsonb),
  ('Data Science Interview', 'Advanced technical interview and case studies', 'interview', 4, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 2}'::jsonb),
  ('Program Offer', 'Accelerated program admission decision', 'offer', 5, true, false, '{"stall_threshold_days": 3, "expected_duration_days": 1}'::jsonb),
  ('Immediate Enrollment', 'Quick enrollment for fast-track program', 'deposit', 6, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 5}'::jsonb),
  ('Intensive Preparation', 'Pre-program skill assessment and tool setup', 'onboarding', 7, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 3}'::jsonb)
) AS stage_data(name, description, stage_type, order_index, is_required, is_parallel, timing_config);

-- Psychology & Counseling stages
WITH psyc_journey AS (
  SELECT id FROM academic_journeys WHERE name = 'Psychology & Counseling' LIMIT 1
)
INSERT INTO journey_stages (journey_id, name, description, stage_type, order_index, is_required, is_parallel, status, timing_config, completion_criteria, escalation_rules)
SELECT 
  psyc_journey.id,
  stage_data.name,
  stage_data.description,
  stage_data.stage_type::text,
  stage_data.order_index,
  stage_data.is_required,
  stage_data.is_parallel,
  'active'::text,
  stage_data.timing_config,
  '{}'::jsonb,
  '{}'::jsonb
FROM psyc_journey,
(VALUES 
  ('Counseling Interest', 'Initial inquiry about psychology program', 'inquiry', 0, true, false, '{"stall_threshold_days": 3, "expected_duration_days": 1}'::jsonb),
  ('Graduate Application', 'Submit psychology graduate program application', 'application', 1, true, false, '{"stall_threshold_days": 21, "expected_duration_days": 14}'::jsonb),
  ('Academic Records', 'Psychology prerequisites and GRE scores', 'documents', 2, true, false, '{"stall_threshold_days": 21, "expected_duration_days": 14}'::jsonb),
  ('Clinical Evaluation', 'Assessment of counseling aptitude and ethics', 'evaluation', 3, true, false, '{"stall_threshold_days": 10, "expected_duration_days": 7}'::jsonb),
  ('Clinical Interview', 'Interpersonal skills and ethical reasoning assessment', 'interview', 4, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 5}'::jsonb),
  ('Program Acceptance', 'Psychology program admission decision', 'offer', 5, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 3}'::jsonb),
  ('Clinical Commitment', 'Program enrollment and practicum commitment', 'deposit', 6, true, false, '{"stall_threshold_days": 30, "expected_duration_days": 14}'::jsonb),
  ('Clinical Preparation', 'Ethics training, background check, and orientation', 'onboarding', 7, true, false, '{"stall_threshold_days": 21, "expected_duration_days": 14}'::jsonb)
) AS stage_data(name, description, stage_type, order_index, is_required, is_parallel, timing_config);

-- Digital Marketing Certification stages
WITH dm_journey AS (
  SELECT id FROM academic_journeys WHERE name = 'Digital Marketing Certification' LIMIT 1
)
INSERT INTO journey_stages (journey_id, name, description, stage_type, order_index, is_required, is_parallel, status, timing_config, completion_criteria, escalation_rules)
SELECT 
  dm_journey.id,
  stage_data.name,
  stage_data.description,
  stage_data.stage_type::text,
  stage_data.order_index,
  stage_data.is_required,
  stage_data.is_parallel,
  'active'::text,
  stage_data.timing_config,
  '{}'::jsonb,
  '{}'::jsonb
FROM dm_journey,
(VALUES 
  ('Marketing Interest', 'Initial inquiry about digital marketing certification', 'inquiry', 0, true, false, '{"stall_threshold_days": 2, "expected_duration_days": 1}'::jsonb),
  ('Certification Application', 'Submit digital marketing program application', 'application', 1, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 3}'::jsonb),
  ('Portfolio Submission', 'Marketing experience and portfolio review', 'documents', 2, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 7}'::jsonb),
  ('Skills Assessment', 'Digital marketing knowledge evaluation', 'evaluation', 3, true, false, '{"stall_threshold_days": 5, "expected_duration_days": 3}'::jsonb),
  ('Strategy Interview', 'Marketing strategy and campaign planning assessment', 'interview', 4, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 2}'::jsonb),
  ('Certification Offer', 'Program admission and certification track selection', 'offer', 5, true, false, '{"stall_threshold_days": 3, "expected_duration_days": 1}'::jsonb),
  ('Program Registration', 'Certification program enrollment and payment', 'deposit', 6, true, false, '{"stall_threshold_days": 14, "expected_duration_days": 5}'::jsonb),
  ('Platform Setup', 'Marketing tools access and certification preparation', 'onboarding', 7, true, false, '{"stall_threshold_days": 7, "expected_duration_days": 3}'::jsonb)
) AS stage_data(name, description, stage_type, order_index, is_required, is_parallel, timing_config);