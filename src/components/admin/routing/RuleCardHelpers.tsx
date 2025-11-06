import { RuleCondition, ConditionGroup } from '@/types/routing';
import { Badge } from '@/components/ui/badge';
import { Users, Target, MapPin, Star, Shuffle, Scale } from 'lucide-react';

// Format condition operator for display
export const formatOperator = (operator: string): string => {
  const operatorMap: Record<string, string> = {
    equals: '=',
    in: 'in',
    not_in: 'not in',
    greater_than: '>',
    less_than: '<',
    contains: 'contains',
    between: 'between'
  };
  return operatorMap[operator] || operator;
};

// Format field name for display
export const formatFieldName = (field: string): string => {
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format condition value for display
export const formatConditionValue = (value: any): string => {
  if (Array.isArray(value)) {
    return `[${value.join(', ')}]`;
  }
  if (typeof value === 'string') {
    return value.replace('_', ' ');
  }
  return String(value);
};

// Component to display a single condition
export const ConditionDisplay = ({ condition }: { condition: RuleCondition }) => {
  const operatorColorClass = 
    condition.operator === 'equals' ? 'text-success' :
    condition.operator === 'greater_than' ? 'text-info' :
    condition.operator === 'less_than' ? 'text-warning' :
    'text-foreground';

  return (
    <div className="text-xs flex items-center gap-1 flex-wrap">
      <span className="font-medium text-foreground/90">
        {condition.label || formatFieldName(condition.field)}
      </span>
      <span className={`font-semibold ${operatorColorClass}`}>
        {formatOperator(condition.operator)}
      </span>
      <span className="text-muted-foreground">
        {formatConditionValue(condition.value)}
      </span>
    </div>
  );
};

// Component to display condition groups
export const ConditionGroupsDisplay = ({ groups, maxVisible = 3 }: { groups: ConditionGroup[]; maxVisible?: number }) => {
  if (!groups || groups.length === 0) {
    return <p className="text-xs text-muted-foreground">No conditions</p>;
  }

  const totalConditions = groups.reduce((sum, group) => sum + group.conditions.length, 0);
  const visibleGroups = groups.slice(0, 1); // Show first group
  const visibleConditions = visibleGroups[0]?.conditions.slice(0, maxVisible) || [];
  const remainingConditions = totalConditions - visibleConditions.length;

  return (
    <div className="space-y-1">
      {visibleConditions.map((condition) => (
        <ConditionDisplay key={condition.id} condition={condition} />
      ))}
      {groups[0] && groups[0].conditions.length > 1 && visibleConditions.length < groups[0].conditions.length && (
        <Badge variant="outline" className="text-xs h-5 mt-1">
          {groups[0].operator}
        </Badge>
      )}
      {remainingConditions > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          +{remainingConditions} more condition{remainingConditions > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

// Get icon for assignment method
export const getAssignmentIcon = (method: string) => {
  switch (method) {
    case 'round_robin': return <Shuffle className="h-3.5 w-3.5" />;
    case 'geography': return <MapPin className="h-3.5 w-3.5" />;
    case 'performance': return <Star className="h-3.5 w-3.5" />;
    case 'priority_queue': return <Target className="h-3.5 w-3.5" />;
    case 'specialist_match': return <Users className="h-3.5 w-3.5" />;
    default: return <Users className="h-3.5 w-3.5" />;
  }
};

// Format assignment method name
export const formatMethodName = (method: string): string => {
  const methodMap: Record<string, string> = {
    round_robin: 'Round Robin',
    geography: 'Geographic',
    performance: 'Performance-Based',
    priority_queue: 'Priority Queue',
    specialist_match: 'Specialist Match'
  };
  return methodMap[method] || method.replace('_', ' ');
};

// Component to display assignment details
export const AssignmentDisplay = ({ config }: { config: any }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
          {getAssignmentIcon(config.method)}
        </div>
        <span className="text-xs font-semibold text-foreground/90">
          {formatMethodName(config.method)}
        </span>
      </div>
      
      {config.teams && config.teams.length > 0 && (
        <div className="text-xs text-muted-foreground">
          → {config.teams.length} team{config.teams.length > 1 ? 's' : ''}
        </div>
      )}
      
      {config.advisors && config.advisors.length > 0 && (
        <div className="text-xs text-muted-foreground">
          → {config.advisors.length} advisor{config.advisors.length > 1 ? 's' : ''}
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-1.5">
        {config.workload_balance && (
          <Badge variant="outline" className="text-xs h-5 bg-success/5 border-success/20 text-success">
            <Scale className="h-3 w-3 mr-1" />
            Balanced
          </Badge>
        )}
        {config.geographic_preference && (
          <Badge variant="outline" className="text-xs h-5 bg-info/5 border-info/20 text-info">
            <MapPin className="h-3 w-3 mr-1" />
            Geographic
          </Badge>
        )}
        {config.max_assignments_per_advisor && (
          <Badge variant="outline" className="text-xs h-5">
            Max: {config.max_assignments_per_advisor}/day
          </Badge>
        )}
      </div>
      
      {config.fallback_method && (
        <div className="text-xs text-muted-foreground mt-1">
          Fallback: {formatMethodName(config.fallback_method)}
        </div>
      )}
    </div>
  );
};

// Get priority color classes
export const getPriorityColor = (priority: number): { border: string; badge: string; text: string } => {
  if (priority >= 8) {
    return {
      border: 'border-l-destructive',
      badge: 'bg-gradient-to-r from-destructive/90 to-warning text-destructive-foreground',
      text: 'text-destructive'
    };
  } else if (priority >= 4) {
    return {
      border: 'border-l-primary',
      badge: 'bg-gradient-to-r from-primary to-info text-primary-foreground',
      text: 'text-primary'
    };
  } else {
    return {
      border: 'border-l-muted-foreground/30',
      badge: 'bg-muted text-muted-foreground',
      text: 'text-muted-foreground'
    };
  }
};
