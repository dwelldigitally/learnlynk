import React from 'react';
import { useCustomFields, CustomFieldStage, CustomField } from '@/hooks/useCustomFields';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface DynamicCustomFieldsProps {
  entityType: CustomFieldStage;
  values: Record<string, any>;
  onChange: (fieldName: string, value: any) => void;
  readOnly?: boolean;
  className?: string;
}

export function DynamicCustomFields({
  entityType,
  values,
  onChange,
  readOnly = false,
  className = '',
}: DynamicCustomFieldsProps) {
  const { fields, isLoading } = useCustomFields(entityType);

  // Filter to only enabled fields
  const enabledFields = fields.filter(f => f.is_enabled);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (enabledFields.length === 0) {
    return null;
  }

  const renderField = (field: CustomField) => {
    const value = values[field.field_name] ?? '';
    const fieldId = `custom-${field.field_name}`;

    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <Input
            id={fieldId}
            type={field.field_type === 'email' ? 'email' : field.field_type === 'url' ? 'url' : 'text'}
            value={value}
            onChange={(e) => onChange(field.field_name, e.target.value)}
            disabled={readOnly}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <Input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => onChange(field.field_name, e.target.value ? Number(e.target.value) : '')}
            disabled={readOnly}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
          />
        );

      case 'date':
        return (
          <Input
            id={fieldId}
            type="date"
            value={value}
            onChange={(e) => onChange(field.field_name, e.target.value)}
            disabled={readOnly}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={value}
            onChange={(e) => onChange(field.field_name, e.target.value)}
            disabled={readOnly}
            placeholder={`Enter ${field.field_label.toLowerCase()}`}
            rows={3}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={!!value}
              onCheckedChange={(checked) => onChange(field.field_name, checked)}
              disabled={readOnly}
            />
            <Label htmlFor={fieldId} className="text-sm font-normal">
              {field.field_label}
            </Label>
          </div>
        );

      case 'select':
        const options = field.field_options || [];
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => onChange(field.field_name, val)}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.field_label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt: any, idx: number) => (
                <SelectItem key={idx} value={typeof opt === 'string' ? opt : opt.value}>
                  {typeof opt === 'string' ? opt : opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi_select':
        const multiOptions = field.field_options || [];
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {selectedValues.map((v: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => {
                  if (!readOnly) {
                    onChange(field.field_name, selectedValues.filter((sv: string) => sv !== v));
                  }
                }}>
                  {v} ×
                </Badge>
              ))}
            </div>
            <Select
              value=""
              onValueChange={(val) => {
                if (!selectedValues.includes(val)) {
                  onChange(field.field_name, [...selectedValues, val]);
                }
              }}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Add ${field.field_label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {multiOptions
                  .filter((opt: any) => !selectedValues.includes(typeof opt === 'string' ? opt : opt.value))
                  .map((opt: any, idx: number) => (
                    <SelectItem key={idx} value={typeof opt === 'string' ? opt : opt.value}>
                      {typeof opt === 'string' ? opt : opt.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return (
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => onChange(field.field_name, e.target.value)}
            disabled={readOnly}
          />
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-sm font-medium text-muted-foreground">Custom Fields</h4>
        <Badge variant="outline" className="text-xs">{enabledFields.length}</Badge>
      </div>
      <div className="grid gap-4">
        {enabledFields.map((field) => (
          <div key={field.id} className="space-y-2">
            {field.field_type !== 'checkbox' && (
              <Label htmlFor={`custom-${field.field_name}`} className="flex items-center gap-1">
                {field.field_label}
                {field.is_required && <span className="text-destructive">*</span>}
              </Label>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Display-only version for detail pages
export function DynamicCustomFieldsDisplay({
  entityType,
  values,
  className = '',
}: {
  entityType: CustomFieldStage;
  values: Record<string, any>;
  className?: string;
}) {
  const { fields, isLoading } = useCustomFields(entityType);
  const enabledFields = fields.filter(f => f.is_enabled);

  if (isLoading || enabledFields.length === 0) {
    return null;
  }

  const hasAnyValue = enabledFields.some(f => {
    const val = values[f.field_name];
    return val !== undefined && val !== null && val !== '' && (!Array.isArray(val) || val.length > 0);
  });

  if (!hasAnyValue) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-muted-foreground">Custom Information</h4>
      <div className="grid gap-2">
        {enabledFields.map((field) => {
          const value = values[field.field_name];
          if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
            return null;
          }

          let displayValue: React.ReactNode = value;
          
          if (field.field_type === 'checkbox') {
            displayValue = value ? 'Yes' : 'No';
          } else if (field.field_type === 'multi_select' && Array.isArray(value)) {
            displayValue = (
              <div className="flex flex-wrap gap-1">
                {value.map((v: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{v}</Badge>
                ))}
              </div>
            );
          }

          return (
            <div key={field.id} className="flex justify-between items-start py-1 border-b border-border/50 last:border-0">
              <span className="text-sm text-muted-foreground">{field.field_label}</span>
              <span className="text-sm font-medium text-right max-w-[60%]">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
