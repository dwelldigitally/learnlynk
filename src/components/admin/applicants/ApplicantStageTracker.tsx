import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Send, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Calendar,
  Bot,
  UserCheck,
  MessageSquare,
  CreditCard,
  GraduationCap,
  Clock,
  DollarSign
} from "lucide-react";

interface ApplicantStageTrackerProps {
  stages: {
    key: string;
    label: string;
    count: number;
    color: string;
  }[];
  activeStage: string;
  onStageChange: (stage: string) => void;
  onAIAction: (action: string, stage: string) => void;
  selectedApplicantsCount: number;
}

const stageAIActions = {
  'application_started': [
    { id: 'completion-reminders', icon: Calendar, label: 'Send Completion Reminders' },
    { id: 'document-assistance', icon: FileText, label: 'Document Upload Help' },
    { id: 'deadline-alerts', icon: AlertCircle, label: 'Application Deadline Alerts' }
  ],
  'documents_submitted': [
    { id: 'document-review', icon: FileText, label: 'Auto Document Review' },
    { id: 'verification-requests', icon: UserCheck, label: 'Request Verifications' },
    { id: 'status-updates', icon: Send, label: 'Send Status Updates' }
  ],
  'under_review': [
    { id: 'review-prioritization', icon: Star, label: 'Prioritize Reviews' },
    { id: 'committee-assignment', icon: Users, label: 'Auto Committee Assignment' },
    { id: 'progress-notifications', icon: MessageSquare, label: 'Progress Notifications' }
  ],
  'decision_pending': [
    { id: 'decision-reminders', icon: Clock, label: 'Decision Timeline Alerts' },
    { id: 'committee-follow-up', icon: Users, label: 'Committee Follow-ups' },
    { id: 'applicant-updates', icon: Send, label: 'Applicant Status Updates' }
  ],
  'approved': [
    { id: 'acceptance-packages', icon: GraduationCap, label: 'Send Acceptance Packages' },
    { id: 'enrollment-guidance', icon: MessageSquare, label: 'Enrollment Guidance' },
    { id: 'payment-setup', icon: CreditCard, label: 'Payment Plan Setup' }
  ],
  'rejected': [
    { id: 'feedback-letters', icon: Send, label: 'Send Feedback Letters' },
    { id: 'alternative-programs', icon: Star, label: 'Suggest Alternative Programs' },
    { id: 'reapplication-info', icon: Calendar, label: 'Reapplication Information' }
  ]
};

export function ApplicantStageTracker({ 
  stages, 
  activeStage, 
  onStageChange, 
  onAIAction, 
  selectedApplicantsCount 
}: ApplicantStageTrackerProps) {
  const handleAIAction = (actionId: string, stageKey: string) => {
    onAIAction(actionId, stageKey);
  };

  return (
    <div className="bg-card border rounded-lg">
      {/* Main Stage Tracker */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Application Pipeline:</h2>
          <div className="text-xs text-muted-foreground">
            {stages.reduce((sum, stage) => sum + stage.count, 0)} total applications
            {selectedApplicantsCount > 0 && (
              <span className="ml-2 text-primary">
                • {selectedApplicantsCount} selected
              </span>
            )}
          </div>
        </div>
        
        <Tabs value={activeStage} onValueChange={onStageChange} className="flex-1 max-w-4xl">
          <TabsList className="grid w-full grid-cols-7 bg-muted/50 h-10">
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
                  <span className="hidden sm:inline truncate">{stage.label}</span>
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
                        Apply to all applicants in this stage
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