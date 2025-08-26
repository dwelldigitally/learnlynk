import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useBuilder } from '@/contexts/BuilderContext';
import { journeyElementTypes } from '@/config/elementTypes';
import { PropertySchema } from '@/types/universalBuilder';
import { Plus, X, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export function JourneyPropertyPanel() {
  const { state, dispatch } = useBuilder();
  
  if (!state.selectedElementId) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <div className="text-sm">Select a journey step to edit its properties</div>
            <p className="text-xs text-muted-foreground">
              Configure requirements, timing, and behavior for each step
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedElement = state.config.elements.find(el => el.id === state.selectedElementId);
  if (!selectedElement) return null;

  const elementTypeConfig = journeyElementTypes.find(type => type.type === selectedElement.type);

  const handlePropertyChange = (key: string, value: any) => {
    const updates: any = {};
    
    if (key.includes('.')) {
      // Handle nested properties like 'delay.value'
      const [parentKey, childKey] = key.split('.');
      updates[parentKey] = {
        ...selectedElement.config[parentKey],
        [childKey]: value,
      };
    } else if (key === 'title' || key === 'description') {
      // Handle base properties
      updates[key] = value;
    } else {
      // Handle config properties
      updates.config = {
        ...selectedElement.config,
        [key]: value,
      };
    }

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: { id: selectedElement.id, updates },
    });
  };

  const handleAddOption = () => {
    const currentOptions = selectedElement.config.options || [];
    const newOption = { label: 'New Option', value: `option_${currentOptions.length + 1}` };
    handlePropertyChange('options', [...currentOptions, newOption]);
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = selectedElement.config.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    handlePropertyChange('options', newOptions);
  };

  const handleUpdateOption = (index: number, field: 'label' | 'value', value: string) => {
    const currentOptions = selectedElement.config.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    handlePropertyChange('options', newOptions);
  };

  const getValue = (key: string) => {
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      return selectedElement.config[parentKey]?.[childKey];
    }
    if (key === 'title' || key === 'description') {
      return selectedElement[key];
    }
    return selectedElement.config[key];
  };

  const renderPropertyField = (schema: PropertySchema) => {
    const value = getValue(schema.key);

    switch (schema.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handlePropertyChange(schema.key, e.target.value)}
            placeholder={schema.placeholder}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handlePropertyChange(schema.key, e.target.value)}
            placeholder={schema.placeholder}
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handlePropertyChange(schema.key, parseInt(e.target.value) || 0)}
            placeholder={schema.placeholder}
          />
        );

      case 'checkbox':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => handlePropertyChange(schema.key, checked)}
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => handlePropertyChange(schema.key, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'array':
        if (schema.key === 'options') {
          return (
            <div className="space-y-2">
              {(value || []).map((option: any, index: number) => (
                <div key={index} className="flex gap-2 p-2 border rounded">
                  <Input
                    placeholder="Label"
                    value={option.label}
                    onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                  />
                  <Input
                    placeholder="Value"
                    value={option.value}
                    onChange={(e) => handleUpdateOption(index, 'value', e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          );
        }
        return <div>Array type not implemented</div>;

      default:
        return <div>Unknown field type: {schema.type}</div>;
    }
  };

  const getElementStatusInfo = () => {
    const { config } = selectedElement;
    const warnings = [];
    const info = [];

    // Check for common configuration issues
    if (!config.required && ['document-upload', 'verification'].includes(selectedElement.type)) {
      warnings.push('Consider making this step required for compliance');
    }

    if (config.duration && config.duration > 120) {
      warnings.push('Long duration may impact applicant experience');
    }

    if (config.schedulingRequired && !config.duration) {
      warnings.push('Set duration for scheduling accuracy');
    }

    // Positive indicators
    if (config.autoAdvance) {
      info.push('Step will auto-advance when completed');
    }

    if (config.required) {
      info.push('Required step - blocks progress until completed');
    }

    return { warnings, info };
  };

  const { warnings, info } = getElementStatusInfo();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Properties
          <Badge variant="outline" className="text-xs">
            {selectedElement.type.replace('-', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicators */}
        {(warnings.length > 0 || info.length > 0) && (
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-yellow-800">{warning}</span>
              </div>
            ))}
            {info.map((infoItem, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <CheckCircle className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-800">{infoItem}</span>
              </div>
            ))}
          </div>
        )}

        {/* Basic Properties */}
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Step Title</Label>
            <Input
              value={selectedElement.title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Enter step title"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              value={selectedElement.description || ''}
              onChange={(e) => handlePropertyChange('description', e.target.value)}
              placeholder="Describe what happens in this step"
              rows={2}
            />
          </div>
        </div>

        <Separator />

        {/* Journey-Specific Quick Settings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Step Behavior
          </h4>
          
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Required Step</Label>
              <Switch
                checked={selectedElement.config.required || false}
                onCheckedChange={(checked) => handlePropertyChange('required', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm">Auto-advance when complete</Label>
              <Switch
                checked={selectedElement.config.autoAdvance || false}
                onCheckedChange={(checked) => handlePropertyChange('autoAdvance', checked)}
              />
            </div>
            
            {selectedElement.type.includes('interview') && (
              <div className="flex items-center justify-between">
                <Label className="text-sm">Requires Scheduling</Label>
                <Switch
                  checked={selectedElement.config.schedulingRequired || false}
                  onCheckedChange={(checked) => handlePropertyChange('schedulingRequired', checked)}
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Element-specific Properties */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Step Configuration</h4>
          {elementTypeConfig?.configSchema.map((schema) => (
            <div key={schema.key} className="space-y-2">
              <Label className="text-sm font-medium">
                {schema.label}
                {schema.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {renderPropertyField(schema)}
              {schema.helpText && (
                <p className="text-xs text-muted-foreground">{schema.helpText}</p>
              )}
            </div>
          ))}
        </div>

        {/* Advanced Settings */}
        <Separator />
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Advanced Settings</h4>
          
          <div>
            <Label className="text-sm font-medium">SLA (Service Level Agreement)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="number"
                value={selectedElement.config.slaHours || ''}
                onChange={(e) => handlePropertyChange('slaHours', parseInt(e.target.value) || undefined)}
                placeholder="Hours"
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground self-center">hours to complete</span>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Escalation Rule</Label>
            <Select
              value={selectedElement.config.escalationRule || ''}
              onValueChange={(value) => handlePropertyChange('escalationRule', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select escalation rule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No escalation</SelectItem>
                <SelectItem value="supervisor">Escalate to supervisor</SelectItem>
                <SelectItem value="manager">Escalate to manager</SelectItem>
                <SelectItem value="automated">Automated reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}