import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Send, Clock } from 'lucide-react';

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
      email?: string;
      phone?: string;
    };
  };
}

interface CommunicationsWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
}

export function CommunicationsWidget({ actions, onCompleteAction }: CommunicationsWidgetProps) {
  const isOverdue = (scheduledAt: string) => new Date(scheduledAt) < new Date();
  
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'sms': return <MessageSquare className="h-3 w-3" />;
      default: return <Send className="h-3 w-3" />;
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      default: return 'Message';
    }
  };

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2 text-green-700">
            <MessageSquare className="h-4 w-4" />
            <span>✉️ Communications</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            {actions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No messages to send</p>
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
                    : 'bg-white border-green-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex items-center space-x-1">
                        {getActionIcon(action.action_type)}
                        <span className="font-medium text-sm truncate">
                          {action.metadata?.student_name || 'Student'}
                        </span>
                      </div>
                      
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                        {getActionLabel(action.action_type)}
                      </Badge>
                      
                      {overdue && (
                        <Badge variant="destructive" className="text-xs">
                          <Clock className="h-2 w-2 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                      {action.instruction}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{action.metadata?.program || 'Unknown Program'}</span>
                      
                      {action.action_type === 'email' && action.metadata?.contact_info?.email && (
                        <span className="truncate">
                          • {action.metadata.contact_info.email}
                        </span>
                      )}
                      
                      {action.action_type === 'sms' && action.metadata?.contact_info?.phone && (
                        <span className="truncate">
                          • {action.metadata.contact_info.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={overdue ? "destructive" : "outline"}
                    className={`ml-2 h-6 px-2 text-xs ${
                      overdue ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-green-100'
                    }`}
                    onClick={() => onCompleteAction(action.id)}
                  >
                    Send
                  </Button>
                </div>
              </div>
            );
          })
        )}
        
        {actions.length > 4 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-100">
              View all {actions.length} messages →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}