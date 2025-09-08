import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { usePendingAIActions } from '@/hooks/usePendingAIActions';
import { PendingAIAction } from '@/types/pendingAIAction';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  FileText, 
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  X,
  Eye,
  Zap,
  AlertTriangle,
  CheckCheck,
  User,
  Lightbulb
} from 'lucide-react';

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Actions for Approval</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-20"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (actions.length === 0) {
    return (
      <Card>
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
      </Card>
    );
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'nurture': return <TrendingUp className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPolicyStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'delayed': return 'text-yellow-600';
      case 'blocked': return 'text-red-600';
      default: return 'text-gray-600';
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
    
    return (
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Action Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Actions by Type</h4>
                {Object.entries(preview.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="capitalize">{type}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Actions by Urgency</h4>
                {Object.entries(preview.byUrgency).map(([urgency, count]) => (
                  <div key={urgency} className="flex justify-between text-sm">
                    <span className="capitalize">{urgency}</span>
                    <span>{count}</span>
                  </div>
                ))}
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
              <Button 
                onClick={() => {
                  bulkApprove(Array.from(selectedActions));
                  setPreviewOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Approve {preview.totalActions} Actions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const ActionCard = ({ action }: { action: PendingAIAction }) => {
    const [detailsOpen, setDetailsOpen] = useState(false);

    return (
      <div className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={selectedActions.has(action.id)}
            onCheckedChange={() => toggleSelection(action.id)}
            className="mt-1"
          />
          
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {getActionIcon(action.recommendedAction.type)}
                  <span className="font-medium text-sm">{action.recommendedAction.title}</span>
                </div>
                <Badge className={cn("text-xs", getUrgencyColor(action.recommendedAction.urgency))}>
                  {action.recommendedAction.urgency}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(action.triggerTimestamp)}
                </span>
              </div>
            </div>

            {/* Lead Info */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{action.leadName}</span>
              </div>
              <span className="text-muted-foreground">{action.leadEmail}</span>
              <Badge variant="outline" className="text-xs">
                {action.leadStatus}
              </Badge>
            </div>

            {/* Trigger & Confidence */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span className="text-sm text-muted-foreground">{action.triggerEvent}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Confidence:</div>
                <Badge variant="secondary" className="text-xs">
                  {action.recommendedAction.confidenceScore}%
                </Badge>
              </div>
            </div>

            {/* Playbook */}
            <div className="bg-blue-50 p-2 rounded text-sm">
              <div className="font-medium text-blue-900">Playbook: {action.recommendedAction.playbook}</div>
              <div className="text-blue-700 text-xs mt-1">{action.recommendedAction.playbookDescription}</div>
            </div>

            {/* Policies */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Policy Status:</div>
              <div className="flex flex-wrap gap-2">
                {action.boundPolicies.map((policy, index) => (
                  <div key={index} className="text-xs flex items-center gap-1">
                    <CheckCircle2 className={cn("h-3 w-3", getPolicyStatusColor(policy.status))} />
                    <span>{policy.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>AI Action Details</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-96">
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
                              {action.aiReasoning.primaryFactors.map((factor, i) => (
                                <li key={i}>{factor}</li>
                              ))}
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

              <Button 
                size="sm" 
                onClick={() => approveAction(action.id)}
                className="text-xs"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Approve
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => rejectAction(action.id)}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Actions for Approval</span>
            <Badge variant="secondary">{actions.length}</Badge>
          </div>
          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {selectedActions.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewOpen(true)}
                    className="text-xs"
                  >
                    Preview ({selectedActions.size})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="text-xs"
              >
                Select All
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {actions.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        </ScrollArea>
        <BulkPreviewDialog />
      </CardContent>
    </Card>
  );
}