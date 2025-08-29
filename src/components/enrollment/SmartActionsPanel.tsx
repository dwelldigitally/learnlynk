import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Zap, 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Mail,
  Phone,
  UserPlus,
  FileText,
  RotateCcw,
  Settings
} from 'lucide-react';
import { useSmartActions, SmartAction } from '@/hooks/useSmartActions';
import { useToast } from '@/hooks/use-toast';

interface SmartActionsPanelProps {
  onConfigurationClick?: () => void;
}

export function SmartActionsPanel({ onConfigurationClick }: SmartActionsPanelProps) {
  const [actions, setActions] = useState<SmartAction[]>([]);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const { 
    generateSmartActions, 
    executeSmartAction, 
    bulkExecuteActions,
    isGenerating, 
    isExecuting, 
    executingActions 
  } = useSmartActions();
  const { toast } = useToast();

  useEffect(() => {
    generateActions();
  }, []);

  const generateActions = async () => {
    try {
      const newActions = await generateSmartActions({
        context: 'all',
        maxActions: 15,
      });
      setActions(newActions);
    } catch (error) {
      console.error('Failed to generate actions:', error);
    }
  };

  const handleExecuteAction = async (action: SmartAction) => {
    try {
      await executeSmartAction(action, { immediate: true });
      setActions(prev => prev.filter(a => a.id !== action.id));
      toast({
        title: "Action Executed",
        description: `Successfully executed: ${action.title}`,
      });
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  const handleBulkExecute = async () => {
    const actionsToExecute = actions.filter(a => selectedActions.has(a.id));
    if (actionsToExecute.length === 0) return;

    try {
      await bulkExecuteActions(actionsToExecute, { immediate: true });
      setActions(prev => prev.filter(a => !selectedActions.has(a.id)));
      setSelectedActions(new Set());
    } catch (error) {
      console.error('Failed to execute bulk actions:', error);
    }
  };

  const autoExecutableActions = actions.filter(a => a.isAutoExecutable);
  const highConfidenceActions = actions.filter(a => !a.isAutoExecutable && a.confidence >= 70);
  const reviewActions = actions.filter(a => a.confidence < 70);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'assignment': return <UserPlus className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const ActionCard = ({ action, canAutoExecute = false }: { action: SmartAction; canAutoExecute?: boolean }) => (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getActionIcon(action.type)}
            <h4 className="text-sm font-medium">{action.title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getPriorityColor(action.priority)}>
              {action.priority}
            </Badge>
            <span className={`text-xs font-medium ${getConfidenceColor(action.confidence)}`}>
              {action.confidence}%
            </span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
        <p className="text-xs text-muted-foreground mb-3">{action.leadName}</p>
        
        <div className="space-y-2 mb-3">
          <div className="text-xs">
            <span className="font-medium">AI Reasoning:</span>
            <p className="text-muted-foreground">{action.aiReasoning}</p>
          </div>
          <div className="text-xs">
            <span className="font-medium">Estimated Impact:</span>
            <p className="text-green-600">{action.estimatedImpact}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedActions.has(action.id)}
              onChange={(e) => {
                setSelectedActions(prev => {
                  const newSet = new Set(prev);
                  if (e.target.checked) {
                    newSet.add(action.id);
                  } else {
                    newSet.delete(action.id);
                  }
                  return newSet;
                });
              }}
              className="rounded"
            />
          </div>
          <Button
            size="sm"
            onClick={() => handleExecuteAction(action)}
            disabled={executingActions.has(action.id)}
            className="h-7 px-3"
          >
            {executingActions.has(action.id) ? (
              <RotateCcw className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            {canAutoExecute ? 'Execute' : 'Approve & Execute'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Smart Actions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              AI-generated actions ready for execution
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onConfigurationClick}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateActions}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RotateCcw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              Generate Actions
            </Button>
            {selectedActions.size > 0 && (
              <Button 
                size="sm" 
                onClick={handleBulkExecute}
                disabled={isExecuting}
              >
                Execute Selected ({selectedActions.size})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{autoExecutableActions.length}</div>
              <div className="text-muted-foreground">Auto-Executable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{highConfidenceActions.length}</div>
              <div className="text-muted-foreground">High Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{reviewActions.length}</div>
              <div className="text-muted-foreground">Needs Review</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Executable Actions */}
      {autoExecutableActions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Ready for Auto-Execution
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  const ids = new Set(autoExecutableActions.map(a => a.id));
                  bulkExecuteActions(autoExecutableActions);
                }}
                disabled={isExecuting}
              >
                Execute All ({autoExecutableActions.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {autoExecutableActions.map(action => (
                  <ActionCard key={action.id} action={action} canAutoExecute />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* High Confidence Actions */}
      {highConfidenceActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              High Confidence - Approve to Execute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {highConfidenceActions.map(action => (
                  <ActionCard key={action.id} action={action} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Review Actions */}
      {reviewActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              Requires Manual Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {reviewActions.map(action => (
                  <ActionCard key={action.id} action={action} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {actions.length === 0 && !isGenerating && (
        <Card>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Smart Actions Available</h3>
            <p className="text-muted-foreground mb-4">
              Generate AI-powered actions to optimize your enrollment process
            </p>
            <Button onClick={generateActions}>
              <Brain className="h-4 w-4 mr-2" />
              Generate Smart Actions
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}