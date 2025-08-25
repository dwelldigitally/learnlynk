import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
}

export function ActionQueueTable({ actions, onCompleteAction }: ActionQueueTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
        <div className="col-span-1"></div>
        <div className="col-span-2">Student</div>
        <div className="col-span-2">Program</div>
        <div className="col-span-1">Yield Band</div>
        <div className="col-span-2">Suggested Action</div>
        <div className="col-span-2">SLA Timer</div>
        <div className="col-span-2">Complete</div>
      </div>

      {/* Table Rows */}
      {actions.map((action) => {
        const isExpanded = expandedRows.has(action.id);
        const slaStatus = getSLAStatus(action.sla_due_at);
        
        return (
          <div key={action.id} className="border border-border rounded-lg">
            {/* Main Row */}
            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50 transition-colors">
              <div className="col-span-1">
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
                <div className="font-medium text-foreground">{action.student_name}</div>
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
                <div className="text-sm font-medium text-foreground">{action.suggested_action}</div>
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
                  <Button
                    size="sm"
                    onClick={() => onCompleteAction(action.id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
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
    </div>
  );
}