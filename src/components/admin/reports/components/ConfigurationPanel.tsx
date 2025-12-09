import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Database, Columns, Filter, Settings2, Plus, Trash2,
  Users, GraduationCap, FileText, BookOpen, Calendar, 
  DollarSign, MessageSquare, CheckSquare, Megaphone, ClipboardList,
  Hash, Type, ToggleLeft, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ReportConfig, DATA_SOURCES, DataSource, FieldDefinition, 
  FilterCondition, FILTER_OPERATORS, AGGREGATIONS 
} from '@/types/reports';
import { v4 as uuidv4 } from 'uuid';

interface ConfigurationPanelProps {
  config: ReportConfig;
  onConfigChange: (updates: Partial<ReportConfig>) => void;
}

const SOURCE_ICONS: Record<string, React.ElementType> = {
  Users, GraduationCap, FileText, BookOpen, Calendar,
  DollarSign, MessageSquare, CheckSquare, Megaphone, ClipboardList,
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  string: Type,
  number: Hash,
  date: Calendar,
  boolean: ToggleLeft,
};

const CATEGORY_COLORS: Record<string, string> = {
  dimension: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  measure: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  date: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function ConfigurationPanel({ config, onConfigChange }: ConfigurationPanelProps) {
  const source = DATA_SOURCES.find(s => s.id === config.dataSource);
  const fields = source?.fields || [];

  // Group fields by category
  const groupedFields = fields.reduce((acc, field) => {
    const category = field.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {} as Record<string, FieldDefinition[]>);

  const selectedFieldsSet = new Set(config.selectedFields);
  const dimensionFields = fields.filter(f => f.category === 'dimension' || f.category === 'date');
  const measureFields = fields.filter(f => f.category === 'measure');

  // Field toggle handler
  const toggleField = (fieldName: string) => {
    if (selectedFieldsSet.has(fieldName)) {
      onConfigChange({ selectedFields: config.selectedFields.filter(f => f !== fieldName) });
    } else {
      onConfigChange({ selectedFields: [...config.selectedFields, fieldName] });
    }
  };

  // Filter handlers
  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: uuidv4(),
      field: fields[0]?.name || '',
      operator: 'equals',
      value: '',
      logic: config.filters.length > 0 ? 'AND' : undefined,
    };
    onConfigChange({ filters: [...config.filters, newFilter] });
  };

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    onConfigChange({
      filters: config.filters.map(f => (f.id === id ? { ...f, ...updates } : f))
    });
  };

  const removeFilter = (id: string) => {
    const newFilters = config.filters.filter(f => f.id !== id);
    if (newFilters.length > 0 && newFilters[0].logic) {
      newFilters[0] = { ...newFilters[0], logic: undefined };
    }
    onConfigChange({ filters: newFilters });
  };

  const getFieldType = (fieldName: string) => {
    return fields.find(f => f.name === fieldName)?.type || 'string';
  };

  const getAvailableOperators = (fieldName: string) => {
    const fieldType = getFieldType(fieldName);
    return FILTER_OPERATORS.filter(op => op.types.includes(fieldType));
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Panel Header */}
      <div className="flex-shrink-0 p-4 border-b bg-background/50 backdrop-blur-sm">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-primary" />
          Report Configuration
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Configure your data source, fields, and filters
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['data-source', 'fields', 'filters', 'chart-config']} className="space-y-3">
            {/* Data Source Section */}
            <AccordionItem value="data-source" className="border rounded-lg bg-background/50 backdrop-blur-sm overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Data Source</span>
                  {config.dataSource && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {DATA_SOURCES.find(s => s.id === config.dataSource)?.name}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {DATA_SOURCES.map((src) => {
                    const Icon = SOURCE_ICONS[src.icon] || FileText;
                    const isSelected = config.dataSource === src.id;
                    return (
                      <button
                        key={src.id}
                        onClick={() => onConfigChange({ 
                          dataSource: src.id, 
                          selectedFields: [], 
                          filters: [] 
                        })}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all text-sm',
                          isSelected 
                            ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        )}
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0',
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate font-medium">{src.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Fields Section */}
            <AccordionItem value="fields" className="border rounded-lg bg-background/50 backdrop-blur-sm overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <Columns className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Fields</span>
                  {config.selectedFields.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {config.selectedFields.length} selected
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {!config.dataSource ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Select a data source first
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {config.selectedFields.length} of {fields.length} fields
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onConfigChange({ selectedFields: fields.map(f => f.name) })}
                          className="text-xs text-primary hover:underline"
                        >
                          All
                        </button>
                        <span className="text-muted-foreground">|</span>
                        <button
                          onClick={() => onConfigChange({ selectedFields: [] })}
                          className="text-xs text-primary hover:underline"
                        >
                          None
                        </button>
                      </div>
                    </div>
                    
                    {Object.entries(groupedFields).map(([category, categoryFields]) => (
                      <div key={category} className="space-y-2">
                        <Badge variant="secondary" className={cn('text-xs capitalize', CATEGORY_COLORS[category])}>
                          {category === 'dimension' ? 'Dimensions' : category === 'measure' ? 'Measures' : 'Dates'}
                        </Badge>
                        <div className="grid grid-cols-1 gap-1">
                          {categoryFields.map((field) => {
                            const Icon = TYPE_ICONS[field.type] || Type;
                            const isSelected = selectedFieldsSet.has(field.name);
                            return (
                              <div
                                key={field.name}
                                className={cn(
                                  'flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors text-sm',
                                  isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                                )}
                                onClick={() => toggleField(field.name)}
                              >
                                <Checkbox checked={isSelected} onChange={() => {}} />
                                <Icon className="h-3 w-3 text-muted-foreground" />
                                <span className="truncate">{field.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Filters Section */}
            <AccordionItem value="filters" className="border rounded-lg bg-background/50 backdrop-blur-sm overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Filters</span>
                  {config.filters.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {config.filters.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {!config.dataSource ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Select a data source first
                  </p>
                ) : (
                  <div className="space-y-3">
                    {config.filters.map((filter, index) => (
                      <Card key={filter.id} className="p-3 space-y-2">
                        {index > 0 && (
                          <Select
                            value={filter.logic || 'AND'}
                            onValueChange={(value) => updateFilter(filter.id, { logic: value as 'AND' | 'OR' })}
                          >
                            <SelectTrigger className="w-20 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <div className="flex items-center gap-2">
                          <Select
                            value={filter.field}
                            onValueChange={(value) => updateFilter(filter.id, { field: value, value: '' })}
                          >
                            <SelectTrigger className="flex-1 h-8 text-xs">
                              <SelectValue placeholder="Field" />
                            </SelectTrigger>
                            <SelectContent>
                              {fields.map(field => (
                                <SelectItem key={field.name} value={field.name}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                            onClick={() => removeFilter(filter.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={filter.operator}
                            onValueChange={(value) => updateFilter(filter.id, { operator: value as any })}
                          >
                            <SelectTrigger className="w-28 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableOperators(filter.field).map(op => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!['is_null', 'is_not_null'].includes(filter.operator) && (
                            <Input
                              type={getFieldType(filter.field) === 'number' ? 'number' : getFieldType(filter.field) === 'date' ? 'date' : 'text'}
                              placeholder="Value"
                              value={filter.value as string || ''}
                              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                              className="flex-1 h-8 text-xs"
                            />
                          )}
                        </div>
                      </Card>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addFilter}
                      className="w-full"
                    >
                      <Plus className="h-3.5 w-3.5 mr-2" />
                      Add Filter
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Chart Configuration */}
            {config.visualizationType !== 'table' && config.selectedFields.length > 0 && (
              <AccordionItem value="chart-config" className="border rounded-lg bg-background/50 backdrop-blur-sm overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Chart Options</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Group By (X-Axis)</Label>
                    <Select
                      value={config.chartConfig?.groupBy || ''}
                      onValueChange={(value) => onConfigChange({ 
                        chartConfig: { ...config.chartConfig, groupBy: value } 
                      })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {dimensionFields.filter(f => config.selectedFields.includes(f.name)).map(field => (
                          <SelectItem key={field.name} value={field.name}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Aggregation</Label>
                    <Select
                      value={config.chartConfig?.aggregation || 'count'}
                      onValueChange={(value) => onConfigChange({ 
                        chartConfig: { ...config.chartConfig, aggregation: value as any } 
                      })}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AGGREGATIONS.map(agg => (
                          <SelectItem key={agg.value} value={agg.value}>
                            {agg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {config.chartConfig?.aggregation && config.chartConfig.aggregation !== 'count' && measureFields.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs">Aggregation Field</Label>
                      <Select
                        value={config.chartConfig?.aggregationField || ''}
                        onValueChange={(value) => onConfigChange({ 
                          chartConfig: { ...config.chartConfig, aggregationField: value } 
                        })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select numeric field" />
                        </SelectTrigger>
                        <SelectContent>
                          {measureFields.filter(f => config.selectedFields.includes(f.name)).map(field => (
                            <SelectItem key={field.name} value={field.name}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Show Legend</Label>
                      <Switch
                        checked={config.chartConfig?.showLegend ?? true}
                        onCheckedChange={(checked) => onConfigChange({ 
                          chartConfig: { ...config.chartConfig, showLegend: checked } 
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Show Grid</Label>
                      <Switch
                        checked={config.chartConfig?.showGrid ?? true}
                        onCheckedChange={(checked) => onConfigChange({ 
                          chartConfig: { ...config.chartConfig, showGrid: checked } 
                        })}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
