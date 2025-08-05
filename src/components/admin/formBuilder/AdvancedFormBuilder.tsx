import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormConfig, FormField, FormFieldType } from '@/types/formBuilder';
import { FormBuilderLayout } from './FormBuilderLayout';
import { GridFormBuilder } from './GridFormBuilder';
import { FieldConfigEditor } from './FieldConfigEditor';
import { EnhancedEmailNotifications } from './EnhancedEmailNotifications';
import { ProgramIntegration } from './ProgramIntegration';
import { FormRow, FormLayout } from '@/types/formLayout';
import { EmailNotificationConfig, ProgramIntegrationConfig } from '@/types/emailNotifications';
import { 
  Save, 
  Eye, 
  Download, 
  Upload,
  Copy,
  BarChart3,
  Settings
} from 'lucide-react';

interface AdvancedFormBuilderProps {
  formId?: string;
  onSave?: (formConfig: FormConfig) => void;
  onCancel?: () => void;
}

export function AdvancedFormBuilder({ formId, onSave, onCancel }: AdvancedFormBuilderProps) {
  // Mock data - in real app, this would come from props or API
  const [forms, setForms] = useState<FormConfig[]>([
    {
      id: 'form1',
      title: 'Lead Capture Form',
      description: 'Capture potential student leads',
      fields: [
        {
          id: 'name',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          id: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          placeholder: 'Enter your email'
        }
      ],
      submitButtonText: 'Submit Application',
      multiStep: false,
      showProgress: false,
      theme: 'default'
    }
  ]);

  const [selectedFormId, setSelectedFormId] = useState<string>(formId || 'form1');
  const [formLayout, setFormLayout] = useState<FormLayout>({
    rows: [
      {
        id: 'row1',
        fields: [null, null],
        columns: 2
      }
    ]
  });

  const [emailConfig, setEmailConfig] = useState<EmailNotificationConfig>({
    enabled: true,
    recipients: [
      { id: '1', type: 'admin', email: undefined, programId: undefined }
    ],
    template: {
      id: 'default',
      name: 'Default Template',
      subject: 'New Lead Submission - {{form_name}}',
      body: 'Hello,\n\nA new lead has been submitted:\n\nName: {{name}}\nEmail: {{email}}\n\nBest regards,\nThe Team',
      variables: ['{{name}}', '{{email}}', '{{form_name}}']
    },
    triggerConditions: [],
    deliveryTiming: 'immediate',
    delayMinutes: undefined,
    scheduledTime: undefined,
    attachments: false,
    format: 'html'
  });

  const [programConfig, setProgramConfig] = useState<ProgramIntegrationConfig>({
    enabled: false,
    autoPopulatePrograms: false,
    routingRules: [],
    customMappings: [],
    intakeIntegration: false,
    advisorAssignment: false
  });

  const selectedForm = forms.find(f => f.id === selectedFormId);

  const handleFormCreate = () => {
    const newForm: FormConfig = {
      id: `form_${Date.now()}`,
      title: 'New Form',
      description: 'Description',
      fields: [],
      submitButtonText: 'Submit',
      multiStep: false,
      showProgress: false,
      theme: 'default'
    };
    setForms([...forms, newForm]);
    setSelectedFormId(newForm.id!);
  };

  const handleFormDelete = (formId: string) => {
    setForms(forms.filter(f => f.id !== formId));
    if (selectedFormId === formId) {
      setSelectedFormId(forms.length > 1 ? forms[0].id! : '');
    }
  };

  const handleFormDuplicate = (formId: string) => {
    const originalForm = forms.find(f => f.id === formId);
    if (originalForm) {
      const duplicatedForm = {
        ...originalForm,
        id: `form_${Date.now()}`,
        title: `${originalForm.title} (Copy)`
      };
      setForms([...forms, duplicatedForm]);
    }
  };

  const handleFieldAdd = (fieldType: FormFieldType, rowId?: string, columnIndex?: number) => {
    if (!selectedForm) return;

    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      type: fieldType,
      required: false,
      enabled: true,
      placeholder: `Enter ${fieldType}`
    };

    const updatedForm = {
      ...selectedForm,
      fields: [...selectedForm.fields, newField]
    };

    setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
  };

  const handleGridFieldAdd = (fieldType: FormFieldType, rowId: string, columnIndex: number) => {
    handleFieldAdd(fieldType, rowId, columnIndex);
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    if (!selectedForm) return;

    const updatedForm = {
      ...selectedForm,
      fields: selectedForm.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      )
    };

    setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
  };

  const handleFieldDelete = (fieldId: string) => {
    if (!selectedForm) return;

    const updatedForm = {
      ...selectedForm,
      fields: selectedForm.fields.filter(f => f.id !== fieldId)
    };

    setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
  };

  const handleRowAdd = (columns: number) => {
    const newRow: FormRow = {
      id: `row_${Date.now()}`,
      fields: Array(columns).fill(null),
      columns
    };
    
    setFormLayout({
      ...formLayout,
      rows: [...formLayout.rows, newRow]
    });
  };

  const handleRowDelete = (rowId: string) => {
    setFormLayout({
      ...formLayout,
      rows: formLayout.rows.filter(r => r.id !== rowId)
    });
  };

  const handleSave = () => {
    if (selectedForm && onSave) {
      onSave(selectedForm);
    }
  };

  const availablePrograms = [
    { id: 'prog1', name: 'Business Administration' },
    { id: 'prog2', name: 'Computer Science' },
    { id: 'prog3', name: 'Engineering' }
  ];

  const availableAdvisors = [
    { id: 'adv1', name: 'John Smith' },
    { id: 'adv2', name: 'Sarah Johnson' },
    { id: 'adv3', name: 'Mike Wilson' }
  ];

  return (
    <div className="h-full">
      <FormBuilderLayout
        forms={forms}
        selectedFormId={selectedFormId}
        onFormSelect={setSelectedFormId}
        onFormCreate={handleFormCreate}
        onFormDelete={handleFormDelete}
        onFormDuplicate={handleFormDuplicate}
        onFieldAdd={(fieldType: FormFieldType, insertIndex?: number, rowId?: string) => handleFieldAdd(fieldType, rowId, insertIndex)}
        onFieldUpdate={handleFieldUpdate}
        onFieldDelete={handleFieldDelete}
      >
        {selectedForm && (
          <div className="space-y-6">
            {/* Grid Form Builder */}
            <Card>
              <CardHeader>
                <CardTitle>Form Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <GridFormBuilder
                  rows={formLayout.rows}
                  onRowAdd={handleRowAdd}
                  onRowDelete={handleRowDelete}
                  onFieldUpdate={handleFieldUpdate}
                  onFieldDelete={handleFieldDelete}
                  onFieldAdd={handleGridFieldAdd}
                />
              </CardContent>
            </Card>

            {/* Form Fields Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Form Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedForm.fields.map((field) => (
                  <FieldConfigEditor
                    key={field.id}
                    field={field}
                    onUpdate={(updates) => handleFieldUpdate(field.id, updates)}
                    onRemove={() => handleFieldDelete(field.id)}
                    availableFields={selectedForm.fields.filter(f => f.id !== field.id)}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Email Notifications */}
            <EnhancedEmailNotifications
              config={emailConfig}
              onConfigUpdate={setEmailConfig}
              availablePrograms={availablePrograms}
            />

            {/* Program Integration */}
            <ProgramIntegration
              config={programConfig}
              onConfigUpdate={setProgramConfig}
              availablePrograms={availablePrograms}
              availableAdvisors={availableAdvisors}
              formFields={selectedForm.fields}
            />

            {/* Form Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Form Title</Label>
                    <Input
                      id="title"
                      value={selectedForm.title}
                      onChange={(e) => {
                        const updatedForm = { ...selectedForm, title: e.target.value };
                        setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="submitText">Submit Button Text</Label>
                    <Input
                      id="submitText"
                      value={selectedForm.submitButtonText}
                      onChange={(e) => {
                        const updatedForm = { ...selectedForm, submitButtonText: e.target.value };
                        setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Multi-step Form</Label>
                    <p className="text-sm text-muted-foreground">Break form into multiple steps</p>
                  </div>
                  <Switch
                    checked={selectedForm.multiStep}
                    onCheckedChange={(multiStep) => {
                      const updatedForm = { ...selectedForm, multiStep };
                      setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Progress Bar</Label>
                    <p className="text-sm text-muted-foreground">Display progress indicator</p>
                  </div>
                  <Switch
                    checked={selectedForm.showProgress}
                    onCheckedChange={(showProgress) => {
                      const updatedForm = { ...selectedForm, showProgress };
                      setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Form Theme</Label>
                  <Select
                    value={selectedForm.theme}
                    onValueChange={(theme: 'default' | 'modern' | 'minimal') => {
                      const updatedForm = { ...selectedForm, theme };
                      setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
                    }}
                  >
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

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Form
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        )}
      </FormBuilderLayout>
    </div>
  );
}