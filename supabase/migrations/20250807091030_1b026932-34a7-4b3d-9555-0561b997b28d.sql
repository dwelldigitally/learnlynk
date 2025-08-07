-- Create master_programs table
CREATE TABLE public.master_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration TEXT,
  level TEXT,
  credits INTEGER,
  delivery_method TEXT DEFAULT 'on-campus',
  status TEXT DEFAULT 'active',
  tuition_fee NUMERIC,
  application_fee NUMERIC,
  requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create master_campuses table
CREATE TABLE public.master_campuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  location TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  status TEXT DEFAULT 'active',
  capacity INTEGER,
  established_year INTEGER,
  facilities TEXT[],
  programs_offered TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create master_marketing_sources table
CREATE TABLE public.master_marketing_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cost_per_lead NUMERIC,
  conversion_rate NUMERIC,
  status TEXT DEFAULT 'active',
  tracking_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create master_lead_statuses table
CREATE TABLE public.master_lead_statuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'active',
  color TEXT DEFAULT '#3B82F6',
  order_index INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create master_lead_priorities table
CREATE TABLE public.master_lead_priorities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  level INTEGER DEFAULT 1,
  color TEXT DEFAULT '#6B7280',
  score_threshold INTEGER,
  auto_assign BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on all tables
ALTER TABLE public.master_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_marketing_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_lead_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_lead_priorities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for master_programs
CREATE POLICY "Users can manage their own programs" 
ON public.master_programs 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for master_campuses
CREATE POLICY "Users can manage their own campuses" 
ON public.master_campuses 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for master_marketing_sources
CREATE POLICY "Users can manage their own marketing sources" 
ON public.master_marketing_sources 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for master_lead_statuses
CREATE POLICY "Users can manage their own lead statuses" 
ON public.master_lead_statuses 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for master_lead_priorities
CREATE POLICY "Users can manage their own lead priorities" 
ON public.master_lead_priorities 
FOR ALL 
USING (auth.uid() = user_id);

-- Create update triggers for all tables
CREATE TRIGGER update_master_programs_updated_at
  BEFORE UPDATE ON public.master_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_campuses_updated_at
  BEFORE UPDATE ON public.master_campuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_marketing_sources_updated_at
  BEFORE UPDATE ON public.master_marketing_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_lead_statuses_updated_at
  BEFORE UPDATE ON public.master_lead_statuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_master_lead_priorities_updated_at
  BEFORE UPDATE ON public.master_lead_priorities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();