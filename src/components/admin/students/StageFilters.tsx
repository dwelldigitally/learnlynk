import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Clock, MapPin, GraduationCap } from "lucide-react";
import { StudentFilters } from "@/services/studentService";

interface StageFiltersProps {
  activeStage: string;
  filters: StudentFilters;
  onFilterChange: (key: keyof StudentFilters, value: string) => void;
  onClearFilters: () => void;
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
  'LEAD_FORM': {
    title: 'Lead Form Filters',
    filters: [
      { key: 'lead_score_min', label: 'Min Lead Score', type: 'number', icon: GraduationCap },
      { key: 'source', label: 'Source', type: 'select', options: ['Website', 'Referral', 'Social Media', 'Advertisement'] },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin },
      { key: 'days_since_submission', label: 'Days Since Submission', type: 'select', options: ['1', '3', '7', '14', '30'] }
    ]
  },
  'SEND_DOCUMENTS': {
    title: 'Document Stage Filters', 
    filters: [
      { key: 'days_waiting', label: 'Days Waiting', type: 'select', options: ['1', '3', '7', '14'] },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin },
      { key: 'risk_level', label: 'Risk Level', type: 'select', options: ['low', 'medium', 'high'] }
    ]
  },
  'DOCUMENT_APPROVAL': {
    title: 'Approval Stage Filters',
    filters: [
      { key: 'risk_level', label: 'Risk Level', type: 'select', options: ['low', 'medium', 'high'] },
      { key: 'review_priority', label: 'Review Priority', type: 'select', options: ['high', 'medium', 'low'] },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin }
    ]
  },
  'FEE_PAYMENT': {
    title: 'Payment Stage Filters',
    filters: [
      { key: 'payment_status', label: 'Payment Status', type: 'select', options: ['pending', 'overdue', 'partial'] },
      { key: 'days_overdue', label: 'Days Overdue', type: 'select', options: ['1', '7', '14', '30'] },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin }
    ]
  },
  'ACCEPTED': {
    title: 'Accepted Students Filters',
    filters: [
      { key: 'program', label: 'Program', type: 'text', icon: GraduationCap },
      { key: 'intake_date', label: 'Intake Date', type: 'date' },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin }
    ]
  },
  'all': {
    title: 'All Students Filters',
    filters: [
      { key: 'stage', label: 'Stage', type: 'select', options: ['LEAD_FORM', 'SEND_DOCUMENTS', 'DOCUMENT_APPROVAL', 'FEE_PAYMENT', 'ACCEPTED'] },
      { key: 'risk_level', label: 'Risk Level', type: 'select', options: ['low', 'medium', 'high'] },
      { key: 'program', label: 'Program', type: 'text', icon: GraduationCap },
      { key: 'country', label: 'Country', type: 'text', icon: MapPin }
    ]
  }
};

export function StageFilters({ activeStage, filters, onFilterChange, onClearFilters }: StageFiltersProps) {
  const config = stageFilterConfigs[activeStage] || stageFilterConfigs['all'];
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  if (activeStage === 'all' && activeFiltersCount === 0) {
    return null; // Don't show filters for "all" unless there are active filters
  }

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">{config.title}</h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {config.filters.slice(0, 4).map((filter) => ( // Limit to 4 filters for compact view
          <div key={filter.key} className="space-y-1">
            <Label htmlFor={filter.key} className="text-xs font-medium flex items-center gap-1">
              {filter.icon && <filter.icon className="h-3 w-3" />}
              {filter.label}
            </Label>
            
            {filter.type === 'select' && filter.options ? (
              <Select
                value={filters[filter.key as keyof StudentFilters] || ''}
                onValueChange={(value) => onFilterChange(filter.key as keyof StudentFilters, value)}
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
            ) : (
              <Input
                id={filter.key}
                type={filter.type}
                placeholder={`Filter...`}
                value={filters[filter.key as keyof StudentFilters] || ''}
                onChange={(e) => onFilterChange(filter.key as keyof StudentFilters, e.target.value)}
                className="h-8 text-xs"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}