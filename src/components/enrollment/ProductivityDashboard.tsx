import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAIProductivity } from "@/hooks/useAIProductivity";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Target, 
  Zap,
  Phone,
  Mail,
  Calendar,
  FileText,
  Lightbulb,
  Award,
  AlertTriangle
} from "lucide-react";

export function ProductivityDashboard() {
  const { metrics, oneClickActions, coaching, isLoading, executeOneClickAction } = useAIProductivity();
  const { toast } = useToast();

  const handleOneClickAction = async (action: any) => {
    const result = await executeOneClickAction(action);
    
    if (result.success) {
      toast({
        title: "Action Completed",
        description: result.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No productivity data available</p>
        </CardContent>
      </Card>
    );
  }

  const getEfficiencyColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-green-600';
      case 'high': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'schedule': return <Calendar className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">{metrics.daily_tasks_completed}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              {getTrendIcon(metrics.performance_trend)}
              <span className="text-muted-foreground">{metrics.performance_trend}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{metrics.avg_response_time_hours.toFixed(1)}h</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Progress 
                value={Math.max(0, 100 - (metrics.avg_response_time_hours * 10))} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{metrics.conversion_rate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Progress value={metrics.conversion_rate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency Rating</p>
                <p className={`text-2xl font-bold capitalize ${getEfficiencyColor(metrics.efficiency_rating)}`}>
                  {metrics.efficiency_rating}
                </p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                {metrics.tasks_auto_executed} auto-executed
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* One-Click Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Smart Actions Ready
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {oneClickActions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No smart actions available right now
              </p>
            ) : (
              oneClickActions.map((action) => (
                <div key={action.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getActionIcon(action.type)}
                      <div>
                        <h4 className="font-medium">{action.label}</h4>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(action.confidence_score * 100)}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Est. time: {action.estimated_time_minutes}min
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleOneClickAction(action)}
                      className="flex items-center gap-1"
                    >
                      {getActionIcon(action.type)}
                      Execute
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* AI Coaching */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Performance Coaching
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {coaching.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Great job! No performance issues detected.
              </p>
            ) : (
              coaching.map((insight, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-1 text-yellow-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{insight.insight}</h4>
                        <Badge variant={getPriorityColor(insight.priority) as any}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Impact:</strong> {insight.impact}
                      </p>
                      <p className="text-sm">
                        <strong>Suggestion:</strong> {insight.suggestion}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Improvement Suggestions */}
      {metrics.improvement_suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Improvement Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.improvement_suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <Lightbulb className="h-4 w-4 mt-1 text-yellow-600" />
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}