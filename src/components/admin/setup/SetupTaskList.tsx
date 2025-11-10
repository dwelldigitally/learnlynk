import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSetupTasks } from '@/hooks/useSetupTasks';
import { SETUP_TASKS } from '@/data/setupTasks';
import { SetupTaskCard } from './SetupTaskCard';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const SetupTaskList: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    progress,
    isSetupComplete,
    incompleteRequiredTasks,
    completeTask,
    skipTask,
    startTask
  } = useSetupTasks();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <Skeleton className="h-32 w-full" />
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header Card */}
      <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">Getting Started Guide</CardTitle>
              </div>
              <CardDescription className="text-base">
                {isSetupComplete 
                  ? "🎉 Great job! You've completed all recommended setup tasks."
                  : `Follow these steps to get the most out of your institution portal. ${incompleteRequiredTasks.length > 0 ? `We recommend completing ${incompleteRequiredTasks.length} essential ${incompleteRequiredTasks.length === 1 ? 'task' : 'tasks'} first.` : 'Complete tasks at your own pace.'}`
                }
              </CardDescription>
            </div>
            
            {isSetupComplete && (
              <Button onClick={() => navigate('/admin')} className="gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Overall Progress</span>
              <Badge variant="secondary" className="text-sm">
                {progress}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {tasks.filter(t => t.status === 'completed').length} of {SETUP_TASKS.length} tasks completed
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Recommended Tasks Info */}
      {incompleteRequiredTasks.length > 0 && (
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <AlertDescription className="text-sm">
            <strong>Recommended:</strong> These {incompleteRequiredTasks.length} {incompleteRequiredTasks.length === 1 ? 'task is' : 'tasks are'} essential for core functionality: {' '}
            {incompleteRequiredTasks.map(t => t.title).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Setup Completion Success */}
      {isSetupComplete && (
        <Alert className="mb-6 border-green-600/50 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-sm text-green-800 dark:text-green-200">
            <strong>All Done!</strong> You've completed all the recommended setup tasks. Feel free to explore or revisit these anytime.
          </AlertDescription>
        </Alert>
      )}

      {/* Task List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Setup Tasks</h2>
        
        {SETUP_TASKS.map((taskDef) => {
          const task = tasks.find(t => t.task_id === taskDef.id);
          
          return (
            <SetupTaskCard
              key={taskDef.id}
              taskDefinition={taskDef}
              task={task}
              onComplete={() => completeTask(taskDef.id)}
              onSkip={() => skipTask(taskDef.id)}
              onStart={() => startTask(taskDef.id)}
            />
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="mt-8 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Need Help?</CardTitle>
          <CardDescription>
            If you're stuck or need guidance on any setup task, check out our documentation or contact support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Documentation
            </Button>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
