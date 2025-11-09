import { BuilderConfig } from '@/types/universalBuilder';

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: 'onboarding' | 're-engagement' | 'nurturing' | 'conversion' | 'retention';
  icon: string;
  config: Partial<BuilderConfig>;
}

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'welcome-onboarding',
    name: 'Welcome & Onboarding',
    description: 'Automated welcome sequence for new leads with progressive engagement',
    category: 'onboarding',
    icon: '👋',
    config: {
      name: 'Welcome & Onboarding Campaign',
      description: 'Automated welcome sequence for new leads',
      type: 'campaign',
      elements: [
        {
          id: 'trigger_1',
          type: 'trigger',
          title: 'New Lead Created',
          description: 'Trigger when a new lead is added',
          position: 0,
          elementType: 'campaign',
          config: {
            triggerType: 'lead_created',
            conditions: []
          }
        },
        {
          id: 'email_1',
          type: 'email',
          title: 'Welcome Email',
          description: 'Initial welcome email',
          position: 1,
          elementType: 'campaign',
          config: {
            subject: 'Welcome to [Program]!',
            content: 'Hi [First Name],\n\nWelcome! We\'re excited to help you on your journey.',
            fromName: 'Admissions Team',
            fromEmail: 'admissions@school.edu'
          }
        },
        {
          id: 'wait_1',
          type: 'wait',
          title: 'Wait 2 Days',
          description: 'Wait before next touchpoint',
          position: 2,
          elementType: 'campaign',
          config: {
            delay: { value: 2, unit: 'days' }
          }
        },
        {
          id: 'email_2',
          type: 'email',
          title: 'Getting Started Guide',
          description: 'Send helpful resources',
          position: 3,
          elementType: 'campaign',
          config: {
            subject: 'Your Getting Started Guide',
            content: 'Hi [First Name],\n\nHere are some helpful resources to get you started...',
            fromName: 'Admissions Team',
            fromEmail: 'admissions@school.edu'
          }
        },
        {
          id: 'wait_2',
          type: 'wait',
          title: 'Wait 3 Days',
          description: 'Wait before scheduling call',
          position: 4,
          elementType: 'campaign',
          config: {
            delay: { value: 3, unit: 'days' }
          }
        },
        {
          id: 'task_1',
          type: 'create-task',
          title: 'Schedule Follow-up Call',
          description: 'Create task for advisor to call',
          position: 5,
          elementType: 'campaign',
          config: {
            title: 'Welcome Call - [Full Name]',
            description: 'Conduct welcome call to answer questions',
            taskType: 'call',
            priority: 'high'
          }
        }
      ]
    }
  },
  {
    id: 're-engagement',
    name: 'Re-engagement Campaign',
    description: 'Win back inactive leads with personalized outreach',
    category: 're-engagement',
    icon: '🔄',
    config: {
      name: 'Re-engagement Campaign',
      description: 'Win back inactive leads',
      type: 'campaign',
      elements: [
        {
          id: 'trigger_1',
          type: 'trigger',
          title: 'Inactive Lead',
          description: 'Trigger for leads inactive for 30 days',
          position: 0,
          elementType: 'campaign',
          config: {
            triggerType: 'lead_inactive',
            conditions: [{ field: 'days_inactive', operator: 'gte', value: 30 }]
          }
        },
        {
          id: 'email_1',
          type: 'email',
          title: 'We Miss You',
          description: 'Re-engagement email',
          position: 1,
          elementType: 'campaign',
          config: {
            subject: 'We\'d Love to Hear From You, [First Name]',
            content: 'Hi [First Name],\n\nWe noticed you haven\'t been in touch lately. We\'d love to help you continue your journey...',
            fromName: 'Admissions Team',
            fromEmail: 'admissions@school.edu'
          }
        },
        {
          id: 'wait_1',
          type: 'wait',
          title: 'Wait 5 Days',
          description: 'Wait for response',
          position: 2,
          elementType: 'campaign',
          config: {
            delay: { value: 5, unit: 'days' }
          }
        },
        {
          id: 'condition_1',
          type: 'condition',
          title: 'Check Engagement',
          description: 'Did they respond?',
          position: 3,
          elementType: 'campaign',
          config: {
            conditions: [{ field: 'email_opened', operator: 'eq', value: true }],
            truePath: 'assign_advisor',
            falsePath: 'final_offer'
          }
        },
        {
          id: 'assign_1',
          type: 'assign-advisor',
          title: 'Assign to Senior Advisor',
          description: 'Personal outreach for engaged leads',
          position: 4,
          elementType: 'campaign',
          config: {
            advisorId: ''
          }
        },
        {
          id: 'email_2',
          type: 'email',
          title: 'Final Special Offer',
          description: 'Last attempt with incentive',
          position: 5,
          elementType: 'campaign',
          config: {
            subject: 'Last Chance: Special Offer Inside',
            content: 'Hi [First Name],\n\nWe have a special opportunity just for you...',
            fromName: 'Admissions Team',
            fromEmail: 'admissions@school.edu'
          }
        }
      ]
    }
  },
  {
    id: 'nurture-sequence',
    name: 'Lead Nurturing Sequence',
    description: 'Educational content series to build trust and engagement',
    category: 'nurturing',
    icon: '🌱',
    config: {
      name: 'Lead Nurturing Sequence',
      description: 'Educational content series',
      type: 'campaign',
      elements: [
        {
          id: 'trigger_1',
          type: 'trigger',
          title: 'Lead Downloaded Content',
          description: 'Trigger when lead downloads brochure',
          position: 0,
          elementType: 'campaign',
          config: {
            triggerType: 'content_download',
            conditions: []
          }
        },
        {
          id: 'email_1',
          type: 'email',
          title: 'Educational Content #1',
          description: 'Industry insights',
          position: 1,
          elementType: 'campaign',
          config: {
            subject: 'Your Industry Career Guide',
            content: 'Hi [First Name],\n\nThank you for downloading our brochure. Here\'s some valuable information about careers in [Program]...',
            fromName: 'Admissions Team',
            fromEmail: 'admissions@school.edu'
          }
        },
        {
          id: 'wait_1',
          type: 'wait',
          title: 'Wait 4 Days',
          description: 'Space out content',
          position: 2,
          elementType: 'campaign',
          config: {
            delay: { value: 4, unit: 'days' }
          }
        },
        {
          id: 'email_2',
          type: 'email',
          title: 'Success Stories',
          description: 'Alumni testimonials',
          position: 3,
          elementType: 'campaign',
          config: {
            subject: 'Real Success Stories from Our Graduates',
            content: 'Hi [First Name],\n\nSee how our alumni have transformed their careers...',
            fromName: 'Admissions Team',
            fromEmail: 'admissions@school.edu'
          }
        },
        {
          id: 'wait_2',
          type: 'wait',
          title: 'Wait 4 Days',
          description: 'Space out content',
          position: 4,
          elementType: 'campaign',
          config: {
            delay: { value: 4, unit: 'days' }
          }
        },
        {
          id: 'email_3',
          type: 'email',
          title: 'Program Deep Dive',
          description: 'Detailed program information',
          position: 5,
          elementType: 'campaign',
          config: {
            subject: 'Inside Look: What You\'ll Learn',
            content: 'Hi [First Name],\n\nLet\'s dive deep into what makes our program unique...',
            fromName: 'Admissions Team',
            fromEmail: 'admissions@school.edu'
          }
        },
        {
          id: 'goal_1',
          type: 'goal-tracking',
          title: 'Track Engagement',
          description: 'Record nurture completion',
          position: 6,
          elementType: 'campaign',
          config: {
            goalType: 'nurture_completed',
            goalValue: 1
          }
        },
        {
          id: 'update_1',
          type: 'update-lead',
          title: 'Update Lead Status',
          description: 'Mark as nurtured',
          position: 7,
          elementType: 'campaign',
          config: {
            updates: {
              status: 'nurtured',
              tags: ['content_engaged']
            }
          }
        }
      ]
    }
  },
  {
    id: 'application-conversion',
    name: 'Application Conversion',
    description: 'Guide qualified leads through application process',
    category: 'conversion',
    icon: '🎯',
    config: {
      name: 'Application Conversion Campaign',
      description: 'Guide leads through application',
      type: 'campaign',
      elements: [
        {
          id: 'trigger_1',
          type: 'trigger',
          title: 'Lead Qualified',
          description: 'Trigger when lead status is qualified',
          position: 0,
          elementType: 'campaign',
          config: {
            triggerType: 'status_change',
            conditions: [{ field: 'status', operator: 'eq', value: 'qualified' }]
          }
        },
        {
          id: 'notification_1',
          type: 'internal-notification',
          title: 'Alert Admissions Team',
          description: 'Notify team of qualified lead',
          position: 1,
          elementType: 'campaign',
          config: {
            title: 'New Qualified Lead: [Full Name]',
            message: 'Lead [Full Name] has been qualified and is ready for application guidance',
            priority: 'high'
          }
        },
        {
          id: 'email_1',
          type: 'email',
          title: 'Application Invitation',
          description: 'Send application link',
          position: 2,
          elementType: 'campaign',
          config: {
            subject: 'Ready to Apply? Here\'s Your Next Step',
            content: 'Hi [First Name],\n\nCongratulations on your interest in [Program]! We\'re excited to invite you to apply...',
            fromName: 'Admissions Team',
            fromEmail: 'admissions@school.edu'
          }
        },
        {
          id: 'wait_1',
          type: 'wait',
          title: 'Wait 3 Days',
          description: 'Give time to apply',
          position: 3,
          elementType: 'campaign',
          config: {
            delay: { value: 3, unit: 'days' }
          }
        },
        {
          id: 'condition_1',
          type: 'condition',
          title: 'Application Started?',
          description: 'Check if they began application',
          position: 4,
          elementType: 'campaign',
          config: {
            conditions: [{ field: 'application_started', operator: 'eq', value: true }],
            truePath: 'support_email',
            falsePath: 'reminder_email'
          }
        },
        {
          id: 'email_2',
          type: 'email',
          title: 'Application Support',
          description: 'Help complete application',
          position: 5,
          elementType: 'campaign',
          config: {
            subject: 'Need Help With Your Application?',
            content: 'Hi [First Name],\n\nWe noticed you started your application. Here are some tips to help you complete it...',
            fromName: 'Admissions Team',
            fromEmail: 'admissions@school.edu'
          }
        },
        {
          id: 'task_1',
          type: 'create-task',
          title: 'Personal Follow-up',
          description: 'Advisor to reach out',
          position: 6,
          elementType: 'campaign',
          config: {
            title: 'Application Support Call - [Full Name]',
            description: 'Call to assist with application completion',
            taskType: 'call',
            priority: 'high'
          }
        }
      ]
    }
  },
  {
    id: 'student-retention',
    name: 'Student Retention',
    description: 'Check-ins and support for enrolled students',
    category: 'retention',
    icon: '🎓',
    config: {
      name: 'Student Retention Campaign',
      description: 'Ongoing student engagement',
      type: 'campaign',
      elements: [
        {
          id: 'trigger_1',
          type: 'trigger',
          title: 'Monthly Check-in',
          description: 'Recurring monthly trigger',
          position: 0,
          elementType: 'campaign',
          config: {
            triggerType: 'schedule',
            conditions: [{ field: 'frequency', operator: 'eq', value: 'monthly' }]
          }
        },
        {
          id: 'email_1',
          type: 'email',
          title: 'Monthly Check-in Email',
          description: 'How are you doing?',
          position: 1,
          elementType: 'campaign',
          config: {
            subject: 'How\'s Your Month Going, [First Name]?',
            content: 'Hi [First Name],\n\nWe hope you\'re enjoying your studies! We wanted to check in and see how things are going...',
            fromName: 'Student Success Team',
            fromEmail: 'success@school.edu'
          }
        },
        {
          id: 'wait_1',
          type: 'wait',
          title: 'Wait 5 Days',
          description: 'Wait for feedback',
          position: 2,
          elementType: 'campaign',
          config: {
            delay: { value: 5, unit: 'days' }
          }
        },
        {
          id: 'condition_1',
          type: 'condition',
          title: 'Needs Support?',
          description: 'Check sentiment',
          position: 3,
          elementType: 'campaign',
          config: {
            conditions: [{ field: 'sentiment', operator: 'eq', value: 'negative' }],
            truePath: 'advisor_task',
            falsePath: 'positive_email'
          }
        },
        {
          id: 'task_1',
          type: 'create-task',
          title: 'Urgent Support Needed',
          description: 'Advisor intervention',
          position: 4,
          elementType: 'campaign',
          config: {
            title: 'Student Support - [Full Name]',
            description: 'Student may need additional support',
            taskType: 'call',
            priority: 'urgent'
          }
        },
        {
          id: 'email_2',
          type: 'email',
          title: 'Resources & Tips',
          description: 'Send helpful content',
          position: 5,
          elementType: 'campaign',
          config: {
            subject: 'Tips to Excel This Month',
            content: 'Hi [First Name],\n\nGlad to hear things are going well! Here are some resources to help you excel...',
            fromName: 'Student Success Team',
            fromEmail: 'success@school.edu'
          }
        },
        {
          id: 'goal_1',
          type: 'goal-tracking',
          title: 'Track Retention',
          description: 'Record student engagement',
          position: 6,
          elementType: 'campaign',
          config: {
            goalType: 'monthly_checkin',
            goalValue: 1
          }
        }
      ]
    }
  }
];

export function getTemplatesByCategory(category: CampaignTemplate['category']) {
  return campaignTemplates.filter(t => t.category === category);
}

export function getTemplateById(id: string) {
  return campaignTemplates.find(t => t.id === id);
}
