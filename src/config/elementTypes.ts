import { ElementTypeConfig } from '@/types/universalBuilder';

// Form Element Types
export const formElementTypes: ElementTypeConfig[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: 'Type',
    category: 'Basic Fields',
    defaultConfig: {
      placeholder: 'Enter text...',
      required: false
    },
    configSchema: [
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'maxLength', label: 'Max Length', type: 'number' }
    ]
  },
  {
    type: 'email',
    label: 'Email',
    icon: 'Mail',
    category: 'Basic Fields',
    defaultConfig: {
      placeholder: 'Enter email...',
      required: true
    },
    configSchema: [
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'required', label: 'Required', type: 'checkbox' }
    ]
  },
  {
    type: 'select',
    label: 'Select Dropdown',
    icon: 'ChevronDown',
    category: 'Choice Fields',
    defaultConfig: {
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ],
      required: false
    },
    configSchema: [
      { key: 'options', label: 'Options', type: 'array' },
      { key: 'required', label: 'Required', type: 'checkbox' }
    ]
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'CheckSquare',
    category: 'Choice Fields',
    defaultConfig: {
      label: 'Checkbox label',
      required: false
    },
    configSchema: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'required', label: 'Required', type: 'checkbox' }
    ]
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: 'Circle',
    category: 'Choice Fields',
    defaultConfig: {
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ],
      required: false
    },
    configSchema: [
      { key: 'options', label: 'Options', type: 'array' },
      { key: 'required', label: 'Required', type: 'checkbox' }
    ]
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: 'FileText',
    category: 'Basic Fields',
    defaultConfig: {
      placeholder: 'Enter text...',
      rows: 4,
      required: false
    },
    configSchema: [
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'rows', label: 'Rows', type: 'number' },
      { key: 'required', label: 'Required', type: 'checkbox' }
    ]
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: 'Upload',
    category: 'Advanced Fields',
    defaultConfig: {
      accept: '*',
      multiple: false,
      required: false
    },
    configSchema: [
      { key: 'accept', label: 'Accepted File Types', type: 'text', placeholder: 'e.g., .pdf,.doc,.jpg' },
      { key: 'multiple', label: 'Allow Multiple Files', type: 'checkbox' },
      { key: 'required', label: 'Required', type: 'checkbox' }
    ]
  }
];

// Workflow Element Types
export const workflowElementTypes: ElementTypeConfig[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    icon: 'Play',
    category: 'Flow Control',
    defaultConfig: {
      triggerType: 'manual'
    },
    configSchema: [
      {
        key: 'triggerType',
        label: 'Trigger Type',
        type: 'select',
        options: [
          { label: 'Manual', value: 'manual' },
          { label: 'Time-based', value: 'schedule' },
          { label: 'Event-based', value: 'event' }
        ]
      }
    ]
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: 'GitBranch',
    category: 'Flow Control',
    defaultConfig: {
      conditions: []
    },
    configSchema: [
      { key: 'field', label: 'Field', type: 'text' },
      { key: 'operator', label: 'Operator', type: 'select', options: [
        { label: 'Equals', value: 'equals' },
        { label: 'Contains', value: 'contains' },
        { label: 'Greater than', value: 'gt' }
      ]},
      { key: 'value', label: 'Value', type: 'text' }
    ]
  },
  {
    type: 'action',
    label: 'Action',
    icon: 'Zap',
    category: 'Actions',
    defaultConfig: {
      actionType: 'email'
    },
    configSchema: [
      {
        key: 'actionType',
        label: 'Action Type',
        type: 'select',
        options: [
          { label: 'Send Email', value: 'email' },
          { label: 'Update Record', value: 'update' },
          { label: 'Create Task', value: 'task' }
        ]
      }
    ]
  },
  {
    type: 'delay',
    label: 'Delay',
    icon: 'Clock',
    category: 'Flow Control',
    defaultConfig: {
      delay: { value: 1, unit: 'hours' }
    },
    configSchema: [
      { key: 'delay.value', label: 'Delay Amount', type: 'number' },
      {
        key: 'delay.unit',
        label: 'Time Unit',
        type: 'select',
        options: [
          { label: 'Minutes', value: 'minutes' },
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' }
        ]
      }
    ]
  }
];

// Campaign Element Types
export const campaignElementTypes: ElementTypeConfig[] = [
  {
    type: 'email',
    label: 'Email',
    icon: 'Mail',
    category: 'Communication',
    defaultConfig: {
      subject: 'Email Subject',
      content: 'Email content...'
    },
    configSchema: [
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'template', label: 'Template', type: 'text' }
    ]
  },
  {
    type: 'sms',
    label: 'SMS',
    icon: 'MessageSquare',
    category: 'Communication',
    defaultConfig: {
      content: 'SMS message...'
    },
    configSchema: [
      { key: 'content', label: 'Message', type: 'textarea' }
    ]
  },
  {
    type: 'wait',
    label: 'Wait',
    icon: 'Clock',
    category: 'Timing',
    defaultConfig: {
      waitTime: { value: 1, unit: 'days' }
    },
    configSchema: [
      { key: 'waitTime.value', label: 'Wait Time', type: 'number' },
      {
        key: 'waitTime.unit',
        label: 'Time Unit',
        type: 'select',
        options: [
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' },
          { label: 'Weeks', value: 'weeks' }
        ]
      }
    ]
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: 'GitBranch',
    category: 'Flow Control',
    defaultConfig: {
      conditions: []
    },
    configSchema: [
      { key: 'field', label: 'Field', type: 'text' },
      { key: 'operator', label: 'Operator', type: 'text' },
      { key: 'value', label: 'Value', type: 'text' }
    ]
  },
  {
    type: 'split',
    label: 'A/B Split',
    icon: 'Split',
    category: 'Testing',
    defaultConfig: {
      splitPercentage: 50
    },
    configSchema: [
      { key: 'splitPercentage', label: 'Split Percentage', type: 'number' }
    ]
  }
];

// Journey Element Types - NEW!
// Practicum Element Types - NEW!
export const practicumElementTypes: ElementTypeConfig[] = [
  // Interview Steps
  {
    type: 'in-person-interview',
    label: 'In-Person Interview',
    icon: 'Users',
    category: 'Interviews',
    defaultConfig: {
      duration: 60,
      location: 'Practicum Site',
      instructions: 'Meet with site supervisor for initial assessment',
      required: true,
      schedulingRequired: true
    },
    configSchema: [
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'instructions', label: 'Instructions', type: 'textarea' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'schedulingRequired', label: 'Requires Scheduling', type: 'checkbox' }
    ]
  },
  {
    type: 'phone-interview',
    label: 'Phone Interview',
    icon: 'Phone',
    category: 'Interviews',
    defaultConfig: {
      duration: 30,
      instructions: 'Pre-practicum phone screening with supervisor',
      required: true,
      schedulingRequired: true
    },
    configSchema: [
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'instructions', label: 'Instructions', type: 'textarea' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'schedulingRequired', label: 'Requires Scheduling', type: 'checkbox' }
    ]
  },

  // Requirements & Documents
  {
    type: 'document-upload',
    label: 'Document Upload',
    icon: 'FileText',
    category: 'Requirements',
    defaultConfig: {
      documentType: 'health_records',
      required: true,
      acceptedFormats: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
      maxFileSize: 10,
      requiresApproval: true
    },
    configSchema: [
      {
        key: 'documentType',
        label: 'Document Type',
        type: 'select',
        options: [
          { label: 'Health Records', value: 'health_records' },
          { label: 'Immunization Records', value: 'immunization' },
          { label: 'Background Check', value: 'background_check' },
          { label: 'Liability Insurance', value: 'insurance' },
          { label: 'Skills Checklist', value: 'skills_checklist' },
          { label: 'Resume/CV', value: 'resume' },
          { label: 'Other', value: 'other' }
        ]
      },
      { key: 'required', label: 'Required Document', type: 'checkbox' },
      { key: 'requiresApproval', label: 'Requires Approval', type: 'checkbox' },
      { key: 'maxFileSize', label: 'Max File Size (MB)', type: 'number' },
      { key: 'instructions', label: 'Upload Instructions', type: 'textarea' }
    ]
  },
  {
    type: 'verification',
    label: 'Verification',
    icon: 'CheckSquare',
    category: 'Requirements',
    defaultConfig: {
      verificationType: 'background_check',
      required: true,
      instructions: 'Complete background verification process',
      processingTime: 5
    },
    configSchema: [
      { 
        key: 'verificationType', 
        label: 'Verification Type', 
        type: 'select', 
        options: [
          { label: 'Background Check', value: 'background_check' },
          { label: 'Drug Screening', value: 'drug_screening' },
          { label: 'Health Clearance', value: 'health_clearance' },
          { label: 'Academic Records', value: 'academic_records' },
          { label: 'License Verification', value: 'license_verification' }
        ]
      },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'processingTime', label: 'Processing Time (days)', type: 'number' },
      { key: 'instructions', label: 'Instructions', type: 'textarea' }
    ]
  },

  // Tests & Assessments
  {
    type: 'typing-test',
    label: 'Typing Test',
    icon: 'Keyboard',
    category: 'Tests',
    defaultConfig: {
      minimumWPM: 35,
      duration: 10,
      required: true,
      retries: 2,
      testProvider: 'internal'
    },
    configSchema: [
      { key: 'minimumWPM', label: 'Minimum WPM', type: 'number' },
      { key: 'duration', label: 'Test Duration (minutes)', type: 'number' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'retries', label: 'Number of Retries', type: 'number' },
      { key: 'instructions', label: 'Test Instructions', type: 'textarea' }
    ]
  },
  {
    type: 'aptitude-test',
    label: 'Aptitude Test',
    icon: 'Brain',
    category: 'Tests',
    defaultConfig: {
      testType: 'healthcare_aptitude',
      duration: 90,
      passingScore: 75,
      required: true,
      allowMultipleAttempts: false
    },
    configSchema: [
      { 
        key: 'testType', 
        label: 'Test Type', 
        type: 'select', 
        options: [
          { label: 'Healthcare Aptitude', value: 'healthcare_aptitude' },
          { label: 'Clinical Reasoning', value: 'clinical_reasoning' },
          { label: 'Medical Terminology', value: 'medical_terminology' },
          { label: 'Patient Care Skills', value: 'patient_care' },
          { label: 'General Aptitude', value: 'general' }
        ]
      },
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'passingScore', label: 'Passing Score (%)', type: 'number' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'allowMultipleAttempts', label: 'Allow Multiple Attempts', type: 'checkbox' }
    ]
  },
  {
    type: 'skills-assessment',
    label: 'Skills Assessment',
    icon: 'Target',
    category: 'Tests',
    defaultConfig: {
      skillArea: 'clinical_skills',
      duration: 120,
      required: true,
      practicalComponent: true,
      evaluationType: 'competency_based'
    },
    configSchema: [
      { 
        key: 'skillArea', 
        label: 'Skill Area', 
        type: 'select',
        options: [
          { label: 'Clinical Skills', value: 'clinical_skills' },
          { label: 'Patient Communication', value: 'patient_communication' },
          { label: 'Technical Procedures', value: 'technical_procedures' },
          { label: 'Documentation Skills', value: 'documentation' },
          { label: 'Emergency Response', value: 'emergency_response' }
        ]
      },
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'practicalComponent', label: 'Practical Component', type: 'checkbox' },
      { key: 'assessmentCriteria', label: 'Assessment Criteria', type: 'textarea' }
    ]
  },

  // Review & Evaluation
  {
    type: 'application-review',
    label: 'Application Review',
    icon: 'Eye',
    category: 'Review',
    defaultConfig: {
      reviewType: 'practicum_readiness',
      reviewers: 1,
      timeframe: 3,
      autoAssign: true,
      criteriaChecklist: true
    },
    configSchema: [
      { 
        key: 'reviewType', 
        label: 'Review Type', 
        type: 'select', 
        options: [
          { label: 'Practicum Readiness', value: 'practicum_readiness' },
          { label: 'Site Compatibility', value: 'site_compatibility' },
          { label: 'Academic Preparation', value: 'academic_preparation' },
          { label: 'Clinical Prerequisites', value: 'clinical_prerequisites' }
        ]
      },
      { key: 'reviewers', label: 'Number of Reviewers', type: 'number' },
      { key: 'timeframe', label: 'Review Timeframe (days)', type: 'number' },
      { key: 'autoAssign', label: 'Auto Assign Reviewers', type: 'checkbox' },
      { key: 'criteriaChecklist', label: 'Use Criteria Checklist', type: 'checkbox' }
    ]
  },
  {
    type: 'committee-review',
    label: 'Committee Review',
    icon: 'Users2',
    category: 'Review',
    defaultConfig: {
      committeeSize: 3,
      consensusRequired: true,
      timeframe: 7,
      includesExternalReviewer: false
    },
    configSchema: [
      { key: 'committeeSize', label: 'Committee Size', type: 'number' },
      { key: 'consensusRequired', label: 'Consensus Required', type: 'checkbox' },
      { key: 'timeframe', label: 'Review Timeframe (days)', type: 'number' },
      { key: 'includesExternalReviewer', label: 'Include External Reviewer', type: 'checkbox' },
      { 
        key: 'votingMethod', 
        label: 'Voting Method', 
        type: 'select', 
        options: [
          { label: 'Majority Vote', value: 'majority' },
          { label: 'Unanimous', value: 'unanimous' },
          { label: 'Weighted Score', value: 'weighted' }
        ]
      }
    ]
  },

  // Communications & Notifications
  {
    type: 'notification',
    label: 'Notification',
    icon: 'Bell',
    category: 'Communications',
    defaultConfig: {
      notificationType: 'email',
      template: 'practicum_notification',
      autoSend: true,
      recipientType: 'student_and_site'
    },
    configSchema: [
      { 
        key: 'notificationType', 
        label: 'Notification Type', 
        type: 'select', 
        options: [
          { label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' },
          { label: 'Portal Message', value: 'portal' },
          { label: 'Phone Call', value: 'phone' }
        ]
      },
      { 
        key: 'recipientType', 
        label: 'Recipients', 
        type: 'select', 
        options: [
          { label: 'Student Only', value: 'student' },
          { label: 'Site Supervisor Only', value: 'site' },
          { label: 'Student and Site', value: 'student_and_site' },
          { label: 'All Stakeholders', value: 'all' }
        ]
      },
      { key: 'template', label: 'Template', type: 'text' },
      { key: 'autoSend', label: 'Auto Send', type: 'checkbox' },
      { key: 'customMessage', label: 'Custom Message', type: 'textarea' }
    ]
  },
  {
    type: 'reminder',
    label: 'Reminder',
    icon: 'Clock',
    category: 'Communications',
    defaultConfig: {
      reminderTime: 24,
      reminderUnit: 'hours',
      reminderType: 'email',
      escalation: false
    },
    configSchema: [
      { key: 'reminderTime', label: 'Reminder Time', type: 'number' },
      { 
        key: 'reminderUnit', 
        label: 'Time Unit', 
        type: 'select', 
        options: [
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' },
          { label: 'Weeks', value: 'weeks' }
        ]
      },
      { 
        key: 'reminderType', 
        label: 'Reminder Type', 
        type: 'select', 
        options: [
          { label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' },
          { label: 'Push', value: 'push' },
          { label: 'Phone Call', value: 'phone' }
        ]
      },
      { key: 'escalation', label: 'Escalate if No Response', type: 'checkbox' },
      { key: 'customMessage', label: 'Custom Message', type: 'textarea' }
    ]
  },

  // Practicum-Specific Steps
  {
    type: 'site-orientation',
    label: 'Site Orientation',
    icon: 'MapPin',
    category: 'Practicum Setup',
    defaultConfig: {
      duration: 240,
      includesHandbook: true,
      requiresCompletion: true,
      orientationComponents: ['facility_tour', 'policies_review', 'safety_training']
    },
    configSchema: [
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'includesHandbook', label: 'Includes Site Handbook', type: 'checkbox' },
      { key: 'requiresCompletion', label: 'Requires Completion Certificate', type: 'checkbox' },
      { key: 'orientationNotes', label: 'Orientation Notes', type: 'textarea' }
    ]
  },
  {
    type: 'preceptor-assignment',
    label: 'Preceptor Assignment',
    icon: 'UserCheck',
    category: 'Practicum Setup',
    defaultConfig: {
      matchingCriteria: 'experience_specialty',
      requiresApproval: true,
      allowStudentPreference: false
    },
    configSchema: [
      { 
        key: 'matchingCriteria', 
        label: 'Matching Criteria', 
        type: 'select', 
        options: [
          { label: 'Experience & Specialty', value: 'experience_specialty' },
          { label: 'Availability Only', value: 'availability' },
          { label: 'Student Preference', value: 'preference' },
          { label: 'Random Assignment', value: 'random' }
        ]
      },
      { key: 'requiresApproval', label: 'Requires Academic Approval', type: 'checkbox' },
      { key: 'allowStudentPreference', label: 'Allow Student Preference', type: 'checkbox' },
      { key: 'specialRequirements', label: 'Special Requirements', type: 'textarea' }
    ]
  },
  {
    type: 'learning-objectives',
    label: 'Learning Objectives',
    icon: 'Target',
    category: 'Academic',
    defaultConfig: {
      objectiveType: 'clinical_competency',
      requiresApproval: true,
      trackingMethod: 'weekly_checkin'
    },
    configSchema: [
      { 
        key: 'objectiveType', 
        label: 'Objective Type', 
        type: 'select', 
        options: [
          { label: 'Clinical Competency', value: 'clinical_competency' },
          { label: 'Professional Development', value: 'professional_development' },
          { label: 'Skill Acquisition', value: 'skill_acquisition' },
          { label: 'Knowledge Application', value: 'knowledge_application' }
        ]
      },
      { key: 'requiresApproval', label: 'Requires Preceptor Approval', type: 'checkbox' },
      { 
        key: 'trackingMethod', 
        label: 'Progress Tracking', 
        type: 'select', 
        options: [
          { label: 'Weekly Check-in', value: 'weekly_checkin' },
          { label: 'Milestone Based', value: 'milestone' },
          { label: 'Continuous Assessment', value: 'continuous' }
        ]
      },
      { key: 'objectives', label: 'Learning Objectives', type: 'textarea' }
    ]
  }
];

export const journeyElementTypes: ElementTypeConfig[] = [
  // Interview Steps
  {
    type: 'phone-interview',
    label: 'Phone Interview',
    icon: 'Phone',
    category: 'Interviews',
    defaultConfig: {
      duration: 30,
      instructions: 'Phone interview instructions...',
      required: true,
      schedulingRequired: true
    },
    configSchema: [
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'instructions', label: 'Instructions', type: 'textarea' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'schedulingRequired', label: 'Requires Scheduling', type: 'checkbox' },
      { key: 'interviewerRole', label: 'Interviewer Role', type: 'text' }
    ]
  },
  {
    type: 'video-interview',
    label: 'Video Interview',
    icon: 'Video',
    category: 'Interviews',
    defaultConfig: {
      duration: 45,
      platform: 'zoom',
      instructions: 'Video interview instructions...',
      required: true,
      schedulingRequired: true
    },
    configSchema: [
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'platform', label: 'Platform', type: 'select', options: [
        { label: 'Zoom', value: 'zoom' },
        { label: 'Teams', value: 'teams' },
        { label: 'Google Meet', value: 'meet' }
      ]},
      { key: 'instructions', label: 'Instructions', type: 'textarea' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'schedulingRequired', label: 'Requires Scheduling', type: 'checkbox' }
    ]
  },
  {
    type: 'in-person-interview',
    label: 'In-Person Interview',
    icon: 'Users',
    category: 'Interviews',
    defaultConfig: {
      duration: 60,
      location: 'Main Campus',
      instructions: 'In-person interview instructions...',
      required: true,
      schedulingRequired: true
    },
    configSchema: [
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'instructions', label: 'Instructions', type: 'textarea' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'schedulingRequired', label: 'Requires Scheduling', type: 'checkbox' }
    ]
  },

  // Requirements & Documents
  {
    type: 'document-upload',
    label: 'Document Upload',
    icon: 'FileText',
    category: 'Requirements',
    defaultConfig: {
      documentType: 'transcript',
      required: true,
      acceptedFormats: ['.pdf', '.doc', '.docx'],
      maxFileSize: 10
    },
    configSchema: [
      { key: 'documentType', label: 'Document Type', type: 'select', options: [
        { label: 'Transcript', value: 'transcript' },
        { label: 'Resume/CV', value: 'resume' },
        { label: 'ID Document', value: 'id' },
        { label: 'Portfolio', value: 'portfolio' },
        { label: 'Letter of Recommendation', value: 'recommendation' }
      ]},
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'instructions', label: 'Upload Instructions', type: 'textarea' },
      { key: 'maxFileSize', label: 'Max File Size (MB)', type: 'number' }
    ]
  },
  {
    type: 'verification',
    label: 'Verification',
    icon: 'CheckSquare',
    category: 'Requirements',
    defaultConfig: {
      verificationType: 'identity',
      required: true,
      instructions: 'Verification instructions...'
    },
    configSchema: [
      { key: 'verificationType', label: 'Verification Type', type: 'select', options: [
        { label: 'Identity Verification', value: 'identity' },
        { label: 'Academic Records', value: 'academic' },
        { label: 'Employment History', value: 'employment' },
        { label: 'Background Check', value: 'background' }
      ]},
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'instructions', label: 'Instructions', type: 'textarea' },
      { key: 'autoVerify', label: 'Auto Verification', type: 'checkbox' }
    ]
  },

  // Tests & Assessments
  {
    type: 'typing-test',
    label: 'Typing Test',
    icon: 'Keyboard',
    category: 'Tests',
    defaultConfig: {
      minimumWPM: 40,
      duration: 5,
      required: true,
      retries: 2
    },
    configSchema: [
      { key: 'minimumWPM', label: 'Minimum WPM', type: 'number' },
      { key: 'duration', label: 'Test Duration (minutes)', type: 'number' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'retries', label: 'Number of Retries', type: 'number' },
      { key: 'instructions', label: 'Test Instructions', type: 'textarea' }
    ]
  },
  {
    type: 'aptitude-test',
    label: 'Aptitude Test',
    icon: 'Brain',
    category: 'Tests',
    defaultConfig: {
      testType: 'general',
      duration: 60,
      passingScore: 70,
      required: true
    },
    configSchema: [
      { key: 'testType', label: 'Test Type', type: 'select', options: [
        { label: 'General Aptitude', value: 'general' },
        { label: 'Numerical Reasoning', value: 'numerical' },
        { label: 'Verbal Reasoning', value: 'verbal' },
        { label: 'Logical Reasoning', value: 'logical' }
      ]},
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'passingScore', label: 'Passing Score (%)', type: 'number' },
      { key: 'required', label: 'Required', type: 'checkbox' }
    ]
  },
  {
    type: 'skills-assessment',
    label: 'Skills Assessment',
    icon: 'Target',
    category: 'Tests',
    defaultConfig: {
      skillArea: 'technical',
      duration: 90,
      required: true,
      practicalComponent: false
    },
    configSchema: [
      { key: 'skillArea', label: 'Skill Area', type: 'text' },
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'practicalComponent', label: 'Practical Component', type: 'checkbox' },
      { key: 'assessmentCriteria', label: 'Assessment Criteria', type: 'textarea' }
    ]
  },

  // Review & Decision
  {
    type: 'application-review',
    label: 'Application Review',
    icon: 'Eye',
    category: 'Review',
    defaultConfig: {
      reviewType: 'academic',
      reviewers: 1,
      timeframe: 3,
      autoAssign: true
    },
    configSchema: [
      { key: 'reviewType', label: 'Review Type', type: 'select', options: [
        { label: 'Academic Review', value: 'academic' },
        { label: 'Holistic Review', value: 'holistic' },
        { label: 'Technical Review', value: 'technical' },
        { label: 'Administrative Review', value: 'administrative' }
      ]},
      { key: 'reviewers', label: 'Number of Reviewers', type: 'number' },
      { key: 'timeframe', label: 'Review Timeframe (days)', type: 'number' },
      { key: 'autoAssign', label: 'Auto Assign Reviewers', type: 'checkbox' }
    ]
  },
  {
    type: 'committee-review',
    label: 'Committee Review',
    icon: 'Users',
    category: 'Review',
    defaultConfig: {
      committeeSize: 3,
      consensusRequired: true,
      timeframe: 7
    },
    configSchema: [
      { key: 'committeeSize', label: 'Committee Size', type: 'number' },
      { key: 'consensusRequired', label: 'Consensus Required', type: 'checkbox' },
      { key: 'timeframe', label: 'Review Timeframe (days)', type: 'number' },
      { key: 'votingMethod', label: 'Voting Method', type: 'select', options: [
        { label: 'Majority Vote', value: 'majority' },
        { label: 'Unanimous', value: 'unanimous' },
        { label: 'Weighted Score', value: 'weighted' }
      ]}
    ]
  },

  // Communications
  {
    type: 'notification',
    label: 'Notification',
    icon: 'Bell',
    category: 'Communications',
    defaultConfig: {
      notificationType: 'email',
      template: 'default',
      autoSend: true
    },
    configSchema: [
      { key: 'notificationType', label: 'Notification Type', type: 'select', options: [
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
        { label: 'Push Notification', value: 'push' },
        { label: 'Portal Message', value: 'portal' }
      ]},
      { key: 'template', label: 'Template', type: 'text' },
      { key: 'autoSend', label: 'Auto Send', type: 'checkbox' },
      { key: 'customMessage', label: 'Custom Message', type: 'textarea' }
    ]
  },
  {
    type: 'reminder',
    label: 'Reminder',
    icon: 'Clock',
    category: 'Communications',
    defaultConfig: {
      reminderTime: 24,
      reminderUnit: 'hours',
      reminderType: 'email'
    },
    configSchema: [
      { key: 'reminderTime', label: 'Reminder Time', type: 'number' },
      { key: 'reminderUnit', label: 'Time Unit', type: 'select', options: [
        { label: 'Hours', value: 'hours' },
        { label: 'Days', value: 'days' }
      ]},
      { key: 'reminderType', label: 'Reminder Type', type: 'select', options: [
        { label: 'Email', value: 'email' },
        { label: 'SMS', value: 'sms' },
        { label: 'Push', value: 'push' }
      ]},
      { key: 'customMessage', label: 'Custom Message', type: 'textarea' }
    ]
  }
];

export function getElementTypesForBuilder(builderType: string): ElementTypeConfig[] {
  switch (builderType) {
    case 'form':
      return formElementTypes;
    case 'workflow':
      return workflowElementTypes;
    case 'campaign':
      return campaignElementTypes;
    case 'journey':
      return journeyElementTypes;
    case 'practicum':
      return practicumElementTypes;
    default:
      return [];
  }
}