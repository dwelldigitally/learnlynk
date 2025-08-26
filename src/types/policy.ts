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