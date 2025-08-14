import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Building, Calendar, Hash, Target } from 'lucide-react';

interface RuleTypeDisplayProps {
  rule: {
    condition: string;
    value: string | any[];
    points: number;
    field: string;
    name: string;
    description?: string;
  };
}

export function RuleTypeDisplay({ rule }: RuleTypeDisplayProps) {
  const getRuleTypeIcon = (condition: string) => {
    switch (condition) {
      case 'domain_analysis':
        return <Mail className="h-4 w-4" />;
      case 'geographic':
        return <MapPin className="h-4 w-4" />;
      case 'categorical':
        return <Building className="h-4 w-4" />;
      case 'numeric_range':
        return <Hash className="h-4 w-4" />;
      case 'penalty':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getRuleTypeLabel = (condition: string) => {
    switch (condition) {
      case 'domain_analysis':
        return 'Domain Analysis';
      case 'geographic':
        return 'Geographic';
      case 'categorical':
        return 'Categorical';
      case 'numeric_range':
        return 'Numeric Range';
      case 'penalty':
        return 'Time Penalty';
      default:
        return 'Simple Rule';
    }
  };

  const getRuleTypeColor = (condition: string) => {
    switch (condition) {
      case 'domain_analysis':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'geographic':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'categorical':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'numeric_range':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'penalty':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-l-4 border-l-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${getRuleTypeColor(rule.condition)} flex items-center gap-1`}>
              {getRuleTypeIcon(rule.condition)}
              {getRuleTypeLabel(rule.condition)}
            </Badge>
            <h4 className="font-semibold">{rule.name}</h4>
          </div>
          <Badge variant={rule.points > 0 ? "default" : "destructive"} className="text-sm">
            {rule.points > 0 ? '+' : ''}{rule.points} pts
          </Badge>
        </div>

        {rule.description && (
          <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
        )}

        <div className="space-y-2">
          {rule.condition === 'domain_analysis' && <DomainAnalysisDisplay value={rule.value} />}
          {rule.condition === 'geographic' && <GeographicDisplay value={rule.value} />}
          {rule.condition === 'categorical' && <CategoricalDisplay value={rule.value} />}
          {rule.condition === 'numeric_range' && <NumericRangeDisplay value={rule.value} />}
          {rule.condition === 'penalty' && <PenaltyDisplay value={rule.value} />}
          {!['domain_analysis', 'geographic', 'categorical', 'numeric_range', 'penalty'].includes(rule.condition) && (
            <SimpleRuleDisplay condition={rule.condition} value={rule.value} field={rule.field} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DomainAnalysisDisplay({ value }: { value: any }) {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return <p className="text-sm">Invalid domain analysis data</p>;
    }
  }

  if (!Array.isArray(value)) return <p className="text-sm">Invalid domain analysis data</p>;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Domain scoring conditions:</p>
      <div className="grid grid-cols-1 gap-2">
        {value.map((condition: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm bg-muted/50 rounded px-3 py-2">
            <span>
              {condition.condition === 'ends_with' && `Ends with "${condition.value}"`}
              {condition.condition === 'contains' && `Contains "${condition.value}"`}
              {condition.condition === 'equals' && `Equals "${condition.value}"`}
            </span>
            <Badge variant={condition.points > 0 ? "default" : "destructive"} className="text-xs">
              {condition.points > 0 ? '+' : ''}{condition.points}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeographicDisplay({ value }: { value: any }) {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return <p className="text-sm">Invalid geographic data</p>;
    }
  }

  if (!Array.isArray(value)) return <p className="text-sm">Invalid geographic data</p>;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Geographic targeting:</p>
      <div className="grid grid-cols-1 gap-2">
        {value.map((condition: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm bg-muted/50 rounded px-3 py-2">
            <span>
              {condition.condition === 'state_in' && `State in: ${Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}`}
              {condition.condition === 'country_equals' && `Country: ${condition.value}`}
              {condition.condition === 'city_tier' && `City tier: ${condition.value}`}
            </span>
            <Badge variant={condition.points > 0 ? "default" : "destructive"} className="text-xs">
              {condition.points > 0 ? '+' : ''}{condition.points}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoricalDisplay({ value }: { value: any }) {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return <p className="text-sm">Invalid categorical data</p>;
    }
  }

  if (!Array.isArray(value)) return <p className="text-sm">Invalid categorical data</p>;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Category values:</p>
      <div className="grid grid-cols-1 gap-2">
        {value.map((condition: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm bg-muted/50 rounded px-3 py-2">
            <span>{condition.value}</span>
            <Badge variant={condition.points > 0 ? "default" : "destructive"} className="text-xs">
              {condition.points > 0 ? '+' : ''}{condition.points}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function NumericRangeDisplay({ value }: { value: any }) {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return <p className="text-sm">Invalid numeric range data</p>;
    }
  }

  if (!Array.isArray(value)) return <p className="text-sm">Invalid numeric range data</p>;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Numeric ranges:</p>
      <div className="grid grid-cols-1 gap-2">
        {value.map((condition: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm bg-muted/50 rounded px-3 py-2">
            <span>
              {condition.condition === 'between' && `Between ${condition.min} - ${condition.max}`}
              {condition.condition === 'greater_than' && `Greater than ${condition.value}`}
              {condition.condition === 'less_than' && `Less than ${condition.value}`}
            </span>
            <Badge variant={condition.points > 0 ? "default" : "destructive"} className="text-xs">
              {condition.points > 0 ? '+' : ''}{condition.points}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function PenaltyDisplay({ value }: { value: any }) {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return <p className="text-sm">Invalid penalty data</p>;
    }
  }

  if (!Array.isArray(value)) return <p className="text-sm">Invalid penalty data</p>;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Time-based penalties:</p>
      <div className="grid grid-cols-1 gap-2">
        {value.map((condition: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm bg-muted/50 rounded px-3 py-2">
            <span>
              {condition.condition === 'days_since_contact' && `${condition.days} days without contact`}
              {condition.condition === 'days_since_created' && `${condition.days} days since created`}
            </span>
            <Badge variant="destructive" className="text-xs">
              {condition.points}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleRuleDisplay({ condition, value, field }: { condition: string; value: any; field: string }) {
  const conditionLabels: Record<string, string> = {
    equals: 'equals',
    contains: 'contains',
    not_equals: 'does not equal',
    starts_with: 'starts with',
    ends_with: 'ends with'
  };

  return (
    <div className="text-sm bg-muted/50 rounded px-3 py-2">
      <span className="font-medium">{field}</span> {conditionLabels[condition] || condition} <span className="font-medium">"{value}"</span>
    </div>
  );
}