import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, MessageSquare, Send, Clock, Phone } from 'lucide-react';
import { StudentProfileModal } from '../StudentProfileModal';
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
  onBulkAction?: (actions: StudentAction[], actionType: 'email' | 'call' | 'sms' | 'meeting') => void;
}

export function CommunicationsWidget({ 
  actions, 
  onCompleteAction,
  selectedItems = [],
  onToggleItem,
  onToggleAll,
  showBulkActions = false,
  onBulkAction
}: CommunicationsWidgetProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'email' | 'call' | 'sms' | 'meeting'>('email');
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
    setSelectedStudentId(studentId || 'unknown');
  };

  const handleQuickAction = (action: StudentAction, actionType: 'email' | 'sms' | 'call') => {
    const contact = action.metadata?.contact_info;
    switch (actionType) {
      case 'email':
        if (contact?.email) {
          window.open(`mailto:${contact.email}?subject=Re: ${action.instruction}`, '_blank');
        }
        break;
      case 'sms':
        if (contact?.phone) {
          window.open(`sms:${contact.phone}`, '_blank');
        }
        break;
      case 'call':
        if (contact?.phone) {
          window.open(`tel:${contact.phone}`, '_blank');
        }
        break;
    }
    // Mark action as completed
    onCompleteAction(action.id);
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      default: return 'Message';
    }
  };

  const handleBulkAction = (actionType: 'email' | 'call' | 'sms' | 'meeting') => {
    setBulkActionType(actionType);
    setShowBulkDialog(true);
  };

  const handleBulkExecute = (actionsToExecute: StudentAction[], customMessage?: string) => {
    if (onBulkAction) {
      onBulkAction(actionsToExecute, bulkActionType);
    }
    setShowBulkDialog(false);
  };

  const actionIds = actions.map(action => action.id);
  const isAllSelected = actionIds.length > 0 && actionIds.every(id => selectedItems.includes(id));
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < actionIds.length && actionIds.some(id => selectedItems.includes(id));
  const selectedActions = actions.filter(action => selectedItems.includes(action.id));

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
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium mb-1">No communications pending</p>
            <p className="text-xs">Email and SMS actions will appear here when available</p>
          </div>
        ) : (
          actions.slice(0, 4).map((action) => {
            const overdue = isOverdue(action.scheduled_at);
            
            return (
              <div 
                key={action.id}
                className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  overdue 
                    ? 'bg-destructive/10 border-destructive/30 hover:bg-destructive/15' 
                    : 'bg-background border-border hover:bg-accent/50'
                } ${selectedItems.includes(action.id) ? 'ring-2 ring-primary shadow-lg' : ''}`}
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
                  
                  <div className="flex items-center space-x-1">
                    {/* Quick Action Buttons */}
                    {action.metadata?.contact_info?.email && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-primary/10"
                        onClick={() => handleQuickAction(action, 'email')}
                        title="Send Email"
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                    )}
                    {action.metadata?.contact_info?.phone && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-primary/10"
                          onClick={() => handleQuickAction(action, 'call')}
                          title="Call"
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-primary/10"
                          onClick={() => handleQuickAction(action, 'sms')}
                          title="Send SMS"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    
                    <Button
                      size="sm"
                      variant={overdue ? "destructive" : "outline"}
                      className="ml-2 h-6 px-2 text-xs hover:scale-105 transition-transform"
                      onClick={() => onCompleteAction(action.id)}
                    >
                      Send
                    </Button>
                  </div>
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

        {/* Bulk Actions */}
        {showBulkActions && selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{selectedItems.length} actions selected</span>
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => handleBulkAction('email')}>
                  <Mail className="h-3 w-3 mr-1" />
                  Bulk Email
                </Button>
                <Button size="sm" onClick={() => handleBulkAction('call')}>
                  <Phone className="h-3 w-3 mr-1" />
                  Bulk Call
                </Button>
                <Button size="sm" onClick={() => handleBulkAction('sms')}>
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Bulk SMS
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Student Profile Modal */}
      <StudentProfileModal
        studentId={selectedStudentId}
        isOpen={!!selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
        onQuickAction={(action, studentId) => {
          console.log('Quick action:', action, 'for student:', studentId);
          // Handle quick actions from student profile
        }}
      />

      {/* Enhanced Bulk Action Dialog */}
      <EnhancedBulkActionDialog
        isOpen={showBulkDialog}
        onClose={() => setShowBulkDialog(false)}
        selectedActions={selectedActions}
        actionType={bulkActionType}
        onExecute={handleBulkExecute}
      />
    </Card>
  );
}