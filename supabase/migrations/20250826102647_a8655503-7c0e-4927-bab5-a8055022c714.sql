-- First, let's check what table actually exists for programs
-- and create the Computer Science program properly

-- Update the existing CS journey without program reference first, then add stages
UPDATE academic_journeys 
SET 
    name = 'Computer Science - Domestic Student Journey',
    description = 'Complete academic pathway for domestic CS students with technical assessments',
    template_id = (SELECT id FROM journey_templates WHERE name = 'Computer Science - Domestic Student Journey' LIMIT 1),
    metadata = jsonb_set(
        COALESCE(metadata, '{}'),
        '{student_type}',
        '"domestic"'
    ),
    updated_at = now()
WHERE name = 'Computer Science Journey';

-- Create stages for the existing domestic journey based on the template
DELETE FROM journey_stages WHERE journey_id = '6f4676f2-9986-4d7e-9e03-3b62d1dbd5f2';

-- Insert stages from the domestic template
INSERT INTO journey_stages (
    journey_id,
    name,
    description,
    stage_type,
    order_index,
    is_required,
    is_parallel,
    status,
    timing_config,
    completion_criteria,
    escalation_rules
)
SELECT 
    '6f4676f2-9986-4d7e-9e03-3b62d1dbd5f2',
    stage_data->>'name',
    stage_data->>'description',
    stage_data->>'stage_type',
    (stage_data->>'order_index')::integer,
    (stage_data->>'is_required')::boolean,
    false,
    'active',
    stage_data->'timing_config',
    '{}',
    '{}'
FROM (
    SELECT jsonb_array_elements(template_data->'stages') as stage_data
    FROM journey_templates 
    WHERE name = 'Computer Science - Domestic Student Journey'
) stages;

-- Create an international CS journey as well
INSERT INTO academic_journeys (
    name,
    description,
    user_id,
    template_id,
    is_active,
    version,
    metadata
) VALUES (
    'Computer Science - International Student Journey',
    'Complete academic pathway for international CS students with visa support and extended timelines',
    '7a4165be-91e3-4fd9-b2da-19a4be0f2df1', -- Same user as existing journey
    (SELECT id FROM journey_templates WHERE name = 'Computer Science - International Student Journey' LIMIT 1),
    true,
    1,
    jsonb_build_object('student_type', 'international', 'specializations', array['AI/ML', 'Web Development', 'Cybersecurity'])
);

-- Create stages for the international journey
INSERT INTO journey_stages (
    journey_id,
    name,
    description,
    stage_type,
    order_index,
    is_required,
    is_parallel,
    status,
    timing_config,
    completion_criteria,
    escalation_rules
)
SELECT 
    (SELECT id FROM academic_journeys WHERE name = 'Computer Science - International Student Journey'),
    stage_data->>'name',
    stage_data->>'description',
    stage_data->>'stage_type',
    (stage_data->>'order_index')::integer,
    (stage_data->>'is_required')::boolean,
    false,
    'active',
    stage_data->'timing_config',
    '{}',
    '{}'
FROM (
    SELECT jsonb_array_elements(template_data->'stages') as stage_data
    FROM journey_templates 
    WHERE name = 'Computer Science - International Student Journey'
) stages;