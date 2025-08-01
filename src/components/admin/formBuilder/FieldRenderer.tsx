import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FormField, FormData, FormErrors } from '@/types/formBuilder';

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  formData: FormData;
}

export function FieldRenderer({ field, value, onChange, error, formData }: FieldRendererProps) {
  const commonProps = {
    id: field.id,
    placeholder: field.placeholder,
    'aria-describedby': field.helpText ? `${field.id}-help` : undefined,
    'aria-invalid': !!error,
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'tel':
        return (
          <Input
            {...commonProps}
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            rows={field.rows || 4}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi-select':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, option.value]);
                    } else {
                      onChange(selectedValues.filter((v: any) => v !== option.value));
                    }
                  }}
                  disabled={option.disabled}
                />
                <Label htmlFor={`${field.id}-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup value={value || ''} onValueChange={onChange}>
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${field.id}-${option.value}`}
                  disabled={option.disabled}
                />
                <Label htmlFor={`${field.id}-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={!!value}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
            </Label>
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.id}
              checked={!!value}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
            </Label>
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  error && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date?.toISOString())}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <Slider
              value={[value || field.min || 0]}
              onValueChange={(newValue) => onChange(newValue[0])}
              max={field.max || 100}
              min={field.min || 0}
              step={field.step || 1}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground text-center">
              Value: {value || field.min || 0}
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <Input
              {...commonProps}
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onChange(field.multiple ? files : files[0]);
              }}
              className={cn("file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80", error && "border-destructive")}
            />
            {value && (
              <div className="text-sm text-muted-foreground">
                {Array.isArray(value) 
                  ? `${value.length} file(s) selected`
                  : value.name || 'File selected'
                }
              </div>
            )}
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Input
              {...commonProps}
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-16 h-10 p-1 rounded"
            />
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className={cn("flex-1", error && "border-destructive")}
            />
          </div>
        );

      case 'consent':
        return (
          <div className="flex items-start space-x-2">
            <Checkbox
              id={field.id}
              checked={!!value}
              onCheckedChange={onChange}
              className="mt-1"
            />
            <Label htmlFor={field.id} className="text-sm leading-relaxed">
              {field.helpText || 'I agree to the terms and conditions'}
            </Label>
          </div>
        );

      default:
        return (
          <Input
            {...commonProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );
    }
  };

  // Don't render label for checkbox, switch, and consent types (they handle their own labels)
  const hideLabel = ['checkbox', 'switch', 'consent'].includes(field.type);

  return (
    <div className="space-y-2">
      {!hideLabel && (
        <Label htmlFor={field.id} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      {renderField()}
      
      {field.helpText && !hideLabel && (
        <p id={`${field.id}-help`} className="text-sm text-muted-foreground">
          {field.helpText}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}