import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AITaskIntelligenceService } from "@/services/aiTaskIntelligence";
import { Brain, Zap, Clock, Target, CheckCircle, AlertCircle, Phone, Mail, Calendar } from "lucide-react";

interface TaskIntelligence {
  confidence_score: number;
  reasoning: string;
  auto_executable: boolean;
  suggested_action: string;
  priority_adjustment: number;
  deadline_urgency: number;
  yield_impact: number;
}

interface IntelligentTask {
  id?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  entity_type: string;
  entity_id: string;
  intelligence: TaskIntelligence;
}

interface AITaskExecutionPanelProps {
  tasks: IntelligentTask[];
  onTaskExecuted: (taskId: string) => void;
  onTaskCreated: (task: any) => void;
}

export function AITaskExecutionPanel({ tasks, onTaskExecuted, onTaskCreated }: AITaskExecutionPanelProps) {
  const [executingTasks, setExecutingTasks] = useState<Set<string>>(new Set());
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const { toast } = useToast();

  const autoExecutableTasks = tasks.filter(task => 
    task.intelligence.auto_executable && task.intelligence.confidence_score >= 0.85
  );

  const highConfidenceTasks = tasks.filter(task => 
    task.intelligence.confidence_score >= 0.7 && task.intelligence.confidence_score < 0.85
  );

  const reviewTasks = tasks.filter(task => 
    task.intelligence.confidence_score < 0.7
  );

  const handleAutoExecute = async (task: IntelligentTask) => {
    const taskKey = task.id || `${task.entity_id}-${task.title}`;
    setExecutingTasks(prev => new Set(prev).add(taskKey));

    try {
      const result = await AITaskIntelligenceService.executeConfidentTask(task);
      
      if (result.success) {
        toast({
          title: "Task Auto-Executed",
          description: result.message,
        });
        onTaskExecuted(taskKey);
      } else {
        toast({
          title: "Auto-Execution Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Execution Error",
        description: "Failed to execute task automatically",
        variant: "destructive",
      });
    } finally {
      setExecutingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskKey);
        return newSet;
      });
    }
  };

  const handleApproveAndExecute = async (task: IntelligentTask) => {
    // Create the task first, then execute
    await onTaskCreated(task);
    await handleAutoExecute(task);
  };

  const generateIntelligentTasks = async () => {
    setGeneratingTasks(true);
    try {
      // In real implementation, would pass actual user ID
      const newTasks = await AITaskIntelligenceService.generateIntelligentTasks('current-user-id');
      
      newTasks.forEach(task => onTaskCreated(task));
      
      toast({
        title: "AI Analysis Complete",
        description: `Generated ${newTasks.length} intelligent tasks based on lead analysis`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate intelligent tasks",
        variant: "destructive",
      });
    } finally {
      setGeneratingTasks(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Call') || action.includes('call')) return <Phone className="h-4 w-4" />;
    if (action.includes('email') || action.includes('Email')) return <Mail className="h-4 w-4" />;
    if (action.includes('Schedule') || action.includes('schedule')) return <Calendar className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.85) return "text-green-600";
    if (score >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadgeVariant = (score: number) => {
    if (score >= 0.85) return "default";
    if (score >= 0.7) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>AI Task Intelligence</CardTitle>
            </div>
            <Button 
              onClick={generateIntelligentTasks}
              disabled={generatingTasks}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              {generatingTasks ? "Analyzing Leads..." : "Generate Smart Tasks"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{autoExecutableTasks.length}</div>
              <div className="text-sm text-muted-foreground">Auto-Executable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{highConfidenceTasks.length}</div>
              <div className="text-sm text-muted-foreground">High Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{reviewTasks.length}</div>
              <div className="text-sm text-muted-foreground">Needs Review</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Executable Tasks */}
      {autoExecutableTasks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-600">Ready for Auto-Execution</CardTitle>
              <Badge variant="secondary">{autoExecutableTasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {autoExecutableTasks.map((task, index) => {
              const taskKey = task.id || `${task.entity_id}-${task.title}`;
              const isExecuting = executingTasks.has(taskKey);
              
              return (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <Badge 
                      variant={getConfidenceBadgeVariant(task.intelligence.confidence_score)}
                      className={getConfidenceColor(task.intelligence.confidence_score)}
                    >
                      {Math.round(task.intelligence.confidence_score * 100)}% confidence
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      {getActionIcon(task.intelligence.suggested_action)}
                      <span>{task.intelligence.suggested_action}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Yield Impact: {Math.round(task.intelligence.yield_impact * 100)}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <strong>AI Reasoning:</strong> {task.intelligence.reasoning}
                    </div>
                    <Progress value={task.intelligence.confidence_score * 100} className="h-2" />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleAutoExecute(task)}
                      disabled={isExecuting}
                      className="flex items-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      {isExecuting ? "Executing..." : "Auto-Execute"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* High Confidence Tasks */}
      {highConfidenceTasks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-600">High Confidence - Approve to Execute</CardTitle>
              <Badge variant="secondary">{highConfidenceTasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {highConfidenceTasks.map((task, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  </div>
                  <Badge variant="secondary">
                    {Math.round(task.intelligence.confidence_score * 100)}% confidence
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <strong>Suggested Action:</strong> {task.intelligence.suggested_action}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => onTaskCreated(task)}>
                    Add to Queue
                  </Button>
                  <Button onClick={() => handleApproveAndExecute(task)}>
                    Approve & Execute
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Review Required Tasks */}
      {reviewTasks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-600">Requires Manual Review</CardTitle>
              <Badge variant="outline">{reviewTasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewTasks.map((task, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  </div>
                  <Badge variant="outline">
                    {Math.round(task.intelligence.confidence_score * 100)}% confidence
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <strong>AI Reasoning:</strong> {task.intelligence.reasoning}
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => onTaskCreated(task)}>
                    Add to Manual Queue
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}