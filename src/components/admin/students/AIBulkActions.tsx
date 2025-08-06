import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  Sparkles, 
  Target, 
  AlertTriangle, 
  Mail, 
  FileText, 
  CreditCard, 
  CheckCircle2,
  Users,
  TrendingUp,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface AIBulkActionsProps {
  activeStage: string;
  selectedStudents: string[];
  totalStudents: number;
  onBulkAction: (action: string, studentIds: string[]) => void;
}

const stageActions = {
  'LEAD_FORM': [
    {
      id: 'auto-qualify',
      label: 'Auto-Qualify High-Score Leads',
      description: 'Automatically move leads with score >80 to documents stage',
      icon: Target,
      variant: 'default' as const,
      aiPowered: true
    },
    {
      id: 'welcome-sequence',
      label: 'Send Welcome Sequence',
      description: 'Send personalized welcome emails based on program interest',
      icon: Mail,
      variant: 'outline' as const,
      aiPowered: true
    },
    {
      id: 'score-prioritization',
      label: 'Score & Prioritize',
      description: 'Update lead scores using AI analysis',
      icon: TrendingUp,
      variant: 'outline' as const,
      aiPowered: true
    }
  ],
  'SEND_DOCUMENTS': [
    {
      id: 'document-reminders',
      label: 'Send Document Reminders',
      description: 'Intelligent reminders based on missing documents',
      icon: FileText,
      variant: 'default' as const,
      aiPowered: true
    },
    {
      id: 'generate-checklists',
      label: 'Generate Document Checklists',
      description: 'Create personalized document checklists by country',
      icon: CheckCircle2,
      variant: 'outline' as const,
      aiPowered: true
    },
    {
      id: 'flag-incomplete',
      label: 'Flag Incomplete Applications',
      description: 'Identify and mark applications missing critical documents',
      icon: AlertTriangle,
      variant: 'outline' as const,
      aiPowered: false
    }
  ],
  'DOCUMENT_APPROVAL': [
    {
      id: 'auto-approve',
      label: 'Auto-Approve Qualified',
      description: 'Automatically approve documents meeting criteria',
      icon: CheckCircle2,
      variant: 'default' as const,
      aiPowered: true
    },
    {
      id: 'flag-issues',
      label: 'Flag Document Issues',
      description: 'AI-powered document quality assessment',
      icon: AlertTriangle,
      variant: 'outline' as const,
      aiPowered: true
    },
    {
      id: 'approval-recommendations',
      label: 'Generate Approval Recommendations',
      description: 'AI recommendations for approval decisions',
      icon: Bot,
      variant: 'outline' as const,
      aiPowered: true
    }
  ],
  'FEE_PAYMENT': [
    {
      id: 'payment-reminders',
      label: 'Send Payment Reminders',
      description: 'Smart payment reminders based on due dates',
      icon: CreditCard,
      variant: 'default' as const,
      aiPowered: true
    },
    {
      id: 'payment-plans',
      label: 'Offer Payment Plans',
      description: 'Generate personalized payment plan options',
      icon: CreditCard,
      variant: 'outline' as const,
      aiPowered: true
    },
    {
      id: 'flag-payment-issues',
      label: 'Flag Payment Issues',
      description: 'Identify students with payment difficulties',
      icon: AlertTriangle,
      variant: 'outline' as const,
      aiPowered: false
    }
  ],
  'ACCEPTED': [
    {
      id: 'onboarding-materials',
      label: 'Send Onboarding Materials',
      description: 'Deliver program-specific onboarding packages',
      icon: FileText,
      variant: 'default' as const,
      aiPowered: true
    },
    {
      id: 'schedule-orientation',
      label: 'Schedule Orientation',
      description: 'Auto-schedule orientation sessions',
      icon: Clock,
      variant: 'outline' as const,
      aiPowered: false
    },
    {
      id: 'welcome-packages',
      label: 'Generate Welcome Packages',
      description: 'Create personalized welcome materials',
      icon: Sparkles,
      variant: 'outline' as const,
      aiPowered: true
    }
  ],
  'all': [
    {
      id: 'smart-progression',
      label: 'Smart Stage Progression',
      description: 'Move students to next stage based on AI analysis',
      icon: TrendingUp,
      variant: 'default' as const,
      aiPowered: true
    },
    {
      id: 'risk-assessment',
      label: 'Risk Assessment & Intervention',
      description: 'Identify at-risk students and suggest interventions',
      icon: AlertTriangle,
      variant: 'outline' as const,
      aiPowered: true
    },
    {
      id: 'bulk-communication',
      label: 'Bulk Communication',
      description: 'Send targeted messages to student groups',
      icon: Mail,
      variant: 'outline' as const,
      aiPowered: false
    }
  ]
};

export function AIBulkActions({ activeStage, selectedStudents, totalStudents, onBulkAction }: AIBulkActionsProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  const actions = stageActions[activeStage as keyof typeof stageActions] || stageActions['all'];
  const hasSelection = selectedStudents.length > 0;

  const handleAction = async (actionId: string) => {
    if (!hasSelection) {
      toast.error('Please select students first');
      return;
    }
    
    setLoadingAction(actionId);
    try {
      await onBulkAction(actionId, selectedStudents);
      toast.success(`Action "${actionId}" completed for ${selectedStudents.length} students`);
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const smartSelectionSuggestions = [
    {
      label: 'High-scoring students',
      count: Math.floor(totalStudents * 0.2),
      criteria: 'Lead score > 80'
    },
    {
      label: 'At-risk students',
      count: Math.floor(totalStudents * 0.15),
      criteria: 'No activity > 7 days'
    },
    {
      label: 'Ready for next stage',
      count: Math.floor(totalStudents * 0.3),
      criteria: 'Requirements met'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-4 w-4" />
          AI-Powered Bulk Actions
          {hasSelection && (
            <Badge variant="secondary" className="ml-2">
              {selectedStudents.length} selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Smart Selection Suggestions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-3 w-3" />
            Smart Selection Suggestions
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {smartSelectionSuggestions.map((suggestion) => (
              <Button
                key={suggestion.label}
                variant="ghost"
                size="sm"
                className="h-auto p-2 flex flex-col items-start text-left"
                onClick={() => toast.info(`Smart selection: ${suggestion.label} - Feature coming soon`)}
              >
                <div className="flex items-center gap-2 w-full">
                  <Users className="h-3 w-3" />
                  <span className="text-xs font-medium">{suggestion.label}</span>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {suggestion.count}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {suggestion.criteria}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Stage-specific Actions */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Stage Actions</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                className="h-auto p-3 flex flex-col items-start text-left justify-start"
                disabled={!hasSelection || loadingAction === action.id}
                onClick={() => handleAction(action.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <action.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{action.label}</span>
                  {action.aiPowered && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      AI
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1 text-left">
                  {action.description}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {!hasSelection && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Select students from the table to enable bulk actions
          </div>
        )}
      </CardContent>
    </Card>
  );
}