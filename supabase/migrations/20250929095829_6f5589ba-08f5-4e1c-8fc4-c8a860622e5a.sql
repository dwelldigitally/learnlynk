-- Seed comprehensive practicum demo data for current user with program a07ee361-2486-4d8d-ac55-3a2fa695562a
DO $$
DECLARE
  v_program_id uuid := 'a07ee361-2486-4d8d-ac55-3a2fa695562a';
  v_current_user_id uuid := '7a4165be-42c6-49ad-974b-f3f19f8b4e4c';
  v_assignment_record RECORD;
  i integer := 0;
BEGIN
  -- First, create practicum assignments for current user with their program
  WITH leads_data AS (
    SELECT l.id AS lead_id, row_number() over (order by l.created_at) rn
    FROM public.leads l
    WHERE l.user_id = v_current_user_id
    LIMIT 5
  ),
  sites_data AS (
    SELECT s.id AS site_id, row_number() over (order by s.created_at) rn
    FROM public.practicum_sites s
    WHERE s.user_id = v_current_user_id
  ),
  journeys AS (
    SELECT j.id AS journey_id
    FROM public.practicum_journeys j
    WHERE j.user_id = v_current_user_id AND j.is_active = true
    ORDER BY j.created_at
    LIMIT 1
  ),
  pairs AS (
    SELECT l.lead_id, 
           COALESCE(s.site_id, (SELECT id FROM public.practicum_sites WHERE user_id = v_current_user_id LIMIT 1)) as site_id, 
           COALESCE((SELECT journey_id FROM journeys), NULL) as journey_id,
           l.rn
    FROM leads_data l
    LEFT JOIN sites_data s ON s.rn = l.rn
  )
  INSERT INTO public.practicum_assignments (
    user_id,
    lead_id,
    program_id,
    site_id,
    journey_id,
    start_date,
    end_date,
    status,
    current_step,
    hours_completed,
    hours_approved,
    completion_percentage,
    notes,
    created_at,
    updated_at
  )
  SELECT 
    v_current_user_id,
    p.lead_id,
    v_program_id,
    p.site_id,
    p.journey_id,
    -- Realistic demo dates spread over months
    (DATE '2024-01-15' + (p.rn-1) * INTERVAL '14 days')::date AS start_date,
    (DATE '2024-05-15' + (p.rn-1) * INTERVAL '14 days')::date AS end_date,
    CASE WHEN p.rn = 1 THEN 'completed'
         WHEN p.rn <= 3 THEN 'in_progress'
         ELSE 'active' END AS status,
    p.rn AS current_step,
    CASE WHEN p.rn = 1 THEN 120 
         WHEN p.rn = 2 THEN 85
         WHEN p.rn = 3 THEN 60
         ELSE 25 END AS hours_completed,
    CASE WHEN p.rn = 1 THEN 115
         WHEN p.rn = 2 THEN 80
         WHEN p.rn = 3 THEN 55
         ELSE 20 END AS hours_approved,
    CASE WHEN p.rn = 1 THEN 95
         WHEN p.rn = 2 THEN 75
         WHEN p.rn = 3 THEN 60
         ELSE 30 END AS completion_percentage,
    'Demo practicum assignment ' || p.rn AS notes,
    now() - (p.rn * INTERVAL '7 days'),
    now()
  FROM pairs p
  WHERE NOT EXISTS (
    SELECT 1 FROM public.practicum_assignments pa
    WHERE pa.lead_id = p.lead_id AND pa.program_id = v_program_id
  );

  -- Create diverse practicum records for each assignment
  FOR v_assignment_record IN 
    SELECT id, lead_id FROM public.practicum_assignments
    WHERE program_id = v_program_id AND user_id = v_current_user_id
  LOOP
    i := i + 1;
    
    -- Insert attendance records (mix of approved/pending)
    INSERT INTO public.practicum_records (
      user_id,
      assignment_id,
      record_type,
      date,
      hours_logged,
      status,
      preceptor_approved,
      admin_approved,
      location_data,
      description,
      created_at,
      updated_at
    )
    SELECT 
      v_current_user_id,
      v_assignment_record.id,
      'attendance',
      DATE '2024-01-15' + (generate_series(1, 8) + i*7) * INTERVAL '1 day',
      CASE WHEN random() > 0.3 THEN 8 ELSE floor(random() * 6 + 4)::integer END,
      CASE WHEN random() > 0.2 THEN 'approved' ELSE 'pending' END,
      random() > 0.25,
      random() > 0.3,
      jsonb_build_object('latitude', 40.7128 + random()*0.1, 'longitude', -74.0060 + random()*0.1),
      'Clinical rotation day ' || generate_series(1, 8),
      now() - (generate_series(1, 8) * INTERVAL '2 days'),
      now()
    FROM generate_series(1, 8);

    -- Insert competency records  
    INSERT INTO public.practicum_records (
      user_id,
      assignment_id,
      record_type,
      competency_id,
      status,
      preceptor_approved,
      admin_approved,
      preceptor_feedback,
      description,
      created_at,
      updated_at
    )
    SELECT 
      v_current_user_id,
      v_assignment_record.id,
      'competency',
      'competency_' || generate_series(1, 6),
      CASE WHEN generate_series(1, 6) <= i+2 THEN 'completed' 
           WHEN generate_series(1, 6) <= i+4 THEN 'in_progress'
           ELSE 'not_started' END,
      generate_series(1, 6) <= i+3,
      generate_series(1, 6) <= i+2,
      CASE WHEN generate_series(1, 6) <= i+2 THEN 'Excellent performance demonstrated'
           WHEN generate_series(1, 6) <= i+3 THEN 'Good progress shown'
           ELSE NULL END,
      'Core competency ' || generate_series(1, 6) || ' assessment',
      now() - (generate_series(1, 6) * INTERVAL '3 days'),
      now()
    FROM generate_series(1, 6);

    -- Insert journal entries
    INSERT INTO public.practicum_records (
      user_id,
      assignment_id,
      record_type,
      date,
      status,
      description,
      reflection_text,
      created_at,
      updated_at
    )
    SELECT 
      v_current_user_id,
      v_assignment_record.id,
      'journal',
      DATE '2024-01-20' + generate_series(1, 4) * INTERVAL '7 days',
      'submitted',
      'Weekly reflection ' || generate_series(1, 4),
      'This week I learned about ' || 
      CASE generate_series(1, 4) 
        WHEN 1 THEN 'patient care fundamentals and communication skills'
        WHEN 2 THEN 'medication administration and safety protocols' 
        WHEN 3 THEN 'clinical documentation and electronic health records'
        ELSE 'interdisciplinary collaboration and discharge planning'
      END,
      now() - (generate_series(1, 4) * INTERVAL '5 days'),
      now()
    FROM generate_series(1, 4);
  END LOOP;

  RAISE NOTICE 'Created demo practicum assignments with comprehensive records for user %', v_current_user_id;
END $$;