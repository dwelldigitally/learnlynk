-- Create comprehensive dummy practicum data for report demonstration
-- Final version with correct column mappings

-- Insert practicum program
INSERT INTO public.practicum_programs (id, user_id, program_name, total_hours_required, competencies_required, is_active) VALUES
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Nursing Clinical Rotation', 240, '[
  "Patient Assessment", "Vital Signs Monitoring", "Medication Administration", 
  "Wound Care", "Infection Control", "Patient Education", "Documentation",
  "Emergency Response", "Team Communication", "Professional Ethics"
]'::jsonb, true);

-- Insert practicum sites
INSERT INTO public.practicum_sites (id, user_id, name, organization, address, city, state, postal_code, contact_person, contact_email, contact_phone, is_active) VALUES
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Emergency Department', 'City General Hospital', '123 Medical Center Dr', 'Springfield', 'IL', '62701', 'Dr. Sarah Mitchell', 'sarah.mitchell@citygeneral.com', '(555) 123-4567', true),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Intensive Care Unit', 'Riverside Medical Center', '456 River Rd', 'Springfield', 'IL', '62702', 'Linda Brown, RN', 'linda.brown@riverside.com', '(555) 234-5678', true),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Primary Care Clinic', 'Community Health Clinic', '789 Main St', 'Springfield', 'IL', '62703', 'Dr. Robert Kim', 'robert.kim@communityhc.com', '(555) 345-6789', true),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Pediatric Ward', 'St. Mary''s Hospital', '321 Oak Ave', 'Springfield', 'IL', '62704', 'Maria Lopez, RN', 'maria.lopez@stmarys.com', '(555) 456-7890', true);

-- Insert student leads
INSERT INTO public.leads (id, user_id, first_name, last_name, email, phone, status, source, created_at, student_type) VALUES
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '(555) 111-1111', 'converted', 'webform', now() - interval '3 months', 'domestic'),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Michael', 'Chen', 'michael.chen@email.com', '(555) 111-2222', 'converted', 'webform', now() - interval '3 months', 'international'),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Emma', 'Rodriguez', 'emma.rodriguez@email.com', '(555) 111-3333', 'converted', 'webform', now() - interval '3 months', 'domestic'),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'James', 'Wilson', 'james.wilson@email.com', '(555) 111-4444', 'converted', 'webform', now() - interval '3 months', 'domestic'),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Ashley', 'Davis', 'ashley.davis@email.com', '(555) 111-5555', 'converted', 'webform', now() - interval '3 months', 'domestic'),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'David', 'Thompson', 'david.thompson@email.com', '(555) 111-6666', 'converted', 'webform', now() - interval '3 months', 'domestic'),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Lisa', 'Anderson', 'lisa.anderson@email.com', '(555) 111-7777', 'converted', 'webform', now() - interval '3 months', 'international'),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Christopher', 'Martinez', 'chris.martinez@email.com', '(555) 111-8888', 'converted', 'webform', now() - interval '3 months', 'domestic'),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Jennifer', 'Taylor', 'jennifer.taylor@email.com', '(555) 111-9999', 'converted', 'webform', now() - interval '3 months', 'domestic'),
(gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662', 'Robert', 'White', 'robert.white@email.com', '(555) 111-0000', 'converted', 'webform', now() - interval '3 months', 'domestic');

-- Create practicum data with assignments and records for "missing-attendance-av-1" batch
DO $$
DECLARE
    nursing_program_id uuid;
    site_ids uuid[];
    lead_ids uuid[];
    assignment_id uuid;
    i integer;
    j integer;
    current_user_id uuid := '564dedbf-1214-423e-bce6-eb95d26fc662';
BEGIN
    -- Get required IDs
    SELECT id INTO nursing_program_id FROM public.practicum_programs WHERE program_name = 'Nursing Clinical Rotation' AND user_id = current_user_id LIMIT 1;
    SELECT array_agg(id ORDER BY name) INTO site_ids FROM public.practicum_sites WHERE user_id = current_user_id;
    SELECT array_agg(id ORDER BY first_name) INTO lead_ids FROM public.leads WHERE user_id = current_user_id;
    
    -- Create assignments and records for demo
    FOR i IN 1..array_length(lead_ids, 1) LOOP
        assignment_id := gen_random_uuid();
        
        -- Create practicum assignment
        INSERT INTO public.practicum_assignments (
            id, user_id, lead_id, program_id, site_id, instructor_id, preceptor_id, 
            start_date, end_date, status, hours_completed, hours_approved, completion_percentage
        ) VALUES (
            assignment_id, current_user_id, lead_ids[i], nursing_program_id,
            site_ids[((i-1) % array_length(site_ids, 1)) + 1],
            current_user_id, current_user_id,  
            now()::date - interval '60 days', now()::date + interval '30 days',
            'active',
            CASE 
                WHEN i IN (1, 4, 7) THEN 150  -- Problem students - fewer hours
                WHEN i <= 5 THEN 200          -- Good students
                ELSE 175                      -- Average students
            END,
            CASE 
                WHEN i <= 5 THEN 200          -- First 5 approved
                WHEN i <= 7 THEN 150          -- Next 2 partial
                ELSE 125                      -- Rest fewer
            END,
            CASE 
                WHEN i IN (1, 4, 7) THEN 62.5 -- Problem students - 62.5%
                WHEN i <= 5 THEN 83.3         -- Good students - 83.3%
                ELSE 72.9                     -- Average students - 72.9%
            END
        );
        
        -- Create attendance records (students 1, 4, 7 have missing attendance)
        FOR j IN 0..20 LOOP
            -- Students 1, 4, 7 miss more days
            IF NOT (i IN (1, 4, 7) AND j % 3 = 0) THEN
                INSERT INTO public.practicum_records (
                    id, assignment_id, student_id, record_type, record_date, hours_submitted,
                    time_in, time_out, student_notes, preceptor_status, instructor_status,
                    clock_in_latitude, clock_in_longitude, 
                    preceptor_approved_at, instructor_approved_at
                ) VALUES (
                    gen_random_uuid(), assignment_id, lead_ids[i], 'attendance',
                    (now()::date - interval '50 days' + (j * 2) * interval '1 day'),
                    8.0, '08:00:00', '16:00:00',
                    'Daily clinical practice completed', 
                    CASE WHEN i <= 8 THEN 'approved' ELSE 'pending' END,
                    CASE WHEN i <= 5 THEN 'approved' ELSE 'pending' END,
                    39.7817, -89.6501,
                    CASE WHEN i <= 8 THEN (now()::date - interval '50 days' + (j * 2 + 1) * interval '1 day') ELSE null END,
                    CASE WHEN i <= 5 THEN (now()::date - interval '50 days' + (j * 2 + 2) * interval '1 day') ELSE null END
                );
            END IF;
        END LOOP;
        
        -- Create competency evaluations
        FOR j IN 1..LEAST(i + 1, 6) LOOP
            INSERT INTO public.practicum_records (
                id, assignment_id, student_id, record_type, record_date,
                competency_id, competency_name, evaluation_data, student_notes,
                preceptor_status, instructor_status
            ) VALUES (
                gen_random_uuid(), assignment_id, lead_ids[i], 'competency',
                (now()::date - interval '45 days' + (j * 5) * interval '1 day'),
                'COMP-' || lpad(j::text, 3, '0'),
                'Clinical Competency ' || j,
                jsonb_build_object('performance_level', 
                    CASE 
                        WHEN i <= 3 THEN 'exemplary'
                        WHEN i <= 6 THEN 'proficient'
                        ELSE 'developing'
                    END,
                    'score', 
                    CASE 
                        WHEN i <= 3 THEN 95
                        WHEN i <= 6 THEN 85
                        ELSE 75
                    END
                ),
                'Competency demonstration completed',
                CASE WHEN i <= 7 THEN 'approved' ELSE 'pending' END,
                CASE WHEN i <= 4 THEN 'approved' ELSE 'pending' END
            );
        END LOOP;
        
        -- Create journal entries
        FOR j IN 1..4 LOOP
            INSERT INTO public.practicum_records (
                id, assignment_id, student_id, record_type, record_date,
                journal_content, student_notes, preceptor_status, instructor_status
            ) VALUES (
                gen_random_uuid(), assignment_id, lead_ids[i], 'journal',
                (now()::date - interval '60 days' + (j * 14) * interval '1 day'),
                'Week ' || j || ' reflection: Clinical experiences and learning progress. Developed skills in patient care and gained valuable hands-on experience.',
                'Weekly journal submission',
                CASE WHEN i <= 6 THEN 'approved' ELSE 'pending' END,
                CASE WHEN i <= 4 THEN 'approved' ELSE 'pending' END
            );
        END LOOP;
        
    END LOOP;
    
    -- Create practicum journey for batch identification
    INSERT INTO public.practicum_journeys (
        id, user_id, program_id, journey_name, steps, is_default, is_active
    ) VALUES (
        gen_random_uuid(), current_user_id, nursing_program_id, 'missing-attendance-av-1',
        '[
            {"type": "attendance", "name": "Clinical Hours", "required": true, "target": 240},
            {"type": "competency", "name": "Competency Evaluations", "required": true, "target": 10},
            {"type": "journal", "name": "Weekly Journals", "required": true, "target": 8}
        ]'::jsonb,
        false, true
    );
    
END $$;