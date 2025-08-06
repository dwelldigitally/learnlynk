
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, FileX, Filter, Calendar, GraduationCap } from 'lucide-react';
import { EnhancedLeadFilters } from '@/services/enhancedLeadService';
import { LeadStage, LeadStatus, LeadSource, LeadPriority } from '@/types/lead';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  onExport
}: UnifiedLeadHeaderProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getTotalLeads = () => stages.reduce((sum, stage) => sum + stage.count, 0);

  const getStageColor = (stage: string) => {
    const stageData = stages.find(s => s.key === stage);
    return stageData?.color || 'bg-muted';
  };

  const quickFilterPresets = [
    {
      label: 'Due Today',
      filter: { date_range: { start: new Date(), end: new Date() }, status: ['new' as LeadStatus, 'contacted' as LeadStatus] }
    },
    {
      label: 'High Priority',
      filter: { priority: ['high' as LeadPriority, 'urgent' as LeadPriority] }
    },
    {
      label: 'Unassigned',
      filter: { assigned_to: [] }
    },
    {
      label: 'Hot Leads',
      filter: { lead_score_range: { min: 80, max: 100 } }
    }
  ];

  return (
    <div className="space-y-4">
      {/* Stage Navigation with Tabs */}
      <div className="mb-4">
        <Tabs 
          value={activeStage} 
          onValueChange={onStageChange}
        >
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-none lg:flex h-auto">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
              All ({getTotalLeads()})
            </TabsTrigger>
            {stages.map((stage) => (
              <TabsTrigger 
                key={stage.key} 
                value={stage.key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
              >
                {stage.label} ({stage.count})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Horizontal Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{getTotalLeads()}</span> total leads
          </div>
          {selectedLeadsCount > 0 && (
            <div className="text-sm text-primary">
              <span className="font-medium">{selectedLeadsCount}</span> selected
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-xs h-8"
          >
            <Filter className="w-3 h-3 mr-1" />
            Filters
          </Button>
        </div>
      </div>

      {/* Quick Filters in a clean horizontal layout */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        {/* Quick Filters */}
        {quickFilterPresets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={() => onFilterChange(preset.filter)}
          >
            {preset.label}
          </Button>
        ))}

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Calendar className="w-3 h-3 mr-1" />
              Date Range
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="end">
            <div className="space-y-3">
              <div className="text-sm font-medium">Filter by Date Range</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">From</label>
                  <DatePicker
                    date={filters.date_range?.start}
                    onDateChange={(date) => 
                      onFilterChange({
                        date_range: { 
                          start: date, 
                          end: filters.date_range?.end || new Date() 
                        }
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">To</label>
                  <DatePicker
                    date={filters.date_range?.end}
                    onDateChange={(date) => 
                      onFilterChange({
                        date_range: { 
                          start: filters.date_range?.start || new Date(), 
                          end: date 
                        }
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Program Interest Filter */}
        <Select 
          value={filters.program_interest?.[0] || "all"} 
          onValueChange={(value) => onFilterChange({ program_interest: value === "all" ? [] : [value] })}
        >
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {programs.map((program) => (
              <SelectItem key={program} value={program}>
                {program}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {Object.keys(filters).length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs h-8">
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Source Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Source</label>
              <Select
                value={filters.source?.[0] || "all"}
                onValueChange={(value) => onFilterChange({ source: value === "all" ? [] : [value as LeadSource] })}
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
                onValueChange={(value) => onFilterChange({ priority: value === "all" ? [] : [value as LeadPriority] })}
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
                  filters.lead_score_range?.min === 80 ? "high" :
                  filters.lead_score_range?.min === 50 ? "medium" :
                  filters.lead_score_range?.min === 20 ? "low" : "all"
                }
                onValueChange={(value) => {
                  const ranges = {
                    high: { min: 80, max: 100 },
                    medium: { min: 50, max: 79 },
                    low: { min: 20, max: 49 }
                  };
                  onFilterChange({ 
                    lead_score_range: value === "all" ? undefined : ranges[value as keyof typeof ranges] 
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
