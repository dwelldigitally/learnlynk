-- Create HubSpot connections table
CREATE TABLE public.hubspot_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  hub_id TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.hubspot_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own HubSpot connections" 
ON public.hubspot_connections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own HubSpot connections" 
ON public.hubspot_connections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own HubSpot connections" 
ON public.hubspot_connections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own HubSpot connections" 
ON public.hubspot_connections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hubspot_connections_updated_at
BEFORE UPDATE ON public.hubspot_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_hubspot_connections_updated_at();