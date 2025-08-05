-- Create dummy email data for showcasing email management functionality
-- Note: This creates sample data that any authenticated user can view for demo purposes

-- Create a demo email account (will use a fixed UUID and associate later)
INSERT INTO public.email_accounts (
  id,
  user_id,
  email_address,
  display_name,
  provider,
  account_type,
  is_active,
  created_at,
  updated_at
) 
SELECT 
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  user_id,
  'admin@westcoastcollege.edu',
  'Admin - West Coast College',
  'microsoft',
  'individual',
  true,
  now() - interval '30 days',
  now()
FROM (
  SELECT user_id FROM profiles LIMIT 1
) as first_user
WHERE NOT EXISTS (
  SELECT 1 FROM email_accounts WHERE email_address = 'admin@westcoastcollege.edu'
);

-- Create a team inbox
INSERT INTO public.team_inboxes (
  id,
  name,
  email_address,
  description,
  email_account_id,
  created_by,
  is_active,
  created_at,
  updated_at
) 
SELECT 
  'b8c9d5e2-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
  'Admissions Team',
  'admissions@westcoastcollege.edu',
  'Shared inbox for admissions inquiries and student communications',
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  user_id,
  true,
  now() - interval '30 days',
  now()
FROM (
  SELECT user_id FROM profiles LIMIT 1
) as first_user
WHERE NOT EXISTS (
  SELECT 1 FROM team_inboxes WHERE email_address = 'admissions@westcoastcollege.edu'
);

-- Add team inbox member
INSERT INTO public.team_inbox_members (
  id,
  team_inbox_id,
  user_id,
  role,
  permissions,
  added_at
) 
SELECT 
  'f1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
  'b8c9d5e2-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
  user_id,
  'admin',
  '{"can_assign": true, "can_manage_members": true, "can_delete": true}',
  now() - interval '30 days'
FROM (
  SELECT user_id FROM profiles LIMIT 1
) as first_user
WHERE NOT EXISTS (
  SELECT 1 FROM team_inbox_members WHERE team_inbox_id = 'b8c9d5e2-3f4a-5b6c-7d8e-9f0a1b2c3d4e'
);

-- Create diverse dummy emails
INSERT INTO public.emails (
  id,
  microsoft_id,
  email_account_id,
  team_inbox_id,
  from_email,
  from_name,
  to_emails,
  cc_emails,
  bcc_emails,
  subject,
  body_content,
  body_preview,
  sent_datetime,
  received_datetime,
  created_datetime,
  is_read,
  has_attachments,
  importance,
  status,
  ai_priority_score,
  ai_lead_match_confidence,
  ai_suggested_actions,
  lead_id,
  assigned_to,
  assigned_at,
  microsoft_metadata,
  created_at,
  updated_at
) VALUES 
-- High priority lead inquiry
(
  'e1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
  'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAA=',
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  'b8c9d5e2-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
  'sarah.johnson@email.com',
  'Sarah Johnson',
  '["admissions@westcoastcollege.edu"]',
  '[]',
  '[]',
  'MBA Program Inquiry - Urgent Application Question',
  'Hello,

I am very interested in your MBA program starting in September 2024. I have a few urgent questions:

1. What is the application deadline for the September intake?
2. Do you offer scholarships for international students?
3. Can I apply with a 3.2 GPA from my undergraduate degree?
4. What are the GMAT score requirements?

I am particularly interested in the Finance specialization and would love to schedule a call to discuss my application. I am ready to apply immediately if I meet the requirements.

Looking forward to your prompt response.

Best regards,
Sarah Johnson
Phone: +1 (555) 123-4567',
  'Hello, I am very interested in your MBA program starting in September 2024. I have a few urgent questions about application deadline, scholarships...',
  now() - interval '2 hours',
  now() - interval '2 hours',
  now() - interval '2 hours',
  false,
  false,
  'high',
  'new',
  0.92,
  0.85,
  '["schedule_call", "send_program_info", "check_eligibility", "priority_response"]',
  null,
  null,
  null,
  '{"sensitivity": "normal", "flag": "urgent", "categories": ["Education", "Inquiry"]}',
  now() - interval '2 hours',
  now() - interval '2 hours'
),

-- Follow-up from existing lead (assigned to first user)
(
  'e2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d',
  'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAB=',
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  null,
  'michael.chen@techcorp.com',
  'Michael Chen',
  '["admin@westcoastcollege.edu"]',
  '[]',
  '[]',
  'Re: Computer Science Program Application Status',
  'Hi there,

Thank you for sending me the application materials last week. I have completed my application for the Computer Science program and submitted all required documents.

I wanted to follow up on:
- When can I expect to hear about the admission decision?
- Are there any additional documents needed?
- What is the next step in the process?

Also, I noticed there might be a scholarship opportunity for students with industry experience. I have 5 years of software development experience - could you provide more information about this?

Thanks for your help!

Michael Chen
Software Engineer at TechCorp
michael.chen@techcorp.com',
  'Thank you for sending me the application materials last week. I have completed my application for the Computer Science program...',
  now() - interval '1 day',
  now() - interval '1 day',
  now() - interval '1 day',
  true,
  true,
  'normal',
  'assigned',
  0.78,
  0.92,
  '["update_application_status", "send_scholarship_info", "schedule_interview"]',
  null,
  (SELECT user_id FROM profiles LIMIT 1),
  now() - interval '23 hours',
  '{"sensitivity": "normal", "categories": ["Education", "Follow-up"], "hasAttachments": true}',
  now() - interval '1 day',
  now() - interval '23 hours'
),

-- New inquiry about nursing program
(
  'e3c4d5e6-7f8a-9b0c-1d2e-3f4a5b6c7d8e',
  'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAC=',
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  'b8c9d5e2-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
  'emily.rodriguez@gmail.com',
  'Emily Rodriguez',
  '["admissions@westcoastcollege.edu"]',
  '[]',
  '[]',
  'Nursing Program Information Request',
  'Dear Admissions Team,

I hope this email finds you well. I am writing to inquire about your Nursing program. I am a registered nurse with 3 years of experience and I am looking to advance my career with a BSN degree.

Could you please provide information about:
1. Program duration and schedule (part-time options?)
2. Tuition fees and payment plans
3. Clinical placement opportunities
4. Online vs. in-person classes ratio
5. Credit transfer from my current ADN

I am also interested in knowing if you have any upcoming information sessions or campus tours available.

Thank you for your time and assistance.

Best regards,
Emily Rodriguez, RN
Phone: (555) 987-6543
Email: emily.rodriguez@gmail.com',
  'I hope this email finds you well. I am writing to inquire about your Nursing program. I am a registered nurse with 3 years of experience...',
  now() - interval '3 hours',
  now() - interval '3 hours',
  now() - interval '3 hours',
  false,
  false,
  'normal',
  'new',
  0.74,
  0.68,
  '["send_program_brochure", "schedule_info_session", "credit_transfer_evaluation"]',
  null,
  null,
  null,
  '{"sensitivity": "normal", "categories": ["Education", "Program Inquiry"]}',
  now() - interval '3 hours',
  now() - interval '3 hours'
),

-- Low priority administrative email
(
  'e4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f',
  'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAD=',
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  null,
  'newsletter@educationtoday.com',
  'Education Today Newsletter',
  '["admin@westcoastcollege.edu"]',
  '[]',
  '[]',
  'Weekly Education Industry Newsletter - January 2024',
  'Dear Education Professional,

Welcome to this week''s edition of Education Today Newsletter!

This week''s highlights:
- New federal funding opportunities for educational institutions
- Latest trends in online learning technologies
- Upcoming education conferences and events
- Student enrollment statistics for Q4 2023

Featured Article: "The Future of Higher Education: Adapting to Post-Pandemic Learning"

[Rest of newsletter content...]

To unsubscribe, click here.

Best regards,
Education Today Team',
  'Welcome to this week''s edition of Education Today Newsletter! This week''s highlights include new federal funding opportunities...',
  now() - interval '4 hours',
  now() - interval '4 hours',
  now() - interval '4 hours',
  true,
  false,
  'low',
  'replied',
  0.15,
  0.02,
  '["archive", "unsubscribe"]',
  null,
  null,
  null,
  '{"sensitivity": "normal", "categories": ["Newsletter", "Industry"]}',
  now() - interval '4 hours',
  now() - interval '4 hours'
),

-- Urgent scholarship inquiry
(
  'e5e6f7a8-9b0c-1d2e-3f4a-5b6c7d8e9f0a',
  'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAE=',
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  'b8c9d5e2-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
  'david.kim@student.email.com',
  'David Kim',
  '["admissions@westcoastcollege.edu"]',
  '[]',
  '[]',
  'URGENT: Scholarship Application Deadline Question',
  'Dear Admissions Office,

I hope this message reaches you in time. I am in the process of applying for the Merit-Based Scholarship for the Fall 2024 Engineering program, and I have a critical question about the deadline.

The website states the deadline is January 15th, but I wanted to confirm:
1. Is this deadline at 11:59 PM in which time zone?
2. Does the deadline apply to when I submit online or when you receive all documents?
3. My reference letters are still pending - can I submit my application first and add references later?

I have been preparing this application for months and really don''t want to miss the deadline due to a misunderstanding. I have a 4.0 GPA and strong extracurricular activities, so this scholarship would make a huge difference for my education.

Please respond as soon as possible.

Urgently yours,
David Kim
Phone: (555) 456-7890
Student ID: pending',
  'I hope this message reaches you in time. I am in the process of applying for the Merit-Based Scholarship for the Fall 2024 Engineering program...',
  now() - interval '30 minutes',
  now() - interval '30 minutes',
  now() - interval '30 minutes',
  false,
  false,
  'high',
  'new',
  0.95,
  0.88,
  '["urgent_response", "clarify_deadline", "review_application", "priority_support"]',
  null,
  null,
  null,
  '{"sensitivity": "normal", "flag": "urgent", "categories": ["Scholarship", "Deadline", "Student Support"]}',
  now() - interval '30 minutes',
  now() - interval '30 minutes'
),

-- International student inquiry
(
  'e6f7a8b9-0c1d-2e3f-4a5b-6c7d8e9f0a1b',
  'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAF=',
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  'b8c9d5e2-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
  'ana.silva@internacional.br',
  'Ana Silva',
  '["admissions@westcoastcollege.edu"]',
  '[]',
  '[]',
  'International Student Application - Business Administration',
  'Hello West Coast College Admissions,

Greetings from Brazil! I am Ana Silva, and I am very interested in applying for your Business Administration program for the Fall 2024 semester.

As an international student, I have several questions:
1. What are the English proficiency requirements? (TOEFL/IELTS scores)
2. Do you provide I-20 forms for F-1 visa applications?
3. Are there housing options available for international students?
4. What is the estimated total cost including tuition, housing, and living expenses?
5. Do you offer any financial aid or scholarships for international students?
6. What documents do I need to have evaluated/translated?

My background:
- Bachelor''s degree in Economics from University of São Paulo (2022)
- IELTS score: 7.5
- 2 years work experience in financial analysis
- Strong interest in international business

I would greatly appreciate a response with detailed information and any application materials I should complete.

Obrigada (Thank you)!

Ana Silva
Email: ana.silva@internacional.br
WhatsApp: +55 11 99999-8888',
  'Greetings from Brazil! I am Ana Silva, and I am very interested in applying for your Business Administration program for the Fall 2024...',
  now() - interval '6 hours',
  now() - interval '6 hours',
  now() - interval '6 hours',
  false,
  false,
  'normal',
  'new',
  0.81,
  0.76,
  '["send_international_packet", "schedule_virtual_meeting", "verify_credentials", "i20_information"]',
  null,
  null,
  null,
  '{"sensitivity": "normal", "categories": ["International", "Business", "Visa"]}',
  now() - interval '6 hours',
  now() - interval '6 hours'
),

-- Parent inquiry about programs (assigned to first user)
(
  'e7a8b9c0-1d2e-3f4a-5b6c-7d8e9f0a1b2c',
  'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAG=',
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  null,
  'robert.thompson@familyemail.com',
  'Robert Thompson',
  '["admin@westcoastcollege.edu"]',
  '[]',
  '[]',
  'Inquiry About Programs for My Daughter',
  'Dear West Coast College,

I am writing on behalf of my daughter, Jessica Thompson, who is a high school senior interested in your college programs.

Jessica is particularly interested in:
1. Psychology program
2. Pre-med track options
3. Campus life and student activities

She has excellent grades (GPA 3.8) and is involved in volunteer work at our local hospital. We are planning to visit several colleges this spring and would like to know:

- When are your next campus tour dates?
- Can we schedule a meeting with an academic advisor?
- What scholarship opportunities are available for incoming freshmen?
- Do you have honors programs for high-achieving students?

We would appreciate any information you can provide to help Jessica make an informed decision about her college future.

Thank you for your time.

Best regards,
Robert Thompson
Parent of Jessica Thompson
Phone: (555) 234-5678
Email: robert.thompson@familyemail.com',
  'I am writing on behalf of my daughter, Jessica Thompson, who is a high school senior interested in your college programs...',
  now() - interval '2 days',
  now() - interval '2 days',
  now() - interval '2 days',
  true,
  false,
  'normal',
  'in_progress',
  0.65,
  0.71,
  '["schedule_campus_tour", "send_program_materials", "honors_program_info", "scholarship_information"]',
  null,
  (SELECT user_id FROM profiles LIMIT 1),
  now() - interval '1 day',
  '{"sensitivity": "normal", "categories": ["Parent Inquiry", "Campus Visit", "Psychology"]}',
  now() - interval '2 days',
  now() - interval '1 day'
),

-- Spam/Low relevance email
(
  'e8b9c0d1-2e3f-4a5b-6c7d-8e9f0a1b2c3d',
  'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAH=',
  'd47f4c5e-8a2d-4e3b-9f1a-2b5c8d6e9f0a',
  null,
  'sales@officesupplies.com',
  'Office Supplies Plus',
  '["admin@westcoastcollege.edu"]',
  '[]',
  '[]',
  'Special Offer: 50% Off Office Supplies This Week Only!',
  'Dear Valued Customer,

🎉 HUGE SAVINGS ALERT! 🎉

This week only, we''re offering an incredible 50% discount on all office supplies!

✅ Pens, pencils, and markers
✅ Paper and notebooks  
✅ Desk organizers
✅ Printer supplies
✅ And much more!

Don''t miss out on these amazing deals. Shop now before this offer expires!

Use code: SAVE50NOW

Visit our website: www.officesupplies.com
Call us: 1-800-SUPPLIES

Happy shopping!
Office Supplies Plus Team

Unsubscribe | Update Preferences',
  'HUGE SAVINGS ALERT! This week only, we''re offering an incredible 50% discount on all office supplies!',
  now() - interval '1 day',
  now() - interval '1 day',
  now() - interval '1 day',
  true,
  false,
  'low',
  'replied',
  0.08,
  0.01,
  '["mark_spam", "unsubscribe", "archive"]',
  null,
  null,
  null,
  '{"sensitivity": "normal", "categories": ["Marketing", "Supplies"]}',
  now() - interval '1 day',
  now() - interval '1 day'
);

-- Create some email attachments for emails that have them
INSERT INTO public.email_attachments (
  id,
  email_id,
  name,
  content_type,
  size_bytes,
  is_inline,
  microsoft_attachment_id,
  created_at
) VALUES 
(
  'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  'e2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d',
  'Transcript_Michael_Chen.pdf',
  'application/pdf',
  245760,
  false,
  'AAMkAGVmMDEzMTM4ATTACHMENT001',
  now() - interval '1 day'
),
(
  'a2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
  'e2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d',
  'Work_Experience_Letter.pdf',
  'application/pdf',
  156432,
  false,
  'AAMkAGVmMDEzMTM4ATTACHMENT002',
  now() - interval '1 day'
);

-- Create email analytics entries for processed emails
INSERT INTO public.email_analytics (
  id,
  email_id,
  user_id,
  first_response_at,
  response_time_minutes,
  resolved_at,
  resolution_time_minutes,
  lead_score_before,
  lead_score_after,
  conversion_action,
  created_at
) 
SELECT 
  'a3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
  'e2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d',
  user_id,
  now() - interval '23 hours',
  60,
  now() - interval '22 hours',
  120,
  65.0,
  78.0,
  'application_submitted',
  now() - interval '22 hours'
FROM (SELECT user_id FROM profiles LIMIT 1) as first_user

UNION ALL

SELECT 
  'a4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
  'e4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f',
  user_id,
  now() - interval '3 hours 30 minutes',
  5,
  now() - interval '3 hours 25 minutes',
  5,
  15.0,
  15.0,
  'archived',
  now() - interval '3 hours 25 minutes'
FROM (SELECT user_id FROM profiles LIMIT 1) as first_user

UNION ALL

SELECT 
  'a5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
  'e7a8b9c0-1d2e-3f4a-5b6c-7d8e9f0a1b2c',
  user_id,
  now() - interval '1 day 2 hours',
  45,
  null,
  null,
  65.0,
  71.0,
  'information_sent',
  now() - interval '1 day 2 hours'
FROM (SELECT user_id FROM profiles LIMIT 1) as first_user

UNION ALL

SELECT 
  'a6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
  'e8b9c0d1-2e3f-4a5b-6c7d-8e9f0a1b2c3d',
  user_id,
  now() - interval '1 day 30 minutes',
  2,
  now() - interval '1 day 28 minutes',
  2,
  8.0,
  8.0,
  'unsubscribed',
  now() - interval '1 day 28 minutes'
FROM (SELECT user_id FROM profiles LIMIT 1) as first_user;