-- Phase 2 & 3: Add tenant_id to Core Business Tables

-- Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON public.profiles(tenant_id);

-- User Roles
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_user_roles_tenant ON public.user_roles(tenant_id);

-- Leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON public.leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_status ON public.leads(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_created ON public.leads(tenant_id, created_at DESC);

-- Lead Communications
ALTER TABLE public.lead_communications ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_lead_communications_tenant ON public.lead_communications(tenant_id);

-- Lead Documents
ALTER TABLE public.lead_documents ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_lead_documents_tenant ON public.lead_documents(tenant_id);

-- Lead Tasks
ALTER TABLE public.lead_tasks ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_tenant ON public.lead_tasks(tenant_id);

-- Lead Notes
ALTER TABLE public.lead_notes ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_tenant ON public.lead_notes(tenant_id);

-- Lead Activity Logs
ALTER TABLE public.lead_activity_logs ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_lead_activity_logs_tenant ON public.lead_activity_logs(tenant_id);

-- Programs
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_programs_tenant ON public.programs(tenant_id);

-- Intakes
ALTER TABLE public.intakes ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_intakes_tenant ON public.intakes(tenant_id);

-- Academic Terms
ALTER TABLE public.academic_terms ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_academic_terms_tenant ON public.academic_terms(tenant_id);

-- Academic Journeys
ALTER TABLE public.academic_journeys ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_academic_journeys_tenant ON public.academic_journeys(tenant_id);

-- Journey Stages
ALTER TABLE public.journey_stages ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_journey_stages_tenant ON public.journey_stages(tenant_id);

-- Applications
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_applications_tenant ON public.applications(tenant_id);

-- Applicants
ALTER TABLE public.applicants ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_applicants_tenant ON public.applicants(tenant_id);

-- Students
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_students_tenant ON public.students(tenant_id);

-- Master Records
ALTER TABLE public.master_records ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
CREATE INDEX IF NOT EXISTS idx_master_records_tenant ON public.master_records(tenant_id);