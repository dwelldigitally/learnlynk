-- Create dummy data for enrollment optimization with all required fields
DO $$
DECLARE
    demo_user_id uuid;
    student_id_1 uuid := gen_random_uuid();
    student_id_2 uuid := gen_random_uuid();
    student_id_3 uuid := gen_random_uuid();
    student_id_4 uuid := gen_random_uuid();
    student_id_5 uuid := gen_random_uuid();
    student_id_6 uuid := gen_random_uuid();
    student_id_7 uuid := gen_random_uuid();
    student_id_8 uuid := gen_random_uuid();
BEGIN
    -- Try to get current user, otherwise use a placeholder  
    SELECT COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000001') INTO demo_user_id;
    
    -- Temporarily disable RLS for seeding
    ALTER TABLE action_queue DISABLE ROW LEVEL SECURITY;
    ALTER TABLE signals DISABLE ROW LEVEL SECURITY;
    ALTER TABLE waste_radar DISABLE ROW LEVEL SECURITY;
    ALTER TABLE policy_configurations DISABLE ROW LEVEL SECURITY;
    ALTER TABLE outcome_metrics DISABLE ROW LEVEL SECURITY;

    -- Insert dummy data for action_queue with student_ids
    INSERT INTO action_queue (
      user_id, student_id, student_name, program, yield_score, yield_band, reason_codes, 
      suggested_action, sla_due_at, status, priority_band, created_at
    ) VALUES 
    (demo_user_id, student_id_1, 'Sarah Johnson', 'Computer Science', 92, 'high', '["high_engagement", "multiple_touchpoints"]', 'Schedule immediate call', NOW() + INTERVAL '2 hours', 'pending', 'urgent', NOW()),
    (demo_user_id, student_id_2, 'Michael Chen', 'Business Administration', 87, 'high', '["campus_visit", "scholarship_interest"]', 'Send scholarship information', NOW() + INTERVAL '4 hours', 'pending', 'high', NOW()),
    (demo_user_id, student_id_3, 'Emily Rodriguez', 'Engineering', 76, 'medium', '["webinar_attendance", "email_opens"]', 'Follow-up email with program details', NOW() + INTERVAL '6 hours', 'pending', 'medium', NOW()),
    (demo_user_id, student_id_4, 'David Thompson', 'Marketing', 68, 'medium', '["social_media_engagement"]', 'Connect on LinkedIn', NOW() + INTERVAL '8 hours', 'pending', 'medium', NOW()),
    (demo_user_id, student_id_5, 'Jessica Lee', 'Data Science', 84, 'high', '["multiple_applications", "high_grades"]', 'Priority admission review', NOW() + INTERVAL '3 hours', 'pending', 'high', NOW()),
    (demo_user_id, student_id_6, 'Robert Garcia', 'Psychology', 59, 'low', '["single_touchpoint"]', 'Send general program information', NOW() + INTERVAL '24 hours', 'pending', 'low', NOW()),
    (demo_user_id, student_id_7, 'Amanda Wilson', 'Nursing', 91, 'high', '["urgent_application", "deadline_approaching"]', 'Expedite application review', NOW() + INTERVAL '1 hour', 'pending', 'urgent', NOW()),
    (demo_user_id, student_id_8, 'Kevin Park', 'Finance', 72, 'medium', '["career_fair_attendee"]', 'Schedule career counseling', NOW() + INTERVAL '12 hours', 'pending', 'medium', NOW());

    -- Insert dummy data for signals with student_ids
    INSERT INTO signals (
      user_id, student_id, webinar_attended, form_submitted_at, last_email_open_at, 
      pageviews_7d, yield_score, intent_signals, created_at
    ) VALUES 
    (demo_user_id, student_id_1, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours', 15, 85.5, '{"high_engagement": true, "multiple_touchpoints": true}', NOW()),
    (demo_user_id, student_id_2, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 8, 78.2, '{"campus_visit": true, "scholarship_interest": true}', NOW()),
    (demo_user_id, student_id_3, false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 hours', 23, 72.1, '{"webinar_registered": true, "email_engagement": "high"}', NOW()),
    (demo_user_id, student_id_4, false, NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 day', 5, 65.4, '{"social_media_engagement": true}', NOW()),
    (demo_user_id, student_id_5, true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', 32, 91.8, '{"multiple_applications": true, "urgent_interest": true}', NOW());

    -- Insert dummy data for waste_radar with student_ids
    INSERT INTO waste_radar (
      user_id, student_id, student_name, unresponsive_30d, wrong_intake, duplicate_flag,
      last_meaningful_contact, touch_count, created_at
    ) VALUES 
    (demo_user_id, student_id_6, 'Robert Garcia', true, false, false, NOW() - INTERVAL '30 days', 8, NOW()),
    (demo_user_id, gen_random_uuid(), 'Test Duplicate', false, false, true, NOW() - INTERVAL '14 days', 5, NOW()),
    (demo_user_id, gen_random_uuid(), 'Inactive Student', true, true, false, NOW() - INTERVAL '60 days', 12, NOW()),
    (demo_user_id, gen_random_uuid(), 'Over Contacted', false, false, false, NOW() - INTERVAL '2 days', 25, NOW());

    -- Insert dummy data for policy_configurations
    INSERT INTO policy_configurations (
      user_id, policy_name, enabled, settings, expected_lift, created_at
    ) VALUES 
    (demo_user_id, 'High Yield Priority', true, '{"yield_threshold": 80, "sla_hours": 2, "auto_assign": true}', 15.5, NOW()),
    (demo_user_id, 'Contact Frequency Limits', true, '{"max_daily_contacts": 3, "max_weekly_contacts": 10, "cool_down_hours": 24}', 8.2, NOW()),
    (demo_user_id, 'SLA Management', true, '{"urgent_sla": 1, "high_sla": 4, "medium_sla": 8, "low_sla": 24}', 12.1, NOW()),
    (demo_user_id, 'Yield Band Thresholds', true, '{"high_min": 75, "medium_min": 50, "low_min": 0}', 18.7, NOW());

    -- Insert dummy data for outcome_metrics
    INSERT INTO outcome_metrics (
      user_id, metric_name, before_value, after_value, time_period, 
      attribution_source, created_at
    ) VALUES 
    (demo_user_id, 'Enrollment Rate', 22.1, 24.5, '30 days', 'yield_optimization', NOW()),
    (demo_user_id, 'Average Yield Score', 71.8, 73.2, '30 days', 'signal_analysis', NOW()),
    (demo_user_id, 'Response Time', 4.1, 3.2, '30 days', 'sla_management', NOW()),
    (demo_user_id, 'Contact-to-Enrollment', 9.2, 8.3, '30 days', 'contact_optimization', NOW()),
    (demo_user_id, 'High Yield Conversion', 42.8, 45.2, '30 days', 'priority_routing', NOW()),
    (demo_user_id, 'SLA Compliance', 82.3, 87.5, '30 days', 'workflow_automation', NOW());

    -- Re-enable RLS with proper policies
    ALTER TABLE action_queue ENABLE ROW LEVEL SECURITY;
    ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
    ALTER TABLE waste_radar ENABLE ROW LEVEL SECURITY;
    ALTER TABLE policy_configurations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE outcome_metrics ENABLE ROW LEVEL SECURITY;
END $$;

-- Create RLS policies to allow users to see their own data
DROP POLICY IF EXISTS "Users can read their own action_queue" ON action_queue;
DROP POLICY IF EXISTS "Users can update their own action_queue" ON action_queue;
DROP POLICY IF EXISTS "Users can read their own signals" ON signals;
DROP POLICY IF EXISTS "Users can read their own waste_radar" ON waste_radar;
DROP POLICY IF EXISTS "Users can read their own policy_configurations" ON policy_configurations;
DROP POLICY IF EXISTS "Users can read their own outcome_metrics" ON outcome_metrics;

CREATE POLICY "Users can read their own action_queue" ON action_queue
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own action_queue" ON action_queue
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own signals" ON signals
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own waste_radar" ON waste_radar
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own policy_configurations" ON policy_configurations
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own outcome_metrics" ON outcome_metrics
FOR SELECT USING (auth.uid() = user_id);