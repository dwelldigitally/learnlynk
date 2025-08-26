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

-- Insert master journey templates for domestic and international students
INSERT INTO journey_templates (
  user_id, 
  name, 
  description, 
  category, 
  student_type, 
  is_master_template,
  template_data
) VALUES 
(
  (SELECT id FROM auth.users LIMIT 1),
  'Master Domestic Student Journey',
  'Standard journey template for domestic students',
  'master',
  'domestic',
  true,
  '{
    "stages": [
      {
        "name": "Lead Capture",
        "stage_type": "lead_capture",
        "order_index": 1,
        "description": "Initial lead inquiry received",
        "timing_config": {"expected_duration_days": 1},
        "is_required": true
      },
      {
        "name": "Application Start",
        "stage_type": "application_start", 
        "order_index": 2,
        "description": "Student begins application process",
        "timing_config": {"expected_duration_days": 7},
        "is_required": true
      },
      {
        "name": "Prerequisites Review",
        "stage_type": "prerequisites",
        "order_index": 3,
        "description": "Verify academic prerequisites are met",
        "timing_config": {"expected_duration_days": 5},
        "is_required": true
      },
      {
        "name": "Document Submission",
        "stage_type": "documents",
        "order_index": 4,
        "description": "Submit required academic documents",
        "timing_config": {"expected_duration_days": 14},
        "is_required": true
      },
      {
        "name": "Admission Interview",
        "stage_type": "interview",
        "order_index": 5,
        "description": "Conduct admission interview",
        "timing_config": {"expected_duration_days": 7},
        "is_required": true
      },
      {
        "name": "Admission Decision",
        "stage_type": "admission_decision",
        "order_index": 6,
        "description": "Review application and make admission decision",
        "timing_config": {"expected_duration_days": 10},
        "is_required": true
      },
      {
        "name": "Contract Signing",
        "stage_type": "contract_signing",
        "order_index": 7,
        "description": "Sign enrollment contract",
        "timing_config": {"expected_duration_days": 14},
        "is_required": true
      },
      {
        "name": "Deposit Payment",
        "stage_type": "deposit_payment",
        "order_index": 8,
        "description": "Submit enrollment deposit",
        "timing_config": {"expected_duration_days": 7},
        "is_required": true
      },
      {
        "name": "Enrollment Complete",
        "stage_type": "enrollment_complete",
        "order_index": 9,
        "description": "Student enrollment is finalized",
        "timing_config": {"expected_duration_days": 1},
        "is_required": true
      }
    ]
  }'::jsonb
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Master International Student Journey',
  'Standard journey template for international students',
  'master',
  'international',
  true,
  '{
    "stages": [
      {
        "name": "Lead Capture",
        "stage_type": "lead_capture",
        "order_index": 1,
        "description": "Initial lead inquiry received",
        "timing_config": {"expected_duration_days": 1},
        "is_required": true
      },
      {
        "name": "Application Start",
        "stage_type": "application_start",
        "order_index": 2,
        "description": "Student begins application process",
        "timing_config": {"expected_duration_days": 7},
        "is_required": true
      },
      {
        "name": "Prerequisites Review",
        "stage_type": "prerequisites",
        "order_index": 3,
        "description": "Verify academic prerequisites and credential evaluation",
        "timing_config": {"expected_duration_days": 14},
        "is_required": true
      },
      {
        "name": "English Proficiency Test",
        "stage_type": "language_test",
        "order_index": 4,
        "description": "Complete English proficiency testing (IELTS/TOEFL)",
        "timing_config": {"expected_duration_days": 30},
        "is_required": true
      },
      {
        "name": "Document Submission",
        "stage_type": "documents",
        "order_index": 5,
        "description": "Submit required academic and visa documents",
        "timing_config": {"expected_duration_days": 21},
        "is_required": true
      },
      {
        "name": "Admission Interview",
        "stage_type": "interview",
        "order_index": 6,
        "description": "Conduct admission interview (online/in-person)",
        "timing_config": {"expected_duration_days": 10},
        "is_required": true
      },
      {
        "name": "Admission Decision",
        "stage_type": "admission_decision",
        "order_index": 7,
        "description": "Review application and make admission decision",
        "timing_config": {"expected_duration_days": 14},
        "is_required": true
      },
      {
        "name": "Visa Application Support",
        "stage_type": "visa_support",
        "order_index": 8,
        "description": "Provide visa application documentation and support",
        "timing_config": {"expected_duration_days": 21},
        "is_required": true
      },
      {
        "name": "Contract Signing",
        "stage_type": "contract_signing",
        "order_index": 9,
        "description": "Sign enrollment contract",
        "timing_config": {"expected_duration_days": 14},
        "is_required": true
      },
      {
        "name": "Deposit Payment",
        "stage_type": "deposit_payment",
        "order_index": 10,
        "description": "Submit enrollment deposit",
        "timing_config": {"expected_duration_days": 7},
        "is_required": true
      },
      {
        "name": "Enrollment Complete",
        "stage_type": "enrollment_complete",
        "order_index": 11,
        "description": "Student enrollment is finalized",
        "timing_config": {"expected_duration_days": 1},
        "is_required": true
      }
    ]
  }'::jsonb
);