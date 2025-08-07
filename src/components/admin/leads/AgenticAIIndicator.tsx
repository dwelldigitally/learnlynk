import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bot, User, Clock, MessageSquare, Phone, Hand } from "lucide-react";

interface AgenticAIIndicatorProps {
  isAIManaged: boolean;
  aiStatus?: 'active' | 'paused' | 'handoff_pending' | 'human_takeover';
  lastAIAction?: string;
  nextAIAction?: string;
  onHumanTakeover?: () => void;
  className?: string;
}

export function AgenticAIIndicator({ 
  isAIManaged, 
  aiStatus = 'active',
  lastAIAction,
  nextAIAction,
  onHumanTakeover,
  className 
}: AgenticAIIndicatorProps) {
  if (!isAIManaged) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline" className={`${className} bg-gray-50`}>
              <User className="h-3 w-3 mr-1" />
              Human
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This lead is managed by human advisors</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const getStatusConfig = () => {
    switch (aiStatus) {
      case 'active':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Bot,
          label: 'AI Active',
          description: 'AI is actively managing this lead'
        };
      case 'paused':
        return {
          badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          icon: Clock,
          label: 'AI Paused',
          description: 'AI management is temporarily paused'
        };
      case 'handoff_pending':
        return {
          badge: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: Hand,
          label: 'Handoff Pending',
          description: 'Lead ready for human advisor takeover'
        };
      case 'human_takeover':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: User,
          label: 'Human Override',
          description: 'Human advisor has taken over from AI'
        };
      default:
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Bot,
          label: 'AI Managed',
          description: 'This lead is managed by AI'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${className}`}>
            <Badge variant="outline" className={config.badge}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
            {aiStatus === 'handoff_pending' && onHumanTakeover && (
              <Button
                size="sm"
                variant="outline"
                onClick={onHumanTakeover}
                className="text-xs px-2 py-1 h-6"
              >
                Take Over
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">{config.description}</p>
            {lastAIAction && (
              <div className="text-xs">
                <span className="text-muted-foreground">Last action:</span>
                <p className="font-mono">{lastAIAction}</p>
              </div>
            )}
            {nextAIAction && aiStatus === 'active' && (
              <div className="text-xs">
                <span className="text-muted-foreground">Next action:</span>
                <p className="font-mono">{nextAIAction}</p>
              </div>
            )}
            {aiStatus === 'handoff_pending' && (
              <div className="text-xs text-orange-600">
                <p>Lead score threshold reached. Ready for human advisor.</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Component for displaying AI activity timeline
export function AIActivityTimeline({ 
  activities = [] 
}: { 
  activities?: Array<{
    timestamp: string;
    action: string;
    type: 'email' | 'sms' | 'call' | 'score' | 'handoff';
    success: boolean;
  }> 
}) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return MessageSquare;
      case 'sms': return MessageSquare;
      case 'call': return Phone;
      case 'score': return Bot;
      case 'handoff': return Hand;
      default: return Bot;
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">AI Activity Timeline</h4>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-xs text-muted-foreground">No AI activity recorded</p>
        ) : (
          activities.map((activity, index) => {
            const ActivityIcon = getActivityIcon(activity.type);
            return (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className={`p-1 rounded ${
                  activity.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <ActivityIcon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate">{activity.action}</p>
                  <p className="text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}