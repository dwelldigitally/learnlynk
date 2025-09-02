import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Match the programs available in the student portal
const AVAILABLE_PROGRAMS = [
  'Health Care Assistant',
  'Education Assistant', 
  'Aviation',
  'Hospitality',
  'ECE',
  'MLA'
];

interface EmbeddableWebFormProps {
  onSuccess?: (data: { accessToken: string; portalUrl: string }) => void;
  customStyles?: React.CSSProperties;
  embedConfig?: {
    title?: string;
    description?: string;
    submitButtonText?: string;
    successMessage?: string;
  };
}

export const EmbeddableWebForm: React.FC<EmbeddableWebFormProps> = ({ 
  onSuccess, 
  customStyles = {},
  embedConfig = {}
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    programInterest: ''
  });

  const config = {
    title: embedConfig.title || 'Apply Now',
    description: embedConfig.description || 'Submit your application to get started with your educational journey.',
    submitButtonText: embedConfig.submitButtonText || 'Submit Application',
    successMessage: embedConfig.successMessage || 'Thank you for your application! We will contact you soon.'
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.programInterest) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-document-form', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: '',
          country: '',
          programInterest: [formData.programInterest],
          notes: `Application submitted via embedded webform for ${formData.programInterest}`,
          applicationType: 'embedded-webform'
        }
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "We will contact you soon with next steps.",
      });

      // Log success data for debugging
      console.log('Form submission successful:', {
        accessToken: data?.accessToken,
        portalUrl: data?.portalUrl,
        hasOnSuccess: !!onSuccess,
        isInIframe: window.parent !== window
      });

      // Send success message to parent window if embedded
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'WEBFORM_SUCCESS',
          data: {
            accessToken: data?.accessToken,
            portalUrl: data?.portalUrl
          }
        }, '*');
      }

      if (onSuccess && data?.accessToken && data?.portalUrl) {
        onSuccess({
          accessToken: data.accessToken,
          portalUrl: data.portalUrl
        });
      } else if (data?.portalUrl) {
        // Redirect after a short delay to show success message
        setTimeout(() => {
          console.log('Redirecting to portal:', data.portalUrl);
          window.location.href = data.portalUrl;
        }, 2000);
      } else {
        console.error('No portal URL received from server');
        toast({
          title: "Portal Access Issue",
          description: "Application submitted but unable to redirect to portal. Check your email for access.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData: formData
      });
      
      toast({
        title: "Submission Failed",
        description: error instanceof Error && error.message.includes('portal') 
          ? "Application submitted but unable to create portal access. Please contact support."
          : "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={customStyles} className="min-h-[400px] flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-700">Success!</h2>
              <p className="text-muted-foreground">
                {config.successMessage}
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to your portal...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={customStyles} className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">{config.title}</CardTitle>
          {config.description && (
            <p className="text-center text-muted-foreground">{config.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Program of Interest *</Label>
              <Select
                value={formData.programInterest}
                onValueChange={(value) => handleInputChange('programInterest', value)}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_PROGRAMS.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {config.submitButtonText}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbeddableWebForm;