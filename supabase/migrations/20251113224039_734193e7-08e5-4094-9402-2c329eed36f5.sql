-- Create notification types reference table
CREATE TABLE public.notification_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  default_enabled BOOLEAN DEFAULT true,
  available_channels TEXT[] DEFAULT ARRAY['email', 'in_app'],
  is_system BOOLEAN DEFAULT false,
  icon TEXT,
  priority_default TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user notification preferences table
CREATE TABLE public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  channel TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  priority_filter TEXT DEFAULT 'all',
  frequency TEXT DEFAULT 'immediate',
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  digest_time TIME,
  include_details BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, notification_type, channel)
);

-- Enable RLS
ALTER TABLE public.notification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view notification types"
  ON public.notification_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own preferences"
  ON public.user_notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own preferences"
  ON public.user_notification_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Seed default notification types
INSERT INTO public.notification_types (type_key, display_name, description, category, available_channels, icon) VALUES
('new_lead', 'New Lead', 'When a new student inquiry is received', 'leads', ARRAY['email', 'sms', 'in_app'], 'UserPlus'),
('lead_assigned', 'Lead Assigned', 'When a lead is assigned to you', 'leads', ARRAY['email', 'in_app'], 'UserCheck'),
('document_uploaded', 'Document Uploaded', 'When a student uploads a document', 'documents', ARRAY['email', 'in_app'], 'FileUp'),
('document_pending', 'Document Pending Review', 'When a document is awaiting your review', 'documents', ARRAY['email', 'in_app'], 'FileQuestion'),
('task_assigned', 'Task Assigned', 'When a task is assigned to you', 'tasks', ARRAY['email', 'sms', 'in_app'], 'CheckSquare'),
('task_due_soon', 'Task Due Soon', 'Reminder for upcoming task deadlines', 'tasks', ARRAY['email', 'sms', 'in_app'], 'Clock'),
('task_overdue', 'Task Overdue', 'When a task is past its due date', 'tasks', ARRAY['email', 'sms', 'in_app'], 'AlertTriangle'),
('new_message', 'New Message', 'When you receive a new message', 'communications', ARRAY['email', 'sms', 'in_app'], 'Mail'),
('message_mention', 'Mentioned in Message', 'When someone mentions you', 'communications', ARRAY['email', 'in_app'], 'AtSign'),
('payment_due', 'Payment Due', 'Payment reminder notifications', 'payments', ARRAY['email', 'sms'], 'DollarSign'),
('system_update', 'System Updates', 'Important system announcements', 'system', ARRAY['email', 'in_app'], 'Bell'),
('security_alert', 'Security Alerts', 'Security-related notifications', 'system', ARRAY['email', 'sms', 'in_app'], 'Shield');

-- Update trigger
CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON public.user_notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();