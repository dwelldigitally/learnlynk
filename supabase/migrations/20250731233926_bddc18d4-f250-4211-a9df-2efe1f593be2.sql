-- Create lead sources enum
CREATE TYPE public.lead_source AS ENUM (
  'web',
  'social_media', 
  'event',
  'agent',
  'email',
  'referral',
  'phone',
  'walk_in',
  'api_import',
  'csv_import'
);

-- Create lead status enum
CREATE TYPE public.lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'nurturing',
  'converted',
  'lost',
  'unqualified'
);

-- Create lead priority enum
CREATE TYPE public.lead_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- Create assignment method enum
CREATE TYPE public.assignment_method AS ENUM (
  'manual',
  'round_robin',
  'ai_based',
  'geography',
  'performance'
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  source lead_source NOT NULL,
  source_details TEXT, -- Additional info about the source
  status lead_status NOT NULL DEFAULT 'new',
  priority lead_priority NOT NULL DEFAULT 'medium',
  lead_score INTEGER DEFAULT 0, -- 0-100 scoring
  ai_score DECIMAL(3,2), -- AI predicted conversion probability (0.00-1.00)
  program_interest TEXT[], -- Array of program names they're interested in
  assigned_to UUID, -- Reference to profiles.user_id
  assigned_at TIMESTAMP WITH TIME ZONE,
  assignment_method assignment_method,
  tags TEXT[], -- Array of tags for segmentation
  notes TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  next_follow_up_at TIMESTAMP WITH TIME ZONE,
  qualification_stage TEXT, -- Current stage in qualification process
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer_url TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead activities table for timeline tracking
CREATE TABLE public.lead_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'note', 'status_change', etc.
  activity_description TEXT NOT NULL,
  activity_data JSONB, -- Additional structured data
  performed_by UUID REFERENCES public.profiles(user_id),
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead routing rules table
CREATE TABLE public.lead_routing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 0, -- Higher number = higher priority
  is_active BOOLEAN NOT NULL DEFAULT true,
  conditions JSONB NOT NULL, -- JSON conditions for matching leads
  assignment_config JSONB NOT NULL, -- Assignment configuration
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create advisor performance tracking table
CREATE TABLE public.advisor_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL REFERENCES public.profiles(user_id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  leads_assigned INTEGER DEFAULT 0,
  leads_contacted INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  response_time_avg DECIMAL(10,2), -- Average response time in hours
  conversion_rate DECIMAL(5,2), -- Percentage
  performance_tier TEXT DEFAULT 'C', -- A, B, C tier
  is_available BOOLEAN DEFAULT true,
  max_daily_assignments INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(advisor_id, period_start, period_end)
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for leads
CREATE POLICY "Authenticated users can view leads" 
ON public.leads 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage leads" 
ON public.leads 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create RLS policies for lead activities
CREATE POLICY "Authenticated users can view lead activities" 
ON public.lead_activities 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage lead activities" 
ON public.lead_activities 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create RLS policies for lead routing rules
CREATE POLICY "Authenticated users can view routing rules" 
ON public.lead_routing_rules 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage routing rules" 
ON public.lead_routing_rules 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create RLS policies for advisor performance
CREATE POLICY "Authenticated users can view advisor performance" 
ON public.advisor_performance 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage advisor performance" 
ON public.advisor_performance 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_lead_score ON public.leads(lead_score DESC);
CREATE INDEX idx_leads_ai_score ON public.leads(ai_score DESC);
CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX idx_lead_activities_performed_at ON public.lead_activities(performed_at DESC);
CREATE INDEX idx_advisor_performance_advisor_id ON public.advisor_performance(advisor_id);

-- Create updated_at triggers
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_routing_rules_updated_at
  BEFORE UPDATE ON public.lead_routing_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advisor_performance_updated_at
  BEFORE UPDATE ON public.advisor_performance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();