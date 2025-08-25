-- Create dummy data for enrollment optimization system with correct column names

-- First, temporarily disable RLS for seeding
ALTER TABLE action_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE signals DISABLE ROW LEVEL SECURITY;
ALTER TABLE waste_radar DISABLE ROW LEVEL SECURITY;
ALTER TABLE policy_configurations DISABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_metrics DISABLE ROW LEVEL SECURITY;

-- Insert dummy data for action_queue with correct columns
INSERT INTO action_queue (
  student_name, program, yield_score, yield_band, reason_codes, 
  suggested_action, sla_due_at, status, priority_band, created_at
) VALUES 
('Sarah Johnson', 'Computer Science', 92, 'high', '["high_engagement", "multiple_touchpoints"]', 'Schedule immediate call', NOW() + INTERVAL '2 hours', 'pending', 'urgent', NOW()),
('Michael Chen', 'Business Administration', 87, 'high', '["campus_visit", "scholarship_interest"]', 'Send scholarship information', NOW() + INTERVAL '4 hours', 'pending', 'high', NOW()),
('Emily Rodriguez', 'Engineering', 76, 'medium', '["webinar_attendance", "email_opens"]', 'Follow-up email with program details', NOW() + INTERVAL '6 hours', 'pending', 'medium', NOW()),
('David Thompson', 'Marketing', 68, 'medium', '["social_media_engagement"]', 'Connect on LinkedIn', NOW() + INTERVAL '8 hours', 'pending', 'medium', NOW()),
('Jessica Lee', 'Data Science', 84, 'high', '["multiple_applications", "high_grades"]', 'Priority admission review', NOW() + INTERVAL '3 hours', 'pending', 'high', NOW()),
('Robert Garcia', 'Psychology', 59, 'low', '["single_touchpoint"]', 'Send general program information', NOW() + INTERVAL '24 hours', 'pending', 'low', NOW()),
('Amanda Wilson', 'Nursing', 91, 'high', '["urgent_application", "deadline_approaching"]', 'Expedite application review', NOW() + INTERVAL '1 hour', 'pending', 'urgent', NOW()),
('Kevin Park', 'Finance', 72, 'medium', '["career_fair_attendee"]', 'Schedule career counseling', NOW() + INTERVAL '12 hours', 'pending', 'medium', NOW());

-- Insert dummy data for signals
INSERT INTO signals (
  student_id, signal_type, signal_value, confidence_score, 
  timestamp, metadata, created_at
) VALUES 
('sarah.johnson@email.com', 'webinar_attendance', 'attended', 0.95, NOW() - INTERVAL '1 day', '{"webinar_topic": "program_overview", "attendance_duration": "full"}', NOW()),
('michael.chen@email.com', 'campus_visit', 'scheduled', 0.88, NOW() - INTERVAL '2 days', '{"visit_type": "guided_tour", "visit_date": "2024-01-15"}', NOW()),
('emily.rodriguez@email.com', 'email_engagement', 'high', 0.76, NOW() - INTERVAL '3 hours', '{"open_rate": 0.85, "click_rate": 0.42}', NOW()),
('david.thompson@email.com', 'social_engagement', 'medium', 0.65, NOW() - INTERVAL '1 day', '{"platform": "linkedin", "interactions": 3}', NOW()),
('jessica.lee@email.com', 'application_progress', 'complete', 0.92, NOW() - INTERVAL '1 hour', '{"completion_percentage": 100, "documents_uploaded": true}', NOW());

-- Insert dummy data for waste_radar
INSERT INTO waste_radar (
  student_id, responsiveness_score, duplicate_flag, contact_fatigue_risk,
  last_meaningful_interaction, recommended_action, created_at
) VALUES 
('robert.garcia@email.com', 25, false, 'high', NOW() - INTERVAL '30 days', 'pause_outreach', NOW()),
('test.duplicate@email.com', 45, true, 'medium', NOW() - INTERVAL '14 days', 'consolidate_records', NOW()),
('inactive.student@email.com', 15, false, 'high', NOW() - INTERVAL '60 days', 're_engagement_campaign', NOW()),
('overcontacted@email.com', 60, false, 'very_high', NOW() - INTERVAL '2 days', 'reduce_frequency', NOW());

-- Insert dummy data for policy_configurations
INSERT INTO policy_configurations (
  policy_name, policy_type, configuration_data, is_active,
  created_at, updated_at
) VALUES 
('High Yield Priority', 'prioritization', '{"yield_threshold": 80, "sla_hours": 2, "auto_assign": true}', true, NOW(), NOW()),
('Contact Frequency Limits', 'communication', '{"max_daily_contacts": 3, "max_weekly_contacts": 10, "cool_down_hours": 24}', true, NOW(), NOW()),
('SLA Management', 'workflow', '{"urgent_sla": 1, "high_sla": 4, "medium_sla": 8, "low_sla": 24}', true, NOW(), NOW()),
('Yield Band Thresholds', 'scoring', '{"high_min": 75, "medium_min": 50, "low_min": 0}', true, NOW(), NOW());

-- Insert dummy data for outcome_metrics
INSERT INTO outcome_metrics (
  metric_name, metric_type, period_start, period_end, metric_value,
  comparison_value, trend, metadata, created_at
) VALUES 
('Enrollment Rate', 'conversion', NOW() - INTERVAL '30 days', NOW(), 24.5, 22.1, 'up', '{"previous_period": "22.1%", "target": "25%"}', NOW()),
('Average Yield Score', 'efficiency', NOW() - INTERVAL '30 days', NOW(), 73.2, 71.8, 'up', '{"improvement": "+1.4 points"}', NOW()),
('Response Time (Hours)', 'performance', NOW() - INTERVAL '30 days', NOW(), 3.2, 4.1, 'down', '{"target": "2 hours", "improvement": "-0.9 hours"}', NOW()),
('Contact-to-Enrollment', 'attribution', NOW() - INTERVAL '30 days', NOW(), 8.3, 9.2, 'down', '{"efficiency_gain": "11% fewer contacts needed"}', NOW()),
('High Yield Conversion', 'segment', NOW() - INTERVAL '30 days', NOW(), 45.2, 42.8, 'up', '{"segment": "yield_score > 80"}', NOW()),
('SLA Compliance', 'quality', NOW() - INTERVAL '30 days', NOW(), 87.5, 82.3, 'up', '{"target": "90%", "improvement": "+5.2%"}', NOW());

-- Re-enable RLS with proper policies
ALTER TABLE action_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_radar ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcome_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow all users to see this demo data
CREATE POLICY "Allow all users to read action_queue" ON action_queue
FOR SELECT USING (true);

CREATE POLICY "Allow all users to update action_queue" ON action_queue
FOR UPDATE USING (true);

CREATE POLICY "Allow all users to read signals" ON signals
FOR SELECT USING (true);

CREATE POLICY "Allow all users to read waste_radar" ON waste_radar
FOR SELECT USING (true);

CREATE POLICY "Allow all users to read policy_configurations" ON policy_configurations
FOR SELECT USING (true);

CREATE POLICY "Allow all users to read outcome_metrics" ON outcome_metrics
FOR SELECT USING (true);