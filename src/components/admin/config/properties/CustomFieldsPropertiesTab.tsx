import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { useCustomFields, CustomField, CustomFieldStage, CustomFieldType } from '@/hooks/useCustomFields';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

const FIELD_TYPES: { value: CustomFieldType; label: string }[] = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Dropdown' },
  { value: 'multi_select', label: 'Multi-Select' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'url', label: 'URL' },
];

const STAGE_LABELS: Record<CustomFieldStage, string> = {
  lead: 'Lead Fields',
  applicant: 'Applicant Fields',
  student: 'Student Fields',
  program: 'Program Fields',
};

export function CustomFieldsPropertiesTab() {
  const [activeContext, setActiveContext] = useState<CustomFieldStage>('lead');
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<CustomField | undefined>();
  const [fieldToDelete, setFieldToDelete] = useState<CustomField | undefined>();
  const [optionsText, setOptionsText] = useState('');

  const { fields, isLoading, createField, updateField, deleteField, toggleEnabled } = useCustomFields(activeContext);

  const [formData, setFormData] = useState({
    field_name: '',
    field_label: '',
    field_type: 'text' as CustomFieldType,
    is_required: false,
    is_enabled: true,
  });

  const handleAddNew = () => {
    setSelectedField(undefined);
    setFormData({
      field_name: '',
      field_label: '',
      field_type: 'text',
      is_required: false,
      is_enabled: true,
    });
    setOptionsText('');
    setEditorOpen(true);
  };

  const handleEdit = (field: CustomField) => {
    setSelectedField(field);
    setFormData({
      field_name: field.field_name,
      field_label: field.field_label,
      field_type: field.field_type,
      is_required: field.is_required,
      is_enabled: field.is_enabled,
    });
    // Convert options array to newline-separated text
    if (field.field_options && Array.isArray(field.field_options)) {
      setOptionsText(field.field_options.join('\n'));
    } else {
      setOptionsText('');
    }
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.field_label || !formData.field_name) return;

    // Parse options from text
    const field_options = (formData.field_type === 'select' || formData.field_type === 'multi_select')
      ? optionsText.split('\n').map(o => o.trim()).filter(Boolean)
      : null;

    if (selectedField) {
      await updateField.mutateAsync({
        id: selectedField.id,
        data: {
          ...formData,
          field_options,
        },
      });
    } else {
      await createField.mutateAsync({
        stage: activeContext,
        ...formData,
        field_options: field_options || undefined,
      });
    }
    setEditorOpen(false);
  };

  const handleDelete = (field: CustomField) => {
    setFieldToDelete(field);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (fieldToDelete) {
      await deleteField.mutateAsync(fieldToDelete.id);
    }
    setDeleteDialogOpen(false);
    setFieldToDelete(undefined);
  };

  const handleToggleEnabled = async (field: CustomField) => {
    await toggleEnabled.mutateAsync({ id: field.id, is_enabled: !field.is_enabled });
  };

  const showOptions = formData.field_type === 'select' || formData.field_type === 'multi_select';

  return (
    <div className="space-y-6">
      <Tabs value={activeContext} onValueChange={(v) => setActiveContext(v as CustomFieldStage)}>
        <TabsList className="grid w-full grid-cols-4">
          {(Object.keys(STAGE_LABELS) as CustomFieldStage[]).map((stage) => (
            <TabsTrigger key={stage} value={stage}>{STAGE_LABELS[stage]}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeContext} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Fields - {STAGE_LABELS[activeContext].replace(' Fields', 's')}</CardTitle>
                  <CardDescription>
                    Add custom fields to capture additional information. These fields will appear in forms and detail pages.
                  </CardDescription>
                </div>
                <Button onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Label</TableHead>
                        <TableHead>Field Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Enabled</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No custom fields found. Click "Add Field" to create one.
                          </TableCell>
                        </TableRow>
                      ) : (
                        fields.map((field) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                            </TableCell>
                            <TableCell className="font-medium">{field.field_label}</TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">{field.field_name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{field.field_type}</Badge>
                            </TableCell>
                            <TableCell>
                              {field.is_required ? (
                                <Badge variant="destructive">Required</Badge>
                              ) : (
                                <Badge variant="outline">Optional</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={field.is_enabled}
                                onCheckedChange={() => handleToggleEnabled(field)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(field)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(field)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedField ? 'Edit Custom Field' : 'Add Custom Field'}</DialogTitle>
            <DialogDescription>
              {selectedField ? 'Update custom field details' : 'Create a new custom field for ' + activeContext + 's'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="field_label">Field Label *</Label>
              <Input
                id="field_label"
                value={formData.field_label}
                onChange={(e) => setFormData({ ...formData, field_label: e.target.value })}
                placeholder="e.g., Industry"
              />
            </div>

            <div>
              <Label htmlFor="field_name">Field Name *</Label>
              <Input
                id="field_name"
                value={formData.field_name}
                onChange={(e) => setFormData({ ...formData, field_name: e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') })}
                placeholder="e.g., industry"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lowercase with underscores only (auto-formatted)
              </p>
            </div>

            <div>
              <Label htmlFor="field_type">Field Type *</Label>
              <Select value={formData.field_type} onValueChange={(value) => setFormData({ ...formData, field_type: value as CustomFieldType })}>
                <SelectTrigger id="field_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showOptions && (
              <div>
                <Label htmlFor="options">Options (one per line) *</Label>
                <Textarea
                  id="options"
                  value={optionsText}
                  onChange={(e) => setOptionsText(e.target.value)}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each option on a new line
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required Field</Label>
              <Switch
                id="required"
                checked={formData.is_required}
                onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enabled</Label>
              <Switch
                id="enabled"
                checked={formData.is_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.field_label || !formData.field_name || createField.isPending || updateField.isPending}
            >
              {(createField.isPending || updateField.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {selectedField ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{fieldToDelete?.field_label}"? This will remove the field definition but existing data will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
