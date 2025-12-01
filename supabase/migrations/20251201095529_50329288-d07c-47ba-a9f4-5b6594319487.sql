-- =====================================================
-- Backend Optimization Migration for 50K+ Leads Scale
-- =====================================================

-- 1. Add composite indexes for common query patterns on leads table
CREATE INDEX IF NOT EXISTS idx_leads_user_status_created 
ON public.leads (user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_user_priority_created 
ON public.leads (user_id, priority, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_user_followup 
ON public.leads (user_id, next_follow_up_at) 
WHERE next_follow_up_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_user_assigned 
ON public.leads (user_id, assigned_to, assigned_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_unassigned 
ON public.leads (created_at DESC) 
WHERE user_id IS NULL;

-- 2. Add full-text search vector column and index
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_leads_search_gin 
ON public.leads USING GIN (search_vector);

-- Create function to update search vector (using only existing columns)
CREATE OR REPLACE FUNCTION public.leads_search_vector_update()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    coalesce(NEW.first_name, '') || ' ' ||
    coalesce(NEW.last_name, '') || ' ' ||
    coalesce(NEW.email, '') || ' ' ||
    coalesce(NEW.phone, '') || ' ' ||
    coalesce(NEW.city, '') || ' ' ||
    coalesce(NEW.country, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-updating search vector
DROP TRIGGER IF EXISTS leads_search_vector_trigger ON public.leads;
CREATE TRIGGER leads_search_vector_trigger
BEFORE INSERT OR UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.leads_search_vector_update();

-- Backfill existing leads with search vectors
UPDATE public.leads SET search_vector = to_tsvector('english',
  coalesce(first_name, '') || ' ' ||
  coalesce(last_name, '') || ' ' ||
  coalesce(email, '') || ' ' ||
  coalesce(phone, '') || ' ' ||
  coalesce(city, '') || ' ' ||
  coalesce(country, '')
) WHERE search_vector IS NULL;

-- 3. Add indexes for lead_documents table
CREATE INDEX IF NOT EXISTS idx_lead_documents_lead_created 
ON public.lead_documents (lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_documents_user_status 
ON public.lead_documents (user_id, admin_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_documents_requirement 
ON public.lead_documents (requirement_id) 
WHERE requirement_id IS NOT NULL;

-- 4. Add indexes for lead_communications table
CREATE INDEX IF NOT EXISTS idx_lead_communications_lead_created 
ON public.lead_communications (lead_id, communication_date DESC);

CREATE INDEX IF NOT EXISTS idx_lead_communications_user_type 
ON public.lead_communications (user_id, type, communication_date DESC);

-- 5. Add indexes for student_communications table
CREATE INDEX IF NOT EXISTS idx_student_communications_student_created 
ON public.student_communications (student_id, created_at DESC);

-- 6. Add indexes for campaign_executions table
CREATE INDEX IF NOT EXISTS idx_campaign_executions_campaign_status 
ON public.campaign_executions (campaign_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaign_executions_lead 
ON public.campaign_executions (lead_id, status);

-- 7. Helper function to remove multiple elements from array
CREATE OR REPLACE FUNCTION public.array_remove_all(arr text[], elements text[])
RETURNS text[] AS $$
DECLARE
  result text[];
  elem text;
BEGIN
  result := arr;
  FOREACH elem IN ARRAY elements LOOP
    result := array_remove(result, elem);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

-- 8. Create bulk tag update function for atomic operations
CREATE OR REPLACE FUNCTION public.bulk_update_lead_tags(
  p_lead_ids uuid[],
  p_tags text[],
  p_operation text
)
RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  IF p_operation = 'add' THEN
    UPDATE public.leads
    SET tags = (SELECT ARRAY(SELECT DISTINCT unnest(array_cat(COALESCE(tags, ARRAY[]::text[]), p_tags))))
    WHERE id = ANY(p_lead_ids);
  ELSIF p_operation = 'remove' THEN
    UPDATE public.leads
    SET tags = public.array_remove_all(COALESCE(tags, ARRAY[]::text[]), p_tags)
    WHERE id = ANY(p_lead_ids);
  END IF;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 9. Analyze tables for query planner optimization
ANALYZE public.leads;
ANALYZE public.lead_documents;
ANALYZE public.lead_communications;
ANALYZE public.student_communications;
ANALYZE public.campaign_executions;