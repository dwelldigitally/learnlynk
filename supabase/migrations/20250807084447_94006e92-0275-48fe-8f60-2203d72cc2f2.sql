-- Insert sample data for master_programs
INSERT INTO public.master_programs (user_id, name, code, description, type, duration, campus, delivery_method, status, color, category, tags, entry_requirements, document_requirements, fee_structure, is_active) VALUES
(auth.uid(), 'Bachelor of Computer Science', 'BCS001', 'Comprehensive computer science program covering programming, algorithms, and software engineering', 'Undergraduate', '4 years', 'Main Campus', 'On-campus', 'Active', '#3B82F6', 'Technology', ARRAY['programming', 'algorithms', 'software'], '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, true),
(auth.uid(), 'Master of Business Administration', 'MBA001', 'Advanced business management program for career advancement', 'Graduate', '2 years', 'Downtown Campus', 'Hybrid', 'Active', '#10B981', 'Business', ARRAY['management', 'leadership', 'strategy'], '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, true),
(auth.uid(), 'Certificate in Digital Marketing', 'CDM001', 'Short-term intensive program in digital marketing strategies', 'Certificate', '6 months', 'Online', 'Online', 'Active', '#F59E0B', 'Marketing', ARRAY['digital', 'marketing', 'social media'], '[]'::jsonb, '[]'::jsonb, '{}'::jsonb, true);

-- Insert sample data for master_marketing_sources
INSERT INTO public.master_marketing_sources (user_id, name, category, description, cost_per_lead, conversion_rate, is_active, tracking_parameters) VALUES
(auth.uid(), 'Google Ads', 'Paid Search', 'Google advertising campaigns for program promotion', 25.50, 12.5, true, '{}'::jsonb),
(auth.uid(), 'Facebook Marketing', 'Social Media', 'Facebook and Instagram advertising campaigns', 18.75, 8.3, true, '{}'::jsonb),
(auth.uid(), 'University Website', 'Organic', 'Direct inquiries through institutional website', 0.00, 15.2, true, '{}'::jsonb),
(auth.uid(), 'Education Fairs', 'Events', 'Physical and virtual education fair participation', 45.00, 22.1, true, '{}'::jsonb),
(auth.uid(), 'Student Referrals', 'Referral', 'Current student referral program', 5.00, 35.8, true, '{}'::jsonb);

-- Insert sample data for master_campuses
INSERT INTO public.master_campuses (user_id, name, code, address, city, state, country, postal_code, phone, email, website, timezone, is_active, capacity, facilities) VALUES
(auth.uid(), 'Main Campus', 'MAIN', '123 University Avenue', 'Springfield', 'IL', 'United States', '62701', '+1-217-555-0100', 'main@university.edu', 'https://main.university.edu', 'America/Chicago', true, 5000, ARRAY['Library', 'Labs', 'Cafeteria', 'Sports Complex']),
(auth.uid(), 'Downtown Campus', 'DOWN', '456 Business District', 'Springfield', 'IL', 'United States', '62702', '+1-217-555-0200', 'downtown@university.edu', 'https://downtown.university.edu', 'America/Chicago', true, 2000, ARRAY['Business Center', 'Conference Rooms', 'Parking']),
(auth.uid(), 'North Campus', 'NORTH', '789 Research Parkway', 'Springfield', 'IL', 'United States', '62703', '+1-217-555-0300', 'north@university.edu', 'https://north.university.edu', 'America/Chicago', true, 3000, ARRAY['Research Labs', 'Innovation Hub', 'Student Housing']);

-- Insert sample data for master_lead_statuses
INSERT INTO public.master_lead_statuses (user_id, name, description, color, stage, is_active, order_index, auto_transition_rules) VALUES
(auth.uid(), 'New Inquiry', 'Initial contact from prospective student', '#3B82F6', 'Lead', true, 1, '{}'::jsonb),
(auth.uid(), 'Information Sent', 'Program information has been provided', '#8B5CF6', 'Lead', true, 2, '{}'::jsonb),
(auth.uid(), 'Interested', 'Student has expressed genuine interest', '#F59E0B', 'Prospect', true, 3, '{}'::jsonb),
(auth.uid(), 'Application Started', 'Student has begun application process', '#10B981', 'Prospect', true, 4, '{}'::jsonb),
(auth.uid(), 'Application Submitted', 'Complete application received', '#059669', 'Application', true, 5, '{}'::jsonb),
(auth.uid(), 'Enrolled', 'Student has successfully enrolled', '#22C55E', 'Student', true, 6, '{}'::jsonb),
(auth.uid(), 'Not Interested', 'Student declined or not responsive', '#EF4444', 'Closed', true, 7, '{}'::jsonb);

-- Insert sample data for master_call_types
INSERT INTO public.master_call_types (user_id, name, description, duration_estimate, follow_up_required, template_notes, is_active) VALUES
(auth.uid(), 'Initial Inquiry', 'First contact call to understand student needs', 15, true, 'Gather basic information about student background and interests', true),
(auth.uid(), 'Program Information', 'Detailed explanation of specific programs', 25, true, 'Cover curriculum, prerequisites, career outcomes, and next steps', true),
(auth.uid(), 'Application Support', 'Assistance with application process', 20, false, 'Help with application requirements and deadlines', true),
(auth.uid(), 'Follow-up Call', 'Regular check-in with prospects', 10, true, 'Maintain engagement and address any new questions', true),
(auth.uid(), 'Enrollment Confirmation', 'Final enrollment and onboarding call', 30, false, 'Complete enrollment process and provide welcome information', true);

-- Insert sample data for master_communication_templates
INSERT INTO public.master_communication_templates (user_id, name, type, category, subject, content, variables, conditional_logic, is_system_template, is_active, usage_count, tags) VALUES
(auth.uid(), 'Welcome Email', 'Email', 'Welcome', 'Welcome to [University Name]!', 'Dear [Student Name], Thank you for your interest in our programs. We are excited to help you achieve your educational goals.', '{}'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['welcome', 'onboarding']),
(auth.uid(), 'Program Information', 'Email', 'Information', 'Information about [Program Name]', 'Hello [Student Name], Here is detailed information about our [Program Name] program that you requested.', '{}'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['program', 'information']),
(auth.uid(), 'Application Reminder', 'SMS', 'Reminder', '', 'Hi [Student Name], this is a friendly reminder about your application deadline on [Deadline Date].', '{}'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['reminder', 'application']),
(auth.uid(), 'Meeting Confirmation', 'Email', 'Meeting', 'Meeting Confirmation - [Date] at [Time]', 'Dear [Student Name], This confirms your meeting with [Advisor Name] on [Date] at [Time].', '{}'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['meeting', 'confirmation']);

-- Insert sample data for master_document_templates
INSERT INTO public.master_document_templates (user_id, name, type, category, description, stage, mandatory, accepted_formats, max_size, instructions, examples, applicable_programs, is_system_template, is_active, usage_count) VALUES
(auth.uid(), 'Academic Transcripts', 'Academic', 'Admissions', 'Official academic transcripts from previous institutions', 'Application', true, ARRAY['PDF', 'JPG', 'PNG'], 5, 'Submit official transcripts from all previously attended institutions', ARRAY['transcript_example.pdf']::text[], ARRAY['BCS001', 'MBA001']::text[], false, true, 0),
(auth.uid(), 'Personal Statement', 'Essay', 'Admissions', 'Personal statement or statement of purpose', 'Application', true, ARRAY['PDF', 'DOC', 'DOCX'], 2, 'Write a 500-1000 word personal statement explaining your goals', ARRAY['personal_statement_guide.pdf']::text[], ARRAY['BCS001', 'MBA001']::text[], false, true, 0),
(auth.uid(), 'Letters of Recommendation', 'Reference', 'Admissions', 'Professional or academic references', 'Application', false, ARRAY['PDF', 'DOC'], 3, 'Provide 2-3 letters of recommendation from qualified references', ARRAY[]::text[], ARRAY['MBA001']::text[], false, true, 0),
(auth.uid(), 'Portfolio', 'Creative', 'Admissions', 'Creative portfolio for design programs', 'Application', false, ARRAY['PDF', 'ZIP'], 50, 'Submit a portfolio showcasing your creative work', ARRAY['portfolio_guidelines.pdf']::text[], ARRAY[]::text[], false, true, 0);

-- Insert sample data for master_requirements
INSERT INTO public.master_requirements (user_id, name, type, category, description, minimum_value, maximum_value, units, is_mandatory, applicable_programs, verification_method, documentation_required, is_active) VALUES
(auth.uid(), 'Minimum GPA', 'Academic', 'Admission', 'Minimum Grade Point Average requirement', '2.5', '4.0', 'GPA', true, ARRAY['BCS001', 'MBA001']::text[], 'Transcript Review', ARRAY['Official Transcripts']::text[], true),
(auth.uid(), 'English Proficiency', 'Language', 'Admission', 'English language proficiency requirement', '80', '120', 'TOEFL Score', true, ARRAY['BCS001', 'MBA001']::text[], 'Test Score', ARRAY['TOEFL/IELTS Scores']::text[], true),
(auth.uid(), 'Work Experience', 'Professional', 'Admission', 'Professional work experience requirement', '2', '10', 'Years', false, ARRAY['MBA001']::text[], 'Resume Review', ARRAY['Resume', 'Employment Letters']::text[], true),
(auth.uid(), 'Age Requirement', 'Demographic', 'Admission', 'Minimum age requirement for enrollment', '18', '65', 'Years', true, ARRAY['BCS001', 'MBA001']::text[], 'ID Verification', ARRAY['Government ID']::text[], true);

-- Insert sample data for master_lead_priorities
INSERT INTO public.master_lead_priorities (user_id, name, level, color, description, auto_assignment_rules, sla_hours, is_active) VALUES
(auth.uid(), 'Critical', 1, '#EF4444', 'Immediate attention required - high-value prospects', '{}'::jsonb, 2, true),
(auth.uid(), 'High', 2, '#F59E0B', 'Important prospects requiring prompt follow-up', '{}'::jsonb, 8, true),
(auth.uid(), 'Medium', 3, '#3B82F6', 'Standard priority for regular prospects', '{}'::jsonb, 24, true),
(auth.uid(), 'Low', 4, '#6B7280', 'Lower priority prospects for routine follow-up', '{}'::jsonb, 72, true);

-- Insert sample data for master_teams
INSERT INTO public.master_teams (user_id, name, type, description, specializations, region, max_daily_assignments, working_hours, contact_email, contact_phone, is_active, performance_metrics) VALUES
(auth.uid(), 'Undergraduate Admissions', 'Admissions', 'Team handling undergraduate program inquiries', ARRAY['Bachelor Programs', 'Transfer Students']::text[], 'North America', 25, '{"start": "09:00", "end": "17:00", "timezone": "America/Chicago"}'::jsonb, 'undergrad@university.edu', '+1-217-555-1001', true, '{}'::jsonb),
(auth.uid(), 'Graduate Admissions', 'Admissions', 'Team handling graduate program inquiries', ARRAY['Master Programs', 'PhD Programs']::text[], 'North America', 20, '{"start": "09:00", "end": "17:00", "timezone": "America/Chicago"}'::jsonb, 'grad@university.edu', '+1-217-555-1002', true, '{}'::jsonb),
(auth.uid(), 'International Office', 'International', 'Team handling international student inquiries', ARRAY['Visa Support', 'International Programs']::text[], 'Global', 15, '{"start": "08:00", "end": "18:00", "timezone": "America/Chicago"}'::jsonb, 'international@university.edu', '+1-217-555-1003', true, '{}'::jsonb);

-- Insert sample data for master_notification_filters
INSERT INTO public.master_notification_filters (user_id, name, type, event_types, conditions, recipients, template_id, is_active, frequency) VALUES
(auth.uid(), 'New Lead Alert', 'Email', ARRAY['lead_created']::text[], '{"priority": ["Critical", "High"]}'::jsonb, '[{"type": "team", "id": "admissions"}]'::jsonb, null, true, 'immediate'),
(auth.uid(), 'Daily Lead Summary', 'Email', ARRAY['lead_created', 'lead_updated']::text[], '{}'::jsonb, '[{"type": "manager", "email": "manager@university.edu"}]'::jsonb, null, true, 'daily'),
(auth.uid(), 'Application Deadline Reminder', 'SMS', ARRAY['application_deadline']::text[], '{"days_before": 7}'::jsonb, '[{"type": "student", "field": "phone"}]'::jsonb, null, true, 'scheduled');

-- Insert sample data for configuration_metadata
INSERT INTO public.configuration_metadata (user_id, category, key, value, data_type, description, is_system_setting, is_encrypted, validation_rules) VALUES
(auth.uid(), 'system', 'default_timezone', '"America/Chicago"', 'string', 'Default timezone for the institution', true, false, '{}'::jsonb),
(auth.uid(), 'system', 'academic_year_start', '"2024-08-15"', 'date', 'Start date of the academic year', true, false, '{}'::jsonb),
(auth.uid(), 'communication', 'email_signature', '"Best regards,\\nUniversity Admissions Team"', 'string', 'Default email signature for communications', false, false, '{}'::jsonb),
(auth.uid(), 'lead_management', 'auto_assign_leads', 'true', 'boolean', 'Automatically assign new leads to teams', false, false, '{}'::jsonb),
(auth.uid(), 'lead_management', 'max_follow_up_attempts', '5', 'integer', 'Maximum number of follow-up attempts before marking lead as closed', false, false, '{"min": 1, "max": 10}'::jsonb);

-- Insert sample data for master_stages
INSERT INTO public.master_stages (user_id, stage_type, stage_key, stage_name, stage_description, substages, order_index, is_active, transition_rules, required_fields, automation_triggers) VALUES
(auth.uid(), 'lead_lifecycle', 'inquiry', 'Initial Inquiry', 'First contact from prospective student', '[]'::jsonb, 1, true, '{}'::jsonb, ARRAY['contact_info', 'program_interest']::text[], '[]'::jsonb),
(auth.uid(), 'lead_lifecycle', 'qualification', 'Qualification', 'Determining if lead meets program requirements', '[]'::jsonb, 2, true, '{}'::jsonb, ARRAY['academic_background', 'eligibility_check']::text[], '[]'::jsonb),
(auth.uid(), 'lead_lifecycle', 'application', 'Application Process', 'Student is actively applying to programs', '[{"name": "application_started", "description": "Application begun"}, {"name": "documents_submitted", "description": "Required documents provided"}]'::jsonb, 3, true, '{}'::jsonb, ARRAY['application_form', 'required_documents']::text[], '[]'::jsonb),
(auth.uid(), 'lead_lifecycle', 'decision', 'Admission Decision', 'Application review and admission decision', '[{"name": "under_review", "description": "Application being reviewed"}, {"name": "interview_scheduled", "description": "Interview scheduled"}, {"name": "decision_made", "description": "Admission decision finalized"}]'::jsonb, 4, true, '{}'::jsonb, ARRAY['application_review', 'decision_letter']::text[], '[]'::jsonb),
(auth.uid(), 'lead_lifecycle', 'enrollment', 'Enrollment', 'Student enrollment and onboarding process', '[{"name": "offer_accepted", "description": "Student accepted offer"}, {"name": "registration_completed", "description": "Course registration done"}, {"name": "orientation_scheduled", "description": "Orientation scheduled"}]'::jsonb, 5, true, '{}'::jsonb, ARRAY['enrollment_confirmation', 'payment_plan']::text[], '[]'::jsonb);