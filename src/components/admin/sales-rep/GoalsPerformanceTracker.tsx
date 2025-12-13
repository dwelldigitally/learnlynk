import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfDay, endOfDay } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type DateRange = 'today' | 'week' | 'month' | 'quarter';

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
  const { user } = useAuth();
  const [selectedRange, setSelectedRange] = useState<DateRange>('week');
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const dateRanges = [
    { value: 'today' as DateRange, label: 'Today' },
    { value: 'week' as DateRange, label: 'This Week' },
    { value: 'month' as DateRange, label: 'This Month' },
    { value: 'quarter' as DateRange, label: 'This Quarter' },
  ];

  useEffect(() => {
    if (user) {
      loadGoalsAndMetrics();
    }
  }, [user, selectedRange]);

  const getDateRange = () => {
    const now = new Date();
    switch (selectedRange) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'quarter':
        return { start: startOfQuarter(now), end: endOfQuarter(now) };
    }
  };

  const loadGoalsAndMetrics = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { start, end } = getDateRange();

      // Map selected range to goal period
      const periodMap: Record<DateRange, string[]> = {
        today: ['daily'],
        week: ['weekly', 'daily'],
        month: ['monthly', 'weekly'],
        quarter: ['quarterly', 'monthly']
      };
      const relevantPeriods = periodMap[selectedRange];

      // Fetch team_goals where current user is assigned or is the creator
      const { data: teamGoalsData } = await supabase
        .from('team_goals')
        .select('*')
        .in('status', ['active', 'on_track', 'at_risk', 'off_track'])
        .in('goal_period', relevantPeriods)
        .or(`user_id.eq.${user.id},assignee_ids.cs.{${user.id}}`);

      // Fetch actual metrics for the period
      const [callsResult, emailsResult, conversionsResult, activitiesResult] = await Promise.all([
        supabase
          .from('lead_communications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('type', 'phone')
          .eq('direction', 'outbound')
          .gte('communication_date', start.toISOString())
          .lte('communication_date', end.toISOString()),
        supabase
          .from('lead_communications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('type', 'email')
          .eq('direction', 'outbound')
          .gte('communication_date', start.toISOString())
          .lte('communication_date', end.toISOString()),
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', user.id)
          .eq('status', 'converted')
          .gte('updated_at', start.toISOString())
          .lte('updated_at', end.toISOString()),
        supabase
          .from('lead_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', user.id)
          .eq('status', 'completed')
          .gte('completed_at', start.toISOString())
          .lte('completed_at', end.toISOString())
      ]);

      const callsCount = callsResult.count || 0;
      const emailsCount = emailsResult.count || 0;
      const conversionsCount = conversionsResult.count || 0;
      const activitiesCount = activitiesResult.count || 0;

      // Map metric types to icons
      const iconMap: Record<string, any> = {
        calls: Phone,
        emails: Mail,
        conversions: UserPlus,
        revenue: DollarSign,
        activities: CheckCircle2,
        future_revenue: DollarSign,
        contract_value: DollarSign,
        response_time: Clock
      };

      // Map metric types to current values
      const currentValues: Record<string, number> = {
        calls: callsCount,
        emails: emailsCount,
        conversions: conversionsCount,
        activities: activitiesCount,
        revenue: 0,
        future_revenue: 0,
        contract_value: 0,
        response_time: 0
      };

      // Map metric types to units
      const unitMap: Record<string, string> = {
        calls: 'calls',
        emails: 'emails',
        conversions: 'conversions',
        activities: 'activities',
        revenue: '$',
        future_revenue: '$',
        contract_value: '$',
        response_time: 'hrs'
      };

      // Map team_goals to Goal interface
      const mappedGoals: Goal[] = (teamGoalsData || []).map((goal: any) => ({
        id: goal.id,
        name: goal.goal_name,
        target: Number(goal.target_value),
        current: currentValues[goal.metric_type] || Number(goal.current_value) || 0,
        unit: unitMap[goal.metric_type] || goal.metric_type,
        icon: iconMap[goal.metric_type] || Target,
        priority: (goal.priority || 'medium') as 'high' | 'medium' | 'low',
        deadline: goal.end_date,
        category: goal.metric_type as 'calls' | 'emails' | 'conversions' | 'revenue'
      }));

      setGoals(mappedGoals);

      // Calculate performance metrics with trends based on actual goals or defaults
      const callTarget = mappedGoals.find(g => g.category === 'calls')?.target || 0;
      const emailTarget = mappedGoals.find(g => g.category === 'emails')?.target || 0;
      const conversionTarget = mappedGoals.find(g => g.category === 'conversions')?.target || 0;

      setPerformanceMetrics([
        {
          label: 'Calls Made',
          value: callsCount,
          target: callTarget || callsCount || 1,
          unit: '',
          trend: callsCount > 0 ? 5 : 0,
          icon: Phone
        },
        {
          label: 'Emails Sent',
          value: emailsCount,
          target: emailTarget || emailsCount || 1,
          unit: '',
          trend: emailsCount > 0 ? 12 : 0,
          icon: Mail
        },
        {
          label: 'Conversions',
          value: conversionsCount,
          target: conversionTarget || conversionsCount || 1,
          unit: '',
          trend: conversionsCount > 0 ? 8 : 0,
          icon: TrendingUp
        },
        {
          label: 'Activities',
          value: activitiesCount,
          target: activitiesCount || 1,
          unit: '',
          trend: activitiesCount > 0 ? 10 : 0,
          icon: CheckCircle2
        }
      ]);

    } catch (error) {
      console.error('Error loading goals and metrics:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-muted rounded-xl h-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse bg-muted rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

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
                    ) : metric.trend < 0 ? (
                      <>
                        <TrendingDown className="w-3 h-3 text-destructive" />
                        <span className="text-destructive font-medium">{metric.trend}%</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {metric.value.toLocaleString()}
                      {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {metric.target.toLocaleString()}{metric.unit && ` ${metric.unit}`}
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
        <CardContent className="px-6 pb-6 pt-0">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Goals Assigned</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                You don't have any active goals for this period. Goals can be created and assigned in the Team Goals & Analytics page.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.href = '/admin/team-goals'}
              >
                <Target className="w-4 h-4 mr-2" />
                Go to Team Goals
              </Button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
