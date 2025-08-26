import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckSquare, AlertCircle } from 'lucide-react';

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
  };
}

interface DocumentReviewsWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
}

export function DocumentReviewsWidget({ actions, onCompleteAction }: DocumentReviewsWidgetProps) {
  const isOverdue = (scheduledAt: string) => new Date(scheduledAt) < new Date();

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2 text-purple-700">
            <FileText className="h-4 w-4" />
            <span>📋 Document Reviews</span>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
            {actions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents to review</p>
          </div>
        ) : (
          actions.slice(0, 4).map((action) => {
            const overdue = isOverdue(action.scheduled_at);
            
            return (
              <div 
                key={action.id}
                className={`p-3 rounded-lg border ${
                  overdue 
                    ? 'bg-red-100 border-red-300' 
                    : 'bg-white border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {action.metadata?.student_name || 'Student'}
                      </span>
                      
                      {overdue && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-2 w-2 mr-1" />
                          Overdue
                        </Badge>
                      )}
                      
                      {action.priority === 1 && !overdue && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                          Urgent Review
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                      {action.instruction}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {overdue 
                          ? 'Review overdue'
                          : new Date(action.scheduled_at).toLocaleDateString()
                        }
                      </span>
                      <span>• {action.metadata?.program || 'Unknown Program'}</span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={overdue || action.priority === 1 ? "default" : "outline"}
                    className={`ml-2 h-6 px-2 text-xs ${
                      overdue ? 'bg-red-600 hover:bg-red-700' :
                      action.priority === 1 ? 'bg-orange-600 hover:bg-orange-700' : 'hover:bg-purple-100'
                    }`}
                    onClick={() => onCompleteAction(action.id)}
                  >
                    <CheckSquare className="h-3 w-3 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            );
          })
        )}
        
        {actions.length > 4 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-purple-700 hover:bg-purple-100">
              View all {actions.length} documents →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}