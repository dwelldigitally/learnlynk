-- First, create the universal_tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.universal_tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    assigned_to UUID,
    assigned_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    reminder_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.universal_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for universal tasks
CREATE POLICY "Users can view tasks assigned to them or created by them"
ON public.universal_tasks
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can create their own tasks"
ON public.universal_tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update tasks they created or are assigned to"
ON public.universal_tasks
FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete tasks they created"
ON public.universal_tasks
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_universal_tasks_updated_at
    BEFORE UPDATE ON public.universal_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy data (using a placeholder user ID - this will be replaced by actual user IDs)
INSERT INTO public.universal_tasks (
    user_id,
    title,
    description,
    category,
    priority,
    status,
    entity_type,
    entity_id,
    assigned_to,
    due_date,
    tags
) VALUES 
-- Tasks assigned to current user (user_id will be the same as assigned_to)
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Review MBA application - Sarah Johnson',
    'Complete document review and provide feedback on admission materials',
    'review_documents',
    'high',
    'pending',
    'applicant',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    now() + interval '2 days',
    ARRAY['urgent', 'review', 'mba']
),
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Follow up with overdue payment - Mike Chen',
    'Contact student regarding outstanding tuition payment for Spring semester',
    'follow_up',
    'urgent',
    'pending',
    'student',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    now() - interval '1 day',
    ARRAY['payment', 'follow-up', 'overdue']
),
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Prepare consultation materials for Biology program',
    'Gather program information and prepare presentation for upcoming student meeting',
    'academic',
    'medium',
    'in_progress',
    'lead',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    now() + interval '3 days',
    ARRAY['meeting', 'preparation', 'biology']
),
(
    '00000000-0000-0000-0000-000000000003'::uuid,
    'Update student records - Computer Science intake',
    'Enter new student information into system for Fall 2024 intake',
    'administrative',
    'low',
    'pending',
    'student',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    now() + interval '5 days',
    ARRAY['data-entry', 'intake', 'cs']
),
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Schedule visa consultation for international students',
    'Arrange meetings with visa consultants for 5 international applicants',
    'scheduling',
    'high',
    'pending',
    'applicant',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    now() + interval '1 day',
    ARRAY['visa', 'international', 'consultation']
),
-- Tasks assigned by current user to others
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Process scholarship applications',
    'Review and process 15 scholarship applications for merit-based awards',
    'approve_payments',
    'high',
    'in_progress',
    'applicant',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000002'::uuid,
    now() + interval '4 days',
    ARRAY['scholarship', 'financial-aid']
),
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Send welcome emails to new students',
    'Send personalized welcome emails to all newly enrolled students for Spring intake',
    'communication',
    'medium',
    'pending',
    'student',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000003'::uuid,
    now() + interval '2 days',
    ARRAY['welcome', 'communication', 'spring-intake']
),
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Verify academic credentials',
    'Verify transcripts and certificates for 8 international applicants',
    'verification',
    'high',
    'pending',
    'applicant',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000004'::uuid,
    now() + interval '3 days',
    ARRAY['verification', 'credentials', 'international']
),
-- Completed tasks
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Conduct orientation session',
    'Led orientation session for new Business students',
    'academic',
    'medium',
    'completed',
    'student',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    now() - interval '2 days',
    ARRAY['orientation', 'business']
),
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Update program requirements documentation',
    'Updated all program requirement documents for 2024 academic year',
    'administrative',
    'low',
    'completed',
    'student',
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001'::uuid,
    now() - interval '5 days',
    ARRAY['documentation', 'requirements']
);

-- Update completed tasks with completion timestamp
UPDATE public.universal_tasks 
SET completed_at = now() - interval '1 day'
WHERE status = 'completed';