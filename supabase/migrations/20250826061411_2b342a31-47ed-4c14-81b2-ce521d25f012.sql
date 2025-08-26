-- Insert demo student actions with comprehensive metadata (with proper UUIDs)
INSERT INTO student_actions (
  id, user_id, student_id, action_type, instruction, reason_chips, priority, status, scheduled_at, created_at, metadata
) VALUES
-- Hot Prospects (High yield, urgent)
('770e8400-e29b-41d4-a716-446655440001', auth.uid(), '880e8400-e29b-41d4-a716-446655440001', 'call', 'Call Sarah Johnson immediately - new MBA inquiry', ARRAY['Speed-to-Lead', 'High yield', 'New inquiry'], 1, 'pending', now() - interval '30 minutes', now(), jsonb_build_object(
  'student_name', 'Sarah Johnson',
  'program', 'MBA - Business Administration',
  'yield_score', 85,
  'yield_band', 'high',
  'conversion_stage', 'lead',
  'contact_info', jsonb_build_object('phone', '+1-555-0123', 'email', 'sarah.johnson@email.com', 'location', 'New York, NY'),
  'revenue_potential', 45000,
  'journey_name', 'Business Administration Pathway',
  'stage_name', 'Initial Contact',
  'play_name', 'Speed-to-Lead Response',
  'play_category', 'immediate_response',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

('770e8400-e29b-41d4-a716-446655440002', auth.uid(), '880e8400-e29b-41d4-a716-446655440002', 'email', 'Follow up with Michael Chen on stalled application', ARRAY['Application Stalled', 'High potential', '7-day stall'], 1, 'pending', now() - interval '2 hours', now(), jsonb_build_object(
  'student_name', 'Michael Chen',
  'program', 'MS - Data Science',
  'yield_score', 78,
  'yield_band', 'high',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-0234', 'email', 'michael.chen@email.com', 'location', 'San Francisco, CA'),
  'revenue_potential', 38000,
  'journey_name', 'Technology Fast Track',
  'stage_name', 'Application Review',
  'play_name', 'Application Nurture',
  'play_category', 'nurture_sequence',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

('770e8400-e29b-41d4-a716-446655440003', auth.uid(), '880e8400-e29b-41d4-a716-446655440003', 'call', 'Contact Emma Rodriguez about deposit decision', ARRAY['Deposit Follow-up', 'Decision pending', 'High value'], 1, 'pending', now() + interval '1 hour', now(), jsonb_build_object(
  'student_name', 'Emma Rodriguez',
  'program', 'MSN - Nurse Practitioner',
  'yield_score', 92,
  'yield_band', 'high',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-0345', 'email', 'emma.rodriguez@email.com', 'location', 'Miami, FL'),
  'revenue_potential', 52000,
  'journey_name', 'Healthcare Professional Track',
  'stage_name', 'Enrollment Decision',
  'play_name', 'Deposit Follow-up',
  'play_category', 'deposit_follow_up',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

-- Calls to Make
('770e8400-e29b-41d4-a716-446655440004', auth.uid(), '880e8400-e29b-41d4-a716-446655440004', 'call', 'Schedule interview with David Kim for MBA program', ARRAY['Interview Scheduler', 'Qualified candidate'], 2, 'pending', now() + interval '2 hours', now(), jsonb_build_object(
  'student_name', 'David Kim',
  'program', 'MBA - Executive Program',
  'yield_score', 71,
  'yield_band', 'medium',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-0456', 'email', 'david.kim@email.com', 'location', 'Seattle, WA'),
  'revenue_potential', 42000,
  'play_name', 'Interview Scheduler',
  'play_category', 'interview_scheduler',
  'generation_source', 'standard-plays',
  'journey_context', false
)),

('770e8400-e29b-41d4-a716-446655440005', auth.uid(), '880e8400-e29b-41d4-a716-446655440005', 'call', 'Call Amanda Thompson about program details', ARRAY['Speed-to-Lead', 'Information request'], 2, 'pending', now() + interval '3 hours', now(), jsonb_build_object(
  'student_name', 'Amanda Thompson',
  'program', 'MS - Cybersecurity',
  'yield_score', 65,
  'yield_band', 'medium',
  'conversion_stage', 'lead',
  'contact_info', jsonb_build_object('phone', '+1-555-0567', 'email', 'amanda.thompson@email.com', 'location', 'Austin, TX'),
  'revenue_potential', 35000,
  'journey_name', 'Technology Fast Track',
  'stage_name', 'Program Exploration',
  'play_name', 'Speed-to-Lead Response',
  'play_category', 'immediate_response',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

-- Communications (emails, messages)
('770e8400-e29b-41d4-a716-446655440006', auth.uid(), '880e8400-e29b-41d4-a716-446655440006', 'email', 'Send follow-up email to Robert Wilson about application status', ARRAY['Application Nurture', '3-day follow-up'], 2, 'pending', now() + interval '4 hours', now(), jsonb_build_object(
  'student_name', 'Robert Wilson',
  'program', 'MBA - Healthcare Management',
  'yield_score', 58,
  'yield_band', 'medium',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-0678', 'email', 'robert.wilson@email.com', 'location', 'Chicago, IL'),
  'revenue_potential', 41000,
  'journey_name', 'Healthcare Professional Track',
  'stage_name', 'Application Submitted',
  'play_name', 'Application Nurture',
  'play_category', 'nurture_sequence',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

('770e8400-e29b-41d4-a716-446655440007', auth.uid(), '880e8400-e29b-41d4-a716-446655440007', 'email', 'Send program brochure to Lisa Garcia', ARRAY['Manual follow-up', 'Information request'], 3, 'pending', now() + interval '1 day', now(), jsonb_build_object(
  'student_name', 'Lisa Garcia',
  'program', 'MS - Marketing Analytics',
  'yield_score', 45,
  'yield_band', 'low',
  'conversion_stage', 'lead',
  'contact_info', jsonb_build_object('phone', '+1-555-0789', 'email', 'lisa.garcia@email.com', 'location', 'Denver, CO'),
  'revenue_potential', 28000,
  'generation_source', 'manual',
  'journey_context', false
)),

('770e8400-e29b-41d4-a716-446655440008', auth.uid(), '880e8400-e29b-41d4-a716-446655440008', 'sms', 'Send SMS reminder to Jessica White about interview', ARRAY['Manual SMS', 'Interview reminder'], 2, 'pending', now() + interval '5 hours', now(), jsonb_build_object(
  'student_name', 'Jessica White',
  'program', 'MSN - Psychiatric Mental Health',
  'yield_score', 63,
  'yield_band', 'medium',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-1345', 'email', 'jessica.white@email.com', 'location', 'Portland, OR'),
  'revenue_potential', 50000,
  'generation_source', 'manual',
  'journey_context', false
)),

-- Document Reviews
('770e8400-e29b-41d4-a716-446655440009', auth.uid(), '880e8400-e29b-41d4-a716-446655440009', 'document_request', 'Request transcripts from Jennifer Lopez', ARRAY['Document Collection', 'Missing transcripts'], 2, 'pending', now() + interval '6 hours', now(), jsonb_build_object(
  'student_name', 'Jennifer Lopez',
  'program', 'MSN - Family Nurse Practitioner',
  'yield_score', 73,
  'yield_band', 'high',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-0890', 'email', 'jennifer.lopez@email.com', 'location', 'Phoenix, AZ'),
  'revenue_potential', 48000,
  'journey_name', 'Healthcare Professional Track',
  'stage_name', 'Document Collection',
  'play_name', 'Document Collection',
  'play_category', 'document_follow_up',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

('770e8400-e29b-41d4-a716-446655440010', auth.uid(), '880e8400-e29b-41d4-a716-446655440010', 'review', 'Review application documents for Daniel Taylor', ARRAY['Document Collection', 'Review needed'], 3, 'pending', now() + interval '8 hours', now(), jsonb_build_object(
  'student_name', 'Daniel Taylor',
  'program', 'MBA - Operations Management',
  'yield_score', 54,
  'yield_band', 'medium',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-1456', 'email', 'daniel.taylor@email.com', 'location', 'Nashville, TN'),
  'revenue_potential', 40000,
  'journey_name', 'Business Administration Pathway',
  'stage_name', 'Document Review',
  'play_name', 'Document Collection',
  'play_category', 'document_follow_up',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

-- Overdue/Urgent Items
('770e8400-e29b-41d4-a716-446655440011', auth.uid(), '880e8400-e29b-41d4-a716-446655440011', 'call', 'OVERDUE: Call Marcus Johnson about enrollment deadline', ARRAY['Speed-to-Lead', 'Deadline approaching', 'URGENT'], 1, 'pending', now() - interval '1 day', now(), jsonb_build_object(
  'student_name', 'Marcus Johnson',
  'program', 'MBA - Finance',
  'yield_score', 81,
  'yield_band', 'high',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-0901', 'email', 'marcus.johnson@email.com', 'location', 'Atlanta, GA'),
  'revenue_potential', 44000,
  'journey_name', 'Business Administration Pathway',
  'stage_name', 'Enrollment Deadline',
  'play_name', 'Speed-to-Lead Response',
  'play_category', 'immediate_response',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

('770e8400-e29b-41d4-a716-446655440012', auth.uid(), '880e8400-e29b-41d4-a716-446655440012', 'email', 'OVERDUE: Request missing documents from Tony Martinez', ARRAY['Document Collection', '5 days overdue'], 1, 'pending', now() - interval '5 days', now(), jsonb_build_object(
  'student_name', 'Tony Martinez',
  'program', 'MS - Software Engineering',
  'yield_score', 67,
  'yield_band', 'medium',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-1012', 'email', 'tony.martinez@email.com', 'location', 'Los Angeles, CA'),
  'revenue_potential', 36000,
  'journey_name', 'Technology Fast Track',
  'stage_name', 'Document Collection',
  'play_name', 'Document Collection',
  'play_category', 'document_follow_up',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

-- Conversion Opportunities
('770e8400-e29b-41d4-a716-446655440013', auth.uid(), '880e8400-e29b-41d4-a716-446655440013', 'call', 'Process deposit for Rachel Green - ready to enroll!', ARRAY['Deposit Follow-up', 'Ready to enroll', 'High value'], 1, 'pending', now() + interval '30 minutes', now(), jsonb_build_object(
  'student_name', 'Rachel Green',
  'program', 'MBA - Marketing',
  'yield_score', 89,
  'yield_band', 'high',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-1123', 'email', 'rachel.green@email.com', 'location', 'Boston, MA'),
  'revenue_potential', 46000,
  'journey_name', 'Business Administration Pathway',
  'stage_name', 'Deposit Ready',
  'play_name', 'Deposit Follow-up',
  'play_category', 'deposit_follow_up',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
)),

('770e8400-e29b-41d4-a716-446655440014', auth.uid(), '880e8400-e29b-41d4-a716-446655440014', 'email', 'Follow up with Kevin Brown on decision timeline', ARRAY['Application Nurture', 'Decision pending', 'High potential'], 2, 'pending', now() + interval '2 days', now(), jsonb_build_object(
  'student_name', 'Kevin Brown',
  'program', 'MS - Artificial Intelligence',
  'yield_score', 76,
  'yield_band', 'high',
  'conversion_stage', 'applicant',
  'contact_info', jsonb_build_object('phone', '+1-555-1234', 'email', 'kevin.brown@email.com', 'location', 'San Diego, CA'),
  'revenue_potential', 39000,
  'journey_name', 'Technology Fast Track',
  'stage_name', 'Decision Pending',
  'play_name', 'Application Nurture',
  'play_category', 'nurture_sequence',
  'generation_source', 'journey-orchestrator',
  'journey_context', true
));