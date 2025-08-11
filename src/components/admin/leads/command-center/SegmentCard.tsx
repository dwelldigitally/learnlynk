import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock, User, DollarSign, AlertTriangle, Eye, MessageSquare, Play, MoreHorizontal, ChevronDown, Filter, UserPlus, Zap } from "lucide-react";
import { useState } from "react";
import { BulkActionsToolbar } from "./BulkActionsToolbar";
import { ExpandedItemDetails } from "./ExpandedItemDetails";
import { useSegmentSelection } from "@/hooks/useSegmentSelection";

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
  onBulkAction?: (itemIds: string[], action: string) => void;
}

export function SegmentCard({ 
  title, 
  icon: Icon, 
  count, 
  items, 
  onViewAll, 
  onQuickAction,
  onBulkAction 
}: SegmentCardProps) {
  const {
    selectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    hasSelection
  } = useSegmentSelection();

  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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
          { icon: UserPlus, action: "assign", label: "Assign" },
          { icon: Zap, action: "ai-assign", label: "AI Assign" },
          { icon: Eye, action: "view", label: "View" }
        ];
      case "Unresponsive High-Quality":
        return [
          { icon: MessageSquare, action: "message", label: "Message" },
          { icon: Play, action: "sequence", label: "Sequence" },
          { icon: Zap, action: "ai-sequence", label: "AI Sequence" }
        ];
      case "SLA Violations":
        return [
          { icon: AlertTriangle, action: "escalate", label: "Escalate" },
          { icon: UserPlus, action: "reassign", label: "Reassign" },
          { icon: Filter, action: "filter", label: "Filter" }
        ];
      default:
        return [
          { icon: Eye, action: "view", label: "View" },
          { icon: Play, action: "action", label: "Action" }
        ];
    }
  };

  const quickActions = getQuickActions(title);
  const itemIds = items.map(item => item.id);

  const handleExpandedAction = (itemId: string, action: string) => {
    onQuickAction?.(itemId, action);
    setExpandedItem(null);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected(itemIds) || isPartiallySelected(itemIds)}
                onCheckedChange={() => toggleAll(itemIds)}
                className="h-3 w-3"
              />
              <Icon className="h-4 w-4" />
              <span>{title}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {hasSelection ? `${selectedItems.length}/${count}` : count}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {items.slice(0, 5).map((item) => (
              <div 
                key={item.id} 
                className={`group flex items-center justify-between p-2 rounded border transition-colors ${
                  isSelected(item.id) 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Checkbox
                    checked={isSelected(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="h-3 w-3"
                  />
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
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Quick Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    {quickActions.slice(0, 2).map(({ icon: ActionIcon, action, label }) => (
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
                  
                  {/* Expand Button */}
                  <Popover 
                    open={expandedItem === item.id} 
                    onOpenChange={(open) => setExpandedItem(open ? item.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Expand details"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="left" align="start" className="p-0">
                      <ExpandedItemDetails 
                        item={item} 
                        onAction={(action) => handleExpandedAction(item.id, action)}
                      />
                    </PopoverContent>
                  </Popover>
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

      {/* Bulk Actions Toolbar */}
      {hasSelection && (
        <BulkActionsToolbar
          selectedItems={selectedItems}
          onClearSelection={clearSelection}
          onAssign={(itemIds, advisorId) => onBulkAction?.(itemIds, 'assign')}
          onSequenceEnroll={(itemIds, sequenceId) => onBulkAction?.(itemIds, 'sequence')}
        />
      )}
    </>
  );
}