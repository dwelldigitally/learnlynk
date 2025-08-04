-- Insert 200 dummy students with realistic data
-- Note: Replace 'your-user-id-here' with actual user ID or use a default user
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
) 
SELECT 
    (SELECT id FROM auth.users LIMIT 1), -- Use the first available user
    'STU' || LPAD(generate_series::TEXT, 6, '0'),
    (ARRAY['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Cameron', 'Sage', 'Blake', 'River', 'Rowan', 'Phoenix', 'Skylar', 'Dakota', 'Emery', 'Finley', 'Hayden', 'Jamie', 'Kennedy', 'Logan', 'Marley', 'Parker', 'Reese', 'Sam', 'Charlie', 'Drew', 'Ellis', 'Gray', 'Harper', 'Jules', 'Kai', 'Lane', 'Max', 'Nova', 'Sage', 'Tate', 'Vale', 'Winter', 'Zion', 'Aria', 'Luna', 'Zoe', 'Ava', 'Emma', 'Mia', 'Sofia', 'Isabella', 'Olivia', 'Lily', 'Grace', 'Chloe', 'Victoria', 'Amelia', 'Elena', 'Maya', 'Nora', 'Ruby', 'Ella', 'Hannah', 'Sarah', 'Leah', 'Anna', 'Abigail', 'Emily', 'Madison', 'Elizabeth', 'Megan', 'Eva', 'Jessica', 'Ashley', 'Samantha', 'Rachel', 'Lauren', 'Nicole', 'Stephanie', 'Amanda', 'Jennifer', 'Michelle', 'Lisa', 'Angela', 'Heather', 'Amy', 'Kimberly', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Linda', 'Patricia', 'Susan', 'Deborah', 'Barbara', 'Helen', 'Nancy', 'Betty', 'Dorothy', 'Sandra', 'Maria', 'Karen'])[1 + (RANDOM() * 99)::INTEGER],
    (ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'])[1 + (RANDOM() * 99)::INTEGER],
    'student' || generate_series || '@email.com',
    CASE WHEN RANDOM() > 0.1 THEN 
        '+1' || LPAD(FLOOR(RANDOM() * 9000000000 + 1000000000)::TEXT, 10, '0')
    ELSE NULL END,
    (ARRAY['Health Care Assistant', 'Early Childhood Education', 'Business Administration', 'Nursing', 'Information Technology', 'Culinary Arts', 'Automotive Technology', 'Medical Office Assistant', 'Graphic Design', 'Social Work'])[1 + (RANDOM() * 9)::INTEGER],
    CASE 
        WHEN (generate_series % 100) < 30 THEN 'LEAD_FORM'
        WHEN (generate_series % 100) < 55 THEN 'SEND_DOCUMENTS'
        WHEN (generate_series % 100) < 75 THEN 'DOCUMENT_APPROVAL'
        WHEN (generate_series % 100) < 90 THEN 'FEE_PAYMENT'
        ELSE 'ACCEPTED'
    END,
    CASE WHEN RANDOM() > 0.2 THEN 
        (CURRENT_DATE - INTERVAL '18 years' - (RANDOM() * INTERVAL '25 years')::INTERVAL)::DATE
    ELSE NULL END,
    (ARRAY['Canada', 'United States', 'United Kingdom', 'Australia', 'India', 'Philippines', 'Nigeria', 'Brazil', 'Mexico', 'Germany'])[1 + (RANDOM() * 9)::INTEGER],
    CASE WHEN RANDOM() > 0.3 THEN 
        (ARRAY['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Saskatchewan', 'Manitoba', 'Nova Scotia', 'New Brunswick', 'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia'])[1 + (RANDOM() * 15)::INTEGER]
    ELSE NULL END,
    (ARRAY['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'London', 'Manchester', 'Birmingham', 'Sydney', 'Melbourne', 'Brisbane', 'Mumbai', 'Delhi', 'Bangalore', 'Manila', 'Cebu', 'Lagos', 'Abuja'])[1 + (RANDOM() * 22)::INTEGER],
    CASE WHEN RANDOM() > 0.3 THEN 
        (ARRAY['John Doe', 'Jane Smith', 'Robert Johnson', 'Mary Williams', 'Michael Brown', 'Linda Davis', 'David Wilson', 'Elizabeth Miller', 'James Moore', 'Jennifer Taylor'])[1 + (RANDOM() * 9)::INTEGER]
    ELSE NULL END,
    CASE WHEN RANDOM() > 0.3 THEN 
        '+1' || LPAD(FLOOR(RANDOM() * 9000000000 + 1000000000)::TEXT, 10, '0')
    ELSE NULL END,
    CASE 
        WHEN (generate_series % 100) < 60 THEN FLOOR(RANDOM() * 30 + 70)::INTEGER -- low risk
        WHEN (generate_series % 100) < 90 THEN FLOOR(RANDOM() * 40 + 40)::INTEGER -- medium risk
        ELSE FLOOR(RANDOM() * 40 + 10)::INTEGER -- high risk
    END,
    CASE 
        WHEN (generate_series % 100) < 30 THEN ROUND((RANDOM() * 25 + 5)::NUMERIC, 1) -- LEAD_FORM
        WHEN (generate_series % 100) < 55 THEN ROUND((RANDOM() * 20 + 25)::NUMERIC, 1) -- SEND_DOCUMENTS
        WHEN (generate_series % 100) < 75 THEN ROUND((RANDOM() * 20 + 45)::NUMERIC, 1) -- DOCUMENT_APPROVAL
        WHEN (generate_series % 100) < 90 THEN ROUND((RANDOM() * 20 + 65)::NUMERIC, 1) -- FEE_PAYMENT
        ELSE ROUND((RANDOM() * 15 + 85)::NUMERIC, 1) -- ACCEPTED
    END,
    CASE 
        WHEN (generate_series % 100) < 30 THEN ROUND((RANDOM() * 30 + 20)::NUMERIC, 1) -- LEAD_FORM
        WHEN (generate_series % 100) < 55 THEN ROUND((RANDOM() * 25 + 35)::NUMERIC, 1) -- SEND_DOCUMENTS
        WHEN (generate_series % 100) < 75 THEN ROUND((RANDOM() * 25 + 50)::NUMERIC, 1) -- DOCUMENT_APPROVAL
        WHEN (generate_series % 100) < 90 THEN ROUND((RANDOM() * 20 + 70)::NUMERIC, 1) -- FEE_PAYMENT
        ELSE ROUND((RANDOM() * 10 + 90)::NUMERIC, 1) -- ACCEPTED
    END,
    CASE 
        WHEN (generate_series % 100) < 60 THEN 'low'
        WHEN (generate_series % 100) < 90 THEN 'medium'
        ELSE 'high'
    END,
    NOW() - (RANDOM() * INTERVAL '90 days'),
    NOW() - (RANDOM() * INTERVAL '30 days')
FROM generate_series(1, 200);