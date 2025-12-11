-- Phase 7: Update RLS Policies to use tenant-based filtering

-- Drop existing policies and create tenant-aware ones

-- PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

CREATE POLICY "tenant_profiles_select"
ON public.profiles FOR SELECT
USING (
  tenant_id = public.current_tenant_id()
  OR user_id = auth.uid()
);

CREATE POLICY "tenant_profiles_insert"
ON public.profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "tenant_profiles_update"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- LEADS
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can create leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can manage their own leads" ON public.leads;

CREATE POLICY "tenant_leads_select"
ON public.leads FOR SELECT
USING (
  tenant_id = public.current_tenant_id()
  AND (
    public.is_tenant_admin()
    OR user_id = auth.uid()
    OR assigned_to = auth.uid()
  )
);

CREATE POLICY "tenant_leads_insert"
ON public.leads FOR INSERT
WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_leads_update"
ON public.leads FOR UPDATE
USING (
  tenant_id = public.current_tenant_id()
  AND (
    public.is_tenant_admin()
    OR user_id = auth.uid()
    OR assigned_to = auth.uid()
  )
)
WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_leads_delete"
ON public.leads FOR DELETE
USING (
  tenant_id = public.current_tenant_id()
  AND public.is_tenant_admin()
);

-- PROGRAMS
DROP POLICY IF EXISTS "Users can manage their own programs" ON public.programs;
DROP POLICY IF EXISTS "Users can view their own programs" ON public.programs;
DROP POLICY IF EXISTS "Users can create their own programs" ON public.programs;
DROP POLICY IF EXISTS "Users can update their own programs" ON public.programs;
DROP POLICY IF EXISTS "Users can delete their own programs" ON public.programs;

CREATE POLICY "tenant_programs_select"
ON public.programs FOR SELECT
USING (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_programs_insert"
ON public.programs FOR INSERT
WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_programs_update"
ON public.programs FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_programs_delete"
ON public.programs FOR DELETE
USING (tenant_id = public.current_tenant_id() AND public.is_tenant_admin());

-- LEAD COMMUNICATIONS
DROP POLICY IF EXISTS "Users can manage their own lead communications" ON public.lead_communications;

CREATE POLICY "tenant_lead_communications"
ON public.lead_communications FOR ALL
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- LEAD DOCUMENTS
DROP POLICY IF EXISTS "Users can manage their own lead documents" ON public.lead_documents;

CREATE POLICY "tenant_lead_documents"
ON public.lead_documents FOR ALL
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- LEAD TASKS
DROP POLICY IF EXISTS "Users can manage their own lead tasks" ON public.lead_tasks;

CREATE POLICY "tenant_lead_tasks"
ON public.lead_tasks FOR ALL
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- LEAD NOTES
DROP POLICY IF EXISTS "Users can manage their own lead notes" ON public.lead_notes;

CREATE POLICY "tenant_lead_notes"
ON public.lead_notes FOR ALL
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can manage their own notifications" ON public.notifications;

CREATE POLICY "tenant_notifications"
ON public.notifications FOR ALL
USING (
  tenant_id = public.current_tenant_id() 
  AND user_id = auth.uid()
)
WITH CHECK (tenant_id = public.current_tenant_id());

-- CALENDAR EVENTS
DROP POLICY IF EXISTS "Users can manage their own calendar events" ON public.calendar_events;

CREATE POLICY "tenant_calendar_events"
ON public.calendar_events FOR ALL
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- FINANCIAL RECORDS
DROP POLICY IF EXISTS "Users can manage their own financial records" ON public.financial_records;

CREATE POLICY "tenant_financial_records"
ON public.financial_records FOR ALL
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- FORMS (public forms accessible for viewing, owned for management)
DROP POLICY IF EXISTS "Users can manage their own forms" ON public.forms;
DROP POLICY IF EXISTS "Anyone can view published forms" ON public.forms;
DROP POLICY IF EXISTS "Public forms are viewable" ON public.forms;

CREATE POLICY "tenant_forms_select"
ON public.forms FOR SELECT
USING (
  tenant_id = public.current_tenant_id()
  OR status = 'published'
);

CREATE POLICY "tenant_forms_insert"
ON public.forms FOR INSERT
WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_forms_update"
ON public.forms FOR UPDATE
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

CREATE POLICY "tenant_forms_delete"
ON public.forms FOR DELETE
USING (tenant_id = public.current_tenant_id());

-- FORM SUBMISSIONS (allow anonymous submissions)
DROP POLICY IF EXISTS "Anyone can create form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Users can view form submissions" ON public.form_submissions;

CREATE POLICY "tenant_form_submissions_select"
ON public.form_submissions FOR SELECT
USING (tenant_id = public.current_tenant_id());

CREATE POLICY "anyone_can_submit_forms"
ON public.form_submissions FOR INSERT
WITH CHECK (true);

-- COMMUNICATION TEMPLATES
DROP POLICY IF EXISTS "Users can manage their own templates" ON public.communication_templates;

CREATE POLICY "tenant_communication_templates"
ON public.communication_templates FOR ALL
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());

-- PLAYS (Automations)
DROP POLICY IF EXISTS "Users can manage their own plays" ON public.plays;
DROP POLICY IF EXISTS "Users can create their own plays" ON public.plays;
DROP POLICY IF EXISTS "Users can update their own plays" ON public.plays;

CREATE POLICY "tenant_plays"
ON public.plays FOR ALL
USING (tenant_id = public.current_tenant_id())
WITH CHECK (tenant_id = public.current_tenant_id());