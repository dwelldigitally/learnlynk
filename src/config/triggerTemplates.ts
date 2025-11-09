import { ConditionGroup } from '@/types/universalBuilder';

export interface TriggerTemplate {
  id: string;
  name: string;
  description: string;
  category: 'source' | 'engagement' | 'academic' | 'geographic' | 'timing';
  icon: string;
  conditionGroups: ConditionGroup[];
}

export const triggerTemplates: TriggerTemplate[] = [
  {
    id: 'web-lead',
    name: 'New Web Lead',
    description: 'Trigger when a lead comes from web form',
    category: 'source',
    icon: 'Globe',
    conditionGroups: [
      {
        id: 'group-1',
        operator: 'AND',
        conditions: [
          {
            id: 'cond-1',
            field: 'source',
            fieldType: 'select',
            operator: 'is',
            value: ['Web']
          }
        ]
      }
    ]
  },
  {
    id: 'high-priority',
    name: 'High Priority Lead',
    description: 'Trigger for leads with high scores or priority',
    category: 'engagement',
    icon: 'Star',
    conditionGroups: [
      {
        id: 'group-1',
        operator: 'OR',
        conditions: [
          {
            id: 'cond-1',
            field: 'lead_score',
            fieldType: 'numeric',
            operator: 'greater_than',
            value: '80'
          },
          {
            id: 'cond-2',
            field: 'priority',
            fieldType: 'select',
            operator: 'is',
            value: ['High']
          }
        ]
      }
    ]
  },
  {
    id: 'program-specific',
    name: 'Health Care Program Interest',
    description: 'Trigger when lead is interested in Health Care Assistant',
    category: 'academic',
    icon: 'Heart',
    conditionGroups: [
      {
        id: 'group-1',
        operator: 'AND',
        conditions: [
          {
            id: 'cond-1',
            field: 'program_interest',
            fieldType: 'array',
            operator: 'contains_any',
            value: ['Health Care Assistant']
          }
        ]
      }
    ]
  },
  {
    id: 'geographic-local',
    name: 'Local Leads',
    description: 'Trigger for leads from specific geographic area',
    category: 'geographic',
    icon: 'MapPin',
    conditionGroups: [
      {
        id: 'group-1',
        operator: 'AND',
        conditions: [
          {
            id: 'cond-1',
            field: 'country',
            fieldType: 'select',
            operator: 'is',
            value: ['Canada']
          },
          {
            id: 'cond-2',
            field: 'state',
            fieldType: 'select',
            operator: 'is',
            value: ['Manitoba']
          }
        ]
      }
    ]
  },
  {
    id: 'international-student',
    name: 'International Students',
    description: 'Trigger for international student leads',
    category: 'geographic',
    icon: 'Plane',
    conditionGroups: [
      {
        id: 'group-1',
        operator: 'AND',
        conditions: [
          {
            id: 'cond-1',
            field: 'student_type',
            fieldType: 'select',
            operator: 'is',
            value: ['International']
          }
        ]
      }
    ]
  },
  {
    id: 're-engagement',
    name: 'Re-engagement Campaign',
    description: 'Trigger for leads not contacted in 30+ days',
    category: 'timing',
    icon: 'Clock',
    conditionGroups: [
      {
        id: 'group-1',
        operator: 'AND',
        conditions: [
          {
            id: 'cond-1',
            field: 'last_contacted_at',
            fieldType: 'date',
            operator: 'is_older_than',
            value: ['30', 'days']
          }
        ]
      }
    ]
  },
  {
    id: 'qualified-stage',
    name: 'Qualified Leads',
    description: 'Trigger when lead reaches qualified stage',
    category: 'engagement',
    icon: 'CheckCircle',
    conditionGroups: [
      {
        id: 'group-1',
        operator: 'AND',
        conditions: [
          {
            id: 'cond-1',
            field: 'qualification_stage',
            fieldType: 'select',
            operator: 'is',
            value: ['Qualified']
          }
        ]
      }
    ]
  },
  {
    id: 'social-media-leads',
    name: 'Social Media Leads',
    description: 'Trigger for leads from social media channels',
    category: 'source',
    icon: 'Share2',
    conditionGroups: [
      {
        id: 'group-1',
        operator: 'AND',
        conditions: [
          {
            id: 'cond-1',
            field: 'source',
            fieldType: 'select',
            operator: 'is',
            value: ['Social Media']
          }
        ]
      }
    ]
  }
];
