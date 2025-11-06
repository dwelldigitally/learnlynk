-- Insert comprehensive dummy routing rules for lead assignment

-- 1. High-Priority VIP Routing Rule
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'VIP & Referral Fast Track',
  'Immediately route VIP leads and referrals to senior advisors',
  10,
  true,
  '[
    {
      "logic_operator": "OR",
      "conditions": [
        {"field": "source", "operator": "equals", "value": "referral"},
        {"field": "lead_score", "operator": "greater_than", "value": "90"}
      ]
    }
  ]'::jsonb,
  '{
    "method": "priority_queue",
    "sources": ["referral", "partner"],
    "team_ids": [],
    "workload_balance": true,
    "max_daily_assignments": 50
  }'::jsonb
);

-- 2. International Student Geographic Routing
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'International Students - Regional Assignment',
  'Route international students by geographic region to specialized advisors',
  9,
  true,
  '[
    {
      "logic_operator": "AND",
      "conditions": [
        {"field": "student_type", "operator": "equals", "value": "international"},
        {"field": "country", "operator": "in", "value": ["China", "India", "Korea", "Japan", "Brazil"]}
      ]
    }
  ]'::jsonb,
  '{
    "method": "geography",
    "sources": ["webform", "event", "organic_search"],
    "team_ids": [],
    "geographic_preference": true,
    "workload_balance": true
  }'::jsonb
);

-- 3. Graduate Program Specialization
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'Graduate Programs - Specialist Routing',
  'Route graduate program inquiries to advisors with advanced degree expertise',
  8,
  true,
  '[
    {
      "logic_operator": "OR",
      "conditions": [
        {"field": "program_interest", "operator": "contains", "value": "MBA"},
        {"field": "program_interest", "operator": "contains", "value": "Masters"},
        {"field": "program_interest", "operator": "contains", "value": "PhD"},
        {"field": "program_interest", "operator": "contains", "value": "Doctorate"}
      ]
    }
  ]'::jsonb,
  '{
    "method": "specialist_match",
    "sources": ["webform", "referral", "organic_search"],
    "team_ids": [],
    "specialization_required": "graduate_programs",
    "workload_balance": true
  }'::jsonb
);

-- 4. After-Hours Emergency Routing
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'After-Hours On-Call Team',
  'Route leads outside business hours to on-call rotation',
  7,
  true,
  '[
    {
      "logic_operator": "OR",
      "conditions": [
        {"field": "time", "operator": "between", "value": ["18:00", "08:00"]},
        {"field": "day_of_week", "operator": "in", "value": ["Saturday", "Sunday"]}
      ]
    }
  ]'::jsonb,
  '{
    "method": "round_robin",
    "sources": ["webform", "chat", "phone"],
    "team_ids": [],
    "on_call_rotation": true,
    "workload_balance": true,
    "schedule_config": {
      "timezone": "America/New_York",
      "active_hours": "after_hours",
      "weekend_enabled": true
    }
  }'::jsonb
);

-- 5. High-Intent Webform Leads
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'Urgent Webform Submissions',
  'Fast-track leads who complete full application forms',
  6,
  true,
  '[
    {
      "logic_operator": "AND",
      "conditions": [
        {"field": "source", "operator": "equals", "value": "webform"},
        {"field": "form_completion", "operator": "equals", "value": "100"}
      ]
    }
  ]'::jsonb,
  '{
    "method": "performance",
    "sources": ["webform"],
    "team_ids": [],
    "performance_metric": "conversion_rate",
    "min_performance_score": 75,
    "workload_balance": true
  }'::jsonb
);

-- 6. STEM Programs Routing
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'STEM Programs - Technical Advisors',
  'Route Computer Science, Engineering, Mathematics leads to STEM-certified advisors',
  5,
  true,
  '[
    {
      "logic_operator": "OR",
      "conditions": [
        {"field": "program_interest", "operator": "contains", "value": "Computer Science"},
        {"field": "program_interest", "operator": "contains", "value": "Engineering"},
        {"field": "program_interest", "operator": "contains", "value": "Mathematics"},
        {"field": "program_interest", "operator": "contains", "value": "Data Science"}
      ]
    }
  ]'::jsonb,
  '{
    "method": "specialist_match",
    "sources": ["webform", "organic_search", "paid_ads"],
    "team_ids": [],
    "specialization_required": "stem",
    "workload_balance": true
  }'::jsonb
);

-- 7. Regional Campus Assignment
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'Geographic Proximity Routing',
  'Assign leads to advisors at nearest campus location',
  4,
  true,
  '[
    {
      "logic_operator": "AND",
      "conditions": [
        {"field": "state", "operator": "is_not_null", "value": null},
        {"field": "city", "operator": "is_not_null", "value": null}
      ]
    }
  ]'::jsonb,
  '{
    "method": "geography",
    "sources": ["webform", "event", "organic_search", "paid_ads"],
    "team_ids": [],
    "geographic_preference": true,
    "proximity_matching": true,
    "workload_balance": true
  }'::jsonb
);

-- 8. Re-engagement Campaign Leads
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'Re-engagement Lead Recovery',
  'Route previously inactive leads to re-engagement specialists',
  3,
  true,
  '[
    {
      "logic_operator": "OR",
      "conditions": [
        {"field": "tags", "operator": "contains", "value": "re-engagement"},
        {"field": "last_contacted_days", "operator": "greater_than", "value": "90"}
      ]
    }
  ]'::jsonb,
  '{
    "method": "round_robin",
    "sources": ["email_campaign", "sms_campaign"],
    "team_ids": [],
    "team_name": "retention_team",
    "workload_balance": true
  }'::jsonb
);

-- 9. First-Time Inquiry - General Pool
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'New Inquiries - General Distribution',
  'Distribute new first-time inquiries across all available advisors',
  2,
  true,
  '[
    {
      "logic_operator": "AND",
      "conditions": [
        {"field": "status", "operator": "equals", "value": "new"},
        {"field": "previous_contact", "operator": "equals", "value": "false"}
      ]
    }
  ]'::jsonb,
  '{
    "method": "round_robin",
    "sources": ["webform", "organic_search", "paid_ads", "social_media"],
    "team_ids": [],
    "workload_balance": true,
    "max_daily_assignments": 30
  }'::jsonb
);

-- 10. Default Catch-All Rule
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'Default Routing - Overflow',
  'Catch-all for any leads not matched by other rules',
  1,
  true,
  '[
    {
      "logic_operator": "AND",
      "conditions": [
        {"field": "always_match", "operator": "equals", "value": "true"}
      ]
    }
  ]'::jsonb,
  '{
    "method": "round_robin",
    "sources": ["webform", "organic_search", "paid_ads", "social_media", "referral", "event", "phone", "chat"],
    "team_ids": [],
    "workload_balance": true,
    "is_default": true
  }'::jsonb
);

-- 11. Weekend Event Leads (Inactive/Seasonal)
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'Event & Open House Attendees',
  'Route leads from campus events to event coordinators',
  6,
  false,
  '[
    {
      "logic_operator": "OR",
      "conditions": [
        {"field": "source", "operator": "equals", "value": "event"},
        {"field": "utm_campaign", "operator": "contains", "value": "open-house"}
      ]
    }
  ]'::jsonb,
  '{
    "method": "round_robin",
    "sources": ["event"],
    "team_ids": [],
    "team_name": "event_coordinators",
    "workload_balance": true,
    "schedule_config": {
      "timezone": "America/New_York",
      "weekend_only": true,
      "seasonal": true
    }
  }'::jsonb
);

-- 12. Financial Aid Inquiries
INSERT INTO public.lead_routing_rules (
  name, description, priority, is_active, conditions, assignment_config
) VALUES (
  'Financial Aid Priority Routing',
  'Route leads with financial aid questions to specialized counselors',
  7,
  true,
  '[
    {
      "logic_operator": "OR",
      "conditions": [
        {"field": "notes", "operator": "contains", "value": "financial aid"},
        {"field": "tags", "operator": "contains", "value": "scholarship"},
        {"field": "tags", "operator": "contains", "value": "tuition"},
        {"field": "notes", "operator": "contains", "value": "FAFSA"}
      ]
    }
  ]'::jsonb,
  '{
    "method": "specialist_match",
    "sources": ["webform", "phone", "chat", "email_campaign"],
    "team_ids": [],
    "specialization_required": "financial_aid",
    "workload_balance": true
  }'::jsonb
);