import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { LeadSource } from '@/types/lead';
import { Copy, Eye, Code, Edit, Plus, Trash2, Save } from 'lucide-react';

interface LeadCaptureFormProps {
  onLeadCreated?: () => void;
  embedded?: boolean;
  formId?: string;
}

export function LeadCaptureForm({ onLeadCreated, embedded = false, formId }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
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
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formConfig, setFormConfig] = useState({
    title: 'Get Started Today',
    description: 'Tell us about your educational goals and we\'ll help you find the right program.',
    fields: [
      { id: 'first_name', label: 'First Name', type: 'text', required: true, enabled: true },
      { id: 'last_name', label: 'Last Name', type: 'text', required: true, enabled: true },
      { id: 'email', label: 'Email', type: 'email', required: true, enabled: true },
      { id: 'phone', label: 'Phone Number', type: 'tel', required: false, enabled: true },
      { id: 'country', label: 'Country', type: 'text', required: false, enabled: true },
      { id: 'program_interest', label: 'Programs of Interest', type: 'checkbox', required: false, enabled: true },
      { id: 'marketing_consent', label: 'Marketing Consent', type: 'consent', required: false, enabled: true }
    ],
    submitButtonText: 'Get Information',
    privacyText: 'By submitting this form, you agree to our privacy policy and terms of service.'
  });
  const [programs, setPrograms] = useState([
    'Health Care Assistant',
    'Aviation',
    'Education Assistant', 
    'Hospitality',
    'ECE',
    'MLA'
  ]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Capture UTM parameters from URL if not manually set
      const urlParams = new URLSearchParams(window.location.search);
      const leadDataWithUTM = {
        ...formData,
        utm_source: formData.utm_source || urlParams.get('utm_source') || '',
        utm_medium: formData.utm_medium || urlParams.get('utm_medium') || '',
        utm_campaign: formData.utm_campaign || urlParams.get('utm_campaign') || '',
        utm_content: urlParams.get('utm_content') || '',
        utm_term: urlParams.get('utm_term') || '',
        source_details: `Form ID: ${formId || 'default'}`,
        referrer_url: document.referrer,
        ip_address: '', // Would need backend to capture real IP
        user_agent: navigator.userAgent
      };

      await LeadService.createLead(leadDataWithUTM);
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        country: '',
        program_interest: [],
        source: 'web',
        marketing_consent: false,
        utm_source: '',
        utm_medium: '',
        utm_campaign: ''
      });
      
      if (onLeadCreated) {
        onLeadCreated();
      }
      
      toast({
        title: 'Success',
        description: 'Thank you for your interest! We\'ll be in touch soon.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleProgramInterest = (program: string) => {
    setFormData(prev => ({
      ...prev,
      program_interest: prev.program_interest.includes(program)
        ? prev.program_interest.filter(p => p !== program)
        : [...prev.program_interest, program]
    }));
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
    setEditMode(false);
    toast({
      title: 'Form Updated',
      description: 'Lead capture form configuration has been saved.'
    });
  };

  const addField = () => {
    const newField = {
      id: `custom_field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      enabled: true
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

  const updateField = (fieldId: string, updates: any) => {
    setFormConfig(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const addProgram = () => {
    setPrograms(prev => [...prev, 'New Program']);
  };

  const updateProgram = (index: number, value: string) => {
    setPrograms(prev => prev.map((program, i) => i === index ? value : program));
  };

  const removeProgram = (index: number) => {
    setPrograms(prev => prev.filter((_, i) => i !== index));
  };

  if (!embedded) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Lead Capture Forms</h2>
            <p className="text-muted-foreground">Create and manage lead capture forms for your website</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditMode(!editMode)}>
              <Edit className="h-4 w-4 mr-2" />
              {editMode ? 'Cancel Edit' : 'Edit Form'}
            </Button>
            <Button variant="outline" onClick={() => setShowEmbedCode(!showEmbedCode)}>
              <Code className="h-4 w-4 mr-2" />
              Embed Code
            </Button>
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
                  <div>
                    <Label htmlFor="form-title">Form Title</Label>
                    <Input
                      id="form-title"
                      value={formConfig.title}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="form-description">Description</Label>
                    <Textarea
                      id="form-description"
                      value={formConfig.description}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, description: e.target.value }))}
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
                      <div key={field.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={field.enabled}
                          onCheckedChange={(checked) => updateField(field.id, { enabled: checked })}
                        />
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            placeholder="Field Label"
                          />
                          <Select
                            value={field.type}
                            onValueChange={(value) => updateField(field.id, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="tel">Phone</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="consent">Consent</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={field.required}
                              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                            />
                            <Label className="text-sm">Required</Label>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Programs List</CardTitle>
                    <Button onClick={addProgram} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Program
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {programs.map((program, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={program}
                          onChange={(e) => updateProgram(index, e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProgram(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
          {formConfig.fields.filter(field => field.enabled).map((field) => {
            if (field.id === 'first_name' || field.id === 'last_name') {
              return null; // Handle these together below
            }
            
            if (field.id === 'program_interest') {
              return (
                <div key={field.id}>
                  <Label>{field.label}{field.required && ' *'}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {programs.map((program) => (
                      <div key={program} className="flex items-center space-x-2">
                        <Checkbox
                          id={program}
                          checked={formData.program_interest.includes(program)}
                          onCheckedChange={() => toggleProgramInterest(program)}
                        />
                        <Label htmlFor={program} className="text-sm">
                          {program}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            
            if (field.id === 'marketing_consent') {
              return (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing_consent"
                    checked={formData.marketing_consent}
                    onCheckedChange={(checked) => updateFormData('marketing_consent', checked)}
                  />
                  <Label htmlFor="marketing_consent" className="text-sm">
                    I agree to receive marketing communications and updates about programs.
                  </Label>
                </div>
              );
            }
            
            return (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}{field.required && ' *'}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    value={formData[field.id as keyof typeof formData] as string || ''}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    required={field.required}
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id as keyof typeof formData] as string || ''}
                    onChange={(e) => updateFormData(field.id, e.target.value)}
                    required={field.required}
                    placeholder={field.id === 'country' ? 'e.g., Canada, United States' : ''}
                  />
                )}
              </div>
            );
          })}
          
          {/* Handle first name and last name together if both are enabled */}
          {formConfig.fields.find(f => f.id === 'first_name')?.enabled && 
           formConfig.fields.find(f => f.id === 'last_name')?.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">
                  {formConfig.fields.find(f => f.id === 'first_name')?.label}
                  {formConfig.fields.find(f => f.id === 'first_name')?.required && ' *'}
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  required={formConfig.fields.find(f => f.id === 'first_name')?.required}
                />
              </div>
              <div>
                <Label htmlFor="last_name">
                  {formConfig.fields.find(f => f.id === 'last_name')?.label}
                  {formConfig.fields.find(f => f.id === 'last_name')?.required && ' *'}
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  required={formConfig.fields.find(f => f.id === 'last_name')?.required}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : formConfig.submitButtonText}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {formConfig.privacyText}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}