import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { X, Clock, MapPin, GraduationCap, Target, Star, Filter } from "lucide-react";
import { EnhancedLeadFilters } from "@/services/enhancedLeadService";

interface LeadStageFiltersProps {
  activeStage: string;
  filters: EnhancedLeadFilters;
  onFilterChange: (filters: EnhancedLeadFilters) => void;
  onClearFilters: () => void;
  programs: string[];
}

interface FilterConfig {
  key: string;
  label: string;
  type: string;
  icon?: React.ComponentType<any>;
  options?: string[];
}

interface StageConfig {
  title: string;
  filters: FilterConfig[];
}

const stageFilterConfigs: Record<string, StageConfig> = {
  'NEW_INQUIRY': {
    title: 'New Inquiry Filters',
    filters: [
      { key: 'lead_score_min', label: 'Min Lead Score', type: 'number', icon: Star },
      { key: 'source', label: 'Source', type: 'select', options: ['web', 'social_media', 'event', 'referral', 'ads'] },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin },
      { key: 'days_since_inquiry', label: 'Days Since Inquiry', type: 'select', options: ['1', '3', '7', '14', '30'] }
    ]
  },
  'QUALIFICATION': {
    title: 'Qualification Stage Filters', 
    filters: [
      { key: 'priority', label: 'Priority', type: 'select', options: ['urgent', 'high', 'medium', 'low'] },
      { key: 'assigned_to', label: 'Assigned To', type: 'select', options: [] },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin },
      { key: 'program_interest', label: 'Program Interest', type: 'select', options: [] }
    ]
  },
  'NURTURING': {
    title: 'Nurturing Stage Filters',
    filters: [
      { key: 'last_contact', label: 'Last Contact', type: 'select', options: ['1', '3', '7', '14', '30'] },
      { key: 'engagement_level', label: 'Engagement', type: 'select', options: ['high', 'medium', 'low'] },
      { key: 'program_interest', label: 'Program Interest', type: 'select', options: [] },
      { key: 'lead_score_min', label: 'Min Score', type: 'number', icon: Star }
    ]
  },
  'PROPOSAL_SENT': {
    title: 'Proposal Stage Filters',
    filters: [
      { key: 'days_since_proposal', label: 'Days Since Proposal', type: 'select', options: ['1', '3', '7', '14'] },
      { key: 'proposal_type', label: 'Proposal Type', type: 'select', options: ['standard', 'custom', 'scholarship'] },
      { key: 'follow_up_status', label: 'Follow-up Status', type: 'select', options: ['pending', 'completed', 'overdue'] },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin }
    ]
  },
  'APPLICATION_STARTED': {
    title: 'Application Started Filters',
    filters: [
      { key: 'completion_percentage', label: 'Completion %', type: 'select', options: ['0-25', '25-50', '50-75', '75-99'] },
      { key: 'days_since_start', label: 'Days Since Start', type: 'select', options: ['1', '3', '7', '14', '30'] },
      { key: 'program_interest', label: 'Program', type: 'select', options: [] },
      { key: 'risk_level', label: 'Risk Level', type: 'select', options: ['low', 'medium', 'high'] }
    ]
  },
  'CONVERTED': {
    title: 'Converted Leads Filters',
    filters: [
      { key: 'program_interest', label: 'Program', type: 'select', options: [] },
      { key: 'conversion_date', label: 'Conversion Date', type: 'date' },
      { key: 'intake_date', label: 'Intake Date', type: 'date' },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin }
    ]
  },
  'all': {
    title: 'All Leads Filters',
    filters: [
      { key: 'stage', label: 'Stage', type: 'select', options: ['NEW_INQUIRY', 'QUALIFICATION', 'NURTURING', 'PROPOSAL_SENT', 'APPLICATION_STARTED', 'CONVERTED'] },
      { key: 'priority', label: 'Priority', type: 'select', options: ['urgent', 'high', 'medium', 'low'] },
      { key: 'source', label: 'Source', type: 'select', options: ['web', 'social_media', 'event', 'referral', 'ads'] },
      { key: 'assigned_to', label: 'Assigned To', type: 'select', options: [] }
    ]
  }
};

export function LeadStageFilters({ activeStage, filters, onFilterChange, onClearFilters, programs }: LeadStageFiltersProps) {
  const config = stageFilterConfigs[activeStage] || stageFilterConfigs['all'];
  
  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return Boolean(value);
  }).length;

  // Update program options in config
  const configWithPrograms = {
    ...config,
    filters: config.filters.map(filter => 
      filter.key === 'program_interest' 
        ? { ...filter, options: programs }
        : filter
    )
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters };
    
    if (key === 'date_range_start' || key === 'date_range_end') {
      if (!newFilters.date_range) {
        newFilters.date_range = { start: new Date(), end: new Date() };
      }
      if (key === 'date_range_start') {
        newFilters.date_range.start = value;
      } else {
        newFilters.date_range.end = value;
      }
    } else if (key === 'lead_score_min') {
      if (!newFilters.lead_score_range) {
        newFilters.lead_score_range = { min: 0, max: 100 };
      }
      newFilters.lead_score_range.min = parseInt(value) || 0;
    } else if (Array.isArray(filters[key as keyof EnhancedLeadFilters])) {
      // Handle array filters (multi-select)
      const currentValues = (filters[key as keyof EnhancedLeadFilters] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      (newFilters as any)[key] = newValues;
    } else {
      // Handle single value filters
      (newFilters as any)[key] = value || undefined;
    }
    
    onFilterChange(newFilters);
  };

  if (activeStage === 'all' && activeFiltersCount === 0) {
    return null;
  }

  return (
    <Card className="bg-card border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {configWithPrograms.title}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Date Range Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Date From
            </Label>
            <DatePicker
              date={filters.date_range?.start}
              onDateChange={(date) => handleFilterChange('date_range_start', date)}
              placeholder="From date"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Date To
            </Label>
            <DatePicker
              date={filters.date_range?.end}
              onDateChange={(date) => handleFilterChange('date_range_end', date)}
              placeholder="To date"
              className="h-8 text-xs"
            />
          </div>
          
          {/* Program Filter - Always show if programs available */}
          {programs.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs font-medium flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                Program Interest
              </Label>
              <Select
                value={filters.program_interest?.[0] || ''}
                onValueChange={(value) => handleFilterChange('program_interest', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select program..." />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Stage-specific Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {configWithPrograms.filters.slice(0, 4).map((filter) => (
            <div key={filter.key} className="space-y-1">
              <Label htmlFor={filter.key} className="text-xs font-medium flex items-center gap-1">
                {filter.icon && <filter.icon className="h-3 w-3" />}
                {filter.label}
              </Label>
              
              {filter.type === 'select' && filter.options ? (
                <Select
                  value={(filters as any)[filter.key] || ''}
                  onValueChange={(value) => handleFilterChange(filter.key, value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : filter.type === 'date' ? (
                <DatePicker
                  date={(filters as any)[filter.key]}
                  onDateChange={(date) => handleFilterChange(filter.key, date)}
                  placeholder="Select date"
                  className="h-8 text-xs"
                />
              ) : (
                <Input
                  id={filter.key}
                  type={filter.type}
                  placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                  value={(filters as any)[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="h-8 text-xs"
                />
              )}
            </div>
          ))}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleFilterChange('assigned_to', [])}
            className="text-xs"
          >
            Unassigned
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleFilterChange('priority', ['high', 'urgent'])}
            className="text-xs"
          >
            High Priority
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleFilterChange('lead_score_min', '80')}
            className="text-xs"
          >
            Hot Leads (80+)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}