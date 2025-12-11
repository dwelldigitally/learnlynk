-- Organization-Wide Data Visibility Migration
-- Allow all team members within the same tenant to see shared data

-- Create helper function for tenant membership check
CREATE OR REPLACE FUNCTION public.is_tenant_member()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_tenant_id() IS NOT NULL;
$$;

-- =====================================================
-- LEADS TABLE - Organization-wide visibility
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "tenant_leads_select" ON public.leads;
DROP POLICY IF EXISTS "tenant_leads_update" ON public.leads;

-- Allow ALL team members in tenant to view ALL leads
CREATE POLICY "tenant_leads_select"
ON public.leads FOR SELECT
USING (tenant_id = public.current_tenant_id());

-- Allow ALL team members to update leads (but not change tenant_id)
CREATE POLICY "tenant_leads_update"
ON public.leads FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- =====================================================
-- APPLICATIONS TABLE - Organization-wide visibility
-- =====================================================

DROP POLICY IF EXISTS "tenant_applications_select" ON public.applications;
DROP POLICY IF EXISTS "tenant_applications_update" ON public.applications;

CREATE POLICY "tenant_applications_select"
ON public.applications FOR SELECT
USING (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_applications_update"
ON public.applications FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- =====================================================
-- APPLICANTS TABLE - Organization-wide visibility
-- =====================================================

DROP POLICY IF EXISTS "tenant_applicants_select" ON public.applicants;
DROP POLICY IF EXISTS "tenant_applicants_update" ON public.applicants;

CREATE POLICY "tenant_applicants_select"
ON public.applicants FOR SELECT
USING (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_applicants_update"
ON public.applicants FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- =====================================================
-- CALENDAR_EVENTS TABLE - Organization-wide visibility
-- =====================================================

DROP POLICY IF EXISTS "tenant_calendar_events_select" ON public.calendar_events;
DROP POLICY IF EXISTS "tenant_calendar_events_update" ON public.calendar_events;

CREATE POLICY "tenant_calendar_events_select"
ON public.calendar_events FOR SELECT
USING (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_calendar_events_update"
ON public.calendar_events FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- =====================================================
-- CAMPAIGNS TABLE - Organization-wide visibility
-- =====================================================

DROP POLICY IF EXISTS "tenant_campaigns_select" ON public.campaigns;
DROP POLICY IF EXISTS "tenant_campaigns_update" ON public.campaigns;

CREATE POLICY "tenant_campaigns_select"
ON public.campaigns FOR SELECT
USING (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_campaigns_update"
ON public.campaigns FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- =====================================================
-- COMMUNICATION_TEMPLATES TABLE - Organization-wide visibility
-- =====================================================

DROP POLICY IF EXISTS "tenant_communication_templates_select" ON public.communication_templates;
DROP POLICY IF EXISTS "tenant_communication_templates_update" ON public.communication_templates;

CREATE POLICY "tenant_communication_templates_select"
ON public.communication_templates FOR SELECT
USING (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_communication_templates_update"
ON public.communication_templates FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());