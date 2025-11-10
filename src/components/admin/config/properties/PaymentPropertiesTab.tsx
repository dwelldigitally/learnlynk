import React, { useState } from 'react';
import { PropertyTable } from './components/PropertyTable';
import { PropertyEditor } from './components/PropertyEditor';
import { SystemProperty } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

// Dummy data
const DUMMY_PAYMENT_METHODS: SystemProperty[] = [
  { id: '1', user_id: 'demo', category: 'payment_method', property_key: 'credit_card', property_label: 'Credit Card', color: '#3B82F6', icon: 'CreditCard', order_index: 1, is_active: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', user_id: 'demo', category: 'payment_method', property_key: 'bank_transfer', property_label: 'Bank Transfer', color: '#10B981', icon: 'Building2', order_index: 2, is_active: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', user_id: 'demo', category: 'payment_method', property_key: 'check', property_label: 'Check', color: '#8B5CF6', icon: 'FileCheck', order_index: 3, is_active: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', user_id: 'demo', category: 'payment_method', property_key: 'cash', property_label: 'Cash', color: '#F59E0B', icon: 'Wallet', order_index: 4, is_active: true, is_system: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export function PaymentPropertiesTab() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SystemProperty | undefined>();
  const [propertyToDelete, setPropertyToDelete] = useState<SystemProperty | undefined>();
  const [properties, setProperties] = useState(DUMMY_PAYMENT_METHODS);

  const handleSave = (data: any) => {
    if (selectedProperty) {
      const updated = { ...selectedProperty, ...data, updated_at: new Date().toISOString() };
      setProperties(properties.map(p => p.id === selectedProperty.id ? updated : p));
      toast.success('Payment method updated');
    } else {
      const newProp: SystemProperty = {
        id: Date.now().toString(),
        user_id: 'demo',
        category: 'payment_method',
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProperties([...properties, newProp]);
      toast.success('Payment method created');
    }
    setEditorOpen(false);
    setSelectedProperty(undefined);
  };

  const handleEdit = (property: SystemProperty) => {
    setSelectedProperty(property);
    setEditorOpen(true);
  };

  const handleDelete = (property: SystemProperty) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      setProperties(properties.filter(p => p.id !== propertyToDelete.id));
      toast.success('Payment method deleted');
      setDeleteDialogOpen(false);
      setPropertyToDelete(undefined);
    }
  };

  const handleToggleActive = (property: SystemProperty) => {
    const updated = { ...property, is_active: !property.is_active };
    setProperties(properties.map(p => p.id === property.id ? updated : p));
    toast.success('Payment method updated');
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
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Define payment methods: Credit Card, Bank Transfer, Check, Cash, etc.
              </CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PropertyTable
            properties={properties}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
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
        title={selectedProperty ? 'Edit Payment Method' : 'Add New Payment Method'}
        description={selectedProperty ? 'Update payment method details' : 'Create a new payment method'}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method?</AlertDialogTitle>
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
