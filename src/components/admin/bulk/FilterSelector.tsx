import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { EnhancedLeadService } from '@/services/enhancedLeadService';
import { LeadSearchFilters } from '@/types/lead';
import { X } from 'lucide-react';

interface FilterSelectorProps {
  onFiltersChange: (filters: LeadSearchFilters, count: number) => void;
  selectedLeadsCount?: number;
}

interface FilterOptions {
  sources: string[];
  statuses: string[];
  priorities: string[];
  assignees: Array<{ id: string; name: string }>;
  programs: string[];
}

export function FilterSelector({ onFiltersChange, selectedLeadsCount = 0 }: FilterSelectorProps) {
  const [dataSource, setDataSource] = useState<'all' | 'selected' | 'filtered'>('all');
  const [filters, setFilters] = useState<LeadSearchFilters>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sources: [],
    statuses: [],
    priorities: [],
    assignees: [],
    programs: []
  });
  const [leadCount, setLeadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    updateLeadCount();
  }, [dataSource, filters]);

  const loadFilterOptions = async () => {
    try {
      const options = await EnhancedLeadService.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  const updateLeadCount = async () => {
    if (dataSource === 'selected') {
      setLeadCount(selectedLeadsCount);
      onFiltersChange(filters, selectedLeadsCount);
      return;
    }

    if (dataSource === 'all' && Object.keys(filters).length === 0) {
      setLeadCount(0); // Will be updated with actual count
      onFiltersChange({}, 0);
      return;
    }

    if (dataSource === 'filtered') {
      setLoading(true);
      try {
        const response = await EnhancedLeadService.getLeads(1, 1, filters);
        setLeadCount(response.total);
        onFiltersChange(filters, response.total);
      } catch (error) {
        console.error('Failed to get lead count:', error);
        setLeadCount(0);
      } finally {
        setLoading(false);
      }
    }
  };

  const addFilter = (key: keyof LeadSearchFilters, value: string) => {
    setFilters(prev => {
      const existing = prev[key] as string[] || [];
      if (existing.includes(value)) return prev;
      return { ...prev, [key]: [...existing, value] };
    });
    setDataSource('filtered');
  };

  const removeFilter = (key: keyof LeadSearchFilters, value: string) => {
    setFilters(prev => {
      const existing = prev[key] as string[] || [];
      const updated = existing.filter(v => v !== value);
      if (updated.length === 0) {
        const { [key]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: updated };
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setDataSource('all');
  };

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4">
      <div>
        <Label>Data Source</Label>
        <Select value={dataSource} onValueChange={(value: 'all' | 'selected' | 'filtered') => setDataSource(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            <SelectItem value="selected" disabled={selectedLeadsCount === 0}>
              Selected Leads ({selectedLeadsCount})
            </SelectItem>
            <SelectItem value="filtered">Custom Filter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {dataSource === 'filtered' && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select onValueChange={(value) => addFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add status filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Source</Label>
                <Select onValueChange={(value) => addFilter('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add source filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.sources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select onValueChange={(value) => addFilter('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add priority filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assignee</Label>
                <Select onValueChange={(value) => addFilter('assigned_to', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add assignee filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.assignees.map(assignee => (
                      <SelectItem key={assignee.id} value={assignee.id}>{assignee.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasFilters && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Active Filters</Label>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, values]) =>
                    (values as string[]).map(value => (
                      <Badge key={`${key}-${value}`} variant="secondary" className="gap-1">
                        {key}: {value}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFilter(key as keyof LeadSearchFilters, value)}
                        />
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="bg-muted/50 p-3 rounded-lg">
        <div className="text-sm">
          <strong>Leads to be affected: </strong>
          {loading ? 'Calculating...' : leadCount.toLocaleString()}
        </div>
      </div>
    </div>
  );
}