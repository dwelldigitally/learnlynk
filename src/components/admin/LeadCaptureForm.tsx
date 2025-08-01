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
import { FormConfig, FormField, FormData, FormErrors } from '@/types/formBuilder';
import { FieldRenderer } from './formBuilder/FieldRenderer';
import { FieldConfigEditor } from './formBuilder/FieldConfigEditor';
import { ConditionalLogicEngine } from './formBuilder/ConditionalLogicEngine';
import { FormValidation } from './formBuilder/FormValidation';

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
  const [formConfig, setFormConfig] = useState<FormConfig>({
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
  });
  const { toast } = useToast();

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

  const saveFormConfig = () => {
    // Here you would typically save to a backend
    toast({
      title: 'Form Updated',
      description: 'Lead capture form configuration has been saved.'
    });
  };

  const addField = () => {
    const newField: FormField = {
      id: `custom_field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      enabled: true,
      placeholder: 'Enter value',
    };
    setFormConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const removeField = (fieldId: string) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  if (!embedded) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Lead Capture Forms</h2>
            <p className="text-muted-foreground">Create and manage lead capture forms for your website</p>
          </div>
        </div>

        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Form Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadCaptureForm embedded={true} formId="preview" onLeadCreated={onLeadCreated} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configure">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="form-title">Form Title</Label>
                      <Input
                        id="form-title"
                        value={formConfig.title}
                        onChange={(e) => setFormConfig(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="submit-button">Submit Button Text</Label>
                      <Input
                        id="submit-button"
                        value={formConfig.submitButtonText}
                        onChange={(e) => setFormConfig(prev => ({ ...prev, submitButtonText: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="form-description">Description</Label>
                    <Textarea
                      id="form-description"
                      value={formConfig.description}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="success-message">Success Message</Label>
                      <Textarea
                        id="success-message"
                        value={formConfig.successMessage || ''}
                        onChange={(e) => setFormConfig(prev => ({ ...prev, successMessage: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="error-message">Error Message</Label>
                      <Textarea
                        id="error-message"
                        value={formConfig.errorMessage || ''}
                        onChange={(e) => setFormConfig(prev => ({ ...prev, errorMessage: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Form Fields</CardTitle>
                    <Button onClick={addField} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formConfig.fields.map((field) => (
                      <FieldConfigEditor
                        key={field.id}
                        field={field}
                        onUpdate={(updates) => updateField(field.id, updates)}
                        onRemove={() => removeField(field.id)}
                        availableFields={formConfig.fields.filter(f => f.id !== field.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={saveFormConfig}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="embed">
            <Card>
              <CardHeader>
                <CardTitle>Embed Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Copy this code and paste it into your website where you want the lead form to appear:
                  </p>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{generateEmbedCode()}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={copyEmbedCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
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