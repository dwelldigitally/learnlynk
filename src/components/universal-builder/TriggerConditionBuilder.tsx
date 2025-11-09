import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Check } from 'lucide-react';
import { ConditionGroup, TriggerCondition } from '@/types/universalBuilder';

interface TriggerConditionBuilderProps {
  conditionGroups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
}

const FIELDS = [
  // Contact Information
  { value: 'email', label: 'Email', type: 'text' },
  { value: 'phone', label: 'Phone', type: 'text' },
  { value: 'first_name', label: 'First Name', type: 'text' },
  { value: 'last_name', label: 'Last Name', type: 'text' },
  
  // Demographics
  { value: 'country', label: 'Country', type: 'select' },
  { value: 'state', label: 'State/Province', type: 'select' },
  { value: 'city', label: 'City', type: 'select' },
  { value: 'student_type', label: 'Student Type', type: 'select' },
  
  // Academic Properties
  { value: 'program_interest', label: 'Program Interest', type: 'array' },
  { value: 'qualification_stage', label: 'Qualification Stage', type: 'select' },
  { value: 'substage', label: 'Substage', type: 'select' },
  { value: 'tags', label: 'Tags', type: 'array' },
  
  // Source Tracking
  { value: 'source', label: 'Lead Source', type: 'select' },
  { value: 'utm_source', label: 'UTM Source', type: 'text' },
  { value: 'utm_medium', label: 'UTM Medium', type: 'text' },
  { value: 'utm_campaign', label: 'UTM Campaign', type: 'text' },
  
  // Engagement Metrics
  { value: 'lead_score', label: 'Lead Score', type: 'numeric' },
  { value: 'ai_score', label: 'AI Score', type: 'numeric' },
  { value: 'priority', label: 'Priority', type: 'select' },
  { value: 'status', label: 'Status', type: 'select' },
  
  // Date Fields
  { value: 'created_at', label: 'Created Date', type: 'date' },
  { value: 'last_contacted_at', label: 'Last Contacted Date', type: 'date' },
  { value: 'next_follow_up_at', label: 'Next Follow-up Date', type: 'date' },
  { value: 'assigned_at', label: 'Assigned Date', type: 'date' }
];

const TEXT_OPERATORS = [
  { value: 'is_known', label: 'is known' },
  { value: 'is_unknown', label: 'is unknown' },
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: "doesn't contain" },
  { value: 'starts_with', label: 'starts with' },
  { value: 'ends_with', label: 'ends with' }
];

const NUMERIC_OPERATORS = [
  { value: 'is_known', label: 'is known' },
  { value: 'is_unknown', label: 'is unknown' },
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than', label: 'less than' },
  { value: 'between', label: 'between' }
];

const ARRAY_OPERATORS = [
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
  { value: 'contains_any', label: 'contains any' },
  { value: 'contains_all', label: 'contains all' }
];

const DATE_OPERATORS = [
  { value: 'is_known', label: 'is known' },
  { value: 'is_unknown', label: 'is unknown' },
  { value: 'is_before', label: 'is before' },
  { value: 'is_after', label: 'is after' },
  { value: 'is_between', label: 'is between' },
  { value: 'is_within_last', label: 'is within last' },
  { value: 'is_older_than', label: 'is older than' }
];

const SELECT_OPERATORS = [
  { value: 'is_known', label: 'is known' },
  { value: 'is_unknown', label: 'is unknown' },
  { value: 'is', label: 'is' },
  { value: 'is_one_of', label: 'is one of' },
  { value: 'is_not', label: 'is not' },
  { value: 'is_not_one_of', label: 'is not one of' }
];

const FIELD_VALUES = {
  source: ['Web', 'Social Media', 'Event', 'Agent', 'Email', 'Referral', 'Phone', 'Walk-in', 'Chatbot', 'Ads', 'Forms'],
  student_type: ['Domestic', 'International'],
  priority: ['Low', 'Medium', 'High'],
  status: ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted', 'Lost'],
  qualification_stage: ['New', 'Qualifying', 'Qualified', 'Application', 'Enrolled'],
  program_interest: ['Health Care Assistant', 'Aviation', 'Education Assistant', 'Hospitality', 'ECE', 'MLA'],
  country: ['Canada', 'United States', 'India', 'Philippines', 'Nigeria', 'Pakistan', 'Bangladesh'],
  state: ['Manitoba', 'Ontario', 'British Columbia', 'Alberta', 'Saskatchewan', 'Quebec']
};

export function TriggerConditionBuilder({ conditionGroups, onChange }: TriggerConditionBuilderProps) {
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
    const newCondition: TriggerCondition = {
      id: `condition-${Date.now()}`,
      field: 'source',
      fieldType: 'select',
      operator: 'is',
      value: []
    };
    updateGroup({ conditions: [...conditions, newCondition] });
  };

  const removeCondition = (conditionId: string) => {
    updateGroup({ conditions: conditions.filter(c => c.id !== conditionId) });
  };

  const updateCondition = (conditionId: string, updates: Partial<TriggerCondition>) => {
    updateGroup({
      conditions: conditions.map(c => 
        c.id === conditionId ? { ...c, ...updates } : c
      )
    });
  };

  const getOperatorsForFieldType = (fieldType: string) => {
    switch (fieldType) {
      case 'numeric': return NUMERIC_OPERATORS;
      case 'array': return ARRAY_OPERATORS;
      case 'date': return DATE_OPERATORS;
      case 'select': return SELECT_OPERATORS;
      case 'text':
      default: return TEXT_OPERATORS;
    }
  };

  const needsValue = (operator: string) => {
    const noValueOps = ['is_known', 'is_unknown', 'is_empty', 'is_not_empty'];
    return !noValueOps.includes(operator);
  };

  const renderValueInput = (condition: TriggerCondition) => {
    if (!needsValue(condition.operator)) return null;

    const field = FIELDS.find(f => f.value === condition.field);
    const fieldType = field?.type || 'text';
    const options = FIELD_VALUES[condition.field as keyof typeof FIELD_VALUES] || [];

    // Numeric input
    if (fieldType === 'numeric' || condition.fieldType === 'numeric') {
      if (condition.operator === 'between') {
        const values = Array.isArray(condition.value) ? condition.value : [condition.value, ''];
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={values[0] || ''}
              onChange={(e) => updateCondition(condition.id, { 
                value: [e.target.value, values[1] || ''] 
              })}
              placeholder="Min"
              className="w-[100px]"
            />
            <span className="text-sm text-muted-foreground">and</span>
            <Input
              type="number"
              value={values[1] || ''}
              onChange={(e) => updateCondition(condition.id, { 
                value: [values[0] || '', e.target.value] 
              })}
              placeholder="Max"
              className="w-[100px]"
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
          className="w-[150px]"
        />
      );
    }

    // Date input
    if (fieldType === 'date' || condition.fieldType === 'date') {
      if (condition.operator === 'is_within_last' || condition.operator === 'is_older_than') {
        const values = Array.isArray(condition.value) ? condition.value : ['', 'days'];
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={values[0] || ''}
              onChange={(e) => updateCondition(condition.id, { 
                value: [e.target.value, values[1] || 'days'] 
              })}
              placeholder="Number"
              className="w-[100px]"
            />
            <Select
              value={values[1] || 'days'}
              onValueChange={(unit) => updateCondition(condition.id, { 
                value: [values[0] || '', unit] 
              })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      }

      if (condition.operator === 'is_between') {
        const values = Array.isArray(condition.value) ? condition.value : ['', ''];
        return (
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={values[0] || ''}
              onChange={(e) => updateCondition(condition.id, { 
                value: [e.target.value, values[1] || ''] 
              })}
              className="w-[150px]"
            />
            <span className="text-sm text-muted-foreground">and</span>
            <Input
              type="date"
              value={values[1] || ''}
              onChange={(e) => updateCondition(condition.id, { 
                value: [values[0] || '', e.target.value] 
              })}
              className="w-[150px]"
            />
          </div>
        );
      }

      return (
        <Input
          type="date"
          value={Array.isArray(condition.value) ? condition.value[0] : condition.value || ''}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          className="w-[180px]"
        />
      );
    }

    // Text input
    if (fieldType === 'text' || condition.fieldType === 'text') {
      return (
        <Input
          type="text"
          value={Array.isArray(condition.value) ? condition.value[0] : condition.value || ''}
          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
          placeholder="Enter value..."
          className="w-[200px]"
        />
      );
    }

    // Single select
    if (condition.operator === 'is' || condition.operator === 'is_not') {
      return (
        <Select
          value={Array.isArray(condition.value) ? condition.value[0] : condition.value || ''}
          onValueChange={(value) => updateCondition(condition.id, { value: [value] })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select value..." />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Multi-select (is one of, contains any, contains all)
    const selectedValues = Array.isArray(condition.value) ? condition.value : [];
    
    return (
      <div className="flex flex-wrap gap-2 items-center">
        {selectedValues.map((val, idx) => (
          <Badge key={idx} variant="secondary" className="flex items-center gap-1">
            {val}
            <button
              type="button"
              onClick={() => {
                const newValue = selectedValues.filter((_, i) => i !== idx);
                updateCondition(condition.id, { value: newValue });
              }}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Select
          value=""
          onValueChange={(value) => {
            if (!selectedValues.includes(value)) {
              updateCondition(condition.id, { value: [...selectedValues, value] });
            }
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Add value..." />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* AND/OR Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium">Trigger when:</Label>
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
              No conditions defined. Click "Add Condition" below to set when this campaign should trigger.
            </div>
          )}

          <div className="space-y-3">
            {conditions.map((condition) => {
              const field = FIELDS.find(f => f.value === condition.field);
              const currentFieldType = (field?.type || condition.fieldType) as 'text' | 'numeric' | 'array' | 'date' | 'select';
              
              return (
                <div 
                  key={condition.id}
                  className="flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                >
                  <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                  
                  {/* Field Select */}
                  <Select
                    value={condition.field}
                    onValueChange={(value) => {
                      const selectedField = FIELDS.find(f => f.value === value);
                      const newFieldType = (selectedField?.type || 'text') as 'text' | 'numeric' | 'array' | 'date' | 'select';
                      updateCondition(condition.id, { 
                        field: value,
                        fieldType: newFieldType,
                        operator: 'is_known',
                        value: []
                      });
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELDS.map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Operator Select */}
                  <Select
                    value={condition.operator}
                    onValueChange={(value) => {
                      updateCondition(condition.id, { 
                        operator: value,
                        value: needsValue(value) ? condition.value : null
                      });
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getOperatorsForFieldType(currentFieldType).map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Value Input (conditional) */}
                  {renderValueInput(condition)}

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(condition.id)}
                    className="ml-auto shrink-0 text-destructive hover:text-destructive"
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
