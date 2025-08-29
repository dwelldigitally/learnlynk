-- Create comprehensive student portal integration tables

-- Enhanced student portal sessions with lead linking
CREATE TABLE public.student_portal_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token TEXT NOT NULL UNIQUE,
  lead_id UUID NOT NULL,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  session_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student document uploads linked to leads
CREATE TABLE public.student_document_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  session_id UUID NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_size INTEGER,
  file_path TEXT,
  upload_status TEXT DEFAULT 'uploaded',
  admin_status TEXT DEFAULT 'pending',
  admin_reviewed_by UUID,
  admin_reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_comments TEXT,
  requirement_id TEXT,
  ocr_text TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student academic plans
CREATE TABLE public.student_academic_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  session_id UUID NOT NULL,
  program_name TEXT NOT NULL,
  intake_date DATE,
  academic_level TEXT,
  course_selections JSONB DEFAULT '[]',
  prerequisites_status JSONB DEFAULT '{}',
  advisor_notes TEXT,
  advisor_approved_by UUID,
  advisor_approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student fee payments
CREATE TABLE public.student_fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  session_id UUID NOT NULL,
  payment_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  payment_reference TEXT,
  payment_status TEXT DEFAULT 'pending',
  due_date DATE,
  paid_date TIMESTAMP WITH TIME ZONE,
  admin_confirmed_by UUID,
  admin_confirmed_at TIMESTAMP WITH TIME ZONE,
  payment_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced student portal communications
CREATE TABLE public.student_portal_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  session_id UUID,
  sender_type TEXT NOT NULL, -- 'student' or 'admin'
  sender_id UUID,
  sender_name TEXT NOT NULL,
  recipient_type TEXT NOT NULL,
  recipient_id UUID,
  message_type TEXT DEFAULT 'general',
  subject TEXT,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student application progress tracking
CREATE TABLE public.student_application_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  session_id UUID NOT NULL,
  stage TEXT NOT NULL,
  substage TEXT,
  progress_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  requirements_completed JSONB DEFAULT '[]',
  requirements_pending JSONB DEFAULT '[]',
  next_steps TEXT,
  estimated_completion DATE,
  admin_notes TEXT,
  last_updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Student portal notifications
CREATE TABLE public.student_portal_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  session_id UUID,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'normal',
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.student_portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_document_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_academic_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_application_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student portal sessions
CREATE POLICY "Students can view their own sessions" 
ON public.student_portal_sessions 
FOR SELECT 
USING (access_token IN (
  SELECT access_token FROM public.student_portal_access WHERE access_token IS NOT NULL
));

CREATE POLICY "Admins can manage all sessions" 
ON public.student_portal_sessions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads l 
  WHERE l.id = student_portal_sessions.lead_id 
  AND l.user_id = auth.uid()
));

-- RLS Policies for document uploads
CREATE POLICY "Students can manage their own documents" 
ON public.student_document_uploads 
FOR ALL 
USING (session_id IN (
  SELECT id FROM public.student_portal_sessions 
  WHERE access_token IN (
    SELECT access_token FROM public.student_portal_access WHERE access_token IS NOT NULL
  )
));

CREATE POLICY "Admins can manage documents for their leads" 
ON public.student_document_uploads 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads l 
  WHERE l.id = student_document_uploads.lead_id 
  AND l.user_id = auth.uid()
));

-- RLS Policies for academic plans
CREATE POLICY "Students can view their own academic plans" 
ON public.student_academic_plans 
FOR SELECT 
USING (session_id IN (
  SELECT id FROM public.student_portal_sessions 
  WHERE access_token IN (
    SELECT access_token FROM public.student_portal_access WHERE access_token IS NOT NULL
  )
));

CREATE POLICY "Admins can manage academic plans for their leads" 
ON public.student_academic_plans 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads l 
  WHERE l.id = student_academic_plans.lead_id 
  AND l.user_id = auth.uid()
));

-- RLS Policies for fee payments
CREATE POLICY "Students can view their own payments" 
ON public.student_fee_payments 
FOR SELECT 
USING (session_id IN (
  SELECT id FROM public.student_portal_sessions 
  WHERE access_token IN (
    SELECT access_token FROM public.student_portal_access WHERE access_token IS NOT NULL
  )
));

CREATE POLICY "Students can create payments" 
ON public.student_fee_payments 
FOR INSERT 
WITH CHECK (session_id IN (
  SELECT id FROM public.student_portal_sessions 
  WHERE access_token IN (
    SELECT access_token FROM public.student_portal_access WHERE access_token IS NOT NULL
  )
));

CREATE POLICY "Admins can manage payments for their leads" 
ON public.student_fee_payments 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads l 
  WHERE l.id = student_fee_payments.lead_id 
  AND l.user_id = auth.uid()
));

-- RLS Policies for communications
CREATE POLICY "Students can view their own communications" 
ON public.student_portal_communications 
FOR SELECT 
USING (session_id IN (
  SELECT id FROM public.student_portal_sessions 
  WHERE access_token IN (
    SELECT access_token FROM public.student_portal_access WHERE access_token IS NOT NULL
  )
) OR lead_id IN (
  SELECT spa.lead_id FROM public.student_portal_access spa 
  WHERE spa.access_token IS NOT NULL
));

CREATE POLICY "Students can create messages" 
ON public.student_portal_communications 
FOR INSERT 
WITH CHECK (sender_type = 'student' AND (session_id IN (
  SELECT id FROM public.student_portal_sessions 
  WHERE access_token IN (
    SELECT access_token FROM public.student_portal_access WHERE access_token IS NOT NULL
  )
) OR lead_id IN (
  SELECT spa.lead_id FROM public.student_portal_access spa 
  WHERE spa.access_token IS NOT NULL
)));

CREATE POLICY "Admins can manage communications for their leads" 
ON public.student_portal_communications 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads l 
  WHERE l.id = student_portal_communications.lead_id 
  AND l.user_id = auth.uid()
));

-- RLS Policies for application progress
CREATE POLICY "Students can view their own progress" 
ON public.student_application_progress 
FOR SELECT 
USING (session_id IN (
  SELECT id FROM public.student_portal_sessions 
  WHERE access_token IN (
    SELECT access_token FROM public.student_portal_access WHERE access_token IS NOT NULL
  )
));

CREATE POLICY "Admins can manage progress for their leads" 
ON public.student_application_progress 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads l 
  WHERE l.id = student_application_progress.lead_id 
  AND l.user_id = auth.uid()
));

-- RLS Policies for notifications
CREATE POLICY "Students can view their own notifications" 
ON public.student_portal_notifications 
FOR SELECT 
USING (session_id IN (
  SELECT id FROM public.student_portal_sessions 
  WHERE access_token IN (
    SELECT access_token FROM public.student_portal_access WHERE access_token IS NOT NULL
  )
) OR lead_id IN (
  SELECT spa.lead_id FROM public.student_portal_access spa 
  WHERE spa.access_token IS NOT NULL
));

CREATE POLICY "Admins can create notifications for their leads" 
ON public.student_portal_notifications 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.leads l 
  WHERE l.id = student_portal_notifications.lead_id 
  AND l.user_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_student_portal_sessions_access_token ON public.student_portal_sessions(access_token);
CREATE INDEX idx_student_portal_sessions_lead_id ON public.student_portal_sessions(lead_id);
CREATE INDEX idx_student_document_uploads_lead_id ON public.student_document_uploads(lead_id);
CREATE INDEX idx_student_document_uploads_session_id ON public.student_document_uploads(session_id);
CREATE INDEX idx_student_academic_plans_lead_id ON public.student_academic_plans(lead_id);
CREATE INDEX idx_student_fee_payments_lead_id ON public.student_fee_payments(lead_id);
CREATE INDEX idx_student_portal_communications_lead_id ON public.student_portal_communications(lead_id);
CREATE INDEX idx_student_application_progress_lead_id ON public.student_application_progress(lead_id);
CREATE INDEX idx_student_portal_notifications_lead_id ON public.student_portal_notifications(lead_id);

-- Create function to update updated_at columns
CREATE OR REPLACE FUNCTION update_student_portal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_student_portal_sessions_updated_at
  BEFORE UPDATE ON public.student_portal_sessions
  FOR EACH ROW EXECUTE FUNCTION update_student_portal_updated_at();

CREATE TRIGGER update_student_document_uploads_updated_at
  BEFORE UPDATE ON public.student_document_uploads
  FOR EACH ROW EXECUTE FUNCTION update_student_portal_updated_at();

CREATE TRIGGER update_student_academic_plans_updated_at
  BEFORE UPDATE ON public.student_academic_plans
  FOR EACH ROW EXECUTE FUNCTION update_student_portal_updated_at();

CREATE TRIGGER update_student_fee_payments_updated_at
  BEFORE UPDATE ON public.student_fee_payments
  FOR EACH ROW EXECUTE FUNCTION update_student_portal_updated_at();

CREATE TRIGGER update_student_portal_communications_updated_at
  BEFORE UPDATE ON public.student_portal_communications
  FOR EACH ROW EXECUTE FUNCTION update_student_portal_updated_at();

CREATE TRIGGER update_student_application_progress_updated_at
  BEFORE UPDATE ON public.student_application_progress
  FOR EACH ROW EXECUTE FUNCTION update_student_portal_updated_at();

-- Create function to sync student uploads to documents table
CREATE OR REPLACE FUNCTION sync_student_document_to_documents()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into documents table when student uploads a document
  INSERT INTO public.documents (
    user_id,
    document_name,
    document_type,
    file_size,
    upload_date,
    status,
    ocr_text,
    comments,
    requirement_id
  )
  SELECT 
    l.user_id,
    NEW.document_name,
    NEW.document_type,
    NEW.file_size,
    NEW.created_at,
    CASE 
      WHEN NEW.admin_status = 'approved' THEN 'approved'
      WHEN NEW.admin_status = 'rejected' THEN 'rejected'
      ELSE 'under-review'
    END,
    NEW.ocr_text,
    NEW.admin_comments,
    NEW.requirement_id
  FROM public.leads l
  WHERE l.id = NEW.lead_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync documents
CREATE TRIGGER sync_student_documents_trigger
  AFTER INSERT OR UPDATE ON public.student_document_uploads
  FOR EACH ROW EXECUTE FUNCTION sync_student_document_to_documents();

-- Create function to create session when portal access is created
CREATE OR REPLACE FUNCTION create_student_portal_session()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.student_portal_sessions (
    access_token,
    lead_id,
    student_name,
    email,
    expires_at
  ) VALUES (
    NEW.access_token,
    NEW.lead_id,
    NEW.student_name,
    COALESCE(
      (SELECT email FROM public.leads WHERE id = NEW.lead_id),
      'unknown@example.com'
    ),
    NEW.expires_at
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic session creation
CREATE TRIGGER create_student_portal_session_trigger
  AFTER INSERT ON public.student_portal_access
  FOR EACH ROW EXECUTE FUNCTION create_student_portal_session();