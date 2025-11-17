import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Phone,
  Mail,
  UserPlus,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'custom';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  icon: any;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  category: 'calls' | 'emails' | 'conversions' | 'revenue';
}

interface PerformanceMetric {
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  icon: any;
}

export function GoalsPerformanceTracker() {
  const [selectedRange, setSelectedRange] = useState<DateRange>('week');
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());

  const dateRanges = [
    { value: 'today' as DateRange, label: 'Today' },
    { value: 'week' as DateRange, label: 'This Week' },
    { value: 'month' as DateRange, label: 'This Month' },
    { value: 'quarter' as DateRange, label: 'This Quarter' },
  ];

  const getDateRangeLabel = () => {
    const now = new Date();
    switch (selectedRange) {
      case 'today':
        return format(now, 'MMMM d, yyyy');
      case 'week':
        return `${format(startOfWeek(now), 'MMM d')} - ${format(endOfWeek(now), 'MMM d, yyyy')}`;
      case 'month':
        return format(now, 'MMMM yyyy');
      case 'quarter':
        return `Q${Math.floor(now.getMonth() / 3) + 1} ${format(now, 'yyyy')}`;
      default:
        return '';
    }
  };

  // Mock goals data - would come from backend
  const goals: Goal[] = [
    {
      id: '1',
      name: 'Outbound Calls',
      target: 50,
      current: 38,
      unit: 'calls',
      icon: Phone,
      priority: 'high',
      deadline: '2024-01-31',
      category: 'calls'
    },
    {
      id: '2',
      name: 'Email Outreach',
      target: 100,
      current: 87,
      unit: 'emails',
      icon: Mail,
      priority: 'high',
      deadline: '2024-01-31',
      category: 'emails'
    },
    {
      id: '3',
      name: 'New Enrollments',
      target: 10,
      current: 7,
      unit: 'students',
      icon: UserPlus,
      priority: 'high',
      deadline: '2024-01-31',
      category: 'conversions'
    },
    {
      id: '4',
      name: 'Revenue Target',
      target: 50000,
      current: 38500,
      unit: '$',
      icon: DollarSign,
      priority: 'medium',
      deadline: '2024-01-31',
      category: 'revenue'
    },
  ];

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'Call Conversion Rate',
      value: 32,
      target: 30,
      unit: '%',
      trend: 5,
      icon: Phone
    },
    {
      label: 'Email Response Rate',
      value: 28,
      target: 25,
      unit: '%',
      trend: 12,
      icon: Mail
    },
    {
      label: 'Lead to Enrollment',
      value: 18,
      target: 20,
      unit: '%',
      trend: -3,
      icon: TrendingUp
    },
    {
      label: 'Avg. Deal Size',
      value: 5500,
      target: 5000,
      unit: '$',
      trend: 8,
      icon: DollarSign
    },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const toggleGoalExpansion = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'bg-destructive/10 text-destructive border-destructive/20',
      medium: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      low: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  return (
    <div className="space-y-4">
      {/* Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Goals & Performance</h2>
          <p className="text-sm text-muted-foreground mt-1">{getDateRangeLabel()}</p>
        </div>
        <div className="flex gap-2">
          {dateRanges.map((range) => (
            <Button
              key={range.value}
              variant={selectedRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRange(range.value)}
              className="h-9"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isAboveTarget = metric.value >= metric.target;
          
          return (
            <Card key={index} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {metric.trend > 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-medium">+{metric.trend}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 text-destructive" />
                        <span className="text-destructive font-medium">{metric.trend}%</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {metric.unit === '$' && metric.unit}
                      {metric.value.toLocaleString()}
                      {metric.unit !== '$' && metric.unit}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {metric.unit === '$' && metric.unit}{metric.target.toLocaleString()}{metric.unit !== '$' && metric.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Progress 
                      value={getProgressPercentage(metric.value, metric.target)} 
                      className="h-1.5 flex-1"
                    />
                    {isAboveTarget ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Goals Section */}
      <Card>
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Active Goals
            <Badge variant="secondary" className="ml-2">{goals.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-6 pt-0">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const percentage = getProgressPercentage(goal.current, goal.target);
            const isExpanded = expandedGoals.has(goal.id);
            const remaining = goal.target - goal.current;
            const isAchieved = goal.current >= goal.target;
            
            return (
              <Collapsible key={goal.id} open={isExpanded} onOpenChange={() => toggleGoalExpansion(goal.id)}>
                <div className={cn(
                  "border rounded-lg p-4 transition-all",
                  isAchieved 
                    ? "border-green-500/30 bg-green-500/5 hover:border-green-500/50" 
                    : "border-border hover:border-primary/30"
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex-shrink-0 p-2.5 rounded-lg",
                      isAchieved ? "bg-green-500/20" : "bg-primary/10"
                    )}>
                      {isAchieved ? (
                        <Award className="w-5 h-5 text-green-600" />
                      ) : (
                        <Icon className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{goal.name}</h4>
                            {isAchieved && (
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Achieved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                          </p>
                        </div>
                        <Badge variant="outline" className={getPriorityBadge(goal.priority)}>
                          {goal.priority}
                        </Badge>
                      </div>
                      
                      {/* Compact Progress */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="34"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              className="text-muted/20"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="34"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 34}`}
                              strokeDashoffset={`${2 * Math.PI * 34 * (1 - percentage / 100)}`}
                              className={cn(
                                "transition-all duration-500",
                                isAchieved ? "text-green-600" :
                                percentage >= 70 ? "text-primary" :
                                percentage >= 50 ? "text-yellow-600" :
                                "text-orange-600"
                              )}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={cn(
                              "text-xl font-bold",
                              isAchieved ? "text-green-600" : getProgressColor(percentage)
                            )}>
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {remaining > 0 ? `${remaining} ${goal.unit} to go` : 'Complete! 🎉'}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {format(new Date(goal.deadline), 'MMM d')}
                            </div>
                          </div>
                          
                          {!isAchieved && remaining > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Daily target: <span className="font-medium text-foreground">{Math.ceil(remaining / 7)} {goal.unit}/day</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Collapsible Details */}
                      <CollapsibleContent className="pt-3 border-t border-border">
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground">Category:</span>
                              <span className="ml-2 font-medium text-foreground capitalize">
                                {goal.category}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Deadline:</span>
                              <span className="ml-2 font-medium text-foreground">
                                {format(new Date(goal.deadline), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            {isAchieved ? (
                              <Award className="w-4 h-4 text-green-600" />
                            ) : percentage >= 70 ? (
                              <TrendingUp className="w-4 h-4 text-primary" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-orange-600" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {isAchieved ? 'Congratulations! Goal completed!' :
                               percentage >= 70 ? 'Good pace, stay consistent' :
                               'Focus needed to reach target'}
                            </span>
                          </div>
                        </div>
                      </CollapsibleContent>
                      
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs w-full"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />
                              Show Details
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                </div>
              </Collapsible>
            );
          })}
        </CardContent>
      </Card>

      {/* Overall Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Period Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Completed Goals</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {goals.filter(g => g.current >= g.target).length}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {goals.filter(g => g.current < g.target && getProgressPercentage(g.current, g.target) >= 50).length}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Needs Attention</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {goals.filter(g => getProgressPercentage(g.current, g.target) < 50).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
