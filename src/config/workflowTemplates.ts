export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'onboarding' | 'follow-up' | 'conversion' | 'retention' | 'payment' | 'engagement';
  icon: string;
  steps: WorkflowTemplateStep[];
  triggerType: string;
  triggerConditions: any[];
  estimatedDuration: string;
  popularity: number;
}

export interface WorkflowTemplateStep {
  type: string;
  title: string;
  description?: string;
  config: Record<string, any>;
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'welcome-sequence',
    name: 'Welcome & Onboarding',
    description: 'Automated welcome email series for new leads with program information and next steps',
    category: 'onboarding',
    icon: 'Sparkles',
    estimatedDuration: '7 days',
    popularity: 95,
    triggerType: 'lead_created',
    triggerConditions: [{ field: 'status', operator: 'equals', value: 'new' }],
    steps: [
      {
        type: 'send_email',
        title: 'Welcome Email',
        description: 'Send personalized welcome email',
        config: {
          subject: 'Welcome to {{institution_name}}!',
          template: 'welcome',
          delay: { value: 0, unit: 'minutes' }
        }
      },
      {
        type: 'wait',
        title: 'Wait 2 Days',
        config: { waitTime: { value: 2, unit: 'days' } }
      },
      {
        type: 'send_email',
        title: 'Program Information',
        description: 'Share detailed program information',
        config: {
          subject: 'Learn More About Our Programs',
          template: 'program_info'
        }
      },
      {
        type: 'wait',
        title: 'Wait 3 Days',
        config: { waitTime: { value: 3, unit: 'days' } }
      },
      {
        type: 'send_email',
        title: 'Application CTA',
        description: 'Encourage application submission',
        config: {
          subject: 'Ready to Apply? We\'re Here to Help!',
          template: 'apply_cta'
        }
      },
      {
        type: 'create_task',
        title: 'Follow-up Task',
        description: 'Create task for advisor follow-up',
        config: {
          taskTitle: 'Follow up with new lead',
          priority: 'high'
        }
      }
    ]
  },
  {
    id: 'document-followup',
    name: 'Document Follow-up',
    description: 'Automated reminders for missing or incomplete document submissions',
    category: 'follow-up',
    icon: 'FileText',
    estimatedDuration: '14 days',
    popularity: 88,
    triggerType: 'document_required',
    triggerConditions: [{ field: 'documents_pending', operator: 'greater_than', value: 0 }],
    steps: [
      {
        type: 'send_email',
        title: 'Document Reminder',
        description: 'Initial reminder for missing documents',
        config: {
          subject: 'Action Required: Documents Needed for Your Application',
          template: 'document_reminder'
        }
      },
      {
        type: 'wait',
        title: 'Wait 3 Days',
        config: { waitTime: { value: 3, unit: 'days' } }
      },
      {
        type: 'condition',
        title: 'Check Documents',
        description: 'Check if documents are still pending',
        config: {
          conditions: [{ field: 'documents_pending', operator: 'greater_than', value: 0 }]
        }
      },
      {
        type: 'send_sms',
        title: 'SMS Reminder',
        description: 'Send SMS reminder',
        config: {
          message: 'Hi {{first_name}}, we still need some documents for your application. Check your email for details!'
        }
      },
      {
        type: 'wait',
        title: 'Wait 5 Days',
        config: { waitTime: { value: 5, unit: 'days' } }
      },
      {
        type: 'send_email',
        title: 'Urgent Reminder',
        description: 'Final reminder with deadline',
        config: {
          subject: 'Urgent: Your Application is Incomplete',
          template: 'urgent_document_reminder'
        }
      }
    ]
  },
  {
    id: 're-engagement',
    name: 'Re-engagement Campaign',
    description: 'Win-back sequence for leads who have gone cold or inactive',
    category: 'engagement',
    icon: 'RefreshCw',
    estimatedDuration: '21 days',
    popularity: 72,
    triggerType: 'inactivity',
    triggerConditions: [{ field: 'days_since_last_activity', operator: 'greater_than', value: 30 }],
    steps: [
      {
        type: 'send_email',
        title: 'We Miss You',
        description: 'Re-engagement email',
        config: {
          subject: 'We Haven\'t Heard From You - Any Questions?',
          template: 're_engagement'
        }
      },
      {
        type: 'wait',
        title: 'Wait 5 Days',
        config: { waitTime: { value: 5, unit: 'days' } }
      },
      {
        type: 'send_email',
        title: 'Exclusive Offer',
        description: 'Share special offer or deadline',
        config: {
          subject: 'A Special Opportunity Just For You',
          template: 'special_offer'
        }
      },
      {
        type: 'wait',
        title: 'Wait 7 Days',
        config: { waitTime: { value: 7, unit: 'days' } }
      },
      {
        type: 'send_email',
        title: 'Last Chance',
        description: 'Final re-engagement attempt',
        config: {
          subject: 'Before You Go...',
          template: 'last_chance'
        }
      },
      {
        type: 'update_lead',
        title: 'Mark as Cold',
        description: 'Update lead status if no response',
        config: {
          updateField: 'status',
          updateValue: 'cold'
        }
      }
    ]
  },
  {
    id: 'payment-reminder',
    name: 'Payment Reminder',
    description: 'Gentle payment reminders with escalation for overdue accounts',
    category: 'payment',
    icon: 'CreditCard',
    estimatedDuration: '14 days',
    popularity: 85,
    triggerType: 'payment_due',
    triggerConditions: [{ field: 'payment_status', operator: 'equals', value: 'pending' }],
    steps: [
      {
        type: 'send_email',
        title: 'Payment Due Reminder',
        description: 'Initial payment reminder',
        config: {
          subject: 'Payment Reminder: Your Invoice is Due',
          template: 'payment_due'
        }
      },
      {
        type: 'wait',
        title: 'Wait 3 Days',
        config: { waitTime: { value: 3, unit: 'days' } }
      },
      {
        type: 'condition',
        title: 'Check Payment',
        description: 'Check if payment is still pending',
        config: {
          conditions: [{ field: 'payment_status', operator: 'equals', value: 'pending' }]
        }
      },
      {
        type: 'send_email',
        title: 'Overdue Notice',
        description: 'Payment overdue notice',
        config: {
          subject: 'Payment Overdue - Action Required',
          template: 'payment_overdue'
        }
      },
      {
        type: 'send_sms',
        title: 'SMS Alert',
        description: 'SMS payment reminder',
        config: {
          message: 'Hi {{first_name}}, your payment is overdue. Please visit your portal to complete payment.'
        }
      },
      {
        type: 'create_task',
        title: 'Finance Follow-up',
        description: 'Create task for finance team',
        config: {
          taskTitle: 'Follow up on overdue payment',
          priority: 'high',
          assignTo: 'finance_team'
        }
      }
    ]
  },
  {
    id: 'application-conversion',
    name: 'Application Conversion',
    description: 'Guide leads through the application process with timely nudges',
    category: 'conversion',
    icon: 'Target',
    estimatedDuration: '10 days',
    popularity: 90,
    triggerType: 'status_change',
    triggerConditions: [{ field: 'status', operator: 'equals', value: 'interested' }],
    steps: [
      {
        type: 'send_email',
        title: 'Application Guide',
        description: 'Send application process guide',
        config: {
          subject: 'Your Step-by-Step Application Guide',
          template: 'application_guide'
        }
      },
      {
        type: 'wait',
        title: 'Wait 2 Days',
        config: { waitTime: { value: 2, unit: 'days' } }
      },
      {
        type: 'condition',
        title: 'Check Application Status',
        config: {
          conditions: [{ field: 'application_started', operator: 'equals', value: false }]
        }
      },
      {
        type: 'send_email',
        title: 'Benefits Highlight',
        description: 'Highlight program benefits',
        config: {
          subject: 'Why Students Choose Us',
          template: 'benefits'
        }
      },
      {
        type: 'wait',
        title: 'Wait 3 Days',
        config: { waitTime: { value: 3, unit: 'days' } }
      },
      {
        type: 'send_email',
        title: 'Success Stories',
        description: 'Share student success stories',
        config: {
          subject: 'See What Our Graduates Achieved',
          template: 'success_stories'
        }
      },
      {
        type: 'create_task',
        title: 'Personal Outreach',
        description: 'Schedule personal call',
        config: {
          taskTitle: 'Schedule conversion call',
          priority: 'medium'
        }
      }
    ]
  },
  {
    id: 'student-retention',
    name: 'Student Retention',
    description: 'Check-ins and support for enrolled students to ensure success',
    category: 'retention',
    icon: 'Heart',
    estimatedDuration: '30 days',
    popularity: 78,
    triggerType: 'enrollment',
    triggerConditions: [{ field: 'status', operator: 'equals', value: 'enrolled' }],
    steps: [
      {
        type: 'send_email',
        title: 'Welcome to Class',
        description: 'Welcome enrolled student',
        config: {
          subject: 'Welcome! Your Journey Begins',
          template: 'enrollment_welcome'
        }
      },
      {
        type: 'wait',
        title: 'Wait 7 Days',
        config: { waitTime: { value: 7, unit: 'days' } }
      },
      {
        type: 'send_email',
        title: 'First Week Check-in',
        description: 'Check on first week experience',
        config: {
          subject: 'How Was Your First Week?',
          template: 'first_week_checkin'
        }
      },
      {
        type: 'wait',
        title: 'Wait 14 Days',
        config: { waitTime: { value: 14, unit: 'days' } }
      },
      {
        type: 'send_email',
        title: 'Resources Reminder',
        description: 'Share helpful resources',
        config: {
          subject: 'Resources to Help You Succeed',
          template: 'resources'
        }
      },
      {
        type: 'create_task',
        title: 'Advisor Check-in',
        description: 'Schedule advisor check-in call',
        config: {
          taskTitle: 'Schedule student check-in',
          priority: 'medium'
        }
      }
    ]
  }
];

export const templateCategories = [
  { id: 'all', label: 'All Templates', icon: 'LayoutGrid' },
  { id: 'onboarding', label: 'Onboarding', icon: 'Sparkles' },
  { id: 'follow-up', label: 'Follow-up', icon: 'Bell' },
  { id: 'conversion', label: 'Conversion', icon: 'Target' },
  { id: 'retention', label: 'Retention', icon: 'Heart' },
  { id: 'payment', label: 'Payment', icon: 'CreditCard' },
  { id: 'engagement', label: 'Engagement', icon: 'RefreshCw' }
];
