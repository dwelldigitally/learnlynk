import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Clock, Star } from 'lucide-react';
import { BulkActionsToolbar } from '../BulkActionsToolbar';
import { EnhancedBulkActionDialog } from '../EnhancedBulkActionDialog';
import { useState } from 'react';

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
    // Journey/Play Traceability
    journey_name?: string;
    stage_name?: string;
    play_name?: string;
    play_category?: string;
    generation_source?: string;
    journey_context?: boolean;
  };
}

interface CallsToMakeWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
  selectedItems?: string[];
  onToggleItem?: (itemId: string) => void;
  onToggleAll?: (itemIds: string[]) => void;
  showBulkActions?: boolean;
}

export function CallsToMakeWidget({ 
  actions, 
  onCompleteAction,
  selectedItems = [],
  onToggleItem,
  onToggleAll,
  showBulkActions = true  // Default to true to enable bulk actions
}: CallsToMakeWidgetProps) {
  const [bulkActionType, setBulkActionType] = useState<'call' | 'email' | null>(null);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  
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

  const actionIds = actions.map(action => action.id);
  const isAllSelected = actionIds.length > 0 && actionIds.every(id => selectedItems.includes(id));
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < actionIds.length && actionIds.some(id => selectedItems.includes(id));

  // Bulk action handlers
  const handleBulkCall = () => {
    setBulkActionType('call');
    setShowBulkDialog(true);
  };

  const handleBulkEmail = () => {
    setBulkActionType('email');
    setShowBulkDialog(true);
  };

  const handleBulkSchedule = () => {
    // For calls, scheduling is similar to calling
    setBulkActionType('call');
    setShowBulkDialog(true);
  };

  const handleBulkComplete = () => {
    // Complete all selected actions
    selectedItems.forEach(actionId => onCompleteAction(actionId));
    onToggleAll && onToggleAll([]);
  };

  const handleBulkDelete = () => {
    // For now, just complete the actions (could be extended to actual deletion)
    handleBulkComplete();
  };

  const handleBulkExecute = async (actionsToExecute: StudentAction[], customMessage?: string) => {
    // Execute the bulk actions
    for (const action of actionsToExecute) {
      await onCompleteAction(action.id);
    }
    setShowBulkDialog(false);
  };

  const selectedActions = actions.filter(action => selectedItems.includes(action.id));

  return (
    <>
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
                <Phone className="h-4 w-4" />
                <span>Calls to Make</span>
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
                  className={`p-3 rounded-lg border transition-colors ${
                    overdue 
                      ? 'bg-destructive/10 border-destructive/30' 
                      : action.priority === 1
                      ? 'bg-accent border-border'
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
                          <span className="font-medium text-sm truncate">
                            {action.metadata?.student_name || 'Student'}
                          </span>
                          
                          {action.metadata?.yield_score && action.metadata.yield_score >= 60 && (
                            <Badge variant="outline" className="text-xs">
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
                            <Badge variant="secondary" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
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
                    </div>
                    
                    <Button
                      size="sm"
                      variant={overdue || action.priority === 1 ? "default" : "outline"}
                      className="ml-2 h-6 px-2 text-xs"
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
              <Button variant="ghost" size="sm" className="text-primary hover:bg-accent">
                View all {actions.length} calls →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar */}
      {selectedItems.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedItems.length}
          selectedActionType="call"
          onBulkCall={handleBulkCall}
          onBulkEmail={handleBulkEmail}
          onBulkSchedule={handleBulkSchedule}
          onBulkComplete={handleBulkComplete}
          onBulkDelete={handleBulkDelete}
          onClearSelection={() => onToggleAll && onToggleAll([])}
        />
      )}

      {/* Enhanced Bulk Action Dialog */}
      <EnhancedBulkActionDialog
        isOpen={showBulkDialog}
        onClose={() => setShowBulkDialog(false)}
        actionType={bulkActionType || 'call'}
        selectedActions={selectedActions}
        onExecute={handleBulkExecute}
      />
    </>
  );
}