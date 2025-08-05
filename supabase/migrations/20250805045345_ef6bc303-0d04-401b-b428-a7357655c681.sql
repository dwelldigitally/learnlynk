-- Create dummy email data for showcasing email management functionality

-- First, create a demo email account for the current user
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
) VALUES (
  gen_random_uuid(),
  auth.uid(),
  'admin@westcoastcollege.edu',
  'Admin - West Coast College',
  'microsoft',
  'individual',
  true,
  now() - interval '30 days',
  now()
);

-- Store the email account ID for later use
DO $$
DECLARE
  email_account_uuid UUID;
  team_inbox_uuid UUID;
BEGIN
  -- Get the created email account ID
  SELECT id INTO email_account_uuid FROM public.email_accounts WHERE user_id = auth.uid() AND email_address = 'admin@westcoastcollege.edu' LIMIT 1;
  
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
  ) VALUES (
    gen_random_uuid(),
    'Admissions Team',
    'admissions@westcoastcollege.edu',
    'Shared inbox for admissions inquiries and student communications',
    email_account_uuid,
    auth.uid(),
    true,
    now() - interval '30 days',
    now()
  ) RETURNING id INTO team_inbox_uuid;

  -- Add current user as admin of the team inbox
  INSERT INTO public.team_inbox_members (
    id,
    team_inbox_id,
    user_id,
    role,
    permissions,
    added_at
  ) VALUES (
    gen_random_uuid(),
    team_inbox_uuid,
    auth.uid(),
    'admin',
    '{"can_assign": true, "can_manage_members": true, "can_delete": true}',
    now() - interval '30 days'
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
    gen_random_uuid(),
    'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAA=',
    email_account_uuid,
    team_inbox_uuid,
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

  -- Follow-up from existing lead
  (
    gen_random_uuid(),
    'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAB=',
    email_account_uuid,
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
    auth.uid(),
    now() - interval '23 hours',
    '{"sensitivity": "normal", "categories": ["Education", "Follow-up"], "hasAttachments": true}',
    now() - interval '1 day',
    now() - interval '23 hours'
  ),

  -- New inquiry about nursing program
  (
    gen_random_uuid(),
    'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAC=',
    email_account_uuid,
    team_inbox_uuid,
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
    gen_random_uuid(),
    'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAD=',
    email_account_uuid,
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
    gen_random_uuid(),
    'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAE=',
    email_account_uuid,
    team_inbox_uuid,
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
    gen_random_uuid(),
    'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAF=',
    email_account_uuid,
    team_inbox_uuid,
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

  -- Parent inquiry about programs
  (
    gen_random_uuid(),
    'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAG=',
    email_account_uuid,
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
    auth.uid(),
    now() - interval '1 day',
    '{"sensitivity": "normal", "categories": ["Parent Inquiry", "Campus Visit", "Psychology"]}',
    now() - interval '2 days',
    now() - interval '1 day'
  ),

  -- Spam/Low relevance email
  (
    gen_random_uuid(),
    'AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e1-T-KuuEAAAABDAAAiIsqMbYjsT5e1-T-KuuEAAAAAATOAAH=',
    email_account_uuid,
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

END $$;