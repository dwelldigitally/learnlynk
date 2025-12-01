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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GridFormBuilder } from './GridFormBuilder';
import { FieldConfigEditor } from './FieldConfigEditor';
import { EnhancedEmailNotifications } from './EnhancedEmailNotifications';
import { useForm, useCreateForm, useUpdateForm } from '@/hooks/useForms';
import { usePrograms } from '@/hooks/usePrograms';
import { toast } from 'sonner';
import { LayoutList, LayoutGrid, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AdvancedFormBuilderProps {
  formId?: string | null;
  onSave?: (formConfig: FormConfig) => void;
  onCancel?: () => void;
}

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

  // Save form
  const handleSave = async () => {
    // Collect all fields from either list or grid mode
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
        // Update existing form
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
        // Create new form
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {formId ? 'Edit Form' : 'Create New Form'}
        </h1>
        <p className="text-muted-foreground">
          Configure your lead capture form with custom fields, layout, and email notifications
        </p>
      </div>

      <Tabs defaultValue="builder" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="notifications">Email Notifications</TabsTrigger>
          </TabsList>

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

        {/* Builder Tab */}
        <TabsContent value="builder" className="space-y-6">
          {/* Form Title & Description */}
          <Card>
            <CardHeader>
              <CardTitle>Form Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Layout Mode Toggle */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Form Layout</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={layoutMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayoutMode('list')}
                  >
                    <LayoutList className="h-4 w-4 mr-2" />
                    List View
                  </Button>
                  <Button
                    variant={layoutMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayoutMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Grid View
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
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No fields added yet. Use the "Add Field" button below to start building your form.</p>
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
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="error-message">Error Message</Label>
                <Textarea
                  id="error-message"
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                  placeholder="Error message"
                  rows={3}
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Multi-Step Form</Label>
                    <p className="text-sm text-muted-foreground">Split form into multiple steps</p>
                  </div>
                  <Switch checked={multiStep} onCheckedChange={setMultiStep} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Progress Bar</Label>
                    <p className="text-sm text-muted-foreground">Display progress indicator</p>
                  </div>
                  <Switch checked={showProgress} onCheckedChange={setShowProgress} />
                </div>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Notifications Tab */}
        <TabsContent value="notifications">
          <EnhancedEmailNotifications
            config={emailNotifications}
            onConfigUpdate={setEmailNotifications}
            availablePrograms={programs}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
