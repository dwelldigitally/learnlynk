-- Create intakes table for storing program intake information
CREATE TABLE public.intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  application_deadline DATE,
  capacity INTEGER NOT NULL DEFAULT 0,
  study_mode TEXT NOT NULL DEFAULT 'full-time',
  delivery_method TEXT NOT NULL DEFAULT 'on-campus',
  campus TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  sales_approach TEXT NOT NULL DEFAULT 'balanced',
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.intakes ENABLE ROW LEVEL SECURITY;

-- Create policies for intakes
CREATE POLICY "Users can view their own intakes" 
ON public.intakes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own intakes" 
ON public.intakes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intakes" 
ON public.intakes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own intakes" 
ON public.intakes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_intakes_updated_at
BEFORE UPDATE ON public.intakes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();