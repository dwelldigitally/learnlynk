import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Settings2, Search, ChevronRight, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
  minWidth?: number;
  maxWidth?: number;
  category?: string;
}

interface EnhancedColumnSelectorProps {
  columns: ColumnConfig[];
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  onBulkVisibilityChange: (columnIds: string[], visible: boolean) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  Core: 'Core Information',
  Location: 'Location',
  Activity: 'Activity Metrics',
  Engagement: 'Engagement',
  Conversion: 'Conversion',
  Classification: 'Classification',
  Scores: 'Scores',
  Assignment: 'Assignment',
  Program: 'Program & Intake',
  Marketing: 'Marketing & UTM',
  Email: 'Email Preferences',
  System: 'System Fields',
  Tags: 'Tags & Notes',
};

const CATEGORY_ORDER = ['Core', 'Location', 'Activity', 'Engagement', 'Conversion', 'Classification', 'Scores', 'Assignment', 'Program', 'Marketing', 'Email', 'System', 'Tags'];

const DEFAULT_VISIBLE_COLUMNS = [
  'name', 'email', 'program_interest', 'phone', 'created_at', 
  'source', 'last_activity', 'stage', 'priority', 'assigned_to'
];

export function EnhancedColumnSelector({
  columns,
  onColumnVisibilityChange,
  onBulkVisibilityChange,
}: EnhancedColumnSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['core']));

  // Group columns by category
  const groupedColumns = useMemo(() => {
    const groups: Record<string, ColumnConfig[]> = {};
    
    columns.forEach(col => {
      const category = col.category || 'core';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(col);
    });

    return groups;
  }, [columns]);

  // Filter columns by search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedColumns;

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, ColumnConfig[]> = {};

    Object.entries(groupedColumns).forEach(([category, cols]) => {
      const matchingCols = cols.filter(col => 
        col.label.toLowerCase().includes(query) ||
        col.id.toLowerCase().includes(query)
      );
      if (matchingCols.length > 0) {
        filtered[category] = matchingCols;
      }
    });

    return filtered;
  }, [groupedColumns, searchQuery]);

  // Stats
  const visibleCount = columns.filter(c => c.visible).length;
  const totalCount = columns.length;

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Toggle all in category
  const toggleCategoryVisibility = (category: string, visible: boolean) => {
    const categoryColumns = groupedColumns[category] || [];
    const columnIds = categoryColumns.map(c => c.id);
    onBulkVisibilityChange(columnIds, visible);
  };

  // Check if all in category are visible
  const isCategoryFullyVisible = (category: string) => {
    const categoryColumns = groupedColumns[category] || [];
    return categoryColumns.every(c => c.visible);
  };

  // Check if some in category are visible
  const isCategoryPartiallyVisible = (category: string) => {
    const categoryColumns = groupedColumns[category] || [];
    const visibleInCategory = categoryColumns.filter(c => c.visible).length;
    return visibleInCategory > 0 && visibleInCategory < categoryColumns.length;
  };

  // Show all / hide all
  const showAll = () => {
    onBulkVisibilityChange(columns.map(c => c.id), true);
  };

  const resetToDefaults = () => {
    // First hide all columns
    onBulkVisibilityChange(columns.map(c => c.id), false);
    // Then show only the default columns
    onBulkVisibilityChange(DEFAULT_VISIBLE_COLUMNS, true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full border-border/60">
          <Settings2 className="h-4 w-4" />
          Columns
          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
            {visibleCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-3 border-b border-border/40">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">Table Columns</h4>
            <span className="text-xs text-muted-foreground">
              {visibleCount} of {totalCount} visible
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search columns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-sm rounded-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 p-2 border-b border-border/40 bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={showAll}
            className="h-7 text-xs flex-1"
          >
            <Eye className="h-3 w-3 mr-1" />
            Show All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefaults}
            className="h-7 text-xs flex-1"
          >
            <EyeOff className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>

        {/* Column List */}
        <ScrollArea className="h-[320px]">
          <div className="p-2">
            {CATEGORY_ORDER.filter(cat => filteredGroups[cat]?.length > 0).map((category) => {
              const categoryColumns = filteredGroups[category] || [];
              const isExpanded = expandedCategories.has(category) || searchQuery.trim().length > 0;
              const fullyVisible = isCategoryFullyVisible(category);
              const partiallyVisible = isCategoryPartiallyVisible(category);

              return (
                <Collapsible
                  key={category}
                  open={isExpanded}
                  onOpenChange={() => !searchQuery && toggleCategory(category)}
                  className="mb-1"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn(
                          "h-3.5 w-3.5 text-muted-foreground transition-transform",
                          isExpanded && "rotate-90"
                        )} />
                        <span className="text-sm font-medium">
                          {CATEGORY_LABELS[category] || category}
                        </span>
                        <Badge variant="outline" className="h-5 px-1.5 text-xs">
                          {categoryColumns.filter(c => c.visible).length}/{categoryColumns.length}
                        </Badge>
                      </div>
                      <Checkbox
                        checked={fullyVisible}
                        ref={(ref) => {
                          if (ref && partiallyVisible) {
                            (ref as any).dataset.state = 'indeterminate';
                          }
                        }}
                        onCheckedChange={(checked) => {
                          toggleCategoryVisibility(category, !!checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-5 space-y-0.5">
                      {categoryColumns.map((column) => (
                        <label
                          key={column.id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                            "hover:bg-muted/50",
                            column.visible && "bg-primary/5"
                          )}
                        >
                          <Checkbox
                            checked={column.visible}
                            onCheckedChange={(checked) => onColumnVisibilityChange(column.id, !!checked)}
                          />
                          <span className="text-sm flex-1 truncate">{column.label}</span>
                          {column.visible && (
                            <Check className="h-3.5 w-3.5 text-primary" />
                          )}
                        </label>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}

            {Object.keys(filteredGroups).length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No columns match "{searchQuery}"
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
