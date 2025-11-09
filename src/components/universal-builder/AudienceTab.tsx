import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { EnhancedLeadFilters } from '@/services/enhancedLeadService';
import { EnhancedLeadService } from '@/services/enhancedLeadService';
import { AudienceTemplateService, AudienceTemplate } from '@/services/audienceTemplateService';
import { Users, Filter, Plus, X, Search, TrendingUp, Save, FolderOpen, Trash2, BookmarkPlus } from 'lucide-react';
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
  
  // Template management state
  const [templates, setTemplates] = useState<AudienceTemplate[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedAudience) {
      setFilters(selectedAudience.filters);
      setAudienceCount(selectedAudience.count);
    }
  }, [selectedAudience]);

  const loadTemplates = async () => {
    try {
      const loadedTemplates = await AudienceTemplateService.getTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
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

  const saveAsTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    try {
      // Check if name already exists
      const nameExists = await AudienceTemplateService.templateNameExists(templateName);
      if (nameExists) {
        toast.error('A template with this name already exists');
        return;
      }

      await AudienceTemplateService.createTemplate({
        name: templateName.trim(),
        description: templateDescription.trim() || undefined,
        filters,
        audience_count: audienceCount,
      });

      toast.success('Template saved successfully');
      setShowSaveDialog(false);
      setTemplateName('');
      setTemplateDescription('');
      loadTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('Failed to save template');
    }
  };

  const loadTemplate = async (template: AudienceTemplate) => {
    try {
      // Apply the template filters
      const leadResponse = await EnhancedLeadService.getLeads(1, 1000, template.filters);
      const count = leadResponse.total;
      
      setFilters(template.filters);
      setAudienceCount(count);
      onAudienceSelect(template.filters, count);
      
      // Convert filters back to filter rules for display
      const rules: FilterRule[] = [];
      if (template.filters.status?.length) {
        rules.push({
          id: `rule_status_${Date.now()}`,
          field: 'status',
          operator: 'equals',
          value: template.filters.status[0]
        });
      }
      if (template.filters.program_interest?.length) {
        rules.push({
          id: `rule_program_${Date.now()}`,
          field: 'program',
          operator: 'equals',
          value: template.filters.program_interest[0]
        });
      }
      setFilterRules(rules);
      
      setShowTemplatesDialog(false);
      toast.success(`Template "${template.name}" loaded`);
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template');
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await AudienceTemplateService.deleteTemplate(id);
      toast.success('Template deleted');
      loadTemplates();
      setDeleteTemplateId(null);
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template');
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
              <div className="flex gap-2">
                <Button onClick={addFilterRule} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
                <Button onClick={() => setShowTemplatesDialog(true)} size="sm" variant="outline">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Load Template
                </Button>
                {(filterRules.length > 0 || searchQuery) && (
                  <Button onClick={() => setShowSaveDialog(true)} size="sm" variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save as Template
                  </Button>
                )}
              </div>
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

        {/* Save Template Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Audience Template</DialogTitle>
              <DialogDescription>
                Save your current filter configuration as a reusable template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name *</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., High Priority Leads"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description (Optional)</Label>
                <Textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Describe what this template is used for..."
                  rows={3}
                />
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This template will save {filterRules.length} filter{filterRules.length !== 1 ? 's' : ''} targeting approximately <strong>{audienceCount}</strong> leads
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveAsTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Load Templates Dialog */}
        <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Load Audience Template</DialogTitle>
              <DialogDescription>
                Choose a saved template to quickly apply filter combinations
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {templates.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <BookmarkPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground font-medium">No templates saved yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create filters and click "Save as Template" to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {templates.map((template) => (
                    <Card key={template.id} className="hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{template.name}</h4>
                            {template.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {template.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {template.audience_count.toLocaleString()} leads
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(template.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => loadTemplate(template)}
                            >
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteTemplateId(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteTemplateId} onOpenChange={() => setDeleteTemplateId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this template? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteTemplateId && deleteTemplate(deleteTemplateId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
