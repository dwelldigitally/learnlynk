import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  Target, 
  Mail, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  Clock, 
  Sparkles,
  Bot
} from "lucide-react";

interface StageTrackerProps {
  stages: {
    key: string;
    label: string;
    count: number;
    color: string;
  }[];
  activeStage: string;
  onStageChange: (stage: string) => void;
  onAIAction: (action: string, stage: string) => void;
  selectedStudentsCount: number;
}

const stageAIActions = {
  'LEAD_FORM': [
    { id: 'auto-qualify', icon: Target, label: 'Auto-Qualify High Scorers' },
    { id: 'welcome-sequence', icon: Mail, label: 'Send Welcome Sequence' },
    { id: 'score-prioritization', icon: TrendingUp, label: 'Update Lead Scores' }
  ],
  'SEND_DOCUMENTS': [
    { id: 'document-reminders', icon: FileText, label: 'Send Document Reminders' },
    { id: 'generate-checklists', icon: CheckCircle2, label: 'Generate Checklists' },
    { id: 'flag-incomplete', icon: AlertTriangle, label: 'Flag Incomplete Apps' }
  ],
  'DOCUMENT_APPROVAL': [
    { id: 'auto-approve', icon: CheckCircle2, label: 'Auto-Approve Qualified' },
    { id: 'flag-issues', icon: AlertTriangle, label: 'Flag Document Issues' },
    { id: 'approval-recommendations', icon: Bot, label: 'AI Recommendations' }
  ],
  'FEE_PAYMENT': [
    { id: 'payment-reminders', icon: CreditCard, label: 'Send Payment Reminders' },
    { id: 'payment-plans', icon: CreditCard, label: 'Offer Payment Plans' },
    { id: 'flag-payment-issues', icon: AlertTriangle, label: 'Flag Payment Issues' }
  ],
  'ACCEPTED': [
    { id: 'onboarding-materials', icon: FileText, label: 'Send Onboarding Materials' },
    { id: 'schedule-orientation', icon: Clock, label: 'Schedule Orientation' },
    { id: 'welcome-packages', icon: Sparkles, label: 'Generate Welcome Packages' }
  ]
};

export function StageTracker({ stages, activeStage, onStageChange, onAIAction, selectedStudentsCount }: StageTrackerProps) {
  const handleAIAction = (actionId: string, stageKey: string) => {
    onAIAction(actionId, stageKey);
  };

  return (
    <div className="bg-card border rounded-lg">
      {/* Main Stage Tracker */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Pipeline:</h2>
          <div className="text-xs text-muted-foreground">
            {stages.reduce((sum, stage) => sum + stage.count, 0)} total
            {selectedStudentsCount > 0 && (
              <span className="ml-2 text-primary">
                • {selectedStudentsCount} selected
              </span>
            )}
          </div>
        </div>
        
        <Tabs value={activeStage} onValueChange={onStageChange} className="flex-1 max-w-3xl">
          <TabsList className="grid w-full grid-cols-6 bg-muted/50 h-10">
            <TabsTrigger value="all" className="text-xs">
              <div className="flex items-center gap-1">
                <span>All</span>
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {stages.reduce((sum, stage) => sum + stage.count, 0)}
                </Badge>
              </div>
            </TabsTrigger>
            
            {stages.map((stage) => (
              <TabsTrigger 
                key={stage.key} 
                value={stage.key}
                className="text-xs"
              >
                <div className="flex items-center gap-1">
                  <div 
                    className={cn("w-1.5 h-1.5 rounded-full", stage.color)}
                  />
                  <span className="hidden sm:inline">{stage.label}</span>
                  <span className="sm:hidden">{stage.label.substring(0, 3)}</span>
                  <Badge 
                    variant={activeStage === stage.key ? "default" : "outline"} 
                    className="text-xs px-1 py-0"
                  >
                    {stage.count}
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Stage-specific AI Actions */}
      {activeStage !== 'all' && stageAIActions[activeStage as keyof typeof stageAIActions] && (
        <div className="p-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Bot className="h-3 w-3" />
              <span>AI Actions:</span>
            </div>
            
            <TooltipProvider>
              <div className="flex gap-1">
                {stageAIActions[activeStage as keyof typeof stageAIActions].map((action) => (
                  <Tooltip key={action.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleAIAction(action.id, activeStage)}
                        disabled={selectedStudentsCount === 0}
                      >
                        <action.icon className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{action.label}</p>
                      {selectedStudentsCount === 0 && (
                        <p className="text-xs text-muted-foreground">Select students first</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>

            {selectedStudentsCount === 0 && (
              <span className="text-xs text-muted-foreground ml-2">
                Select students to enable AI actions
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}