import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Target, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Play
} from 'lucide-react';

interface PlaybookStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'delay' | 'branch';
  status: 'completed' | 'current' | 'pending' | 'skipped';
  timestamp?: string;
  outcome?: string;
  metadata?: Record<string, any>;
}

interface PlaybookExecution {
  id: string;
  playbook_name: string;
  journey_name?: string;
  stage_name?: string;
  started_at: string;
  status: 'active' | 'completed' | 'paused' | 'failed';
  success_rate: number;
  steps: PlaybookStep[];
  performance_metrics: {
    avg_response_time: number;
    completion_rate: number;
    conversion_impact: number;
  };
}

interface PlaybookAuditTrailProps {
  executions: PlaybookExecution[];
  currentActionId?: string;
}

export function PlaybookAuditTrail({ executions, currentActionId }: PlaybookAuditTrailProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'current': return <Play className="h-3 w-3 text-blue-600" />;
      case 'pending': return <Clock className="h-3 w-3 text-gray-400" />;
      case 'skipped': return <AlertCircle className="h-3 w-3 text-yellow-600" />;
      default: return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'action': return <Zap className="h-3 w-3" />;
      case 'condition': return <Target className="h-3 w-3" />;
      case 'delay': return <Clock className="h-3 w-3" />;
      case 'branch': return <ChevronRight className="h-3 w-3" />;
      default: return <BookOpen className="h-3 w-3" />;
    }
  };

  const getExecutionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <BookOpen className="h-4 w-4" />
            <span>Playbook Execution Trail</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {executions.map((execution, executionIndex) => (
                <div key={execution.id} className="border rounded-lg p-3 space-y-3">
                  {/* Execution Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{execution.playbook_name}</div>
                      {execution.journey_name && (
                        <div className="text-xs text-muted-foreground">
                          Journey: {execution.journey_name} → {execution.stage_name}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Started: {new Date(execution.started_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={`text-xs ${getExecutionStatusColor(execution.status)}`}>
                        {execution.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {execution.success_rate}% success rate
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-2 bg-muted/50 rounded text-center">
                    <div>
                      <div className="text-xs font-medium">{execution.performance_metrics.avg_response_time}h</div>
                      <div className="text-xs text-muted-foreground">Avg Response</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium">{execution.performance_metrics.completion_rate}%</div>
                      <div className="text-xs text-muted-foreground">Completion</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium">+{execution.performance_metrics.conversion_impact}%</div>
                      <div className="text-xs text-muted-foreground">Conversion Impact</div>
                    </div>
                  </div>

                  {/* Execution Steps */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Execution Steps:</div>
                    {execution.steps.map((step, stepIndex) => (
                      <div key={step.id} className="flex items-center space-x-2 p-2 rounded border-l-2 border-gray-200 bg-background">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(step.status)}
                          {getTypeIcon(step.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{step.name}</div>
                          {step.timestamp && (
                            <div className="text-xs text-muted-foreground">
                              {new Date(step.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                          {step.outcome && (
                            <div className="text-xs text-muted-foreground">
                              Outcome: {step.outcome}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {step.type}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Current Action Highlight */}
                  {currentActionId && execution.status === 'active' && (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center space-x-2 text-blue-700">
                        <Play className="h-3 w-3" />
                        <span className="text-xs font-medium">Current Action Generated from this Playbook</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {executions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No playbook execution history available</p>
                  <p className="text-xs">Actions will appear here once playbooks are executed</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {executions.length > 0 && (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            View Performance Analytics
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            Edit Playbook
          </Button>
        </div>
      )}
    </div>
  );
}