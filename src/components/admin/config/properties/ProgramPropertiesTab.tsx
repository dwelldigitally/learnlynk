import React, { useState } from 'react';
import { PropertyTable } from './components/PropertyTable';
import { PropertyEditor } from './components/PropertyEditor';
import { SystemProperty } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// Dummy data for demonstration
const DUMMY_PROGRAM_LEVELS: SystemProperty[] = [
  { id: '1', user_id: 'demo', category: 'program_level', property_key: 'certificate', property_label: 'Certificate', color: '#3B82F6', icon: 'Award', order_index: 1, is_active: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', user_id: 'demo', category: 'program_level', property_key: 'diploma', property_label: 'Diploma', color: '#8B5CF6', icon: 'GraduationCap', order_index: 2, is_active: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', user_id: 'demo', category: 'program_level', property_key: 'degree', property_label: 'Degree', color: '#EC4899', icon: 'BookOpen', order_index: 3, is_active: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const DUMMY_PROGRAM_CATEGORIES: SystemProperty[] = [
  { id: '4', user_id: 'demo', category: 'program_category', property_key: 'business', property_label: 'Business', color: '#10B981', icon: 'Briefcase', order_index: 1, is_active: true, is_system: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', user_id: 'demo', category: 'program_category', property_key: 'healthcare', property_label: 'Healthcare', color: '#F59E0B', icon: 'Heart', order_index: 2, is_active: true, is_system: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const DUMMY_DELIVERY_MODES: SystemProperty[] = [
  { id: '6', user_id: 'demo', category: 'delivery_mode', property_key: 'in_person', property_label: 'In-Person', color: '#06B6D4', icon: 'Users', order_index: 1, is_active: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '7', user_id: 'demo', category: 'delivery_mode', property_key: 'online', property_label: 'Online', color: '#F59E0B', icon: 'Monitor', order_index: 2, is_active: true, is_system: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '8', user_id: 'demo', category: 'delivery_mode', property_key: 'hybrid', property_label: 'Hybrid', color: '#8B5CF6', icon: 'Layers', order_index: 3, is_active: true, is_system: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export function ProgramPropertiesTab() {
  const [activeSubTab, setActiveSubTab] = useState('levels');
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SystemProperty | undefined>();
  const [propertyToDelete, setPropertyToDelete] = useState<SystemProperty | undefined>();
  
  // Use dummy data based on active tab
  const [programLevels, setProgramLevels] = useState(DUMMY_PROGRAM_LEVELS);
  const [programCategories, setProgramCategories] = useState(DUMMY_PROGRAM_CATEGORIES);
  const [deliveryModes, setDeliveryModes] = useState(DUMMY_DELIVERY_MODES);
  
  const properties = activeSubTab === 'levels' ? programLevels : 
                     activeSubTab === 'categories' ? programCategories : 
                     deliveryModes;

  const handleSave = (data: any) => {
    if (selectedProperty) {
      const updatedProperty = { ...selectedProperty, ...data, updated_at: new Date().toISOString() };
      if (activeSubTab === 'levels') {
        setProgramLevels(programLevels.map(p => p.id === selectedProperty.id ? updatedProperty : p));
      } else if (activeSubTab === 'categories') {
        setProgramCategories(programCategories.map(p => p.id === selectedProperty.id ? updatedProperty : p));
      } else {
        setDeliveryModes(deliveryModes.map(p => p.id === selectedProperty.id ? updatedProperty : p));
      }
      toast.success('Property updated successfully');
    } else {
      const newProperty: SystemProperty = {
        id: Date.now().toString(),
        user_id: 'demo',
        category: activeSubTab === 'levels' ? 'program_level' : activeSubTab === 'categories' ? 'program_category' : 'delivery_mode',
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (activeSubTab === 'levels') {
        setProgramLevels([...programLevels, newProperty]);
      } else if (activeSubTab === 'categories') {
        setProgramCategories([...programCategories, newProperty]);
      } else {
        setDeliveryModes([...deliveryModes, newProperty]);
      }
      toast.success('Property created successfully');
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
      if (activeSubTab === 'levels') {
        setProgramLevels(programLevels.filter(p => p.id !== propertyToDelete.id));
      } else if (activeSubTab === 'categories') {
        setProgramCategories(programCategories.filter(p => p.id !== propertyToDelete.id));
      } else {
        setDeliveryModes(deliveryModes.filter(p => p.id !== propertyToDelete.id));
      }
      toast.success('Property deleted successfully');
      setDeleteDialogOpen(false);
      setPropertyToDelete(undefined);
    }
  };

  const handleToggleActive = (property: SystemProperty) => {
    const updatedProperty = { ...property, is_active: !property.is_active };
    if (activeSubTab === 'levels') {
      setProgramLevels(programLevels.map(p => p.id === property.id ? updatedProperty : p));
    } else if (activeSubTab === 'categories') {
      setProgramCategories(programCategories.map(p => p.id === property.id ? updatedProperty : p));
    } else {
      setDeliveryModes(deliveryModes.map(p => p.id === property.id ? updatedProperty : p));
    }
    toast.success('Property updated successfully');
  };

  const handleAddNew = () => {
    setSelectedProperty(undefined);
    setEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="levels">Program Levels</TabsTrigger>
          <TabsTrigger value="categories">Program Categories</TabsTrigger>
          <TabsTrigger value="modes">Delivery Modes</TabsTrigger>
        </TabsList>

        <TabsContent value="levels" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Program Levels</CardTitle>
                  <CardDescription>
                    Define academic levels like Certificate, Diploma, Degree, etc.
                  </CardDescription>
                </div>
                <Button onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Level
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
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Program Categories</CardTitle>
                  <CardDescription>
                    Define program categories like Business, Healthcare, Technology, etc.
                  </CardDescription>
                </div>
                <Button onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
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
        </TabsContent>

        <TabsContent value="modes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Delivery Modes</CardTitle>
                  <CardDescription>
                    Define how programs are delivered: In-Person, Online, Hybrid, etc.
                  </CardDescription>
                </div>
                <Button onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Mode
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
        </TabsContent>
      </Tabs>

      <PropertyEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setSelectedProperty(undefined);
        }}
        onSave={handleSave}
        property={selectedProperty}
        title={selectedProperty ? 'Edit Property' : 'Add New Property'}
        description={selectedProperty ? 'Update property details' : 'Create a new property'}
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
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
