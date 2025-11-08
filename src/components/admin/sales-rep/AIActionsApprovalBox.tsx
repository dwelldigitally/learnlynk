import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePendingAIActions } from '@/hooks/usePendingAIActions';
import { PendingAIAction } from '@/types/pendingAIAction';
import { cn } from '@/lib/utils';
import { Brain, Phone, Mail, MessageSquare, Calendar, FileText, TrendingUp, Clock, Target, CheckCircle2, X, Eye, Zap, AlertTriangle, CheckCheck, User, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
export function AIActionsApprovalBox() {
  const {
    actions,
    loading,
    selectedActions,
    approveAction,
    rejectAction,
    bulkApprove,
    toggleSelection,
    selectAll,
    clearSelection,
    getBulkPreview
  } = usePendingAIActions();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;
  const displayedActions = showAll ? actions : actions.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = actions.length > INITIAL_DISPLAY_COUNT;
  if (loading) {
    return;
  }
  if (actions.length === 0) {
    return <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Actions for Approval</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No AI actions pending approval</p>
            <p className="text-sm">AI will recommend actions as leads engage</p>
          </div>
        </CardContent>
      </Card>;
  }
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'nurture':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  const getPolicyStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600';
      case 'delayed':
        return 'text-yellow-600';
      case 'blocked':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };
  const BulkPreviewDialog = () => {
    const preview = getBulkPreview();
    return <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Action Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Actions by Type</h4>
                {Object.entries(preview.byType).map(([type, count]) => <div key={type} className="flex justify-between text-sm">
                    <span className="capitalize">{type}</span>
                    <span>{count}</span>
                  </div>)}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Actions by Urgency</h4>
                {Object.entries(preview.byUrgency).map(([urgency, count]) => <div key={urgency} className="flex justify-between text-sm">
                    <span className="capitalize">{urgency}</span>
                    <span>{count}</span>
                  </div>)}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{preview.totalActions}</div>
                <div className="text-sm text-muted-foreground">Total Actions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{preview.policyConflicts}</div>
                <div className="text-sm text-muted-foreground">Policy Conflicts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{preview.estimatedExecutionTime}m</div>
                <div className="text-sm text-muted-foreground">Est. Execution</div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Projected Impact</h4>
              <p className="text-sm text-muted-foreground">{preview.projectedImpact}</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
              bulkApprove(Array.from(selectedActions));
              setPreviewOpen(false);
            }} className="flex items-center gap-2">
                <CheckCheck className="h-4 w-4" />
                Approve {preview.totalActions} Actions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>;
  };
  const ActionCard = ({
    action
  }: {
    action: PendingAIAction;
  }) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    return <div className="border rounded-lg hover:border-primary/30 transition-all">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          {/* Collapsed State - Compact View */}
          <div className="p-3 flex items-center gap-3">
            <Checkbox checked={selectedActions.has(action.id)} onCheckedChange={() => toggleSelection(action.id)} />
            
            <div className="flex-1 flex items-center gap-3 min-w-0">
              {/* Action Icon & Title */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {getActionIcon(action.recommendedAction.type)}
                </div>
                <span className="font-medium text-sm truncate">{action.recommendedAction.title}</span>
              </div>

              {/* Lead Name */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-0">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate max-w-[150px]">{action.leadName}</span>
              </div>

              {/* Urgency Badge */}
              <Badge className={cn("text-xs flex-shrink-0", getUrgencyColor(action.recommendedAction.urgency))}>
                {action.recommendedAction.urgency}
              </Badge>

              {/* Confidence Score */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="text-xs text-muted-foreground">Conf:</div>
                <Badge variant="secondary" className="text-xs">
                  {action.recommendedAction.confidenceScore}%
                </Badge>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(action.triggerTimestamp)}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button size="sm" onClick={e => {
              e.stopPropagation();
              approveAction(action.id);
            }} className="h-8 px-3 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Approve
              </Button>
              
              <Button variant="outline" size="sm" onClick={e => {
              e.stopPropagation();
              rejectAction(action.id);
            }} className="h-8 px-3 text-xs">
                <X className="h-3 w-3" />
              </Button>

              {/* Expand/Collapse Toggle */}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Expanded State - Full Details */}
          <CollapsibleContent className="px-3 pb-3">
            <div className="pl-8 pt-2 space-y-3 border-t mt-2">
              {/* Lead Info */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">{action.leadEmail}</span>
                {action.leadPhone && <span className="text-muted-foreground">{action.leadPhone}</span>}
                <Badge variant="outline" className="text-xs">
                  {action.leadStatus}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {action.leadSource}
                </Badge>
              </div>

              {/* Trigger */}
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span className="text-sm font-medium">{action.triggerEvent}</span>
                <span className="text-sm text-muted-foreground">- {action.triggerDetails}</span>
              </div>

              {/* Description */}
              <div className="text-sm text-muted-foreground">
                {action.recommendedAction.description}
              </div>

              {/* Playbook */}
              <div className="bg-primary/5 border border-primary/10 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Playbook: {action.recommendedAction.playbook}</span>
                </div>
                <p className="text-xs text-muted-foreground">{action.recommendedAction.playbookDescription}</p>
              </div>

              {/* AI Reasoning */}
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <div className="font-medium text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Reasoning
                </div>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="font-medium">Primary Factors:</span>
                    <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                      {action.aiReasoning.primaryFactors.map((factor, i) => <li key={i} className="text-muted-foreground">{factor}</li>)}
                    </ul>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-muted-foreground">
                      Success Rate: <strong>{action.aiReasoning.successRate}%</strong>
                    </span>
                    <span className="text-muted-foreground">
                      Similar Cases: <strong>{action.aiReasoning.similarCases}</strong>
                    </span>
                    <span className="text-muted-foreground">
                      Opportunity Score: <strong>{action.aiReasoning.opportunityScore}/10</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Expected Outcome & Impact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded text-sm">
                  <div className="font-medium text-xs text-muted-foreground mb-1">Expected Outcome</div>
                  <div className="text-xs">{action.recommendedAction.expectedOutcome}</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded text-sm">
                  <div className="font-medium text-xs text-muted-foreground mb-1">Estimated Impact</div>
                  <div className="text-xs font-medium">{action.recommendedAction.estimatedImpact}% conversion lift</div>
                </div>
              </div>

              {/* Policies */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Policy Compliance:</div>
                <div className="flex flex-wrap gap-2">
                  {action.boundPolicies.map((policy, index) => <div key={index} className="text-xs flex items-center gap-1 bg-muted px-2 py-1 rounded">
                      <CheckCircle2 className={cn("h-3 w-3", getPolicyStatusColor(policy.status))} />
                      <span>{policy.name}</span>
                      <span className="text-muted-foreground">({policy.impact})</span>
                    </div>)}
                </div>
              </div>

              {/* Full Details Dialog */}
              <div className="pt-2">
                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs w-full">
                      <Eye className="h-3 w-3 mr-1" />
                      View Full Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>AI Action Details</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Trigger Details</h4>
                          <p className="text-sm text-muted-foreground">{action.triggerDetails}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">AI Reasoning</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Primary Factors:</span>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {action.aiReasoning.primaryFactors.map((factor, i) => <li key={i}>{factor}</li>)}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium">Risk Factors:</span>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {action.aiReasoning.riskFactors.map((factor, i) => <li key={i}>{factor}</li>)}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium">Success Rate:</span> {action.aiReasoning.successRate}% (based on {action.aiReasoning.similarCases} similar cases)
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Expected Outcome</h4>
                          <p className="text-sm text-muted-foreground">{action.recommendedAction.expectedOutcome}</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>;
  };
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Actions for Approval</span>
            <Badge variant="secondary">{actions.length}</Badge>
          </div>
          {actions.length > 0 && <div className="flex items-center gap-2">
              {selectedActions.size > 0 && <>
                  <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)} className="text-xs">
                    Preview ({selectedActions.size})
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection} className="text-xs">
                    Clear
                  </Button>
                </>}
              <Button variant="outline" size="sm" onClick={selectAll} className="text-xs">
                Select All
              </Button>
            </div>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {displayedActions.map(action => <ActionCard key={action.id} action={action} />)}
          
          {hasMore && !showAll && <Button variant="outline" className="w-full" onClick={() => setShowAll(true)}>
              Show {actions.length - INITIAL_DISPLAY_COUNT} More Actions
            </Button>}
          
          {showAll && hasMore && <Button variant="ghost" className="w-full" onClick={() => setShowAll(false)}>
              Show Less
            </Button>}
        </div>
        <BulkPreviewDialog />
      </CardContent>
    </Card>;
}