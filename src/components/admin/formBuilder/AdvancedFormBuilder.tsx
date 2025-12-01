import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormConfig, FormField, FormFieldType, EmailNotificationConfig } from '@/types/formBuilder';
import { FormRow } from '@/types/formLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GridFormBuilder } from './GridFormBuilder';
import { FieldConfigEditor } from './FieldConfigEditor';
import { EnhancedEmailNotifications } from './EnhancedEmailNotifications';
import { DynamicFormRenderer } from '@/components/forms/DynamicFormRenderer';
import { WebFormEmbedGenerator } from '@/components/embed/WebFormEmbedGenerator';
import { useForm, useCreateForm, useUpdateForm } from '@/hooks/useForms';
import { usePrograms } from '@/hooks/usePrograms';
import { toast } from 'sonner';
import { 
  Save, 
  X, 
  Copy,
  Type,
  Mail,
  Phone,
  Calendar,
  FileText,
  ToggleLeft,
  Upload,
  Link,
  Hash,
  CheckSquare,
  Circle,
  List,
  Plus,
  Edit2,
  Eye,
  Settings as SettingsIcon
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

interface AdvancedFormBuilderProps {
  formId?: string | null;
  onSave?: (formConfig: FormConfig) => void;
  onCancel?: () => void;
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
  { type: 'intake-date' as FormFieldType, label: 'Intake Date', icon: Calendar, color: 'bg-emerald-500' },
  { type: 'switch' as FormFieldType, label: 'Switch', icon: ToggleLeft, color: 'bg-teal-500' },
  { type: 'file' as FormFieldType, label: 'File Upload', icon: Upload, color: 'bg-rose-500' },
  { type: 'url' as FormFieldType, label: 'URL', icon: Link, color: 'bg-amber-500' },
  { type: 'program-list' as FormFieldType, label: 'Program List', icon: List, color: 'bg-lime-500' },
];

export function AdvancedFormBuilder({ formId, onSave, onCancel }: AdvancedFormBuilderProps) {
  const navigate = useNavigate();
  const { data: existingForm, isLoading } = useForm(formId || null);
  const { data: programs = [] } = usePrograms();
  const createFormMutation = useCreateForm();
  const updateFormMutation = useUpdateForm();

  // Form state
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');
  const [fields, setFields] = useState<FormField[]>([]);
  const [rows, setRows] = useState<FormRow[]>([]);
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

  const [searchTerm, setSearchTerm] = useState('');
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);

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

  // Field management for list mode
  const handleFieldAdd = (fieldType: FormFieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      label: `New ${fieldType} Field`,
      type: fieldType,
      required: false,
      enabled: true,
      placeholder: '',
      helpText: '',
    };
    setFields([...fields, newField]);
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const handleFieldDelete = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  // Row & field management for grid mode
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
      helpText: '',
    };

    setRows(rows.map(row => {
      if (row.id === rowId) {
        const newFields = [...row.fields];
        newFields[columnIndex] = newField;
        return { ...row, fields: newFields };
      }
      return row;
    }));
  };

  const handleFieldUpdateInGrid = (fieldId: string, updates: Partial<FormField>) => {
    setRows(rows.map(row => ({
      ...row,
      fields: row.fields.map(field => 
        field && field.id === fieldId ? { ...field, ...updates } : field
      )
    })));
  };

  const handleFieldDeleteFromGrid = (fieldId: string) => {
    setRows(rows.map(row => ({
      ...row,
      fields: row.fields.map(field => 
        field && field.id === fieldId ? null : field
      )
    })));
  };

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // Adding field from palette to grid (droppableId format: "rowId-columnIndex")
    if (source.droppableId === 'field-palette' && destination.droppableId !== 'field-palette') {
      const fieldType = fieldTypes[source.index];
      
      // Parse rowId and columnIndex correctly (rowId may contain dashes for UUIDs)
      const lastDashIndex = destination.droppableId.lastIndexOf('-');
      const rowId = destination.droppableId.substring(0, lastDashIndex);
      const columnIndex = parseInt(destination.droppableId.substring(lastDashIndex + 1));
      
      if (rowId && !isNaN(columnIndex)) {
        handleFieldAddToGrid(fieldType.type, rowId, columnIndex);
      } else {
        // Fallback to list mode if parsing fails
        handleFieldAdd(fieldType.type);
      }
    }
  };

  // Save form
  const handleSave = async () => {
    const allFields = layoutMode === 'grid' 
      ? rows.flatMap(row => row.fields).filter(Boolean) as FormField[]
      : fields;

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

  const filteredFieldTypes = fieldTypes.filter(field =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFieldCount = layoutMode === 'grid'
    ? rows.flatMap(row => row.fields).filter(Boolean).length
    : fields.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {formId ? 'Edit Form' : 'Create New Form'}
          </h1>
          <p className="text-muted-foreground">
            Configure your lead capture form with custom fields, layout, and email notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel || (() => navigate('/admin/leads/forms'))}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {formId ? 'Update Form' : 'Create Form'}
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 h-[calc(100vh-250px)]">
          {/* Left Sidebar - Field Types */}
          <div className="w-80 flex-shrink-0">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Field Types</CardTitle>
                <Input
                  placeholder="Search fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 mt-2"
                />
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-380px)]">
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
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg border cursor-move transition-all",
                                  snapshot.isDragging
                                    ? 'shadow-lg bg-background border-primary'
                                    : 'hover:border-primary/50 hover:shadow-md'
                                )}
                                onClick={() => layoutMode === 'list' && handleFieldAdd(field.type)}
                              >
                                <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white", field.color)}>
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

          {/* Right Content - Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="builder" className="h-full flex flex-col">
              {/* Tab Header */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
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
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {totalFieldCount} {totalFieldCount === 1 ? 'field' : 'fields'}
                  </Badge>
                  <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-2" />
                        Embed Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Generate Embed Code</DialogTitle>
                      </DialogHeader>
                      <WebFormEmbedGenerator />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Builder Tab */}
              <TabsContent value="builder" className="flex-1 overflow-auto space-y-6 mt-0">
                {/* Form Layout Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Form Layout</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground mr-2">Layout Mode:</span>
                        <Button
                          variant={layoutMode === 'list' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setLayoutMode('list')}
                        >
                          List
                        </Button>
                        <Button
                          variant={layoutMode === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setLayoutMode('grid')}
                        >
                          Grid
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {layoutMode === 'list' ? (
                      <div className="space-y-4">
                        {fields.map((field) => (
                          <FieldConfigEditor
                            key={field.id}
                            field={field}
                            onUpdate={(updates) => handleFieldUpdate(field.id, updates)}
                            onRemove={() => handleFieldDelete(field.id)}
                            availableFields={fields}
                            compact={false}
                          />
                        ))}
                        {fields.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <p>No fields added yet. Click or drag fields from the left sidebar to start building your form.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <GridFormBuilder
                        rows={rows}
                        onRowAdd={handleRowAdd}
                        onRowDelete={handleRowDelete}
                        onFieldUpdate={handleFieldUpdateInGrid}
                        onFieldDelete={handleFieldDeleteFromGrid}
                        onFieldAdd={handleFieldAddToGrid}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Email Notifications Section */}
                <EnhancedEmailNotifications
                  config={emailNotifications}
                  onConfigUpdate={setEmailNotifications}
                  availablePrograms={programs}
                />
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="flex-1 overflow-auto mt-0">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Form Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-w-2xl mx-auto">
                      <DynamicFormRenderer
                        formConfig={{
                          title: formTitle,
                          description: formDescription,
                          fields: layoutMode === 'grid' 
                            ? rows.flatMap(row => row.fields).filter(Boolean) as FormField[]
                            : fields,
                          layoutMode,
                          rows: layoutMode === 'grid' ? rows : undefined,
                          submitButtonText,
                          successMessage,
                          errorMessage,
                          privacyText,
                          multiStep,
                          showProgress,
                          theme
                        }}
                        onSuccess={(result) => {
                          console.log('Preview form submitted:', result);
                          toast.success('Form preview submitted (not saved)');
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="flex-1 overflow-auto mt-0">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Form Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Form Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Form Information</h3>
                      <div>
                        <Label htmlFor="form-title">Form Title</Label>
                        <Input
                          id="form-title"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="Enter form title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="form-description">Description</Label>
                        <Textarea
                          id="form-description"
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Enter form description"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Form Behavior */}
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-semibold">Form Behavior</h3>
                      <div>
                        <Label htmlFor="submit-button">Submit Button Text</Label>
                        <Input
                          id="submit-button"
                          value={submitButtonText}
                          onChange={(e) => setSubmitButtonText(e.target.value)}
                          placeholder="Submit"
                        />
                      </div>

                      <div>
                        <Label htmlFor="success-message">Success Message</Label>
                        <Textarea
                          id="success-message"
                          value={successMessage}
                          onChange={(e) => setSuccessMessage(e.target.value)}
                          placeholder="Thank you message"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="error-message">Error Message</Label>
                        <Textarea
                          id="error-message"
                          value={errorMessage}
                          onChange={(e) => setErrorMessage(e.target.value)}
                          placeholder="Error message"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="privacy-text">Privacy Text (optional)</Label>
                        <Textarea
                          id="privacy-text"
                          value={privacyText}
                          onChange={(e) => setPrivacyText(e.target.value)}
                          placeholder="Privacy policy or terms text"
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-semibold">Advanced Options</h3>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <Label>Multi-Step Form</Label>
                          <p className="text-sm text-muted-foreground">Split form into multiple steps</p>
                        </div>
                        <Switch checked={multiStep} onCheckedChange={setMultiStep} />
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <div>
                          <Label>Show Progress Bar</Label>
                          <p className="text-sm text-muted-foreground">Display progress indicator</p>
                        </div>
                        <Switch checked={showProgress} onCheckedChange={setShowProgress} />
                      </div>

                      <div>
                        <Label htmlFor="theme">Form Theme</Label>
                        <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
