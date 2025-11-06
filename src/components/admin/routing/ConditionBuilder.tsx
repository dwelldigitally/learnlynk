import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Check } from 'lucide-react';
import { ConditionGroup, RuleCondition } from '@/types/routing';

interface ConditionBuilderProps {
  conditionGroups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
}

const FIELDS = [
  { value: 'source', label: 'Lead Source' },
  { value: 'program', label: 'Program Interest' },
  { value: 'location', label: 'Location' },
  { value: 'score', label: 'Lead Score' },
  { value: 'time', label: 'Time-based' }
];

const CONDITION_STATES = [
  { value: 'is_known', label: 'is known' },
  { value: 'is_unknown', label: 'is unknown' },
  { value: 'is', label: 'is' },
  { value: 'is_one_of', label: 'is one of' }
];

const FIELD_VALUES = {
  source: ['Web', 'Social Media', 'Event', 'Agent', 'Email', 'Referral', 'Phone', 'Walk-in', 'Chatbot', 'Ads', 'Forms'],
  program: ['Health Care Assistant', 'Aviation', 'Education Assistant', 'Hospitality', 'ECE', 'MLA'],
  location: ['Country', 'State', 'City'],
  score: ['Lead Score', 'Priority'],
  time: ['Weekday', 'Weekend', 'Business Hours']
};

export function ConditionBuilder({ conditionGroups, onChange }: ConditionBuilderProps) {
  // Flatten to single group with operator toggle
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

  const mapStateToOperator = (state: string): RuleCondition['operator'] => {
    switch (state) {
      case 'is_known': return 'contains';
      case 'is_unknown': return 'contains';
      case 'is': return 'equals';
      case 'is_one_of': return 'in';
      default: return 'equals';
    }
  };

  const getStateFromOperator = (operator: string): string => {
    if (operator === 'in') return 'is_one_of';
    if (operator === 'equals') return 'is';
    return 'is_one_of';
  };

  const needsValue = (state: string) => {
    return state === 'is' || state === 'is_one_of';
  };

  const renderValueInput = (condition: RuleCondition, state: string) => {
    if (!needsValue(state)) return null;

    const fieldType = condition.type;
    const options = FIELD_VALUES[fieldType as keyof typeof FIELD_VALUES] || [];

    if (state === 'is') {
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

    if (state === 'is_one_of') {
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
    }

    return null;
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
            {conditions.map((condition, index) => {
              const currentState = getStateFromOperator(condition.operator);
              
              return (
                <div 
                  key={condition.id}
                  className="flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                >
                  <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                  
                  {/* Field Select */}
                  <Select
                    value={condition.type}
                    onValueChange={(value: any) => {
                      updateCondition(condition.id, { 
                        type: value,
                        field: value,
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

                  {/* State Select */}
                  <Select
                    value={currentState}
                    onValueChange={(value) => {
                      const operator = mapStateToOperator(value);
                      updateCondition(condition.id, { 
                        operator,
                        value: needsValue(value) ? condition.value : null
                      });
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_STATES.map(state => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Value Input (conditional) */}
                  {renderValueInput(condition, currentState)}

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