import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, ChevronDown, ChevronRight, Settings2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FormField, FormFieldType, FormFieldOption, ValidationRule, ConditionalLogic } from '@/types/formBuilder';
import { cn } from '@/lib/utils';

interface FieldConfigPanelProps {
  field: FormField | null;
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  availableFields: FormField[];
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
  { value: 'intake-date', label: 'Intake Date' },
  { value: 'switch', label: 'Switch' },
  { value: 'file', label: 'File Upload' },
  { value: 'url', label: 'URL' },
  { value: 'consent', label: 'Consent Checkbox' },
  { value: 'program-list', label: 'Program List' },
];

export function FieldConfigPanel({ field, onUpdate, availableFields }: FieldConfigPanelProps) {
  const [showOptions, setShowOptions] = useState(true);
  const [showValidation, setShowValidation] = useState(false);
  const [showConditional, setShowConditional] = useState(false);

  if (!field) {
    return (
      <div className="w-80 border-l bg-muted/30 flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <Settings2 className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            Select a field to configure its settings
          </p>
        </div>
      </div>
    );
  }

  const needsOptions = ['select', 'radio', 'multi-select'].includes(field.type);
  const needsMinMax = ['number'].includes(field.type);
  const needsFileProps = field.type === 'file';

  const updateField = (updates: Partial<FormField>) => {
    onUpdate(field.id, updates);
  };

  const addOption = () => {
    const newOption: FormFieldOption = {
      label: 'New Option',
      value: `option_${Date.now()}`,
    };
    updateField({
      options: [...(field.options || []), newOption]
    });
  };

  const updateOption = (index: number, updates: Partial<FormFieldOption>) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], ...updates };
    updateField({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    updateField({ options: newOptions });
  };

  const addValidationRule = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: 'This field is required',
    };
    updateField({
      validation: [...(field.validation || []), newRule]
    });
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...(field.validation || [])];
    newRules[index] = { ...newRules[index], ...updates };
    updateField({ validation: newRules });
  };

  const removeValidationRule = (index: number) => {
    const newRules = [...(field.validation || [])];
    newRules.splice(index, 1);
    updateField({ validation: newRules });
  };

  const addConditionalLogic = (type: 'showWhen' | 'hideWhen') => {
    const newCondition: ConditionalLogic = {
      field: '',
      operator: 'equals',
      value: '',
    };
    updateField({
      [type]: [...(field[type] || []), newCondition]
    });
  };

  const updateConditionalLogic = (type: 'showWhen' | 'hideWhen', index: number, updates: Partial<ConditionalLogic>) => {
    const newConditions = [...(field[type] || [])];
    newConditions[index] = { ...newConditions[index], ...updates };
    updateField({ [type]: newConditions });
  };

  const removeConditionalLogic = (type: 'showWhen' | 'hideWhen', index: number) => {
    const newConditions = [...(field[type] || [])];
    newConditions.splice(index, 1);
    updateField({ [type]: newConditions });
  };

  return (
    <div className="w-80 border-l bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Field Settings</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Configure the selected field
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="field-label">Field Label *</Label>
              <Input
                id="field-label"
                value={field.label}
                onChange={(e) => updateField({ label: e.target.value })}
                placeholder="Enter field label"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="field-type">Field Type</Label>
              <Select 
                value={field.type} 
                onValueChange={(value: FormFieldType) => updateField({ type: value })}
              >
                <SelectTrigger className="mt-1.5">
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

            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={field.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                placeholder="Optional placeholder text"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="field-help">Help Text</Label>
              <Textarea
                id="field-help"
                value={field.helpText || ''}
                onChange={(e) => updateField({ helpText: e.target.value })}
                placeholder="Optional help text for users"
                rows={2}
                className="mt-1.5"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-required"
                  checked={field.required}
                  onCheckedChange={(checked) => updateField({ required: !!checked })}
                />
                <Label htmlFor="field-required" className="cursor-pointer">Required Field</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-enabled"
                  checked={field.enabled}
                  onCheckedChange={(checked) => updateField({ enabled: !!checked })}
                />
                <Label htmlFor="field-enabled" className="cursor-pointer">Enabled</Label>
              </div>
            </div>
          </div>

          {/* Number Field Settings */}
          {needsMinMax && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">Number Settings</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="field-min" className="text-xs">Min</Label>
                  <Input
                    id="field-min"
                    type="number"
                    value={field.min || ''}
                    onChange={(e) => updateField({ min: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="field-max" className="text-xs">Max</Label>
                  <Input
                    id="field-max"
                    type="number"
                    value={field.max || ''}
                    onChange={(e) => updateField({ max: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="field-step" className="text-xs">Step</Label>
                  <Input
                    id="field-step"
                    type="number"
                    value={field.step || ''}
                    onChange={(e) => updateField({ step: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* File Upload Settings */}
          {needsFileProps && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">File Settings</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div>
                <Label htmlFor="field-accept">Accepted File Types</Label>
                <Input
                  id="field-accept"
                  value={field.accept || ''}
                  onChange={(e) => updateField({ accept: e.target.value })}
                  placeholder="e.g., .pdf,.doc,.docx"
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-multiple"
                  checked={field.multiple}
                  onCheckedChange={(checked) => updateField({ multiple: !!checked })}
                />
                <Label htmlFor="field-multiple" className="cursor-pointer">Allow Multiple Files</Label>
              </div>
            </div>
          )}

          {/* Options Section */}
          {needsOptions && (
            <Collapsible open={showOptions} onOpenChange={setShowOptions}>
              <div className="space-y-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    <span className="font-medium">Options</span>
                    {showOptions ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3">
                  <Button onClick={addOption} size="sm" variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                  <div className="space-y-2">
                    {field.options?.map((option, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <Input
                          value={option.label}
                          onChange={(e) => updateOption(index, { label: e.target.value })}
                          placeholder="Option label"
                          className="text-sm"
                        />
                        <Input
                          value={option.value}
                          onChange={(e) => updateOption(index, { value: e.target.value })}
                          placeholder="Option value"
                          className="text-sm"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`option-${index}-disabled`}
                              checked={option.disabled}
                              onCheckedChange={(checked) => updateOption(index, { disabled: !!checked })}
                            />
                            <Label htmlFor={`option-${index}-disabled`} className="text-xs cursor-pointer">
                              Disabled
                            </Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}

          {/* Validation Rules Section */}
          <Collapsible open={showValidation} onOpenChange={setShowValidation}>
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span className="font-medium">Validation Rules</span>
                  <div className="flex items-center gap-2">
                    {field.validation && field.validation.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {field.validation.length}
                      </Badge>
                    )}
                    {showValidation ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3">
                <Button onClick={addValidationRule} size="sm" variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
                <div className="space-y-2">
                  {field.validation?.map((rule, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <Select
                        value={rule.type}
                        onValueChange={(value) => updateValidationRule(index, { type: value as any })}
                      >
                        <SelectTrigger>
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
                        variant="ghost"
                        size="sm"
                        onClick={() => removeValidationRule(index)}
                        className="w-full"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2 text-destructive" />
                        Remove Rule
                      </Button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Conditional Logic Section */}
          <Collapsible open={showConditional} onOpenChange={setShowConditional}>
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span className="font-medium">Conditional Logic</span>
                  <div className="flex items-center gap-2">
                    {((field.showWhen && field.showWhen.length > 0) || (field.hideWhen && field.hideWhen.length > 0)) && (
                      <Badge variant="secondary" className="text-xs">
                        {(field.showWhen?.length || 0) + (field.hideWhen?.length || 0)}
                      </Badge>
                    )}
                    {showConditional ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4">
                {/* Show When */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Show When</Label>
                    <Button onClick={() => addConditionalLogic('showWhen')} size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  {field.showWhen?.map((condition, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <Select
                        value={condition.field}
                        onValueChange={(value) => updateConditionalLogic('showWhen', index, { field: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
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
                        <SelectTrigger>
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
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConditionalLogic('showWhen', index)}
                        className="w-full"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2 text-destructive" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Hide When */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Hide When</Label>
                    <Button onClick={() => addConditionalLogic('hideWhen')} size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  {field.hideWhen?.map((condition, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <Select
                        value={condition.field}
                        onValueChange={(value) => updateConditionalLogic('hideWhen', index, { field: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
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
                        onValueChange={(value) => updateConditionalLogic('hideWhen', index, { operator: value as any })}
                      >
                        <SelectTrigger>
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
                        onChange={(e) => updateConditionalLogic('hideWhen', index, { value: e.target.value })}
                        placeholder="Value"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConditionalLogic('hideWhen', index)}
                        className="w-full"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2 text-destructive" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
}
