import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Download, Upload, FileX, Filter, Calendar, GraduationCap, Search, Settings2, Eye, EyeOff, GripVertical, X, Copy } from 'lucide-react';
import { useHasPermissions } from '@/hooks/useHasPermission';
import { EnhancedLeadFilters } from '@/services/enhancedLeadService';
import { LeadStage, LeadStatus, LeadSource, LeadPriority } from '@/types/lead';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
  minWidth?: number;
  maxWidth?: number;
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
  onImport: () => void;
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
  onImport,
  onSearch,
  columns = [],
  onColumnsChange
}: UnifiedLeadHeaderProps) {
  const navigate = useNavigate();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  
  // Permission checks
  const { data: permissions, isLoading: permissionsLoading } = useHasPermissions([
    'create_leads',
    'export_leads'
  ]);
  const canCreateLeads = permissions?.create_leads ?? false;
  const canExportLeads = permissions?.export_leads ?? false;
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
    // Debounce search for better performance
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(value);
      }, 300);
      return () => clearTimeout(timeoutId);
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
    <div className="space-y-6 md:space-y-8">
      {/* Page Title with Actions - HotSheet Style */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Lead Management</h1>
          <p className="text-muted-foreground mt-1.5 text-sm md:text-base">
            Track and manage your leads through their journey
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search Input - HotSheet Style */}
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 min-h-[44px] rounded-xl border-border/60 bg-muted/30 focus:bg-background focus:border-primary/40 transition-all"
              maxLength={100}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-lg hover:bg-muted"
                onClick={() => {
                  setSearchQuery('');
                  if (onSearch) onSearch('');
                }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {/* Action buttons - horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mb-1">
            {/* Manage Duplicates Button */}
            <Button 
              variant="outline" 
              size="icon" 
              className="min-h-[44px] min-w-[44px] shrink-0 rounded-xl border-border/60 hover:bg-muted/50 hover:border-primary/30 transition-all"
              onClick={() => navigate('/admin/leads/duplicates')}
              title="Manage Duplicates"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {columns.length > 0 && onColumnsChange && (
              <DropdownMenu open={showColumnSettings} onOpenChange={setShowColumnSettings}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="shrink-0 min-h-[44px] rounded-xl border-border/60 hover:bg-muted/50 hover:border-primary/30 transition-all">
                    <Settings2 className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Columns</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-popover z-50 rounded-xl border-border/60 p-3">
                  <div>
                    <div className="text-sm font-medium mb-3 text-foreground">Manage Columns</div>
                    <div className="space-y-1.5">
                      {columns.map((column) => (
                        <div 
                          key={column.id}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/50 cursor-move bg-popover transition-colors"
                          draggable
                          onDragStart={() => handleDragStart(column.id)}
                          onDragOver={(e) => handleDragOver(e, column.id)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="flex items-center gap-2.5">
                            <GripVertical className="h-4 w-4 text-muted-foreground/60" />
                            <span className="text-sm">{column.label}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-lg hover:bg-muted"
                            onClick={() => toggleColumnVisibility(column.id)}
                          >
                            {column.visible ? (
                              <Eye className="h-4 w-4 text-primary" />
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
            <Button variant="outline" onClick={onImport} className="shrink-0 min-h-[44px] rounded-xl border-border/60 hover:bg-muted/50 hover:border-primary/30 transition-all">
              <Upload className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            {canExportLeads && (
              <Button variant="outline" onClick={onExport} className="shrink-0 min-h-[44px] rounded-xl border-border/60 hover:bg-muted/50 hover:border-primary/30 transition-all">
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            )}
            {canCreateLeads && (
              <Button onClick={onAddLead} className="shrink-0 min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 transition-all">
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Lead</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stage Timeline - HotSheet Style with Pill Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={activeStage === "all" ? "default" : "outline"}
          onClick={() => onStageChange("all")}
          size="sm"
          className={cn(
            "whitespace-nowrap flex-shrink-0 rounded-full px-4 h-9 transition-all",
            activeStage === "all" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "border-border/60 hover:bg-muted/50 hover:border-primary/30"
          )}
        >
          All 
          <Badge 
            variant="secondary" 
            className={cn(
              "ml-2 rounded-full px-2 py-0.5 text-xs font-medium",
              activeStage === "all" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted"
            )}
          >
            {getTotalLeads()}
          </Badge>
        </Button>
        {stages.map((stage, index) => (
          <div key={stage.key} className="flex items-center gap-2 flex-shrink-0">
            {/* Horizontal connector line - HotSheet style */}
            {index > 0 && <div className="h-0.5 w-4 sm:w-6 bg-border/40 rounded-full hidden sm:block" />}
            <Button
              variant={activeStage === stage.key ? "default" : "outline"}
              onClick={() => onStageChange(stage.key)}
              size="sm"
              className={cn(
                "whitespace-nowrap text-xs sm:text-sm rounded-full px-3 sm:px-4 h-9 transition-all",
                activeStage === stage.key 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "border-border/60 hover:bg-muted/50 hover:border-primary/30"
              )}
            >
              {/* Horizontal colored status bar - HotSheet signature */}
              <div className={cn("w-3 h-1.5 rounded-full mr-2", stage.color)} />
              <span className="hidden sm:inline">{stage.label}</span>
              <span className="sm:hidden">{stage.label.split(' ')[0]}</span>
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-2 rounded-full px-2 py-0.5 text-xs font-medium",
                  activeStage === stage.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted"
                )}
              >
                {stage.count}
              </Badge>
            </Button>
          </div>
        ))}
      </div>

      {/* Advanced Filters Panel - HotSheet Style */}
      {showAdvancedFilters && (
        <div className="border-t border-border/40 pt-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Source Filter */}
            <div>
              <label className="text-sm font-medium mb-2.5 block text-foreground">Source</label>
              <Select
                value={filters.source?.[0] || "all"}
                onValueChange={(value) =>
                  onFilterChange({
                    source: value === "all" ? [] : [value as LeadSource],
                  })
                }
              >
                <SelectTrigger className="rounded-xl border-border/60 h-11">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
              <label className="text-sm font-medium mb-2.5 block text-foreground">Priority</label>
              <Select
                value={filters.priority?.[0] || "all"}
                onValueChange={(value) =>
                  onFilterChange({
                    priority: value === "all" ? [] : [value as LeadPriority],
                  })
                }
              >
                <SelectTrigger className="rounded-xl border-border/60 h-11">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
              <label className="text-sm font-medium mb-2.5 block text-foreground">Lead Score</label>
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
                <SelectTrigger className="rounded-xl border-border/60 h-11">
                  <SelectValue placeholder="All Scores" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
