-- Create communication tracking table
CREATE TABLE public.lead_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'sms', 'meeting', 'note')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  content TEXT NOT NULL,
  communication_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'scheduled', 'failed')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks and reminders table
CREATE TABLE public.lead_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  user_id UUID NOT NULL,
  assigned_to UUID,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('follow_up', 'call', 'email', 'meeting', 'research', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  reminder_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communication templates table
CREATE TABLE public.communication_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead notes table for detailed notes
CREATE TABLE public.lead_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  user_id UUID NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'general' CHECK (note_type IN ('general', 'qualification', 'objection', 'interest', 'follow_up')),
  content TEXT NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.lead_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lead_communications
CREATE POLICY "Users can manage communications for their leads" 
ON public.lead_communications 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads 
  WHERE leads.id = lead_communications.lead_id 
  AND leads.user_id = auth.uid()
));

-- Create RLS policies for lead_tasks
CREATE POLICY "Users can manage tasks for their leads" 
ON public.lead_tasks 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads 
  WHERE leads.id = lead_tasks.lead_id 
  AND leads.user_id = auth.uid()
));

-- Create RLS policies for communication_templates
CREATE POLICY "Users can manage their own templates" 
ON public.communication_templates 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for lead_notes
CREATE POLICY "Users can manage notes for their leads" 
ON public.lead_notes 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads 
  WHERE leads.id = lead_notes.lead_id 
  AND leads.user_id = auth.uid()
));

-- Create indexes for better performance
CREATE INDEX idx_lead_communications_lead_id ON public.lead_communications(lead_id);
CREATE INDEX idx_lead_communications_date ON public.lead_communications(communication_date);
CREATE INDEX idx_lead_tasks_lead_id ON public.lead_tasks(lead_id);
CREATE INDEX idx_lead_tasks_due_date ON public.lead_tasks(due_date);
CREATE INDEX idx_lead_tasks_assigned_to ON public.lead_tasks(assigned_to);
CREATE INDEX idx_lead_notes_lead_id ON public.lead_notes(lead_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_lead_communications_updated_at
  BEFORE UPDATE ON public.lead_communications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_tasks_updated_at
  BEFORE UPDATE ON public.lead_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communication_templates_updated_at
  BEFORE UPDATE ON public.communication_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_notes_updated_at
  BEFORE UPDATE ON public.lead_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();