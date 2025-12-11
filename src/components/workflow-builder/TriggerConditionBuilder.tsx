import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, X } from 'lucide-react';
import { triggerConditionFields, operatorLabels, fieldCategories, TriggerConditionField } from '@/config/triggerConditionFields';

interface Condition {
  field: string;
  operator: string;
  value: any;
}

interface ConditionGroup {
  operator: 'AND' | 'OR';
  conditions: Condition[];
}

interface TriggerConditionBuilderProps {
  conditionGroups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
}

export function TriggerConditionBuilder({ conditionGroups = [], onChange }: TriggerConditionBuilderProps) {
  const addConditionGroup = () => {
    onChange([...conditionGroups, { operator: 'AND', conditions: [{ field: '', operator: 'equals', value: '' }] }]);
  };

  const removeConditionGroup = (groupIndex: number) => {
    onChange(conditionGroups.filter((_, i) => i !== groupIndex));
  };

  const updateGroupOperator = (groupIndex: number, operator: 'AND' | 'OR') => {
    const updated = [...conditionGroups];
    updated[groupIndex].operator = operator;
    onChange(updated);
  };

  const addCondition = (groupIndex: number) => {
    const updated = [...conditionGroups];
    updated[groupIndex].conditions.push({ field: '', operator: 'equals', value: '' });
    onChange(updated);
  };

  const removeCondition = (groupIndex: number, condIndex: number) => {
    const updated = [...conditionGroups];
    updated[groupIndex].conditions = updated[groupIndex].conditions.filter((_, i) => i !== condIndex);
    if (updated[groupIndex].conditions.length === 0) {
      updated.splice(groupIndex, 1);
    }
    onChange(updated);
  };

  const updateCondition = (groupIndex: number, condIndex: number, field: keyof Condition, value: any) => {
    const updated = [...conditionGroups];
    updated[groupIndex].conditions[condIndex][field] = value;
    
    // Reset operator and value when field changes
    if (field === 'field') {
      const fieldConfig = triggerConditionFields.find(f => f.key === value);
      if (fieldConfig) {
        updated[groupIndex].conditions[condIndex].operator = fieldConfig.operators[0];
        updated[groupIndex].conditions[condIndex].value = '';
      }
    }
    
    onChange(updated);
  };

  const getFieldConfig = (fieldKey: string): TriggerConditionField | undefined => {
    return triggerConditionFields.find(f => f.key === fieldKey);
  };

  const renderValueInput = (condition: Condition, groupIndex: number, condIndex: number) => {
    const fieldConfig = getFieldConfig(condition.field);
    if (!fieldConfig) return null;

    // Don't show value input for empty/not empty operators
    if (['is_empty', 'is_not_empty', 'today', 'this_week', 'this_month'].includes(condition.operator)) {
      return null;
    }

    if (fieldConfig.type === 'select' && fieldConfig.options) {
      return (
        <Select
          value={condition.value || ''}
          onValueChange={(val) => updateCondition(groupIndex, condIndex, 'value', val)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {fieldConfig.options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (fieldConfig.type === 'boolean') {
      return (
        <Select
          value={condition.value?.toString() || ''}
          onValueChange={(val) => updateCondition(groupIndex, condIndex, 'value', val === 'true')}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (fieldConfig.type === 'number') {
      return (
        <Input
          type="number"
          value={condition.value || ''}
          onChange={(e) => updateCondition(groupIndex, condIndex, 'value', e.target.value)}
          placeholder={fieldConfig.placeholder || 'Enter value'}
          className="w-32"
        />
      );
    }

    if (fieldConfig.type === 'date') {
      if (condition.operator === 'days_ago') {
        return (
          <Input
            type="number"
            value={condition.value || ''}
            onChange={(e) => updateCondition(groupIndex, condIndex, 'value', e.target.value)}
            placeholder="Days"
            className="w-24"
          />
        );
      }
      return (
        <Input
          type="date"
          value={condition.value || ''}
          onChange={(e) => updateCondition(groupIndex, condIndex, 'value', e.target.value)}
          className="w-40"
        />
      );
    }

    return (
      <Input
        value={condition.value || ''}
        onChange={(e) => updateCondition(groupIndex, condIndex, 'value', e.target.value)}
        placeholder={fieldConfig.placeholder || 'Enter value'}
        className="w-40"
      />
    );
  };

  // Group fields by category for the dropdown
  const groupedFields = fieldCategories.map(cat => ({
    category: cat,
    fields: triggerConditionFields.filter(f => f.category === cat)
  })).filter(g => g.fields.length > 0);

  return (
    <div className="space-y-4">
      {conditionGroups.map((group, groupIndex) => (
        <Card key={groupIndex} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Group {groupIndex + 1}</Badge>
              <Select
                value={group.operator}
                onValueChange={(val) => updateGroupOperator(groupIndex, val as 'AND' | 'OR')}
              >
                <SelectTrigger className="w-24 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeConditionGroup(groupIndex)}
              className="h-7 w-7 p-0"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="space-y-2">
            {group.conditions.map((condition, condIndex) => {
              const fieldConfig = getFieldConfig(condition.field);
              
              return (
                <div key={condIndex} className="flex items-center gap-2 flex-wrap">
                  {condIndex > 0 && (
                    <Badge variant="secondary" className="text-xs">{group.operator}</Badge>
                  )}
                  
                  <Select
                    value={condition.field}
                    onValueChange={(val) => updateCondition(groupIndex, condIndex, 'field', val)}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {groupedFields.map(({ category, fields }) => (
                        <div key={category}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                            {category}
                          </div>
                          {fields.map(field => (
                            <SelectItem key={field.key} value={field.key}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>

                  {condition.field && fieldConfig && (
                    <Select
                      value={condition.operator}
                      onValueChange={(val) => updateCondition(groupIndex, condIndex, 'operator', val)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldConfig.operators.map(op => (
                          <SelectItem key={op} value={op}>
                            {operatorLabels[op] || op}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {renderValueInput(condition, groupIndex, condIndex)}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(groupIndex, condIndex)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => addCondition(groupIndex)}
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Condition
          </Button>
        </Card>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={addConditionGroup}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Condition Group
      </Button>

      {conditionGroups.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No conditions set. Add a condition group to filter which leads enter this automation.
        </p>
      )}
    </div>
  );
}
