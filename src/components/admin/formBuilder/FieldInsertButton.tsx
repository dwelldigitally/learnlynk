import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Type, Mail, Phone, Calendar, FileText, ToggleLeft, Palette, Upload, Link, Hash, CheckSquare, Circle, List, Sliders } from 'lucide-react';
import { FormFieldType } from '@/types/formBuilder';
import { cn } from '@/lib/utils';

interface FieldInsertButtonProps {
  onFieldAdd: (fieldType: FormFieldType) => void;
  className?: string;
}

const fieldTypes = [
  { type: 'text' as FormFieldType, label: 'Text Input', icon: Type },
  { type: 'email' as FormFieldType, label: 'Email', icon: Mail },
  { type: 'tel' as FormFieldType, label: 'Phone', icon: Phone },
  { type: 'number' as FormFieldType, label: 'Number', icon: Hash },
  { type: 'textarea' as FormFieldType, label: 'Textarea', icon: FileText },
  { type: 'select' as FormFieldType, label: 'Dropdown', icon: List },
  { type: 'radio' as FormFieldType, label: 'Radio Buttons', icon: Circle },
  { type: 'checkbox' as FormFieldType, label: 'Checkbox', icon: CheckSquare },
  { type: 'multi-select' as FormFieldType, label: 'Multi-Select', icon: CheckSquare },
  { type: 'date' as FormFieldType, label: 'Date Picker', icon: Calendar },
  { type: 'range' as FormFieldType, label: 'Range Slider', icon: Sliders },
  { type: 'switch' as FormFieldType, label: 'Switch', icon: ToggleLeft },
  { type: 'file' as FormFieldType, label: 'File Upload', icon: Upload },
  { type: 'url' as FormFieldType, label: 'URL', icon: Link },
  { type: 'color' as FormFieldType, label: 'Color Picker', icon: Palette },
];

export function FieldInsertButton({ onFieldAdd, className }: FieldInsertButtonProps) {
  const [open, setOpen] = useState(false);

  const handleFieldSelect = (fieldType: FormFieldType) => {
    onFieldAdd(fieldType);
    setOpen(false);
  };

  return (
    <div className={cn("flex justify-center py-2", className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 rounded-full p-0 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background">
          {fieldTypes.map((field) => (
            <DropdownMenuItem
              key={field.type}
              onClick={() => handleFieldSelect(field.type)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <field.icon className="h-4 w-4" />
              <span>{field.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}