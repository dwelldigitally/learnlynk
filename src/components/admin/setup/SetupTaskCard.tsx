import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SetupTask, SetupTaskDefinition } from '@/types/setup';
import { CheckCircle2, Circle, Clock, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SetupTaskCardProps {
  taskDefinition: SetupTaskDefinition;
  task?: SetupTask;
  onComplete: () => void;
  onSkip: () => void;
  onStart: () => void;
}

export const SetupTaskCard: React.FC<SetupTaskCardProps> = ({
  taskDefinition,
  task,
  onComplete,
  onSkip,
  onStart
}) => {
  const status = task?.status || 'not_started';
  const IconComponent = taskDefinition.icon;

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'skipped':
        return <X className="w-5 h-5 text-muted-foreground" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="border-green-600 text-green-600">Completed</Badge>;
      case 'skipped':
        return <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Skipped</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="border-blue-600 text-blue-600">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const isComplete = status === 'completed' || status === 'skipped';

  return (
    <Card className={cn(
      "transition-all duration-200",
      isComplete ? "opacity-70 hover:opacity-90" : "hover:shadow-md"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className="mt-1">
            {getStatusIcon()}
          </div>

          {/* Task Icon & Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isComplete ? "bg-muted" : "bg-primary/10"
                )}>
                  <IconComponent className={cn(
                    "w-5 h-5",
                    isComplete ? "text-muted-foreground" : "text-primary"
                  )} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {taskDefinition.title}
                    {taskDefinition.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {taskDefinition.description}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="flex-shrink-0">
                {getStatusBadge()}
              </div>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Clock className="w-3 h-3" />
              <span>~{taskDefinition.estimatedMinutes} min</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Link to={taskDefinition.link} onClick={onStart}>
                <Button 
                  size="sm"
                  variant={isComplete ? "outline" : "default"}
                  className="gap-2"
                >
                  {status === 'completed' ? 'Review' : status === 'in_progress' ? 'Continue' : 'Start'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              {!isComplete && (
                <>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={onComplete}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Mark Complete
                  </Button>
                  
                  {!taskDefinition.required && (
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={onSkip}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Skip
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
