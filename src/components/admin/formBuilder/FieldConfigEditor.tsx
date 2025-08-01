import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FormField, FormFieldType, FormFieldOption, ValidationRule, ConditionalLogic } from '@/types/formBuilder';
import { cn } from '@/lib/utils';

interface FieldConfigEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  availableFields: FormField[];
  compact?: boolean;
}

const fieldTypeOptions: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'multi-select', label: 'Multi-Select' },
  { value: 'date', label: 'Date Picker' },
  { value: 'range', label: 'Range Slider' },
  { value: 'switch', label: 'Switch' },
  { value: 'file', label: 'File Upload' },
  { value: 'url', label: 'URL' },
  { value: 'color', label: 'Color Picker' },
  { value: 'consent', label: 'Consent Checkbox' },
];

export function FieldConfigEditor({ field, onUpdate, onRemove, availableFields, compact = false }: FieldConfigEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const needsOptions = ['select', 'radio', 'multi-select'].includes(field.type);
  const needsMinMax = ['number', 'range'].includes(field.type);
  const needsFileProps = field.type === 'file';

  const addOption = () => {
    const newOption: FormFieldOption = {
      label: 'New Option',
      value: `option_${Date.now()}`,
    };
    onUpdate({
      options: [...(field.options || []), newOption]
    });
  };

  const updateOption = (index: number, updates: Partial<FormFieldOption>) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], ...updates };
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    onUpdate({ options: newOptions });
  };

  const addValidationRule = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: 'This field is required',
    };
    onUpdate({
      validation: [...(field.validation || []), newRule]
    });
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...(field.validation || [])];
    newRules[index] = { ...newRules[index], ...updates };
    onUpdate({ validation: newRules });
  };

  const removeValidationRule = (index: number) => {
    const newRules = [...(field.validation || [])];
    newRules.splice(index, 1);
    onUpdate({ validation: newRules });
  };

  const addConditionalLogic = (type: 'showWhen' | 'hideWhen') => {
    const newCondition: ConditionalLogic = {
      field: '',
      operator: 'equals',
      value: '',
    };
    onUpdate({
      [type]: [...(field[type] || []), newCondition]
    });
  };

  const updateConditionalLogic = (type: 'showWhen' | 'hideWhen', index: number, updates: Partial<ConditionalLogic>) => {
    const newConditions = [...(field[type] || [])];
    newConditions[index] = { ...newConditions[index], ...updates };
    onUpdate({ [type]: newConditions });
  };

  const removeConditionalLogic = (type: 'showWhen' | 'hideWhen', index: number) => {
    const newConditions = [...(field[type] || [])];
    newConditions.splice(index, 1);
    onUpdate({ [type]: newConditions });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!compact && (
              <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.enabled}
                onCheckedChange={(checked) => onUpdate({ enabled: !!checked })}
              />
              <CardTitle className="text-sm">{field.label || 'Untitled Field'}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {fieldTypeOptions.find(t => t.value === field.type)?.label}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <Collapsible open={compact || isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Basic Configuration */}
            <div className={cn("grid gap-4", compact ? "grid-cols-1" : "grid-cols-2")}>
              <div>
                <Label htmlFor={`${field.id}-label`}>Field Label</Label>
                <Input
                  id={`${field.id}-label`}
                  value={field.label}
                  onChange={(e) => onUpdate({ label: e.target.value })}
                  placeholder="Enter field label"
                />
              </div>
              {!compact && (
                <div>
                  <Label htmlFor={`${field.id}-type`}>Field Type</Label>
                  <Select value={field.type} onValueChange={(value: FormFieldType) => onUpdate({ type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {fieldTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className={cn("grid gap-4", compact ? "grid-cols-1" : "grid-cols-2")}>
              <div>
                <Label htmlFor={`${field.id}-placeholder`}>Placeholder</Label>
                <Input
                  id={`${field.id}-placeholder`}
                  value={field.placeholder || ''}
                  onChange={(e) => onUpdate({ placeholder: e.target.value })}
                  placeholder="Enter placeholder text"
                />
              </div>
              {!compact && (
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id={`${field.id}-required`}
                    checked={field.required}
                    onCheckedChange={(checked) => onUpdate({ required: !!checked })}
                  />
                  <Label htmlFor={`${field.id}-required`}>Required Field</Label>
                </div>
              )}
            </div>

            {!compact && (
              <div>
                <Label htmlFor={`${field.id}-help`}>Help Text</Label>
                <Textarea
                  id={`${field.id}-help`}
                  value={field.helpText || ''}
                  onChange={(e) => onUpdate({ helpText: e.target.value })}
                  placeholder="Optional help text for users"
                  rows={2}
                />
              </div>
            )}

            {/* Field-Specific Configuration */}
            {needsOptions && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Options</Label>
                  <Button onClick={addOption} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {field.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option.label}
                        onChange={(e) => updateOption(index, { label: e.target.value })}
                        placeholder="Option label"
                      />
                      <Input
                        value={option.value}
                        onChange={(e) => updateOption(index, { value: e.target.value })}
                        placeholder="Option value"
                      />
                      <Checkbox
                        checked={option.disabled}
                        onCheckedChange={(checked) => updateOption(index, { disabled: !!checked })}
                      />
                      <Label className="text-xs">Disabled</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {needsMinMax && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`${field.id}-min`}>Min Value</Label>
                  <Input
                    id={`${field.id}-min`}
                    type="number"
                    value={field.min || ''}
                    onChange={(e) => onUpdate({ min: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field.id}-max`}>Max Value</Label>
                  <Input
                    id={`${field.id}-max`}
                    type="number"
                    value={field.max || ''}
                    onChange={(e) => onUpdate({ max: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field.id}-step`}>Step</Label>
                  <Input
                    id={`${field.id}-step`}
                    type="number"
                    value={field.step || ''}
                    onChange={(e) => onUpdate({ step: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {needsFileProps && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${field.id}-accept`}>Accepted File Types</Label>
                  <Input
                    id={`${field.id}-accept`}
                    value={field.accept || ''}
                    onChange={(e) => onUpdate({ accept: e.target.value })}
                    placeholder="e.g., .pdf,.doc,.docx"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id={`${field.id}-multiple`}
                    checked={field.multiple}
                    onCheckedChange={(checked) => onUpdate({ multiple: !!checked })}
                  />
                  <Label htmlFor={`${field.id}-multiple`}>Allow Multiple Files</Label>
                </div>
              </div>
            )}

            {/* Advanced Configuration - Hidden in compact mode */}
            {!compact && (
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Configuration
                  {showAdvanced ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                {/* Validation Rules */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Validation Rules</Label>
                    <Button onClick={addValidationRule} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Rule
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {field.validation?.map((rule, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded">
                        <Select
                          value={rule.type}
                          onValueChange={(value) => updateValidationRule(index, { type: value as any })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            <SelectItem value="required">Required</SelectItem>
                            <SelectItem value="min_length">Min Length</SelectItem>
                            <SelectItem value="max_length">Max Length</SelectItem>
                            <SelectItem value="pattern">Pattern</SelectItem>
                            <SelectItem value="min_value">Min Value</SelectItem>
                            <SelectItem value="max_value">Max Value</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={rule.value || ''}
                          onChange={(e) => updateValidationRule(index, { value: e.target.value })}
                          placeholder="Value"
                        />
                        <Input
                          value={rule.message || ''}
                          onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                          placeholder="Error message"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeValidationRule(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conditional Logic */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Show When Conditions</Label>
                    <Button onClick={() => addConditionalLogic('showWhen')} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Condition
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {field.showWhen?.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded">
                        <Select
                          value={condition.field}
                          onValueChange={(value) => updateConditionalLogic('showWhen', index, { field: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Field" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            {availableFields.filter(f => f.id !== field.id).map((f) => (
                              <SelectItem key={f.id} value={f.id}>
                                {f.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={condition.operator}
                          onValueChange={(value) => updateConditionalLogic('showWhen', index, { operator: value as any })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="not_equals">Not Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="not_contains">Not Contains</SelectItem>
                            <SelectItem value="is_empty">Is Empty</SelectItem>
                            <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={condition.value || ''}
                          onChange={(e) => updateConditionalLogic('showWhen', index, { value: e.target.value })}
                          placeholder="Value"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeConditionalLogic('showWhen', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}