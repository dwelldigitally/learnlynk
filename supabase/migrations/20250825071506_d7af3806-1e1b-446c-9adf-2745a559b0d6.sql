-- Create demo data for currently authenticated user
DO $$
DECLARE
    current_user_id uuid;
BEGIN
    -- Get the current authenticated user ID
    SELECT auth.uid() INTO current_user_id;
    
    -- Only proceed if we have a user
    IF current_user_id IS NOT NULL THEN
        -- Clear any existing demo data for this user
        DELETE FROM action_queue WHERE user_id = current_user_id;
        DELETE FROM signals WHERE user_id = current_user_id;
        DELETE FROM waste_radar WHERE user_id = current_user_id;
        DELETE FROM policy_configurations WHERE user_id = current_user_id;
        DELETE FROM outcome_metrics WHERE user_id = current_user_id;
        
        -- Insert fresh demo data for current user
        INSERT INTO action_queue (
          user_id, student_id, student_name, program, yield_score, yield_band, reason_codes, 
          suggested_action, sla_due_at, status, priority_band, created_at
        ) VALUES 
        (current_user_id, gen_random_uuid(), 'Sarah Johnson', 'Computer Science', 92, 'high', '["high_engagement", "multiple_touchpoints"]', 'Schedule immediate call', NOW() + INTERVAL '2 hours', 'pending', 'urgent', NOW()),
        (current_user_id, gen_random_uuid(), 'Michael Chen', 'Business Administration', 87, 'high', '["campus_visit", "scholarship_interest"]', 'Send scholarship information', NOW() + INTERVAL '4 hours', 'pending', 'high', NOW()),
        (current_user_id, gen_random_uuid(), 'Emily Rodriguez', 'Engineering', 76, 'medium', '["webinar_attendance", "email_opens"]', 'Follow-up email with program details', NOW() + INTERVAL '6 hours', 'pending', 'medium', NOW()),
        (current_user_id, gen_random_uuid(), 'David Thompson', 'Marketing', 68, 'medium', '["social_media_engagement"]', 'Connect on LinkedIn', NOW() + INTERVAL '8 hours', 'pending', 'medium', NOW()),
        (current_user_id, gen_random_uuid(), 'Jessica Lee', 'Data Science', 84, 'high', '["multiple_applications", "high_grades"]', 'Priority admission review', NOW() + INTERVAL '3 hours', 'pending', 'high', NOW()),
        (current_user_id, gen_random_uuid(), 'Robert Garcia', 'Psychology', 59, 'low', '["single_touchpoint"]', 'Send general program information', NOW() + INTERVAL '24 hours', 'pending', 'low', NOW()),
        (current_user_id, gen_random_uuid(), 'Amanda Wilson', 'Nursing', 91, 'high', '["urgent_application", "deadline_approaching"]', 'Expedite application review', NOW() + INTERVAL '1 hour', 'pending', 'urgent', NOW()),
        (current_user_id, gen_random_uuid(), 'Kevin Park', 'Finance', 72, 'medium', '["career_fair_attendee"]', 'Schedule career counseling', NOW() + INTERVAL '12 hours', 'pending', 'medium', NOW());

        -- Insert signals data
        INSERT INTO signals (
          user_id, student_id, webinar_attended, form_submitted_at, last_email_open_at, 
          pageviews_7d, yield_score, intent_signals, created_at
        ) VALUES 
        (current_user_id, gen_random_uuid(), true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours', 15, 85.5, '{"high_engagement": true, "multiple_touchpoints": true}', NOW()),
        (current_user_id, gen_random_uuid(), true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 8, 78.2, '{"campus_visit": true, "scholarship_interest": true}', NOW()),
        (current_user_id, gen_random_uuid(), false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 hours', 23, 72.1, '{"webinar_registered": true, "email_engagement": "high"}', NOW()),
        (current_user_id, gen_random_uuid(), false, NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 day', 5, 65.4, '{"social_media_engagement": true}', NOW()),
        (current_user_id, gen_random_uuid(), true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes', 32, 91.8, '{"multiple_applications": true, "urgent_interest": true}', NOW());

        -- Insert waste radar data
        INSERT INTO waste_radar (
          user_id, student_id, student_name, unresponsive_30d, wrong_intake, duplicate_flag,
          last_meaningful_contact, touch_count, created_at
        ) VALUES 
        (current_user_id, gen_random_uuid(), 'Robert Garcia', true, false, false, NOW() - INTERVAL '30 days', 8, NOW()),
        (current_user_id, gen_random_uuid(), 'Test Duplicate', false, false, true, NOW() - INTERVAL '14 days', 5, NOW()),
        (current_user_id, gen_random_uuid(), 'Inactive Student', true, true, false, NOW() - INTERVAL '60 days', 12, NOW()),
        (current_user_id, gen_random_uuid(), 'Over Contacted', false, false, false, NOW() - INTERVAL '2 days', 25, NOW());

        -- Insert policy configurations
        INSERT INTO policy_configurations (
          user_id, policy_name, enabled, settings, expected_lift, created_at
        ) VALUES 
        (current_user_id, 'High Yield Priority', true, '{"yield_threshold": 80, "sla_hours": 2, "auto_assign": true}', 15.5, NOW()),
        (current_user_id, 'Contact Frequency Limits', true, '{"max_daily_contacts": 3, "max_weekly_contacts": 10, "cool_down_hours": 24}', 8.2, NOW()),
        (current_user_id, 'SLA Management', true, '{"urgent_sla": 1, "high_sla": 4, "medium_sla": 8, "low_sla": 24}', 12.1, NOW()),
        (current_user_id, 'Yield Band Thresholds', true, '{"high_min": 75, "medium_min": 50, "low_min": 0}', 18.7, NOW());

        -- Insert outcome metrics
        INSERT INTO outcome_metrics (
          user_id, metric_name, before_value, after_value, time_period, 
          attribution_source, created_at
        ) VALUES 
        (current_user_id, 'Enrollment Rate', 22.1, 24.5, '30 days', 'yield_optimization', NOW()),
        (current_user_id, 'Average Yield Score', 71.8, 73.2, '30 days', 'signal_analysis', NOW()),
        (current_user_id, 'Response Time', 4.1, 3.2, '30 days', 'sla_management', NOW()),
        (current_user_id, 'Contact-to-Enrollment', 9.2, 8.3, '30 days', 'contact_optimization', NOW()),
        (current_user_id, 'High Yield Conversion', 42.8, 45.2, '30 days', 'priority_routing', NOW()),
        (current_user_id, 'SLA Compliance', 82.3, 87.5, '30 days', 'workflow_automation', NOW());
        
        RAISE NOTICE 'Demo data created for user: %', current_user_id;
    ELSE
        RAISE NOTICE 'No authenticated user found - please sign in first';
    END IF;
END $$;