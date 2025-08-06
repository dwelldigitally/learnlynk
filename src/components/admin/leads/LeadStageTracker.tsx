import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  UserSearch, 
  Send, 
  Star, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Calendar,
  Bot,
  UserCheck,
  MessageSquare,
  Target
} from "lucide-react";
import { LeadStage } from "@/types/lead";

interface LeadStageTrackerProps {
  stages: {
    key: string;
    label: string;
    count: number;
    color: string;
  }[];
  activeStage: string;
  onStageChange: (stage: string) => void;
  onAIAction: (action: string, stage: string) => void;
  selectedLeadsCount: number;
}

const stageAIActions = {
  'NEW_INQUIRY': [
    { id: 'auto-qualify', icon: UserCheck, label: 'Auto-Qualify High Scorers' },
    { id: 'welcome-sequence', icon: Send, label: 'Send Welcome Sequence' },
    { id: 'score-prioritization', icon: Star, label: 'Update Lead Scores' }
  ],
  'QUALIFICATION': [
    { id: 'qualification-call', icon: MessageSquare, label: 'Schedule Qualification Calls' },
    { id: 'program-match', icon: Target, label: 'AI Program Matching' },
    { id: 'risk-assessment', icon: AlertCircle, label: 'Risk Assessment Analysis' }
  ],
  'NURTURING': [
    { id: 'nurture-sequence', icon: Send, label: 'Automated Nurture Sequence' },
    { id: 'engagement-analysis', icon: Star, label: 'Engagement Analysis' },
    { id: 'follow-up-reminders', icon: Calendar, label: 'Schedule Follow-ups' }
  ],
  'PROPOSAL_SENT': [
    { id: 'proposal-follow-up', icon: Send, label: 'Send Proposal Follow-ups' },
    { id: 'objection-handling', icon: MessageSquare, label: 'AI Objection Handling' },
    { id: 'urgency-triggers', icon: AlertCircle, label: 'Create Urgency Triggers' }
  ],
  'APPLICATION_STARTED': [
    { id: 'completion-reminders', icon: Calendar, label: 'Application Completion Reminders' },
    { id: 'document-assistance', icon: FileText, label: 'Document Upload Assistance' },
    { id: 'deadline-alerts', icon: AlertCircle, label: 'Deadline Alerts' }
  ],
  'CONVERTED': [
    { id: 'onboarding-sequence', icon: CheckCircle2, label: 'Send Onboarding Materials' },
    { id: 'welcome-calls', icon: Calendar, label: 'Schedule Welcome Calls' },
    { id: 'success-tracking', icon: Star, label: 'Success Metrics Tracking' }
  ]
};

export function LeadStageTracker({ stages, activeStage, onStageChange, onAIAction, selectedLeadsCount }: LeadStageTrackerProps) {
  const handleAIAction = (actionId: string, stageKey: string) => {
    onAIAction(actionId, stageKey);
  };

  return (
    <div className="bg-card border rounded-lg">
      {/* Main Stage Tracker */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Lead Pipeline:</h2>
          <div className="text-xs text-muted-foreground">
            {stages.reduce((sum, stage) => sum + stage.count, 0)} total leads
            {selectedLeadsCount > 0 && (
              <span className="ml-2 text-primary">
                • {selectedLeadsCount} selected
              </span>
            )}
          </div>
        </div>
        
        <Tabs value={activeStage} onValueChange={onStageChange} className="flex-1 max-w-4xl">
          <TabsList className="grid w-full grid-cols-8 bg-muted/50 h-10">
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
                        Apply to all leads in this stage
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