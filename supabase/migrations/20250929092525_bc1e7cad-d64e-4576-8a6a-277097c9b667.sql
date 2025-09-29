-- Seed practicum assignments for the specific program, mapping existing leads to sites for the SAME program owner
DO $$
DECLARE
  v_program_id uuid := '0a79a840-f423-4b68-9eed-93b0215a6d6a';
  v_user_id uuid;
BEGIN
  -- Find the owner of the program (ensures consistency with RLS)
  SELECT user_id INTO v_user_id
  FROM public.practicum_programs
  WHERE id = v_program_id;
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Program % not found, cannot seed assignments', v_program_id;
    RETURN;
  END IF;

  -- Create a temp list to pair first N leads to first N sites for this user
  WITH leads_data AS (
    SELECT l.id AS lead_id, row_number() over (order by l.created_at) rn
    FROM public.leads l
    WHERE l.user_id = v_user_id
  ),
  sites_data AS (
    SELECT s.id AS site_id, row_number() over (order by s.created_at) rn
    FROM public.practicum_sites s
    WHERE s.user_id = v_user_id
  ),
  journeys AS (
    SELECT j.id AS journey_id
    FROM public.practicum_journeys j
    WHERE j.user_id = v_user_id AND j.is_active = true
    ORDER BY j.created_at
    LIMIT 1
  ),
  pairs AS (
    SELECT l.lead_id, s.site_id, COALESCE((SELECT journey_id FROM journeys), NULL) as journey_id,
           l.rn
    FROM leads_data l
    JOIN sites_data s ON s.rn = l.rn
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
    v_user_id,
    p.lead_id,
    v_program_id,
    p.site_id,
    p.journey_id,
    -- staggered demo dates
    (DATE '2024-02-01' + (p.rn-1) * INTERVAL '7 days')::date AS start_date,
    (DATE '2024-06-01' + (p.rn-1) * INTERVAL '14 days')::date AS end_date,
    CASE WHEN p.rn = 1 THEN 'completed'
         WHEN p.rn <= 3 THEN 'in_progress'
         ELSE 'active' END AS status,
    1 AS current_step,
    0 AS hours_completed,
    0 AS hours_approved,
    0 AS completion_percentage,
    NULL::text AS notes,
    now(),
    now()
  FROM pairs p
  -- Only create if this lead is not already assigned to this program
  WHERE NOT EXISTS (
    SELECT 1 FROM public.practicum_assignments pa
    WHERE pa.lead_id = p.lead_id AND pa.program_id = v_program_id
  )
  -- cap to 5 demo assignments
  LIMIT 5;
END $$;

-- Show how many assignments now exist for this program (for debugging)
-- SELECT count(*) FROM public.practicum_assignments WHERE program_id = '0a79a840-f423-4b68-9eed-93b0215a6d6a';