-- Create campaign_analytics table to track campaign interactions
CREATE TABLE IF NOT EXISTS public.campaign_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL, -- 'started', 'paused', 'viewed', 'executed', 'edited', 'completed'
  action_metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_id ON public.campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_user_id ON public.campaign_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_action_type ON public.campaign_analytics(action_type);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_created_at ON public.campaign_analytics(created_at DESC);

-- Add columns to campaigns table for analytics summary
ALTER TABLE public.campaigns
ADD COLUMN IF NOT EXISTS total_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_executions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS started_by_user_id UUID,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_executed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_executed_by_user_id UUID;

-- Enable RLS on campaign_analytics
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaign_analytics
-- Users can view analytics for campaigns they have access to
CREATE POLICY "Users can view campaign analytics for their own campaigns"
  ON public.campaign_analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_analytics.campaign_id
      AND c.user_id = auth.uid()
    )
  );

-- Users can insert analytics for any campaign they interact with
CREATE POLICY "Users can insert campaign analytics"
  ON public.campaign_analytics
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Function to update campaign analytics summary
CREATE OR REPLACE FUNCTION public.update_campaign_analytics_summary()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the campaigns table with aggregated analytics
  IF NEW.action_type = 'started' THEN
    UPDATE public.campaigns
    SET 
      started_by_user_id = NEW.user_id,
      started_at = NEW.created_at
    WHERE id = NEW.campaign_id;
  ELSIF NEW.action_type = 'executed' THEN
    UPDATE public.campaigns
    SET 
      total_executions = total_executions + 1,
      last_executed_at = NEW.created_at,
      last_executed_by_user_id = NEW.user_id
    WHERE id = NEW.campaign_id;
  ELSIF NEW.action_type = 'viewed' THEN
    UPDATE public.campaigns
    SET total_views = total_views + 1
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update campaign analytics summary
DROP TRIGGER IF EXISTS trigger_update_campaign_analytics_summary ON public.campaign_analytics;
CREATE TRIGGER trigger_update_campaign_analytics_summary
  AFTER INSERT ON public.campaign_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaign_analytics_summary();

-- Comment on table and columns
COMMENT ON TABLE public.campaign_analytics IS 'Tracks all interactions and analytics for campaigns including who started, viewed, and executed them';
COMMENT ON COLUMN public.campaign_analytics.action_type IS 'Type of action: started, paused, viewed, executed, edited, completed';
COMMENT ON COLUMN public.campaign_analytics.action_metadata IS 'Additional metadata about the action (e.g., previous status, execution results)';
COMMENT ON COLUMN public.campaigns.started_by_user_id IS 'User who first activated/started this campaign';
COMMENT ON COLUMN public.campaigns.started_at IS 'Timestamp when campaign was first activated';