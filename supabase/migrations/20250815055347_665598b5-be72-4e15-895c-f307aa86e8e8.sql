-- Create HubSpot settings table for storing OAuth connection data
CREATE TABLE public.hubspot_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  hub_id TEXT,
  connection_status TEXT NOT NULL DEFAULT 'disconnected',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hubspot_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own HubSpot settings" 
ON public.hubspot_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own HubSpot settings" 
ON public.hubspot_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own HubSpot settings" 
ON public.hubspot_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own HubSpot settings" 
ON public.hubspot_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hubspot_settings_updated_at
BEFORE UPDATE ON public.hubspot_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();