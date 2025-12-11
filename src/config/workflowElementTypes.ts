import { ElementTypeConfig } from '@/types/universalBuilder';

// Enhanced Workflow Element Types with comprehensive action properties
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
      schedule: { type: 'once', dateTime: null, recurring: null },
      reEnrollmentAllowed: false,
      reEnrollmentDelay: { value: 7, unit: 'days' }
    },
    configSchema: [
      {
        key: 'triggerEvent',
        label: 'Trigger Event',
        type: 'select',
        options: [
          { label: 'Manual Trigger', value: 'manual' },
          { label: 'Scheduled Time', value: 'scheduled' },
          { label: 'Lead Created', value: 'lead_created' },
          { label: 'Form Submitted', value: 'form_submitted' },
          { label: 'Status Changed', value: 'status_changed' },
          { label: 'Lead Score Threshold', value: 'score_threshold' },
          { label: 'Tag Added', value: 'tag_added' },
          { label: 'Tag Removed', value: 'tag_removed' },
          { label: 'Date Reached', value: 'date_reached' },
          { label: 'Webhook Received', value: 'webhook' },
          { label: 'Field Value Changed', value: 'field_changed' },
          { label: 'Document Uploaded', value: 'document_uploaded' },
          { label: 'Document Approved', value: 'document_approved' },
          { label: 'Payment Received', value: 'payment_received' },
          { label: 'Advisor Assigned', value: 'advisor_assigned' },
          { label: 'Email Opened', value: 'email_opened' },
          { label: 'Email Clicked', value: 'email_clicked' },
          { label: 'Stage Changed', value: 'stage_changed' }
        ]
      },
      {
        key: 'conditionGroups',
        label: 'Enrollment Conditions',
        type: 'array',
        helpText: 'Define conditions for when leads should be enrolled in this workflow'
      },
      {
        key: 'reEnrollmentAllowed',
        label: 'Allow Re-enrollment',
        type: 'checkbox',
        helpText: 'Allow the same lead to be enrolled multiple times'
      },
      {
        key: 'reEnrollmentDelay.value',
        label: 'Re-enrollment Delay',
        type: 'number',
        helpText: 'Minimum time before a lead can be re-enrolled'
      },
      {
        key: 'reEnrollmentDelay.unit',
        label: 'Delay Unit',
        type: 'select',
        options: [
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' },
          { label: 'Weeks', value: 'weeks' }
        ]
      }
    ]
  },
  
  // COMMUNICATION ACTIONS - Enhanced Email
  {
    type: 'email',
    label: 'Send Email',
    icon: 'Mail',
    category: 'Communication',
    defaultConfig: {
      fromName: 'Your Organization',
      fromEmail: 'noreply@example.com',
      replyTo: '',
      ccEmails: '',
      bccEmails: '',
      subject: 'Email Subject',
      preheader: '',
      content: '<p>Hi {{firstName}},</p><p>Start writing your email content here...</p>',
      templateId: '',
      useTemplate: false,
      attachments: [],
      trackOpens: true,
      trackClicks: true,
      sendAt: null,
      sendInBusinessHours: false,
      businessHoursTimezone: 'America/New_York',
      abTestEnabled: false,
      abTestVariantB: {
        subject: '',
        content: ''
      },
      abTestSplitPercentage: 50
    },
    configSchema: [
      { key: 'useTemplate', label: 'Use Email Template', type: 'checkbox' },
      { 
        key: 'templateId', 
        label: 'Email Template', 
        type: 'select',
        options: [],
        helpText: 'Select from saved email templates',
        dynamicOptions: 'emailTemplates'
      },
      { key: 'fromName', label: 'From Name', type: 'text', placeholder: 'Your Organization' },
      { key: 'fromEmail', label: 'From Email', type: 'text', placeholder: 'noreply@example.com' },
      { key: 'replyTo', label: 'Reply-To Email', type: 'text', placeholder: 'Optional reply-to address' },
      { key: 'ccEmails', label: 'CC Emails', type: 'text', placeholder: 'Comma-separated emails' },
      { key: 'bccEmails', label: 'BCC Emails', type: 'text', placeholder: 'Comma-separated emails' },
      { key: 'subject', label: 'Subject Line', type: 'text', placeholder: 'Compelling subject line - use {{firstName}} for personalization' },
      { key: 'preheader', label: 'Preheader Text', type: 'text', placeholder: 'Preview text shown in inbox (40-130 chars recommended)' },
      { key: 'content', label: 'Email Content', type: 'richtext', helpText: 'Use {{firstName}}, {{lastName}}, {{email}}, {{programName}} for personalization' },
      { key: 'attachments', label: 'Attachments', type: 'fileList', helpText: 'Add file attachments to the email' },
      { key: 'trackOpens', label: 'Track Email Opens', type: 'checkbox' },
      { key: 'trackClicks', label: 'Track Link Clicks', type: 'checkbox' },
      { key: 'sendInBusinessHours', label: 'Send During Business Hours Only', type: 'checkbox' },
      { 
        key: 'businessHoursTimezone', 
        label: 'Timezone', 
        type: 'select',
        options: [
          { label: 'Eastern (US)', value: 'America/New_York' },
          { label: 'Central (US)', value: 'America/Chicago' },
          { label: 'Mountain (US)', value: 'America/Denver' },
          { label: 'Pacific (US)', value: 'America/Los_Angeles' },
          { label: 'UTC', value: 'UTC' },
          { label: 'London', value: 'Europe/London' },
          { label: 'Paris', value: 'Europe/Paris' },
          { label: 'Tokyo', value: 'Asia/Tokyo' },
          { label: 'Sydney', value: 'Australia/Sydney' }
        ]
      },
      { key: 'abTestEnabled', label: 'Enable A/B Testing', type: 'checkbox' },
      { key: 'abTestVariantB.subject', label: 'Variant B Subject', type: 'text', placeholder: 'Alternative subject line' },
      { key: 'abTestVariantB.content', label: 'Variant B Content', type: 'richtext' },
      { key: 'abTestSplitPercentage', label: 'A/B Split (%)', type: 'number', placeholder: '50' }
    ]
  },
  
  // Enhanced SMS
  {
    type: 'sms',
    label: 'Send SMS',
    icon: 'MessageSquare',
    category: 'Communication',
    defaultConfig: {
      content: 'Hi {{firstName}}, this is your message...',
      senderId: '',
      templateId: '',
      useTemplate: false,
      includeOptOut: true,
      optOutMessage: 'Reply STOP to unsubscribe',
      shortenUrls: true,
      trackClicks: true,
      sendInBusinessHours: false,
      businessHoursTimezone: 'America/New_York'
    },
    configSchema: [
      { key: 'useTemplate', label: 'Use SMS Template', type: 'checkbox' },
      { 
        key: 'templateId', 
        label: 'SMS Template', 
        type: 'select',
        options: [],
        dynamicOptions: 'smsTemplates'
      },
      { key: 'senderId', label: 'Sender ID / Phone Number', type: 'text', placeholder: 'Leave blank for default' },
      { key: 'content', label: 'Message Content', type: 'sms', placeholder: 'Write your SMS message - use {{firstName}}, {{lastName}} for personalization' },
      { key: 'includeOptOut', label: 'Include Opt-out Instructions', type: 'checkbox' },
      { key: 'optOutMessage', label: 'Opt-out Message', type: 'text', placeholder: 'Reply STOP to unsubscribe' },
      { key: 'shortenUrls', label: 'Shorten URLs', type: 'checkbox' },
      { key: 'trackClicks', label: 'Track Link Clicks', type: 'checkbox' },
      { key: 'sendInBusinessHours', label: 'Send During Business Hours Only', type: 'checkbox' },
      { 
        key: 'businessHoursTimezone', 
        label: 'Timezone', 
        type: 'select',
        options: [
          { label: 'Eastern (US)', value: 'America/New_York' },
          { label: 'Central (US)', value: 'America/Chicago' },
          { label: 'Pacific (US)', value: 'America/Los_Angeles' },
          { label: 'UTC', value: 'UTC' }
        ]
      }
    ]
  },
  
  // Enhanced WhatsApp
  {
    type: 'whatsapp',
    label: 'Send WhatsApp',
    icon: 'MessageCircle',
    category: 'Communication',
    defaultConfig: {
      content: 'Hi {{firstName}}, ',
      templateId: '',
      useTemplate: false,
      mediaType: 'none',
      mediaUrl: '',
      buttons: [],
      quickReplies: []
    },
    configSchema: [
      { key: 'useTemplate', label: 'Use WhatsApp Template', type: 'checkbox', helpText: 'Required for messages outside 24-hour window' },
      { 
        key: 'templateId', 
        label: 'WhatsApp Template', 
        type: 'select',
        options: [],
        dynamicOptions: 'whatsappTemplates'
      },
      { key: 'content', label: 'Message Content', type: 'textarea', placeholder: 'WhatsApp message content' },
      { 
        key: 'mediaType', 
        label: 'Media Attachment', 
        type: 'select',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Image', value: 'image' },
          { label: 'Video', value: 'video' },
          { label: 'Document', value: 'document' },
          { label: 'Audio', value: 'audio' }
        ]
      },
      { key: 'mediaUrl', label: 'Media URL', type: 'text', placeholder: 'URL to media file' },
      { key: 'buttons', label: 'Call-to-Action Buttons (JSON)', type: 'textarea', placeholder: '[{"type": "url", "text": "Visit Website", "url": "https://..."}]' },
      { key: 'quickReplies', label: 'Quick Replies (comma-separated)', type: 'text', placeholder: 'Yes, No, Maybe Later' }
    ]
  },
  
  // Enhanced Internal Notification
  {
    type: 'internal-notification',
    label: 'Internal Notification',
    icon: 'Bell',
    category: 'Communication',
    defaultConfig: {
      notifyType: 'in_app',
      recipientType: 'lead_advisor',
      specificRecipients: [],
      teamIds: [],
      subject: 'Workflow Notification',
      message: '',
      priority: 'normal',
      actionUrl: '',
      includeLeadInfo: true
    },
    configSchema: [
      {
        key: 'notifyType',
        label: 'Notification Type',
        type: 'select',
        options: [
          { label: 'In-App Only', value: 'in_app' },
          { label: 'Email Only', value: 'email' },
          { label: 'Both In-App & Email', value: 'both' },
          { label: 'Slack', value: 'slack' },
          { label: 'Microsoft Teams', value: 'teams' }
        ]
      },
      {
        key: 'recipientType',
        label: 'Send To',
        type: 'select',
        options: [
          { label: "Lead's Assigned Advisor", value: 'lead_advisor' },
          { label: 'Specific Team Members', value: 'specific' },
          { label: 'Entire Team', value: 'team' },
          { label: 'All Admins', value: 'admins' }
        ]
      },
      { key: 'specificRecipients', label: 'Specific Recipients', type: 'text', placeholder: 'Select team members', dynamicOptions: 'teamMembers' },
      { key: 'teamIds', label: 'Teams', type: 'text', placeholder: 'Select teams', dynamicOptions: 'teams' },
      { key: 'subject', label: 'Notification Title', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Use {{leadName}}, {{leadEmail}} for context' },
      {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Normal', value: 'normal' },
          { label: 'High', value: 'high' },
          { label: 'Urgent', value: 'urgent' }
        ]
      },
      { key: 'actionUrl', label: 'Action URL', type: 'text', placeholder: 'Optional link to include' },
      { key: 'includeLeadInfo', label: 'Include Lead Information', type: 'checkbox' }
    ]
  },

  // LEAD MANAGEMENT ACTIONS - Enhanced
  {
    type: 'update-lead',
    label: 'Update Lead',
    icon: 'UserCog',
    category: 'Lead Management',
    defaultConfig: {
      updates: [],
      updateType: 'status',
      newStatus: '',
      tags: [],
      tagsAction: 'add',
      customFields: {},
      scoreChange: 0,
      scoreChangeReason: '',
      priority: '',
      source: '',
      programInterest: ''
    },
    configSchema: [
      {
        key: 'updateType',
        label: 'What to Update',
        type: 'select',
        options: [
          { label: 'Change Status', value: 'status' },
          { label: 'Modify Tags', value: 'tags' },
          { label: 'Update Lead Score', value: 'score' },
          { label: 'Change Priority', value: 'priority' },
          { label: 'Update Source', value: 'source' },
          { label: 'Update Program Interest', value: 'program' },
          { label: 'Update Custom Fields', value: 'custom_fields' },
          { label: 'Multiple Updates', value: 'multiple' }
        ]
      },
      { 
        key: 'newStatus', 
        label: 'New Status', 
        type: 'select',
        options: [
          { label: 'New Inquiry', value: 'New Inquiry' },
          { label: 'Requirements Approved', value: 'Requirements Approved' },
          { label: 'Payment Received', value: 'Payment Received' },
          { label: 'Registered', value: 'Registered' },
          { label: 'Admitted', value: 'Admitted' },
          { label: 'Dismissed', value: 'Dismissed' }
        ]
      },
      {
        key: 'tagsAction',
        label: 'Tags Action',
        type: 'select',
        options: [
          { label: 'Add Tags', value: 'add' },
          { label: 'Remove Tags', value: 'remove' },
          { label: 'Replace All Tags', value: 'replace' }
        ]
      },
      { key: 'tags', label: 'Tags', type: 'text', placeholder: 'Comma-separated tags (e.g., hot-lead, contacted, qualified)' },
      { key: 'scoreChange', label: 'Score Change', type: 'number', placeholder: 'Enter positive or negative number' },
      { key: 'scoreChangeReason', label: 'Score Change Reason', type: 'text', placeholder: 'Reason for score adjustment' },
      {
        key: 'priority',
        label: 'New Priority',
        type: 'select',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
          { label: 'Critical', value: 'critical' }
        ]
      },
      { key: 'programInterest', label: 'Program Interest', type: 'select', dynamicOptions: 'programs' },
      { key: 'customFields', label: 'Custom Fields (JSON)', type: 'textarea', placeholder: '{"fieldName": "value"}' }
    ]
  },
  
  // Enhanced Assign Advisor
  {
    type: 'assign-advisor',
    label: 'Assign to Advisor',
    icon: 'UserCheck',
    category: 'Lead Management',
    defaultConfig: {
      assignmentMethod: 'round_robin',
      specificAdvisorId: '',
      teamId: '',
      considerWorkload: true,
      considerPerformance: false,
      notifyAdvisor: true,
      fallbackMethod: 'round_robin'
    },
    configSchema: [
      {
        key: 'assignmentMethod',
        label: 'Assignment Method',
        type: 'select',
        options: [
          { label: 'Round Robin', value: 'round_robin' },
          { label: 'Specific Advisor', value: 'specific' },
          { label: 'Load Balanced (by capacity)', value: 'load_balanced' },
          { label: 'Performance Based', value: 'performance_based' },
          { label: 'Team Assignment', value: 'team' },
          { label: 'Random', value: 'random' }
        ]
      },
      { key: 'specificAdvisorId', label: 'Specific Advisor', type: 'select', dynamicOptions: 'advisors' },
      { key: 'teamId', label: 'Team', type: 'select', dynamicOptions: 'teams' },
      { key: 'considerWorkload', label: 'Consider Current Workload', type: 'checkbox' },
      { key: 'considerPerformance', label: 'Prioritize High Performers', type: 'checkbox' },
      { key: 'notifyAdvisor', label: 'Notify Assigned Advisor', type: 'checkbox' },
      {
        key: 'fallbackMethod',
        label: 'Fallback Method (if primary fails)',
        type: 'select',
        options: [
          { label: 'Round Robin', value: 'round_robin' },
          { label: 'Assign to Admin', value: 'admin' },
          { label: 'Leave Unassigned', value: 'none' }
        ]
      }
    ]
  },
  
  // Enhanced Change Enrollment Stage
  {
    type: 'change-enrollment-stage',
    label: 'Change Journey Stage',
    icon: 'Milestone',
    category: 'Lead Management',
    defaultConfig: {
      stageType: 'specific',
      newStage: '',
      advanceBy: 1,
      journeyId: ''
    },
    configSchema: [
      {
        key: 'stageType',
        label: 'Stage Change Type',
        type: 'select',
        options: [
          { label: 'Move to Specific Stage', value: 'specific' },
          { label: 'Advance to Next Stage', value: 'advance' },
          { label: 'Move Back to Previous Stage', value: 'regress' }
        ]
      },
      {
        key: 'newStage',
        label: 'Target Stage',
        type: 'select',
        options: [
          { label: 'Inquiry', value: 'inquiry' },
          { label: 'Application Started', value: 'application_started' },
          { label: 'Documents Submitted', value: 'documents_submitted' },
          { label: 'Under Review', value: 'under_review' },
          { label: 'Admitted', value: 'admitted' },
          { label: 'Enrolled', value: 'enrolled' },
          { label: 'Registered', value: 'registered' }
        ],
        dynamicOptions: 'journeyStages'
      },
      { key: 'advanceBy', label: 'Advance/Regress By (stages)', type: 'number', placeholder: '1' },
      { key: 'journeyId', label: 'Specific Journey', type: 'select', dynamicOptions: 'journeys' }
    ]
  },

  // TASK & CALENDAR ACTIONS - Enhanced
  {
    type: 'create-task',
    label: 'Create Task',
    icon: 'CheckSquare',
    category: 'Tasks & Calendar',
    defaultConfig: {
      taskTitle: '',
      taskDescription: '',
      taskType: 'follow_up',
      assignTo: 'lead_advisor',
      specificAssignee: '',
      dueInDays: 1,
      dueAtTime: '09:00',
      priority: 'medium',
      reminder: 'none',
      recurring: false,
      recurringPattern: 'daily',
      linkedToLead: true
    },
    configSchema: [
      { key: 'taskTitle', label: 'Task Title', type: 'text', placeholder: 'e.g., Follow up with {{firstName}} about {{programName}}' },
      { key: 'taskDescription', label: 'Task Description', type: 'textarea', placeholder: 'Detailed instructions for the task' },
      {
        key: 'taskType',
        label: 'Task Type',
        type: 'select',
        options: [
          { label: 'Follow Up', value: 'follow_up' },
          { label: 'Phone Call', value: 'call' },
          { label: 'Send Email', value: 'email' },
          { label: 'Schedule Meeting', value: 'meeting' },
          { label: 'Document Review', value: 'review' },
          { label: 'Research', value: 'research' },
          { label: 'Other', value: 'other' }
        ]
      },
      {
        key: 'assignTo',
        label: 'Assign To',
        type: 'select',
        options: [
          { label: "Lead's Assigned Advisor", value: 'lead_advisor' },
          { label: 'Specific Team Member', value: 'specific' },
          { label: 'Workflow Creator', value: 'creator' },
          { label: 'Unassigned (Pool)', value: 'unassigned' }
        ]
      },
      { key: 'specificAssignee', label: 'Specific Assignee', type: 'select', dynamicOptions: 'teamMembers' },
      { key: 'dueInDays', label: 'Due In (days)', type: 'number', placeholder: '1' },
      { key: 'dueAtTime', label: 'Due At Time', type: 'text', placeholder: '09:00' },
      {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' }
        ]
      },
      {
        key: 'reminder',
        label: 'Reminder',
        type: 'select',
        options: [
          { label: 'No Reminder', value: 'none' },
          { label: '15 minutes before', value: '15min' },
          { label: '1 hour before', value: '1hour' },
          { label: '1 day before', value: '1day' },
          { label: 'At due time', value: 'at_due' }
        ]
      },
      { key: 'recurring', label: 'Recurring Task', type: 'checkbox' },
      {
        key: 'recurringPattern',
        label: 'Recurring Pattern',
        type: 'select',
        options: [
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Bi-weekly', value: 'biweekly' },
          { label: 'Monthly', value: 'monthly' }
        ]
      },
      { key: 'linkedToLead', label: 'Link Task to Lead', type: 'checkbox' }
    ]
  },
  
  // Enhanced Calendar Event
  {
    type: 'create-calendar-event',
    label: 'Create Calendar Event',
    icon: 'Calendar',
    category: 'Tasks & Calendar',
    defaultConfig: {
      eventTitle: '',
      eventDescription: '',
      eventType: 'meeting',
      duration: 30,
      scheduleIn: { value: 1, unit: 'days' },
      preferredTime: '10:00',
      inviteAdvisor: true,
      inviteLead: true,
      additionalAttendees: [],
      locationType: 'virtual',
      meetingLink: '',
      physicalLocation: '',
      sendReminders: true,
      reminderTimes: ['1day', '1hour']
    },
    configSchema: [
      { key: 'eventTitle', label: 'Event Title', type: 'text', placeholder: 'Meeting with {{firstName}} {{lastName}}' },
      { key: 'eventDescription', label: 'Description', type: 'textarea' },
      {
        key: 'eventType',
        label: 'Event Type',
        type: 'select',
        options: [
          { label: 'Meeting', value: 'meeting' },
          { label: 'Phone Call', value: 'call' },
          { label: 'Campus Tour', value: 'tour' },
          { label: 'Interview', value: 'interview' },
          { label: 'Webinar', value: 'webinar' },
          { label: 'Other', value: 'other' }
        ]
      },
      { key: 'duration', label: 'Duration (minutes)', type: 'number', placeholder: '30' },
      { key: 'scheduleIn.value', label: 'Schedule In', type: 'number', placeholder: '1' },
      {
        key: 'scheduleIn.unit',
        label: 'Time Unit',
        type: 'select',
        options: [
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' },
          { label: 'Weeks', value: 'weeks' }
        ]
      },
      { key: 'preferredTime', label: 'Preferred Time', type: 'text', placeholder: '10:00' },
      { key: 'inviteAdvisor', label: 'Invite Assigned Advisor', type: 'checkbox' },
      { key: 'inviteLead', label: 'Invite Lead', type: 'checkbox' },
      { key: 'additionalAttendees', label: 'Additional Attendees (emails)', type: 'text', placeholder: 'Comma-separated emails' },
      {
        key: 'locationType',
        label: 'Location Type',
        type: 'select',
        options: [
          { label: 'Virtual (Video Call)', value: 'virtual' },
          { label: 'Phone', value: 'phone' },
          { label: 'In-Person', value: 'in_person' }
        ]
      },
      { key: 'meetingLink', label: 'Meeting Link', type: 'text', placeholder: 'Auto-generated or custom URL' },
      { key: 'physicalLocation', label: 'Physical Location', type: 'text', placeholder: 'Address or room name' },
      { key: 'sendReminders', label: 'Send Reminders', type: 'checkbox' },
      { key: 'reminderTimes', label: 'Reminder Times', type: 'text', placeholder: '1day, 1hour' }
    ]
  },

  // FLOW CONTROL - Enhanced
  {
    type: 'condition',
    label: 'If/Else Branch',
    icon: 'GitBranch',
    category: 'Flow Control',
    defaultConfig: {
      conditionGroups: [],
      evaluationMode: 'AND',
      trueBranch: [],
      falseBranch: []
    },
    configSchema: [
      {
        key: 'conditionGroups',
        label: 'Branch Conditions',
        type: 'array',
        helpText: 'Define conditions - if TRUE, execute true branch; otherwise execute false branch'
      },
      {
        key: 'evaluationMode',
        label: 'Evaluation Mode',
        type: 'select',
        options: [
          { label: 'ALL conditions must match (AND)', value: 'AND' },
          { label: 'ANY condition must match (OR)', value: 'OR' }
        ]
      }
    ]
  },
  
  // Enhanced Wait/Delay
  {
    type: 'wait',
    label: 'Wait/Delay',
    icon: 'Clock',
    category: 'Flow Control',
    defaultConfig: {
      waitType: 'duration',
      waitTime: { value: 1, unit: 'days' },
      waitUntilDate: null,
      waitUntilCondition: null,
      businessHoursOnly: false,
      timezone: 'America/New_York',
      maxWaitDays: 30
    },
    configSchema: [
      {
        key: 'waitType',
        label: 'Wait Type',
        type: 'select',
        options: [
          { label: 'Fixed Duration', value: 'duration' },
          { label: 'Until Specific Date/Time', value: 'until_date' },
          { label: 'Until Condition Met', value: 'until_condition' },
          { label: 'Until Business Hours', value: 'business_hours' }
        ]
      },
      { key: 'waitTime.value', label: 'Wait Duration', type: 'number' },
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
      },
      { key: 'waitUntilDate', label: 'Wait Until Date', type: 'text', placeholder: 'YYYY-MM-DD HH:MM' },
      { key: 'businessHoursOnly', label: 'Resume Only During Business Hours', type: 'checkbox' },
      {
        key: 'timezone',
        label: 'Timezone',
        type: 'select',
        options: [
          { label: 'Eastern (US)', value: 'America/New_York' },
          { label: 'Central (US)', value: 'America/Chicago' },
          { label: 'Pacific (US)', value: 'America/Los_Angeles' },
          { label: 'UTC', value: 'UTC' }
        ]
      },
      { key: 'maxWaitDays', label: 'Maximum Wait (days)', type: 'number', placeholder: 'Exit workflow if exceeded' }
    ]
  },
  
  // A/B Split Test
  {
    type: 'split',
    label: 'A/B Split Test',
    icon: 'Split',
    category: 'Flow Control',
    defaultConfig: {
      splitPercentage: 50,
      variantAName: 'Variant A',
      variantBName: 'Variant B',
      trackConversions: true,
      conversionGoal: ''
    },
    configSchema: [
      { key: 'splitPercentage', label: 'Variant A Percentage', type: 'number', placeholder: '0-100' },
      { key: 'variantAName', label: 'Variant A Name', type: 'text' },
      { key: 'variantBName', label: 'Variant B Name', type: 'text' },
      { key: 'trackConversions', label: 'Track Conversion Rate', type: 'checkbox' },
      { key: 'conversionGoal', label: 'Conversion Goal', type: 'text', placeholder: 'e.g., application_submitted, enrolled' }
    ]
  },
  
  // Go to Another Workflow
  {
    type: 'go-to-workflow',
    label: 'Go to Another Workflow',
    icon: 'ArrowRightCircle',
    category: 'Flow Control',
    defaultConfig: {
      targetWorkflowId: '',
      removeFromCurrent: true,
      preserveHistory: true
    },
    configSchema: [
      { key: 'targetWorkflowId', label: 'Target Workflow', type: 'select', dynamicOptions: 'workflows' },
      { key: 'removeFromCurrent', label: 'Remove from Current Workflow', type: 'checkbox' },
      { key: 'preserveHistory', label: 'Preserve Step History', type: 'checkbox' }
    ]
  },
  
  // End Workflow
  {
    type: 'end-workflow',
    label: 'End Workflow',
    icon: 'StopCircle',
    category: 'Flow Control',
    defaultConfig: {
      reason: 'completed',
      customReason: '',
      logCompletion: true,
      updateLeadOnExit: false,
      exitStatus: ''
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
          { label: 'Disqualified', value: 'disqualified' },
          { label: 'Moved to Another Workflow', value: 'transferred' },
          { label: 'Manual Exit', value: 'manual' },
          { label: 'Custom Reason', value: 'custom' }
        ]
      },
      { key: 'customReason', label: 'Custom Reason', type: 'text' },
      { key: 'logCompletion', label: 'Log Completion Event', type: 'checkbox' },
      { key: 'updateLeadOnExit', label: 'Update Lead Status on Exit', type: 'checkbox' },
      { key: 'exitStatus', label: 'Set Lead Status To', type: 'select', dynamicOptions: 'leadStatuses' }
    ]
  },

  // INTEGRATIONS
  {
    type: 'webhook',
    label: 'Send Webhook',
    icon: 'Webhook',
    category: 'Integrations',
    defaultConfig: {
      url: '',
      method: 'POST',
      headers: {},
      payload: '{}',
      includeLeadData: true,
      retryOnFailure: true,
      maxRetries: 3
    },
    configSchema: [
      { key: 'url', label: 'Webhook URL', type: 'text', placeholder: 'https://...' },
      {
        key: 'method',
        label: 'HTTP Method',
        type: 'select',
        options: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'PATCH', value: 'PATCH' }
        ]
      },
      { key: 'headers', label: 'Custom Headers (JSON)', type: 'textarea', placeholder: '{"Authorization": "Bearer ..."}' },
      { key: 'payload', label: 'Custom Payload (JSON)', type: 'textarea', placeholder: '{"key": "value"}' },
      { key: 'includeLeadData', label: 'Include Lead Data in Payload', type: 'checkbox' },
      { key: 'retryOnFailure', label: 'Retry on Failure', type: 'checkbox' },
      { key: 'maxRetries', label: 'Max Retries', type: 'number', placeholder: '3' }
    ]
  },
  
  // Add to List/Segment
  {
    type: 'add-to-list',
    label: 'Add to List/Segment',
    icon: 'ListPlus',
    category: 'Lead Management',
    defaultConfig: {
      listType: 'static',
      listId: '',
      createIfNotExists: false,
      newListName: ''
    },
    configSchema: [
      {
        key: 'listType',
        label: 'List Type',
        type: 'select',
        options: [
          { label: 'Static List', value: 'static' },
          { label: 'Audience Segment', value: 'segment' }
        ]
      },
      { key: 'listId', label: 'Select List', type: 'select', dynamicOptions: 'lists' },
      { key: 'createIfNotExists', label: 'Create List if Not Exists', type: 'checkbox' },
      { key: 'newListName', label: 'New List Name', type: 'text' }
    ]
  },
  
  // Remove from List
  {
    type: 'remove-from-list',
    label: 'Remove from List',
    icon: 'ListMinus',
    category: 'Lead Management',
    defaultConfig: {
      listId: ''
    },
    configSchema: [
      { key: 'listId', label: 'Select List', type: 'select', dynamicOptions: 'lists' }
    ]
  },
  
  // Schedule Follow-up
  {
    type: 'schedule-followup',
    label: 'Schedule Follow-up',
    icon: 'CalendarClock',
    category: 'Tasks & Calendar',
    defaultConfig: {
      followupType: 'call',
      daysUntil: 3,
      preferredTime: '10:00',
      notes: '',
      assignTo: 'lead_advisor',
      createReminder: true
    },
    configSchema: [
      {
        key: 'followupType',
        label: 'Follow-up Type',
        type: 'select',
        options: [
          { label: 'Phone Call', value: 'call' },
          { label: 'Email', value: 'email' },
          { label: 'Meeting', value: 'meeting' },
          { label: 'Check-in', value: 'checkin' }
        ]
      },
      { key: 'daysUntil', label: 'Days Until Follow-up', type: 'number' },
      { key: 'preferredTime', label: 'Preferred Time', type: 'text', placeholder: '10:00' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      {
        key: 'assignTo',
        label: 'Assign To',
        type: 'select',
        options: [
          { label: "Lead's Advisor", value: 'lead_advisor' },
          { label: 'Specific Person', value: 'specific' }
        ]
      },
      { key: 'createReminder', label: 'Create Reminder', type: 'checkbox' }
    ]
  }
];

export default workflowElementTypes;
