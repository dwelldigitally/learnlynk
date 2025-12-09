import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { 
  GripVertical, 
  Trash2, 
  Save, 
  Loader2,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';
import { 
  useComplianceReportConfigs, 
  ComplianceReportType, 
  ComplianceColumn,
  AVAILABLE_FIELDS,
  DEFAULT_COLUMNS
} from '@/hooks/useComplianceReportConfigs';
import { cn } from '@/lib/utils';
import { ComplianceReportService } from '@/services/complianceReportService';
import { useToast } from '@/hooks/use-toast';

interface ComplianceReportEditorProps {
  configId: string;
  reportType: ComplianceReportType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplianceReportEditor({
  configId,
  reportType,
  open,
  onOpenChange,
}: ComplianceReportEditorProps) {
  const { configs, updateConfig, deleteConfig } = useComplianceReportConfigs(reportType);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const config = configs.find(c => c.id === configId);
  
  const [name, setName] = useState('');
  const [columns, setColumns] = useState<ComplianceColumn[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (config) {
      setName(config.name);
      setColumns(config.columns);
    }
  }, [config]);

  const availableFields = AVAILABLE_FIELDS[reportType].filter(
    f => !columns.find(c => c.field === f.field)
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setColumns(updatedItems);
  };

  const handleAddColumn = (field: string) => {
    const fieldInfo = AVAILABLE_FIELDS[reportType].find(f => f.field === field);
    if (!fieldInfo) return;

    setColumns([
      ...columns,
      {
        field: fieldInfo.field,
        label: fieldInfo.label,
        order: columns.length,
        visible: true,
      },
    ]);
  };

  const handleRemoveColumn = (field: string) => {
    setColumns(columns.filter(c => c.field !== field));
  };

  const handleToggleVisibility = (field: string) => {
    setColumns(columns.map(c => 
      c.field === field ? { ...c, visible: !c.visible } : c
    ));
  };

  const handleUpdateLabel = (field: string, label: string) => {
    setColumns(columns.map(c => 
      c.field === field ? { ...c, label } : c
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig.mutateAsync({
        id: configId,
        name,
        columns,
      });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;
    
    setIsDeleting(true);
    try {
      await deleteConfig.mutateAsync(configId);
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetToDefault = () => {
    setColumns(DEFAULT_COLUMNS[reportType]);
  };

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    try {
      switch (reportType) {
        case 'ptiru_student':
          await ComplianceReportService.generatePTIRUStudentReport();
          break;
        case 'ptiru_program':
          await ComplianceReportService.generatePTIRUProgramReport();
          break;
        case 'dqab_institutional':
          await ComplianceReportService.generateDQABInstitutionalReport();
          break;
        case 'dqab_compliance':
          await ComplianceReportService.generateDQABComplianceReport();
          break;
      }
      toast({
        title: 'Report Generated',
        description: 'Preview report has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate preview.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Configure Report Columns</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-hidden">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="config-name">Configuration Name</Label>
            <Input
              id="config-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter configuration name"
            />
          </div>

          {/* Add Column Select */}
          <div className="flex items-center gap-2">
            <Select onValueChange={handleAddColumn}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Add a column..." />
              </SelectTrigger>
              <SelectContent>
                {availableFields.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    All available columns added
                  </div>
                ) : (
                  availableFields.map((field) => (
                    <SelectItem key={field.field} value={field.field}>
                      {field.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleResetToDefault}>
              Reset to Default
            </Button>
          </div>

          {/* Column List */}
          <div className="space-y-2">
            <Label>Columns (drag to reorder)</Label>
            <ScrollArea className="h-[300px] border rounded-lg p-2">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="columns">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {columns.map((column, index) => (
                        <Draggable
                          key={column.field}
                          draggableId={column.field}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border bg-card",
                                snapshot.isDragging && "shadow-lg",
                                !column.visible && "opacity-50"
                              )}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <Input
                                  value={column.label}
                                  onChange={(e) => handleUpdateLabel(column.field, e.target.value)}
                                  className="h-8"
                                />
                              </div>

                              <Badge variant="outline" className="text-xs shrink-0">
                                {column.field}
                              </Badge>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleToggleVisibility(column.field)}
                              >
                                {column.visible ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveColumn(column.field)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {columns.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No columns configured. Add columns using the dropdown above.
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{columns.length} total columns</span>
            <span>•</span>
            <span>{columns.filter(c => c.visible).length} visible</span>
            <span>•</span>
            <span>{columns.filter(c => !c.visible).length} hidden</span>
          </div>
        </div>

        <DialogFooter className="flex justify-between gap-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleGeneratePreview}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Preview Report
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
