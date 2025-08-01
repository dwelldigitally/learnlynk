import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { LeadSource, LeadFormData } from '@/types/lead';
import { Copy, Eye, Code, Edit, Plus, Trash2, Save } from 'lucide-react';
import { FormConfig, FormField, FormData, FormErrors, FormFieldType } from '@/types/formBuilder';
import { FieldRenderer } from './formBuilder/FieldRenderer';
import { FieldConfigEditor } from './formBuilder/FieldConfigEditor';
import { ConditionalLogicEngine } from './formBuilder/ConditionalLogicEngine';
import { FormValidation } from './formBuilder/FormValidation';
import { FormBuilderLayout } from './formBuilder/FormBuilderLayout';
import { FieldInsertButton } from './formBuilder/FieldInsertButton';

interface LeadCaptureFormProps {
  onLeadCreated?: () => void;
  embedded?: boolean;
  formId?: string;
}

export function LeadCaptureForm({ onLeadCreated, embedded = false, formId }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    program_interest: [] as string[],
    source: 'web' as LeadSource,
    marketing_consent: false,
    utm_source: '',
    utm_medium: '',
    utm_campaign: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedFormId, setSelectedFormId] = useState<string>('default');
  const [forms, setForms] = useState<FormConfig[]>([
    {
      id: 'default',
      title: 'Get Started Today',
      description: 'Tell us about your educational goals and we\'ll help you find the right program.',
      fields: [
        { 
          id: 'first_name', 
          label: 'First Name', 
          type: 'text', 
          required: true, 
          enabled: true,
          placeholder: 'Enter your first name',
          validation: [{ type: 'required', message: 'First name is required' }]
        },
        { 
          id: 'last_name', 
          label: 'Last Name', 
          type: 'text', 
          required: true, 
          enabled: true,
          placeholder: 'Enter your last name',
          validation: [{ type: 'required', message: 'Last name is required' }]
        },
        { 
          id: 'email', 
          label: 'Email Address', 
          type: 'email', 
          required: true, 
          enabled: true,
          placeholder: 'Enter your email address',
          validation: [
            { type: 'required', message: 'Email is required' },
            { type: 'pattern', value: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', message: 'Please enter a valid email address' }
          ]
        },
        { 
          id: 'phone', 
          label: 'Phone Number', 
          type: 'tel', 
          required: false, 
          enabled: true,
          placeholder: 'Enter your phone number',
          helpText: 'We may contact you via phone for program information'
        },
        { 
          id: 'country', 
          label: 'Country', 
          type: 'select', 
          required: false, 
          enabled: true,
          placeholder: 'Select your country',
          options: [
            { label: 'Canada', value: 'canada' },
            { label: 'United States', value: 'usa' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'Australia', value: 'australia' },
            { label: 'Other', value: 'other' }
          ]
        },
        { 
          id: 'program_interest', 
          label: 'Programs of Interest', 
          type: 'multi-select', 
          required: false, 
          enabled: true,
          helpText: 'Select all programs you are interested in',
          options: [
            { label: 'Health Care Assistant', value: 'health_care_assistant' },
            { label: 'Aviation', value: 'aviation' },
            { label: 'Education Assistant', value: 'education_assistant' },
            { label: 'Hospitality', value: 'hospitality' },
            { label: 'Early Childhood Education', value: 'ece' },
            { label: 'Medical Laboratory Assistant', value: 'mla' }
          ]
        },
        { 
          id: 'marketing_consent', 
          label: 'Marketing Communications', 
          type: 'consent', 
          required: false, 
          enabled: true,
          helpText: 'I agree to receive marketing communications and updates about programs.'
        }
      ],
      submitButtonText: 'Get Information',
      privacyText: 'By submitting this form, you agree to our privacy policy and terms of service.',
      successMessage: 'Thank you for your interest! We\'ll be in touch soon.',
      errorMessage: 'Failed to submit form. Please try again.'
    }
  ]);
  const { toast } = useToast();

  const selectedForm = forms.find(f => f.id === selectedFormId);
  const formConfig = selectedForm || forms[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get visible fields for validation
    const visibleFields = getVisibleFields();
    
    // Validate form
    const formErrors = FormValidation.validateForm(formConfig.fields, formData, visibleFields);
    
    if (FormValidation.hasErrors(formErrors)) {
      setErrors(formErrors);
      toast({
        title: 'Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      // Capture UTM parameters from URL if not manually set
      const urlParams = new URLSearchParams(window.location.search);
      const leadDataWithUTM: LeadFormData = {
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        country: formData.country || '',
        source: (formData.source as LeadSource) || 'web',
        program_interest: formData.program_interest || [],
        utm_source: formData.utm_source || urlParams.get('utm_source') || '',
        utm_medium: formData.utm_medium || urlParams.get('utm_medium') || '',
        utm_campaign: formData.utm_campaign || urlParams.get('utm_campaign') || '',
        utm_content: urlParams.get('utm_content') || '',
        utm_term: urlParams.get('utm_term') || '',
        source_details: `Form ID: ${formId || 'default'}`,
      };

      await LeadService.createLead(leadDataWithUTM);
      
      // Reset form
      const resetData: FormData = {};
      formConfig.fields.forEach(field => {
        resetData[field.id] = field.type === 'multi-select' || field.type === 'checkbox' ? [] : '';
      });
      setFormData(resetData);
      
      if (onLeadCreated) {
        onLeadCreated();
      }
      
      toast({
        title: 'Success',
        description: formConfig.successMessage || 'Thank you for your interest! We\'ll be in touch soon.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: formConfig.errorMessage || 'Failed to submit form. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getVisibleFields = (): Set<string> => {
    const visibleFields = new Set<string>();
    
    formConfig.fields.forEach(field => {
      if (!field.enabled) return;
      
      const shouldShow = ConditionalLogicEngine.shouldShowField(
        field.showWhen,
        field.hideWhen,
        formData
      );
      
      if (shouldShow) {
        visibleFields.add(field.id);
      }
    });
    
    return visibleFields;
  };

  const generateEmbedCode = () => {
    const baseUrl = window.location.origin;
    return `<iframe 
  src="${baseUrl}/embed/lead-form${formId ? `?formId=${formId}` : ''}" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="max-width: 500px;">
</iframe>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    toast({
      title: 'Copied!',
      description: 'Embed code copied to clipboard'
    });
  };

  const handleFormCreate = () => {
    const newForm: FormConfig = {
      id: `form_${Date.now()}`,
      title: 'New Form',
      description: 'Form description',
      fields: [],
      submitButtonText: 'Submit',
    };
    setForms(prev => [...prev, newForm]);
    setSelectedFormId(newForm.id!);
  };

  const handleFormDelete = (formId: string) => {
    setForms(prev => prev.filter(f => f.id !== formId));
    if (selectedFormId === formId) {
      setSelectedFormId(forms[0]?.id || '');
    }
  };

  const handleFormDuplicate = (formId: string) => {
    const formToDuplicate = forms.find(f => f.id === formId);
    if (formToDuplicate) {
      const newForm: FormConfig = {
        ...formToDuplicate,
        id: `form_${Date.now()}`,
        title: `${formToDuplicate.title} (Copy)`,
      };
      setForms(prev => [...prev, newForm]);
    }
  };

  const handleFieldAdd = (fieldType: FormFieldType, insertIndex?: number) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      type: fieldType,
      required: false,
      enabled: true,
      placeholder: `Enter ${fieldType}`,
    };
    
    setForms(prev => prev.map(form => {
      if (form.id === selectedFormId) {
        const newFields = [...form.fields];
        if (insertIndex !== undefined) {
          newFields.splice(insertIndex, 0, newField);
        } else {
          newFields.push(newField);
        }
        return { ...form, fields: newFields };
      }
      return form;
    }));
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    setForms(prev => prev.map(form => 
      form.id === selectedFormId 
        ? { 
            ...form, 
            fields: form.fields.map(field => 
              field.id === fieldId ? { ...field, ...updates } : field
            )
          }
        : form
    ));
  };

  const handleFieldDelete = (fieldId: string) => {
    setForms(prev => prev.map(form => 
      form.id === selectedFormId 
        ? { ...form, fields: form.fields.filter(field => field.id !== fieldId) }
        : form
    ));
  };

  const handleFieldReorder = (fromIndex: number, toIndex: number) => {
    setForms(prev => prev.map(form => {
      if (form.id === selectedFormId) {
        const newFields = [...form.fields];
        const [movedField] = newFields.splice(fromIndex, 1);
        newFields.splice(toIndex, 0, movedField);
        return { ...form, fields: newFields };
      }
      return form;
    }));
  };

  if (!embedded) {
    return (
      <FormBuilderLayout
        forms={forms}
        selectedFormId={selectedFormId}
        onFormSelect={setSelectedFormId}
        onFormCreate={handleFormCreate}
        onFormDelete={handleFormDelete}
        onFormDuplicate={handleFormDuplicate}
        onFieldAdd={(fieldType, insertIndex) => handleFieldAdd(fieldType, insertIndex)}
        onFieldUpdate={handleFieldUpdate}
        onFieldDelete={handleFieldDelete}
        onFieldReorder={handleFieldReorder}
      >
        <Card className="min-h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl">{formConfig.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{formConfig.fields.length} fields</p>
            </div>
            <Button onClick={() => toast({ title: 'Form Saved', description: 'Form configuration saved successfully!' })}>
              <Save className="h-4 w-4 mr-2" />
              Save Form
            </Button>
          </CardHeader>
          <CardContent className="p-6 pb-8">
            <div className="space-y-4 max-w-none">
              {formConfig.fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <FieldConfigEditor
                    field={field}
                    onUpdate={(updates) => handleFieldUpdate(field.id, updates)}
                    onRemove={() => handleFieldDelete(field.id)}
                    availableFields={formConfig.fields.filter(f => f.id !== field.id)}
                  />
                  <FieldInsertButton 
                    onFieldAdd={(fieldType) => handleFieldAdd(fieldType, index + 1)}
                  />
                </div>
              ))}
              
              {formConfig.fields.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg mb-2">No fields added yet</p>
                  <p>Drag field types from the sidebar or use the + button to add fields</p>
                  <FieldInsertButton 
                    onFieldAdd={(fieldType) => handleFieldAdd(fieldType, 0)}
                    className="mt-4"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </FormBuilderLayout>
    );
  }

  const visibleFields = getVisibleFields();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{formConfig.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formConfig.description}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formConfig.fields
            .filter(field => field.enabled && visibleFields.has(field.id))
            .map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={(value) => updateFormData(field.id, value)}
                error={errors[field.id]}
                formData={formData}
              />
            ))}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : formConfig.submitButtonText}
          </Button>
          
          {formConfig.privacyText && (
            <p className="text-xs text-muted-foreground text-center">
              {formConfig.privacyText}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}