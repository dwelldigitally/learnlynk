-- Create Computer Science journey templates with domestic and international variations

-- Create CS Domestic Journey Template
INSERT INTO journey_templates (
  id,
  name,
  description,
  category,
  complexity_level,
  student_type,
  program_type,
  inherits_from_template_id,
  template_data,
  is_master_template,
  is_system_template,
  usage_count
) VALUES (
  gen_random_uuid(),
  'Computer Science - Domestic Student Journey',
  'Specialized journey template for domestic Computer Science students with technical assessments',
  'program_specific',
  'medium',
  'domestic',
  'computer_science',
  '374ebbe6-1557-466e-9c9b-8fd5c1b606e5', -- inherits from master domestic
  jsonb_build_object(
    'stages', jsonb_build_array(
      jsonb_build_object(
        'name', 'Lead Capture',
        'description', 'Initial CS program inquiry received',
        'stage_type', 'lead_capture',
        'order_index', 1,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 1,
          'stall_threshold_days', 2
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Application Start',
        'description', 'Student begins CS application process',
        'stage_type', 'application_start',
        'order_index', 2,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 7,
          'stall_threshold_days', 14
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Prerequisites Review',
        'description', 'Verify CS academic prerequisites (Math, Science background)',
        'stage_type', 'prerequisites',
        'order_index', 3,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 5,
          'stall_threshold_days', 10
        ),
        'requirements', jsonb_build_array(
          jsonb_build_object(
            'name', 'Mathematics Prerequisites',
            'requirement_type', 'academic_transcript',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('min_grade', 'B')
          ),
          jsonb_build_object(
            'name', 'Science Background Check',
            'requirement_type', 'academic_transcript',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('required_courses', jsonb_build_array('Physics', 'Chemistry'))
          )
        ),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Programming Skills Assessment',
        'description', 'Technical assessment of programming knowledge and problem-solving',
        'stage_type', 'programming_assessment',
        'order_index', 4,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 3,
          'stall_threshold_days', 7
        ),
        'requirements', jsonb_build_array(
          jsonb_build_object(
            'name', 'Coding Challenge',
            'requirement_type', 'technical_assessment',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('min_score', 70)
          ),
          jsonb_build_object(
            'name', 'Algorithm Problem Solving',
            'requirement_type', 'technical_assessment',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('time_limit_minutes', 120)
          )
        ),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Technical Portfolio Review',
        'description', 'Review of programming projects and GitHub repository',
        'stage_type', 'portfolio_review',
        'order_index', 5,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 5,
          'stall_threshold_days', 10
        ),
        'requirements', jsonb_build_array(
          jsonb_build_object(
            'name', 'GitHub Portfolio',
            'requirement_type', 'portfolio_submission',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('min_projects', 3)
          ),
          jsonb_build_object(
            'name', 'Code Quality Assessment',
            'requirement_type', 'technical_review',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('review_criteria', jsonb_build_array('Clean Code', 'Documentation', 'Testing'))
          )
        ),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Document Submission',
        'description', 'Submit required academic documents',
        'stage_type', 'documents',
        'order_index', 6,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 14,
          'stall_threshold_days', 21
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Technical Interview',
        'description', 'Technical discussion and programming problem-solving interview',
        'stage_type', 'technical_interview',
        'order_index', 7,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 7,
          'stall_threshold_days', 14
        ),
        'requirements', jsonb_build_array(
          jsonb_build_object(
            'name', 'Live Coding Session',
            'requirement_type', 'interview_assessment',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('duration_minutes', 60)
          ),
          jsonb_build_object(
            'name', 'System Design Discussion',
            'requirement_type', 'interview_assessment',
            'is_mandatory', false,
            'validation_rules', jsonb_build_object('complexity_level', 'intermediate')
          )
        ),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Academic Advisor Meeting',
        'description', 'Program planning and course selection consultation',
        'stage_type', 'academic_advising',
        'order_index', 8,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 5,
          'stall_threshold_days', 10
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Admission Decision',
        'description', 'Review application and make admission decision',
        'stage_type', 'admission_decision',
        'order_index', 9,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 10,
          'stall_threshold_days', 15
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Contract Signing',
        'description', 'Sign enrollment contract',
        'stage_type', 'contract_signing',
        'order_index', 10,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 14,
          'stall_threshold_days', 21
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Deposit Payment',
        'description', 'Submit enrollment deposit',
        'stage_type', 'deposit_payment',
        'order_index', 11,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 7,
          'stall_threshold_days', 14
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Course Registration & Orientation',
        'description', 'Course registration and CS program orientation',
        'stage_type', 'onboarding',
        'order_index', 12,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 10,
          'stall_threshold_days', 14
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Enrollment Complete',
        'description', 'CS student enrollment is finalized',
        'stage_type', 'enrollment_complete',
        'order_index', 13,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 1,
          'stall_threshold_days', 1
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      )
    ),
    'default_timings', jsonb_build_object(
      'stall_threshold_days', 7
    ),
    'communication_rules', jsonb_build_array()
  ),
  false,
  false,
  0
);

-- Create CS International Journey Template
INSERT INTO journey_templates (
  id,
  name,
  description,
  category,
  complexity_level,
  student_type,
  program_type,
  inherits_from_template_id,
  template_data,
  is_master_template,
  is_system_template,
  usage_count
) VALUES (
  gen_random_uuid(),
  'Computer Science - International Student Journey',
  'Specialized journey template for international Computer Science students with visa support and extended timelines',
  'program_specific',
  'complex',
  'international',
  'computer_science',
  '2009439a-80b9-4043-b2a1-89be46224995', -- inherits from master international
  jsonb_build_object(
    'stages', jsonb_build_array(
      jsonb_build_object(
        'name', 'Lead Capture',
        'description', 'Initial CS program inquiry received',
        'stage_type', 'lead_capture',
        'order_index', 1,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 1,
          'stall_threshold_days', 2
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Application Start',
        'description', 'Student begins CS application process',
        'stage_type', 'application_start',
        'order_index', 2,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 7,
          'stall_threshold_days', 14
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Prerequisites Review',
        'description', 'Verify CS academic prerequisites and credential evaluation',
        'stage_type', 'prerequisites',
        'order_index', 3,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 14,
          'stall_threshold_days', 21
        ),
        'requirements', jsonb_build_array(
          jsonb_build_object(
            'name', 'Credential Evaluation',
            'requirement_type', 'credential_evaluation',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('agency', 'WES or ICAS')
          ),
          jsonb_build_object(
            'name', 'Mathematics Prerequisites',
            'requirement_type', 'academic_transcript',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('min_grade', 'B')
          )
        ),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Programming Skills Assessment',
        'description', 'Technical assessment of programming knowledge and problem-solving',
        'stage_type', 'programming_assessment',
        'order_index', 4,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 5,
          'stall_threshold_days', 10
        ),
        'requirements', jsonb_build_array(
          jsonb_build_object(
            'name', 'Coding Challenge',
            'requirement_type', 'technical_assessment',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('min_score', 70)
          )
        ),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'English Proficiency Test',
        'description', 'Complete English proficiency testing (IELTS/TOEFL)',
        'stage_type', 'language_test',
        'order_index', 5,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 30,
          'stall_threshold_days', 45
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Technical Portfolio Review',
        'description', 'Review of programming projects and GitHub repository',
        'stage_type', 'portfolio_review',
        'order_index', 6,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 7,
          'stall_threshold_days', 14
        ),
        'requirements', jsonb_build_array(
          jsonb_build_object(
            'name', 'GitHub Portfolio',
            'requirement_type', 'portfolio_submission',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('min_projects', 3)
          )
        ),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Document Submission',
        'description', 'Submit required academic and visa documents',
        'stage_type', 'documents',
        'order_index', 7,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 21,
          'stall_threshold_days', 30
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Technical Interview',
        'description', 'Technical discussion and programming problem-solving (online/in-person)',
        'stage_type', 'technical_interview',
        'order_index', 8,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 10,
          'stall_threshold_days', 14
        ),
        'requirements', jsonb_build_array(
          jsonb_build_object(
            'name', 'Live Coding Session',
            'requirement_type', 'interview_assessment',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('duration_minutes', 90)
          ),
          jsonb_build_object(
            'name', 'English Communication Assessment',
            'requirement_type', 'interview_assessment',
            'is_mandatory', true,
            'validation_rules', jsonb_build_object('focus', 'technical_communication')
          )
        ),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Academic Advisor Meeting',
        'description', 'Program planning and course selection consultation',
        'stage_type', 'academic_advising',
        'order_index', 9,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 7,
          'stall_threshold_days', 14
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Admission Decision',
        'description', 'Review application and make admission decision',
        'stage_type', 'admission_decision',
        'order_index', 10,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 14,
          'stall_threshold_days', 21
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Visa Application Support',
        'description', 'Provide visa application documentation and support',
        'stage_type', 'visa_support',
        'order_index', 11,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 21,
          'stall_threshold_days', 30
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Contract Signing',
        'description', 'Sign enrollment contract',
        'stage_type', 'contract_signing',
        'order_index', 12,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 14,
          'stall_threshold_days', 21
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Deposit Payment',
        'description', 'Submit enrollment deposit',
        'stage_type', 'deposit_payment',
        'order_index', 13,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 7,
          'stall_threshold_days', 14
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Course Registration & Pre-arrival Support',
        'description', 'Course registration and pre-arrival support for international students',
        'stage_type', 'onboarding',
        'order_index', 14,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 14,
          'stall_threshold_days', 21
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      ),
      jsonb_build_object(
        'name', 'Enrollment Complete',
        'description', 'CS student enrollment is finalized',
        'stage_type', 'enrollment_complete',
        'order_index', 15,
        'is_required', true,
        'timing_config', jsonb_build_object(
          'expected_duration_days', 1,
          'stall_threshold_days', 1
        ),
        'requirements', jsonb_build_array(),
        'channel_rules', jsonb_build_array()
      )
    ),
    'default_timings', jsonb_build_object(
      'stall_threshold_days', 10
    ),
    'communication_rules', jsonb_build_array()
  ),
  false,
  false,
  0
);