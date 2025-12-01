import React from 'react';
import { GripVertical, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormField, FormFieldType } from '@/types/formBuilder';
import { cn } from '@/lib/utils';

interface CompactFieldCardProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

const fieldTypeLabels: Record<FormFieldType, string> = {
  'text': 'Text',
  'email': 'Email',
  'tel': 'Phone',
  'number': 'Number',
  'textarea': 'Textarea',
  'select': 'Dropdown',
  'radio': 'Radio',
  'checkbox': 'Checkbox',
  'multi-select': 'Multi-Select',
  'intake-date': 'Intake Date',
  'switch': 'Switch',
  'file': 'File',
  'url': 'URL',
  'consent': 'Consent',
  'program-list': 'Program List',
};

export function CompactFieldCard({ 
  field, 
  isSelected, 
  onSelect, 
  onDelete,
  isDragging = false 
}: CompactFieldCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
        "hover:border-primary/50 hover:bg-muted/30",
        isSelected 
          ? "border-primary bg-primary/5 shadow-sm" 
          : "border-border bg-background",
        isDragging && "opacity-50 rotate-2",
        !field.enabled && "opacity-60"
      )}
    >
      {/* Drag Handle */}
      <div className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Field Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-medium text-sm truncate",
            !field.enabled && "text-muted-foreground"
          )}>
            {field.label || 'Untitled Field'}
          </span>
          {field.required && (
            <AlertCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {fieldTypeLabels[field.type]}
          </Badge>
          {!field.enabled && (
            <Badge variant="outline" className="text-xs">
              Disabled
            </Badge>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
