import React, { useState } from 'react';
import { PropertyTable } from './components/PropertyTable';
import { PropertyEditor } from './components/PropertyEditor';
import { SystemProperty, PropertyCategory } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useSystemProperties } from '@/hooks/useSystemProperties';
import { usePropertyUsage } from '@/hooks/usePropertyUsage';

export function DocumentPropertiesTab() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SystemProperty | undefined>();
  const [propertyToDelete, setPropertyToDelete] = useState<SystemProperty | undefined>();

  const category: PropertyCategory = 'document_type';
  const { properties, isLoading, createProperty, updateProperty, deleteProperty } = useSystemProperties(category);
  const { getUsageCount, isLoading: usageLoading } = usePropertyUsage(category);

  const handleSave = async (data: any) => {
    if (selectedProperty) {
      await updateProperty.mutateAsync({ id: selectedProperty.id, data });
    } else {
      await createProperty.mutateAsync({ category, data });
    }
    setEditorOpen(false);
    setSelectedProperty(undefined);
  };

  const handleEdit = (property: SystemProperty) => {
    setSelectedProperty(property);
    setEditorOpen(true);
  };

  const handleDelete = (property: SystemProperty) => {
    if (property.is_system) return;
    const usage = getUsageCount(property.property_key);
    if (usage > 0) return;
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      await deleteProperty.mutateAsync(propertyToDelete.id);
    }
    setDeleteDialogOpen(false);
    setPropertyToDelete(undefined);
  };

  const handleToggleActive = async (property: SystemProperty) => {
    await updateProperty.mutateAsync({ id: property.id, data: { is_active: !property.is_active } });
  };

  const handleAddNew = () => {
    setSelectedProperty(undefined);
    setEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Document Types</CardTitle>
              <CardDescription>
                Define document types for applications, enrollment, and student records
              </CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Document Type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading || usageLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <PropertyTable
              properties={properties}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              getUsageCount={getUsageCount}
            />
          )}
        </CardContent>
      </Card>

      <PropertyEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedProperty(undefined);
        }}
        onSave={handleSave}
        property={selectedProperty}
        title={selectedProperty ? 'Edit Document Type' : 'Add Document Type'}
        description={selectedProperty ? 'Update document type details' : 'Create a new document type'}
        isLoading={createProperty.isPending || updateProperty.isPending}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document Type?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{propertyToDelete?.property_label}"? This action cannot be undone.
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
