-- Create HubSpot owners table
CREATE TABLE public.hubspot_owners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hubspot_owner_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create HubSpot contacts table
CREATE TABLE public.hubspot_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hubspot_contact_id TEXT NOT NULL UNIQUE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  hubspot_owner_id TEXT,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create owner to advisor mappings table
CREATE TABLE public.owner_advisor_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hubspot_owner_id TEXT NOT NULL,
  advisor_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, hubspot_owner_id)
);

-- Enable RLS
ALTER TABLE public.hubspot_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubspot_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_advisor_mappings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own hubspot owners" 
ON public.hubspot_owners 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own hubspot contacts" 
ON public.hubspot_contacts 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own owner advisor mappings" 
ON public.owner_advisor_mappings 
FOR ALL 
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_hubspot_owners_user_id ON public.hubspot_owners(user_id);
CREATE INDEX idx_hubspot_contacts_user_id ON public.hubspot_contacts(user_id);
CREATE INDEX idx_hubspot_contacts_owner_id ON public.hubspot_contacts(hubspot_owner_id);
CREATE INDEX idx_owner_advisor_mappings_user_id ON public.owner_advisor_mappings(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_hubspot_owners_updated_at
BEFORE UPDATE ON public.hubspot_owners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hubspot_contacts_updated_at
BEFORE UPDATE ON public.hubspot_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_owner_advisor_mappings_updated_at
BEFORE UPDATE ON public.owner_advisor_mappings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();