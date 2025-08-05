-- Create AI feature configurations table
CREATE TABLE IF NOT EXISTS public.ai_feature_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_id TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_id)
);

-- Create AI feature analytics table
CREATE TABLE IF NOT EXISTS public.ai_feature_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_data JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_feature_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feature_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_feature_configurations
CREATE POLICY "Users can manage their own AI feature configurations"
ON public.ai_feature_configurations
FOR ALL
USING (auth.uid() = user_id);

-- Create policies for ai_feature_analytics
CREATE POLICY "Users can view their own AI feature analytics"
ON public.ai_feature_analytics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert AI feature analytics"
ON public.ai_feature_analytics
FOR INSERT
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_feature_configurations_updated_at
  BEFORE UPDATE ON public.ai_feature_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_feature_configurations_user_feature 
ON public.ai_feature_configurations(user_id, feature_id);

CREATE INDEX IF NOT EXISTS idx_ai_feature_analytics_user_feature_date 
ON public.ai_feature_analytics(user_id, feature_id, recorded_at);

CREATE INDEX IF NOT EXISTS idx_ai_feature_analytics_metric 
ON public.ai_feature_analytics(metric_name, recorded_at);