import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExpandableCard } from './ExpandableCard';
import { ActionCard } from './ActionCard';
import { 
  Brain, 
  Zap, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Settings,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';
import { useSmartActions, SmartAction } from '@/hooks/useSmartActions';
import { useToast } from '@/hooks/use-toast';

interface SmartActionsHubProps {
  onConfigurationClick?: () => void;
}

export const SmartActionsHub: React.FC<SmartActionsHubProps> = ({ 
  onConfigurationClick 
}) => {
  const [actions, setActions] = useState<SmartAction[]>([]);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [executionProgress, setExecutionProgress] = useState(0);
  
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
      
      if (newActions.length > 0) {
        toast({
          title: "Smart Actions Generated",
          description: `Found ${newActions.length} optimization opportunities`,
        });
      }
    } catch (error) {
      console.error('Failed to generate actions:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate smart actions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExecuteAction = async (action: SmartAction) => {
    try {
      await executeSmartAction(action, { immediate: true });
      setActions(prev => prev.filter(a => a.id !== action.id));
      setSelectedActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(action.id);
        return newSet;
      });
      
      toast({
        title: "Action Executed ✨",
        description: `Successfully completed: ${action.title}`,
      });
    } catch (error) {
      console.error('Failed to execute action:', error);
      toast({
        title: "Execution Failed",
        description: "Action could not be completed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkExecute = async () => {
    const actionsToExecute = actions.filter(a => selectedActions.has(a.id));
    if (actionsToExecute.length === 0) return;

    setExecutionProgress(0);
    try {
      await bulkExecuteActions(actionsToExecute, { 
        immediate: true
      });
      
      setActions(prev => prev.filter(a => !selectedActions.has(a.id)));
      setSelectedActions(new Set());
      setExecutionProgress(0);
      
      toast({
        title: "Bulk Execution Complete 🎉",
        description: `Successfully executed ${actionsToExecute.length} actions`,
      });
    } catch (error) {
      console.error('Failed to execute bulk actions:', error);
      setExecutionProgress(0);
    }
  };

  const handleToggleSelection = (actionId: string, selected: boolean) => {
    setSelectedActions(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(actionId);
      } else {
        newSet.delete(actionId);
      }
      return newSet;
    });
  };

  // Categorize actions
  const autoExecutableActions = actions.filter(a => a.isAutoExecutable);
  const highConfidenceActions = actions.filter(a => !a.isAutoExecutable && a.confidence >= 70);
  const reviewActions = actions.filter(a => a.confidence < 70);

  const totalImpact = actions.reduce((sum, action) => {
    const impact = parseInt(action.estimatedImpact?.match(/\d+/)?.[0] || '0');
    return sum + impact;
  }, 0);

  if (actions.length === 0 && !isGenerating) {
    return (
      <Card className="glass-card">
        <CardContent className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Smart Actions Available</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Generate AI-powered actions to optimize your enrollment process and boost conversions
          </p>
          <Button onClick={generateActions} size="lg" className="animate-bounce-in">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Smart Actions
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Header Card */}
      <Card className="glass-card animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-primary text-white">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  Smart Actions Hub
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    AI-Powered
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground">
                  AI-generated optimizations ready for execution
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Potential Impact</div>
                <div className="text-lg font-bold text-success">+${totalImpact.toLocaleString()}</div>
              </div>
              
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
                onClick={generateActions}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RotateCcw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Refresh Actions'}
              </Button>
              
              {selectedActions.size > 0 && (
                <Button 
                  onClick={handleBulkExecute}
                  disabled={isExecuting}
                  className="bg-success hover:bg-success/90"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Execute Selected ({selectedActions.size})
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress Bar for Bulk Execution */}
          {executionProgress > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Executing actions...</span>
                <span>{Math.round(executionProgress)}%</span>
              </div>
              <Progress value={executionProgress} className="h-2" />
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="text-3xl font-bold text-success animate-counter">
                {autoExecutableActions.length}
              </div>
              <div className="text-sm text-muted-foreground">Auto-Executable</div>
              <div className="text-xs text-success font-medium">Ready to go!</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="text-3xl font-bold text-warning animate-counter">
                {highConfidenceActions.length}
              </div>
              <div className="text-sm text-muted-foreground">High Confidence</div>
              <div className="text-xs text-warning font-medium">Needs approval</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-3xl font-bold text-primary animate-counter">
                {reviewActions.length}
              </div>
              <div className="text-sm text-muted-foreground">Needs Review</div>
              <div className="text-xs text-primary font-medium">Manual check</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Executable Actions */}
      {autoExecutableActions.length > 0 && (
        <ExpandableCard
          title="Ready for Auto-Execution"
          subtitle="High-confidence actions that can run automatically"
          icon={<CheckCircle className="h-5 w-5" />}
          count={autoExecutableActions.length}
          priority="high"
          defaultExpanded={true}
          headerActions={
            <Button
              size="sm"
              onClick={() => {
                const actionIds = autoExecutableActions.map(a => a.id);
                setSelectedActions(new Set(actionIds));
                handleBulkExecute();
              }}
              disabled={isExecuting}
              className="bg-success hover:bg-success/90"
            >
              <Zap className="h-4 w-4 mr-1" />
              Execute All
            </Button>
          }
          className="animate-stagger-1"
        >
          <ScrollArea className="h-80">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {autoExecutableActions.map((action, index) => (
                <ActionCard
                  key={action.id}
                  id={action.id}
                  title={action.title}
                  description={action.description}
                  type={action.type}
                  priority={action.priority}
                  confidence={action.confidence}
                  studentName={action.leadName}
                  aiReasoning={action.aiReasoning}
                  estimatedImpact={action.estimatedImpact}
                  estimatedTime="5-10 min"
                  isSelected={selectedActions.has(action.id)}
                  isExecuting={executingActions.has(action.id)}
                  canAutoExecute={true}
                  onSelect={handleToggleSelection}
                  onExecute={() => handleExecuteAction(action)}
                  className={`animate-stagger-${Math.min(index + 1, 5)}`}
                />
              ))}
            </div>
          </ScrollArea>
        </ExpandableCard>
      )}

      {/* High Confidence Actions */}
      {highConfidenceActions.length > 0 && (
        <ExpandableCard
          title="High Confidence Actions"
          subtitle="AI-recommended actions that need your approval"
          icon={<Clock className="h-5 w-5" />}
          count={highConfidenceActions.length}
          priority="medium"
          defaultExpanded={highConfidenceActions.length <= 5}
          className="animate-stagger-2"
        >
          <ScrollArea className="h-80">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {highConfidenceActions.map((action, index) => (
                <ActionCard
                  key={action.id}
                  id={action.id}
                  title={action.title}
                  description={action.description}
                  type={action.type}
                  priority={action.priority}
                  confidence={action.confidence}
                  studentName={action.leadName}
                  aiReasoning={action.aiReasoning}
                  estimatedImpact={action.estimatedImpact}
                  estimatedTime="10-15 min"
                  isSelected={selectedActions.has(action.id)}
                  isExecuting={executingActions.has(action.id)}
                  canAutoExecute={false}
                  onSelect={handleToggleSelection}
                  onExecute={() => handleExecuteAction(action)}
                  className={`animate-stagger-${Math.min(index + 1, 5)}`}
                />
              ))}
            </div>
          </ScrollArea>
        </ExpandableCard>
      )}

      {/* Review Actions */}
      {reviewActions.length > 0 && (
        <ExpandableCard
          title="Requires Manual Review"
          subtitle="Lower confidence actions that need careful consideration"
          icon={<AlertCircle className="h-5 w-5" />}
          count={reviewActions.length}
          priority="low"
          defaultExpanded={false}
          className="animate-stagger-3"
        >
          <ScrollArea className="h-80">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {reviewActions.map((action, index) => (
                <ActionCard
                  key={action.id}
                  id={action.id}
                  title={action.title}
                  description={action.description}
                  type={action.type}
                  priority={action.priority}
                  confidence={action.confidence}
                  studentName={action.leadName}
                  aiReasoning={action.aiReasoning}
                  estimatedImpact={action.estimatedImpact}
                  estimatedTime="15-20 min"
                  isSelected={selectedActions.has(action.id)}
                  isExecuting={executingActions.has(action.id)}
                  canAutoExecute={false}
                  onSelect={handleToggleSelection}
                  onExecute={() => handleExecuteAction(action)}
                  className={`animate-stagger-${Math.min(index + 1, 5)}`}
                />
              ))}
            </div>
          </ScrollArea>
        </ExpandableCard>
      )}
    </div>
  );
};