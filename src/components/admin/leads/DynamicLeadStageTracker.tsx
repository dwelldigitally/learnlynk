import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { 
  Bot,
  UserCheck,
  Send,
  Star,
  MessageSquare,
  Target,
  AlertCircle,
  Calendar,
  FileText,
  CheckCircle2
} from "lucide-react";
import { useJourneyStagesForProgram, useLeadCountsPerStage } from "@/services/leadJourneyService";

interface DynamicLeadStageTrackerProps {
  programId?: string;
  activeStage: string;
  onStageChange: (stage: string) => void;
  onAIAction?: (action: string, stage: string) => void;
  selectedLeadsCount?: number;
  totalLeadsCount?: number;
}

const stageColors: Record<string, string> = {
  'inquiry': 'bg-blue-500',
  'application': 'bg-indigo-500',
  'verification': 'bg-purple-500',
  'assessment': 'bg-pink-500',
  'interview': 'bg-orange-500',
  'decision': 'bg-amber-500',
  'enrollment': 'bg-emerald-500',
  'onboarding': 'bg-teal-500',
  'custom': 'bg-slate-500',
};

const stageAIActions: Record<string, { id: string; icon: any; label: string }[]> = {
  'inquiry': [
    { id: 'auto-qualify', icon: UserCheck, label: 'Auto-Qualify High Scorers' },
    { id: 'welcome-sequence', icon: Send, label: 'Send Welcome Sequence' },
    { id: 'score-prioritization', icon: Star, label: 'Update Lead Scores' }
  ],
  'application': [
    { id: 'completion-reminders', icon: Calendar, label: 'Application Completion Reminders' },
    { id: 'document-assistance', icon: FileText, label: 'Document Upload Assistance' },
    { id: 'deadline-alerts', icon: AlertCircle, label: 'Deadline Alerts' }
  ],
  'verification': [
    { id: 'document-review', icon: FileText, label: 'Document Review Reminders' },
    { id: 'verification-follow-up', icon: Send, label: 'Verification Follow-ups' },
    { id: 'risk-assessment', icon: AlertCircle, label: 'Risk Assessment Analysis' }
  ],
  'assessment': [
    { id: 'schedule-assessment', icon: Calendar, label: 'Schedule Assessments' },
    { id: 'preparation-tips', icon: MessageSquare, label: 'Send Preparation Tips' },
    { id: 'follow-up-reminders', icon: Calendar, label: 'Assessment Reminders' }
  ],
  'interview': [
    { id: 'schedule-interview', icon: Calendar, label: 'Schedule Interviews' },
    { id: 'interview-prep', icon: MessageSquare, label: 'Interview Preparation' },
    { id: 'follow-up', icon: Send, label: 'Interview Follow-ups' }
  ],
  'decision': [
    { id: 'decision-notification', icon: Send, label: 'Send Decision Notifications' },
    { id: 'appeal-handling', icon: MessageSquare, label: 'Handle Appeals' },
    { id: 'next-steps', icon: Target, label: 'Next Steps Guidance' }
  ],
  'enrollment': [
    { id: 'enrollment-confirmation', icon: CheckCircle2, label: 'Enrollment Confirmation' },
    { id: 'payment-reminders', icon: AlertCircle, label: 'Payment Reminders' },
    { id: 'welcome-package', icon: Send, label: 'Send Welcome Package' }
  ],
  'onboarding': [
    { id: 'onboarding-sequence', icon: Send, label: 'Send Onboarding Materials' },
    { id: 'welcome-calls', icon: Calendar, label: 'Schedule Welcome Calls' },
    { id: 'success-tracking', icon: Star, label: 'Success Metrics Tracking' }
  ],
};

export function DynamicLeadStageTracker({ 
  programId, 
  activeStage, 
  onStageChange, 
  onAIAction,
  selectedLeadsCount = 0,
  totalLeadsCount
}: DynamicLeadStageTrackerProps) {
  const { data: journeyData, isLoading: stagesLoading } = useJourneyStagesForProgram(programId);
  const { data: leadCounts, isLoading: countsLoading } = useLeadCountsPerStage(journeyData?.id);

  const stages = journeyData?.journey_stages || [];
  const sortedStages = [...stages].sort((a, b) => a.order_index - b.order_index);
  
  const totalLeads = totalLeadsCount ?? Object.values(leadCounts || {}).reduce((sum: number, count: any) => sum + (count as number), 0);

  const getStageColor = (stageType: string) => {
    return stageColors[stageType] || stageColors['custom'];
  };

  const getAIActions = (stageType: string) => {
    return stageAIActions[stageType] || stageAIActions['custom'] || [];
  };

  const handleAIAction = (actionId: string, stageKey: string) => {
    onAIAction?.(actionId, stageKey);
  };

  if (stagesLoading) {
    return (
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <div className="flex-1 flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 flex-1" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stages.length) {
    return (
      <div className="bg-card border rounded-lg p-4">
        <div className="text-sm text-muted-foreground text-center">
          {programId 
            ? "No journey stages configured for this program" 
            : "Select a program to view journey stages"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg">
      {/* Main Stage Tracker */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold">Lead Pipeline:</h2>
          <div className="text-xs text-muted-foreground">
            {totalLeads} total leads
            {selectedLeadsCount > 0 && (
              <span className="ml-2 text-primary">
                • {selectedLeadsCount} selected
              </span>
            )}
          </div>
        </div>
        
        <Tabs value={activeStage} onValueChange={onStageChange} className="flex-1 max-w-4xl">
          <TabsList className={cn(
            "grid w-full bg-muted/50 h-10",
            `grid-cols-${Math.min(sortedStages.length + 1, 8)}`
          )} style={{ gridTemplateColumns: `repeat(${Math.min(sortedStages.length + 1, 8)}, minmax(0, 1fr))` }}>
            <TabsTrigger value="all" className="text-xs">
              <div className="flex items-center gap-1">
                <span>All</span>
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {totalLeads}
                </Badge>
              </div>
            </TabsTrigger>
            
            {sortedStages.map((stage) => (
              <TabsTrigger 
                key={stage.id} 
                value={stage.id}
                className="text-xs"
              >
                <div className="flex items-center gap-1">
                  <div 
                    className={cn("w-1.5 h-1.5 rounded-full", getStageColor(stage.stage_type))}
                  />
                  <span className="hidden sm:inline truncate max-w-20">{stage.name}</span>
                  <span className="sm:hidden">{stage.name.substring(0, 3)}</span>
                  <Badge 
                    variant={activeStage === stage.id ? "default" : "outline"} 
                    className="text-xs px-1 py-0"
                  >
                    {(leadCounts as any)?.[stage.id] || 0}
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Stage-specific AI Actions */}
      {activeStage !== 'all' && onAIAction && (() => {
        const activeStageData = sortedStages.find(s => s.id === activeStage);
        const actions = activeStageData ? getAIActions(activeStageData.stage_type) : [];
        
        if (!actions.length) return null;
        
        return (
          <div className="p-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bot className="h-3 w-3" />
                <span>AI Actions:</span>
              </div>
              
              <TooltipProvider>
                <div className="flex gap-1">
                  {actions.map((action) => (
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
        );
      })()}
    </div>
  );
}
