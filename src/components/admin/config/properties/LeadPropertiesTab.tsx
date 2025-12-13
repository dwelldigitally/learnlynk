import React, { useState } from 'react';
import { PropertyTable } from './components/PropertyTable';
import { PropertyEditor } from './components/PropertyEditor';
import { SystemProperty, PropertyCategory } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Plus, Info, Zap, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSystemProperties } from '@/hooks/useSystemProperties';
import { usePropertyUsage } from '@/hooks/usePropertyUsage';
import { 
  LEAD_PROPERTIES, 
  getLeadPropertyCategories, 
  getLeadPropertiesByCategory,
  LeadPropertyDefinition 
} from '@/config/leadProperties';

const LEAD_CATEGORIES: { key: PropertyCategory; label: string; description: string; buttonLabel: string }[] = [
  { key: 'lifecycle_stage', label: 'Lifecycle Stages', description: 'Define lifecycle stages shown as filter buttons: New Inquiry, Requirements Approved, etc.', buttonLabel: 'Add Stage' },
  { key: 'lead_source', label: 'Lead Sources', description: 'Define where leads come from: Web, Social Media, Referral, Events, etc.', buttonLabel: 'Add Source' },
  { key: 'lead_status', label: 'Lead Statuses', description: 'Define lead lifecycle stages: New, Contacted, Qualified, Converted, etc.', buttonLabel: 'Add Status' },
  { key: 'lead_priority', label: 'Lead Priorities', description: 'Define priority levels: Low, Medium, High, Urgent, etc.', buttonLabel: 'Add Priority' },
];

// Component to display all lead properties from central definition
function AllPropertiesView() {
  const categories = getLeadPropertyCategories();
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'number': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'date': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'boolean': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'array': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              All Lead Properties
            </CardTitle>
            <CardDescription>
              Complete list of {LEAD_PROPERTIES.length} lead properties available across the platform
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {LEAD_PROPERTIES.length} properties
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <Accordion type="multiple" defaultValue={categories} className="space-y-2">
            {categories.map((category) => {
              const props = getLeadPropertiesByCategory(category);
              return (
                <AccordionItem key={category} value={category} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{category}</span>
                      <Badge variant="secondary" className="text-xs">
                        {props.length} properties
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {props.map((prop: LeadPropertyDefinition) => (
                        <div 
                          key={prop.key} 
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{prop.label}</span>
                              {prop.isAutoCalculated && (
                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  Auto-calculated
                                </Badge>
                              )}
                              {prop.isSystem && (
                                <Badge variant="outline" className="text-xs">
                                  System
                                </Badge>
                              )}
                              {prop.visible && (
                                <Badge variant="default" className="text-xs">
                                  Default visible
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {prop.key}
                              </code>
                              {prop.description && (
                                <span className="text-xs text-muted-foreground">
                                  {prop.description}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getTypeColor(prop.type)}`}>
                              {prop.type}
                            </Badge>
                            {prop.aggregatable && (
                              <Badge variant="outline" className="text-xs">
                                Aggregatable
                              </Badge>
                            )}
                            {prop.sortable && (
                              <Badge variant="outline" className="text-xs">
                                Sortable
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>
        
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">About Lead Properties</p>
              <p>
                These properties are available throughout the platform including Lead Table columns, 
                Automation conditions, Report Builder fields, and Lead Routing Rules. 
                Properties marked as "Auto-calculated" are automatically updated by the system.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LeadPropertiesTab() {
  const [activeSubTab, setActiveSubTab] = useState<PropertyCategory | 'all_properties'>('all_properties');
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SystemProperty | undefined>();
  const [propertyToDelete, setPropertyToDelete] = useState<SystemProperty | undefined>();

  // Only fetch system properties when not on all_properties tab
  const categoryForHooks = activeSubTab === 'all_properties' ? 'lead_source' : activeSubTab;
  const { properties, isLoading, createProperty, updateProperty, deleteProperty } = useSystemProperties(categoryForHooks);
  const { getUsageCount, isLoading: usageLoading } = usePropertyUsage(categoryForHooks);

  const currentCategory = LEAD_CATEGORIES.find(c => c.key === activeSubTab);

  const handleSave = async (data: any) => {
    if (selectedProperty) {
      await updateProperty.mutateAsync({ id: selectedProperty.id, data });
    } else if (activeSubTab !== 'all_properties') {
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
      <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as PropertyCategory | 'all_properties')}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all_properties">All Properties</TabsTrigger>
          <TabsTrigger value="lifecycle_stage">Lifecycle Stages</TabsTrigger>
          <TabsTrigger value="lead_source">Lead Sources</TabsTrigger>
          <TabsTrigger value="lead_status">Lead Statuses</TabsTrigger>
          <TabsTrigger value="lead_priority">Lead Priorities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all_properties" className="space-y-4">
          <AllPropertiesView />
        </TabsContent>

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
