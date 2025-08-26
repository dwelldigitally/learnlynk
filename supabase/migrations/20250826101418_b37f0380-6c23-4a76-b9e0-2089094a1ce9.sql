-- Update the existing Computer Science Journey to use one of the new templates

-- First, let's find a Computer Science program ID
DO $$
DECLARE
    cs_program_id uuid;
    cs_domestic_template_id uuid;
    cs_international_template_id uuid;
BEGIN
    -- Find a CS program (create one if it doesn't exist)
    SELECT id INTO cs_program_id FROM programs WHERE name ILIKE '%computer science%' LIMIT 1;
    
    IF cs_program_id IS NULL THEN
        INSERT INTO programs (name, description, type, duration, status, category)
        VALUES (
            'Computer Science',
            'Bachelor of Computer Science program with focus on software development and algorithms',
            'undergraduate',
            48,
            'active',
            'technology'
        ) RETURNING id INTO cs_program_id;
    END IF;

    -- Get the template IDs
    SELECT id INTO cs_domestic_template_id 
    FROM journey_templates 
    WHERE name = 'Computer Science - Domestic Student Journey';

    SELECT id INTO cs_international_template_id 
    FROM journey_templates 
    WHERE name = 'Computer Science - International Student Journey';

    -- Update the existing CS journey to be domestic and link to program and template
    UPDATE academic_journeys 
    SET 
        name = 'Computer Science - Domestic Student Journey',
        description = 'Complete academic pathway for domestic CS students with technical assessments',
        program_id = cs_program_id,
        template_id = cs_domestic_template_id,
        metadata = jsonb_set(
            COALESCE(metadata, '{}'),
            '{student_type}',
            '"domestic"'
        ),
        updated_at = now()
    WHERE name = 'Computer Science Journey';

    -- Create stages for the existing journey based on the domestic template
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
        WHERE id = cs_domestic_template_id
    ) stages;

    -- Create an international CS journey as well
    INSERT INTO academic_journeys (
        name,
        description,
        user_id,
        program_id,
        template_id,
        is_active,
        version,
        metadata
    ) VALUES (
        'Computer Science - International Student Journey',
        'Complete academic pathway for international CS students with visa support and extended timelines',
        '7a4165be-91e3-4fd9-b2da-19a4be0f2df1', -- Same user as existing journey
        cs_program_id,
        cs_international_template_id,
        true,
        1,
        jsonb_build_object('student_type', 'international', 'specializations', array['AI/ML', 'Web Development', 'Cybersecurity'])
    );

    -- Get the new international journey ID and create its stages
    DECLARE
        intl_journey_id uuid;
    BEGIN
        SELECT id INTO intl_journey_id 
        FROM academic_journeys 
        WHERE name = 'Computer Science - International Student Journey';

        -- Insert stages for international journey
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
            intl_journey_id,
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
            WHERE id = cs_international_template_id
        ) stages;
    END;

END $$;