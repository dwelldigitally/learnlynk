import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
    // Journey/Play Traceability
    journey_name?: string;
    stage_name?: string;
    play_name?: string;
    play_category?: string;
    generation_source?: string;
    journey_context?: boolean;
  };
}

interface HotProspectsWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
  selectedItems?: string[];
  onToggleItem?: (itemId: string) => void;
  onToggleAll?: (itemIds: string[]) => void;
  showBulkActions?: boolean;
}

export function HotProspectsWidget({ 
  actions, 
  onCompleteAction,
  selectedItems = [],
  onToggleItem,
  onToggleAll,
  showBulkActions = false
}: HotProspectsWidgetProps) {
  const isOverdue = (scheduledAt: string) => new Date(scheduledAt) < new Date();
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
              <Flame className="h-4 w-4 text-destructive" />
              <span>Hot Prospects</span>
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
            <Flame className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hot prospects right now</p>
          </div>
        ) : (
          actions.slice(0, 3).map((action) => (
            <div 
              key={action.id}
              className={`p-3 rounded-lg border transition-colors ${
                isOverdue(action.scheduled_at) 
                  ? 'bg-destructive/10 border-destructive/30' 
                  : 'bg-background border-border'
              } ${selectedItems.includes(action.id) ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-start justify-between">
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
                      {action.metadata?.yield_score && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-2 w-2 mr-1" />
                          {action.metadata.yield_score}%
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {action.instruction}
                    </p>
                    
                    {/* Journey/Play Context */}
                    {(action.metadata?.play_name || action.metadata?.generation_source || action.metadata?.journey_context) && (
                      <div className="flex flex-wrap items-center gap-1 mb-2">
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
                </div>
                
                <Button
                  size="sm"
                  variant={isOverdue(action.scheduled_at) ? "destructive" : "default"}
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
            <Button variant="ghost" size="sm" className="text-primary hover:bg-accent">
              View all {actions.length} hot prospects →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}