-- Create journey templates for the Journey Builder

-- First, let's create the journey_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.journey_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  complexity TEXT NOT NULL DEFAULT 'medium',
  estimated_duration_days INTEGER DEFAULT 30,
  template_data JSONB NOT NULL DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  is_system_template BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.journey_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for journey templates
CREATE POLICY "Journey templates are viewable by everyone"
ON public.journey_templates
FOR SELECT
USING (true);

-- Insert Business Administration Journey Template
INSERT INTO public.journey_templates (name, description, category, complexity, estimated_duration_days, template_data) VALUES (
  'Business Administration Journey',
  'Complete academic journey for business administration programs with structured stages and requirements',
  'business',
  'medium',
  45,
  '{
    "stages": [
      {
        "name": "Initial Inquiry",
        "description": "Student expresses interest and initial information gathering",
        "stage_type": "inquiry",
        "order_index": 0,
        "timing_config": {
          "max_duration_days": 7,
          "escalation_after_days": 3
        },
        "requirements": [
          {
            "name": "Contact Information Verification",
            "requirement_type": "contact_verification",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Program Interest Assessment",
            "requirement_type": "assessment",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Application Submission",
        "description": "Student completes and submits application with required materials",
        "stage_type": "application",
        "order_index": 1,
        "timing_config": {
          "max_duration_days": 14,
          "escalation_after_days": 7
        },
        "requirements": [
          {
            "name": "Application Form",
            "requirement_type": "form_submission",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "High School Transcript",
            "requirement_type": "document",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Personal Statement",
            "requirement_type": "document",
            "is_mandatory": false,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Document Collection",
        "description": "Gather and verify all required documentation",
        "stage_type": "document_collection",
        "order_index": 2,
        "timing_config": {
          "max_duration_days": 10,
          "escalation_after_days": 5
        },
        "requirements": [
          {
            "name": "Financial Aid Documentation",
            "requirement_type": "document",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "ID Verification",
            "requirement_type": "verification",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "sms",
            "is_allowed": true,
            "priority_threshold": 3,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Interview & Assessment",
        "description": "Conduct interviews and assess student readiness",
        "stage_type": "interview",
        "order_index": 3,
        "timing_config": {
          "max_duration_days": 7,
          "escalation_after_days": 3
        },
        "requirements": [
          {
            "name": "Admissions Interview",
            "requirement_type": "interview",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Skills Assessment",
            "requirement_type": "assessment",
            "is_mandatory": false,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Enrollment & Onboarding",
        "description": "Final enrollment steps and student onboarding",
        "stage_type": "enrollment",
        "order_index": 4,
        "timing_config": {
          "max_duration_days": 5,
          "escalation_after_days": 2
        },
        "requirements": [
          {
            "name": "Enrollment Confirmation",
            "requirement_type": "confirmation",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Tuition Payment Setup",
            "requirement_type": "payment",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Student Orientation",
            "requirement_type": "orientation",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      }
    ]
  }'
);

-- Insert Healthcare Assistant Journey Template
INSERT INTO public.journey_templates (name, description, category, complexity, estimated_duration_days, template_data) VALUES (
  'Healthcare Assistant Journey',
  'Specialized journey for healthcare programs with clinical requirements and background checks',
  'healthcare',
  'high',
  60,
  '{
    "stages": [
      {
        "name": "Program Inquiry",
        "description": "Initial interest in healthcare program",
        "stage_type": "inquiry",
        "order_index": 0,
        "timing_config": {
          "max_duration_days": 5,
          "escalation_after_days": 2
        },
        "requirements": [
          {
            "name": "Healthcare Interest Survey",
            "requirement_type": "survey",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Program Information Review",
            "requirement_type": "information",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Application & Prerequisites",
        "description": "Application submission with healthcare-specific prerequisites",
        "stage_type": "application",
        "order_index": 1,
        "timing_config": {
          "max_duration_days": 21,
          "escalation_after_days": 10
        },
        "requirements": [
          {
            "name": "Healthcare Program Application",
            "requirement_type": "form_submission",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "High School Diploma/GED",
            "requirement_type": "document",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Science Prerequisites Check",
            "requirement_type": "prerequisite",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Background Check & Health Records",
        "description": "Required background verification and health documentation",
        "stage_type": "verification",
        "order_index": 2,
        "timing_config": {
          "max_duration_days": 14,
          "escalation_after_days": 7
        },
        "requirements": [
          {
            "name": "Criminal Background Check",
            "requirement_type": "background_check",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Immunization Records",
            "requirement_type": "health_record",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Physical Examination",
            "requirement_type": "health_record",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 3,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Clinical Readiness Assessment",
        "description": "Assessment of readiness for clinical training",
        "stage_type": "assessment",
        "order_index": 3,
        "timing_config": {
          "max_duration_days": 10,
          "escalation_after_days": 5
        },
        "requirements": [
          {
            "name": "Entrance Exam",
            "requirement_type": "exam",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Clinical Skills Assessment",
            "requirement_type": "skills_test",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Program Enrollment",
        "description": "Final enrollment and clinical placement preparation",
        "stage_type": "enrollment",
        "order_index": 4,
        "timing_config": {
          "max_duration_days": 7,
          "escalation_after_days": 3
        },
        "requirements": [
          {
            "name": "Enrollment Agreement",
            "requirement_type": "agreement",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Clinical Site Assignment",
            "requirement_type": "assignment",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Student Handbook Acknowledgment",
            "requirement_type": "acknowledgment",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      }
    ]
  }'
);

-- Insert Simple Academic Journey Template
INSERT INTO public.journey_templates (name, description, category, complexity, estimated_duration_days, template_data) VALUES (
  'Standard Academic Journey',
  'Basic academic journey template suitable for most programs',
  'general',
  'low',
  30,
  '{
    "stages": [
      {
        "name": "Inquiry",
        "description": "Student shows interest in the program",
        "stage_type": "inquiry",
        "order_index": 0,
        "timing_config": {
          "max_duration_days": 7,
          "escalation_after_days": 3
        },
        "requirements": [
          {
            "name": "Initial Contact",
            "requirement_type": "contact",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Application",
        "description": "Application submission and review",
        "stage_type": "application",
        "order_index": 1,
        "timing_config": {
          "max_duration_days": 14,
          "escalation_after_days": 7
        },
        "requirements": [
          {
            "name": "Application Form",
            "requirement_type": "form_submission",
            "is_mandatory": true,
            "validation_rules": {}
          },
          {
            "name": "Transcripts",
            "requirement_type": "document",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          }
        ]
      },
      {
        "name": "Enrollment",
        "description": "Final enrollment and onboarding",
        "stage_type": "enrollment",
        "order_index": 2,
        "timing_config": {
          "max_duration_days": 5,
          "escalation_after_days": 2
        },
        "requirements": [
          {
            "name": "Enrollment Confirmation",
            "requirement_type": "confirmation",
            "is_mandatory": true,
            "validation_rules": {}
          }
        ],
        "channel_rules": [
          {
            "channel_type": "email",
            "is_allowed": true,
            "priority_threshold": 1,
            "conditions": {}
          },
          {
            "channel_type": "phone",
            "is_allowed": true,
            "priority_threshold": 2,
            "conditions": {}
          }
        ]
      }
    ]
  }'
);

-- Add trigger for updated_at
CREATE TRIGGER update_journey_templates_updated_at
BEFORE UPDATE ON public.journey_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();