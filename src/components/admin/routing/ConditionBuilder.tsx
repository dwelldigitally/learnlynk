import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Move } from 'lucide-react';
import { ConditionGroup, RuleCondition } from '@/types/routing';

interface ConditionBuilderProps {
  conditionGroups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
}

const CONDITION_TYPES = [
  { value: 'source', label: 'Lead Source' },
  { value: 'location', label: 'Location' },
  { value: 'program', label: 'Program Interest' },
  { value: 'score', label: 'Lead Score' },
  { value: 'time', label: 'Time-based' },
  { value: 'custom', label: 'Custom Field' }
];

const OPERATORS = {
  source: [
    { value: 'in', label: 'Is one of' },
    { value: 'not_in', label: 'Is not one of' }
  ],
  location: [
    { value: 'equals', label: 'Equals' },
    { value: 'in', label: 'Is one of' },
    { value: 'contains', label: 'Contains' }
  ],
  program: [
    { value: 'contains', label: 'Contains' },
    { value: 'in', label: 'Is one of' }
  ],
  score: [
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between' }
  ],
  time: [
    { value: 'between', label: 'Between times' },
    { value: 'in', label: 'On days' }
  ],
  custom: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' }
  ]
};

const FIELD_OPTIONS = {
  source: ['web', 'social_media', 'event', 'agent', 'email', 'referral', 'phone', 'walk_in', 'chatbot', 'ads', 'forms'],
  location: ['country', 'state', 'city'],
  program: ['Health Care Assistant', 'Aviation', 'Education Assistant', 'Hospitality', 'ECE', 'MLA'],
  score: ['lead_score', 'priority'],
  time: ['weekday', 'weekend', 'business_hours'],
  custom: []
};

export function ConditionBuilder({ conditionGroups, onChange }: ConditionBuilderProps) {
  const addConditionGroup = () => {
    const newGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      operator: 'AND',
      conditions: []
    };
    onChange([...conditionGroups, newGroup]);
  };

  const removeConditionGroup = (groupId: string) => {
    onChange(conditionGroups.filter(group => group.id !== groupId));
  };

  const updateConditionGroup = (groupId: string, updates: Partial<ConditionGroup>) => {
    onChange(conditionGroups.map(group => 
      group.id === groupId ? { ...group, ...updates } : group
    ));
  };

  const addCondition = (groupId: string) => {
    const newCondition: RuleCondition = {
      id: `condition-${Date.now()}`,
      type: 'source',
      field: 'source',
      operator: 'in',
      value: []
    };
    
    updateConditionGroup(groupId, {
      conditions: [
        ...conditionGroups.find(g => g.id === groupId)?.conditions || [],
        newCondition
      ]
    });
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    const group = conditionGroups.find(g => g.id === groupId);
    if (group) {
      updateConditionGroup(groupId, {
        conditions: group.conditions.filter(c => c.id !== conditionId)
      });
    }
  };

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<RuleCondition>) => {
    const group = conditionGroups.find(g => g.id === groupId);
    if (group) {
      updateConditionGroup(groupId, {
        conditions: group.conditions.map(c => 
          c.id === conditionId ? { ...c, ...updates } : c
        )
      });
    }
  };

  const renderConditionValue = (groupId: string, condition: RuleCondition) => {
    const { type, operator, field, value } = condition;
    
    if (type === 'source' || type === 'program') {
      const options = FIELD_OPTIONS[type] || [];
      return (
        <div className="space-y-2">
          <Label>Values</Label>
          <div className="flex flex-wrap gap-2">
            {(value || []).map((v: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                {v}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => {
                    const newValue = value.filter((_: any, i: number) => i !== idx);
                    updateCondition(groupId, condition.id, { value: newValue });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <Select
            value=""
            onValueChange={(newValue) => {
              if (newValue && !value?.includes(newValue)) {
                updateCondition(groupId, condition.id, { 
                  value: [...(value || []), newValue] 
                });
              }
            }}
          >
            <SelectTrigger>
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

    if (type === 'score' && operator === 'between') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Min Value</Label>
            <Input
              type="number"
              value={value?.min || ''}
              onChange={(e) => updateCondition(groupId, condition.id, { 
                value: { ...value, min: e.target.value } 
              })}
            />
          </div>
          <div>
            <Label>Max Value</Label>
            <Input
              type="number"
              value={value?.max || ''}
              onChange={(e) => updateCondition(groupId, condition.id, { 
                value: { ...value, max: e.target.value } 
              })}
            />
          </div>
        </div>
      );
    }

    if (type === 'location') {
      return (
        <div>
          <Label>Value</Label>
          <Input
            value={value || ''}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            placeholder="Enter location value..."
          />
        </div>
      );
    }

    return (
      <div>
        <Label>Value</Label>
        <Input
          value={value || ''}
          onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
          placeholder="Enter value..."
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Routing Conditions</h3>
        <Button onClick={addConditionGroup} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Condition Group
        </Button>
      </div>

      {conditionGroups.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No conditions defined. Click "Add Condition Group" to start.</p>
          </CardContent>
        </Card>
      )}

      {conditionGroups.map((group, groupIndex) => (
        <Card key={group.id} className="relative">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="text-sm">
                  Condition Group {groupIndex + 1}
                </CardTitle>
                <Select
                  value={group.operator}
                  onValueChange={(value: 'AND' | 'OR') => 
                    updateConditionGroup(group.id, { operator: value })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => removeConditionGroup(group.id)}
                variant="ghost"
                size="sm"
                className="text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.conditions.map((condition, conditionIndex) => (
              <div key={condition.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Condition {conditionIndex + 1}</h4>
                  <Button
                    onClick={() => removeCondition(group.id, condition.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Condition Type</Label>
                    <Select
                      value={condition.type}
                      onValueChange={(value: any) => {
                        const operatorValue = OPERATORS[value as keyof typeof OPERATORS]?.[0]?.value || 'equals';
                        updateCondition(group.id, condition.id, { 
                          type: value,
                          field: FIELD_OPTIONS[value as keyof typeof FIELD_OPTIONS]?.[0] || '',
                          operator: operatorValue as 'equals' | 'in' | 'not_in' | 'greater_than' | 'less_than' | 'contains' | 'between',
                          value: null
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITION_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Field</Label>
                    <Select
                      value={condition.field}
                      onValueChange={(value) => 
                        updateCondition(group.id, condition.id, { field: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(FIELD_OPTIONS[condition.type as keyof typeof FIELD_OPTIONS] || []).map(field => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Operator</Label>
                    <Select
                      value={condition.operator}
                      onValueChange={(value: any) => 
                        updateCondition(group.id, condition.id, { operator: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(OPERATORS[condition.type as keyof typeof OPERATORS] || []).map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {renderConditionValue(group.id, condition)}
              </div>
            ))}
            
            <Button 
              onClick={() => addCondition(group.id)}
              variant="outline" 
              size="sm"
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </CardContent>
        </Card>
      ))}
      
      {conditionGroups.length > 1 && (
        <div className="text-center text-sm text-muted-foreground">
          Multiple condition groups are connected with OR logic
        </div>
      )}
    </div>
  );
}