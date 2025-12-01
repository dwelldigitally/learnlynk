import React, { useState, useEffect } from 'react';
import { PropertyTable } from './components/PropertyTable';
import { PropertyEditor } from './components/PropertyEditor';
import { SystemProperty } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { useDocumentTypes } from '@/hooks/useDocumentTemplates';
import { supabase } from '@/integrations/supabase/client';

export function DocumentPropertiesTab() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SystemProperty | undefined>();
  const [propertyToDelete, setPropertyToDelete] = useState<SystemProperty | undefined>();
  const [properties, setProperties] = useState<SystemProperty[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch document types from document_templates table
  const { types: documentTypes, isLoading: typesLoading } = useDocumentTypes();

  // Convert document types to SystemProperty format
  useEffect(() => {
    if (!typesLoading && documentTypes) {
      const mappedProperties: SystemProperty[] = documentTypes.map((type, index) => ({
        id: type.value,
        user_id: 'system',
        category: 'document_type',
        property_key: type.value,
        property_label: type.label,
        color: getTypeColor(type.value),
        icon: 'FileText',
        order_index: index + 1,
        is_active: true,
        is_system: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: `${type.count} templates of this type`
      }));
      setProperties(mappedProperties);
      setLoading(false);
    }
  }, [documentTypes, typesLoading]);

  // Get color based on type
  function getTypeColor(type: string): string {
    const colorMap: Record<string, string> = {
      'transcript': '#3B82F6',
      'identification': '#10B981',
      'certificate': '#F59E0B',
      'financial': '#8B5CF6',
      'academic': '#EC4899',
      'legal': '#6366F1',
      'medical': '#14B8A6',
      'personal': '#F97316',
      'professional': '#84CC16',
      'other': '#6B7280'
    };
    return colorMap[type.toLowerCase()] || '#6B7280';
  }

  const handleSave = async (data: any) => {
    try {
      if (selectedProperty) {
        // Update existing - for now just update local state
        // In production, this would update document_templates or a document_types table
        const updated = { ...selectedProperty, ...data, updated_at: new Date().toISOString() };
        setProperties(properties.map(p => p.id === selectedProperty.id ? updated : p));
        toast.success('Document type updated');
      } else {
        // Create new document type - would need a document_types table
        const newProp: SystemProperty = {
          id: `type-${Date.now()}`,
          user_id: 'system',
          category: 'document_type',
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProperties([...properties, newProp]);
        toast.success('Document type created');
      }
      setEditorOpen(false);
      setSelectedProperty(undefined);
    } catch (error) {
      console.error('Error saving document type:', error);
      toast.error('Failed to save document type');
    }
  };

  const handleEdit = (property: SystemProperty) => {
    setSelectedProperty(property);
    setEditorOpen(true);
  };

  const handleDelete = (property: SystemProperty) => {
    if (property.is_system) {
      toast.error('System document types cannot be deleted');
      return;
    }
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      setProperties(properties.filter(p => p.id !== propertyToDelete.id));
      toast.success('Document type deleted');
      setDeleteDialogOpen(false);
      setPropertyToDelete(undefined);
    }
  };

  const handleToggleActive = (property: SystemProperty) => {
    const updated = { ...property, is_active: !property.is_active };
    setProperties(properties.map(p => p.id === property.id ? updated : p));
    toast.success('Document type updated');
  };

  const handleAddNew = () => {
    setSelectedProperty(undefined);
    setEditorOpen(true);
  };

  if (loading || typesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Document Types</CardTitle>
              <CardDescription>
                Document types are automatically derived from your document templates. 
                Manage templates in Document Templates to add new types.
              </CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Document Type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No document types found.</p>
              <p className="text-sm mt-1">Create document templates to automatically generate types.</p>
            </div>
          ) : (
            <PropertyTable
              properties={properties}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
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
        title={selectedProperty ? 'Edit Document Type' : 'Add New Document Type'}
        description={selectedProperty ? 'Update document type details' : 'Create a new document type'}
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
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
