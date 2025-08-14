import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Building, Hash, Calendar, Target } from 'lucide-react';

interface ScoringRule {
  id: string;
  name: string;
  field: string;
  condition: string;
  value: string | any[];
  points: number;
  enabled: boolean;
  order_index?: number;
  description?: string;
}

interface RuleGroupingProps {
  rules: ScoringRule[];
  children: (groupedRules: { [key: string]: ScoringRule[] }) => React.ReactNode;
}

export function RuleGrouping({ rules, children }: RuleGroupingProps) {
  const groupedRules = rules.reduce((groups, rule) => {
    const type = getRuleType(rule.condition);
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(rule);
    return groups;
  }, {} as { [key: string]: ScoringRule[] });

  return <>{children(groupedRules)}</>;
}

function getRuleType(condition: string): string {
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
      return 'Time Penalties';
    default:
      return 'Simple Rules';
  }
}

interface RuleGroupCardProps {
  title: string;
  rules: ScoringRule[];
  icon: React.ReactNode;
  colorClass: string;
  children: React.ReactNode;
}

export function RuleGroupCard({ title, rules, icon, colorClass, children }: RuleGroupCardProps) {
  const totalPoints = rules.filter(r => r.enabled).reduce((sum, rule) => {
    // For complex rules, calculate total from conditions
    if (typeof rule.value === 'string' && rule.value.startsWith('[')) {
      try {
        const conditions = JSON.parse(rule.value);
        if (Array.isArray(conditions)) {
          return sum + conditions.reduce((condSum, cond) => condSum + (cond.points || 0), 0);
        }
      } catch {
        // Fallback to rule points
      }
    }
    return sum + rule.points;
  }, 0);

  const activeRules = rules.filter(r => r.enabled).length;

  return (
    <Card className={`border-l-4 ${colorClass}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {activeRules} active
            </Badge>
            <Badge variant={totalPoints > 0 ? "default" : "destructive"} className="text-sm">
              {totalPoints > 0 ? '+' : ''}{totalPoints} pts
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

export function getRuleGroupProps(groupType: string) {
  switch (groupType) {
    case 'Domain Analysis':
      return {
        icon: <Mail className="h-5 w-5" />,
        colorClass: 'border-l-blue-400',
      };
    case 'Geographic':
      return {
        icon: <MapPin className="h-5 w-5" />,
        colorClass: 'border-l-green-400',
      };
    case 'Categorical':
      return {
        icon: <Building className="h-5 w-5" />,
        colorClass: 'border-l-purple-400',
      };
    case 'Numeric Range':
      return {
        icon: <Hash className="h-5 w-5" />,
        colorClass: 'border-l-orange-400',
      };
    case 'Time Penalties':
      return {
        icon: <Calendar className="h-5 w-5" />,
        colorClass: 'border-l-red-400',
      };
    default:
      return {
        icon: <Target className="h-5 w-5" />,
        colorClass: 'border-l-gray-400',
      };
  }
}