-- Create a profile for the current user if it doesn't exist
INSERT INTO public.profiles (user_id, first_name, last_name, email)
SELECT 
  '564dedbf-1214-423e-bce6-eb95d26fc662'::uuid,
  'Tushar',
  'Malhotra', 
  'rockingtushar123@gmail.com'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = '564dedbf-1214-423e-bce6-eb95d26fc662'::uuid
);

-- Create some demo leads for notifications
INSERT INTO public.leads (user_id, first_name, last_name, email, status, source, priority, created_at)
VALUES 
  ('564dedbf-1214-423e-bce6-eb95d26fc662'::uuid, 'John', 'Doe', 'john.doe@example.com', 'new', 'web', 'high', now() - interval '1 hour'),
  ('564dedbf-1214-423e-bce6-eb95d26fc662'::uuid, 'Jane', 'Smith', 'jane.smith@example.com', 'new', 'social_media', 'medium', now() - interval '2 hours'),
  ('564dedbf-1214-423e-bce6-eb95d26fc662'::uuid, 'Mike', 'Johnson', 'mike.j@example.com', 'contacted', 'ads', 'low', now() - interval '1 day');

-- Create some demo tasks with overdue dates
INSERT INTO public.lead_tasks (lead_id, user_id, title, description, status, priority, due_date, task_type, created_at)
SELECT 
  l.id,
  '564dedbf-1214-423e-bce6-eb95d26fc662'::uuid,
  'Follow up call',
  'Initial follow up call with prospect',
  'pending',
  'high',
  now() - interval '1 day',
  'call',
  now() - interval '2 days'
FROM public.leads l 
WHERE l.user_id = '564dedbf-1214-423e-bce6-eb95d26fc662'::uuid 
AND l.first_name = 'John' 
LIMIT 1;

-- Create some demo student communications
INSERT INTO public.student_communications (student_id, user_id, type, direction, subject, content, status, created_at)
VALUES 
  (gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662'::uuid, 'email', 'inbound', 'Question about admission', 'I have a question about the admission process', 'unread', now() - interval '30 minutes'),
  (gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662'::uuid, 'email', 'inbound', 'Document submission', 'Please find my documents attached', 'unread', now() - interval '1 hour');

-- Create some demo student documents
INSERT INTO public.student_documents (student_id, user_id, name, type, status, created_at)
VALUES 
  (gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662'::uuid, 'Transcript.pdf', 'academic', 'pending', now() - interval '45 minutes'),
  (gen_random_uuid(), '564dedbf-1214-423e-bce6-eb95d26fc662'::uuid, 'ID_Document.pdf', 'identity', 'pending', now() - interval '1.5 hours');