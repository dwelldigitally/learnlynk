-- Create email_sequences table
CREATE TABLE public.email_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'nurture',
  duration_days INTEGER NOT NULL DEFAULT 14,
  email_count INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_sequence_enrollments table
CREATE TABLE public.lead_sequence_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  sequence_id UUID NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  current_step INTEGER NOT NULL DEFAULT 1,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  stopped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lead_id, sequence_id)
);

-- Enable RLS
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sequence_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_sequences
CREATE POLICY "Users can manage their own email sequences" 
ON public.email_sequences 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS policies for lead_sequence_enrollments
CREATE POLICY "Users can manage enrollments for their sequences" 
ON public.lead_sequence_enrollments 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.email_sequences 
  WHERE id = lead_sequence_enrollments.sequence_id 
  AND user_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_email_sequences_user_id ON public.email_sequences(user_id);
CREATE INDEX idx_lead_sequence_enrollments_lead_id ON public.lead_sequence_enrollments(lead_id);
CREATE INDEX idx_lead_sequence_enrollments_sequence_id ON public.lead_sequence_enrollments(sequence_id);

-- Create updated_at triggers
CREATE TRIGGER update_email_sequences_updated_at
  BEFORE UPDATE ON public.email_sequences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_sequence_enrollments_updated_at
  BEFORE UPDATE ON public.lead_sequence_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();