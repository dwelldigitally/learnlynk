-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  campaign_type TEXT NOT NULL DEFAULT 'email',
  target_audience JSONB DEFAULT '{}',
  campaign_data JSONB DEFAULT '{}',
  workflow_config JSONB DEFAULT '{}',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign steps table
CREATE TABLE public.campaign_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  step_type TEXT NOT NULL,
  step_config JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign executions table
CREATE TABLE public.campaign_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  lead_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  execution_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_executions ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns
CREATE POLICY "Users can manage their own campaigns" 
ON public.campaigns 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for campaign steps
CREATE POLICY "Users can manage steps for their campaigns" 
ON public.campaign_steps 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.campaigns 
  WHERE campaigns.id = campaign_steps.campaign_id 
  AND campaigns.user_id = auth.uid()
));

-- Create policies for campaign executions
CREATE POLICY "Users can view executions for their campaigns" 
ON public.campaign_executions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.campaigns 
  WHERE campaigns.id = campaign_executions.campaign_id 
  AND campaigns.user_id = auth.uid()
));

-- Add triggers for timestamp updates
CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_steps_updated_at
BEFORE UPDATE ON public.campaign_steps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();