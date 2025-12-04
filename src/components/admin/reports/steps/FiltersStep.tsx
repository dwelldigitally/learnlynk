import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DATA_SOURCES, DataSource, FilterCondition, FILTER_OPERATORS } from '@/types/reports';
import { Plus, Trash2, Filter } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FiltersStepProps {
  dataSource: DataSource;
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
}

export function FiltersStep({ dataSource, filters, onFiltersChange }: FiltersStepProps) {
  const source = DATA_SOURCES.find(s => s.id === dataSource);
  const fields = source?.fields || [];

  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: uuidv4(),
      field: fields[0]?.name || '',
      operator: 'equals',
      value: '',
      logic: filters.length > 0 ? 'AND' : undefined,
    };
    onFiltersChange([...filters, newFilter]);
  };

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    onFiltersChange(
      filters.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const removeFilter = (id: string) => {
    const newFilters = filters.filter(f => f.id !== id);
    // Remove logic from first filter
    if (newFilters.length > 0 && newFilters[0].logic) {
      newFilters[0] = { ...newFilters[0], logic: undefined };
    }
    onFiltersChange(newFilters);
  };

  const getFieldType = (fieldName: string) => {
    return fields.find(f => f.name === fieldName)?.type || 'string';
  };

  const getAvailableOperators = (fieldName: string) => {
    const fieldType = getFieldType(fieldName);
    return FILTER_OPERATORS.filter(op => op.types.includes(fieldType));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Add Filters</h3>
          <p className="text-sm text-muted-foreground">
            Refine your data by adding conditions (optional)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addFilter}>
          <Plus className="h-4 w-4 mr-2" />
          Add Filter
        </Button>
      </div>

      {filters.length === 0 ? (
        <Card className="p-8 text-center">
          <Filter className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h4 className="font-medium mb-2">No filters added</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add filters to narrow down your report results
          </p>
          <Button variant="outline" onClick={addFilter}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Filter
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filters.map((filter, index) => (
            <Card key={filter.id} className="p-4">
              <div className="flex items-start gap-3">
                {index > 0 && (
                  <Select
                    value={filter.logic || 'AND'}
                    onValueChange={(value) => updateFilter(filter.id, { logic: value as 'AND' | 'OR' })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Field selector */}
                  <Select
                    value={filter.field}
                    onValueChange={(value) => updateFilter(filter.id, { field: value, value: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map(field => (
                        <SelectItem key={field.name} value={field.name}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Operator selector */}
                  <Select
                    value={filter.operator}
                    onValueChange={(value) => updateFilter(filter.id, { operator: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableOperators(filter.field).map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Value input */}
                  {!['is_null', 'is_not_null'].includes(filter.operator) && (
                    <Input
                      type={getFieldType(filter.field) === 'number' ? 'number' : getFieldType(filter.field) === 'date' ? 'date' : 'text'}
                      placeholder="Enter value..."
                      value={filter.value as string || ''}
                      onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                    />
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeFilter(filter.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick filters */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium mb-2">Quick Filters</p>
        <div className="flex flex-wrap gap-2">
          {fields.some(f => f.name === 'created_at') && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  onFiltersChange([
                    ...filters,
                    { id: uuidv4(), field: 'created_at', operator: 'greater_equal', value: today, logic: filters.length > 0 ? 'AND' : undefined }
                  ]);
                }}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                  onFiltersChange([
                    ...filters,
                    { id: uuidv4(), field: 'created_at', operator: 'greater_equal', value: last7Days, logic: filters.length > 0 ? 'AND' : undefined }
                  ]);
                }}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                  onFiltersChange([
                    ...filters,
                    { id: uuidv4(), field: 'created_at', operator: 'greater_equal', value: last30Days, logic: filters.length > 0 ? 'AND' : undefined }
                  ]);
                }}
              >
                Last 30 Days
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
