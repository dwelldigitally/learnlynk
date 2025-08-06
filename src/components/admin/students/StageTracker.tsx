import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Send, 
  Star, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Receipt, 
  Calendar, 
  Gift,
  Bot,
  UserCheck,
  Clock,
  FileX
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
    { id: 'auto-qualify', icon: UserCheck, label: 'Auto-Qualify High Scorers' },
    { id: 'welcome-sequence', icon: Send, label: 'Send Welcome Sequence' },
    { id: 'score-prioritization', icon: Star, label: 'Update Lead Scores' }
  ],
  'SEND_DOCUMENTS': [
    { id: 'document-reminders', icon: Send, label: 'Send Document Reminders' },
    { id: 'generate-checklists', icon: FileCheck, label: 'Generate Checklists' },
    { id: 'flag-incomplete', icon: FileX, label: 'Flag Incomplete Applications' }
  ],
  'DOCUMENT_APPROVAL': [
    { id: 'auto-approve', icon: CheckCircle2, label: 'Auto-Approve Qualified Documents' },
    { id: 'flag-issues', icon: AlertCircle, label: 'Flag Document Issues' },
    { id: 'approval-recommendations', icon: Bot, label: 'Generate AI Recommendations' }
  ],
  'FEE_PAYMENT': [
    { id: 'payment-reminders', icon: Receipt, label: 'Send Payment Reminders' },
    { id: 'payment-plans', icon: Calendar, label: 'Offer Payment Plans' },
    { id: 'flag-payment-issues', icon: AlertCircle, label: 'Flag Payment Issues' }
  ],
  'ACCEPTED': [
    { id: 'onboarding-materials', icon: FileCheck, label: 'Send Onboarding Materials' },
    { id: 'schedule-orientation', icon: Calendar, label: 'Schedule Orientation Sessions' },
    { id: 'welcome-packages', icon: Gift, label: 'Generate Welcome Packages' }
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
                        className="h-7 w-7 p-0 hover:bg-primary/10"
                        onClick={() => handleAIAction(action.id, activeStage)}
                      >
                        <action.icon className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Apply to all students in this stage
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>

          </div>
        </div>
      )}
    </div>
  );
}