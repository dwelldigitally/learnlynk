-- Insert sample data for master programs
INSERT INTO master_programs (user_id, name, code, description, type, duration, campus, delivery_method, status, color, category, entry_requirements, document_requirements, fee_structure, is_active) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Bachelor of Science in Computer Science', 'BSC-CS', 'Comprehensive program covering programming, algorithms, and software engineering', 'undergraduate', '4 years', 'Main Campus', 'on-campus', 'active', '#3B82F6', 'Science & Technology', '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, true),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Master of Business Administration', 'MBA', 'Advanced business administration and leadership program', 'postgraduate', '2 years', 'Downtown Campus', 'hybrid', 'active', '#10B981', 'Business', '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, true),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Certificate in Digital Marketing', 'CDM', 'Professional certificate in digital marketing strategies', 'certificate', '6 months', 'Online', 'online', 'active', '#F59E0B', 'Marketing', '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, true);

-- Insert sample data for master marketing sources
INSERT INTO master_marketing_sources (user_id, name, category, description, cost_per_lead, conversion_rate, is_active, tracking_parameters) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Google Ads', 'digital', 'Pay-per-click advertising on Google search and display network', 45.50, 12.5, true, '{}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Facebook Ads', 'social', 'Social media advertising on Facebook and Instagram', 32.75, 8.3, true, '{}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Organic Search', 'organic', 'Search engine optimization and organic traffic', 0.00, 15.2, true, '{}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Email Marketing', 'email', 'Newsletter and promotional email campaigns', 5.25, 22.1, true, '{}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Referral Program', 'referral', 'Student and partner referral program', 25.00, 35.8, true, '{}'::jsonb);

-- Insert sample data for master campuses
INSERT INTO master_campuses (user_id, name, code, address, city, state, country, postal_code, phone, email, campus_type, is_active, facilities) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Main Campus', 'MAIN', '123 University Avenue', 'Toronto', 'Ontario', 'Canada', 'M5S 3M2', '+1-416-555-0123', 'main@university.edu', 'main', true, '["Library", "Computer Labs", "Student Center", "Cafeteria"]'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Downtown Campus', 'DOWN', '456 Business District', 'Toronto', 'Ontario', 'Canada', 'M5H 1M1', '+1-416-555-0124', 'downtown@university.edu', 'satellite', true, '["Meeting Rooms", "Executive Lounge", "Parking"]'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Scarborough Campus', 'SCAR', '789 Suburban Road', 'Scarborough', 'Ontario', 'Canada', 'M1B 5K7', '+1-416-555-0125', 'scarborough@university.edu', 'satellite', true, '["Library", "Study Rooms", "Parking"]'::jsonb);

-- Insert sample data for master lead statuses
INSERT INTO master_lead_statuses (user_id, name, stage, description, color, is_active, order_index, is_final, next_actions) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'New Inquiry', 'Lead Form', 'Fresh lead just submitted inquiry form', '#3B82F6', true, 1, false, '["Contact within 24 hours", "Send welcome email"]'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Contact Attempted', 'Lead Form', 'Initial contact attempt made', '#F59E0B', true, 2, false, '["Follow up call", "Send SMS"]'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Qualified Lead', 'Lead Form', 'Lead shows genuine interest and meets criteria', '#10B981', true, 3, false, '["Schedule counseling session", "Send program information"]'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Application Started', 'Send Documents', 'Student has begun application process', '#8B5CF6', true, 4, false, '["Assist with application", "Send document checklist"]'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Documents Submitted', 'Document Approval', 'All required documents received', '#06B6D4', true, 5, false, '["Review documents", "Schedule interview if needed"]'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Payment Pending', 'Fee Payment', 'Awaiting application or enrollment fees', '#F97316', true, 6, false, '["Send payment reminder", "Offer payment plan"]'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Enrolled', 'Accepted', 'Student successfully enrolled', '#22C55E', true, 7, true, '["Send welcome package", "Add to orientation"]'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Not Interested', 'Lead Form', 'Lead is not interested in pursuing', '#EF4444', true, 8, true, '["Mark as closed", "Add to nurture campaign"]'::jsonb);

-- Insert sample data for master call types
INSERT INTO master_call_types (user_id, name, description, category, typical_duration, is_active, follow_up_required, script_template) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Initial Inquiry', 'First contact with prospective student', 'sales', 15, true, true, 'Thank you for your interest in our programs. Let me help you find the right fit...'),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Program Consultation', 'Detailed discussion about specific programs', 'consultation', 30, true, true, 'I understand you are interested in [Program Name]. Let me walk you through the details...'),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Application Support', 'Helping student with application process', 'support', 20, true, false, 'I am here to help you complete your application. Which step are you currently on?'),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Document Follow-up', 'Following up on missing documents', 'follow_up', 10, true, true, 'I am calling regarding the outstanding documents for your application...'),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Payment Reminder', 'Reminder about pending payments', 'financial', 10, true, true, 'I am calling to remind you about the pending payment for your application...'),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Welcome Call', 'Welcoming newly enrolled students', 'onboarding', 15, true, false, 'Congratulations on your enrollment! I am calling to welcome you and provide next steps...');

-- Insert sample data for master communication templates
INSERT INTO master_communication_templates (user_id, name, type, subject, content, variables, is_active, usage_count) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Welcome Email', 'email', 'Welcome to {{institution_name}}!', 'Dear {{student_name}}, Thank you for your interest in {{program_name}}. We are excited to help you on your educational journey...', '["student_name", "program_name", "institution_name"]'::jsonb, true, 0),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Document Reminder', 'email', 'Missing Documents - Action Required', 'Dear {{student_name}}, We are still waiting for the following documents: {{missing_documents}}. Please submit them at your earliest convenience...', '["student_name", "missing_documents", "deadline_date"]'::jsonb, true, 0),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Payment Reminder SMS', 'sms', '', 'Hi {{student_name}}, your payment of ${{amount}} for {{program_name}} is due on {{due_date}}. Pay now: {{payment_link}}', '["student_name", "amount", "program_name", "due_date", "payment_link"]'::jsonb, true, 0),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Application Approved', 'email', 'Congratulations! Application Approved', 'Dear {{student_name}}, We are pleased to inform you that your application for {{program_name}} has been approved...', '["student_name", "program_name", "start_date", "next_steps"]'::jsonb, true, 0),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Orientation Invitation', 'email', 'Orientation Details - {{program_name}}', 'Dear {{student_name}}, You are invited to attend the orientation for {{program_name}} on {{orientation_date}}...', '["student_name", "program_name", "orientation_date", "location", "agenda"]'::jsonb, true, 0);

-- Insert sample data for master document templates
INSERT INTO master_document_templates (user_id, name, type, category, description, mandatory, max_size, accepted_formats, stage, applicable_programs, instructions, examples, is_system_template) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'High School Transcript', 'academic', 'transcripts', 'Official high school transcripts or equivalent', true, 10, '["pdf", "jpg", "png"]'::jsonb, 'application', '["All Programs"]'::jsonb, 'Submit official transcripts from your high school or equivalent institution. Documents must be in English or accompanied by certified translation.', '["transcript_sample.pdf"]'::jsonb, false),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Passport Copy', 'identification', 'identity', 'Clear copy of passport biographical page', true, 5, '["pdf", "jpg", "png"]'::jsonb, 'application', '["All Programs"]'::jsonb, 'Provide a clear, legible copy of your passport biographical page. Ensure all information is visible.', '["passport_sample.jpg"]'::jsonb, false),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'English Proficiency Test', 'language', 'language_proof', 'IELTS, TOEFL, or equivalent English test results', true, 5, '["pdf"]'::jsonb, 'application', '["BSC-CS", "MBA"]'::jsonb, 'Submit official English proficiency test results. Minimum scores: IELTS 6.5, TOEFL 79.', '["ielts_sample.pdf", "toefl_sample.pdf"]'::jsonb, false),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Statement of Purpose', 'academic', 'essays', 'Personal statement explaining motivation and goals', true, 2, '["pdf", "doc", "docx"]'::jsonb, 'application', '["MBA"]'::jsonb, 'Write a 500-800 word statement explaining your motivation, career goals, and why you chose this program.', '["sop_sample.pdf"]'::jsonb, false),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Work Experience Letter', 'professional', 'experience', 'Letter from employer confirming work experience', false, 5, '["pdf", "jpg", "png"]'::jsonb, 'application', '["MBA", "CDM"]'::jsonb, 'Provide letter from current or previous employer confirming your work experience, role, and duration.', '["work_letter_sample.pdf"]'::jsonb, false);

-- Insert sample data for master requirements
INSERT INTO master_requirements (user_id, name, type, category, description, minimum_value, maximum_value, units, is_mandatory, applicable_programs, documentation_required, verification_method, is_active) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Minimum Age', 'age', 'eligibility', 'Minimum age requirement for admission', '17', '65', 'years', true, '["All Programs"]'::jsonb, '["Birth Certificate", "Passport"]'::jsonb, 'document_verification', true),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'High School GPA', 'academic', 'grades', 'Minimum GPA from high school or equivalent', '2.5', '4.0', 'GPA', true, '["BSC-CS", "MBA"]'::jsonb, '["Official Transcripts"]'::jsonb, 'transcript_verification', true),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'English Proficiency', 'language', 'language_skills', 'Minimum English language proficiency', '6.5', '9.0', 'IELTS', true, '["BSC-CS", "MBA"]'::jsonb, '["IELTS", "TOEFL", "PTE"]'::jsonb, 'test_score_verification', true),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Work Experience', 'experience', 'professional', 'Minimum work experience required', '2', '10', 'years', true, '["MBA"]'::jsonb, '["Work Experience Letter", "Resume"]'::jsonb, 'employer_verification', true),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Computer Literacy', 'technical', 'skills', 'Basic computer and internet skills', '', '', '', false, '["CDM"]'::jsonb, '["Self Declaration"]'::jsonb, 'self_declaration', true);

-- Insert sample data for master lead priorities
INSERT INTO master_lead_priorities (user_id, name, level, description, color, sla_hours, is_active, auto_assignment_rules) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Critical', 1, 'Immediate attention required - VIP or urgent inquiry', '#EF4444', 2, true, '{"criteria": {"source": ["referral", "partnership"], "program_interest": ["MBA"]}, "assignment": "senior_counselor"}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'High', 2, 'High value lead - quick response needed', '#F97316', 4, true, '{"criteria": {"lead_score": ">75", "budget": ">10000"}, "assignment": "experienced_counselor"}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Medium', 3, 'Standard priority - normal processing', '#F59E0B', 24, true, '{"criteria": {"lead_score": "50-75"}, "assignment": "round_robin"}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Low', 4, 'Low priority - can wait for available resources', '#10B981', 48, true, '{"criteria": {"lead_score": "<50", "budget": "<5000"}, "assignment": "junior_counselor"}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Follow-up', 5, 'Existing lead requiring follow-up contact', '#6B7280', 72, true, '{"criteria": {"status": "contacted", "last_contact": ">7_days"}, "assignment": "original_counselor"}'::jsonb);

-- Insert sample data for master teams
INSERT INTO master_teams (user_id, name, type, description, specializations, region, max_daily_assignments, working_hours, performance_metrics, contact_email, contact_phone, is_active) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Admissions Team', 'internal', 'Main admissions and enrollment team', '["undergraduate", "postgraduate"]'::jsonb, 'Central', 25, '{"monday": "9:00-17:00", "tuesday": "9:00-17:00", "wednesday": "9:00-17:00", "thursday": "9:00-17:00", "friday": "9:00-17:00"}'::jsonb, '{"conversion_rate": 15.5, "avg_response_time": 4.2}'::jsonb, 'admissions@university.edu', '+1-416-555-0100', true),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'International Team', 'internal', 'Specialized team for international students', '["international", "visa_support"]'::jsonb, 'Central', 20, '{"monday": "8:00-18:00", "tuesday": "8:00-18:00", "wednesday": "8:00-18:00", "thursday": "8:00-18:00", "friday": "8:00-18:00"}'::jsonb, '{"conversion_rate": 12.3, "avg_response_time": 6.1}'::jsonb, 'international@university.edu', '+1-416-555-0101', true),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Business Programs Team', 'internal', 'Dedicated team for business and MBA programs', '["business", "MBA", "executive"]'::jsonb, 'Downtown', 15, '{"monday": "8:00-19:00", "tuesday": "8:00-19:00", "wednesday": "8:00-19:00", "thursday": "8:00-19:00", "friday": "8:00-17:00"}'::jsonb, '{"conversion_rate": 18.7, "avg_response_time": 3.5}'::jsonb, 'business@university.edu', '+1-416-555-0102', true),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Online Programs Team', 'internal', 'Team handling online and distance learning programs', '["online", "distance_learning", "certificates"]'::jsonb, 'Remote', 30, '{"monday": "7:00-19:00", "tuesday": "7:00-19:00", "wednesday": "7:00-19:00", "thursday": "7:00-19:00", "friday": "7:00-17:00"}'::jsonb, '{"conversion_rate": 13.2, "avg_response_time": 5.8}'::jsonb, 'online@university.edu', '+1-416-555-0103', true);

-- Insert sample data for master notification filters
INSERT INTO master_notification_filters (user_id, name, type, event_types, conditions, recipients, template_id, is_active, frequency) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'New Lead Alert', 'email', '["lead_created", "form_submitted"]'::jsonb, '{"source": ["website", "google_ads"], "priority": ["high", "critical"]}'::jsonb, '["admissions_team", "team_lead"]'::jsonb, 'new_lead_template', true, 'immediate'),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'High Priority Lead SMS', 'sms', '["lead_created"]'::jsonb, '{"priority": ["critical"], "program_interest": ["MBA"]}'::jsonb, '["senior_counselor", "director"]'::jsonb, 'urgent_lead_sms', true, 'immediate'),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Application Status Updates', 'email', '["application_submitted", "documents_received", "payment_completed"]'::jsonb, '{"stage": ["application", "documents", "payment"]}'::jsonb, '["student", "assigned_counselor"]'::jsonb, 'status_update_template', true, 'immediate'),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Daily Lead Summary', 'email', '["daily_summary"]'::jsonb, '{"team": ["all"]}'::jsonb, '["team_leads", "management"]'::jsonb, 'daily_summary_template', true, 'daily'),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'Enrollment Milestone', 'slack', '["enrollment_completed", "payment_received"]'::jsonb, '{"program": ["MBA", "BSC-CS"], "amount": ">5000"}'::jsonb, '["sales_team", "finance_team"]'::jsonb, 'enrollment_celebration', true, 'immediate');

-- Insert sample data for configuration metadata
INSERT INTO configuration_metadata (user_id, key, category, data_type, value, description, is_system_setting, is_encrypted, validation_rules) VALUES
('564dedbe-1214-423e-bce6-eb95d26fc662', 'default_lead_priority', 'lead_management', 'string', '"medium"', 'Default priority assigned to new leads', false, false, '{"enum": ["critical", "high", "medium", "low"]}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'auto_assign_leads', 'lead_management', 'boolean', 'true', 'Automatically assign leads to counselors', false, false, '{}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'max_daily_assignments', 'team_management', 'number', '25', 'Maximum leads assigned per counselor per day', false, false, '{"min": 1, "max": 100}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'email_notifications_enabled', 'notifications', 'boolean', 'true', 'Enable email notifications for events', false, false, '{}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'sms_notifications_enabled', 'notifications', 'boolean', 'false', 'Enable SMS notifications for urgent events', false, false, '{}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'application_deadline_days', 'academic', 'number', '30', 'Default application deadline in days from inquiry', false, false, '{"min": 1, "max": 365}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'document_upload_max_size', 'system', 'number', '10', 'Maximum file size for document uploads (MB)', true, false, '{"min": 1, "max": 100}'::jsonb),
('564dedbe-1214-423e-bce6-eb95d26fc662', 'payment_reminder_frequency', 'financial', 'string', '"weekly"', 'How often to send payment reminders', false, false, '{"enum": ["daily", "weekly", "biweekly", "monthly"]}'::jsonb);