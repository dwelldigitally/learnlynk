import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, CheckCircle, Clock, User, Phone, Mail, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { StudentPreviewPanel } from './StudentPreviewPanel';

interface ActionQueueItem {
  id: string;
  student_name: string;
  program: string;
  yield_score: number;
  yield_band: string;
  reason_codes: any; // Can be string[] or parsed JSON
  suggested_action: string;
  sla_due_at: string;
  status: string;
}

interface ActionQueueTableProps {
  actions: ActionQueueItem[];
  onCompleteAction: (actionId: string) => void;
  selectedActions: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function ActionQueueTable({ actions, onCompleteAction, selectedActions, onSelectionChange }: ActionQueueTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [previewStudentId, setPreviewStudentId] = useState<string | null>(null);

  const toggleRow = (actionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId);
    } else {
      newExpanded.add(actionId);
    }
    setExpandedRows(newExpanded);
  };

  const getYieldBandColor = (band: string) => {
    switch (band) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSLAStatus = (slaDate: string) => {
    const sla = new Date(slaDate);
    const now = new Date();
    const isOverdue = sla < now;
    const timeToSLA = formatDistanceToNow(sla, { addSuffix: true });

    return {
      isOverdue,
      timeToSLA,
      className: isOverdue ? 'text-red-600' : 'text-orange-600'
    };
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingActionIds = actions
        .filter(action => action.status !== 'completed')
        .map(action => action.id);
      onSelectionChange(pendingActionIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectAction = (actionId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedActions, actionId]);
    } else {
      onSelectionChange(selectedActions.filter(id => id !== actionId));
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'Call Student': return <Phone className="h-4 w-4 text-blue-600" />;
      case 'Send Email': return <Mail className="h-4 w-4 text-green-600" />;
      case 'Schedule Meeting': return <Calendar className="h-4 w-4 text-purple-600" />;
      default: return <Phone className="h-4 w-4 text-gray-600" />;
    }
  };

  const pendingActions = actions.filter(action => action.status !== 'completed');
  const allPendingSelected = pendingActions.length > 0 && 
    pendingActions.every(action => selectedActions.includes(action.id));

  if (actions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No actions in queue. Great work!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-border font-medium text-sm text-muted-foreground">
        <div className="col-span-1 flex items-center">
          <Checkbox
            checked={allPendingSelected}
            onCheckedChange={handleSelectAll}
            disabled={pendingActions.length === 0}
          />
        </div>
        <div className="col-span-2">Student</div>
        <div className="col-span-2">Program</div>
        <div className="col-span-1">Yield Band</div>
        <div className="col-span-2">Suggested Action</div>
        <div className="col-span-2">SLA Timer</div>
        <div className="col-span-2">Actions</div>
      </div>

      {/* Table Rows */}
      {actions.map((action) => {
        const isExpanded = expandedRows.has(action.id);
        const slaStatus = getSLAStatus(action.sla_due_at);
        
        return (
          <div key={action.id} className="border border-border rounded-lg">
            {/* Main Row */}
            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50 transition-colors">
              <div className="col-span-1 flex items-center space-x-2">
                <Checkbox
                  checked={selectedActions.includes(action.id)}
                  onCheckedChange={(checked) => handleSelectAction(action.id, checked as boolean)}
                  disabled={action.status === 'completed'}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRow(action.id)}
                  className="p-1 h-auto"
                >
                  {isExpanded ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </Button>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <div className="font-medium text-foreground">{action.student_name}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewStudentId(action.id)}
                    className="p-1 h-auto"
                  >
                    <User className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">Score: {action.yield_score}</div>
              </div>
              
              <div className="col-span-2">
                <div className="text-sm text-foreground">{action.program}</div>
              </div>
              
              <div className="col-span-1">
                <Badge 
                  variant="outline" 
                  className={getYieldBandColor(action.yield_band)}
                >
                  {action.yield_band}
                </Badge>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  {getActionIcon(action.suggested_action)}
                  <div className="text-sm font-medium text-foreground">{action.suggested_action}</div>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm ${slaStatus.className}`}>
                    {slaStatus.timeToSLA}
                  </span>
                </div>
              </div>
              
              <div className="col-span-2">
                {action.status === 'completed' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Done
                  </Badge>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCompleteAction(action.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Reason Codes */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-border bg-muted/30">
              <div className="pt-3">
                <div className="text-sm font-medium text-foreground mb-2">Reason Codes:</div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(action.reason_codes) ? action.reason_codes : []).map((code, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="text-xs"
                    >
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Student Preview Panel */}
      {previewStudentId && (
        <div className="fixed inset-y-0 right-0 z-50 w-96 bg-background border-l border-border shadow-xl">
          <StudentPreviewPanel
            studentId={previewStudentId}
            onClose={() => setPreviewStudentId(null)}
          />
        </div>
      )}
    </div>
  );
}