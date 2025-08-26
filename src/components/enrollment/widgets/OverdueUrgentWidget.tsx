import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Zap, Phone, Mail, FileText } from 'lucide-react';

interface StudentAction {
  id: string;
  action_type: string;
  instruction: string;
  priority: number;
  scheduled_at: string;
  metadata: {
    student_name?: string;
    program?: string;
  };
}

interface OverdueUrgentWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
}

export function OverdueUrgentWidget({ actions, onCompleteAction }: OverdueUrgentWidgetProps) {
  const isOverdue = (scheduledAt: string) => new Date(scheduledAt) < new Date();
  
  // Sort by most urgent first (overdue, then urgent priority)
  const sortedActions = actions.sort((a, b) => {
    const aOverdue = isOverdue(a.scheduled_at);
    const bOverdue = isOverdue(b.scheduled_at);
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
  });

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'call': return <Phone className="h-3 w-3" />;
      case 'email': 
      case 'sms': return <Mail className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <Card className="border-red-300 bg-red-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span>⚡ Overdue/Urgent</span>
          </div>
          <Badge variant="destructive" className="bg-red-200 text-red-800 border-red-300">
            {actions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">All caught up!</p>
            <p className="text-xs">No overdue or urgent tasks</p>
          </div>
        ) : (
          sortedActions.slice(0, 5).map((action) => {
            const overdue = isOverdue(action.scheduled_at);
            const hoursOverdue = overdue 
              ? Math.floor((Date.now() - new Date(action.scheduled_at).getTime()) / (1000 * 60 * 60))
              : 0;
            
            return (
              <div 
                key={action.id}
                className="p-3 rounded-lg border bg-red-100 border-red-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex items-center space-x-1">
                        {getActionIcon(action.action_type)}
                        <span className="font-medium text-sm truncate text-red-900">
                          {action.metadata?.student_name || 'Student'}
                        </span>
                      </div>
                      
                      {overdue ? (
                        <Badge variant="destructive" className="text-xs bg-red-600">
                          <Clock className="h-2 w-2 mr-1" />
                          {hoursOverdue}h overdue
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs bg-orange-600">
                          <Zap className="h-2 w-2 mr-1" />
                          URGENT
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-red-700 mb-1 line-clamp-2 font-medium">
                      {action.instruction}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs text-red-600">
                      <span>{action.metadata?.program || 'Unknown Program'}</span>
                      {overdue && (
                        <>
                          <span>•</span>
                          <span>Due: {new Date(action.scheduled_at).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2 h-6 px-2 text-xs bg-red-700 hover:bg-red-800"
                    onClick={() => onCompleteAction(action.id)}
                  >
                    Fix Now
                  </Button>
                </div>
              </div>
            );
          })
        )}
        
        {actions.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-red-700 hover:bg-red-100">
              View all {actions.length} urgent items →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}