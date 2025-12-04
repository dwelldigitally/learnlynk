import React, { useState } from 'react';
import { PropertyTable } from './components/PropertyTable';
import { PropertyEditor } from './components/PropertyEditor';
import { SystemProperty, PropertyCategory } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const LEAD_CATEGORIES: { key: PropertyCategory; label: string; description: string; buttonLabel: string }[] = [
  { key: 'lead_source', label: 'Lead Sources', description: 'Define where leads come from: Web, Social Media, Referral, Events, etc.', buttonLabel: 'Add Source' },
  { key: 'lead_status', label: 'Lead Statuses', description: 'Define lead lifecycle stages: New, Contacted, Qualified, Converted, etc.', buttonLabel: 'Add Status' },
  { key: 'lead_priority', label: 'Lead Priorities', description: 'Define priority levels: Low, Medium, High, Urgent, etc.', buttonLabel: 'Add Priority' },
];

export function LeadPropertiesTab() {
  const [activeSubTab, setActiveSubTab] = useState<PropertyCategory>('lead_source');
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SystemProperty | undefined>();
  const [propertyToDelete, setPropertyToDelete] = useState<SystemProperty | undefined>();

  const { properties, isLoading, createProperty, updateProperty, deleteProperty } = useSystemProperties(activeSubTab);
  const { getUsageCount, isLoading: usageLoading } = usePropertyUsage(activeSubTab);

  const currentCategory = LEAD_CATEGORIES.find(c => c.key === activeSubTab);

  const handleSave = async (data: any) => {
    if (selectedProperty) {
      await updateProperty.mutateAsync({ id: selectedProperty.id, data });
    } else {
      await createProperty.mutateAsync({ category: activeSubTab, data });
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
    if (usage > 0) return; // Prevent deletion if in use
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
      <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as PropertyCategory)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lead_source">Lead Sources</TabsTrigger>
          <TabsTrigger value="lead_status">Lead Statuses</TabsTrigger>
          <TabsTrigger value="lead_priority">Lead Priorities</TabsTrigger>
        </TabsList>

        {LEAD_CATEGORIES.map((cat) => (
          <TabsContent key={cat.key} value={cat.key} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{cat.label}</CardTitle>
                    <CardDescription>{cat.description}</CardDescription>
                  </div>
                  <Button onClick={handleAddNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    {cat.buttonLabel}
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
          </TabsContent>
        ))}
      </Tabs>

      <PropertyEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedProperty(undefined);
        }}
        onSave={handleSave}
        property={selectedProperty}
        title={selectedProperty ? `Edit ${currentCategory?.label.replace(/s$/, '')}` : `Add ${currentCategory?.buttonLabel?.replace('Add ', '')}`}
        description={selectedProperty ? 'Update property details' : 'Create a new property'}
        isLoading={createProperty.isPending || updateProperty.isPending}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property?</AlertDialogTitle>
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
