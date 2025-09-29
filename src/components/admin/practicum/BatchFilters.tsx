import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Users,
  AlertTriangle,
  LayoutGrid,
  List
} from 'lucide-react';

interface FilterState {
  search: string;
  status: string;
  program: string;
  urgency: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface BatchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  programs: string[];
  activeFilterCount: number;
}

export function BatchFilters({ 
  filters, 
  onFiltersChange, 
  viewMode, 
  onViewModeChange,
  programs,
  activeFilterCount 
}: BatchFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilter = (key: keyof FilterState) => {
    if (key === 'dateRange') {
      updateFilter(key, { from: undefined, to: undefined });
    } else {
      updateFilter(key, '');
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      status: '',
      program: '',
      urgency: '',
      dateRange: { from: undefined, to: undefined }
    });
  };

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'bg-green-500' },
    { value: 'about-to-start', label: 'Starting Soon', color: 'bg-blue-500' },
    { value: 'about-to-end', label: 'Ending Soon', color: 'bg-orange-500' },
    { value: 'missing-attendance', label: 'Missing Attendance', color: 'bg-amber-500' },
    { value: 'missing-docs', label: 'Missing Documents', color: 'bg-red-500' },
    { value: 'unscheduled', label: 'Unscheduled', color: 'bg-gray-500' },
    { value: 'completed', label: 'Completed', color: 'bg-emerald-500' }
  ];

  const urgencyOptions = [
    { value: 'critical', label: 'Critical', color: 'bg-red-600' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'low', label: 'Low', color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-4">
      {/* Top Row - Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search batches, students, or sites..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('cards')}
              className="h-8 px-3"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.color}`} />
                  {status.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Program Filter */}
        <Select value={filters.program} onValueChange={(value) => updateFilter('program', value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Programs</SelectItem>
            {programs.map((program) => (
              <SelectItem key={program} value={program}>
                {program}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Urgency Filter */}
        <Select value={filters.urgency} onValueChange={(value) => updateFilter('urgency', value)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            {urgencyOptions.map((urgency) => (
              <SelectItem key={urgency.value} value={urgency.value}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-3 h-3 text-${urgency.value === 'critical' ? 'red' : urgency.value === 'high' ? 'orange' : urgency.value === 'medium' ? 'yellow' : 'green'}-500`} />
                  {urgency.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd")} - {format(filters.dateRange.to, "LLL dd")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd, y")
                )
              ) : (
                "Date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange.from}
              selected={{
                from: filters.dateRange.from,
                to: filters.dateRange.to
              }}
              onSelect={(range) => updateFilter('dateRange', range || { from: undefined, to: undefined })}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Clear All Button */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('search')}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusOptions.find(s => s.value === filters.status)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('status')}
              />
            </Badge>
          )}
          {filters.program && (
            <Badge variant="secondary" className="gap-1">
              Program: {filters.program}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('program')}
              />
            </Badge>
          )}
          {filters.urgency && (
            <Badge variant="secondary" className="gap-1">
              Urgency: {urgencyOptions.find(u => u.value === filters.urgency)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('urgency')}
              />
            </Badge>
          )}
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary" className="gap-1">
              Date Range
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('dateRange')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}