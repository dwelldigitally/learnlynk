-- Insert dummy data for Programs
INSERT INTO master_programs (user_id, name, code, description, duration, level, department, tuition_fee, is_active) VALUES
(auth.uid(), 'Bachelor of Science in Computer Science', 'CS101', 'Comprehensive computer science program covering software development, algorithms, and system design', '4 years', 'undergraduate', 'School of Computing', 45000.00, true),
(auth.uid(), 'Master of Business Administration', 'MBA001', 'Advanced business administration program for leadership and management', '2 years', 'postgraduate', 'Business School', 65000.00, true),
(auth.uid(), 'Certificate in Digital Marketing', 'DM101', 'Professional certificate in modern digital marketing strategies', '6 months', 'certificate', 'Marketing Department', 8500.00, true),
(auth.uid(), 'Bachelor of Arts in Psychology', 'PSY101', 'Study of human behavior and mental processes', '3 years', 'undergraduate', 'School of Psychology', 38000.00, true),
(auth.uid(), 'Diploma in Nursing', 'NUR201', 'Professional nursing diploma with clinical practice', '2 years', 'diploma', 'School of Health Sciences', 32000.00, true);

-- Insert dummy data for Campuses
INSERT INTO master_campuses (user_id, name, location, address, capacity, facilities, is_active) VALUES
(auth.uid(), 'Main Campus', 'Sydney, Australia', '123 University Drive, Sydney NSW 2000', 15000, '["Library", "Sports Complex", "Student Housing", "Medical Center", "Cafeteria"]'::jsonb, true),
(auth.uid(), 'North Campus', 'Melbourne, Australia', '456 Education Street, Melbourne VIC 3000', 8000, '["Library", "Computer Labs", "Cafeteria", "Parking"]'::jsonb, true),
(auth.uid(), 'Online Campus', 'Virtual', 'Virtual Learning Environment', 50000, '["Online Platform", "Virtual Labs", "Digital Library", "Video Conferencing"]'::jsonb, true),
(auth.uid(), 'International Campus', 'Singapore', '789 Global Avenue, Singapore 138623', 5000, '["Library", "International Student Services", "Accommodation", "Cultural Center"]'::jsonb, true);

-- Insert dummy data for Marketing Sources
INSERT INTO master_marketing_sources (user_id, name, type, description, cost_per_lead, conversion_rate, is_active) VALUES
(auth.uid(), 'Google Ads', 'paid_advertising', 'Search engine marketing campaigns', 25.50, 0.12, true),
(auth.uid(), 'Facebook Ads', 'social_media', 'Social media advertising campaigns', 18.75, 0.08, true),
(auth.uid(), 'LinkedIn', 'social_media', 'Professional network advertising', 35.00, 0.15, true),
(auth.uid(), 'Email Campaigns', 'email_marketing', 'Direct email marketing to prospects', 5.25, 0.06, true),
(auth.uid(), 'Referrals', 'word_of_mouth', 'Student and alumni referral program', 0.00, 0.25, true),
(auth.uid(), 'Organic Search', 'seo', 'Search engine optimization results', 0.00, 0.18, true),
(auth.uid(), 'Education Fairs', 'events', 'Participation in education exhibitions', 150.00, 0.22, true),
(auth.uid(), 'Print Media', 'traditional', 'Newspaper and magazine advertisements', 45.00, 0.04, false);

-- Insert dummy data for Communication Templates
INSERT INTO master_communication_templates (user_id, name, type, subject, content, variables, is_active) VALUES
(auth.uid(), 'Welcome Email', 'email', 'Welcome to {{university_name}}!', 'Dear {{first_name}}, Welcome to our university! We are excited to have you join our community...', '["first_name", "university_name", "program_name"]'::jsonb, true),
(auth.uid(), 'Application Received', 'email', 'Application Received - {{application_id}}', 'Thank you {{first_name}} for submitting your application. Your application ID is {{application_id}}...', '["first_name", "application_id", "program_name"]'::jsonb, true),
(auth.uid(), 'Interview Invitation', 'email', 'Interview Invitation - {{program_name}}', 'Dear {{first_name}}, We would like to invite you for an interview for {{program_name}}...', '["first_name", "program_name", "interview_date", "interview_time"]'::jsonb, true),
(auth.uid(), 'Admission Decision', 'email', 'Admission Decision - {{program_name}}', 'Dear {{first_name}}, We are pleased to inform you about your admission status...', '["first_name", "program_name", "decision", "deadline"]'::jsonb, true),
(auth.uid(), 'Payment Reminder', 'sms', 'Payment Due Reminder', 'Hi {{first_name}}, your payment of ${{amount}} is due on {{due_date}}. Please complete payment to secure your enrollment.', '["first_name", "amount", "due_date"]'::jsonb, true),
(auth.uid(), 'Document Submission Reminder', 'email', 'Missing Documents - Action Required', 'Dear {{first_name}}, we are missing the following documents for your application: {{missing_documents}}...', '["first_name", "missing_documents", "deadline"]'::jsonb, true),
(auth.uid(), 'Enrollment Confirmation', 'email', 'Enrollment Confirmed - {{program_name}}', 'Congratulations {{first_name}}! Your enrollment in {{program_name}} has been confirmed...', '["first_name", "program_name", "start_date", "campus"]'::jsonb, true),
(auth.uid(), 'Follow-up Call Script', 'call_script', 'Follow-up Call', 'Hello {{first_name}}, this is {{agent_name}} from {{university_name}}. I am calling to follow up on your application...', '["first_name", "agent_name", "university_name", "application_status"]'::jsonb, true);

-- Insert dummy data for Document Templates
INSERT INTO master_document_templates (user_id, name, category, type, description, mandatory, max_size, accepted_formats, stage, applicable_programs, instructions) VALUES
(auth.uid(), 'Academic Transcripts', 'academic', 'transcript', 'Official academic transcripts from previous institutions', true, 10, '["pdf", "jpg", "png"]'::text[], 'application', '["All Programs"]'::text[], 'Please upload official transcripts from all previously attended institutions'),
(auth.uid(), 'Personal Statement', 'application', 'essay', 'Personal statement explaining motivation and goals', true, 5, '["pdf", "doc", "docx"]'::text[], 'application', '["Bachelor of Science in Computer Science", "Master of Business Administration"]'::text[], 'Write a 500-word personal statement explaining your motivation for this program'),
(auth.uid(), 'Identity Document', 'identification', 'id_document', 'Government-issued photo identification', true, 5, '["pdf", "jpg", "png"]'::text[], 'application', '["All Programs"]'::text[], 'Upload a clear copy of your passport or national ID'),
(auth.uid(), 'Financial Statement', 'financial', 'bank_statement', 'Proof of financial capacity', true, 10, '["pdf"]'::text[], 'application', '["All Programs"]'::text[], 'Bank statement showing sufficient funds for tuition and living expenses'),
(auth.uid(), 'English Proficiency', 'language', 'test_score', 'IELTS, TOEFL, or equivalent English test scores', false, 5, '["pdf", "jpg", "png"]'::text[], 'application', '["Bachelor of Science in Computer Science", "Master of Business Administration"]'::text[], 'Required for non-native English speakers'),
(auth.uid(), 'Medical Certificate', 'health', 'medical_document', 'Health clearance certificate', false, 5, '["pdf"]'::text[], 'enrollment', '["Diploma in Nursing"]'::text[], 'Medical clearance required for healthcare programs'),
(auth.uid(), 'Portfolio', 'portfolio', 'creative_work', 'Portfolio of previous work or projects', false, 50, '["pdf", "zip"]'::text[], 'application', '["Certificate in Digital Marketing"]'::text[], 'Showcase your best work and projects'),
(auth.uid(), 'Work Experience Letter', 'professional', 'experience_letter', 'Letter from employer confirming work experience', false, 5, '["pdf", "doc", "docx"]'::text[], 'application', '["Master of Business Administration"]'::text[], 'Letter should include job title, duration, and responsibilities');

-- Insert dummy data for Call Types
INSERT INTO master_call_types (user_id, name, description, duration_estimate, follow_up_required, is_active) VALUES
(auth.uid(), 'Initial Consultation', 'First contact call with prospective student to understand their needs and explain programs', 30, true, true),
(auth.uid(), 'Follow-up Call', 'Follow-up call after initial consultation to answer additional questions', 15, true, true),
(auth.uid(), 'Information Session', 'Detailed program information session including curriculum and career prospects', 45, true, true),
(auth.uid(), 'Application Review', 'Call to review application status and required documents', 20, true, true),
(auth.uid(), 'Enrollment Confirmation', 'Final enrollment confirmation and next steps discussion', 25, false, true),
(auth.uid(), 'Technical Support', 'Support call for application portal or technical issues', 15, false, true);

-- Insert dummy data for Notification Filters
INSERT INTO master_notification_filters (user_id, name, description, filter_type, conditions, is_active) VALUES
(auth.uid(), 'New Lead Alert', 'Immediate notification for new leads from high-value sources', 'lead_creation', '{"sources": ["Google Ads", "LinkedIn"], "priority": "high"}'::jsonb, true),
(auth.uid(), 'Application Deadline', 'Alert when application deadline is approaching', 'deadline_reminder', '{"days_before": 7, "stage": "application"}'::jsonb, true),
(auth.uid(), 'Payment Overdue', 'Notification for overdue payments', 'payment_status', '{"status": "overdue", "days_overdue": 3}'::jsonb, true),
(auth.uid(), 'Document Missing', 'Alert for missing required documents', 'document_status', '{"status": "missing", "mandatory": true}'::jsonb, true),
(auth.uid(), 'High Value Lead', 'Notification for leads with high conversion probability', 'lead_scoring', '{"score_threshold": 80, "source_quality": "premium"}'::jsonb, true),
(auth.uid(), 'Interview Scheduled', 'Confirmation notification when interview is scheduled', 'interview_booking', '{"event_type": "interview", "notify_roles": ["admissions", "interviewer"]}'::jsonb, true);

-- Insert dummy data for Requirements
INSERT INTO master_requirements (user_id, name, type, description, criteria, applicable_programs, is_mandatory) VALUES
(auth.uid(), 'IELTS Score', 'language_proficiency', 'International English Language Testing System score requirement', '{"minimum_score": 6.5, "valid_years": 2}'::jsonb, '["Bachelor of Science in Computer Science", "Master of Business Administration"]'::text[], true),
(auth.uid(), 'GPA Requirement', 'academic_performance', 'Minimum Grade Point Average for admission', '{"minimum_gpa": 3.0, "scale": 4.0}'::jsonb, '["Master of Business Administration"]'::text[], true),
(auth.uid(), 'Work Experience', 'professional_experience', 'Minimum work experience requirement', '{"minimum_years": 2, "field": "relevant"}'::jsonb, '["Master of Business Administration"]'::text[], false),
(auth.uid(), 'Age Requirement', 'demographic', 'Age restrictions for certain programs', '{"minimum_age": 18, "maximum_age": null}'::jsonb, '["All Programs"]'::text[], true),
(auth.uid(), 'Financial Capacity', 'financial', 'Proof of financial ability to complete the program', '{"minimum_funds": 50000, "currency": "USD", "documents": ["bank_statement", "scholarship_letter"]}'::jsonb, '["All Programs"]'::text[], true),
(auth.uid(), 'Health Clearance', 'medical', 'Medical clearance for health-related programs', '{"vaccinations": ["Hepatitis B", "MMR"], "health_check": true}'::jsonb, '["Diploma in Nursing"]'::text[], true),
(auth.uid(), 'Background Check', 'security', 'Criminal background check requirement', '{"check_type": "criminal", "validity_months": 6}'::jsonb, '["Diploma in Nursing"]'::text[], true),
(auth.uid(), 'Portfolio Submission', 'creative', 'Portfolio requirement for creative programs', '{"min_pieces": 5, "formats": ["digital", "physical"], "themes": ["creativity", "technical_skill"]}'::jsonb, '["Certificate in Digital Marketing"]'::text[], false);

-- Insert dummy data for Teams (External Recruiters)
INSERT INTO master_teams (user_id, name, type, region, specializations, contact_email, contact_phone, commission_rate, is_active) VALUES
(auth.uid(), 'Internal Admissions Team', 'internal', 'Global', '["All Programs", "General Inquiries"]'::text[], 'admissions@university.edu', '+1-555-0100', 0.00, true),
(auth.uid(), 'Asia Pacific Recruiters', 'external', 'Asia Pacific', '["Business Programs", "Technology Programs"]'::text[], 'apac@recruiters.com', '+65-6789-0123', 8.50, true),
(auth.uid(), 'European Education Partners', 'external', 'Europe', '["All Programs"]'::text[], 'europe@edupartners.com', '+44-20-7123-4567', 7.25, true),
(auth.uid(), 'North America Agents', 'external', 'North America', '["Graduate Programs", "Professional Certificates"]'::text[], 'na@educationagents.com', '+1-555-0200', 9.00, true),
(auth.uid(), 'Middle East Representatives', 'external', 'Middle East', '["Business Programs", "Health Sciences"]'::text[], 'me@globalreps.com', '+971-4-123-4567', 8.75, true);