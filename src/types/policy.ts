export interface PolicyCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface PolicyTrigger {
  id: string;
  event: string;
  conditions: PolicyCondition[];
  action: string;
  delay?: number;
}

export interface PolicyData {
  // Basic Info
  name: string;
  description: string;
  category: 'communication' | 'timing' | 'trigger' | 'quality' | 'compliance';
  icon: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  
  // Policy Type & Core Settings
  policyType: 'quiet_hours' | 'message_pacing' | 'stop_triggers' | 'confidence_bands' | 'sla_management' | 'yield_thresholds' | 'custom';
  settings: Record<string, any>;
  
  // Conditions & Rules
  conditions: PolicyCondition[];
  triggers: PolicyTrigger[];
  
  // Advanced Settings
  expectedLift: number;
  enforceOverrides: boolean;
  bypassConditions?: PolicyCondition[];
  
  // Metadata
  tags: string[];
  isTemplate: boolean;
}

export interface PolicyWizardProps {
  onClose: () => void;
  onSave: (policyData: PolicyData) => void;
  editingPolicy?: Partial<PolicyData>;
}

export const POLICY_CATEGORIES = [
  {
    id: 'communication',
    name: 'Communication',
    description: 'Rules for message timing, frequency, and delivery',
    icon: 'MessageSquare'
  },
  {
    id: 'timing',
    name: 'Timing',
    description: 'Schedule-based policies and time restrictions',
    icon: 'Clock'
  },
  {
    id: 'trigger',
    name: 'Trigger',
    description: 'Event-based automation and response policies',
    icon: 'Zap'
  },
  {
    id: 'quality',
    name: 'Quality',
    description: 'Content quality and confidence thresholds',
    icon: 'Shield'
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'Regulatory and business rule enforcement',
    icon: 'FileCheck'
  }
] as const;

export const POLICY_TYPES = [
  {
    id: 'quiet_hours',
    name: 'Quiet Hours',
    description: 'Restrict communications during specific time periods',
    category: 'timing',
    icon: 'Moon',
    template: {
      settings: {
        timeRanges: [{ start: '22:00', end: '08:00' }],
        timezone: 'America/New_York',
        emergencyOverride: true,
        channels: ['email', 'sms', 'phone']
      }
    }
  },
  {
    id: 'message_pacing',
    name: 'Message Pacing',
    description: 'Control message frequency and delivery intervals',
    category: 'communication',
    icon: 'Timer',
    template: {
      settings: {
        maxPerHour: 2,
        maxPerDay: 8,
        minInterval: 30,
        priorityBypass: true,
        channelLimits: {
          email: { maxPerDay: 5 },
          sms: { maxPerDay: 3 },
          phone: { maxPerDay: 2 }
        }
      }
    }
  },
  {
    id: 'stop_triggers',
    name: 'Stop Triggers',
    description: 'Halt communications based on specific events',
    category: 'trigger',
    icon: 'StopCircle',
    template: {
      settings: {
        triggers: ['unsubscribe', 'complaint', 'bounce'],
        gracePeriod: 24,
        exceptions: ['urgent_deadline'],
        autoReactivate: false
      }
    }
  },
  {
    id: 'confidence_bands',
    name: 'Confidence Bands',
    description: 'ML-based content quality and confidence thresholds',
    category: 'quality',
    icon: 'Target',
    template: {
      settings: {
        minConfidence: 0.7,
        thresholds: {
          high: { min: 0.9, action: 'auto_send' },
          medium: { min: 0.7, action: 'review_required' },
          low: { min: 0.5, action: 'block' }
        },
        fallbackAction: 'human_review'
      }
    }
  },
  {
    id: 'sla_management',
    name: 'SLA Management',
    description: 'Response time targets and escalation rules',
    category: 'compliance',
    icon: 'Clock3',
    template: {
      settings: {
        responseTargets: {
          inquiry: 24,
          application: 48,
          document_request: 12
        },
        escalationRules: {
          level1: 75,
          level2: 90,
          level3: 100
        },
        priorityMultipliers: {
          high: 0.5,
          urgent: 0.25
        }
      }
    }
  },
  {
    id: 'sentiment_monitoring',
    name: 'Sentiment Monitoring',
    description: 'Monitor and respond to negative sentiment patterns',
    category: 'quality',
    icon: 'Heart',
    template: {
      settings: {
        sentimentThreshold: -0.3,
        monitoringChannels: ['email', 'chat', 'phone'],
        escalationTriggers: {
          consecutiveNegative: 3,
          severityThreshold: -0.7
        },
        automaticActions: {
          pauseCommunication: true,
          notifyManager: true,
          requireHumanReview: true
        }
      }
    }
  },
  {
    id: 'engagement_velocity',
    name: 'Engagement Velocity',
    description: 'Adjust communication frequency based on engagement levels',
    category: 'communication',
    icon: 'TrendingUp',
    template: {
      settings: {
        highEngagement: { 
          threshold: 0.8, 
          multiplier: 1.5,
          channels: ['email', 'sms']
        },
        lowEngagement: { 
          threshold: 0.3, 
          multiplier: 0.5,
          cooldownPeriod: 72
        },
        zeroEngagement: {
          threshold: 0.1,
          action: 'pause_sequence',
          reviewRequired: true
        }
      }
    }
  },
  {
    id: 'channel_preferences',
    name: 'Channel Preferences',
    description: 'Respect individual communication channel preferences',
    category: 'communication',
    icon: 'Smartphone',
    template: {
      settings: {
        preferenceDetection: true,
        adaptiveChannels: ['email', 'sms', 'phone', 'chat'],
        fallbackOrder: ['email', 'sms', 'phone'],
        respectOptOuts: true,
        learningPeriod: 14
      }
    }
  },
  {
    id: 'deadline_urgency',
    name: 'Deadline Urgency',
    description: 'Escalate communication frequency as deadlines approach',
    category: 'timing',
    icon: 'AlertTriangle',
    template: {
      settings: {
        urgencyLevels: {
          normal: { daysOut: 14, frequency: 'standard' },
          elevated: { daysOut: 7, frequency: '1.5x' },
          critical: { daysOut: 3, frequency: '2x' },
          emergency: { daysOut: 1, frequency: '3x' }
        },
        channels: {
          normal: ['email'],
          elevated: ['email', 'sms'],
          critical: ['email', 'sms', 'phone'],
          emergency: ['all']
        }
      }
    }
  },
  {
    id: 'geographic_compliance',
    name: 'Geographic Compliance',
    description: 'Ensure communications comply with regional regulations',
    category: 'compliance',
    icon: 'Globe',
    template: {
      settings: {
        regions: {
          'GDPR': {
            countries: ['EU'],
            rules: ['explicit_consent', 'right_to_forget'],
            restrictions: ['marketing_limits']
          },
          'TCPA': {
            countries: ['US'],
            rules: ['written_consent_required'],
            restrictions: ['call_time_limits']
          },
          'CASL': {
            countries: ['CA'],
            rules: ['implied_consent_limits'],
            restrictions: ['unsubscribe_required']
          }
        },
        autoCompliance: true,
        auditTrail: true
      }
    }
  },
  {
    id: 'behavioral_triggers',
    name: 'Behavioral Triggers',
    description: 'Respond to specific user behaviors and actions',
    category: 'trigger',
    icon: 'Activity',
    template: {
      settings: {
        triggers: {
          website_visit: { action: 'send_followup', delay: 2 },
          document_download: { action: 'send_info', delay: 1 },
          email_open: { action: 'track_engagement', delay: 0 },
          application_start: { action: 'send_support', delay: 4 },
          page_abandonment: { action: 'send_reminder', delay: 24 }
        },
        cooldownPeriods: {
          same_trigger: 24,
          any_trigger: 4
        },
        priorityOverrides: ['application_deadline', 'enrollment_close']
      }
    }
  },
  {
    id: 'content_personalization',
    name: 'Content Personalization',
    description: 'Dynamically adjust content based on user profile and behavior',
    category: 'quality',
    icon: 'User',
    template: {
      settings: {
        personalizationFactors: {
          demographics: ['age', 'location', 'education'],
          interests: ['program_type', 'career_goals'],
          engagement: ['response_rate', 'open_rate', 'click_rate']
        },
        contentVariants: {
          formal: { trigger: 'professional_background' },
          casual: { trigger: 'young_demographic' },
          detailed: { trigger: 'high_engagement' },
          concise: { trigger: 'mobile_primary' }
        },
        abTestEnabled: true,
        learningEnabled: true
      }
    }
  },
  {
    id: 'workload_balancing',
    name: 'Workload Balancing',
    description: 'Distribute communications based on team capacity',
    category: 'compliance',
    icon: 'Users',
    template: {
      settings: {
        teamCapacity: {
          advisors: 50,
          specialists: 30,
          managers: 20
        },
        distributionRules: {
          newLeads: 'round_robin',
          followUps: 'assigned_advisor',
          escalations: 'available_manager'
        },
        overflowHandling: {
          threshold: 0.9,
          action: 'queue_delay',
          maxDelay: 24
        },
        priorityRouting: true
      }
    }
  },
  {
    id: 'seasonal_adjustments',
    name: 'Seasonal Adjustments',
    description: 'Adapt communication patterns for holidays and seasons',
    category: 'timing',
    icon: 'Calendar',
    template: {
      settings: {
        holidays: {
          'christmas': { 
            dates: ['12-24', '12-25', '12-26'],
            adjustment: 'pause_all'
          },
          'thanksgiving': {
            dates: ['11-28', '11-29'],
            adjustment: 'reduce_frequency'
          },
          'summer_break': {
            dates: ['06-15:08-15'],
            adjustment: 'timing_shift'
          }
        },
        seasonalPatterns: {
          enrollment_seasons: ['fall', 'spring'],
          peak_months: ['09', '01', '05'],
          slow_periods: ['12', '07', '08']
        },
        autoAdjustments: true
      }
    }
  },
  {
    id: 'custom',
    name: 'Custom Policy',
    description: 'Build a custom policy with flexible rules',
    category: 'compliance',
    icon: 'Settings',
    template: {
      settings: {}
    }
  }
] as const;

export const PRIORITY_LEVELS = [
  {
    value: 'low',
    label: 'Low',
    description: 'Nice to have, minimal impact',
    color: 'text-muted-foreground'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Important for operations',
    color: 'text-blue-600'
  },
  {
    value: 'high',
    label: 'High',
    description: 'Critical for compliance',
    color: 'text-orange-600'
  },
  {
    value: 'critical',
    label: 'Critical',
    description: 'System-level enforcement',
    color: 'text-red-600'
  }
] as const;