import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Columns2, Columns3, Columns4, Trash2, GripVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FormRow, FormFieldWithPosition } from '@/types/formLayout';
import { FieldConfigEditor } from './FieldConfigEditor';
import { FieldInsertButton } from './FieldInsertButton';
import { FormFieldType, FormField } from '@/types/formBuilder';
import { cn } from '@/lib/utils';

interface GridFormBuilderProps {
  rows: FormRow[];
  onRowAdd: (columns: number) => void;
  onRowDelete: (rowId: string) => void;
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldAdd: (fieldType: FormFieldType, rowId: string, columnIndex: number) => void;
}

const DropZone = ({ 
  rowId, 
  columnIndex, 
  onFieldAdd, 
  isEmpty = true 
}: { 
  rowId: string; 
  columnIndex: number; 
  onFieldAdd: (fieldType: FormFieldType, rowId: string, columnIndex: number) => void;
  isEmpty?: boolean;
}) => {
  return (
    <Droppable droppableId={`${rowId}-${columnIndex}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "min-h-24 border-2 border-dashed rounded-lg transition-all",
            snapshot.isDraggingOver 
              ? "border-primary bg-primary/5 border-solid" 
              : "border-muted-foreground/30 hover:border-primary/50",
            isEmpty ? "flex items-center justify-center" : "p-2"
          )}
        >
          {isEmpty && (
            <FieldInsertButton 
              onFieldAdd={(fieldType) => onFieldAdd(fieldType, rowId, columnIndex)}
              className="m-0"
            />
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export function GridFormBuilder({
  rows,
  onRowAdd,
  onRowDelete,
  onFieldUpdate,
  onFieldDelete,
  onFieldAdd
}: GridFormBuilderProps) {
  const getGridClasses = (columns: number) => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-2';
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Row Button */}
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background">
            <DropdownMenuItem onClick={() => onRowAdd(1)} className="cursor-pointer">
              <Columns2 className="h-4 w-4 mr-2 rotate-90" />
              1 Column
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRowAdd(2)} className="cursor-pointer">
              <Columns2 className="h-4 w-4 mr-2" />
              2 Columns
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRowAdd(3)} className="cursor-pointer">
              <Columns3 className="h-4 w-4 mr-2" />
              3 Columns
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRowAdd(4)} className="cursor-pointer">
              <Columns4 className="h-4 w-4 mr-2" />
              4 Columns
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Form Rows */}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <Card key={row.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <span className="text-sm font-medium">
                  Row {rowIndex + 1} ({row.columns} {row.columns === 1 ? 'column' : 'columns'})
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRowDelete(row.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className={cn("grid gap-4", getGridClasses(row.columns))}>
              {Array.from({ length: row.columns }).map((_, columnIndex) => {
                const field = row.fields[columnIndex];
                
                return (
                  <div key={`${row.id}-${columnIndex}`}>
                    {field ? (
                      <div className="transition-all">
                        <FieldConfigEditor
                          field={field}
                          onUpdate={(updates) => onFieldUpdate(field.id, updates)}
                          onRemove={() => onFieldDelete(field.id)}
                          availableFields={[]}
                          compact={true}
                        />
                      </div>
                    ) : (
                      <DropZone
                        rowId={row.id}
                        columnIndex={columnIndex}
                        onFieldAdd={onFieldAdd}
                        isEmpty={true}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {rows.length === 0 && (
        <Card className="p-12 text-center border-dashed">
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Columns2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">No rows added yet</h3>
              <p className="text-muted-foreground">Start by adding a row to create your form layout</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Row
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background">
                <DropdownMenuItem onClick={() => onRowAdd(1)} className="cursor-pointer">
                  <Columns2 className="h-4 w-4 mr-2 rotate-90" />
                  1 Column
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRowAdd(2)} className="cursor-pointer">
                  <Columns2 className="h-4 w-4 mr-2" />
                  2 Columns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRowAdd(3)} className="cursor-pointer">
                  <Columns3 className="h-4 w-4 mr-2" />
                  3 Columns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRowAdd(4)} className="cursor-pointer">
                  <Columns4 className="h-4 w-4 mr-2" />
                  4 Columns
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      )}
    </div>
  );
}