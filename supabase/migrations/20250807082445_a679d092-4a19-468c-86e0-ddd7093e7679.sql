-- Insert sample data into master_programs
INSERT INTO public.master_programs (user_id, name, code, description, type, duration, campus, delivery_method, status, color, category, tags, entry_requirements, document_requirements, fee_structure, is_active) VALUES
(auth.uid(), 'Bachelor of Computer Science', 'BCS101', 'Comprehensive computer science program covering programming, algorithms, and software engineering', 'undergraduate', '4 years', 'Main Campus', 'on-campus', 'active', '#3B82F6', 'Technology', ARRAY['programming', 'software', 'technology'], '[]'::jsonb, '[]'::jsonb, '{"tuition": 50000, "fees": 2000}'::jsonb, true),
(auth.uid(), 'Master of Business Administration', 'MBA201', 'Advanced business management program with leadership focus', 'graduate', '2 years', 'Business Campus', 'hybrid', 'active', '#10B981', 'Business', ARRAY['business', 'management', 'leadership'], '[]'::jsonb, '[]'::jsonb, '{"tuition": 75000, "fees": 3000}'::jsonb, true),
(auth.uid(), 'Certificate in Digital Marketing', 'CDM301', 'Intensive digital marketing certification program', 'certificate', '6 months', 'Online', 'online', 'active', '#F59E0B', 'Marketing', ARRAY['marketing', 'digital', 'online'], '[]'::jsonb, '[]'::jsonb, '{"tuition": 15000, "fees": 500}'::jsonb, true);

-- Insert sample data into master_marketing_sources
INSERT INTO public.master_marketing_sources (user_id, name, category, description, cost_per_lead, conversion_rate, is_active, tracking_parameters) VALUES
(auth.uid(), 'Google Ads', 'paid_search', 'Google search and display advertising campaigns', 25.50, 0.15, true, '{"utm_source": "google", "utm_medium": "cpc"}'::jsonb),
(auth.uid(), 'Facebook Marketing', 'social_media', 'Facebook and Instagram advertising campaigns', 18.75, 0.12, true, '{"utm_source": "facebook", "utm_medium": "social"}'::jsonb),
(auth.uid(), 'University Fair', 'events', 'Educational fairs and recruitment events', 150.00, 0.35, true, '{"event_type": "fair", "location": "various"}'::jsonb),
(auth.uid(), 'Referral Program', 'referral', 'Student and partner referral program', 0.00, 0.45, true, '{"referrer_type": "student"}'::jsonb);

-- Insert sample data into master_campuses
INSERT INTO public.master_campuses (user_id, name, code, address, city, state, country, postal_code, phone, email, website, timezone, is_active, capacity, facilities) VALUES
(auth.uid(), 'Main Campus', 'MAIN', '123 University Drive', 'Education City', 'CA', 'United States', '90210', '+1-555-0123', 'main@university.edu', 'https://university.edu/main', 'America/Los_Angeles', true, 5000, ARRAY['Library', 'Computer Labs', 'Student Center', 'Cafeteria']),
(auth.uid(), 'Business Campus', 'BIZ', '456 Commerce Street', 'Business District', 'NY', 'United States', '10001', '+1-555-0456', 'business@university.edu', 'https://university.edu/business', 'America/New_York', true, 2000, ARRAY['Conference Rooms', 'Executive Suites', 'Business Lab']),
(auth.uid(), 'Online Campus', 'ONLINE', 'Virtual Location', 'Cloud City', 'VIRTUAL', 'Global', '00000', '+1-555-0789', 'online@university.edu', 'https://university.edu/online', 'UTC', true, 10000, ARRAY['Virtual Classrooms', 'Online Library', 'Digital Labs']);

-- Insert sample data into master_lead_statuses
INSERT INTO public.master_lead_statuses (user_id, name, description, color, stage, is_active, order_index, auto_transition_rules) VALUES
(auth.uid(), 'New Lead', 'Newly captured lead awaiting initial contact', '#EF4444', 'prospect', true, 1, '{}'::jsonb),
(auth.uid(), 'Contacted', 'Lead has been contacted and shown interest', '#F59E0B', 'prospect', true, 2, '{}'::jsonb),
(auth.uid(), 'Qualified', 'Lead meets program requirements and shows strong interest', '#10B981', 'qualified', true, 3, '{}'::jsonb),
(auth.uid(), 'Application Started', 'Lead has begun the application process', '#3B82F6', 'application', true, 4, '{}'::jsonb),
(auth.uid(), 'Application Complete', 'All application materials have been submitted', '#8B5CF6', 'application', true, 5, '{}'::jsonb),
(auth.uid(), 'Enrolled', 'Student has been accepted and enrolled', '#059669', 'enrolled', true, 6, '{}'::jsonb),
(auth.uid(), 'Not Interested', 'Lead has indicated no interest in proceeding', '#6B7280', 'inactive', true, 7, '{}'::jsonb);

-- Insert sample data into master_call_types
INSERT INTO public.master_call_types (user_id, name, description, duration_estimate, follow_up_required, template_notes, is_active) VALUES
(auth.uid(), 'Initial Inquiry', 'First contact call to understand prospect needs', 15, true, 'Capture basic information: name, contact details, program interest, timeline', true),
(auth.uid(), 'Program Information', 'Detailed discussion about specific programs', 30, true, 'Provide comprehensive program details, requirements, and next steps', true),
(auth.uid(), 'Application Support', 'Assistance with application process', 20, false, 'Guide through application steps, document requirements, deadlines', true),
(auth.uid(), 'Follow-up Call', 'Regular check-in with existing prospects', 10, false, 'Check progress, answer questions, maintain engagement', true),
(auth.uid(), 'Enrollment Confirmation', 'Final enrollment and onboarding call', 25, true, 'Confirm enrollment, provide welcome information, next steps', true);

-- Insert sample data into master_communication_templates
INSERT INTO public.master_communication_templates (user_id, name, type, category, subject, content, variables, conditional_logic, is_system_template, is_active, usage_count, tags) VALUES
(auth.uid(), 'Welcome Email', 'email', 'onboarding', 'Welcome to {{university_name}}!', 'Dear {{student_name}},\n\nWelcome to {{university_name}}! We are excited to have you join our community.\n\nYour application for {{program_name}} has been received and is being processed.\n\nBest regards,\nAdmissions Team', '["student_name", "university_name", "program_name"]'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['welcome', 'onboarding']),
(auth.uid(), 'Application Reminder', 'email', 'follow_up', 'Complete Your Application - {{program_name}}', 'Hello {{student_name}},\n\nThis is a friendly reminder that your application for {{program_name}} is still in progress.\n\nMissing documents:\n{{missing_documents}}\n\nPlease submit these by {{deadline_date}}.\n\nContact us if you need assistance.\n\nBest regards,\nAdmissions Team', '["student_name", "program_name", "missing_documents", "deadline_date"]'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['reminder', 'application']),
(auth.uid(), 'SMS Follow-up', 'sms', 'follow_up', '', 'Hi {{student_name}}, just checking in on your {{program_name}} application. Any questions? Reply or call us at {{phone_number}}.', '["student_name", "program_name", "phone_number"]'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['sms', 'follow-up']);

-- Insert sample data into master_document_templates
INSERT INTO public.master_document_templates (user_id, name, type, category, description, stage, mandatory, accepted_formats, max_size, instructions, examples, applicable_programs, is_system_template, is_active, usage_count) VALUES
(auth.uid(), 'Official Transcripts', 'academic', 'transcripts', 'Official transcripts from all previously attended institutions', 'application', true, ARRAY['pdf'], 10, 'Request official transcripts directly from your previous schools. Unofficial transcripts are not accepted.', ARRAY['High school transcript', 'College transcript'], ARRAY['All Programs'], false, true, 0),
(auth.uid(), 'Personal Statement', 'essay', 'essays', 'Personal statement explaining motivation and goals', 'application', true, ARRAY['pdf', 'doc', 'docx'], 5, 'Write a 500-1000 word essay explaining your motivation for the program and career goals.', ARRAY['Career goals essay', 'Personal motivation statement'], ARRAY['Bachelor of Computer Science', 'Master of Business Administration'], false, true, 0),
(auth.uid(), 'Letters of Recommendation', 'reference', 'recommendations', 'Professional or academic references', 'application', true, ARRAY['pdf'], 5, 'Provide 2-3 letters from professors, employers, or professional contacts who can speak to your qualifications.', ARRAY['Academic reference', 'Professional reference'], ARRAY['All Programs'], false, true, 0),
(auth.uid(), 'Resume/CV', 'professional', 'experience', 'Current resume or curriculum vitae', 'application', true, ARRAY['pdf', 'doc', 'docx'], 3, 'Provide an up-to-date resume highlighting your education, work experience, and relevant skills.', ARRAY['Professional resume', 'Academic CV'], ARRAY['All Programs'], false, true, 0);

-- Insert sample data into master_requirements
INSERT INTO public.master_requirements (user_id, name, type, category, description, minimum_value, maximum_value, units, is_mandatory, applicable_programs, verification_method, documentation_required, is_active) VALUES
(auth.uid(), 'Minimum GPA', 'academic', 'grades', 'Minimum cumulative GPA requirement', '3.0', '4.0', 'GPA', true, ARRAY['Bachelor of Computer Science', 'Master of Business Administration'], 'transcript_verification', ARRAY['Official Transcripts'], true),
(auth.uid(), 'English Proficiency', 'language', 'proficiency', 'English language proficiency for international students', '80', '120', 'TOEFL iBT', true, ARRAY['All Programs'], 'test_score_verification', ARRAY['TOEFL/IELTS Score Report'], true),
(auth.uid(), 'Work Experience', 'professional', 'experience', 'Minimum professional work experience', '2', '10', 'years', false, ARRAY['Master of Business Administration'], 'resume_verification', ARRAY['Resume/CV', 'Employment Verification'], true),
(auth.uid(), 'Age Requirement', 'demographic', 'eligibility', 'Minimum age for program enrollment', '18', '65', 'years', true, ARRAY['All Programs'], 'id_verification', ARRAY['Government ID'], true);

-- Insert sample data into master_lead_priorities
INSERT INTO public.master_lead_priorities (user_id, name, level, color, description, auto_assignment_rules, sla_hours, is_active) VALUES
(auth.uid(), 'High Priority', 1, '#EF4444', 'Urgent leads requiring immediate attention', '{"criteria": {"score": ">80", "source": "referral"}}'::jsonb, 2, true),
(auth.uid(), 'Medium Priority', 2, '#F59E0B', 'Standard leads with good potential', '{"criteria": {"score": "50-80"}}'::jsonb, 24, true),
(auth.uid(), 'Low Priority', 3, '#10B981', 'Standard follow-up leads', '{"criteria": {"score": "<50"}}'::jsonb, 72, true),
(auth.uid(), 'VIP', 0, '#8B5CF6', 'Special handling for VIP prospects', '{"criteria": {"tags": "vip", "source": "executive_referral"}}'::jsonb, 1, true);

-- Insert sample data into master_teams
INSERT INTO public.master_teams (user_id, name, type, description, specializations, region, max_daily_assignments, working_hours, contact_email, contact_phone, is_active, performance_metrics) VALUES
(auth.uid(), 'Undergraduate Admissions', 'admissions', 'Team handling undergraduate program admissions', ARRAY['undergraduate_programs', 'freshman_admissions'], 'North America', 50, '{"monday": "9:00-17:00", "tuesday": "9:00-17:00", "wednesday": "9:00-17:00", "thursday": "9:00-17:00", "friday": "9:00-17:00"}'::jsonb, 'undergrad@university.edu', '+1-555-0001', true, '{"conversion_rate": 0.25, "response_time": 4}'::jsonb),
(auth.uid(), 'Graduate Admissions', 'admissions', 'Team handling graduate and professional program admissions', ARRAY['graduate_programs', 'mba_programs'], 'Global', 30, '{"monday": "8:00-18:00", "tuesday": "8:00-18:00", "wednesday": "8:00-18:00", "thursday": "8:00-18:00", "friday": "8:00-16:00"}'::jsonb, 'grad@university.edu', '+1-555-0002', true, '{"conversion_rate": 0.35, "response_time": 2}'::jsonb),
(auth.uid(), 'International Student Services', 'support', 'Specialized team for international student admissions and support', ARRAY['international_admissions', 'visa_support'], 'Global', 25, '{"monday": "6:00-22:00", "tuesday": "6:00-22:00", "wednesday": "6:00-22:00", "thursday": "6:00-22:00", "friday": "6:00-22:00"}'::jsonb, 'international@university.edu', '+1-555-0003', true, '{"conversion_rate": 0.20, "response_time": 6}'::jsonb);

-- Insert sample data into master_notification_filters
INSERT INTO public.master_notification_filters (user_id, name, type, event_types, conditions, recipients, template_id, is_active, frequency) VALUES
(auth.uid(), 'New Lead Alert', 'instant', ARRAY['lead_created', 'lead_assigned'], '{"priority": "high", "source": ["referral", "website"]}'::jsonb, '[{"type": "team", "id": "admissions_team"}, {"type": "email", "value": "alerts@university.edu"}]'::jsonb, null, true, 'immediate'),
(auth.uid(), 'Application Deadline Reminder', 'scheduled', ARRAY['application_deadline_approaching'], '{"days_before": 7, "status": "incomplete"}'::jsonb, '[{"type": "student", "method": "email"}, {"type": "advisor", "method": "dashboard"}]'::jsonb, null, true, 'daily'),
(auth.uid(), 'Weekly Performance Summary', 'digest', ARRAY['lead_converted', 'application_submitted', 'enrollment_completed'], '{"team": "all", "period": "weekly"}'::jsonb, '[{"type": "role", "value": "admissions_manager"}, {"type": "email", "value": "reports@university.edu"}]'::jsonb, null, true, 'weekly');

-- Insert sample data into configuration_metadata
INSERT INTO public.configuration_metadata (user_id, category, key, value, data_type, description, is_system_setting, is_encrypted, validation_rules) VALUES
(auth.uid(), 'system', 'default_lead_source', '"website"'::jsonb, 'string', 'Default source for leads when not specified', false, false, '{"allowed_values": ["website", "referral", "event", "social_media"]}'::jsonb),
(auth.uid(), 'notifications', 'email_enabled', 'true'::jsonb, 'boolean', 'Enable email notifications system-wide', false, false, '{}'::jsonb),
(auth.uid(), 'applications', 'auto_assign_advisor', 'true'::jsonb, 'boolean', 'Automatically assign advisor to new applications', false, false, '{}'::jsonb),
(auth.uid(), 'security', 'session_timeout_minutes', '60'::jsonb, 'number', 'Session timeout in minutes', true, false, '{"min": 15, "max": 480}'::jsonb),
(auth.uid(), 'integrations', 'aircall_enabled', 'false'::jsonb, 'boolean', 'Enable Aircall phone integration', false, false, '{}'::jsonb),
(auth.uid(), 'features', 'ai_lead_scoring', 'true'::jsonb, 'boolean', 'Enable AI-powered lead scoring', false, false, '{}'::jsonb);