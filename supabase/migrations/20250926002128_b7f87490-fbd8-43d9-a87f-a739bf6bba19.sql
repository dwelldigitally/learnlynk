-- Create demo lead and attach valid student portal token
WITH new_lead AS (
  INSERT INTO public.leads (
    source,
    first_name,
    last_name,
    email
  ) VALUES (
    'webform',
    'Demo',
    'Student',
    'demo.student@example.com'
  )
  RETURNING id
)
INSERT INTO public.student_portal_access (
  access_token,
  student_name,
  lead_id,
  programs_applied,
  status,
  expires_at,
  application_date
) VALUES (
  'demo_token',
  'Demo Student',
  (SELECT id FROM new_lead),
  ARRAY['Nursing Program', 'Medical Assistant']::text[],
  'active',
  NOW() + INTERVAL '1 year',
  NOW()
)
ON CONFLICT (access_token) DO UPDATE SET
  lead_id = COALESCE(student_portal_access.lead_id, EXCLUDED.lead_id),
  status = 'active',
  expires_at = NOW() + INTERVAL '1 year';