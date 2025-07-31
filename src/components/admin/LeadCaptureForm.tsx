import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { LeadSource } from '@/types/lead';
import { Copy, Eye, Code } from 'lucide-react';

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
  const { toast } = useToast();

  const programs = [
    'Health Care Assistant',
    'Aviation',
    'Education Assistant', 
    'Hospitality',
    'ECE',
    'MLA'
  ];

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

  if (!embedded) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Lead Capture Forms</h2>
            <p className="text-muted-foreground">Create and manage lead capture forms for your website</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEmbedCode(!showEmbedCode)}>
              <Code className="h-4 w-4 mr-2" />
              Embed Code
            </Button>
          </div>
        </div>

        {showEmbedCode && (
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
        )}

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
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Get Started Today</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tell us about your educational goals and we'll help you find the right program.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => updateFormData('first_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => updateFormData('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => updateFormData('country', e.target.value)}
              placeholder="e.g., Canada, United States"
            />
          </div>

          <div>
            <Label>Programs of Interest</Label>
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketing_consent"
              checked={formData.marketing_consent}
              onCheckedChange={(checked) => updateFormData('marketing_consent', checked)}
            />
            <Label htmlFor="marketing_consent" className="text-sm">
              I agree to receive marketing communications and updates about programs.
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Get Information'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting this form, you agree to our privacy policy and terms of service.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}