import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Applicant } from "@/types/applicant";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  CreditCard, 
  UserCheck, 
  Mail,
  Phone,
  Calendar
} from "lucide-react";

interface ApplicationTimelineProps {
  applicant: Applicant;
  onStageUpdate: (stage: string) => void;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  applicant,
  onStageUpdate
}) => {
  const timelineStages = [
    {
      id: 'application_started',
      title: 'Application Started',
      description: 'Initial application submitted',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'documents_submitted',
      title: 'Documents Submitted',
      description: 'Required documents uploaded',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'under_review',
      title: 'Under Review',
      description: 'Application being evaluated',
      icon: Clock,
      color: 'yellow'
    },
    {
      id: 'interview_scheduled',
      title: 'Interview Scheduled',
      description: 'Interview appointment set',
      icon: Calendar,
      color: 'purple'
    },
    {
      id: 'payment_pending',
      title: 'Payment Processing',
      description: 'Awaiting payment completion',
      icon: CreditCard,
      color: 'orange'
    },
    {
      id: 'decision_pending',
      title: 'Decision Pending',
      description: 'Final decision being made',
      icon: Clock,
      color: 'yellow'
    },
    {
      id: 'approved',
      title: 'Approved',
      description: 'Application approved',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 'rejected',
      title: 'Rejected',
      description: 'Application rejected',
      icon: UserCheck,
      color: 'red'
    }
  ];

  const getCurrentStageIndex = () => {
    return timelineStages.findIndex(stage => stage.id === applicant.substage);
  };

  const currentStageIndex = getCurrentStageIndex();

  const getStageStatus = (index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'upcoming';
  };

  const getStageColor = (status: string, color: string) => {
    if (status === 'completed') return 'text-success bg-success/10';
    if (status === 'current') return `text-${color}-600 bg-${color}-100`;
    return 'text-muted-foreground bg-muted';
  };

  const timelineEvents = [
    {
      id: 1,
      type: 'application',
      title: 'Application Submitted',
      description: 'Initial application received',
      timestamp: applicant.created_at,
      icon: FileText,
      status: 'completed'
    },
    {
      id: 2,
      type: 'documents',
      title: 'Documents Uploaded',
      description: `${Array.isArray(applicant.documents_submitted) ? applicant.documents_submitted.length : 0} documents submitted`,
      timestamp: applicant.updated_at,
      icon: FileText,
      status: Array.isArray(applicant.documents_submitted) && applicant.documents_submitted.length > 0 ? 'completed' : 'pending'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Status',
      description: `Payment ${applicant.payment_status}`,
      timestamp: applicant.updated_at,
      icon: CreditCard,
      status: applicant.payment_status === 'completed' ? 'completed' : 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Application Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineStages.slice(0, 7).map((stage, index) => {
              const status = getStageStatus(index);
              const Icon = stage.icon;
              
              return (
                <div key={stage.id} className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getStageColor(status, stage.color)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`font-medium ${status === 'current' ? 'text-foreground' : status === 'completed' ? 'text-success' : 'text-muted-foreground'}`}>
                          {stage.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={status === 'completed' ? 'default' : status === 'current' ? 'secondary' : 'outline'}>
                          {status === 'completed' ? 'Complete' : status === 'current' ? 'Current' : 'Pending'}
                        </Badge>
                        
                        {status === 'upcoming' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onStageUpdate(stage.id)}
                          >
                            Move Here
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineEvents.map((event) => {
              const Icon = event.icon;
              
              return (
                <div key={event.id} className="flex items-start gap-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    event.status === 'completed' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};