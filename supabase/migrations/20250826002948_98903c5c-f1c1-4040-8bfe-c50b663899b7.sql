-- Seed dummy academic journeys data
INSERT INTO public.academic_journeys (user_id, program_id, name, description, is_active, version, metadata) VALUES
(auth.uid(), NULL, 'Computer Science Journey', 'Complete academic pathway for CS students from application to graduation', true, 1, '{"duration_months": 48, "credit_hours": 120, "specializations": ["AI/ML", "Web Development", "Cybersecurity"]}'),
(auth.uid(), NULL, 'Business Administration Journey', 'Comprehensive MBA program focusing on leadership and strategy', true, 1, '{"duration_months": 24, "credit_hours": 60, "specializations": ["Finance", "Marketing", "Operations"]}'),
(auth.uid(), NULL, 'Nursing Program Journey', 'Healthcare-focused nursing program with clinical rotations', true, 1, '{"duration_months": 36, "credit_hours": 90, "clinical_hours": 800}'),
(auth.uid(), NULL, 'Engineering Foundation', 'Core engineering program with multiple discipline options', true, 2, '{"duration_months": 48, "credit_hours": 128, "specializations": ["Mechanical", "Electrical", "Civil"]}'),
(auth.uid(), NULL, 'Data Science Accelerated', 'Fast-track data science program for working professionals', false, 1, '{"duration_months": 18, "credit_hours": 45, "format": "hybrid", "weekend_intensive": true}'),
(auth.uid(), NULL, 'Psychology & Counseling', 'Mental health counseling program with practicum requirements', true, 1, '{"duration_months": 30, "credit_hours": 72, "practicum_hours": 600}'),
(auth.uid(), NULL, 'Digital Marketing Certification', 'Modern digital marketing skills and certification program', true, 1, '{"duration_months": 12, "credit_hours": 36, "certifications": ["Google Ads", "Facebook Marketing", "SEO"]}');

-- Also insert some program configurations to support the journeys  
INSERT INTO public.program_configurations (user_id, program_name, settings, is_active) VALUES
(auth.uid(), 'Computer Science', '{"admission_requirements": ["High School Diploma", "Math Proficiency"], "application_deadline": "March 15", "start_dates": ["Fall", "Spring"]}', true),
(auth.uid(), 'Business Administration', '{"admission_requirements": ["Bachelor Degree", "GMAT Score", "Work Experience"], "application_deadline": "January 31", "start_dates": ["Fall", "Spring", "Summer"]}', true),
(auth.uid(), 'Nursing', '{"admission_requirements": ["Science Prerequisites", "CNA Certification", "Background Check"], "application_deadline": "February 1", "start_dates": ["Fall"]}', true),
(auth.uid(), 'Engineering', '{"admission_requirements": ["High School Diploma", "Advanced Math", "Science Courses"], "application_deadline": "April 1", "start_dates": ["Fall", "Spring"]}', true),
(auth.uid(), 'Data Science', '{"admission_requirements": ["Bachelor Degree", "Programming Experience", "Statistics Background"], "application_deadline": "Rolling", "start_dates": ["Monthly"]}', true),
(auth.uid(), 'Psychology', '{"admission_requirements": ["Bachelor Degree", "Psychology Prerequisites", "GRE Score"], "application_deadline": "December 15", "start_dates": ["Fall"]}', true);