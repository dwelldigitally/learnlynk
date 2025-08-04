-- Insert 200 dummy students with realistic data
DO $$
DECLARE
    current_user_id UUID := auth.uid();
    first_names TEXT[] := ARRAY['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Cameron', 'Sage', 'Blake', 'River', 'Rowan', 'Phoenix', 'Skylar', 'Dakota', 'Emery', 'Finley', 'Hayden', 'Jamie', 'Kennedy', 'Logan', 'Marley', 'Parker', 'Reese', 'Sam', 'Charlie', 'Drew', 'Ellis', 'Gray', 'Harper', 'Jules', 'Kai', 'Lane', 'Max', 'Nova', 'Sage', 'Tate', 'Vale', 'Winter', 'Zion', 'Aria', 'Luna', 'Zoe', 'Ava', 'Emma', 'Mia', 'Sofia', 'Isabella', 'Olivia', 'Lily', 'Grace', 'Chloe', 'Victoria', 'Amelia', 'Elena', 'Maya', 'Nora', 'Ruby', 'Ella', 'Hannah', 'Sarah', 'Leah', 'Anna', 'Abigail', 'Emily', 'Madison', 'Elizabeth', 'Megan', 'Eva', 'Jessica', 'Ashley', 'Samantha', 'Rachel', 'Lauren', 'Nicole', 'Stephanie', 'Amanda', 'Jennifer', 'Michelle', 'Lisa', 'Angela', 'Heather', 'Amy', 'Kimberly', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Linda', 'Patricia', 'Susan', 'Deborah', 'Barbara', 'Helen', 'Nancy', 'Betty', 'Dorothy', 'Sandra', 'Maria', 'Karen'];
    last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];
    programs TEXT[] := ARRAY['Health Care Assistant', 'Early Childhood Education', 'Business Administration', 'Nursing', 'Information Technology', 'Culinary Arts', 'Automotive Technology', 'Medical Office Assistant', 'Graphic Design', 'Social Work'];
    stages TEXT[] := ARRAY['LEAD_FORM', 'SEND_DOCUMENTS', 'DOCUMENT_APPROVAL', 'FEE_PAYMENT', 'ACCEPTED'];
    risk_levels TEXT[] := ARRAY['low', 'medium', 'high'];
    countries TEXT[] := ARRAY['Canada', 'United States', 'United Kingdom', 'Australia', 'India', 'Philippines', 'Nigeria', 'Brazil', 'Mexico', 'Germany'];
    cities TEXT[] := ARRAY['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'London', 'Manchester', 'Birmingham', 'Sydney', 'Melbourne', 'Brisbane', 'Mumbai', 'Delhi', 'Bangalore', 'Manila', 'Cebu', 'Lagos', 'Abuja', 'São Paulo', 'Rio de Janeiro', 'Mexico City', 'Guadalajara', 'Berlin', 'Munich', 'Hamburg'];
    states TEXT[] := ARRAY['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Saskatchewan', 'Manitoba', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island', 'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'];
    
    i INTEGER;
    stage_weights INTEGER[] := ARRAY[30, 25, 20, 15, 10]; -- Weights for stage distribution
    risk_weights INTEGER[] := ARRAY[60, 30, 10]; -- Weights for risk level distribution
    selected_stage TEXT;
    selected_risk TEXT;
    student_progress NUMERIC;
    acceptance_likelihood NUMERIC;
    lead_score INTEGER;
BEGIN
    -- Set the user ID for all insertions
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated to insert dummy data';
    END IF;

    FOR i IN 1..200 LOOP
        -- Select stage based on weights
        CASE 
            WHEN (i % 100) < 30 THEN selected_stage := 'LEAD_FORM';
            WHEN (i % 100) < 55 THEN selected_stage := 'SEND_DOCUMENTS';
            WHEN (i % 100) < 75 THEN selected_stage := 'DOCUMENT_APPROVAL';
            WHEN (i % 100) < 90 THEN selected_stage := 'FEE_PAYMENT';
            ELSE selected_stage := 'ACCEPTED';
        END CASE;

        -- Select risk level based on weights
        CASE 
            WHEN (i % 100) < 60 THEN selected_risk := 'low';
            WHEN (i % 100) < 90 THEN selected_risk := 'medium';
            ELSE selected_risk := 'high';
        END CASE;

        -- Calculate progress based on stage
        student_progress := CASE selected_stage
            WHEN 'LEAD_FORM' THEN ROUND((RANDOM() * 25 + 5)::NUMERIC, 1)
            WHEN 'SEND_DOCUMENTS' THEN ROUND((RANDOM() * 20 + 25)::NUMERIC, 1)
            WHEN 'DOCUMENT_APPROVAL' THEN ROUND((RANDOM() * 20 + 45)::NUMERIC, 1)
            WHEN 'FEE_PAYMENT' THEN ROUND((RANDOM() * 20 + 65)::NUMERIC, 1)
            WHEN 'ACCEPTED' THEN ROUND((RANDOM() * 15 + 85)::NUMERIC, 1)
        END;

        -- Calculate acceptance likelihood
        acceptance_likelihood := CASE selected_stage
            WHEN 'LEAD_FORM' THEN ROUND((RANDOM() * 30 + 20)::NUMERIC, 1)
            WHEN 'SEND_DOCUMENTS' THEN ROUND((RANDOM() * 25 + 35)::NUMERIC, 1)
            WHEN 'DOCUMENT_APPROVAL' THEN ROUND((RANDOM() * 25 + 50)::NUMERIC, 1)
            WHEN 'FEE_PAYMENT' THEN ROUND((RANDOM() * 20 + 70)::NUMERIC, 1)
            WHEN 'ACCEPTED' THEN ROUND((RANDOM() * 10 + 90)::NUMERIC, 1)
        END;

        -- Calculate lead score based on risk and stage
        lead_score := CASE selected_risk
            WHEN 'low' THEN FLOOR(RANDOM() * 30 + 70)::INTEGER
            WHEN 'medium' THEN FLOOR(RANDOM() * 40 + 40)::INTEGER
            WHEN 'high' THEN FLOOR(RANDOM() * 40 + 10)::INTEGER
        END;

        INSERT INTO students (
            user_id,
            student_id,
            first_name,
            last_name,
            email,
            phone,
            program,
            stage,
            date_of_birth,
            country,
            state,
            city,
            emergency_contact_name,
            emergency_contact_phone,
            lead_score,
            progress,
            acceptance_likelihood,
            risk_level,
            created_at,
            updated_at
        ) VALUES (
            current_user_id,
            'STU' || LPAD(i::TEXT, 6, '0'),
            first_names[1 + (RANDOM() * (array_length(first_names, 1) - 1))::INTEGER],
            last_names[1 + (RANDOM() * (array_length(last_names, 1) - 1))::INTEGER],
            'student' || i || '@email.com',
            CASE WHEN RANDOM() > 0.1 THEN 
                '+1' || LPAD(FLOOR(RANDOM() * 9000000000 + 1000000000)::TEXT, 10, '0')
            ELSE NULL END,
            programs[1 + (RANDOM() * (array_length(programs, 1) - 1))::INTEGER],
            selected_stage,
            CASE WHEN RANDOM() > 0.2 THEN 
                (CURRENT_DATE - INTERVAL '18 years' - (RANDOM() * INTERVAL '25 years')::INTERVAL)::DATE
            ELSE NULL END,
            countries[1 + (RANDOM() * (array_length(countries, 1) - 1))::INTEGER],
            CASE WHEN RANDOM() > 0.3 THEN 
                states[1 + (RANDOM() * (array_length(states, 1) - 1))::INTEGER]
            ELSE NULL END,
            cities[1 + (RANDOM() * (array_length(cities, 1) - 1))::INTEGER],
            CASE WHEN RANDOM() > 0.3 THEN 
                first_names[1 + (RANDOM() * (array_length(first_names, 1) - 1))::INTEGER] || ' ' ||
                last_names[1 + (RANDOM() * (array_length(last_names, 1) - 1))::INTEGER]
            ELSE NULL END,
            CASE WHEN RANDOM() > 0.3 THEN 
                '+1' || LPAD(FLOOR(RANDOM() * 9000000000 + 1000000000)::TEXT, 10, '0')
            ELSE NULL END,
            lead_score,
            student_progress,
            acceptance_likelihood,
            selected_risk,
            NOW() - (RANDOM() * INTERVAL '90 days'),
            NOW() - (RANDOM() * INTERVAL '30 days')
        );
    END LOOP;

    RAISE NOTICE 'Successfully inserted 200 dummy students';
END $$;