-- Create communications table for lead communications
CREATE TABLE public.lead_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'call', 'note', 'meeting')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound', 'internal')),
  source TEXT NOT NULL CHECK (source IN ('AI', 'Human', 'Student', 'System')),
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'failed', 'completed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table for lead documents
CREATE TABLE public.lead_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'approved', 'rejected', 'missing')),
  upload_date TIMESTAMP WITH TIME ZONE,
  required BOOLEAN DEFAULT false,
  ai_insight TEXT,
  admin_comments TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table for lead tasks
CREATE TABLE public.lead_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  assigned_to UUID,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create academic journey stages table
CREATE TABLE public.academic_journey_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  auto_progression_rules JSONB DEFAULT '{}',
  estimated_duration_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead academic journeys table
CREATE TABLE public.lead_academic_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  journey_name TEXT NOT NULL,
  current_stage_id UUID REFERENCES public.academic_journey_stages(id),
  current_stage_name TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  estimated_completion_date DATE,
  next_required_action TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journey stage progress table
CREATE TABLE public.lead_journey_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  journey_id UUID NOT NULL REFERENCES public.lead_academic_journeys(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.academic_journey_stages(id),
  stage_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.lead_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_journey_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_academic_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_journey_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lead_communications
CREATE POLICY "Users can manage communications for their leads" 
ON public.lead_communications 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for lead_documents
CREATE POLICY "Users can manage documents for their leads" 
ON public.lead_documents 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for lead_tasks
CREATE POLICY "Users can manage tasks for their leads" 
ON public.lead_tasks 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for academic_journey_stages
CREATE POLICY "Users can manage their own journey stages" 
ON public.academic_journey_stages 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for lead_academic_journeys
CREATE POLICY "Users can manage journeys for their leads" 
ON public.lead_academic_journeys 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for lead_journey_progress
CREATE POLICY "Users can manage journey progress for their leads" 
ON public.lead_journey_progress 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.lead_academic_journeys laj 
  WHERE laj.id = lead_journey_progress.journey_id 
  AND laj.user_id = auth.uid()
));

-- Create triggers for updated_at
CREATE TRIGGER update_lead_communications_updated_at
BEFORE UPDATE ON public.lead_communications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_documents_updated_at
BEFORE UPDATE ON public.lead_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_tasks_updated_at
BEFORE UPDATE ON public.lead_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_journey_stages_updated_at
BEFORE UPDATE ON public.academic_journey_stages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_academic_journeys_updated_at
BEFORE UPDATE ON public.lead_academic_journeys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_journey_progress_updated_at
BEFORE UPDATE ON public.lead_journey_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default academic journey stages
INSERT INTO public.academic_journey_stages (user_id, name, description, order_index, estimated_duration_days) VALUES
(uuid_nil(), 'Inquiry', 'Initial student inquiry and interest capture', 1, 1),
(uuid_nil(), 'Qualification', 'Student qualification and needs assessment', 2, 3),
(uuid_nil(), 'Nurturing', 'Relationship building and program education', 3, 14),
(uuid_nil(), 'Application Initiated', 'Student has started the application process', 4, 7),
(uuid_nil(), 'Application Submitted', 'Complete application has been submitted', 5, 1),
(uuid_nil(), 'Documents Pending / Submitted', 'Required documents collection and verification', 6, 14),
(uuid_nil(), 'Interview / Counseling', 'Student interview and academic counseling session', 7, 7),
(uuid_nil(), 'Offer Sent', 'Admission offer has been sent to student', 8, 1),
(uuid_nil(), 'Offer Accepted', 'Student has accepted the admission offer', 9, 7),
(uuid_nil(), 'Enrollment Confirmed', 'Enrollment process completed and confirmed', 10, 3),
(uuid_nil(), 'Orientation & Onboarding', 'Student orientation and onboarding process', 11, 7),
(uuid_nil(), 'Enrolled / Active', 'Student is actively enrolled and attending', 12, null);

-- Create indexes for better performance
CREATE INDEX idx_lead_communications_lead_id ON public.lead_communications(lead_id);
CREATE INDEX idx_lead_communications_type ON public.lead_communications(type);
CREATE INDEX idx_lead_communications_created_at ON public.lead_communications(created_at);

CREATE INDEX idx_lead_documents_lead_id ON public.lead_documents(lead_id);
CREATE INDEX idx_lead_documents_status ON public.lead_documents(status);

CREATE INDEX idx_lead_tasks_lead_id ON public.lead_tasks(lead_id);
CREATE INDEX idx_lead_tasks_status ON public.lead_tasks(status);
CREATE INDEX idx_lead_tasks_assigned_to ON public.lead_tasks(assigned_to);

CREATE INDEX idx_lead_academic_journeys_lead_id ON public.lead_academic_journeys(lead_id);
CREATE INDEX idx_lead_journey_progress_journey_id ON public.lead_journey_progress(journey_id);
CREATE INDEX idx_lead_journey_progress_stage_id ON public.lead_journey_progress(stage_id);