import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Download, FileX, Filter, Calendar, GraduationCap, Search, Settings2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { EnhancedLeadFilters } from '@/services/enhancedLeadService';
import { LeadStage, LeadStatus, LeadSource, LeadPriority } from '@/types/lead';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
}
interface StageStats {
  key: string;
  label: string;
  count: number;
  color: string;
}
interface UnifiedLeadHeaderProps {
  stages: StageStats[];
  activeStage: string;
  selectedLeadsCount: number;
  filters: EnhancedLeadFilters;
  programs: string[];
  onStageChange: (stage: string) => void;
  onFilterChange: (filters: Partial<EnhancedLeadFilters>) => void;
  onClearFilters: () => void;
  onAddLead: () => void;
  onExport: () => void;
  onSearch?: (query: string) => void;
  columns?: ColumnConfig[];
  onColumnsChange?: (columns: ColumnConfig[]) => void;
}
export function UnifiedLeadHeader({
  stages,
  activeStage,
  selectedLeadsCount,
  filters,
  programs,
  onStageChange,
  onFilterChange,
  onClearFilters,
  onAddLead,
  onExport,
  onSearch,
  columns = [],
  onColumnsChange
}: UnifiedLeadHeaderProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const getTotalLeads = () => stages.reduce((sum, stage) => sum + stage.count, 0);
  const getStageColor = (stage: string) => {
    const stageData = stages.find(s => s.key === stage);
    return stageData?.color || 'bg-muted';
  };
  const quickFilterPresets = [{
    label: 'Due Today',
    filter: {
      date_range: {
        start: new Date(),
        end: new Date()
      },
      status: ['new' as LeadStatus, 'contacted' as LeadStatus]
    }
  }, {
    label: 'High Priority',
    filter: {
      priority: ['high' as LeadPriority, 'urgent' as LeadPriority]
    }
  }, {
    label: 'Unassigned',
    filter: {
      assigned_to: []
    }
  }, {
    label: 'Hot Leads',
    filter: {
      lead_score_range: {
        min: 80,
        max: 100
      }
    }
  }];
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    if (onColumnsChange) {
      const updatedColumns = columns.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      );
      onColumnsChange(updatedColumns);
    }
  };

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === columnId) return;

    if (onColumnsChange) {
      const draggedIndex = columns.findIndex(col => col.id === draggedColumn);
      const targetIndex = columns.findIndex(col => col.id === columnId);
      
      const newColumns = [...columns];
      const [removed] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, removed);
      
      onColumnsChange(newColumns);
    }
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Title with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your leads through their journey
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          {columns.length > 0 && onColumnsChange && (
            <DropdownMenu open={showColumnSettings} onOpenChange={setShowColumnSettings}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-popover z-50">
                <div className="p-2">
                  <div className="text-sm font-medium mb-2">Manage Columns</div>
                  <div className="space-y-2">
                    {columns.map((column) => (
                      <div 
                        key={column.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-move bg-popover"
                        draggable
                        onDragStart={() => handleDragStart(column.id)}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{column.label}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleColumnVisibility(column.id)}
                        >
                          {column.visible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={onAddLead}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stage Timeline - Compact Horizontal */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeStage === "all" ? "default" : "outline"}
          onClick={() => onStageChange("all")}
          size="sm"
          className="whitespace-nowrap"
        >
          All <Badge variant="secondary" className="ml-2">{getTotalLeads()}</Badge>
        </Button>
        {stages.map((stage, index) => (
          <div key={stage.key} className="flex items-center gap-2">
            {index > 0 && <div className="h-px w-8 bg-border" />}
            <Button
              variant={activeStage === stage.key ? "default" : "outline"}
              onClick={() => onStageChange(stage.key)}
              size="sm"
              className="whitespace-nowrap"
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${stage.color}`} />
              {stage.label} <Badge variant="secondary" className="ml-2">{stage.count}</Badge>
            </Button>
          </div>
        ))}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Source Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Source</label>
              <Select
                value={filters.source?.[0] || "all"}
                onValueChange={(value) =>
                  onFilterChange({
                    source: value === "all" ? [] : [value as LeadSource],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="paid_ads">Paid Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select
                value={filters.priority?.[0] || "all"}
                onValueChange={(value) =>
                  onFilterChange({
                    priority: value === "all" ? [] : [value as LeadPriority],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lead Score Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Lead Score</label>
              <Select
                value={
                  filters.lead_score_range?.min === 80
                    ? "high"
                    : filters.lead_score_range?.min === 50
                    ? "medium"
                    : filters.lead_score_range?.min === 20
                    ? "low"
                    : "all"
                }
                onValueChange={(value) => {
                  const ranges = {
                    high: { min: 80, max: 100 },
                    medium: { min: 50, max: 79 },
                    low: { min: 20, max: 49 },
                  };
                  onFilterChange({
                    lead_score_range:
                      value === "all" ? undefined : ranges[value as keyof typeof ranges],
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Scores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80-100)</SelectItem>
                  <SelectItem value="medium">Medium (50-79)</SelectItem>
                  <SelectItem value="low">Low (20-49)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}