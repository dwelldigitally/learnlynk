import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Save, RotateCcw } from 'lucide-react';
import { EnhancedLeadFilters } from '@/services/enhancedLeadService';

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: any;
  logic?: 'AND' | 'OR';
}

interface AdvancedFilterPanelProps {
  filters: EnhancedLeadFilters;
  onFiltersChange: (filters: EnhancedLeadFilters) => void;
  onSaveFilter?: (name: string, filters: EnhancedLeadFilters) => void;
  savedFilters?: Array<{ name: string; filters: EnhancedLeadFilters }>;
  onLoadFilter?: (filters: EnhancedLeadFilters) => void;
}

const FIELD_OPTIONS = [
  { value: 'first_name', label: 'First Name', type: 'text' },
  { value: 'last_name', label: 'Last Name', type: 'text' },
  { value: 'email', label: 'Email', type: 'text' },
  { value: 'phone', label: 'Phone', type: 'text' },
  { value: 'status', label: 'Status', type: 'select', options: ['new', 'contacted', 'qualified', 'nurturing', 'converted', 'lost', 'unqualified'] },
  { value: 'source', label: 'Source', type: 'select', options: ['web', 'social_media', 'event', 'agent', 'email', 'referral', 'phone', 'walk_in'] },
  { value: 'priority', label: 'Priority', type: 'select', options: ['low', 'medium', 'high', 'urgent'] },
  { value: 'lead_score', label: 'Lead Score', type: 'number' },
  { value: 'created_at', label: 'Created Date', type: 'date' },
  { value: 'updated_at', label: 'Updated Date', type: 'date' },
  { value: 'country', label: 'Country', type: 'text' },
  { value: 'state', label: 'State', type: 'text' },
  { value: 'city', label: 'City', type: 'text' }
];

const OPERATOR_OPTIONS = {
  text: [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'not_contains', label: 'Does not contain' }
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between' }
  ],
  date: [
    { value: 'equals', label: 'On' },
    { value: 'after', label: 'After' },
    { value: 'before', label: 'Before' },
    { value: 'between', label: 'Between' }
  ],
  select: [
    { value: 'equals', label: 'Is' },
    { value: 'not_equals', label: 'Is not' },
    { value: 'in', label: 'Is one of' }
  ]
};

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  filters,
  onFiltersChange,
  onSaveFilter,
  savedFilters = [],
  onLoadFilter
}) => {
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [saveFilterName, setSaveFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const addFilterRule = () => {
    const newRule: FilterRule = {
      id: Date.now().toString(),
      field: '',
      operator: '',
      value: '',
      logic: filterRules.length > 0 ? 'AND' : undefined
    };
    setFilterRules([...filterRules, newRule]);
  };

  const removeFilterRule = (ruleId: string) => {
    const newRules = filterRules.filter(rule => rule.id !== ruleId);
    // Remove logic from first rule if it becomes the first
    if (newRules.length > 0 && newRules[0].logic) {
      newRules[0].logic = undefined;
    }
    setFilterRules(newRules);
  };

  const updateFilterRule = (ruleId: string, updates: Partial<FilterRule>) => {
    setFilterRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  const applyFilters = () => {
    // Convert filter rules to EnhancedLeadFilters format
    const newFilters: EnhancedLeadFilters = { ...filters };

    // Reset arrays
    newFilters.status = [];
    newFilters.source = [];
    newFilters.priority = [];

    filterRules.forEach(rule => {
      if (!rule.field || !rule.operator || !rule.value) return;

      switch (rule.field) {
        case 'status':
          if (!newFilters.status) newFilters.status = [];
          if (rule.operator === 'equals') {
            newFilters.status.push(rule.value);
          }
          break;
        case 'source':
          if (!newFilters.source) newFilters.source = [];
          if (rule.operator === 'equals') {
            newFilters.source.push(rule.value);
          }
          break;
        case 'priority':
          if (!newFilters.priority) newFilters.priority = [];
          if (rule.operator === 'equals') {
            newFilters.priority.push(rule.value);
          }
          break;
        case 'lead_score':
          if (rule.operator === 'between' && Array.isArray(rule.value)) {
            newFilters.lead_score_range = {
              min: rule.value[0],
              max: rule.value[1]
            };
          } else if (rule.operator === 'greater_than') {
            newFilters.lead_score_range = {
              min: rule.value,
              max: 100
            };
          } else if (rule.operator === 'less_than') {
            newFilters.lead_score_range = {
              min: 0,
              max: rule.value
            };
          }
          break;
        case 'created_at':
        case 'updated_at':
          if (rule.operator === 'between' && Array.isArray(rule.value)) {
            newFilters.date_range = {
              start: new Date(rule.value[0]),
              end: new Date(rule.value[1])
            };
          }
          break;
        default:
          // Handle text fields with search
          if (rule.operator === 'contains') {
            newFilters.search = rule.value;
          }
      }
    });

    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilterRules([]);
    onFiltersChange({});
  };

  const saveCurrentFilter = () => {
    if (saveFilterName.trim() && onSaveFilter) {
      onSaveFilter(saveFilterName.trim(), filters);
      setSaveFilterName('');
      setShowSaveDialog(false);
    }
  };

  const renderValueInput = (rule: FilterRule) => {
    const field = FIELD_OPTIONS.find(f => f.value === rule.field);
    if (!field) return null;

    switch (field.type) {
      case 'select':
        if (rule.operator === 'in') {
          return (
            <Select value={rule.value} onValueChange={(value) => updateFilterRule(rule.id, { value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        } else {
          return (
            <Select value={rule.value} onValueChange={(value) => updateFilterRule(rule.id, { value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
      case 'number':
        if (rule.operator === 'between') {
          return (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={Array.isArray(rule.value) ? rule.value[0] : ''}
                onChange={(e) => {
                  const currentValue = Array.isArray(rule.value) ? rule.value : ['', ''];
                  updateFilterRule(rule.id, { value: [e.target.value, currentValue[1]] });
                }}
              />
              <Input
                type="number"
                placeholder="Max"
                value={Array.isArray(rule.value) ? rule.value[1] : ''}
                onChange={(e) => {
                  const currentValue = Array.isArray(rule.value) ? rule.value : ['', ''];
                  updateFilterRule(rule.id, { value: [currentValue[0], e.target.value] });
                }}
              />
            </div>
          );
        } else {
          return (
            <Input
              type="number"
              placeholder="Enter value"
              value={rule.value}
              onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
            />
          );
        }
      case 'date':
        if (rule.operator === 'between') {
          return (
            <div className="flex gap-2">
              <DatePicker
                date={Array.isArray(rule.value) ? new Date(rule.value[0]) : undefined}
                onDateChange={(date) => {
                  const currentValue = Array.isArray(rule.value) ? rule.value : ['', ''];
                  updateFilterRule(rule.id, { value: [date?.toISOString(), currentValue[1]] });
                }}
              />
              <DatePicker
                date={Array.isArray(rule.value) ? new Date(rule.value[1]) : undefined}
                onDateChange={(date) => {
                  const currentValue = Array.isArray(rule.value) ? rule.value : ['', ''];
                  updateFilterRule(rule.id, { value: [currentValue[0], date?.toISOString()] });
                }}
              />
            </div>
          );
        } else {
          return (
            <DatePicker
              date={rule.value ? new Date(rule.value) : undefined}
              onDateChange={(date) => updateFilterRule(rule.id, { value: date?.toISOString() })}
            />
          );
        }
      default:
        return (
          <Input
            placeholder="Enter value"
            value={rule.value}
            onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Advanced Filters
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            {onSaveFilter && (
              <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
                <Save className="h-4 w-4 mr-2" />
                Save Filter
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Saved Filters</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {savedFilters.map((savedFilter, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => onLoadFilter?.(savedFilter.filters)}
                >
                  {savedFilter.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filter Rules */}
        <div className="space-y-3">
          {filterRules.map((rule, index) => (
            <div key={rule.id} className="space-y-2">
              {index > 0 && (
                <div className="flex items-center gap-2">
                  <Select
                    value={rule.logic || 'AND'}
                    onValueChange={(value) => updateFilterRule(rule.id, { logic: value as 'AND' | 'OR' })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Separator className="flex-1" />
                </div>
              )}
              
              <div className="flex gap-2 items-end">
                {/* Field */}
                <div className="flex-1">
                  <Label className="text-xs">Field</Label>
                  <Select
                    value={rule.field}
                    onValueChange={(value) => updateFilterRule(rule.id, { field: value, operator: '', value: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_OPTIONS.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Operator */}
                <div className="flex-1">
                  <Label className="text-xs">Operator</Label>
                  <Select
                    value={rule.operator}
                    onValueChange={(value) => updateFilterRule(rule.id, { operator: value, value: '' })}
                    disabled={!rule.field}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {rule.field && OPERATOR_OPTIONS[FIELD_OPTIONS.find(f => f.value === rule.field)?.type || 'text']?.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value */}
                <div className="flex-1">
                  <Label className="text-xs">Value</Label>
                  {renderValueInput(rule)}
                </div>

                {/* Remove Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFilterRule(rule.id)}
                  className="px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Rule Button */}
        <Button variant="outline" onClick={addFilterRule} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Filter Rule
        </Button>

        {/* Apply Filters */}
        {filterRules.length > 0 && (
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={() => setFilterRules([])}>
              Reset
            </Button>
          </div>
        )}

        {/* Save Filter Dialog */}
        {showSaveDialog && (
          <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
            <Label>Save current filter as:</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Filter name"
                value={saveFilterName}
                onChange={(e) => setSaveFilterName(e.target.value)}
              />
              <Button onClick={saveCurrentFilter}>Save</Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};