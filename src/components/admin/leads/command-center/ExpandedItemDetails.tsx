import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  Filter,
  Zap,
  UserPlus
} from "lucide-react";

interface SegmentItem {
  id: string;
  title: string;
  subtitle?: string;
  urgency: "high" | "medium" | "low";
  meta?: string;
}

interface ExpandedItemDetailsProps {
  item: SegmentItem;
  onAction: (action: string) => void;
}

export function ExpandedItemDetails({ item, onAction }: ExpandedItemDetailsProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="w-80 p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{item.title}</h4>
          <Badge variant={getUrgencyColor(item.urgency)} className="text-xs">
            {item.urgency}
          </Badge>
        </div>
        {item.subtitle && (
          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
        )}
        {item.meta && (
          <p className="text-xs text-muted-foreground">{item.meta}</p>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Contact Details
        </h5>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>john.doe@example.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>Last contacted: 2 days ago</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Quick Actions
        </h5>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onAction('assign')}
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Assign
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onAction('sequence')}
          >
            <Zap className="h-3 w-3 mr-1" />
            Sequence
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onAction('message')}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Message
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onAction('filter')}
          >
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Recent Activity
        </h5>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Email opened</span>
            <span className="text-muted-foreground">1h ago</span>
          </div>
          <div className="flex justify-between">
            <span>Form submitted</span>
            <span className="text-muted-foreground">2h ago</span>
          </div>
          <div className="flex justify-between">
            <span>Page visited</span>
            <span className="text-muted-foreground">1d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}