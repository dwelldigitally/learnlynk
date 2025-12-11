export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'onboarding' | 'follow-up' | 'conversion' | 'retention' | 'payment' | 'engagement';
  icon: string;
  steps: AutomationTemplateStep[];
  triggerType: string;
  triggerConditions: any[];
  estimatedDuration: string;
  popularity: number;
}

export interface AutomationTemplateStep {
  type: string;
  title: string;
  description?: string;
  config: Record<string, any>;
}

export const automationTemplates: AutomationTemplate[] = [
  {
    id: 'welcome-sequence',
    name: 'Welcome & Onboarding',
    description: 'Automated welcome email series for new leads with program information and next steps',
    category: 'onboarding',
    icon: 'Sparkles',
    estimatedDuration: '7 days',
    popularity: 95,
    triggerType: 'lead_created',
    triggerConditions: [{ field: 'status', operator: 'equals', value: 'New Inquiry' }],
    steps: [
      {
        type: 'email',
        title: 'Welcome Email',
        description: 'Send personalized welcome email',
        config: {
          subject: 'Welcome to {{institution_name}}!',
          content: '<p>Hi {{firstName}},</p><p>Welcome to our institution! We\'re excited to have you here.</p><p>Best regards,<br/>The Team</p>',
          fromName: 'Admissions Team',
          fromEmail: 'admissions@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 2 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 2, unit: 'days' } 
        }
      },
      {
        type: 'email',
        title: 'Program Information',
        description: 'Share detailed program information',
        config: {
          subject: 'Learn More About Our Programs',
          content: '<p>Hi {{firstName}},</p><p>We wanted to share more information about our programs that might interest you.</p>',
          fromName: 'Admissions Team',
          fromEmail: 'admissions@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 3 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 3, unit: 'days' } 
        }
      },
      {
        type: 'email',
        title: 'Application CTA',
        description: 'Encourage application submission',
        config: {
          subject: 'Ready to Apply? We\'re Here to Help!',
          content: '<p>Hi {{firstName}},</p><p>Have you considered starting your application? We\'re here to help you every step of the way.</p>',
          fromName: 'Admissions Team',
          fromEmail: 'admissions@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'create-task',
        title: 'Follow-up Task',
        description: 'Create task for advisor follow-up',
        config: {
          taskTitle: 'Follow up with new lead - {{firstName}} {{lastName}}',
          taskDescription: 'New lead completed welcome sequence. Follow up to discuss program options.',
          taskType: 'follow_up',
          priority: 'high',
          assignTo: 'lead_advisor',
          dueInDays: 1
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
        type: 'email',
        title: 'Document Reminder',
        description: 'Initial reminder for missing documents',
        config: {
          subject: 'Action Required: Documents Needed for Your Application',
          content: '<p>Hi {{firstName}},</p><p>We noticed some documents are still pending for your application. Please submit them at your earliest convenience.</p>',
          fromName: 'Document Services',
          fromEmail: 'documents@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 3 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 3, unit: 'days' } 
        }
      },
      {
        type: 'condition',
        title: 'Check Documents',
        description: 'Check if documents are still pending',
        config: {
          conditionGroups: [{
            operator: 'AND',
            conditions: [{ field: 'documents_pending', operator: 'greater_than', value: 0 }]
          }],
          evaluationMode: 'AND'
        }
      },
      {
        type: 'sms',
        title: 'SMS Reminder',
        description: 'Send SMS reminder',
        config: {
          content: 'Hi {{firstName}}, we still need some documents for your application. Check your email for details!',
          includeOptOut: true,
          optOutMessage: 'Reply STOP to unsubscribe',
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 5 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 5, unit: 'days' } 
        }
      },
      {
        type: 'email',
        title: 'Urgent Reminder',
        description: 'Final reminder with deadline',
        config: {
          subject: 'Urgent: Your Application is Incomplete',
          content: '<p>Hi {{firstName}},</p><p>This is a final reminder that your application documents are still pending. Please submit them as soon as possible to avoid delays.</p>',
          fromName: 'Document Services',
          fromEmail: 'documents@example.com',
          trackOpens: true,
          trackClicks: true
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
        type: 'email',
        title: 'We Miss You',
        description: 'Re-engagement email',
        config: {
          subject: 'We Haven\'t Heard From You - Any Questions?',
          content: '<p>Hi {{firstName}},</p><p>It\'s been a while since we connected. We\'d love to hear from you and answer any questions you might have.</p>',
          fromName: 'Admissions Team',
          fromEmail: 'admissions@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 5 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 5, unit: 'days' } 
        }
      },
      {
        type: 'email',
        title: 'Exclusive Offer',
        description: 'Share special offer or deadline',
        config: {
          subject: 'A Special Opportunity Just For You',
          content: '<p>Hi {{firstName}},</p><p>We have an exclusive opportunity we\'d like to share with you.</p>',
          fromName: 'Admissions Team',
          fromEmail: 'admissions@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 7 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 7, unit: 'days' } 
        }
      },
      {
        type: 'email',
        title: 'Last Chance',
        description: 'Final re-engagement attempt',
        config: {
          subject: 'Before You Go...',
          content: '<p>Hi {{firstName}},</p><p>We wanted to reach out one last time before we update your records.</p>',
          fromName: 'Admissions Team',
          fromEmail: 'admissions@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'update-lead',
        title: 'Mark as Cold',
        description: 'Update lead status if no response',
        config: {
          updateType: 'status',
          newStatus: 'Dismissed',
          tags: ['cold', 'no-response'],
          tagsAction: 'add'
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
        type: 'email',
        title: 'Payment Due Reminder',
        description: 'Initial payment reminder',
        config: {
          subject: 'Payment Reminder: Your Invoice is Due',
          content: '<p>Hi {{firstName}},</p><p>This is a friendly reminder that your payment is due. Please complete your payment at your earliest convenience.</p>',
          fromName: 'Finance Team',
          fromEmail: 'finance@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 3 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 3, unit: 'days' } 
        }
      },
      {
        type: 'condition',
        title: 'Check Payment',
        description: 'Check if payment is still pending',
        config: {
          conditionGroups: [{
            operator: 'AND',
            conditions: [{ field: 'payment_status', operator: 'equals', value: 'pending' }]
          }],
          evaluationMode: 'AND'
        }
      },
      {
        type: 'email',
        title: 'Overdue Notice',
        description: 'Payment overdue notice',
        config: {
          subject: 'Payment Overdue - Action Required',
          content: '<p>Hi {{firstName}},</p><p>Your payment is now overdue. Please complete your payment immediately to avoid any service interruptions.</p>',
          fromName: 'Finance Team',
          fromEmail: 'finance@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'sms',
        title: 'SMS Alert',
        description: 'SMS payment reminder',
        config: {
          content: 'Hi {{firstName}}, your payment is overdue. Please visit your portal to complete payment.',
          includeOptOut: true,
          optOutMessage: 'Reply STOP to unsubscribe',
          trackClicks: true
        }
      },
      {
        type: 'create-task',
        title: 'Finance Follow-up',
        description: 'Create task for finance team',
        config: {
          taskTitle: 'Follow up on overdue payment - {{firstName}} {{lastName}}',
          taskDescription: 'Payment is overdue. Contact student to resolve.',
          taskType: 'follow_up',
          priority: 'high',
          assignTo: 'unassigned',
          dueInDays: 1
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
    triggerConditions: [{ field: 'status', operator: 'equals', value: 'New Inquiry' }],
    steps: [
      {
        type: 'email',
        title: 'Application Guide',
        description: 'Send application process guide',
        config: {
          subject: 'Your Step-by-Step Application Guide',
          content: '<p>Hi {{firstName}},</p><p>We\'ve prepared a step-by-step guide to help you complete your application.</p>',
          fromName: 'Admissions Team',
          fromEmail: 'admissions@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 2 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 2, unit: 'days' } 
        }
      },
      {
        type: 'condition',
        title: 'Check Application Status',
        config: {
          conditionGroups: [{
            operator: 'AND',
            conditions: [{ field: 'application_started', operator: 'equals', value: false }]
          }],
          evaluationMode: 'AND'
        }
      },
      {
        type: 'email',
        title: 'Benefits Highlight',
        description: 'Highlight program benefits',
        config: {
          subject: 'Why Students Choose Us',
          content: '<p>Hi {{firstName}},</p><p>Here are some reasons why students choose our programs.</p>',
          fromName: 'Admissions Team',
          fromEmail: 'admissions@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 3 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 3, unit: 'days' } 
        }
      },
      {
        type: 'email',
        title: 'Success Stories',
        description: 'Share student success stories',
        config: {
          subject: 'See What Our Graduates Achieved',
          content: '<p>Hi {{firstName}},</p><p>Our graduates have achieved great success. Read their stories!</p>',
          fromName: 'Admissions Team',
          fromEmail: 'admissions@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'create-task',
        title: 'Personal Outreach',
        description: 'Schedule personal call',
        config: {
          taskTitle: 'Schedule conversion call - {{firstName}} {{lastName}}',
          taskDescription: 'Lead has not started application. Schedule a personal call.',
          taskType: 'call',
          priority: 'medium',
          assignTo: 'lead_advisor',
          dueInDays: 2
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
    triggerConditions: [{ field: 'status', operator: 'equals', value: 'Admitted' }],
    steps: [
      {
        type: 'email',
        title: 'Welcome to Class',
        description: 'Welcome enrolled student',
        config: {
          subject: 'Welcome! Your Journey Begins',
          content: '<p>Hi {{firstName}},</p><p>Congratulations on your enrollment! Your educational journey begins now.</p>',
          fromName: 'Student Success Team',
          fromEmail: 'success@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 7 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 7, unit: 'days' } 
        }
      },
      {
        type: 'email',
        title: 'First Week Check-in',
        description: 'Check on first week experience',
        config: {
          subject: 'How Was Your First Week?',
          content: '<p>Hi {{firstName}},</p><p>We hope your first week has been great! Let us know if you have any questions.</p>',
          fromName: 'Student Success Team',
          fromEmail: 'success@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'wait',
        title: 'Wait 14 Days',
        config: { 
          waitType: 'duration',
          waitTime: { value: 14, unit: 'days' } 
        }
      },
      {
        type: 'email',
        title: 'Resources Reminder',
        description: 'Share helpful resources',
        config: {
          subject: 'Resources to Help You Succeed',
          content: '<p>Hi {{firstName}},</p><p>Here are some resources to help you succeed in your studies.</p>',
          fromName: 'Student Success Team',
          fromEmail: 'success@example.com',
          trackOpens: true,
          trackClicks: true
        }
      },
      {
        type: 'create-task',
        title: 'Advisor Check-in',
        description: 'Schedule advisor check-in call',
        config: {
          taskTitle: 'Schedule student check-in - {{firstName}} {{lastName}}',
          taskDescription: 'Monthly check-in with enrolled student.',
          taskType: 'meeting',
          priority: 'medium',
          assignTo: 'lead_advisor',
          dueInDays: 5
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
