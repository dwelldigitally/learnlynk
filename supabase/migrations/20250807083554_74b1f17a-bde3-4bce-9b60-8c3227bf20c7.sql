-- Create helper function to get demo user ID
CREATE OR REPLACE FUNCTION get_demo_user_id() 
RETURNS UUID AS $$
DECLARE
  demo_user_id UUID;
BEGIN
  -- Try to get the current authenticated user
  SELECT auth.uid() INTO demo_user_id;
  
  -- If no authenticated user, get the first user from auth.users
  IF demo_user_id IS NULL THEN
    SELECT id INTO demo_user_id FROM auth.users LIMIT 1;
  END IF;
  
  -- If still no user, create a placeholder (this shouldn't happen in production)
  IF demo_user_id IS NULL THEN
    demo_user_id := gen_random_uuid();
  END IF;
  
  RETURN demo_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample programs
INSERT INTO master_programs (user_id, name, code, description, type, duration, campus, delivery_method, status, color, category, tags, entry_requirements, document_requirements, fee_structure, is_active) VALUES
(get_demo_user_id(), 'Bachelor of Computer Science', 'BCS001', 'Comprehensive undergraduate program in computer science covering programming, algorithms, and software engineering.', 'Undergraduate', '4 years', 'Main Campus', 'On-campus', 'Active', '#3B82F6', 'Technology', ARRAY['programming', 'software', 'technology'], '[]'::jsonb, '[]'::jsonb, '{"tuition": 15000, "fees": 2000}'::jsonb, true),
(get_demo_user_id(), 'Master of Business Administration', 'MBA002', 'Advanced business degree focusing on leadership, strategy, and management skills.', 'Graduate', '2 years', 'Downtown Campus', 'Hybrid', 'Active', '#10B981', 'Business', ARRAY['business', 'leadership', 'management'], '[]'::jsonb, '[]'::jsonb, '{"tuition": 25000, "fees": 3000}'::jsonb, true),
(get_demo_user_id(), 'Certificate in Digital Marketing', 'CDM003', 'Short-term certification program in modern digital marketing techniques.', 'Certificate', '6 months', 'Online Campus', 'Online', 'Active', '#F59E0B', 'Marketing', ARRAY['marketing', 'digital', 'online'], '[]'::jsonb, '[]'::jsonb, '{"tuition": 3000, "fees": 500}'::jsonb, true);

-- Insert sample campuses
INSERT INTO master_campuses (user_id, name, code, address, city, state, country, postal_code, phone, email, website, timezone, is_active, capacity, facilities) VALUES
(get_demo_user_id(), 'Main Campus', 'MAIN', '123 University Drive', 'College Town', 'CA', 'United States', '90210', '+1-555-0100', 'main@university.edu', 'https://main.university.edu', 'America/Los_Angeles', true, 5000, ARRAY['Library', 'Computer Labs', 'Sports Complex', 'Cafeteria']),
(get_demo_user_id(), 'Downtown Campus', 'DOWN', '456 Business Street', 'Metro City', 'CA', 'United States', '90211', '+1-555-0200', 'downtown@university.edu', 'https://downtown.university.edu', 'America/Los_Angeles', true, 2000, ARRAY['Business Center', 'Conference Rooms', 'Executive Lounge']),
(get_demo_user_id(), 'Online Campus', 'ONLN', 'Virtual Campus', 'Online', 'CA', 'United States', '00000', '+1-555-0300', 'online@university.edu', 'https://online.university.edu', 'America/Los_Angeles', true, 10000, ARRAY['Virtual Classrooms', 'Online Library', 'Tech Support']);

-- Insert sample marketing sources
INSERT INTO master_marketing_sources (user_id, name, category, description, cost_per_lead, conversion_rate, is_active, tracking_parameters) VALUES
(get_demo_user_id(), 'Google Ads', 'Paid Search', 'Google advertising campaigns for program awareness', 25.50, 0.15, true, '{"utm_source": "google", "utm_medium": "cpc"}'::jsonb),
(get_demo_user_id(), 'Facebook Marketing', 'Social Media', 'Facebook and Instagram marketing campaigns', 18.75, 0.12, true, '{"utm_source": "facebook", "utm_medium": "social"}'::jsonb),
(get_demo_user_id(), 'University Fair', 'Events', 'Local and regional university fairs and events', 45.00, 0.25, true, '{"event_type": "fair", "location": "regional"}'::jsonb),
(get_demo_user_id(), 'Referral Program', 'Referral', 'Student and alumni referral program', 0.00, 0.35, true, '{"referral_type": "student_alumni"}'::jsonb);

-- Insert sample lead statuses
INSERT INTO master_lead_statuses (user_id, name, description, color, stage, is_active, order_index, auto_transition_rules) VALUES
(get_demo_user_id(), 'New Lead', 'Newly received lead awaiting initial contact', '#EF4444', 'Initial', true, 1, '{}'::jsonb),
(get_demo_user_id(), 'Contacted', 'Lead has been contacted and initial conversation completed', '#F59E0B', 'Initial', true, 2, '{}'::jsonb),
(get_demo_user_id(), 'Interested', 'Lead has expressed interest in programs', '#3B82F6', 'Qualification', true, 3, '{}'::jsonb),
(get_demo_user_id(), 'Application Started', 'Lead has begun the application process', '#8B5CF6', 'Application', true, 4, '{}'::jsonb),
(get_demo_user_id(), 'Applied', 'Complete application submitted', '#10B981', 'Application', true, 5, '{}'::jsonb),
(get_demo_user_id(), 'Enrolled', 'Successfully enrolled in program', '#059669', 'Enrolled', true, 6, '{}'::jsonb),
(get_demo_user_id(), 'Not Interested', 'Lead not interested in programs', '#6B7280', 'Closed', true, 7, '{}'::jsonb);

-- Insert sample call types
INSERT INTO master_call_types (user_id, name, description, duration_estimate, follow_up_required, template_notes, is_active) VALUES
(get_demo_user_id(), 'Initial Contact', 'First contact with new lead to introduce programs', 15, true, 'Introduce yourself and the university. Ask about their educational goals and interests.', true),
(get_demo_user_id(), 'Program Information', 'Detailed discussion about specific programs', 30, true, 'Discuss program details, requirements, and career outcomes. Address any questions or concerns.', true),
(get_demo_user_id(), 'Application Assistance', 'Help with application process and requirements', 20, false, 'Guide through application steps, required documents, and deadlines.', true),
(get_demo_user_id(), 'Follow-up Call', 'Regular follow-up to maintain engagement', 10, true, 'Check on progress, answer new questions, and maintain relationship.', true),
(get_demo_user_id(), 'Enrollment Call', 'Final enrollment and next steps discussion', 25, false, 'Complete enrollment process, discuss orientation, and next steps.', true);

-- Insert sample communication templates
INSERT INTO master_communication_templates (user_id, name, type, category, subject, content, variables, conditional_logic, is_system_template, is_active, usage_count, tags) VALUES
(get_demo_user_id(), 'Welcome Email', 'Email', 'Welcome', 'Welcome to {{university_name}}!', 'Dear {{first_name}},\n\nThank you for your interest in {{university_name}}! We are excited to help you on your educational journey.\n\nNext steps:\n1. Review program information\n2. Schedule a consultation\n3. Complete your application\n\nBest regards,\nAdmissions Team', '{"first_name": "string", "university_name": "string"}'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['welcome', 'email', 'admissions']),
(get_demo_user_id(), 'Application Reminder', 'Email', 'Reminder', 'Complete Your Application - {{program_name}}', 'Hi {{first_name}},\n\nWe noticed you started an application for {{program_name}} but haven''t completed it yet.\n\nDeadline: {{application_deadline}}\n\nComplete your application: {{application_link}}\n\nNeed help? Reply to this email or call us at {{phone_number}}.\n\nBest regards,\nAdmissions Team', '{"first_name": "string", "program_name": "string", "application_deadline": "date", "application_link": "string", "phone_number": "string"}'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['reminder', 'application', 'email']),
(get_demo_user_id(), 'SMS Follow-up', 'SMS', 'Follow-up', '', 'Hi {{first_name}}! This is {{counselor_name}} from {{university_name}}. Just following up on your interest in {{program_name}}. Any questions? Reply STOP to opt out.', '{"first_name": "string", "counselor_name": "string", "university_name": "string", "program_name": "string"}'::jsonb, '{}'::jsonb, false, true, 0, ARRAY['sms', 'follow-up']);

-- Insert sample document templates
INSERT INTO master_document_templates (user_id, name, type, category, description, stage, mandatory, accepted_formats, max_size, instructions, examples, applicable_programs, is_system_template, is_active, usage_count) VALUES
(get_demo_user_id(), 'High School Transcript', 'Academic', 'Transcripts', 'Official high school academic transcript', 'Application', true, ARRAY['PDF', 'JPG', 'PNG'], 5242880, 'Please upload your official high school transcript. Unofficial transcripts are acceptable for initial review.', ARRAY['transcript_example.pdf'], ARRAY['BCS001', 'MBA002'], false, true, 0),
(get_demo_user_id(), 'Personal Statement', 'Essay', 'Essays', 'Personal statement or essay describing goals and motivations', 'Application', true, ARRAY['PDF', 'DOC', 'DOCX'], 2097152, 'Write a 500-1000 word personal statement describing your educational goals and why you want to join this program.', ARRAY['personal_statement_sample.pdf'], ARRAY['BCS001', 'MBA002'], false, true, 0),
(get_demo_user_id(), 'Photo ID', 'Identification', 'Identity', 'Government-issued photo identification', 'Enrollment', true, ARRAY['PDF', 'JPG', 'PNG'], 2097152, 'Please provide a clear photo of your government-issued ID (driver''s license, passport, or state ID).', ARRAY[], ARRAY['BCS001', 'MBA002', 'CDM003'], false, true, 0);

-- Insert sample requirements
INSERT INTO master_requirements (user_id, name, type, category, description, minimum_value, maximum_value, units, is_mandatory, applicable_programs, verification_method, documentation_required, is_active) VALUES
(get_demo_user_id(), 'Minimum GPA', 'Academic', 'GPA', 'Minimum cumulative grade point average requirement', '2.5', '4.0', 'GPA', true, ARRAY['BCS001'], 'Transcript Review', ARRAY['High School Transcript'], true),
(get_demo_user_id(), 'Work Experience', 'Professional', 'Experience', 'Minimum professional work experience', '2', '20', 'Years', false, ARRAY['MBA002'], 'Resume Review', ARRAY['Resume', 'Reference Letters'], true),
(get_demo_user_id(), 'English Proficiency', 'Language', 'Language', 'English language proficiency requirement', '6.0', '9.0', 'IELTS Score', true, ARRAY['BCS001', 'MBA002'], 'Test Score', ARRAY['IELTS Certificate', 'TOEFL Certificate'], true),
(get_demo_user_id(), 'Age Requirement', 'Demographic', 'Age', 'Minimum age requirement for enrollment', '18', '65', 'Years', true, ARRAY['BCS001', 'MBA002', 'CDM003'], 'ID Verification', ARRAY['Photo ID'], true);

-- Insert sample lead priorities
INSERT INTO master_lead_priorities (user_id, name, level, color, description, auto_assignment_rules, sla_hours, is_active) VALUES
(get_demo_user_id(), 'Low Priority', 1, '#6B7280', 'Standard leads with no special urgency', '{}'::jsonb, 72, true),
(get_demo_user_id(), 'Medium Priority', 2, '#F59E0B', 'Leads showing moderate interest or from important sources', '{"source_weight": 1.5}'::jsonb, 48, true),
(get_demo_user_id(), 'High Priority', 3, '#EF4444', 'Highly interested leads or VIP referrals', '{"source_weight": 2.0, "vip_referral": true}'::jsonb, 24, true),
(get_demo_user_id(), 'Urgent', 4, '#DC2626', 'Time-sensitive leads requiring immediate attention', '{"deadline_approaching": true}'::jsonb, 4, true);

-- Insert sample teams
INSERT INTO master_teams (user_id, name, type, description, specializations, region, max_daily_assignments, working_hours, contact_email, contact_phone, is_active, performance_metrics) VALUES
(get_demo_user_id(), 'Undergraduate Admissions', 'Admissions', 'Team specializing in undergraduate program admissions', ARRAY['Undergraduate Programs', 'First-time Students'], 'West Coast', 25, '{"monday": "9:00-17:00", "tuesday": "9:00-17:00", "wednesday": "9:00-17:00", "thursday": "9:00-17:00", "friday": "9:00-17:00"}'::jsonb, 'undergrad@university.edu', '+1-555-0110', true, '{"conversion_rate": 0.18, "response_time": 4.2}'::jsonb),
(get_demo_user_id(), 'Graduate Admissions', 'Admissions', 'Team handling graduate and professional program admissions', ARRAY['Graduate Programs', 'Professional Development'], 'West Coast', 20, '{"monday": "8:00-16:00", "tuesday": "8:00-16:00", "wednesday": "8:00-16:00", "thursday": "8:00-16:00", "friday": "8:00-16:00"}'::jsonb, 'graduate@university.edu', '+1-555-0120', true, '{"conversion_rate": 0.22, "response_time": 3.8}'::jsonb),
(get_demo_user_id(), 'International Students', 'Admissions', 'Specialized team for international student admissions', ARRAY['International Programs', 'Visa Assistance'], 'Global', 15, '{"monday": "6:00-14:00", "tuesday": "6:00-14:00", "wednesday": "6:00-14:00", "thursday": "6:00-14:00", "friday": "6:00-14:00"}'::jsonb, 'international@university.edu', '+1-555-0130', true, '{"conversion_rate": 0.15, "response_time": 6.1}'::jsonb);

-- Insert sample notification filters
INSERT INTO master_notification_filters (user_id, name, type, event_types, conditions, recipients, template_id, is_active, frequency) VALUES
(get_demo_user_id(), 'New Lead Alert', 'Email', ARRAY['lead_created'], '{"priority": "high", "source": "google_ads"}'::jsonb, '[{"type": "team", "id": "admissions"}]'::jsonb, NULL, true, 'immediate'),
(get_demo_user_id(), 'Application Deadline Reminder', 'Email', ARRAY['deadline_approaching'], '{"days_until_deadline": 7}'::jsonb, '[{"type": "individual", "email": "admissions@university.edu"}]'::jsonb, NULL, true, 'daily'),
(get_demo_user_id(), 'Weekly Performance Report', 'Email', ARRAY['weekly_summary'], '{"team": "all"}'::jsonb, '[{"type": "role", "role": "manager"}]'::jsonb, NULL, true, 'weekly');

-- Insert sample configuration metadata
INSERT INTO configuration_metadata (user_id, category, key, value, data_type, description, is_system_setting, is_encrypted, validation_rules) VALUES
(get_demo_user_id(), 'Application', 'max_application_size', '10485760', 'integer', 'Maximum file size for application documents in bytes', false, false, '{"min": 1048576, "max": 52428800}'::jsonb),
(get_demo_user_id(), 'Communication', 'email_sender_name', 'University Admissions', 'string', 'Default sender name for outgoing emails', false, false, '{"max_length": 100}'::jsonb),
(get_demo_user_id(), 'Business', 'business_hours_start', '09:00', 'time', 'Standard business hours start time', false, false, '{"format": "HH:MM"}'::jsonb),
(get_demo_user_id(), 'Business', 'business_hours_end', '17:00', 'time', 'Standard business hours end time', false, false, '{"format": "HH:MM"}'::jsonb),
(get_demo_user_id(), 'Integration', 'crm_sync_enabled', 'false', 'boolean', 'Enable synchronization with external CRM', true, false, '{}'::jsonb);

-- Insert sample stages
INSERT INTO master_stages (user_id, stage_type, stage_key, stage_name, stage_description, substages, order_index, is_active, transition_rules, required_fields, automation_triggers) VALUES
(get_demo_user_id(), 'Lead', 'initial', 'Initial Contact', 'First stage of lead engagement', '[{"name": "New", "description": "Newly received lead"}, {"name": "Contacted", "description": "Initial contact made"}]'::jsonb, 1, true, '{"auto_advance": false}'::jsonb, ARRAY['first_name', 'last_name', 'email'], '[]'::jsonb),
(get_demo_user_id(), 'Lead', 'qualification', 'Qualification', 'Qualifying lead interest and fit', '[{"name": "Interested", "description": "Expressed interest"}, {"name": "Qualified", "description": "Meets basic criteria"}]'::jsonb, 2, true, '{"auto_advance": false}'::jsonb, ARRAY['program_interest', 'contact_preference'], '[]'::jsonb),
(get_demo_user_id(), 'Application', 'application', 'Application Process', 'Application submission and review', '[{"name": "Started", "description": "Application begun"}, {"name": "Submitted", "description": "Application completed"}, {"name": "Under Review", "description": "Being reviewed"}]'::jsonb, 3, true, '{"auto_advance": true, "conditions": {"document_complete": true}}'::jsonb, ARRAY['application_id', 'program_id'], '[{"event": "document_upload", "action": "notify_reviewer"}]'::jsonb),
(get_demo_user_id(), 'Enrollment', 'enrollment', 'Enrollment', 'Final enrollment and onboarding', '[{"name": "Accepted", "description": "Accepted to program"}, {"name": "Enrolled", "description": "Successfully enrolled"}]'::jsonb, 4, true, '{"auto_advance": false}'::jsonb, ARRAY['enrollment_date', 'student_id'], '[{"event": "enrollment_complete", "action": "send_welcome_package"}]'::jsonb);

-- Clean up the helper function
DROP FUNCTION get_demo_user_id();