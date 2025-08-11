import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  UserPlus, 
  Zap, 
  MessageSquare, 
  Play, 
  AlertTriangle, 
  Filter, 
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Send,
  PhoneCall,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Settings
} from "lucide-react";

interface SegmentItem {
  id: string;
  title: string;
  subtitle?: string;
  urgency: "high" | "medium" | "low";
  meta?: string;
}

interface SegmentActionsTabProps {
  item: SegmentItem | null;
  segmentType: string;
  onAction: (action: string, data?: any) => void;
}

export function SegmentActionsTab({ item, segmentType, onAction }: SegmentActionsTabProps) {
  if (!item) return null;

  const getActionsForSegment = (type: string) => {
    switch (type) {
      case "Unassigned Leads":
        return [
          {
            category: "Assignment",
            actions: [
              { icon: UserPlus, label: "Assign to Advisor", action: "assign", variant: "default" as const },
              { icon: Zap, label: "AI Auto-Assign", action: "ai-assign", variant: "secondary" as const },
              { icon: Users, label: "Assign to Team", action: "assign-team", variant: "outline" as const }
            ]
          },
          {
            category: "Communication",
            actions: [
              { icon: Send, label: "Send Welcome Email", action: "welcome-email", variant: "outline" as const },
              { icon: PhoneCall, label: "Schedule Call", action: "schedule-call", variant: "outline" as const },
              { icon: MessageSquare, label: "Send Message", action: "message", variant: "outline" as const }
            ]
          }
        ];
      case "Unresponsive High-Quality":
        return [
          {
            category: "Re-engagement",
            actions: [
              { icon: MessageSquare, label: "Send Follow-up", action: "follow-up", variant: "default" as const },
              { icon: Play, label: "Enroll in Sequence", action: "sequence", variant: "secondary" as const },
              { icon: Zap, label: "AI Re-engagement", action: "ai-reengage", variant: "outline" as const }
            ]
          },
          {
            category: "Escalation",
            actions: [
              { icon: AlertTriangle, label: "Escalate to Manager", action: "escalate", variant: "destructive" as const },
              { icon: UserPlus, label: "Reassign Advisor", action: "reassign", variant: "outline" as const },
              { icon: PhoneCall, label: "Priority Call", action: "priority-call", variant: "outline" as const }
            ]
          }
        ];
      case "SLA Violations":
        return [
          {
            category: "Immediate Actions",
            actions: [
              { icon: AlertTriangle, label: "Escalate Immediately", action: "immediate-escalate", variant: "destructive" as const },
              { icon: UserPlus, label: "Emergency Reassign", action: "emergency-reassign", variant: "default" as const },
              { icon: PhoneCall, label: "Emergency Call", action: "emergency-call", variant: "secondary" as const }
            ]
          },
          {
            category: "Process & Documentation",
            actions: [
              { icon: FileText, label: "Document Issue", action: "document", variant: "outline" as const },
              { icon: Settings, label: "Adjust SLA", action: "adjust-sla", variant: "outline" as const },
              { icon: Filter, label: "Review Filters", action: "review-filters", variant: "outline" as const }
            ]
          }
        ];
      default:
        return [
          {
            category: "General Actions",
            actions: [
              { icon: CheckCircle, label: "Mark Complete", action: "complete", variant: "default" as const },
              { icon: Clock, label: "Snooze", action: "snooze", variant: "outline" as const },
              { icon: XCircle, label: "Mark Inactive", action: "inactive", variant: "destructive" as const }
            ]
          }
        ];
    }
  };

  const actionCategories = getActionsForSegment(segmentType);

  const commonActions = [
    {
      category: "Status Management",
      actions: [
        { icon: CheckCircle, label: "Mark as Resolved", action: "resolve", variant: "default" as const },
        { icon: Clock, label: "Snooze for Later", action: "snooze", variant: "outline" as const },
        { icon: RotateCcw, label: "Reset Status", action: "reset", variant: "outline" as const },
        { icon: XCircle, label: "Mark as Inactive", action: "inactive", variant: "destructive" as const }
      ]
    },
    {
      category: "Advanced Options",
      actions: [
        { icon: Calendar, label: "Schedule Follow-up", action: "schedule", variant: "outline" as const },
        { icon: FileText, label: "Add Notes", action: "add-notes", variant: "outline" as const },
        { icon: TrendingUp, label: "Update Score", action: "update-score", variant: "outline" as const },
        { icon: Settings, label: "Configure Automation", action: "configure", variant: "outline" as const }
      ]
    }
  ];

  const allActionCategories = [...actionCategories, ...commonActions];

  return (
    <ScrollArea className="h-full px-6 py-4">
      <div className="space-y-6">
        {/* Quick Actions Header */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Available Actions</h3>
          <p className="text-sm text-muted-foreground">
            Choose an action to perform on <strong>{item.title}</strong>
          </p>
        </div>

        {/* Action Categories */}
        {allActionCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.actions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    variant={action.variant}
                    className="flex items-center gap-3 h-auto p-4 justify-start"
                    onClick={() => onAction(action.action)}
                  >
                    <action.icon className="h-4 w-4 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{action.label}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Bulk Actions Notice */}
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                To perform actions on multiple items, use the selection checkboxes in the main view.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
              <Badge variant={item.urgency === "high" ? "destructive" : item.urgency === "medium" ? "secondary" : "outline"}>
                {item.urgency} priority
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}