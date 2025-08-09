import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, DollarSign, AlertTriangle, Eye, MessageSquare, Play } from "lucide-react";

interface SegmentItem {
  id: string;
  title: string;
  subtitle?: string;
  urgency: "high" | "medium" | "low";
  meta?: string;
}

interface SegmentCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  items: SegmentItem[];
  onViewAll: () => void;
  onQuickAction?: (itemId: string, action: string) => void;
}

export function SegmentCard({ 
  title, 
  icon: Icon, 
  count, 
  items, 
  onViewAll, 
  onQuickAction 
}: SegmentCardProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getQuickActions = (title: string) => {
    switch (title) {
      case "Unassigned Leads":
        return [
          { icon: User, action: "assign", label: "Assign" },
          { icon: Eye, action: "view", label: "View" }
        ];
      case "Unresponsive High-Quality":
        return [
          { icon: MessageSquare, action: "message", label: "Message" },
          { icon: Play, action: "sequence", label: "Sequence" }
        ];
      case "SLA Violations":
        return [
          { icon: AlertTriangle, action: "escalate", label: "Escalate" },
          { icon: User, action: "reassign", label: "Reassign" }
        ];
      default:
        return [
          { icon: Eye, action: "view", label: "View" },
          { icon: Play, action: "action", label: "Action" }
        ];
    }
  };

  const quickActions = getQuickActions(title);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {items.slice(0, 5).map((item) => (
            <div key={item.id} className="group flex items-center justify-between p-2 rounded border hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium truncate">{item.title}</p>
                  <Badge variant={getUrgencyColor(item.urgency)} className="text-xs px-1 py-0">
                    {item.urgency}
                  </Badge>
                </div>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                )}
                {item.meta && (
                  <p className="text-xs text-muted-foreground">{item.meta}</p>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                {quickActions.map(({ icon: ActionIcon, action, label }) => (
                  <Button
                    key={action}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onQuickAction?.(item.id, action)}
                    title={label}
                  >
                    <ActionIcon className="h-3 w-3" />
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-3 text-xs"
          onClick={onViewAll}
        >
          View all {count} items
        </Button>
      </CardContent>
    </Card>
  );
}