import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomField {
  id: string;
  field_name: string;
  field_type: string;
  field_label: string;
  placeholder?: string;
  required: boolean;
  enabled: boolean;
  options?: any;
  validation_rules?: any;
  order_index: number;
  context_type: string;
}

export const CustomFieldsManagement = () => {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeContext, setActiveContext] = useState('program');
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomFields();
  }, [activeContext]);

  const fetchCustomFields = async () => {
    try {
      // TODO: Implement after database migration
      setFields([]);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = async () => {
    const newField = {
      field_name: `custom_field_${Date.now()}`,
      field_type: 'text',
      field_label: 'New Field',
      required: false,
      enabled: true,
      context_type: activeContext,
      order_index: fields.length
    };

    try {
      // TODO: Implement after database migration
      await fetchCustomFields();
      toast({
        title: "Success",
        description: "Custom field added successfully",
      });
    } catch (error) {
      console.error('Error adding field:', error);
      toast({
        title: "Error",
        description: "Failed to add custom field",
        variant: "destructive",
      });
    }
  };

  const contexts = [
    { value: 'program', label: 'Program Wizard' },
    { value: 'payment', label: 'Payment Forms' },
    { value: 'lead_source', label: 'Lead Capture' },
    { value: 'student', label: 'Student Forms' }
  ];

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'file', label: 'File Upload' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Custom Fields Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage custom fields for different contexts
          </p>
        </div>
        <Button onClick={handleAddField} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Field</span>
        </Button>
      </div>

      <Tabs value={activeContext} onValueChange={setActiveContext}>
        <TabsList className="grid w-full grid-cols-4">
          {contexts.map((context) => (
            <TabsTrigger key={context.value} value={context.value}>
              {context.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {contexts.map((context) => (
          <TabsContent key={context.value} value={context.value} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading fields...</div>
            ) : fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No custom fields configured for {context.label}
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field) => (
                  <Card key={field.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <div>
                            <CardTitle className="text-base">{field.field_label}</CardTitle>
                            <CardDescription className="text-sm">
                              {field.field_name} • {fieldTypes.find(t => t.value === field.field_type)?.label}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={field.enabled ? 'default' : 'secondary'}>
                            {field.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                          {field.required && <Badge variant="outline">Required</Badge>}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`label-${field.id}`}>Field Label</Label>
                          <Input
                            id={`label-${field.id}`}
                            value={field.field_label}
                            placeholder="Enter field label"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`type-${field.id}`}>Field Type</Label>
                          <Select value={field.field_type}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
                          <Input
                            id={`placeholder-${field.id}`}
                            value={field.placeholder || ''}
                            placeholder="Enter placeholder text"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`required-${field.id}`}
                            checked={field.required}
                          />
                          <Label htmlFor={`required-${field.id}`}>Required Field</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`enabled-${field.id}`}
                            checked={field.enabled}
                          />
                          <Label htmlFor={`enabled-${field.id}`}>Field Enabled</Label>
                        </div>
                      </div>
                      
                      {(field.field_type === 'select' || field.field_type === 'radio') && (
                        <div className="mt-4">
                          <Label>Options (one per line)</Label>
                          <Textarea
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            className="mt-1"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};