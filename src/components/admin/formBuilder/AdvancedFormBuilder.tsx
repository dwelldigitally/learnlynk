import { useState, useEffect } from 'react';
import { FormConfig, FormField, FormFieldType } from '@/types/formBuilder';
import { FormBuilderLayout } from './FormBuilderLayout';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { v4 as uuidv4 } from 'uuid';
import { useForm, useCreateForm, useUpdateForm } from '@/hooks/useForms';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdvancedFormBuilderProps {
  formId?: string | null;
  onSave?: (formConfig: FormConfig) => void;
  onCancel?: () => void;
}

export function AdvancedFormBuilder({ formId, onSave, onCancel }: AdvancedFormBuilderProps) {
  const navigate = useNavigate();
  const { data: existingForm, isLoading: isLoadingForm } = useForm(formId || null);
  const createFormMutation = useCreateForm();
  const updateFormMutation = useUpdateForm();
  
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [forms, setForms] = useState<FormConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing form data if editing
  useEffect(() => {
    if (existingForm && !isLoadingForm) {
      const formConfig: FormConfig = {
        id: existingForm.id,
        title: existingForm.name,
        description: existingForm.description || '',
        fields: existingForm.config?.fields || [],
        submitButtonText: existingForm.config?.submitButtonText || 'Submit',
        successMessage: existingForm.config?.successMessage,
        errorMessage: existingForm.config?.errorMessage,
        privacyText: existingForm.config?.privacyText,
        multiStep: existingForm.config?.multiStep || false,
        showProgress: existingForm.config?.showProgress || false,
        theme: existingForm.config?.theme || 'default',
      };
      setForms([formConfig]);
      setSelectedFormId(formConfig.id || '');
    } else if (!formId && forms.length === 0) {
      // Create new form template
      const newFormId = uuidv4();
      const newForm: FormConfig = {
        id: newFormId,
        title: 'New Lead Form',
        description: 'Capture lead information',
        fields: [],
        submitButtonText: 'Submit',
        multiStep: false,
        showProgress: false,
        theme: 'default'
      };
      setForms([newForm]);
      setSelectedFormId(newFormId);
    }
  }, [existingForm, isLoadingForm, formId]);

  useEffect(() => {
    if (forms.length > 0 && !selectedFormId) {
      setSelectedFormId(forms[0].id || '');
    }
  }, [forms, selectedFormId]);

  const handleFieldAdd = (fieldType: FormFieldType) => {
    const selectedForm = forms.find(f => f.id === selectedFormId);
    if (!selectedForm) return;

    const newField: FormField = {
      id: uuidv4(),
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

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    const selectedForm = forms.find(f => f.id === selectedFormId);
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
    const selectedForm = forms.find(f => f.id === selectedFormId);
    if (!selectedForm) return;

    const updatedForm = {
      ...selectedForm,
      fields: selectedForm.fields.filter(f => f.id !== fieldId)
    };

    setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
  };

  const handleSave = async () => {
    const selectedForm = forms.find(f => f.id === selectedFormId);
    if (!selectedForm) {
      toast.error('No form selected');
      return;
    }

    setIsSaving(true);
    
    try {
      if (formId) {
        // Update existing form
        await updateFormMutation.mutateAsync({
          id: formId,
          updates: {
            name: selectedForm.title,
            description: selectedForm.description,
            config: selectedForm,
          }
        });
      } else {
        // Create new form
        await createFormMutation.mutateAsync({
          name: selectedForm.title,
          description: selectedForm.description,
          config: selectedForm,
          status: 'draft',
        });
      }

      if (onSave) {
        onSave(selectedForm);
      }
      
      // Navigate back to forms overview
      navigate('/admin/leads/forms');
    } catch (error: any) {
      console.error('Error saving form:', error);
      // Error toast already shown by mutation
    } finally {
      setIsSaving(false);
    }
  };

  const selectedForm = forms.find(f => f.id === selectedFormId);

  if (isLoadingForm) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <FormBuilderLayout
      forms={forms}
      selectedFormId={selectedFormId}
      onFormSelect={setSelectedFormId}
      onFormCreate={() => {}}
      onFormDelete={() => {}}
      onFormDuplicate={() => {}}
      onFieldAdd={handleFieldAdd}
      onFieldUpdate={handleFieldUpdate}
      onFieldDelete={handleFieldDelete}
    >
      {selectedForm && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Form Fields</h3>
            <div className="space-y-4">
              {selectedForm.fields.map((field) => (
                <div key={field.id} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Field Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => handleFieldUpdate(field.id, { placeholder: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => handleFieldUpdate(field.id, { required: checked })}
                        />
                        <span className="text-sm">Required</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Switch
                          checked={field.enabled !== false}
                          onCheckedChange={(checked) => handleFieldUpdate(field.id, { enabled: checked })}
                        />
                        <span className="text-sm">Enabled</span>
                      </label>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldDelete(field.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {selectedForm.fields.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Drag fields from the left panel to add them to your form
              </p>
            )}
          </Card>

          {/* Settings Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Form Settings</h3>
            <div className="space-y-4">
              <div>
                <Label>Success Message</Label>
                <Input
                  value={selectedForm.successMessage || ''}
                  onChange={(e) => {
                    const updatedForm = { ...selectedForm, successMessage: e.target.value };
                    setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
                  }}
                  placeholder="Thank you for your submission!"
                />
              </div>
              <div>
                <Label>Error Message</Label>
                <Input
                  value={selectedForm.errorMessage || ''}
                  onChange={(e) => {
                    const updatedForm = { ...selectedForm, errorMessage: e.target.value };
                    setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
                  }}
                  placeholder="Something went wrong. Please try again."
                />
              </div>
              <div>
                <Label>Privacy Text</Label>
                <Textarea
                  rows={3}
                  value={selectedForm.privacyText || ''}
                  onChange={(e) => {
                    const updatedForm = { ...selectedForm, privacyText: e.target.value };
                    setForms(forms.map(f => f.id === selectedFormId ? updatedForm : f));
                  }}
                  placeholder="By submitting this form, you agree to our privacy policy..."
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel || (() => navigate('/admin/leads/forms'))}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                formId ? 'Update Form' : 'Create Form'
              )}
            </Button>
          </div>
        </div>
      )}
    </FormBuilderLayout>
  );
}
