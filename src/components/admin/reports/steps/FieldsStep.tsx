import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DATA_SOURCES, DataSource, FieldDefinition } from '@/types/reports';
import { cn } from '@/lib/utils';
import { Hash, Type, Calendar, ToggleLeft } from 'lucide-react';

interface FieldsStepProps {
  dataSource: DataSource;
  selectedFields: string[];
  onFieldsChange: (fields: string[]) => void;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  string: Type,
  number: Hash,
  date: Calendar,
  boolean: ToggleLeft,
};

const CATEGORY_COLORS: Record<string, string> = {
  dimension: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  measure: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  date: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function FieldsStep({ dataSource, selectedFields, onFieldsChange }: FieldsStepProps) {
  const source = DATA_SOURCES.find(s => s.id === dataSource);
  const fields = source?.fields || [];

  const toggleField = (fieldName: string) => {
    if (selectedFields.includes(fieldName)) {
      onFieldsChange(selectedFields.filter(f => f !== fieldName));
    } else {
      onFieldsChange([...selectedFields, fieldName]);
    }
  };

  const selectAll = () => {
    onFieldsChange(fields.map(f => f.name));
  };

  const clearAll = () => {
    onFieldsChange([]);
  };

  const groupedFields = fields.reduce((acc, field) => {
    const category = field.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {} as Record<string, FieldDefinition[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Select Fields</h3>
          <p className="text-sm text-muted-foreground">
            Choose the columns to include in your report
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-sm text-primary hover:underline"
          >
            Select All
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={clearAll}
            className="text-sm text-primary hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {Object.entries(groupedFields).map(([category, categoryFields]) => (
          <Card key={category} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className={cn('capitalize', CATEGORY_COLORS[category])}>
                {category === 'dimension' ? 'Dimensions' : category === 'measure' ? 'Measures' : 'Dates'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {category === 'dimension' && 'Group and categorize data'}
                {category === 'measure' && 'Numeric values for calculations'}
                {category === 'date' && 'Time-based analysis'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {categoryFields.map((field) => {
                const Icon = TYPE_ICONS[field.type] || Type;
                const isSelected = selectedFields.includes(field.name);

                return (
                  <div
                    key={field.name}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors',
                      isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                    )}
                    onClick={() => toggleField(field.name)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleField(field.name)}
                    />
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm truncate">{field.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">{selectedFields.length}</span> fields selected
          {selectedFields.length > 0 && (
            <span className="text-muted-foreground ml-2">
              ({selectedFields.slice(0, 3).join(', ')}
              {selectedFields.length > 3 && `, +${selectedFields.length - 3} more`})
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
