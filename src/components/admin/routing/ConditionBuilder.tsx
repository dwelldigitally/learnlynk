import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, X, Check } from 'lucide-react';
import { ConditionGroup, RuleCondition } from '@/types/routing';
import { FormSelector } from './FormSelector';
import { ProgramSelector } from './ProgramSelector';
import { LeadSource, LeadStatus, LeadPriority } from '@/types/lead';

interface ConditionBuilderProps {
  conditionGroups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
}

const LEAD_FIELDS = [
  // Basic Info
  { value: 'source', label: 'Lead Source', type: 'select' },
  { value: 'source_details', label: 'Source Details', type: 'text' },
  { value: 'status', label: 'Lead Status', type: 'select' },
  { value: 'priority', label: 'Priority', type: 'select' },
  
  // Scores
  { value: 'lead_score', label: 'Lead Score', type: 'number' },
  { value: 'ai_score', label: 'AI Score', type: 'number' },
  
  // Location
  { value: 'country', label: 'Country', type: 'text' },
  { value: 'state', label: 'State/Province', type: 'text' },
  { value: 'city', label: 'City', type: 'text' },
  
  // Academic
  { value: 'program_interest', label: 'Program Interest', type: 'multiselect' },
  { value: 'preferred_intake_id', label: 'Preferred Intake', type: 'text' },
  { value: 'academic_term_id', label: 'Academic Term', type: 'text' },
  
  // Marketing/UTM
  { value: 'utm_source', label: 'UTM Source', type: 'text' },
  { value: 'utm_medium', label: 'UTM Medium', type: 'text' },
  { value: 'utm_campaign', label: 'UTM Campaign', type: 'text' },
  { value: 'utm_content', label: 'UTM Content', type: 'text' },
  { value: 'utm_term', label: 'UTM Term', type: 'text' },
  
  // Other
  { value: 'tags', label: 'Tags', type: 'text' },
  { value: 'qualification_stage', label: 'Qualification Stage', type: 'text' },
  { value: 'student_type', label: 'Student Type', type: 'text' },
  
  // Time-based
  { value: 'created_at', label: 'Created Date', type: 'date' }
];

const LEAD_SOURCES: LeadSource[] = [
  'web', 'social_media', 'event', 'agent', 'email', 'referral', 
  'phone', 'walk_in', 'api_import', 'csv_import', 'chatbot', 'ads', 'forms', 'webform'
];

const LEAD_STATUSES: LeadStatus[] = [
  'new', 'contacted', 'qualified', 'nurturing', 'converted', 'lost', 'unqualified'
];

const LEAD_PRIORITIES: LeadPriority[] = ['low', 'medium', 'high', 'urgent'];

const TEXT_OPERATORS = [
  { value: 'equals', label: 'equals' },
  { value: 'contains', label: 'contains' },
  { value: 'in', label: 'is one of' }
];

const NUMBER_OPERATORS = [
  { value: 'equals', label: 'equals' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than', label: 'less than' },
  { value: 'between', label: 'between' }
];

export function ConditionBuilder({ conditionGroups, onChange }: ConditionBuilderProps) {
  const mainGroup = conditionGroups[0] || { id: 'main', operator: 'OR' as const, conditions: [] };
  const conditions = mainGroup.conditions || [];
  const operator = mainGroup.operator;

  const updateGroup = (updates: Partial<ConditionGroup>) => {
    onChange([{ ...mainGroup, ...updates }]);
  };

  const toggleOperator = () => {
    updateGroup({ operator: operator === 'AND' ? 'OR' : 'AND' });
  };

  const addCondition = () => {
    const newCondition: RuleCondition = {
      id: `condition-${Date.now()}`,
      type: 'source',
      field: 'source',
      operator: 'in',
      value: []
    };
    updateGroup({ conditions: [...conditions, newCondition] });
  };

  const removeCondition = (conditionId: string) => {
    updateGroup({ conditions: conditions.filter(c => c.id !== conditionId) });
  };

  const updateCondition = (conditionId: string, updates: Partial<RuleCondition>) => {
    updateGroup({
      conditions: conditions.map(c => 
        c.id === conditionId ? { ...c, ...updates } : c
      )
    });
  };

  const getFieldType = (fieldValue: string) => {
    return LEAD_FIELDS.find(f => f.value === fieldValue)?.type || 'text';
  };

  const getOperatorsForField = (fieldValue: string) => {
    const fieldType = getFieldType(fieldValue);
    if (fieldType === 'number') return NUMBER_OPERATORS;
    return TEXT_OPERATORS;
  };

  const renderValueInput = (condition: RuleCondition) => {
    const fieldType = getFieldType(condition.field);

    // Special: Lead Source with Form sub-selector
    if (condition.field === 'source') {
      const selectedSources = Array.isArray(condition.value) ? condition.value : [];
      const hasFormSource = selectedSources.includes('forms') || selectedSources.includes('webform');
      
      return (
        <div className="space-y-2">
          <Select
            value=""
            onValueChange={(value) => {
              if (!selectedSources.includes(value)) {
                updateCondition(condition.id, { value: [...selectedSources, value] });
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Add source..." />
            </SelectTrigger>
            <SelectContent>
              {LEAD_SOURCES.map(source => (
                <SelectItem 
                  key={source} 
                  value={source}
                  disabled={selectedSources.includes(source)}
                >
                  {source.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-1.5">
            {selectedSources.map((source) => (
              <Badge key={source} variant="secondary" className="flex items-center gap-1">
                {source.replace('_', ' ')}
                <button
                  type="button"
                  onClick={() => {
                    const newValue = selectedSources.filter(s => s !== source);
                    updateCondition(condition.id, { value: newValue });
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {/* Form Sub-selector */}
          {hasFormSource && (
            <div className="pt-2 border-t">
              <Label className="text-xs text-muted-foreground mb-2 block">Specific Forms (optional)</Label>
              <FormSelector
                selectedForms={(condition as any).subValue || []}
                onChange={(forms) => updateCondition(condition.id, { ...condition, subValue: forms } as any)}
              />
            </div>
          )}
        </div>
      );
    }

    // Program Interest
    if (condition.field === 'program_interest') {
      return (
        <ProgramSelector
          selectedPrograms={Array.isArray(condition.value) ? condition.value : []}
          onChange={(programs) => updateCondition(condition.id, { value: programs })}
        />
      );
    }

    // Status selector
    if (condition.field === 'status') {
      const selectedStatuses = Array.isArray(condition.value) ? condition.value : [];
      return (
        <div className="space-y-2">
          <Select
            value=""
            onValueChange={(value) => {
              if (!selectedStatuses.includes(value)) {
                updateCondition(condition.id, { value: [...selectedStatuses, value] });
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Add status..." />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map(status => (
                <SelectItem 
                  key={status} 
                  value={status}
                  disabled={selectedStatuses.includes(status)}
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-1.5">
            {selectedStatuses.map((status) => (
              <Badge key={status} variant="secondary" className="flex items-center gap-1">
                {status}
                <button
                  type="button"
                  onClick={() => {
                    updateCondition(condition.id, { 
                      value: selectedStatuses.filter(s => s !== status) 
                    });
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      );
    }

    // Priority selector
    if (condition.field === 'priority') {
      const selectedPriorities = Array.isArray(condition.value) ? condition.value : [];
      return (
        <div className="space-y-2">
          <Select
            value=""
            onValueChange={(value) => {
              if (!selectedPriorities.includes(value)) {
                updateCondition(condition.id, { value: [...selectedPriorities, value] });
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Add priority..." />
            </SelectTrigger>
            <SelectContent>
              {LEAD_PRIORITIES.map(priority => (
                <SelectItem 
                  key={priority} 
                  value={priority}
                  disabled={selectedPriorities.includes(priority)}
                >
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-1.5">
            {selectedPriorities.map((priority) => (
              <Badge key={priority} variant="secondary" className="flex items-center gap-1">
                {priority}
                <button
                  type="button"
                  onClick={() => {
                    updateCondition(condition.id, { 
                      value: selectedPriorities.filter(p => p !== priority) 
                    });
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      );
    }

    // Number input
    if (fieldType === 'number') {
      if (condition.operator === 'between') {
        const values = Array.isArray(condition.value) ? condition.value : ['', ''];
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={values[0] || ''}
              onChange={(e) => updateCondition(condition.id, { 
                value: [e.target.value, values[1] || ''] 
              })}
              placeholder="Min"
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="number"
              value={values[1] || ''}
              onChange={(e) => updateCondition(condition.id, { 
                value: [values[0] || '', e.target.value] 
              })}
              placeholder="Max"
              className="w-24"
            />
          </div>
        );
      }
      
      return (
        <Input
          type="number"
          value={Array.isArray(condition.value) ? condition.value[0] : condition.value || ''}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          placeholder="Enter value..."
          className="w-32"
        />
      );
    }

    // Text input
    return (
      <Input
        type="text"
        value={Array.isArray(condition.value) ? condition.value[0] : condition.value || ''}
        onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
        placeholder="Enter value..."
        className="w-48"
      />
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* AND/OR Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium">Match:</Label>
              <Button
                type="button"
                variant={operator === 'OR' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleOperator}
                className="gap-2"
              >
                {operator === 'OR' ? (
                  <>
                    <Check className="h-4 w-4" />
                    ANY of these
                  </>
                ) : (
                  'ANY of these'
                )}
              </Button>
              <Button
                type="button"
                variant={operator === 'AND' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleOperator}
                className="gap-2"
              >
                {operator === 'AND' ? (
                  <>
                    <Check className="h-4 w-4" />
                    ALL of these
                  </>
                ) : (
                  'ALL of these'
                )}
              </Button>
            </div>
            <Badge variant="secondary" className="text-xs">
              {operator === 'OR' ? 'At least one condition must match' : 'All conditions must match'}
            </Badge>
          </div>

          {/* Conditions List */}
          {conditions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              No conditions defined. Click "Add Condition" below to start.
            </div>
          )}

          <div className="space-y-3">
            {conditions.map((condition) => {
              const operators = getOperatorsForField(condition.field);
              
              return (
                <div 
                  key={condition.id}
                  className="flex items-start gap-3 p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                >
                  <Check className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
                  
                  {/* Field Select */}
                  <Select
                    value={condition.field}
                    onValueChange={(value: string) => {
                      updateCondition(condition.id, { 
                        field: value,
                        type: value as any,
                        value: [],
                        operator: 'in'
                      });
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_FIELDS.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Operator Select */}
                  <Select
                    value={condition.operator}
                    onValueChange={(value: any) => {
                      updateCondition(condition.id, { operator: value });
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
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

                  {/* Value Input */}
                  <div className="flex-1">
                    {renderValueInput(condition)}
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(condition.id)}
                    className="shrink-0 text-destructive hover:text-destructive mt-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Add Condition Button */}
          <Button 
            type="button"
            onClick={addCondition}
            variant="outline" 
            size="sm"
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
