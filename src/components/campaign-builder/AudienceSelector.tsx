import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Filter, 
  Search, 
  Plus, 
  X, 
  ChevronDown,
  Target,
  TrendingUp,
  Calendar,
  MapPin,
  GraduationCap,
  Mail,
  Phone
} from 'lucide-react';
import { EnhancedLeadService, EnhancedLeadFilters } from '@/services/enhancedLeadService';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation schema
const filterValueSchema = z.string().trim().max(255, { message: "Value must be less than 255 characters" });

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface AudienceSelectorProps {
  selectedAudience?: {
    filters: EnhancedLeadFilters;
    count: number;
  };
  onAudienceSelect: (filters: EnhancedLeadFilters, count: number) => void;
}

const FILTER_FIELDS = [
  { value: 'status', label: 'Status', icon: TrendingUp },
  { value: 'program', label: 'Program Interest', icon: GraduationCap },
  { value: 'stage', label: 'Stage', icon: Target },
  { value: 'assignedTo', label: 'Assigned To', icon: Users },
  { value: 'source', label: 'Source', icon: MapPin },
  { value: 'createdAt', label: 'Created Date', icon: Calendar },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'tags', label: 'Tags', icon: Filter },
];

const OPERATORS = {
  string: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'notEquals', label: 'Not equals' },
  ],
  date: [
    { value: 'equals', label: 'On' },
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
    { value: 'between', label: 'Between' },
  ],
  select: [
    { value: 'equals', label: 'Is' },
    { value: 'notEquals', label: 'Is not' },
    { value: 'in', label: 'Is any of' },
  ],
};

export function AudienceSelector({ selectedAudience, onAudienceSelect }: AudienceSelectorProps) {
  const [filters, setFilters] = useState<EnhancedLeadFilters>({});
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [audienceCount, setAudienceCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFilterOptions();
    if (selectedAudience) {
      setFilters(selectedAudience.filters);
      setAudienceCount(selectedAudience.count);
    }
  }, [selectedAudience]);

  const loadFilterOptions = async () => {
    try {
      const options = await EnhancedLeadService.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('Error loading filter options:', error);
      toast.error('Failed to load filter options');
    }
  };

  const addFilterRule = () => {
    const newRule: FilterRule = {
      id: `rule_${Date.now()}`,
      field: 'status',
      operator: 'equals',
      value: '',
    };
    setFilterRules([...filterRules, newRule]);
  };

  const removeFilterRule = (id: string) => {
    setFilterRules(filterRules.filter(rule => rule.id !== id));
  };

  const updateFilterRule = (id: string, field: keyof FilterRule, value: string) => {
    // Validate value input
    if (field === 'value') {
      try {
        filterValueSchema.parse(value);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast.error(error.errors[0].message);
          return;
        }
      }
    }

    setFilterRules(
      filterRules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      // Convert filter rules to EnhancedLeadFilters format
      const enhancedFilters: EnhancedLeadFilters = { ...filters };

      filterRules.forEach(rule => {
        if (rule.value.trim()) {
          // Sanitize and encode the value
          const sanitizedValue = rule.value.trim();
          
          switch (rule.field) {
            case 'status':
              enhancedFilters.status = [sanitizedValue as any];
              break;
            case 'program':
              enhancedFilters.program_interest = [sanitizedValue];
              break;
            case 'stage':
              enhancedFilters.stage = [sanitizedValue as any];
              break;
            case 'assignedTo':
              enhancedFilters.assigned_to = [sanitizedValue];
              break;
            case 'source':
              enhancedFilters.source = [sanitizedValue as any];
              break;
            case 'tags':
              enhancedFilters.tags = sanitizedValue.split(',').map(t => t.trim());
              break;
          }
        }
      });

      // Add search term if present
      if (searchTerm.trim()) {
        const sanitizedSearch = searchTerm.trim();
        enhancedFilters.search = sanitizedSearch;
      }

      // Get count of matching leads
      const response = await EnhancedLeadService.getLeads(1, 1, enhancedFilters);
      const count = response.total || 0;

      setFilters(enhancedFilters);
      setAudienceCount(count);
      onAudienceSelect(enhancedFilters, count);

      toast.success(`Audience selected: ${count} leads match your criteria`);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setFilterRules([]);
    setSearchTerm('');
    setAudienceCount(0);
  };

  const getOperatorsForField = (field: string) => {
    if (field === 'createdAt') return OPERATORS.date;
    if (['status', 'program', 'stage', 'assignedTo', 'source'].includes(field)) {
      return OPERATORS.select;
    }
    return OPERATORS.string;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Campaign Audience
              </CardTitle>
              <CardDescription className="mt-2">
                Define filters to target specific leads for this campaign
              </CardDescription>
            </div>
            {audienceCount > 0 && (
              <Badge variant="default" className="text-lg px-4 py-2">
                {audienceCount.toLocaleString()} Leads
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Leads</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                maxLength={255}
              />
            </div>
          </div>

          <Separator />

          {/* Filter Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Advanced Filters</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addFilterRule}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Filter
              </Button>
            </div>

            <ScrollArea className="max-h-[400px]">
              <div className="space-y-3">
                {filterRules.map((rule) => {
                  const fieldConfig = FILTER_FIELDS.find(f => f.value === rule.field);
                  const FieldIcon = fieldConfig?.icon || Filter;
                  
                  return (
                    <Card key={rule.id}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-12 gap-3 items-end">
                          <div className="col-span-4">
                            <Label htmlFor={`field-${rule.id}`}>Field</Label>
                            <Select
                              value={rule.field}
                              onValueChange={(value) => updateFilterRule(rule.id, 'field', value)}
                            >
                              <SelectTrigger id={`field-${rule.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FILTER_FIELDS.map((field) => {
                                  const Icon = field.icon;
                                  return (
                                    <SelectItem key={field.value} value={field.value}>
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        {field.label}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-3">
                            <Label htmlFor={`operator-${rule.id}`}>Operator</Label>
                            <Select
                              value={rule.operator}
                              onValueChange={(value) => updateFilterRule(rule.id, 'operator', value)}
                            >
                              <SelectTrigger id={`operator-${rule.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getOperatorsForField(rule.field).map((op) => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-4">
                            <Label htmlFor={`value-${rule.id}`}>Value</Label>
                            {['status', 'program', 'stage', 'source'].includes(rule.field) && filterOptions[rule.field] ? (
                              <Select
                                value={rule.value}
                                onValueChange={(value) => updateFilterRule(rule.id, 'value', value)}
                              >
                                <SelectTrigger id={`value-${rule.id}`}>
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {filterOptions[rule.field]?.map((option: any) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                id={`value-${rule.id}`}
                                placeholder="Enter value..."
                                value={rule.value}
                                onChange={(e) => updateFilterRule(rule.id, 'value', e.target.value)}
                                maxLength={255}
                              />
                            )}
                          </div>

                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFilterRule(rule.id)}
                              className="w-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filterRules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No filters added yet</p>
                    <p className="text-sm">Click "Add Filter" to start defining your audience</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={filterRules.length === 0 && !searchTerm}
            >
              Clear All
            </Button>
            <Button
              onClick={applyFilters}
              disabled={loading}
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              {loading ? 'Calculating...' : 'Apply Filters'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audience Summary */}
      {audienceCount > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Audience Ready</h4>
                <p className="text-sm text-muted-foreground">
                  Your campaign will be sent to <strong>{audienceCount.toLocaleString()}</strong> leads
                  {Object.keys(filters).length > 0 && ` matching ${Object.keys(filters).length} filter${Object.keys(filters).length > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
