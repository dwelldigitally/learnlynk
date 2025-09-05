import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLeadAcademicJourney } from '@/hooks/useLeadData';
import { leadDataService } from '@/services/leadDataService';
import { Route, CheckCircle, Clock, Calendar, Target, Award } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect } from 'react';

interface RealDataJourneyProps {
  leadId: string;
}

export function RealDataJourney({ leadId }: RealDataJourneyProps) {
  const { journey, loading, error, refetch } = useLeadAcademicJourney(leadId);

  // Auto-create journey if none exists
  useEffect(() => {
    const createJourneyIfNeeded = async () => {
      if (!loading && !error && !journey) {
        try {
          await leadDataService.createAcademicJourney(leadId, 'Student Academic Journey');
          refetch();
        } catch (err) {
          console.error('Error creating academic journey:', err);
        }
      }
    };

    createJourneyIfNeeded();
  }, [leadId, loading, error, journey, refetch]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Academic Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading journey...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Academic Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!journey) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Academic Journey
            </CardTitle>
            <Button size="sm">
              <Route className="h-4 w-4 mr-2" />
              Start Journey
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No academic journey started</p>
            <p className="text-sm text-muted-foreground">Create a journey to track the student's progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedStages = journey.stages.filter(stage => stage.completed).length;
  const progressPercentage = (completedStages / journey.total_steps) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Academic Journey
          </CardTitle>
          <Badge variant="outline">
            Step {journey.current_step} of {journey.total_steps}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Journey Overview */}
          <div>
            <h3 className="font-medium mb-2">{journey.journey_name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Started {format(new Date(journey.enrolled_at), 'PPP')}</span>
              </div>
              {journey.estimated_completion_date && (
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span>Est. completion {format(new Date(journey.estimated_completion_date), 'PPP')}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
          </div>

          {/* Current Stage */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Current Stage</span>
            </div>
            <p className="text-blue-800 font-medium">{journey.current_stage_name}</p>
            {journey.next_required_action && (
              <p className="text-sm text-blue-700 mt-1">
                Next action: {journey.next_required_action}
              </p>
            )}
          </div>

          {/* Journey Stages */}
          <div>
            <h4 className="font-medium mb-4">Journey Progress</h4>
            <div className="space-y-3">
              {journey.stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {stage.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : index + 1 === journey.current_step ? (
                      <Clock className="h-5 w-5 text-blue-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        stage.completed ? 'text-green-800' : 
                        index + 1 === journey.current_step ? 'text-blue-800' : 
                        'text-muted-foreground'
                      }`}>
                        {stage.stage_name}
                      </span>
                      
                      {stage.completed && stage.completed_at && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(stage.completed_at), 'MMM d')}
                        </span>
                      )}
                    </div>
                    
                    {stage.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{stage.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          {journey.metadata && Object.keys(journey.metadata).length > 0 && (
            <div className="border-t pt-4">
              <details>
                <summary className="text-sm cursor-pointer text-muted-foreground">
                  Additional journey details
                </summary>
                <pre className="mt-2 text-xs text-muted-foreground">
                  {JSON.stringify(journey.metadata, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}