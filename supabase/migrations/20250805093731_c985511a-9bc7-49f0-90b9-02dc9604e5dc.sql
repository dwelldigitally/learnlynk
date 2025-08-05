-- Create student_applications table
CREATE TABLE public.student_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id UUID NOT NULL,
  program_id UUID,
  application_number TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'LEAD_FORM',
  status TEXT NOT NULL DEFAULT 'submitted',
  progress INTEGER DEFAULT 0,
  acceptance_likelihood NUMERIC DEFAULT 0,
  requirements JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  application_deadline DATE,
  estimated_decision TIMESTAMP WITH TIME ZONE,
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  next_step TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_portal_content table
CREATE TABLE public.student_portal_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  target_audience JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_portal_messages table
CREATE TABLE public.student_portal_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'info',
  priority TEXT NOT NULL DEFAULT 'normal',
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_portal_config table
CREATE TABLE public.student_portal_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  is_system_config BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, config_key)
);

-- Enable RLS on all tables
ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for student_applications
CREATE POLICY "Users can manage their own student applications"
ON public.student_applications
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for student_portal_content
CREATE POLICY "Users can manage their own portal content"
ON public.student_portal_content
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for student_portal_messages
CREATE POLICY "Users can manage their own portal messages"
ON public.student_portal_messages
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for student_portal_config
CREATE POLICY "Users can manage their own portal config"
ON public.student_portal_config
FOR ALL
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_student_applications_updated_at
  BEFORE UPDATE ON public.student_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_portal_content_updated_at
  BEFORE UPDATE ON public.student_portal_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_portal_messages_updated_at
  BEFORE UPDATE ON public.student_portal_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_portal_config_updated_at
  BEFORE UPDATE ON public.student_portal_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();