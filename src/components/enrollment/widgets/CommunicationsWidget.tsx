import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
    // Journey/Play Traceability
    journey_name?: string;
    stage_name?: string;
    play_name?: string;
    play_category?: string;
    generation_source?: string;
    journey_context?: boolean;
  };
}

interface CommunicationsWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
  selectedItems?: string[];
  onToggleItem?: (itemId: string) => void;
  onToggleAll?: (itemIds: string[]) => void;
  showBulkActions?: boolean;
}

export function CommunicationsWidget({ 
  actions, 
  onCompleteAction,
  selectedItems = [],
  onToggleItem,
  onToggleAll,
  showBulkActions = false
}: CommunicationsWidgetProps) {
  const isOverdue = (scheduledAt: string) => new Date(scheduledAt) < new Date();
  
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'sms': return <MessageSquare className="h-3 w-3" />;
      default: return <Send className="h-3 w-3" />;
    }
  };

  const handleContactClick = (contactInfo: string, type: 'email' | 'phone') => {
    if (type === 'email') {
      window.open(`mailto:${contactInfo}`, '_blank');
    } else {
      window.open(`tel:${contactInfo}`, '_blank');
    }
  };

  const handleStudentClick = (studentName: string, studentId?: string) => {
    // Navigate to student details page
    console.log('Navigate to student:', studentName, studentId);
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      default: return 'Message';
    }
  };

  const actionIds = actions.map(action => action.id);
  const isAllSelected = actionIds.length > 0 && actionIds.every(id => selectedItems.includes(id));
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < actionIds.length && actionIds.some(id => selectedItems.includes(id));

  return (
    <Card className="border-border bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            {showBulkActions && onToggleAll && (
              <Checkbox
                checked={isAllSelected}
                ref={(el) => {
                  if (el && 'indeterminate' in el) {
                    (el as any).indeterminate = isPartiallySelected;
                  }
                }}
                onCheckedChange={() => onToggleAll(actionIds)}
                className="mr-2"
              />
            )}
            <div className="flex items-center space-x-2 text-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>Communications</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
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
                className={`p-3 rounded-lg border transition-colors ${
                  overdue 
                    ? 'bg-destructive/10 border-destructive/30' 
                    : 'bg-background border-border'
                } ${selectedItems.includes(action.id) ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    {showBulkActions && onToggleItem && (
                      <Checkbox
                        checked={selectedItems.includes(action.id)}
                        onCheckedChange={() => onToggleItem(action.id)}
                        className="mt-0.5"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex items-center space-x-1">
                          {getActionIcon(action.action_type)}
                          <button
                            onClick={() => handleStudentClick(action.metadata?.student_name || 'Student')}
                            className="font-medium text-sm truncate text-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            {action.metadata?.student_name || 'Student'}
                          </button>
                        </div>
                        
                        <Badge variant="outline" className="text-xs">
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

                      {/* Journey/Play Context */}
                      {(action.metadata?.play_name || action.metadata?.journey_context) && (
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          {action.metadata?.journey_context && (
                            <Badge variant="outline" className="text-xs">
                              🎯 {action.metadata.stage_name || 'Journey'}
                            </Badge>
                          )}
                          {action.metadata?.play_name && (
                            <Badge variant="outline" className="text-xs">
                              ⚡ {action.metadata.play_name}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{action.metadata?.program || 'Unknown Program'}</span>
                        
                        {action.action_type === 'email' && action.metadata?.contact_info?.email && (
                          <button
                            onClick={() => handleContactClick(action.metadata.contact_info.email, 'email')}
                            className="truncate text-primary hover:text-primary/80 transition-colors cursor-pointer"
                          >
                            • {action.metadata.contact_info.email}
                          </button>
                        )}
                        
                        {action.action_type === 'sms' && action.metadata?.contact_info?.phone && (
                          <button
                            onClick={() => handleContactClick(action.metadata.contact_info.phone, 'phone')}
                            className="truncate text-primary hover:text-primary/80 transition-colors cursor-pointer"
                          >
                            • {action.metadata.contact_info.phone}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={overdue ? "destructive" : "outline"}
                    className="ml-2 h-6 px-2 text-xs"
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
            <Button variant="ghost" size="sm" className="text-primary hover:bg-accent">
              View all {actions.length} messages →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}