-- Add comprehensive lead properties columns to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS time_zone TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS call_count INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS meeting_count INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS number_of_sales_activities INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS number_of_times_contacted INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS number_of_form_submissions INTEGER DEFAULT 0;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS first_conversion TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS first_conversion_date TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_engagement_date TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS date_of_first_engagement TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_response_time BIGINT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS time_to_first_touch BIGINT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS created_by_user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_by_user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS unsubscribed_from_all_email BOOLEAN DEFAULT FALSE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS latest_traffic_source_date TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_type TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS merge_record_ids UUID[] DEFAULT '{}';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS owner_assigned_date TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lifecycle_stage TEXT DEFAULT 'new';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS number_of_page_views INTEGER DEFAULT 0;

-- Create lead stage history table for tracking lifecycle stage changes
CREATE TABLE IF NOT EXISTS public.lead_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  entered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  exited_at TIMESTAMPTZ,
  cumulative_time_seconds BIGINT DEFAULT 0,
  latest_time_seconds BIGINT DEFAULT 0,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on lead_stage_history
ALTER TABLE public.lead_stage_history ENABLE ROW LEVEL SECURITY;

-- RLS policy for lead_stage_history
CREATE POLICY "Users can manage lead stage history for their tenant" ON public.lead_stage_history
  FOR ALL USING (tenant_id = current_tenant_id());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_call_count ON public.leads(call_count);
CREATE INDEX IF NOT EXISTS idx_leads_meeting_count ON public.leads(meeting_count);
CREATE INDEX IF NOT EXISTS idx_leads_lifecycle_stage ON public.leads(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_leads_last_engagement_date ON public.leads(last_engagement_date);
CREATE INDEX IF NOT EXISTS idx_lead_stage_history_lead_id ON public.lead_stage_history(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_stage_history_tenant_id ON public.lead_stage_history(tenant_id);

-- Function to update lead metrics when communications are added
CREATE OR REPLACE FUNCTION public.update_lead_communication_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update call count
  IF NEW.type = 'phone' OR NEW.type = 'call' THEN
    UPDATE public.leads 
    SET call_count = COALESCE(call_count, 0) + 1,
        number_of_times_contacted = COALESCE(number_of_times_contacted, 0) + 1,
        number_of_sales_activities = COALESCE(number_of_sales_activities, 0) + 1,
        last_contacted_at = GREATEST(COALESCE(last_contacted_at, '1970-01-01'::timestamptz), NEW.created_at),
        last_engagement_date = GREATEST(COALESCE(last_engagement_date, '1970-01-01'::timestamptz), NEW.created_at),
        updated_at = now()
    WHERE id = NEW.lead_id;
  END IF;
  
  -- Update meeting count
  IF NEW.type = 'meeting' THEN
    UPDATE public.leads 
    SET meeting_count = COALESCE(meeting_count, 0) + 1,
        number_of_times_contacted = COALESCE(number_of_times_contacted, 0) + 1,
        number_of_sales_activities = COALESCE(number_of_sales_activities, 0) + 1,
        last_contacted_at = GREATEST(COALESCE(last_contacted_at, '1970-01-01'::timestamptz), NEW.created_at),
        last_engagement_date = GREATEST(COALESCE(last_engagement_date, '1970-01-01'::timestamptz), NEW.created_at),
        updated_at = now()
    WHERE id = NEW.lead_id;
  END IF;
  
  -- Update for emails, SMS, etc.
  IF NEW.type IN ('email', 'sms', 'whatsapp', 'linkedin') THEN
    UPDATE public.leads 
    SET number_of_times_contacted = COALESCE(number_of_times_contacted, 0) + 1,
        number_of_sales_activities = COALESCE(number_of_sales_activities, 0) + 1,
        last_contacted_at = GREATEST(COALESCE(last_contacted_at, '1970-01-01'::timestamptz), NEW.created_at),
        last_engagement_date = GREATEST(COALESCE(last_engagement_date, '1970-01-01'::timestamptz), NEW.created_at),
        updated_at = now()
    WHERE id = NEW.lead_id;
  END IF;
  
  -- Calculate first engagement and response time if this is first outbound contact
  IF NEW.direction = 'outbound' THEN
    UPDATE public.leads 
    SET date_of_first_engagement = COALESCE(date_of_first_engagement, NEW.created_at),
        lead_response_time = CASE 
          WHEN lead_response_time IS NULL THEN 
            EXTRACT(EPOCH FROM (NEW.created_at - created_at)) * 1000
          ELSE lead_response_time
        END,
        time_to_first_touch = CASE 
          WHEN time_to_first_touch IS NULL THEN 
            EXTRACT(EPOCH FROM (NEW.created_at - created_at)) * 1000
          ELSE time_to_first_touch
        END
    WHERE id = NEW.lead_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for lead communication metrics
DROP TRIGGER IF EXISTS trigger_update_lead_communication_metrics ON public.lead_communications;
CREATE TRIGGER trigger_update_lead_communication_metrics
  AFTER INSERT ON public.lead_communications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_communication_metrics();

-- Function to update form submission count
CREATE OR REPLACE FUNCTION public.update_lead_form_submission_metrics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.leads 
  SET number_of_form_submissions = COALESCE(number_of_form_submissions, 0) + 1,
      first_conversion = COALESCE(first_conversion, NEW.form_id::text),
      first_conversion_date = COALESCE(first_conversion_date, NEW.created_at),
      last_engagement_date = GREATEST(COALESCE(last_engagement_date, '1970-01-01'::timestamptz), NEW.created_at),
      updated_at = now()
  WHERE id = NEW.lead_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for form submission metrics
DROP TRIGGER IF EXISTS trigger_update_lead_form_submission_metrics ON public.form_submissions;
CREATE TRIGGER trigger_update_lead_form_submission_metrics
  AFTER INSERT ON public.form_submissions
  FOR EACH ROW
  WHEN (NEW.lead_id IS NOT NULL)
  EXECUTE FUNCTION public.update_lead_form_submission_metrics();

-- Function to track lifecycle stage changes
CREATE OR REPLACE FUNCTION public.track_lead_lifecycle_stage()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track if lifecycle_stage actually changed
  IF OLD.lifecycle_stage IS DISTINCT FROM NEW.lifecycle_stage THEN
    -- Close out the previous stage
    UPDATE public.lead_stage_history
    SET exited_at = now(),
        latest_time_seconds = EXTRACT(EPOCH FROM (now() - entered_at)),
        cumulative_time_seconds = cumulative_time_seconds + EXTRACT(EPOCH FROM (now() - entered_at))
    WHERE lead_id = NEW.id 
      AND stage = OLD.lifecycle_stage 
      AND exited_at IS NULL;
    
    -- Insert new stage entry
    INSERT INTO public.lead_stage_history (lead_id, stage, entered_at, tenant_id)
    VALUES (NEW.id, NEW.lifecycle_stage, now(), NEW.tenant_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for lifecycle stage tracking
DROP TRIGGER IF EXISTS trigger_track_lead_lifecycle_stage ON public.leads;
CREATE TRIGGER trigger_track_lead_lifecycle_stage
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.track_lead_lifecycle_stage();

-- Function to set created_by and track owner assignment
CREATE OR REPLACE FUNCTION public.set_lead_system_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Set created_by on insert
  IF TG_OP = 'INSERT' THEN
    NEW.created_by_user_id = COALESCE(NEW.created_by_user_id, auth.uid());
    
    -- Initialize first stage history
    INSERT INTO public.lead_stage_history (lead_id, stage, entered_at, tenant_id)
    VALUES (NEW.id, COALESCE(NEW.lifecycle_stage, 'new'), now(), NEW.tenant_id);
  END IF;
  
  -- Set updated_by on update
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_by_user_id = auth.uid();
    
    -- Track owner assignment date
    IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to AND NEW.assigned_to IS NOT NULL THEN
      NEW.owner_assigned_date = now();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for system fields
DROP TRIGGER IF EXISTS trigger_set_lead_system_fields ON public.leads;
CREATE TRIGGER trigger_set_lead_system_fields
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.set_lead_system_fields();