import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpandableCard } from './ExpandableCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCountUp } from '@/hooks/useAnimations';
import { useAIProductivity } from '@/hooks/useAIProductivity';
import { 
  TrendingUp, TrendingDown, Minus, Clock, Target, 
  Zap, Brain, CheckCircle, Star, Trophy, Flame,
  ArrowUp, ArrowDown, RotateCcw, Play
} from 'lucide-react';

export const EnhancedProductivityDashboard: React.FC = () => {
  const { 
    metrics, 
    oneClickActions, 
    coaching, 
    isLoading, 
    executeOneClickAction 
  } = useAIProductivity();

  const getEfficiencyScore = () => {
    const rating = metrics?.efficiency_rating;
    switch (rating) {
      case 'excellent': return 95;
      case 'high': return 80;
      case 'medium': return 65;
      case 'low': return 40;
      default: return 0;
    }
  };

  const tasksCompleted = useCountUp({ 
    end: metrics?.daily_tasks_completed || 0,
    duration: 1500
  });

  const avgResponseTime = useCountUp({ 
    end: Math.round((metrics?.avg_response_time_hours || 0) * 10) / 10,
    duration: 1800
  });

  const conversionRate = useCountUp({ 
    end: Math.round((metrics?.conversion_rate || 0) * 10) / 10,
    duration: 2000
  });

  const efficiencyRating = useCountUp({ 
    end: getEfficiencyScore(),
    duration: 2200
  });

  const getEfficiencyColor = (rating: number) => {
    if (rating >= 85) return 'text-success';
    if (rating >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Clock className="h-4 w-4" />;
      case 'email': return <Target className="h-4 w-4" />;
      case 'schedule': return <Star className="h-4 w-4" />;
      case 'note': return <CheckCircle className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const handleOneClickAction = async (action: any) => {
    try {
      await executeOneClickAction(action);
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  if (isLoading) {
    return (
      <ExpandableCard
        title="AI Productivity Dashboard"
        icon={<Brain className="h-5 w-5" />}
        defaultExpanded={true}
        className="animate-fade-in"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ExpandableCard>
    );
  }

  return (
    <ExpandableCard
      title="AI Productivity Dashboard"
      subtitle="Real-time performance insights and optimization opportunities"
      icon={<Brain className="h-5 w-5" />}
      defaultExpanded={true}
      priority="high"
      className="animate-fade-in"
    >
      <div className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="neo-card hover:scale-105 transition-transform duration-300 animate-stagger-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                  <div className="flex items-center gap-2">
                    <span ref={tasksCompleted.ref} className="text-2xl font-bold">
                      {tasksCompleted.count}
                    </span>
                    {getTrendIcon('stable')}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="neo-card hover:scale-105 transition-transform duration-300 animate-stagger-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <div className="flex items-center gap-2">
                    <span ref={avgResponseTime.ref} className="text-2xl font-bold">
                      {avgResponseTime.count}h
                    </span>
                    {getTrendIcon('stable')}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="neo-card hover:scale-105 transition-transform duration-300 animate-stagger-3">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <div className="flex items-center gap-2">
                    <span ref={conversionRate.ref} className="text-2xl font-bold">
                      {conversionRate.count}%
                    </span>
                    {getTrendIcon('stable')}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-success/10">
                  <Target className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="neo-card hover:scale-105 transition-transform duration-300 animate-stagger-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Efficiency Rating</p>
                  <div className="flex items-center gap-2">
                    <span 
                      ref={efficiencyRating.ref} 
                      className={`text-2xl font-bold ${getEfficiencyColor(getEfficiencyScore())}`}
                    >
                      {efficiencyRating.count}%
                    </span>
                    {getTrendIcon('stable')}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-accent/10">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* One-Click Actions & AI Coaching */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* One-Click Actions */}
          <Card className="glass-card animate-stagger-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Smart Actions Ready
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {oneClickActions?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {oneClickActions?.map((action, index) => (
                  <Card 
                    key={action.id} 
                    className={`hover:shadow-md transition-all duration-200 animate-stagger-${Math.min(index + 1, 5)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            {getActionIcon(action.type)}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{action.label}</h4>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                          {action.confidence_score}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          ~{action.estimated_time_minutes} min
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleOneClickAction(action)}
                          className="h-7 px-3"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Execute
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No quick actions available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Performance Coaching */}
          <Card className="glass-card animate-stagger-3">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                AI Performance Coaching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {coaching?.map((insight, index) => (
                  <Card 
                    key={`coaching-${index}`} 
                    className={`border-l-4 border-l-accent animate-stagger-${Math.min(index + 1, 5)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium">{insight.insight}</h4>
                        <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-success font-medium mb-2">
                        Impact: {insight.impact}
                      </p>
                      
                      <p className="text-xs text-muted-foreground mb-3">
                        {insight.suggestion}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={Math.floor(Math.random() * 80) + 10} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-xs text-muted-foreground">
                          In progress
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No coaching insights available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ExpandableCard>
  );
};