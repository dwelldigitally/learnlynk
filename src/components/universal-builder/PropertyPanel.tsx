import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useBuilder } from '@/contexts/BuilderContext';
import { getElementTypesForBuilder } from '@/config/elementTypes';
import { PropertySchema } from '@/types/universalBuilder';
import { Plus, X } from 'lucide-react';

export function PropertyPanel() {
  const { state, dispatch } = useBuilder();
  
  if (!state.selectedElementId) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="text-sm">Select an element to edit its properties</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedElement = state.config.elements.find(el => el.id === state.selectedElementId);
  if (!selectedElement) return null;

  const elementTypes = getElementTypesForBuilder(state.config.type);
  const elementTypeConfig = elementTypes.find(type => type.type === selectedElement.type);

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

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Properties */}
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Title</Label>
            <Input
              value={selectedElement.title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Element title"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              value={selectedElement.description || ''}
              onChange={(e) => handlePropertyChange('description', e.target.value)}
              placeholder="Element description"
              rows={2}
            />
          </div>
        </div>

        <Separator />

        {/* Element-specific Properties */}
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
      </CardContent>
    </Card>
  );
}