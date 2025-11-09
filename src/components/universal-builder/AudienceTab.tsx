import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { EnhancedLeadFilters } from '@/services/enhancedLeadService';
import { EnhancedLeadService } from '@/services/enhancedLeadService';
import { Users, Filter, Plus, X, Search, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface AudienceTabProps {
  selectedAudience?: {
    filters: EnhancedLeadFilters;
    count: number;
  };
  onAudienceSelect: (filters: EnhancedLeadFilters, count: number) => void;
}

const filterFields = [
  { value: 'status', label: 'Status' },
  { value: 'program', label: 'Program Interest' },
  { value: 'stage', label: 'Stage' },
  { value: 'assignedTo', label: 'Assigned To' },
  { value: 'source', label: 'Source' },
  { value: 'createdDate', label: 'Created Date' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'tags', label: 'Tags' },
];

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' },
];

export function AudienceTab({ selectedAudience, onAudienceSelect }: AudienceTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [audienceCount, setAudienceCount] = useState(selectedAudience?.count || 0);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [filters, setFilters] = useState<EnhancedLeadFilters>({});

  useEffect(() => {
    if (selectedAudience) {
      setFilters(selectedAudience.filters);
      setAudienceCount(selectedAudience.count);
    }
  }, [selectedAudience]);

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

  const updateFilterRule = (id: string, updates: Partial<FilterRule>) => {
    setFilterRules(filterRules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const applyFilters = async () => {
    try {
      const newFilters: EnhancedLeadFilters = {};
      
      filterRules.forEach(rule => {
        if (rule.value) {
          switch (rule.field) {
            case 'status':
              newFilters.status = [rule.value as any];
              break;
            case 'program':
              newFilters.program_interest = [rule.value];
              break;
            case 'assignedTo':
              newFilters.assigned_to = [rule.value];
              break;
            case 'stage':
              newFilters.stage = [rule.value as any];
              break;
            case 'source':
              newFilters.source = [rule.value as any];
              break;
          }
        }
      });

      if (searchQuery) {
        newFilters.search = searchQuery;
      }

      const leadResponse = await EnhancedLeadService.getLeads(1, 1000, newFilters);
      const count = leadResponse.total;
      
      setFilters(newFilters);
      setAudienceCount(count);
      onAudienceSelect(newFilters, count);
      
      toast.success(`Audience updated: ${count} leads match your criteria`);
    } catch (error) {
      toast.error('Failed to apply filters');
    }
  };

  return (
    <div className="h-full w-full bg-muted/30">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Target Audience</h2>
              <p className="text-muted-foreground">Define and filter your campaign audience</p>
            </div>
          </div>
        </div>

        {/* Audience Stats Card */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Audience Size</p>
                  <p className="text-3xl font-bold">{audienceCount.toLocaleString()}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {filterRules.length} {filterRules.length === 1 ? 'Filter' : 'Filters'} Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Quick Search
            </CardTitle>
            <CardDescription>Search by name, email, or phone number</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={applyFilters}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                </CardTitle>
                <CardDescription>Create custom filter rules to target specific leads</CardDescription>
              </div>
              <Button onClick={addFilterRule} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filterRules.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No filters added yet</p>
                <p className="text-sm text-muted-foreground mt-1">Click "Add Filter" to start targeting your audience</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterRules.map((rule, index) => (
                  <div key={rule.id} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Field</Label>
                          <Select
                            value={rule.field}
                            onValueChange={(value) => updateFilterRule(rule.id, { field: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {filterFields.map(field => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Operator</Label>
                          <Select
                            value={rule.operator}
                            onValueChange={(value) => updateFilterRule(rule.id, { operator: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map(op => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Value</Label>
                          <Input
                            value={rule.value}
                            onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
                            placeholder="Enter value..."
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFilterRule(rule.id)}
                        className="mt-7"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filterRules.length > 0 && (
              <>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={applyFilters} className="px-6">
                    Apply Filters
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
