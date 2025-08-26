-- Insert sample student actions for testing bulk selection with proper student_id
INSERT INTO student_actions (
  user_id,
  student_id,
  action_type,
  instruction,
  priority,
  status,
  scheduled_at,
  metadata
) VALUES 
(
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
  gen_random_uuid(),
  'call',
  'Follow up on application status and answer any questions about program requirements',
  1,
  'pending',
  now() + interval '1 hour',
  '{"student_name": "Sarah Johnson", "program": "Computer Science", "yield_score": 85, "contact_info": {"phone": "+1-555-0123", "email": "sarah.johnson@email.com"}, "journey_context": true, "stage_name": "Application Review"}'
),
(
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
  gen_random_uuid(),
  'call',
  'Schedule campus visit and discuss financial aid options',
  2,
  'pending',
  now() + interval '2 hours',
  '{"student_name": "Michael Chen", "program": "Business Administration", "yield_score": 92, "contact_info": {"phone": "+1-555-0456", "email": "michael.chen@email.com"}, "journey_context": true, "stage_name": "Pre-enrollment"}'
),
(
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
  gen_random_uuid(),
  'call',
  'Address concerns about course schedule and workload',
  1,
  'pending',
  now() - interval '30 minutes',
  '{"student_name": "Emily Rodriguez", "program": "Nursing", "yield_score": 78, "contact_info": {"phone": "+1-555-0789", "email": "emily.rodriguez@email.com"}, "journey_context": false, "generation_source": "manual"}'
),
(
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
  gen_random_uuid(),
  'email',
  'Send course catalog and enrollment deadlines information',
  3,
  'pending',
  now() + interval '3 hours',
  '{"student_name": "David Park", "program": "Engineering", "yield_score": 67, "contact_info": {"phone": "+1-555-0321", "email": "david.park@email.com"}, "journey_context": true, "stage_name": "Information Gathering"}'
);