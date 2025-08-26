-- Add new fields to journey_templates for master template system
ALTER TABLE journey_templates 
ADD COLUMN student_type TEXT DEFAULT 'all' CHECK (student_type IN ('domestic', 'international', 'all')),
ADD COLUMN is_master_template BOOLEAN DEFAULT false,
ADD COLUMN inherits_from_template_id UUID REFERENCES journey_templates(id);

-- Add student_type to leads table
ALTER TABLE leads 
ADD COLUMN student_type TEXT CHECK (student_type IN ('domestic', 'international'));

-- Create student_journey_instances table to track individual progress
CREATE TABLE student_journey_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  journey_id UUID NOT NULL REFERENCES academic_journeys(id) ON DELETE CASCADE,
  current_stage_id UUID REFERENCES journey_stages(id),
  student_type TEXT NOT NULL CHECK (student_type IN ('domestic', 'international')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  progress_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journey_stage_progress table to track stage completion
CREATE TABLE journey_stage_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_instance_id UUID NOT NULL REFERENCES student_journey_instances(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES journey_stages(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'failed')),
  completion_data JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE student_journey_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_stage_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for student_journey_instances
CREATE POLICY "Users can manage journey instances for their leads" 
ON student_journey_instances 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM leads 
    WHERE leads.id = student_journey_instances.lead_id 
    AND leads.user_id = auth.uid()
  )
);

-- Create RLS policies for journey_stage_progress
CREATE POLICY "Users can manage stage progress for their journey instances" 
ON journey_stage_progress 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM student_journey_instances sji
    JOIN leads l ON l.id = sji.lead_id
    WHERE sji.id = journey_stage_progress.journey_instance_id 
    AND l.user_id = auth.uid()
  )
);

-- Create updated_at triggers
CREATE TRIGGER update_student_journey_instances_updated_at
  BEFORE UPDATE ON student_journey_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journey_stage_progress_updated_at
  BEFORE UPDATE ON journey_stage_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update journey_stages with new standard stage types
ALTER TABLE journey_stages 
ALTER COLUMN stage_type TYPE TEXT;