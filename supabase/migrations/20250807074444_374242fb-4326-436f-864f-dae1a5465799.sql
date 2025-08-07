-- Master data tables for configuration management

-- Programs master data
CREATE TABLE public.master_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'undergraduate',
  duration TEXT,
  campus TEXT,
  delivery_method TEXT DEFAULT 'on-campus',
  status TEXT DEFAULT 'active',
  color TEXT DEFAULT '#3B82F6',
  category TEXT,
  tags TEXT[],
  entry_requirements JSONB DEFAULT '[]',
  document_requirements JSONB DEFAULT '[]',
  fee_structure JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Campuses master data
CREATE TABLE public.master_campuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  timezone TEXT DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  capacity INTEGER,
  facilities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Marketing sources master data
CREATE TABLE public.master_marketing_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  cost_per_lead NUMERIC,
  conversion_rate NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  tracking_parameters JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead statuses master data
CREATE TABLE public.master_lead_statuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6B7280',
  stage TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  auto_transition_rules JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Call types master data
CREATE TABLE public.master_call_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_estimate INTEGER, -- minutes
  follow_up_required BOOLEAN DEFAULT false,
  template_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Communication templates
CREATE TABLE public.master_communication_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- email, sms, meeting
  category TEXT,
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  conditional_logic JSONB DEFAULT '{}',
  is_system_template BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Document templates
CREATE TABLE public.master_document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  description TEXT,
  stage TEXT NOT NULL,
  mandatory BOOLEAN DEFAULT false,
  accepted_formats TEXT[] DEFAULT ARRAY['pdf', 'doc', 'docx'],
  max_size INTEGER DEFAULT 5, -- MB
  instructions TEXT,
  examples TEXT[],
  applicable_programs TEXT[] DEFAULT ARRAY['All Programs'],
  is_system_template BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Requirements templates
CREATE TABLE public.master_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- academic, language, experience, etc.
  category TEXT,
  description TEXT,
  minimum_value TEXT,
  maximum_value TEXT,
  units TEXT,
  is_mandatory BOOLEAN DEFAULT true,
  applicable_programs TEXT[] DEFAULT ARRAY['All Programs'],
  verification_method TEXT,
  documentation_required TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead priorities
CREATE TABLE public.master_lead_priorities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL, -- 1 = highest, 5 = lowest
  color TEXT DEFAULT '#6B7280',
  description TEXT,
  auto_assignment_rules JSONB DEFAULT '{}',
  sla_hours INTEGER, -- response time SLA
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team configurations
CREATE TABLE public.master_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- internal, external_recruiter
  description TEXT,
  specializations TEXT[],
  region TEXT,
  max_daily_assignments INTEGER DEFAULT 50,
  working_hours JSONB DEFAULT '{}',
  contact_email TEXT,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notification filters
CREATE TABLE public.master_notification_filters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- email, sms, in_app, webhook
  event_types TEXT[] NOT NULL,
  conditions JSONB DEFAULT '{}',
  recipients JSONB DEFAULT '[]',
  template_id UUID,
  is_active BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'immediate', -- immediate, daily, weekly
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Configuration metadata for system settings
CREATE TABLE public.configuration_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  data_type TEXT NOT NULL, -- string, number, boolean, array, object
  description TEXT,
  is_system_setting BOOLEAN DEFAULT false,
  is_encrypted BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category, key)
);

-- Enhanced stages with substages
CREATE TABLE public.master_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stage_type TEXT NOT NULL, -- lead, applicant, student
  stage_key TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  stage_description TEXT,
  substages JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  transition_rules JSONB DEFAULT '{}',
  required_fields TEXT[],
  automation_triggers JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stage_type, stage_key)
);

-- Enable RLS on all tables
ALTER TABLE public.master_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_marketing_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_lead_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_call_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_lead_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_notification_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuration_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_stages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own master programs" ON public.master_programs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master campuses" ON public.master_campuses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master marketing sources" ON public.master_marketing_sources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master lead statuses" ON public.master_lead_statuses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master call types" ON public.master_call_types FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master communication templates" ON public.master_communication_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master document templates" ON public.master_document_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master requirements" ON public.master_requirements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master lead priorities" ON public.master_lead_priorities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master teams" ON public.master_teams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master notification filters" ON public.master_notification_filters FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own configuration metadata" ON public.configuration_metadata FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own master stages" ON public.master_stages FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_master_programs_updated_at BEFORE UPDATE ON public.master_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_campuses_updated_at BEFORE UPDATE ON public.master_campuses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_marketing_sources_updated_at BEFORE UPDATE ON public.master_marketing_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_lead_statuses_updated_at BEFORE UPDATE ON public.master_lead_statuses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_call_types_updated_at BEFORE UPDATE ON public.master_call_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_communication_templates_updated_at BEFORE UPDATE ON public.master_communication_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_document_templates_updated_at BEFORE UPDATE ON public.master_document_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_requirements_updated_at BEFORE UPDATE ON public.master_requirements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_lead_priorities_updated_at BEFORE UPDATE ON public.master_lead_priorities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_teams_updated_at BEFORE UPDATE ON public.master_teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_notification_filters_updated_at BEFORE UPDATE ON public.master_notification_filters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_configuration_metadata_updated_at BEFORE UPDATE ON public.configuration_metadata FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_stages_updated_at BEFORE UPDATE ON public.master_stages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();