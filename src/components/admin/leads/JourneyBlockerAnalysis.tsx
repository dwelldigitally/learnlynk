import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Route,
  ArrowRight
} from 'lucide-react';

interface JourneyStep {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'blocked' | 'upcoming';
  completedAt?: string;
  blocker?: {
    title: string;
    description: string;
    actionRequired: string;
  };
}

interface JourneyBlockerAnalysisProps {
  leadId: string;
  leadData: any;
}

export function JourneyBlockerAnalysis({ leadId, leadData }: JourneyBlockerAnalysisProps) {
  const [steps, setSteps] = useState<JourneyStep[]>([]);

  const analyzeJourney = () => {
    // Simplified journey analysis based on lead status and data
    const journeySteps: JourneyStep[] = [
      {
        id: 'inquiry',
        name: 'Initial Inquiry',
        status: 'completed',
        completedAt: leadData.created_at
      },
      {
        id: 'consultation',
        name: 'Consultation',
        status: 'completed',
        completedAt: leadData.created_at
      },
      {
        id: 'application',
        name: 'Application',
        status: getApplicationStatus(),
        blocker: getApplicationBlocker()
      },
      {
        id: 'documents',
        name: 'Documents',
        status: getDocumentStatus(),
        blocker: getDocumentBlocker()
      },
      {
        id: 'review',
        name: 'Application Review',
        status: getReviewStatus(),
        blocker: getReviewBlocker()
      },
      {
        id: 'admission',
        name: 'Admission Decision',
        status: getAdmissionStatus()
      },
      {
        id: 'enrollment',
        name: 'Enrollment',
        status: getEnrollmentStatus()
      }
    ];

    setSteps(journeySteps);
  };

  const getApplicationStatus = (): 'completed' | 'current' | 'blocked' | 'upcoming' => {
    if (leadData.status === 'new' || leadData.status === 'contacted') return 'current';
    if (leadData.status === 'application_submitted') return 'completed';
    return 'upcoming';
  };

  const getApplicationBlocker = () => {
    if (getApplicationStatus() === 'current') {
      return {
        title: 'Application Form Incomplete',
        description: 'Student needs to complete and submit their application form',
        actionRequired: 'Follow up with student to complete application'
      };
    }
    return undefined;
  };

  const getDocumentStatus = (): 'completed' | 'current' | 'blocked' | 'upcoming' => {
    if (leadData.status === 'new' || leadData.status === 'contacted') return 'upcoming';
    if (leadData.status === 'application_submitted') return 'current';
    if (leadData.status === 'documents_submitted') return 'completed';
    return 'upcoming';
  };

  const getDocumentBlocker = () => {
    if (getDocumentStatus() === 'current') {
      return {
        title: 'Missing Required Documents',
        description: 'Transcript, English test, and financial documents needed',
        actionRequired: 'Send document checklist to student'
      };
    }
    return undefined;
  };

  const getReviewStatus = (): 'completed' | 'current' | 'blocked' | 'upcoming' => {
    if (leadData.status === 'documents_submitted' || leadData.status === 'under_review') return 'current';
    if (leadData.status === 'admitted' || leadData.status === 'rejected') return 'completed';
    return 'upcoming';
  };

  const getReviewBlocker = () => {
    if (getReviewStatus() === 'current') {
      return {
        title: 'Awaiting Review',
        description: 'Application is in the review queue',
        actionRequired: 'No action required - processing normally'
      };
    }
    return undefined;
  };

  const getAdmissionStatus = (): 'completed' | 'current' | 'blocked' | 'upcoming' => {
    if (leadData.status === 'admitted' || leadData.status === 'rejected') return 'completed';
    return 'upcoming';
  };

  const getEnrollmentStatus = (): 'completed' | 'current' | 'blocked' | 'upcoming' => {
    if (leadData.status === 'enrolled') return 'completed';
    if (leadData.status === 'admitted') return 'current';
    return 'upcoming';
  };

  const getCurrentBlocker = () => {
    return steps.find(step => step.status === 'current' && step.blocker);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'current':
        return <Clock className="h-5 w-5 text-foreground" />;
      case 'blocked':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-success/20 bg-success/5';
      case 'current':
        return 'border-primary/20 bg-primary/5';
      case 'blocked':
        return 'border-destructive/20 bg-destructive/5';
      default:
        return 'border-muted bg-muted/30';
    }
  };

  useEffect(() => {
    analyzeJourney();
  }, [leadData]);

  const currentBlocker = getCurrentBlocker();
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;

  return (
    <div className="space-y-6">
      {/* Journey Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Student Journey Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{completedSteps}/{totalSteps}</div>
              <div className="text-sm text-muted-foreground">Steps Completed</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-primary">
                {Math.round((completedSteps / totalSteps) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300" 
          style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
        />
      </div>
        </CardContent>
      </Card>

      {/* Current Blocker Alert */}
      {currentBlocker && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Current Blocker: {currentBlocker.blocker?.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {currentBlocker.blocker?.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    Action Required
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-foreground font-medium">
                    {currentBlocker.blocker?.actionRequired}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journey Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                {/* Step Icon */}
                <div className="flex-shrink-0">
                  {getStepIcon(step.status)}
                </div>
                
                {/* Step Content */}
                <div className={`flex-1 p-3 rounded-lg border ${getStepColor(step.status)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{step.name}</div>
                      {step.completedAt && (
                        <div className="text-xs text-muted-foreground">
                          Completed {new Date(step.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <Badge 
                      variant={
                        step.status === 'completed' ? 'default' :
                        step.status === 'current' ? 'secondary' :
                        step.status === 'blocked' ? 'destructive' : 'outline'
                      }
                      className="text-xs capitalize"
                    >
                      {step.status}
                    </Badge>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}