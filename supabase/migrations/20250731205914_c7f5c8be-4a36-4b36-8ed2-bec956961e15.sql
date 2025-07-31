-- Create profiles table for admin user profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  title TEXT,
  department TEXT,
  bio TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  theme_preference TEXT DEFAULT 'light',
  notification_email BOOLEAN DEFAULT true,
  notification_sms BOOLEAN DEFAULT false,
  notification_in_app BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_profile table for organization information
CREATE TABLE public.company_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  mission TEXT,
  vision TEXT,
  values TEXT,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'UTC',
  founded_year INTEGER,
  employee_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view and edit their own profile"
ON public.profiles
FOR ALL
USING (auth.uid() = user_id);

-- Create policies for company profile (authenticated users can view/edit)
CREATE POLICY "Authenticated users can manage company profile"
ON public.company_profile
FOR ALL
TO authenticated
USING (true);

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_profile_updated_at
BEFORE UPDATE ON public.company_profile
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default company profile if none exists
INSERT INTO public.company_profile (name, description) 
VALUES ('Your Institution', 'Add your institution description here')
ON CONFLICT DO NOTHING;