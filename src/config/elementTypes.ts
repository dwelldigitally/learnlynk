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

// Workflow Element Types - Enhanced with comprehensive actions
export const workflowElementTypes: ElementTypeConfig[] = [
  // TRIGGERS
  {
    type: 'trigger',
    label: 'Trigger',
    icon: 'Play',
    category: 'Triggers',
    defaultConfig: {
      triggerEvent: 'manual',
      conditionGroups: [],
      evaluationMode: 'OR',
      schedule: { type: 'once', dateTime: null, recurring: null }
    },
    configSchema: [
      {
        key: 'triggerEvent',
        label: 'Trigger Event',
        type: 'select',
        options: [
          { label: 'Manual Trigger', value: 'manual' },
          { label: 'Scheduled Time', value: 'scheduled' },
          { label: 'Form Submitted', value: 'form_submitted' },
          { label: 'Status Changed', value: 'status_changed' },
          { label: 'Lead Score Threshold', value: 'score_threshold' },
          { label: 'Tag Added', value: 'tag_added' },
          { label: 'Date Reached', value: 'date_reached' },
          { label: 'Webhook Received', value: 'webhook' },
          { label: 'Field Value Changed', value: 'field_changed' },
          { label: 'Document Uploaded', value: 'document_uploaded' }
        ]
      },
      {
        key: 'conditionGroups',
        label: 'Conditions',
        type: 'array',
        helpText: 'Define when this trigger should activate'
      }
    ]
  },
  
  // COMMUNICATION ACTIONS
  {
    type: 'email',
    label: 'Send Email',
    icon: 'Mail',
    category: 'Communication',
    defaultConfig: {
      fromName: 'Your Organization',
      fromEmail: 'noreply@example.com',
      replyTo: '',
      subject: 'Email Subject',
      preheader: '',
      content: '<p>Start writing your email content here...</p>',
      trackOpens: true,
      trackClicks: true
    },
    configSchema: [
      { key: 'fromName', label: 'From Name', type: 'text', placeholder: 'Your Organization' },
      { key: 'fromEmail', label: 'From Email', type: 'text', placeholder: 'noreply@example.com' },
      { key: 'replyTo', label: 'Reply-To Email', type: 'text', placeholder: 'Optional reply-to address' },
      { key: 'subject', label: 'Subject Line', type: 'text', placeholder: 'Compelling subject line' },
      { key: 'preheader', label: 'Preheader Text', type: 'text', placeholder: 'Preview text shown in inbox' },
      { key: 'content', label: 'Email Content', type: 'richtext' },
      { key: 'trackOpens', label: 'Track Email Opens', type: 'checkbox' },
      { key: 'trackClicks', label: 'Track Link Clicks', type: 'checkbox' }
    ]
  },
  {
    type: 'sms',
    label: 'Send SMS',
    icon: 'MessageSquare',
    category: 'Communication',
    defaultConfig: {
      content: 'Hi {{firstName}}, this is your message...'
    },
    configSchema: [
      { key: 'content', label: 'Message Content', type: 'sms', placeholder: 'Write your SMS message (160 chars = 1 SMS)' }
    ]
  },
  {
    type: 'whatsapp',
    label: 'Send WhatsApp',
    icon: 'MessageCircle',
    category: 'Communication',
    defaultConfig: {
      content: 'Hi {{firstName}}, '
    },
    configSchema: [
      { key: 'content', label: 'Message Content', type: 'textarea', placeholder: 'WhatsApp message content' }
    ]
  },
  {
    type: 'internal-notification',
    label: 'Internal Notification',
    icon: 'Bell',
    category: 'Communication',
    defaultConfig: {
      notifyType: 'email',
      recipients: [],
      subject: 'Workflow Notification',
      message: ''
    },
    configSchema: [
      {
        key: 'notifyType',
        label: 'Notification Type',
        type: 'select',
        options: [
          { label: 'Email', value: 'email' },
          { label: 'In-App', value: 'in_app' },
          { label: 'Both', value: 'both' }
        ]
      },
      { key: 'recipients', label: 'Recipients (comma-separated emails)', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },

  // LEAD MANAGEMENT ACTIONS
  {
    type: 'update-lead',
    label: 'Update Lead',
    icon: 'UserCog',
    category: 'Lead Management',
    defaultConfig: {
      updateType: 'status',
      newStatus: '',
      tags: [],
      customFields: {}
    },
    configSchema: [
      {
        key: 'updateType',
        label: 'Update Type',
        type: 'select',
        options: [
          { label: 'Change Status', value: 'status' },
          { label: 'Add Tags', value: 'add_tags' },
          { label: 'Remove Tags', value: 'remove_tags' },
          { label: 'Update Custom Fields', value: 'custom_fields' },
          { label: 'Update Lead Score', value: 'score' }
        ]
      },
      { key: 'newStatus', label: 'New Status', type: 'text', placeholder: 'e.g., Qualified' },
      { key: 'tags', label: 'Tags (comma-separated)', type: 'text', placeholder: 'e.g., hot-lead, contacted' },
      { key: 'scoreChange', label: 'Score Change', type: 'number', placeholder: '+10 or -5' }
    ]
  },
  {
    type: 'assign-advisor',
    label: 'Assign to Advisor',
    icon: 'UserCheck',
    category: 'Lead Management',
    defaultConfig: {
      assignmentMethod: 'round_robin',
      specificAdvisorId: '',
      teamId: ''
    },
    configSchema: [
      {
        key: 'assignmentMethod',
        label: 'Assignment Method',
        type: 'select',
        options: [
          { label: 'Round Robin', value: 'round_robin' },
          { label: 'Specific Advisor', value: 'specific' },
          { label: 'Load Balanced', value: 'load_balanced' },
          { label: 'Team Assignment', value: 'team' }
        ]
      },
      { key: 'specificAdvisorId', label: 'Advisor ID', type: 'text', placeholder: 'Enter advisor ID' },
      { key: 'teamId', label: 'Team ID', type: 'text', placeholder: 'Enter team ID' }
    ]
  },
  {
    type: 'change-enrollment-stage',
    label: 'Change Enrollment Stage',
    icon: 'Milestone',
    category: 'Lead Management',
    defaultConfig: {
      newStage: ''
    },
    configSchema: [
      {
        key: 'newStage',
        label: 'New Stage',
        type: 'select',
        options: [
          { label: 'Inquiry', value: 'inquiry' },
          { label: 'Application', value: 'application' },
          { label: 'Admitted', value: 'admitted' },
          { label: 'Enrolled', value: 'enrolled' }
        ]
      }
    ]
  },

  // TASK & CALENDAR ACTIONS
  {
    type: 'create-task',
    label: 'Create Task',
    icon: 'CheckSquare',
    category: 'Tasks & Calendar',
    defaultConfig: {
      taskTitle: '',
      taskDescription: '',
      assignToAdvisor: true,
      dueInDays: 1,
      priority: 'medium'
    },
    configSchema: [
      { key: 'taskTitle', label: 'Task Title', type: 'text', placeholder: 'e.g., Follow up with lead' },
      { key: 'taskDescription', label: 'Task Description', type: 'textarea' },
      { key: 'assignToAdvisor', label: 'Assign to Lead\'s Advisor', type: 'checkbox' },
      { key: 'dueInDays', label: 'Due In (days)', type: 'number' },
      {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' }
        ]
      }
    ]
  },
  {
    type: 'create-calendar-event',
    label: 'Create Calendar Event',
    icon: 'Calendar',
    category: 'Tasks & Calendar',
    defaultConfig: {
      eventTitle: '',
      eventDescription: '',
      duration: 30,
      attendees: []
    },
    configSchema: [
      { key: 'eventTitle', label: 'Event Title', type: 'text' },
      { key: 'eventDescription', label: 'Description', type: 'textarea' },
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'attendees', label: 'Attendees (comma-separated)', type: 'text' }
    ]
  },
  {
    type: 'schedule-followup',
    label: 'Schedule Follow-up',
    icon: 'CalendarClock',
    category: 'Tasks & Calendar',
    defaultConfig: {
      followupType: 'call',
      daysUntil: 3,
      notes: ''
    },
    configSchema: [
      {
        key: 'followupType',
        label: 'Follow-up Type',
        type: 'select',
        options: [
          { label: 'Phone Call', value: 'call' },
          { label: 'Email', value: 'email' },
          { label: 'Meeting', value: 'meeting' }
        ]
      },
      { key: 'daysUntil', label: 'Days Until Follow-up', type: 'number' },
      { key: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },

  // FLOW CONTROL
  {
    type: 'condition',
    label: 'If/Else Branch',
    icon: 'GitBranch',
    category: 'Flow Control',
    defaultConfig: {
      conditionGroups: []
    },
    configSchema: [
      {
        key: 'conditionGroups',
        label: 'Branch Conditions',
        type: 'array',
        helpText: 'Define conditions for branching'
      }
    ]
  },
  {
    type: 'wait',
    label: 'Wait/Delay',
    icon: 'Clock',
    category: 'Flow Control',
    defaultConfig: {
      waitTime: { value: 1, unit: 'days' },
      waitUntil: null
    },
    configSchema: [
      { key: 'waitTime.value', label: 'Wait Time', type: 'number' },
      {
        key: 'waitTime.unit',
        label: 'Time Unit',
        type: 'select',
        options: [
          { label: 'Minutes', value: 'minutes' },
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' },
          { label: 'Weeks', value: 'weeks' }
        ]
      }
    ]
  },
  {
    type: 'split',
    label: 'A/B Split Test',
    icon: 'Split',
    category: 'Flow Control',
    defaultConfig: {
      splitPercentage: 50,
      variantAName: 'Variant A',
      variantBName: 'Variant B'
    },
    configSchema: [
      { key: 'splitPercentage', label: 'Variant A Percentage', type: 'number', placeholder: '0-100' },
      { key: 'variantAName', label: 'Variant A Name', type: 'text' },
      { key: 'variantBName', label: 'Variant B Name', type: 'text' }
    ]
  },
  {
    type: 'go-to-workflow',
    label: 'Go to Another Workflow',
    icon: 'ArrowRightCircle',
    category: 'Flow Control',
    defaultConfig: {
      targetWorkflowId: '',
      removeFromCurrent: false
    },
    configSchema: [
      { key: 'targetWorkflowId', label: 'Target Workflow ID', type: 'text' },
      { key: 'removeFromCurrent', label: 'Remove from Current Workflow', type: 'checkbox' }
    ]
  },
  {
    type: 'end-workflow',
    label: 'End Workflow',
    icon: 'StopCircle',
    category: 'Flow Control',
    defaultConfig: {
      reason: 'completed'
    },
    configSchema: [
      {
        key: 'reason',
        label: 'End Reason',
        type: 'select',
        options: [
          { label: 'Completed Successfully', value: 'completed' },
          { label: 'Goal Achieved', value: 'goal_achieved' },
          { label: 'Unsubscribed', value: 'unsubscribed' },
          { label: 'Disqualified', value: 'disqualified' }
        ]
      }
    ]
  },

  // DATA ACTIONS
  {
    type: 'update-database',
    label: 'Update Database Record',
    icon: 'Database',
    category: 'Data Actions',
    defaultConfig: {
      table: '',
      recordId: '',
      fields: {}
    },
    configSchema: [
      { key: 'table', label: 'Table Name', type: 'text' },
      { key: 'recordId', label: 'Record ID', type: 'text', placeholder: 'Use {{leadId}} for current lead' },
      { key: 'fields', label: 'Fields to Update (JSON)', type: 'textarea', placeholder: '{"field": "value"}' }
    ]
  },
  {
    type: 'create-database-record',
    label: 'Create Database Record',
    icon: 'DatabaseZap',
    category: 'Data Actions',
    defaultConfig: {
      table: '',
      fields: {}
    },
    configSchema: [
      { key: 'table', label: 'Table Name', type: 'text' },
      { key: 'fields', label: 'Fields (JSON)', type: 'textarea', placeholder: '{"field": "value"}' }
    ]
  },
  {
    type: 'api-webhook',
    label: 'API Call / Webhook',
    icon: 'Webhook',
    category: 'Data Actions',
    defaultConfig: {
      url: '',
      method: 'POST',
      headers: {},
      body: {}
    },
    configSchema: [
      { key: 'url', label: 'Webhook URL', type: 'text', placeholder: 'https://...' },
      {
        key: 'method',
        label: 'HTTP Method',
        type: 'select',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'PATCH', value: 'PATCH' }
        ]
      },
      { key: 'headers', label: 'Headers (JSON)', type: 'textarea', placeholder: '{"Content-Type": "application/json"}' },
      { key: 'body', label: 'Request Body (JSON)', type: 'textarea' }
    ]
  },
  {
    type: 'log-activity',
    label: 'Log Activity',
    icon: 'FileText',
    category: 'Data Actions',
    defaultConfig: {
      activityType: 'note',
      content: ''
    },
    configSchema: [
      {
        key: 'activityType',
        label: 'Activity Type',
        type: 'select',
        options: [
          { label: 'Note', value: 'note' },
          { label: 'Call Log', value: 'call' },
          { label: 'Meeting', value: 'meeting' },
          { label: 'Custom', value: 'custom' }
        ]
      },
      { key: 'content', label: 'Activity Content', type: 'textarea' }
    ]
  },

  // ADVANCED ACTIONS
  {
    type: 'goal-tracking',
    label: 'Track Goal',
    icon: 'Target',
    category: 'Advanced',
    defaultConfig: {
      goalName: '',
      goalType: 'conversion',
      goalValue: 0
    },
    configSchema: [
      { key: 'goalName', label: 'Goal Name', type: 'text', placeholder: 'e.g., Application Submitted' },
      {
        key: 'goalType',
        label: 'Goal Type',
        type: 'select',
        options: [
          { label: 'Conversion', value: 'conversion' },
          { label: 'Engagement', value: 'engagement' },
          { label: 'Revenue', value: 'revenue' }
        ]
      },
      { key: 'goalValue', label: 'Goal Value', type: 'number', placeholder: 'Optional numeric value' }
    ]
  },
  {
    type: 'score-lead',
    label: 'Score Lead',
    icon: 'TrendingUp',
    category: 'Advanced',
    defaultConfig: {
      scoreChange: 0,
      reason: ''
    },
    configSchema: [
      { key: 'scoreChange', label: 'Score Change', type: 'number', placeholder: '+10 or -5' },
      { key: 'reason', label: 'Reason', type: 'text', placeholder: 'Why is the score changing?' }
    ]
  },
  {
    type: 'remove-from-workflow',
    label: 'Remove from Workflow',
    icon: 'LogOut',
    category: 'Advanced',
    defaultConfig: {
      reason: 'completed'
    },
    configSchema: [
      {
        key: 'reason',
        label: 'Removal Reason',
        type: 'select',
        options: [
          { label: 'Completed', value: 'completed' },
          { label: 'Unsubscribed', value: 'unsubscribed' },
          { label: 'Converted', value: 'converted' },
          { label: 'Disqualified', value: 'disqualified' }
        ]
      }
    ]
  }
];

// Campaign Element Types
export const campaignElementTypes: ElementTypeConfig[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    icon: 'Play',
    category: 'Flow Control',
    defaultConfig: {
      triggerEvent: 'property_changed',
      conditionGroups: [],
      evaluationMode: 'OR'
    },
    configSchema: [
      {
        key: 'triggerEvent',
        label: 'Trigger Event',
        type: 'select',
        options: [
          { label: 'Form Submitted', value: 'form_submitted' },
          { label: 'Status Changed', value: 'status_changed' },
          { label: 'Tag Added', value: 'tag_added' },
          { label: 'Date Reached', value: 'date_reached' },
          { label: 'Property Changed', value: 'property_changed' },
          { label: 'Manual Trigger', value: 'manual' }
        ]
      },
      {
        key: 'conditionGroups',
        label: 'Conditions',
        type: 'array',
        helpText: 'Define when this trigger should activate'
      }
    ]
  },
  {
    type: 'email',
    label: 'Email',
    icon: 'Mail',
    category: 'Communication',
    defaultConfig: {
      fromName: 'Your Organization',
      fromEmail: 'noreply@example.com',
      replyTo: '',
      subject: 'Email Subject',
      preheader: '',
      content: '<p>Start writing your email content here...</p>',
      trackOpens: true,
      trackClicks: true
    },
    configSchema: [
      { key: 'fromName', label: 'From Name', type: 'text', placeholder: 'Your Organization' },
      { key: 'fromEmail', label: 'From Email', type: 'text', placeholder: 'noreply@example.com' },
      { key: 'replyTo', label: 'Reply-To Email', type: 'text', placeholder: 'Optional reply-to address' },
      { key: 'subject', label: 'Subject Line', type: 'text', placeholder: 'Compelling subject line' },
      { key: 'preheader', label: 'Preheader Text', type: 'text', placeholder: 'Preview text shown in inbox (50-100 chars)' },
      { key: 'content', label: 'Email Content', type: 'richtext' },
      { key: 'trackOpens', label: 'Track Email Opens', type: 'checkbox' },
      { key: 'trackClicks', label: 'Track Link Clicks', type: 'checkbox' }
    ]
  },
  {
    type: 'sms',
    label: 'SMS',
    icon: 'MessageSquare',
    category: 'Communication',
    defaultConfig: {
      content: 'Hi {{firstName}}, this is your message...'
    },
    configSchema: [
      { key: 'content', label: 'Message Content', type: 'sms', placeholder: 'Write your SMS message (160 chars = 1 SMS)' }
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
  },
  {
    type: 'update-lead',
    label: 'Update Lead',
    icon: 'UserCog',
    category: 'Lead Management',
    defaultConfig: {
      updateType: 'status',
      newStatus: '',
      tags: [],
      customFields: {}
    },
    configSchema: [
      {
        key: 'updateType',
        label: 'Update Type',
        type: 'select',
        options: [
          { label: 'Change Status', value: 'status' },
          { label: 'Add Tags', value: 'add_tags' },
          { label: 'Remove Tags', value: 'remove_tags' },
          { label: 'Update Custom Fields', value: 'custom_fields' }
        ]
      },
      { key: 'newStatus', label: 'New Status', type: 'text', placeholder: 'e.g., Qualified' },
      { key: 'tags', label: 'Tags (comma-separated)', type: 'text', placeholder: 'e.g., hot-lead, contacted' }
    ]
  },
  {
    type: 'assign-advisor',
    label: 'Assign to Advisor',
    icon: 'UserCheck',
    category: 'Lead Management',
    defaultConfig: {
      assignmentMethod: 'round_robin',
      specificAdvisorId: '',
      teamId: ''
    },
    configSchema: [
      {
        key: 'assignmentMethod',
        label: 'Assignment Method',
        type: 'select',
        options: [
          { label: 'Round Robin', value: 'round_robin' },
          { label: 'Specific Advisor', value: 'specific' },
          { label: 'Load Balanced', value: 'load_balanced' },
          { label: 'Team Assignment', value: 'team' }
        ]
      },
      { key: 'specificAdvisorId', label: 'Advisor ID', type: 'text', placeholder: 'Enter advisor ID' },
      { key: 'teamId', label: 'Team ID', type: 'text', placeholder: 'Enter team ID' }
    ]
  },
  {
    type: 'internal-notification',
    label: 'Internal Notification',
    icon: 'Bell',
    category: 'Communication',
    defaultConfig: {
      notifyType: 'email',
      recipients: [],
      subject: 'Campaign Notification',
      message: ''
    },
    configSchema: [
      {
        key: 'notifyType',
        label: 'Notification Type',
        type: 'select',
        options: [
          { label: 'Email', value: 'email' },
          { label: 'In-App', value: 'in_app' },
          { label: 'Both', value: 'both' }
        ]
      },
      { key: 'recipients', label: 'Recipients (comma-separated emails)', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  {
    type: 'goal-tracking',
    label: 'Goal Tracking',
    icon: 'Target',
    category: 'Analytics',
    defaultConfig: {
      goalName: '',
      goalType: 'conversion',
      goalValue: 0
    },
    configSchema: [
      { key: 'goalName', label: 'Goal Name', type: 'text', placeholder: 'e.g., Application Submitted' },
      {
        key: 'goalType',
        label: 'Goal Type',
        type: 'select',
        options: [
          { label: 'Conversion', value: 'conversion' },
          { label: 'Engagement', value: 'engagement' },
          { label: 'Revenue', value: 'revenue' }
        ]
      },
      { key: 'goalValue', label: 'Goal Value', type: 'number', placeholder: 'Optional numeric value' }
    ]
  },
  {
    type: 'remove-from-campaign',
    label: 'Remove from Campaign',
    icon: 'LogOut',
    category: 'Flow Control',
    defaultConfig: {
      reason: 'completed',
      notifyLead: false
    },
    configSchema: [
      {
        key: 'reason',
        label: 'Removal Reason',
        type: 'select',
        options: [
          { label: 'Completed', value: 'completed' },
          { label: 'Unsubscribed', value: 'unsubscribed' },
          { label: 'Converted', value: 'converted' },
          { label: 'Disqualified', value: 'disqualified' }
        ]
      },
      { key: 'notifyLead', label: 'Notify Lead', type: 'checkbox' }
    ]
  },
  {
    type: 'copy-to-campaign',
    label: 'Copy to Another Campaign',
    icon: 'Copy',
    category: 'Flow Control',
    defaultConfig: {
      targetCampaignId: '',
      removeFromCurrent: false
    },
    configSchema: [
      { key: 'targetCampaignId', label: 'Target Campaign ID', type: 'text', placeholder: 'Enter campaign ID' },
      { key: 'removeFromCurrent', label: 'Remove from Current Campaign', type: 'checkbox' }
    ]
  },
  {
    type: 'create-task',
    label: 'Create Task',
    icon: 'CheckSquare',
    category: 'Lead Management',
    defaultConfig: {
      taskTitle: '',
      taskDescription: '',
      assignToAdvisor: true,
      dueInDays: 1,
      priority: 'medium'
    },
    configSchema: [
      { key: 'taskTitle', label: 'Task Title', type: 'text', placeholder: 'e.g., Follow up with lead' },
      { key: 'taskDescription', label: 'Task Description', type: 'textarea' },
      { key: 'assignToAdvisor', label: 'Assign to Lead\'s Advisor', type: 'checkbox' },
      { key: 'dueInDays', label: 'Due In (days)', type: 'number' },
      {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' }
        ]
      }
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
  },

  // Admission & Enrollment Process
  {
    type: 'pal-allocation',
    label: 'PAL Allocation',
    icon: 'FileText',
    category: 'Admission',
    defaultConfig: {
      palType: 'study_permit',
      processingTime: 5,
      required: true,
      autoGenerate: false
    },
    configSchema: [
      { key: 'palType', label: 'PAL Type', type: 'select', options: [
        { label: 'Study Permit', value: 'study_permit' },
        { label: 'Work Permit', value: 'work_permit' },
        { label: 'Combined', value: 'combined' }
      ]},
      { key: 'processingTime', label: 'Processing Time (days)', type: 'number' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'autoGenerate', label: 'Auto Generate', type: 'checkbox' },
      { key: 'instructions', label: 'Instructions', type: 'textarea' }
    ]
  },
  {
    type: 'admission-decision',
    label: 'Admission Decision',
    icon: 'CheckCircle',
    category: 'Admission',
    defaultConfig: {
      decisionType: 'manual',
      timeframe: 7,
      requiresApproval: true,
      notifyApplicant: true
    },
    configSchema: [
      { key: 'decisionType', label: 'Decision Type', type: 'select', options: [
        { label: 'Manual Review', value: 'manual' },
        { label: 'Automated', value: 'automated' },
        { label: 'Committee Decision', value: 'committee' }
      ]},
      { key: 'timeframe', label: 'Decision Timeframe (days)', type: 'number' },
      { key: 'requiresApproval', label: 'Requires Approval', type: 'checkbox' },
      { key: 'notifyApplicant', label: 'Auto Notify Applicant', type: 'checkbox' },
      { key: 'decisionCriteria', label: 'Decision Criteria', type: 'textarea' }
    ]
  },
  {
    type: 'offer-letter',
    label: 'Offer Letter Sending',
    icon: 'Mail',
    category: 'Admission',
    defaultConfig: {
      deliveryMethod: 'email',
      includeConditions: true,
      expiryDays: 14,
      requiresSignature: true
    },
    configSchema: [
      { key: 'deliveryMethod', label: 'Delivery Method', type: 'select', options: [
        { label: 'Email', value: 'email' },
        { label: 'Portal', value: 'portal' },
        { label: 'Physical Mail', value: 'mail' },
        { label: 'Both Email & Portal', value: 'both' }
      ]},
      { key: 'includeConditions', label: 'Include Conditions', type: 'checkbox' },
      { key: 'expiryDays', label: 'Offer Expiry (days)', type: 'number' },
      { key: 'requiresSignature', label: 'Requires Signature', type: 'checkbox' },
      { key: 'templateId', label: 'Letter Template', type: 'text' }
    ]
  },
  {
    type: 'application-fee',
    label: 'Payment of Application Fee',
    icon: 'DollarSign',
    category: 'Financial',
    defaultConfig: {
      feeAmount: 100,
      currency: 'CAD',
      paymentMethods: ['card', 'bank_transfer'],
      allowInstallments: false,
      required: true
    },
    configSchema: [
      { key: 'feeAmount', label: 'Fee Amount', type: 'number' },
      { key: 'currency', label: 'Currency', type: 'select', options: [
        { label: 'CAD - Canadian Dollar', value: 'CAD' },
        { label: 'USD - US Dollar', value: 'USD' },
        { label: 'EUR - Euro', value: 'EUR' },
        { label: 'GBP - British Pound', value: 'GBP' }
      ]},
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'allowInstallments', label: 'Allow Installments', type: 'checkbox' },
      { key: 'paymentInstructions', label: 'Payment Instructions', type: 'textarea' }
    ]
  },
  {
    type: 'offer-acceptance',
    label: 'Offer Acceptance Stage',
    icon: 'CheckSquare',
    category: 'Admission',
    defaultConfig: {
      acceptanceDeadline: 14,
      requiresDeposit: true,
      depositAmount: 500,
      confirmationRequired: true
    },
    configSchema: [
      { key: 'acceptanceDeadline', label: 'Acceptance Deadline (days)', type: 'number' },
      { key: 'requiresDeposit', label: 'Requires Deposit', type: 'checkbox' },
      { key: 'depositAmount', label: 'Deposit Amount', type: 'number' },
      { key: 'confirmationRequired', label: 'Confirmation Required', type: 'checkbox' },
      { key: 'terms', label: 'Terms & Conditions', type: 'textarea' }
    ]
  },
  {
    type: 'visa-study-permit',
    label: 'Visa and Study Permit',
    icon: 'BookOpen',
    category: 'Immigration',
    defaultConfig: {
      documentType: 'study_permit',
      assistanceProvided: true,
      processingSupport: true,
      required: true
    },
    configSchema: [
      { key: 'documentType', label: 'Document Type', type: 'select', options: [
        { label: 'Study Permit', value: 'study_permit' },
        { label: 'Student Visa', value: 'student_visa' },
        { label: 'Both', value: 'both' }
      ]},
      { key: 'assistanceProvided', label: 'Provide Assistance', type: 'checkbox' },
      { key: 'processingSupport', label: 'Processing Support', type: 'checkbox' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'supportInstructions', label: 'Support Instructions', type: 'textarea' }
    ]
  },
  {
    type: 'registration',
    label: 'Registration',
    icon: 'UserCheck',
    category: 'Enrollment',
    defaultConfig: {
      registrationType: 'online',
      courseSelection: true,
      scheduleBuilding: true,
      advisorMeeting: true
    },
    configSchema: [
      { key: 'registrationType', label: 'Registration Type', type: 'select', options: [
        { label: 'Online', value: 'online' },
        { label: 'In-Person', value: 'in_person' },
        { label: 'Hybrid', value: 'hybrid' }
      ]},
      { key: 'courseSelection', label: 'Course Selection Required', type: 'checkbox' },
      { key: 'scheduleBuilding', label: 'Schedule Building', type: 'checkbox' },
      { key: 'advisorMeeting', label: 'Advisor Meeting Required', type: 'checkbox' },
      { key: 'instructions', label: 'Registration Instructions', type: 'textarea' }
    ]
  },
  {
    type: 'orientation-enrollment',
    label: 'Orientation and Enrollment Completion',
    icon: 'GraduationCap',
    category: 'Enrollment',
    defaultConfig: {
      orientationType: 'mandatory',
      duration: 4,
      includesCampusTour: true,
      welcomePackage: true,
      finalSteps: true
    },
    configSchema: [
      { key: 'orientationType', label: 'Orientation Type', type: 'select', options: [
        { label: 'Mandatory', value: 'mandatory' },
        { label: 'Optional', value: 'optional' },
        { label: 'Online Only', value: 'online' },
        { label: 'Hybrid', value: 'hybrid' }
      ]},
      { key: 'duration', label: 'Duration (hours)', type: 'number' },
      { key: 'includesCampusTour', label: 'Includes Campus Tour', type: 'checkbox' },
      { key: 'welcomePackage', label: 'Welcome Package', type: 'checkbox' },
      { key: 'finalSteps', label: 'Final Enrollment Steps', type: 'checkbox' },
      { key: 'orientationAgenda', label: 'Orientation Agenda', type: 'textarea' }
    ]
  },
  {
    type: 'enrollment-completed',
    label: 'Enrollment Completed',
    icon: 'CheckCircle2',
    category: 'Enrollment',
    defaultConfig: {
      completionStatus: 'enrolled',
      sendCompletionNotification: true,
      activateStudentPortal: true,
      issueStudentID: true,
      archiveJourney: true
    },
    configSchema: [
      { key: 'completionStatus', label: 'Completion Status', type: 'select', options: [
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'Enrolled - Conditional', value: 'enrolled_conditional' },
        { label: 'Completed', value: 'completed' }
      ]},
      { key: 'sendCompletionNotification', label: 'Send Completion Notification', type: 'checkbox' },
      { key: 'activateStudentPortal', label: 'Activate Student Portal', type: 'checkbox' },
      { key: 'issueStudentID', label: 'Issue Student ID', type: 'checkbox' },
      { key: 'archiveJourney', label: 'Archive Journey', type: 'checkbox' },
      { key: 'completionMessage', label: 'Completion Message', type: 'textarea' }
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
    default:
      return [];
  }
}