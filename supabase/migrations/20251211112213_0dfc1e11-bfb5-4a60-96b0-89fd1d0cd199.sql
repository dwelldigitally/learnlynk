-- Phase 4 & 5: Configuration, System & Remaining Tables

-- Forms
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_forms_tenant ON public.forms(tenant_id);

-- Form Submissions
ALTER TABLE public.form_submissions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_tenant ON public.form_submissions(tenant_id);

-- Communication Templates
ALTER TABLE public.communication_templates ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_communication_templates_tenant ON public.communication_templates(tenant_id);

-- Document Templates
ALTER TABLE public.document_templates ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_document_templates_tenant ON public.document_templates(tenant_id);

-- Lead Routing Rules
ALTER TABLE public.lead_routing_rules ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_lead_routing_rules_tenant ON public.lead_routing_rules(tenant_id);

-- Plays (Automations)
ALTER TABLE public.plays ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_plays_tenant ON public.plays(tenant_id);

-- Campaigns
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_campaigns_tenant ON public.campaigns(tenant_id);

-- Financial Records
ALTER TABLE public.financial_records ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_financial_records_tenant ON public.financial_records(tenant_id);

-- Calendar Events
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_tenant ON public.calendar_events(tenant_id);

-- Notifications
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant ON public.notifications(tenant_id);

-- Tasks (universal tasks table)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_tasks_tenant ON public.tasks(tenant_id);

-- Company Profile
ALTER TABLE public.company_profile ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_company_profile_tenant ON public.company_profile(tenant_id);

-- Master Campuses
ALTER TABLE public.master_campuses ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_master_campuses_tenant ON public.master_campuses(tenant_id);

-- AI Agents
ALTER TABLE public.ai_agents ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_tenant ON public.ai_agents(tenant_id);

-- Advisor Teams
ALTER TABLE public.advisor_teams ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_advisor_teams_tenant ON public.advisor_teams(tenant_id);

-- Advisor Performance
ALTER TABLE public.advisor_performance ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_advisor_performance_tenant ON public.advisor_performance(tenant_id);

-- Team Goals
ALTER TABLE public.team_goals ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_team_goals_tenant ON public.team_goals(tenant_id);

-- Custom Fields
ALTER TABLE public.custom_fields ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_tenant ON public.custom_fields(tenant_id);

-- Custom Reports
ALTER TABLE public.custom_reports ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_custom_reports_tenant ON public.custom_reports(tenant_id);

-- Events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_events_tenant ON public.events(tenant_id);

-- Emails
ALTER TABLE public.emails ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_emails_tenant ON public.emails(tenant_id);

-- Email Accounts
ALTER TABLE public.email_accounts ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_email_accounts_tenant ON public.email_accounts(tenant_id);

-- Workflow Enrollments
ALTER TABLE public.workflow_enrollments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_workflow_enrollments_tenant ON public.workflow_enrollments(tenant_id);

-- Student Journey Instances
ALTER TABLE public.student_journey_instances ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_student_journey_instances_tenant ON public.student_journey_instances(tenant_id);

-- Journey Stage Progress
ALTER TABLE public.journey_stage_progress ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_journey_stage_progress_tenant ON public.journey_stage_progress(tenant_id);

-- User Settings
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_user_settings_tenant ON public.user_settings(tenant_id);

-- Automation Rules
ALTER TABLE public.automation_rules ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_automation_rules_tenant ON public.automation_rules(tenant_id);

-- Audience Templates
ALTER TABLE public.audience_templates ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_audience_templates_tenant ON public.audience_templates(tenant_id);