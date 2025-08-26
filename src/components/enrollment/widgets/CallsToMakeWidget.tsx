import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, Star } from 'lucide-react';

interface StudentAction {
  id: string;
  action_type: string;
  instruction: string;
  priority: number;
  scheduled_at: string;
  metadata: {
    student_name?: string;
    program?: string;
    yield_score?: number;
    contact_info?: {
      phone?: string;
    };
  };
}

interface CallsToMakeWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
}

export function CallsToMakeWidget({ actions, onCompleteAction }: CallsToMakeWidgetProps) {
  const isOverdue = (scheduledAt: string) => new Date(scheduledAt) < new Date();
  const sortedActions = actions.sort((a, b) => {
    // Prioritize overdue, then urgent, then by scheduled time
    const aOverdue = isOverdue(a.scheduled_at);
    const bOverdue = isOverdue(b.scheduled_at);
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
  });

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2 text-blue-700">
            <Phone className="h-4 w-4" />
            <span>📞 Calls to Make</span>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
            {actions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No calls scheduled</p>
          </div>
        ) : (
          sortedActions.slice(0, 4).map((action) => {
            const overdue = isOverdue(action.scheduled_at);
            const scheduledTime = new Date(action.scheduled_at);
            
            return (
              <div 
                key={action.id}
                className={`p-3 rounded-lg border ${
                  overdue 
                    ? 'bg-red-100 border-red-300' 
                    : action.priority === 1
                    ? 'bg-orange-100 border-orange-300'
                    : 'bg-white border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {action.metadata?.student_name || 'Student'}
                      </span>
                      
                      {action.metadata?.yield_score && action.metadata.yield_score >= 60 && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                          <Star className="h-2 w-2 mr-1" />
                          {action.metadata.yield_score}%
                        </Badge>
                      )}
                      
                      {overdue && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                      
                      {action.priority === 1 && !overdue && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                      {action.instruction}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {overdue ? 'Overdue' : scheduledTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      
                      {action.metadata?.contact_info?.phone && (
                        <span className="truncate">
                          • {action.metadata.contact_info.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={overdue || action.priority === 1 ? "default" : "outline"}
                    className={`ml-2 h-6 px-2 text-xs ${
                      overdue ? 'bg-red-600 hover:bg-red-700' :
                      action.priority === 1 ? 'bg-orange-600 hover:bg-orange-700' : ''
                    }`}
                    onClick={() => onCompleteAction(action.id)}
                  >
                    Call
                  </Button>
                </div>
              </div>
            );
          })
        )}
        
        {actions.length > 4 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
              View all {actions.length} calls →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}