import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, User, DollarSign, AlertTriangle, Eye, MessageSquare, Play, UserPlus, Zap, Filter, History, Settings } from "lucide-react";
import { useState } from "react";
import { BulkActionsToolbar } from "./BulkActionsToolbar";
import { useSegmentSelection } from "@/hooks/useSegmentSelection";
import { SegmentDetailsTab } from "./expanded-tabs/SegmentDetailsTab";
import { SegmentActionsTab } from "./expanded-tabs/SegmentActionsTab";
import { SegmentHistoryTab } from "./expanded-tabs/SegmentHistoryTab";
import { SegmentFiltersTab } from "./expanded-tabs/SegmentFiltersTab";

interface SegmentItem {
  id: string;
  title: string;
  subtitle?: string;
  urgency: "high" | "medium" | "low";
  meta?: string;
  email?: string;
  phone?: string;
  source?: string;
  score?: number;
  lastActivity?: string;
  assignedTo?: string;
  status?: string;
  value?: number;
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

export function EnhancedSegmentCard({ 
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

  const [expandedItem, setExpandedItem] = useState<SegmentItem | null>(null);
  const [showAllExpanded, setShowAllExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

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

  const handleExpandedAction = (action: string, data?: any) => {
    if (expandedItem) {
      onQuickAction?.(expandedItem.id, action);
    }
    setExpandedItem(null);
  };

  const handleExpandItem = (item: SegmentItem) => {
    setExpandedItem(item);
    setActiveTab("details");
  };

  return (
    <>
      <Card className="h-full transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected(itemIds) || isPartiallySelected(itemIds)}
                onCheckedChange={() => toggleAll(itemIds)}
                className="h-3 w-3"
              />
              <Icon className="h-4 w-4 text-primary" />
              <span className="font-medium">{title}</span>
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {hasSelection ? `${selectedItems.length}/${count}` : count}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {items.slice(0, 5).map((item) => (
              <div 
                key={item.id} 
                className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                  isSelected(item.id) 
                    ? 'bg-primary/10 border-primary/30 shadow-sm' 
                    : 'hover:bg-muted/50 hover:border-muted-foreground/20'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Checkbox
                    checked={isSelected(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="h-3 w-3"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <Badge variant={getUrgencyColor(item.urgency)} className="text-xs px-2 py-0.5">
                        {item.urgency}
                      </Badge>
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground truncate mb-1">{item.subtitle}</p>
                    )}
                    {item.meta && (
                      <p className="text-xs text-muted-foreground/80">{item.meta}</p>
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
                        className="h-7 w-7 p-0 hover:bg-primary/10"
                        onClick={() => onQuickAction?.(item.id, action)}
                        title={label}
                      >
                        <ActionIcon className="h-3.5 w-3.5" />
                      </Button>
                    ))}
                  </div>
                  
                  {/* Enhanced Expand Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-105"
                    onClick={() => handleExpandItem(item)}
                    title="Expand details"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-4 text-xs hover:bg-primary/5"
            onClick={() => {
              console.log('View all button clicked');
              setShowAllExpanded(true);
            }}
          >
            View all {count} items
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Expanded Dialog for Single Item */}
      <Dialog open={!!expandedItem} onOpenChange={(open) => !open && setExpandedItem(null)}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{expandedItem?.title}</span>
                  {expandedItem && (
                    <Badge variant={getUrgencyColor(expandedItem.urgency)} className="text-xs">
                      {expandedItem.urgency} priority
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-normal mt-1">
                  {title} • {expandedItem?.subtitle}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-6 mt-4 grid w-fit grid-cols-4">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Actions
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="details" className="h-full m-0">
                <SegmentDetailsTab 
                  item={expandedItem} 
                  onAction={handleExpandedAction}
                />
              </TabsContent>
              
              <TabsContent value="actions" className="h-full m-0">
                <SegmentActionsTab 
                  item={expandedItem}
                  segmentType={title}
                  onAction={handleExpandedAction}
                />
              </TabsContent>
              
              <TabsContent value="history" className="h-full m-0">
                <SegmentHistoryTab 
                  item={expandedItem}
                  onAction={handleExpandedAction}
                />
              </TabsContent>
              
              <TabsContent value="filters" className="h-full m-0">
                <SegmentFiltersTab 
                  segmentType={title}
                  currentFilters={{}}
                  onFiltersChange={(filters) => console.log('Filters changed:', filters)}
                />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Enhanced Expanded Dialog for All Items */}
      <Dialog open={showAllExpanded} onOpenChange={setShowAllExpanded}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {count} items
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-normal mt-1">
                  Complete view of all {title.toLowerCase()}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-6 mt-4 grid w-fit grid-cols-4">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                All Items
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Bulk Actions
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Activity History
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters & Search
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="details" className="h-full m-0">
                <div className="h-full overflow-auto p-6">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                          isSelected(item.id) 
                            ? 'bg-primary/10 border-primary/30 shadow-sm' 
                            : 'hover:bg-muted/50 hover:border-muted-foreground/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Checkbox
                            checked={isSelected(item.id)}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="h-4 w-4"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{item.title}</p>
                              <Badge variant={getUrgencyColor(item.urgency)} className="text-xs">
                                {item.urgency}
                              </Badge>
                            </div>
                            {item.subtitle && (
                              <p className="text-sm text-muted-foreground mb-1">{item.subtitle}</p>
                            )}
                            {item.meta && (
                              <p className="text-sm text-muted-foreground/80">{item.meta}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {quickActions.map(({ icon: ActionIcon, action, label }) => (
                            <Button
                              key={action}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                              onClick={() => onQuickAction?.(item.id, action)}
                              title={label}
                            >
                              <ActionIcon className="h-4 w-4" />
                            </Button>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                            onClick={() => {
                              handleExpandItem(item);
                              setShowAllExpanded(false);
                            }}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="h-full m-0">
                <div className="h-full overflow-auto p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Bulk Actions</h3>
                    <p className="text-sm text-muted-foreground">
                      Perform actions on selected items ({selectedItems.length} selected)
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {quickActions.map(({ icon: ActionIcon, action, label }) => (
                        <Button
                          key={action}
                          variant="outline"
                          className="flex items-center gap-2 h-12"
                          onClick={() => console.log('Bulk action:', action)}
                          disabled={selectedItems.length === 0}
                        >
                          <ActionIcon className="h-4 w-4" />
                          {label} Selected
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="h-full m-0">
                <div className="h-full overflow-auto p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Activity History</h3>
                    <p className="text-sm text-muted-foreground">
                      Recent activity for {title.toLowerCase()}
                    </p>
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="filters" className="h-full m-0">
                <div className="h-full overflow-auto p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Filters & Search</h3>
                    <p className="text-sm text-muted-foreground">
                      Filter and search {title.toLowerCase()}
                    </p>
                    <div className="text-center py-8 text-muted-foreground">
                      <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Advanced filters coming soon</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

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