-- Insert sample campuses
INSERT INTO public.master_campuses (name, code, location, address, city, state, country, zip_code, phone, email, website, status, capacity, established_year, facilities, programs_offered, user_id) VALUES
('Main Campus', 'MAIN', 'Downtown', '123 University Ave', 'Springfield', 'IL', 'USA', '62701', '(555) 123-4567', 'main@university.edu', 'https://main.university.edu', 'active', 5000, 1985, ARRAY['Library', 'Labs', 'Cafeteria', 'Gym'], ARRAY['Computer Science', 'Business', 'Engineering'], auth.uid()),
('North Campus', 'NORTH', 'Northside', '456 College Blvd', 'Springfield', 'IL', 'USA', '62702', '(555) 234-5678', 'north@university.edu', 'https://north.university.edu', 'active', 3000, 1995, ARRAY['Library', 'Student Center', 'Parking'], ARRAY['Liberal Arts', 'Education'], auth.uid()),
('Online Campus', 'ONLINE', 'Virtual', 'Online Only', 'Springfield', 'IL', 'USA', '62701', '(555) 345-6789', 'online@university.edu', 'https://online.university.edu', 'active', 10000, 2010, ARRAY['Virtual Classrooms', 'Digital Library'], ARRAY['All Programs'], auth.uid());

-- Insert sample programs
INSERT INTO public.master_programs (name, description, category, duration, level, credits, delivery_method, status, tuition_fee, application_fee, requirements, user_id) VALUES
('Computer Science', 'Comprehensive computer science program covering programming, algorithms, and software development', 'Technology', '4 years', 'Bachelor', 120, 'on-campus', 'active', 45000, 100, ARRAY['High School Diploma', 'Math Proficiency', 'English Proficiency'], auth.uid()),
('Business Administration', 'Business fundamentals including management, marketing, and finance', 'Business', '4 years', 'Bachelor', 120, 'hybrid', 'active', 42000, 100, ARRAY['High School Diploma', 'English Proficiency'], auth.uid()),
('Data Science', 'Advanced data analysis, machine learning, and statistical modeling', 'Technology', '2 years', 'Master', 60, 'online', 'active', 35000, 150, ARRAY['Bachelor Degree', 'Statistics Background', 'Programming Experience'], auth.uid()),
('MBA', 'Master of Business Administration for working professionals', 'Business', '2 years', 'Master', 48, 'evening', 'active', 55000, 200, ARRAY['Bachelor Degree', 'Work Experience', 'GMAT Score'], auth.uid());

-- Insert sample marketing sources
INSERT INTO public.master_marketing_sources (name, description, category, cost_per_lead, conversion_rate, status, tracking_code, user_id) VALUES
('Google Ads', 'Pay-per-click advertising on Google search and display network', 'Digital Marketing', 25.50, 0.08, 'active', 'GA_EDU_001', auth.uid()),
('Facebook Ads', 'Social media advertising on Facebook and Instagram', 'Social Media', 18.75, 0.06, 'active', 'FB_EDU_002', auth.uid()),
('Education Fairs', 'Traditional in-person education and career fairs', 'Events', 45.00, 0.15, 'active', 'EF_EDU_003', auth.uid()),
('Referral Program', 'Word-of-mouth referrals from current students and alumni', 'Referral', 5.00, 0.25, 'active', 'REF_EDU_004', auth.uid()),
('SEO/Organic', 'Organic search engine traffic from university website', 'Digital Marketing', 0.00, 0.12, 'active', 'SEO_EDU_005', auth.uid());

-- Insert sample lead statuses
INSERT INTO public.master_lead_statuses (name, description, category, color, order_index, is_default, user_id) VALUES
('New Lead', 'Newly received lead, not yet contacted', 'active', '#3B82F6', 1, true, auth.uid()),
('Contacted', 'Initial contact made with the lead', 'active', '#F59E0B', 2, false, auth.uid()),
('Qualified', 'Lead meets basic qualification criteria', 'active', '#10B981', 3, false, auth.uid()),
('Application Started', 'Lead has begun the application process', 'active', '#8B5CF6', 4, false, auth.uid()),
('Application Submitted', 'Complete application received and under review', 'active', '#06B6D4', 5, false, auth.uid()),
('Enrolled', 'Lead has successfully enrolled in a program', 'converted', '#22C55E', 6, false, auth.uid()),
('Not Interested', 'Lead expressed no interest in continuing', 'inactive', '#EF4444', 7, false, auth.uid()),
('Unqualified', 'Lead does not meet qualification requirements', 'inactive', '#6B7280', 8, false, auth.uid());

-- Insert sample lead priorities
INSERT INTO public.master_lead_priorities (name, description, level, color, score_threshold, auto_assign, user_id) VALUES
('Low', 'Standard priority lead with basic interest', 1, '#6B7280', 0, false, auth.uid()),
('Medium', 'Moderate priority lead with some engagement', 2, '#F59E0B', 25, false, auth.uid()),
('High', 'High priority lead with strong interest and engagement', 3, '#EF4444', 50, true, auth.uid()),
('VIP', 'Very important lead requiring immediate attention', 4, '#7C3AED', 75, true, auth.uid()),
('Hot Lead', 'Extremely engaged lead ready to enroll', 5, '#DC2626', 90, true, auth.uid());