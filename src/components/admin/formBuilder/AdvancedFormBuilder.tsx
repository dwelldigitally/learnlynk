import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FormField, FormFieldType, FormConfig, EmailNotificationConfig } from '@/types/formBuilder';
import { FormRow } from '@/types/formLayout';
import { CompactFieldCard } from './CompactFieldCard';
import { FieldConfigPanel } from './FieldConfigPanel';
import { GridFormBuilder } from './GridFormBuilder';
import { DynamicFormRenderer } from '@/components/forms/DynamicFormRenderer';
import { EnhancedEmailNotifications } from './EnhancedEmailNotifications';
import { useForm, useCreateForm, useUpdateForm } from '@/hooks/useForms';
import { usePrograms } from '@/hooks/usePrograms';
import { v4 as uuidv4 } from 'uuid';
interface AdvancedFormBuilderProps {
  formId?: string | null;
  formTitle?: string;
  onFormTitleChange?: (title: string) => void;
  onSave?: (formConfig: FormConfig) => void;
  onCancel?: () => void;
}
const fieldTypes = [{
  type: 'text' as FormFieldType,
  label: 'Text Input',
  icon: Icons.Type,
  color: 'bg-blue-500'
}, {
  type: 'email' as FormFieldType,
  label: 'Email',
  icon: Icons.Mail,
  color: 'bg-green-500'
}, {
  type: 'tel' as FormFieldType,
  label: 'Phone',
  icon: Icons.Phone,
  color: 'bg-purple-500'
}, {
  type: 'number' as FormFieldType,
  label: 'Number',
  icon: Icons.Hash,
  color: 'bg-orange-500'
}, {
  type: 'textarea' as FormFieldType,
  label: 'Textarea',
  icon: Icons.FileText,
  color: 'bg-indigo-500'
}, {
  type: 'select' as FormFieldType,
  label: 'Dropdown',
  icon: Icons.List,
  color: 'bg-pink-500'
}, {
  type: 'radio' as FormFieldType,
  label: 'Radio Buttons',
  icon: Icons.Circle,
  color: 'bg-red-500'
}, {
  type: 'checkbox' as FormFieldType,
  label: 'Checkbox',
  icon: Icons.CheckSquare,
  color: 'bg-yellow-500'
}, {
  type: 'multi-select' as FormFieldType,
  label: 'Multi-Select',
  icon: Icons.CheckSquare,
  color: 'bg-cyan-500'
}, {
  type: 'intake-date' as FormFieldType,
  label: 'Intake Date',
  icon: Icons.Calendar,
  color: 'bg-emerald-500'
}, {
  type: 'switch' as FormFieldType,
  label: 'Switch',
  icon: Icons.ToggleLeft,
  color: 'bg-teal-500'
}, {
  type: 'file' as FormFieldType,
  label: 'File Upload',
  icon: Icons.Upload,
  color: 'bg-rose-500'
}, {
  type: 'url' as FormFieldType,
  label: 'URL',
  icon: Icons.Link,
  color: 'bg-amber-500'
}, {
  type: 'program-list' as FormFieldType,
  label: 'Program List',
  icon: Icons.List,
  color: 'bg-lime-500'
}];
export function AdvancedFormBuilder({
  formId,
  formTitle: externalFormTitle,
  onFormTitleChange,
  onSave,
  onCancel
}: AdvancedFormBuilderProps) {
  const navigate = useNavigate();
  const {
    data: existingForm,
    isLoading
  } = useForm(formId || null);
  const {
    data: programs = []
  } = usePrograms();
  const createFormMutation = useCreateForm();
  const updateFormMutation = useUpdateForm();

  // Form state
  const [internalFormTitle, setInternalFormTitle] = useState('Untitled Form');
  const formTitle = externalFormTitle ?? internalFormTitle;
  const setFormTitle = (title: string) => {
    setInternalFormTitle(title);
    onFormTitleChange?.(title);
  };
  const [formDescription, setFormDescription] = useState('');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');
  const [fields, setFields] = useState<FormField[]>([]);
  const [rows, setRows] = useState<FormRow[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const [successMessage, setSuccessMessage] = useState('Thank you! Your submission has been received.');
  const [errorMessage, setErrorMessage] = useState('Sorry, there was an error submitting your form. Please try again.');
  const [privacyText, setPrivacyText] = useState('');
  const [multiStep, setMultiStep] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [theme, setTheme] = useState<'default' | 'modern' | 'minimal'>('default');
  const [emailNotifications, setEmailNotifications] = useState<EmailNotificationConfig>({
    enabled: false,
    recipients: [],
    template: {
      id: 'default',
      name: 'Default Template',
      subject: 'New Form Submission',
      body: 'You have received a new form submission.',
      variables: []
    },
    deliveryTiming: 'immediate',
    attachments: false,
    format: 'html'
  });

  // Load existing form data
  useEffect(() => {
    if (existingForm) {
      setFormTitle(existingForm.config.title || 'Untitled Form');
      setFormDescription(existingForm.config.description || '');
      setLayoutMode(existingForm.config.layoutMode || 'list');
      setFields(existingForm.config.fields || []);
      setRows(existingForm.config.rows || []);
      setSubmitButtonText(existingForm.config.submitButtonText || 'Submit');
      setSuccessMessage(existingForm.config.successMessage || '');
      setErrorMessage(existingForm.config.errorMessage || '');
      setPrivacyText(existingForm.config.privacyText || '');
      setMultiStep(existingForm.config.multiStep || false);
      setShowProgress(existingForm.config.showProgress || false);
      setTheme(existingForm.config.theme || 'default');
      if (existingForm.config.emailNotifications) {
        setEmailNotifications(existingForm.config.emailNotifications);
      }
    }
  }, [existingForm]);

  // Sync fields between list and grid modes
  useEffect(() => {
    if (layoutMode === 'list') {
      // Sync grid fields to list
      const gridFields = rows.flatMap(row => row.fields.filter((f): f is FormField => f !== null));
      if (gridFields.length > 0 && fields.length === 0) {
        setFields(gridFields);
      }
    } else {
      // Sync list fields to grid
      if (fields.length > 0 && rows.length === 0) {
        const newRow: FormRow = {
          id: uuidv4(),
          columns: Math.min(fields.length, 3),
          fields: fields
        };
        setRows([newRow]);
      }
    }
  }, [layoutMode]);

  // Field management
  const handleFieldAdd = (fieldType: FormFieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      label: `New ${fieldType} Field`,
      type: fieldType,
      required: false,
      enabled: true,
      placeholder: '',
      helpText: ''
    };

    // Add to list mode
    setFields(prev => [...prev, newField]);

    // Also sync to grid mode if there are existing rows
    if (rows.length > 0) {
      setRows(prev => prev.map((row, index) => {
        if (index === prev.length - 1) {
          // Add to the last row if there's space
          const emptyIndex = row.fields.findIndex(f => f === null);
          if (emptyIndex !== -1) {
            const newFields = [...row.fields];
            newFields[emptyIndex] = newField;
            return {
              ...row,
              fields: newFields
            };
          }
        }
        return row;
      }));
    }
    setSelectedFieldId(newField.id);
  };
  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    // Update in list mode
    setFields(prev => prev.map(f => f.id === fieldId ? {
      ...f,
      ...updates
    } : f));

    // Update in grid mode
    setRows(prev => prev.map(row => ({
      ...row,
      fields: row.fields.map(f => f && f.id === fieldId ? {
        ...f,
        ...updates
      } : f)
    })));
  };
  const handleFieldDelete = (fieldId: string) => {
    // Delete from list mode
    setFields(prev => prev.filter(f => f.id !== fieldId));

    // Delete from grid mode
    setRows(prev => prev.map(row => ({
      ...row,
      fields: row.fields.map(f => f && f.id === fieldId ? null : f)
    })));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  // Grid mode handlers
  const handleRowAdd = (columns: number) => {
    const newRow: FormRow = {
      id: uuidv4(),
      fields: Array(columns).fill(null),
      columns
    };
    setRows([...rows, newRow]);
  };
  const handleRowDelete = (rowId: string) => {
    setRows(rows.filter(row => row.id !== rowId));
  };
  const handleFieldAddToGrid = (fieldType: FormFieldType, rowId: string, columnIndex: number) => {
    const newField: FormField = {
      id: uuidv4(),
      label: `New ${fieldType} Field`,
      type: fieldType,
      required: false,
      enabled: true,
      placeholder: '',
      helpText: ''
    };

    // Add to grid mode
    setRows(rows.map(row => {
      if (row.id === rowId) {
        const newFields = [...row.fields];
        newFields[columnIndex] = newField;
        return {
          ...row,
          fields: newFields
        };
      }
      return row;
    }));

    // Also add to list mode
    setFields(prev => [...prev, newField]);
    setSelectedFieldId(newField.id);
  };

  // Drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const {
      source,
      destination
    } = result;
    if (source.droppableId === 'field-types') {
      const fieldType = fieldTypes[source.index].type;
      if (destination.droppableId === 'fields-list') {
        handleFieldAdd(fieldType);
      } else if (destination.droppableId.includes('-')) {
        const lastDashIndex = destination.droppableId.lastIndexOf('-');
        const rowId = destination.droppableId.substring(0, lastDashIndex);
        const columnIndex = parseInt(destination.droppableId.substring(lastDashIndex + 1));
        if (rowId && !isNaN(columnIndex)) {
          handleFieldAddToGrid(fieldType, rowId, columnIndex);
        }
      }
    }
    if (source.droppableId === 'fields-list' && destination.droppableId === 'fields-list') {
      const newFields = Array.from(fields);
      const [removed] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, removed);
      setFields(newFields);
    }
  };

  // Save form
  const handleSave = async () => {
    const allFields = layoutMode === 'grid' ? rows.flatMap(row => row.fields).filter(Boolean) as FormField[] : fields;
    const formConfig: FormConfig = {
      title: formTitle,
      description: formDescription,
      fields: allFields,
      layoutMode,
      rows: layoutMode === 'grid' ? rows : undefined,
      submitButtonText,
      successMessage,
      errorMessage,
      privacyText,
      multiStep,
      showProgress,
      theme,
      emailNotifications
    };
    try {
      if (formId) {
        await updateFormMutation.mutateAsync({
          id: formId,
          updates: {
            name: formTitle,
            description: formDescription,
            config: formConfig
          }
        });
        toast.success('Form updated successfully');
      } else {
        await createFormMutation.mutateAsync({
          name: formTitle,
          description: formDescription,
          config: formConfig,
          status: 'draft'
        });
        toast.success('Form created successfully');
      }
      if (onSave) {
        onSave(formConfig);
      } else {
        navigate('/admin/leads/forms');
      }
    } catch (error: any) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form: ' + error.message);
    }
  };
  const selectedField = layoutMode === 'grid' ? rows.flatMap(r => r.fields).find(f => f?.id === selectedFieldId) : fields.find(f => f.id === selectedFieldId);
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>;
  }
  return <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-sm">
          {fields.length + rows.flatMap(r => r.fields.filter(Boolean)).length} fields
        </Badge>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel || (() => navigate('/admin/leads/forms'))}>
            <Icons.X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Icons.Save className="h-4 w-4 mr-2" />
            {formId ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex h-[calc(100vh-12rem)] gap-0">
          {/* Left Sidebar - Field Types */}
          <div className="w-64 border-r bg-muted/30 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Field Types</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Drag fields to the canvas
              </p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <Droppable droppableId="field-types">
                {provided => <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {fieldTypes.map((fieldType, index) => <Draggable key={fieldType.type} draggableId={`field-type-${fieldType.type}`} index={index}>
                        {(provided, snapshot) => <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all", snapshot.isDragging ? "bg-primary/10 border-primary shadow-lg" : "bg-background hover:bg-muted/50")}>
                            <div className={cn("p-2 rounded-md", fieldType.color)}>
                              <fieldType.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium">
                              {fieldType.label}
                            </span>
                          </div>}
                      </Draggable>)}
                    {provided.placeholder}
                  </div>}
              </Droppable>
            </ScrollArea>
          </div>

          {/* Center Panel - Form Canvas */}
          <div className="flex-1 flex flex-col bg-background">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant={layoutMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setLayoutMode('list')}>
                  <Icons.Layout className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button variant={layoutMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setLayoutMode('grid')}>
                  <Icons.Grid3x3 className="h-4 w-4 mr-2" />
                  Grid
                </Button>
              </div>
            </div>

            <Tabs defaultValue="builder" className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3">
                <TabsTrigger value="builder">
                  <Icons.Layout className="h-4 w-4 mr-2" />
                  Builder
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Icons.Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Icons.Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="flex-1 p-4 space-y-6 overflow-auto">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <Label>Layout Mode</Label>
                  <div className="flex gap-2">
                    <Button variant={layoutMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setLayoutMode('list')}>
                      <Icons.Layout className="h-4 w-4 mr-2" />
                      List
                    </Button>
                    <Button variant={layoutMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setLayoutMode('grid')}>
                      <Icons.Grid3x3 className="h-4 w-4 mr-2" />
                      Grid
                    </Button>
                  </div>
                </div>

                {layoutMode === 'list' && <Droppable droppableId="fields-list">
                    {provided => <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                        {fields.map((field, index) => <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided, snapshot) => <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <CompactFieldCard field={field} isSelected={selectedFieldId === field.id} onSelect={() => setSelectedFieldId(field.id)} onDelete={() => handleFieldDelete(field.id)} isDragging={snapshot.isDragging} />
                              </div>}
                          </Draggable>)}
                        {provided.placeholder}
                        {fields.length === 0 && <div className="text-center py-12 text-muted-foreground">
                            <p>Drag field types from the left sidebar to add them to your form</p>
                          </div>}
                      </div>}
                  </Droppable>}

                {layoutMode === 'grid' && <GridFormBuilder rows={rows} onRowAdd={handleRowAdd} onRowDelete={handleRowDelete} onFieldUpdate={handleFieldUpdate} onFieldDelete={handleFieldDelete} onFieldAdd={handleFieldAddToGrid} selectedFieldId={selectedFieldId} onFieldSelect={setSelectedFieldId} />}

                <EnhancedEmailNotifications config={emailNotifications} onConfigUpdate={setEmailNotifications} availablePrograms={programs} />
              </TabsContent>

              <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
                <Card>
                  <CardContent className="p-6">
                    <DynamicFormRenderer formConfig={{
                    id: formId || undefined,
                    title: formTitle,
                    description: formDescription,
                    fields: layoutMode === 'list' ? fields : rows.flatMap(r => r.fields.filter(Boolean) as FormField[]),
                    submitButtonText: submitButtonText,
                    successMessage: successMessage,
                    errorMessage: errorMessage,
                    multiStep: multiStep,
                    showProgress: showProgress,
                    theme: theme,
                    layoutMode: layoutMode,
                    rows: layoutMode === 'grid' ? rows : undefined,
                    privacyText: privacyText
                  }} onSuccess={data => {
                    console.log('Form submitted:', data);
                  }} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 p-4 space-y-6 overflow-auto">
                <Card>
                  <CardContent className="space-y-6 pt-6">
                    <div>
                      <Label htmlFor="form-description">Form Description</Label>
                      <Textarea id="form-description" value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Enter form description" className="mt-1.5" rows={3} />
                    </div>

                    <div>
                      <Label htmlFor="submit-button">Submit Button Text</Label>
                      <Input id="submit-button" value={submitButtonText} onChange={e => setSubmitButtonText(e.target.value)} className="mt-1.5" />
                    </div>

                    <div>
                      <Label htmlFor="success-message">Success Message</Label>
                      <Input id="success-message" value={successMessage} onChange={e => setSuccessMessage(e.target.value)} className="mt-1.5" />
                    </div>

                    <div>
                      <Label htmlFor="error-message">Error Message</Label>
                      <Input id="error-message" value={errorMessage} onChange={e => setErrorMessage(e.target.value)} className="mt-1.5" />
                    </div>

                    <div>
                      <Label htmlFor="privacy-text">Privacy Text</Label>
                      <Textarea id="privacy-text" value={privacyText} onChange={e => setPrivacyText(e.target.value)} placeholder="Optional privacy policy text" className="mt-1.5" rows={2} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="multi-step">Multi-Step Form</Label>
                      <Switch id="multi-step" checked={multiStep} onCheckedChange={setMultiStep} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-progress">Show Progress Bar</Label>
                      <Switch id="show-progress" checked={showProgress} onCheckedChange={setShowProgress} />
                    </div>

                    
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Field Configuration */}
          <FieldConfigPanel field={selectedField || null} onUpdate={handleFieldUpdate} availableFields={layoutMode === 'list' ? fields : rows.flatMap(r => r.fields.filter(Boolean) as FormField[])} />
        </div>
      </DragDropContext>
    </div>;
}