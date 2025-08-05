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
    label: 'Trigger',
    icon: 'Zap',
    category: 'Automation',
    defaultConfig: {
      triggerType: 'form_submission',
      conditions: [],
    },
    configSchema: [
      { 
        key: 'triggerType', 
        label: 'Trigger Type', 
        type: 'select',
        required: true,
        options: [
          { label: 'Form Submission', value: 'form_submission' },
          { label: 'Lead Created', value: 'lead_created' },
          { label: 'Email Opened', value: 'email_opened' },
          { label: 'Time Based', value: 'time_based' },
        ]
      },
      { key: 'conditions', label: 'Conditions', type: 'array' },
    ],
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: 'GitBranch',
    category: 'Logic',
    defaultConfig: {
      field: '',
      operator: 'equals',
      value: '',
    },
    configSchema: [
      { key: 'field', label: 'Field', type: 'text', required: true },
      { 
        key: 'operator', 
        label: 'Operator', 
        type: 'select',
        required: true,
        options: [
          { label: 'Equals', value: 'equals' },
          { label: 'Not Equals', value: 'not_equals' },
          { label: 'Contains', value: 'contains' },
          { label: 'Greater Than', value: 'greater_than' },
          { label: 'Less Than', value: 'less_than' },
        ]
      },
      { key: 'value', label: 'Value', type: 'text', required: true },
    ],
  },
  {
    type: 'action',
    label: 'Action',
    icon: 'Play',
    category: 'Actions',
    defaultConfig: {
      actionType: 'send_email',
      config: {},
    },
    configSchema: [
      { 
        key: 'actionType', 
        label: 'Action Type', 
        type: 'select',
        required: true,
        options: [
          { label: 'Send Email', value: 'send_email' },
          { label: 'Create Task', value: 'create_task' },
          { label: 'Update Lead', value: 'update_lead' },
          { label: 'Assign Advisor', value: 'assign_advisor' },
        ]
      },
      { key: 'config', label: 'Configuration', type: 'textarea' },
    ],
  },
  {
    type: 'delay',
    label: 'Wait/Delay',
    icon: 'Clock',
    category: 'Timing',
    defaultConfig: {
      delay: { value: 1, unit: 'hours' },
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
];

export const campaignElementTypes: ElementTypeConfig[] = [
  {
    type: 'email',
    label: 'Email Step',
    icon: 'Mail',
    category: 'Communication',
    defaultConfig: {
      subject: 'Email Subject',
      content: 'Email content goes here...',
      template: '',
    },
    configSchema: [
      { key: 'subject', label: 'Subject Line', type: 'text', required: true },
      { key: 'content', label: 'Email Content', type: 'textarea', required: true },
      { key: 'template', label: 'Template', type: 'select' },
    ],
  },
  {
    type: 'sms',
    label: 'SMS Step',
    icon: 'MessageSquare',
    category: 'Communication',
    defaultConfig: {
      content: 'SMS message content...',
    },
    configSchema: [
      { key: 'content', label: 'SMS Content', type: 'textarea', required: true },
    ],
  },
  {
    type: 'wait',
    label: 'Wait Step',
    icon: 'Timer',
    category: 'Timing',
    defaultConfig: {
      waitTime: { value: 1, unit: 'days' },
    },
    configSchema: [
      { key: 'waitTime.value', label: 'Wait Time', type: 'number', required: true },
      { 
        key: 'waitTime.unit', 
        label: 'Time Unit', 
        type: 'select',
        required: true,
        options: [
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' },
          { label: 'Weeks', value: 'weeks' },
        ]
      },
    ],
  },
  {
    type: 'condition',
    label: 'Condition Step',
    icon: 'GitBranch',
    category: 'Logic',
    defaultConfig: {
      field: '',
      operator: 'equals',
      value: '',
    },
    configSchema: [
      { key: 'field', label: 'Field', type: 'text', required: true },
      { 
        key: 'operator', 
        label: 'Operator', 
        type: 'select',
        required: true,
        options: [
          { label: 'Equals', value: 'equals' },
          { label: 'Not Equals', value: 'not_equals' },
          { label: 'Contains', value: 'contains' },
        ]
      },
      { key: 'value', label: 'Value', type: 'text', required: true },
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