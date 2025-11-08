import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
    // Journey/Play Traceability
    journey_name?: string;
    stage_name?: string;
    play_name?: string;
    play_category?: string;
    generation_source?: string;
    journey_context?: boolean;
  };
}

interface OverdueUrgentWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
  selectedItems?: string[];
  onToggleItem?: (itemId: string) => void;
  onToggleAll?: (itemIds: string[]) => void;
  showBulkActions?: boolean;
}

export function OverdueUrgentWidget({ 
  actions, 
  onCompleteAction, 
  selectedItems = [], 
  onToggleItem, 
  onToggleAll, 
  showBulkActions = false 
}: OverdueUrgentWidgetProps) {
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

  const actionIds = actions.map(action => action.id);
  const isAllSelected = actionIds.length > 0 && actionIds.every(id => selectedItems.includes(id));
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < actionIds.length && actionIds.some(id => selectedItems.includes(id));

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'call': return <Phone className="h-3 w-3" />;
      case 'email': 
      case 'sms': return <Mail className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <Card className="border-destructive/30 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            {showBulkActions && onToggleAll && (
              <Checkbox
                checked={isAllSelected}
                ref={(el) => {
                  if (el && 'indeterminate' in el) {
                    (el as any).indeterminate = isPartiallySelected;
                  }
                }}
                onCheckedChange={() => onToggleAll(actionIds)}
              />
            )}
            <div className="flex items-center space-x-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Overdue/Urgent</span>
            </div>
          </div>
          <Badge variant="destructive" className="font-medium">
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
                className={`p-3 rounded-lg border bg-card transition-all duration-200 hover:shadow-md ${
                  selectedItems.includes(action.id) ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
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
                        <span className="font-medium text-sm truncate text-foreground">
                          {action.metadata?.student_name || 'Student'}
                        </span>
                      </div>
                      
                      {overdue ? (
                        <Badge variant="destructive" className="text-xs">
                          <Clock className="h-2 w-2 mr-1" />
                          {hoursOverdue}h overdue
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="h-2 w-2 mr-1" />
                          URGENT
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                      {action.instruction}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{action.metadata?.program || 'Unknown Program'}</span>
                      {overdue && (
                        <>
                          <span>•</span>
                          <span>Due: {new Date(action.scheduled_at).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="default"
                    className="ml-2 h-6 px-2 text-xs"
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
            <Button variant="ghost" size="sm">
              View all {actions.length} urgent items →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
