import { ElementTypeConfig } from '@/types/universalBuilder';

export const formElementTypes: ElementTypeConfig[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: 'Type',
    category: 'Basic Fields',
    defaultConfig: {
      label: 'Text Field',
      placeholder: 'Enter text...',
      required: false,
    },
    configSchema: [
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'helpText', label: 'Help Text', type: 'textarea' },
    ],
  },
  {
    type: 'email',
    label: 'Email Input',
    icon: 'Mail',
    category: 'Basic Fields',
    defaultConfig: {
      label: 'Email Address',
      placeholder: 'Enter email...',
      required: true,
    },
    configSchema: [
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'helpText', label: 'Help Text', type: 'textarea' },
    ],
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: 'ChevronDown',
    category: 'Choice Fields',
    defaultConfig: {
      label: 'Select Option',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
      required: false,
    },
    configSchema: [
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'options', label: 'Options', type: 'array' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'helpText', label: 'Help Text', type: 'textarea' },
    ],
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'CheckSquare',
    category: 'Choice Fields',
    defaultConfig: {
      label: 'Checkbox Option',
      required: false,
    },
    configSchema: [
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'helpText', label: 'Help Text', type: 'textarea' },
    ],
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: 'AlignLeft',
    category: 'Basic Fields',
    defaultConfig: {
      label: 'Long Text',
      placeholder: 'Enter detailed text...',
      rows: 4,
      required: false,
    },
    configSchema: [
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'rows', label: 'Rows', type: 'number' },
      { key: 'required', label: 'Required', type: 'checkbox' },
      { key: 'helpText', label: 'Help Text', type: 'textarea' },
    ],
  },
];

export const workflowElementTypes: ElementTypeConfig[] = [
  {
    type: 'trigger',
    label: 'Task is completed',
    icon: 'Zap',
    category: 'Triggers',
    defaultConfig: {
      triggerType: 'task_completed',
      conditions: [],
    },
    configSchema: [
      { 
        key: 'triggerType', 
        label: 'Trigger Type', 
        type: 'select',
        required: true,
        options: [
          { label: 'Task is completed', value: 'task_completed' },
          { label: 'Lead Created', value: 'lead_created' },
          { label: 'Email Opened', value: 'email_opened' },
          { label: 'Form Submitted', value: 'form_submitted' },
        ]
      },
    ],
  },
  {
    type: 'send_email',
    label: 'Send an email',
    icon: 'Mail',
    category: 'Sending Options',
    defaultConfig: {
      subject: 'Hello',
      content: 'Email content goes here...',
      isDraft: true,
    },
    configSchema: [
      { key: 'subject', label: 'Subject Line', type: 'text', required: true },
      { key: 'content', label: 'Email Content', type: 'textarea', required: true },
      { key: 'isDraft', label: 'Currently a draft', type: 'checkbox' },
    ],
  },
  {
    type: 'send_site_message',
    label: 'Send a site message',
    icon: 'MessageSquare',
    category: 'Sending Options',
    defaultConfig: {
      message: 'Site message content...',
    },
    configSchema: [
      { key: 'message', label: 'Message Content', type: 'textarea', required: true },
    ],
  },
  {
    type: 'send_sms',
    label: 'Send an SMS',
    icon: 'Phone',
    category: 'Sending Options',
    defaultConfig: {
      content: 'SMS message content...',
    },
    configSchema: [
      { key: 'content', label: 'SMS Content', type: 'textarea', required: true },
    ],
  },
  {
    type: 'wait',
    label: 'Wait for 7 days',
    icon: 'Clock',
    category: 'Conditions and Workflow',
    defaultConfig: {
      delay: { value: 7, unit: 'days' },
    },
    configSchema: [
      { key: 'delay.value', label: 'Wait Time', type: 'number', required: true },
      { 
        key: 'delay.unit', 
        label: 'Time Unit', 
        type: 'select',
        required: true,
        options: [
          { label: 'Minutes', value: 'minutes' },
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' },
          { label: 'Weeks', value: 'weeks' },
        ]
      },
    ],
  },
  {
    type: 'wait_and_check',
    label: 'Wait for 7 days and check if the email was opened',
    icon: 'Eye',
    category: 'Conditions and Workflow',
    defaultConfig: {
      delay: { value: 7, unit: 'days' },
      condition: 'email_opened',
    },
    configSchema: [
      { key: 'delay.value', label: 'Wait Time', type: 'number', required: true },
      { 
        key: 'delay.unit', 
        label: 'Time Unit', 
        type: 'select',
        options: [
          { label: 'Days', value: 'days' },
          { label: 'Hours', value: 'hours' },
        ]
      },
      { key: 'condition', label: 'Check Condition', type: 'text' },
    ],
  },
  {
    type: 'wait_and_send',
    label: 'Wait for 7 days and send email',
    icon: 'Send',
    category: 'Conditions and Workflow',
    defaultConfig: {
      delay: { value: 7, unit: 'days' },
      subject: 'Follow up email',
      content: 'Follow up content...',
    },
    configSchema: [
      { key: 'delay.value', label: 'Wait Time', type: 'number', required: true },
      { key: 'subject', label: 'Email Subject', type: 'text' },
      { key: 'content', label: 'Email Content', type: 'textarea' },
    ],
  },
];

export const campaignElementTypes: ElementTypeConfig[] = [
  {
    type: 'email_campaign',
    label: 'Send email campaign',
    icon: 'Mail',
    category: 'Communication',
    defaultConfig: {
      subject: 'Campaign Email',
      content: 'Campaign email content...',
      audience: 'all_leads',
    },
    configSchema: [
      { key: 'subject', label: 'Subject Line', type: 'text', required: true },
      { key: 'content', label: 'Email Content', type: 'textarea', required: true },
      { 
        key: 'audience', 
        label: 'Target Audience', 
        type: 'select',
        options: [
          { label: 'All Leads', value: 'all_leads' },
          { label: 'Active Leads', value: 'active_leads' },
          { label: 'Cold Leads', value: 'cold_leads' },
        ]
      },
    ],
  },
  {
    type: 'sms_campaign',
    label: 'Send SMS campaign',
    icon: 'MessageSquare',
    category: 'Communication',
    defaultConfig: {
      content: 'SMS campaign message...',
      audience: 'all_leads',
    },
    configSchema: [
      { key: 'content', label: 'SMS Content', type: 'textarea', required: true },
      { 
        key: 'audience', 
        label: 'Target Audience', 
        type: 'select',
        options: [
          { label: 'All Leads', value: 'all_leads' },
          { label: 'Active Leads', value: 'active_leads' },
        ]
      },
    ],
  },
  {
    type: 'audience_filter',
    label: 'Filter audience',
    icon: 'Filter',
    category: 'Targeting',
    defaultConfig: {
      filterType: 'location',
      filterValue: '',
    },
    configSchema: [
      { 
        key: 'filterType', 
        label: 'Filter Type', 
        type: 'select',
        options: [
          { label: 'Location', value: 'location' },
          { label: 'Interest', value: 'interest' },
          { label: 'Lead Score', value: 'lead_score' },
        ]
      },
      { key: 'filterValue', label: 'Filter Value', type: 'text', required: true },
    ],
  },
  {
    type: 'ab_test',
    label: 'A/B Test',
    icon: 'TestTube',
    category: 'Testing',
    defaultConfig: {
      testName: 'Subject Line Test',
      variantA: 'Version A',
      variantB: 'Version B',
    },
    configSchema: [
      { key: 'testName', label: 'Test Name', type: 'text', required: true },
      { key: 'variantA', label: 'Variant A', type: 'text', required: true },
      { key: 'variantB', label: 'Variant B', type: 'text', required: true },
    ],
  },
];

export function getElementTypesForBuilder(builderType: string): ElementTypeConfig[] {
  switch (builderType) {
    case 'form':
      return formElementTypes;
    case 'workflow':
      return workflowElementTypes;
    case 'campaign':
      return campaignElementTypes;
    default:
      return [];
  }
}