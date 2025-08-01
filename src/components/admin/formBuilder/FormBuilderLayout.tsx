import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  Eye,
  Settings,
  GripVertical,
  Type,
  Mail,
  Phone,
  Calendar,
  FileText,
  ToggleLeft,
  Palette,
  Upload,
  Link,
  Hash,
  CheckSquare,
  Circle,
  List,
  Sliders
} from 'lucide-react';
import { FormConfig, FormField, FormFieldType } from '@/types/formBuilder';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface FormBuilderLayoutProps {
  forms: FormConfig[];
  selectedFormId?: string;
  onFormSelect: (formId: string) => void;
  onFormCreate: () => void;
  onFormDelete: (formId: string) => void;
  onFormDuplicate: (formId: string) => void;
  onFieldAdd: (fieldType: FormFieldType, insertIndex?: number) => void;
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  onFieldDelete: (fieldId: string) => void;
  children: React.ReactNode;
}

const fieldTypes = [
  { type: 'text' as FormFieldType, label: 'Text Input', icon: Type, color: 'bg-blue-500' },
  { type: 'email' as FormFieldType, label: 'Email', icon: Mail, color: 'bg-green-500' },
  { type: 'tel' as FormFieldType, label: 'Phone', icon: Phone, color: 'bg-purple-500' },
  { type: 'number' as FormFieldType, label: 'Number', icon: Hash, color: 'bg-orange-500' },
  { type: 'textarea' as FormFieldType, label: 'Textarea', icon: FileText, color: 'bg-indigo-500' },
  { type: 'select' as FormFieldType, label: 'Dropdown', icon: List, color: 'bg-pink-500' },
  { type: 'radio' as FormFieldType, label: 'Radio Buttons', icon: Circle, color: 'bg-red-500' },
  { type: 'checkbox' as FormFieldType, label: 'Checkbox', icon: CheckSquare, color: 'bg-yellow-500' },
  { type: 'multi-select' as FormFieldType, label: 'Multi-Select', icon: CheckSquare, color: 'bg-cyan-500' },
  { type: 'date' as FormFieldType, label: 'Date Picker', icon: Calendar, color: 'bg-emerald-500' },
  { type: 'range' as FormFieldType, label: 'Range Slider', icon: Sliders, color: 'bg-violet-500' },
  { type: 'switch' as FormFieldType, label: 'Switch', icon: ToggleLeft, color: 'bg-teal-500' },
  { type: 'file' as FormFieldType, label: 'File Upload', icon: Upload, color: 'bg-rose-500' },
  { type: 'url' as FormFieldType, label: 'URL', icon: Link, color: 'bg-amber-500' },
  { type: 'color' as FormFieldType, label: 'Color Picker', icon: Palette, color: 'bg-fuchsia-500' },
];

export function FormBuilderLayout({
  forms,
  selectedFormId,
  onFormSelect,
  onFormCreate,
  onFormDelete,
  onFormDuplicate,
  onFieldAdd,
  onFieldUpdate,
  onFieldDelete,
  children
}: FormBuilderLayoutProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedForm = forms.find(f => f.id === selectedFormId);
  
  const filteredFieldTypes = fieldTypes.filter(field =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // Adding field from palette to form
    if (source.droppableId === 'field-palette' && destination.droppableId === 'form-fields') {
      const fieldType = fieldTypes[source.index];
      onFieldAdd(fieldType.type);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-[calc(100vh-120px)] gap-4">
        {/* Forms Sidebar */}
        <div className="w-80 space-y-4">
          {/* Forms List */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Forms</CardTitle>
                <Button size="sm" onClick={onFormCreate}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Form
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                <div className="space-y-1 p-3">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedFormId === form.id 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => onFormSelect(form.id!)}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{form.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {form.fields.length} fields
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFormDuplicate(form.id!);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFormDelete(form.id!);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Field Palette */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Field Types</CardTitle>
              <Input
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <Droppable droppableId="field-palette">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 p-3"
                    >
                      {filteredFieldTypes.map((field, index) => (
                        <Draggable
                          key={field.type}
                          draggableId={field.type}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-move transition-all ${
                                snapshot.isDragging
                                  ? 'shadow-lg bg-background border-primary'
                                  : 'hover:border-primary/50 hover:shadow-md'
                              }`}
                              onClick={() => onFieldAdd(field.type)}
                            >
                              <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${field.color}`}>
                                <field.icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{field.label}</p>
                              </div>
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {selectedForm ? (
            <Tabs defaultValue="builder" className="h-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="builder">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Builder
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedForm.fields.length} fields
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Embed Code
                  </Button>
                </div>
              </div>

              <TabsContent value="builder" className="mt-4 flex-1 overflow-auto">
                {children}
              </TabsContent>
              
              <TabsContent value="preview" className="mt-4 flex-1 overflow-auto">
                <Card className="min-h-full">
                  <CardContent className="p-6">
                    <div className="max-w-md mx-auto">
                      {/* Form preview would go here */}
                      <div className="text-center text-muted-foreground">
                        Form preview will be rendered here
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4 flex-1 overflow-auto">
                <Card className="min-h-full">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Form Title</label>
                        <Input value={selectedForm.title} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Input value={selectedForm.description} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Submit Button Text</label>
                        <Input value={selectedForm.submitButtonText} className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="min-h-full flex items-center justify-center">
              <CardContent className="text-center">
                <h3 className="text-lg font-medium mb-2">No Form Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a form from the sidebar or create a new one to get started.
                </p>
                <Button onClick={onFormCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}