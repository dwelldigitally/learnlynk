import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Star, Phone, Mail, Clock } from 'lucide-react';

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
    yield_band?: string;
    contact_info?: {
      email?: string;
      phone?: string;
    };
  };
}

interface HotProspectsWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
}

export function HotProspectsWidget({ actions, onCompleteAction }: HotProspectsWidgetProps) {
  const isOverdue = (scheduledAt: string) => new Date(scheduledAt) < new Date();

  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2 text-red-700">
            <Flame className="h-4 w-4" />
            <span>🔥 Hot Prospects</span>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
            {actions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Flame className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hot prospects right now</p>
          </div>
        ) : (
          actions.slice(0, 3).map((action) => (
            <div 
              key={action.id}
              className={`p-3 rounded-lg border ${
                isOverdue(action.scheduled_at) 
                  ? 'bg-red-100 border-red-300' 
                  : 'bg-white border-red-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm truncate">
                      {action.metadata?.student_name || 'Student'}
                    </span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                      <Star className="h-2 w-2 mr-1" />
                      {action.metadata?.yield_score || 0}%
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {action.instruction}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {action.action_type === 'call' ? (
                      <Phone className="h-3 w-3" />
                    ) : (
                      <Mail className="h-3 w-3" />
                    )}
                    <span>{action.metadata?.program || 'Unknown Program'}</span>
                    
                    {isOverdue(action.scheduled_at) && (
                      <Badge variant="destructive" className="text-xs">
                        <Clock className="h-2 w-2 mr-1" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="destructive"
                  className="ml-2 h-6 px-2 text-xs"
                  onClick={() => onCompleteAction(action.id)}
                >
                  Act Now
                </Button>
              </div>
            </div>
          ))
        )}
        
        {actions.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-red-700 hover:bg-red-100">
              View all {actions.length} hot prospects →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}