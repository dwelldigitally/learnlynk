-- Create recruiter portal content table
CREATE TABLE public.recruiter_portal_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'announcement',
  priority TEXT NOT NULL DEFAULT 'medium',
  target_companies JSONB DEFAULT '[]'::jsonb,
  target_roles JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  publish_date TIMESTAMP WITH TIME ZONE,
  expire_date TIMESTAMP WITH TIME ZONE,
  attachment_urls JSONB DEFAULT '[]'::jsonb,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruiter portal messages table
CREATE TABLE public.recruiter_portal_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipient_type TEXT NOT NULL DEFAULT 'all',
  recipient_companies JSONB DEFAULT '[]'::jsonb,
  recipient_users JSONB DEFAULT '[]'::jsonb,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  read_by UUID,
  attachment_urls JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruiter portal configuration table
CREATE TABLE public.recruiter_portal_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  portal_title TEXT NOT NULL DEFAULT 'Recruiter Portal',
  welcome_message TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0066cc',
  secondary_color TEXT DEFAULT '#f8f9fa',
  features JSONB NOT NULL DEFAULT '{
    "application_submission": true,
    "commission_tracking": true,
    "document_management": true,
    "performance_metrics": true,
    "communication_center": true,
    "training_materials": true,
    "company_directory": false,
    "automated_notifications": true
  }'::jsonb,
  access_control JSONB NOT NULL DEFAULT '{
    "require_approval": true,
    "allow_self_registration": false,
    "session_timeout": 60,
    "max_login_attempts": 5
  }'::jsonb,
  notification_settings JSONB NOT NULL DEFAULT '{
    "email_notifications": true,
    "new_application_alerts": true,
    "commission_updates": true,
    "system_announcements": true
  }'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recruiter_portal_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_portal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_portal_config ENABLE ROW LEVEL SECURITY;

-- Create policies for recruiter portal content
CREATE POLICY "Users can manage their own recruiter portal content" 
ON public.recruiter_portal_content 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for recruiter portal messages
CREATE POLICY "Users can manage their own recruiter portal messages" 
ON public.recruiter_portal_messages 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for recruiter portal config
CREATE POLICY "Users can manage their own recruiter portal config" 
ON public.recruiter_portal_config 
FOR ALL 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_recruiter_portal_content_updated_at
BEFORE UPDATE ON public.recruiter_portal_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiter_portal_messages_updated_at
BEFORE UPDATE ON public.recruiter_portal_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiter_portal_config_updated_at
BEFORE UPDATE ON public.recruiter_portal_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();