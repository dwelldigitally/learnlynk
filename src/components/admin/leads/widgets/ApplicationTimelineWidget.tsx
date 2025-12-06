import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Route, CheckCircle, Circle } from 'lucide-react';

interface JourneyStage {
  id: string;
  stage_name: string;
  completed: boolean;
  completion_date?: string;
}

interface Journey {
  id: string;
  current_stage_name: string;
  stages: JourneyStage[];
}

interface ApplicationTimelineWidgetProps {
  journey: Journey | null;
}

export function ApplicationTimelineWidget({ journey }: ApplicationTimelineWidgetProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          Application Timeline
        </CardTitle>
        <CardDescription>
          Key milestones in the application journey
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          {journey && journey.stages && journey.stages.length > 0 ? (
            <>
              {journey.stages.map((stage, index) => {
                const isActive = journey.current_stage_name === stage.stage_name;
                const isCompleted = stage.completed;
                
                return (
                  <div key={stage.id || index} className="flex items-start gap-3">
                    <div className="relative">
                      <div className={`mt-1 rounded-full p-1 ${
                        isCompleted ? 'bg-green-100' : 
                        isActive ? 'bg-blue-100' : 
                        'bg-gray-100'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Circle className={`h-4 w-4 ${
                            isActive ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                      {index < journey.stages.length - 1 && (
                        <div className={`absolute left-1/2 top-7 w-0.5 h-8 -translate-x-1/2 ${
                          isCompleted ? 'bg-green-200' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`font-medium ${
                        isActive ? 'text-blue-600' : 
                        isCompleted ? 'text-green-600' : 
                        'text-muted-foreground'
                      }`}>
                        {stage.stage_name}
                      </p>
                      {stage.completion_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Completed: {new Date(stage.completion_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      )}
                      {isActive && (
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          Current Stage
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Route className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No journey data available</p>
              <p className="text-sm mt-1">Timeline will appear once the student is enrolled in a journey</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
