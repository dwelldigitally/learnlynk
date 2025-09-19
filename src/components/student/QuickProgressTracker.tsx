import React from "react";
import { CheckCircle, Clock, AlertTriangle, FileText, DollarSign, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'urgent';
  icon: React.ElementType;
  dueDate?: string;
  action?: string;
}

const QuickProgressTracker: React.FC = () => {
  const steps: ProgressStep[] = [
    {
      id: 'application',
      title: 'Complete Application',
      description: 'Submit your program application',
      status: 'completed',
      icon: FileText,
      action: 'View Application'
    },
    {
      id: 'documents',
      title: 'Upload Documents',
      description: '3 documents pending upload',
      status: 'urgent',
      icon: FileText,
      dueDate: 'Due in 5 days',
      action: 'Upload Now'
    },
    {
      id: 'financial-aid',
      title: 'Apply for Financial Aid',
      description: 'FAFSA and aid applications',
      status: 'in-progress',
      icon: DollarSign,
      dueDate: 'Due March 15',
      action: 'Continue'
    },
    {
      id: 'advisor-meeting',
      title: 'Schedule Advisor Meeting',
      description: 'Plan your academic journey',
      status: 'pending',
      icon: Calendar,
      action: 'Schedule'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success bg-success-light';
      case 'in-progress': return 'text-info bg-info-light';
      case 'urgent': return 'text-destructive bg-destructive/10';
      case 'pending': return 'text-warning bg-warning-light';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'urgent': return AlertTriangle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Card className="p-6 bg-card border shadow-medium">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Your Progress</h3>
        <div className="text-right">
          <div className="text-sm font-medium text-muted-foreground">
            {completedSteps} of {steps.length} completed
          </div>
          <div className="text-lg font-bold text-foreground">{Math.round(progressPercentage)}%</div>
        </div>
      </div>

      {/* Application Deadline */}
      <div className="mb-4 p-3 bg-muted/50 border rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Application Deadline</span>
        </div>
        <p className="text-lg font-bold text-foreground mt-1">March 1, 2024</p>
        <p className="text-xs text-muted-foreground">15 days remaining</p>
      </div>

      <Progress value={progressPercentage} className="mb-6" />

      <div className="space-y-4">
        {steps.map((step, index) => {
          const StatusIcon = getStatusIcon(step.status);
          const isUrgent = step.status === 'urgent';
          
          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                isUrgent 
                  ? 'bg-muted/70 border-border shadow-sm' 
                  : 'bg-muted/30 border-border/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${getStatusColor(step.status)}`}>
                <step.icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{step.title}</h4>
                  {step.status === 'completed' && (
                    <Badge variant="outline" className="text-xs bg-success-light text-success border-border">
                      Complete
                    </Badge>
                  )}
                  {step.status === 'urgent' && (
                    <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
                {step.dueDate && (
                  <p className={`text-xs mt-1 ${isUrgent ? 'text-muted-foreground font-medium' : 'text-muted-foreground'}`}>
                    {step.dueDate}
                  </p>
                )}
              </div>

              {step.action && step.status !== 'completed' && (
                <Button 
                  size="sm" 
                  variant={isUrgent ? "default" : "outline"}
                >
                  {step.action}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="text-sm font-medium text-foreground">Next Priority</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete your document uploads to move forward with your application review.
        </p>
      </div>
    </Card>
  );
};

export default QuickProgressTracker;