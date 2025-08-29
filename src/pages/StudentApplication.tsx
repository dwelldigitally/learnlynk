import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, User, BookOpen, FileText, CreditCard } from 'lucide-react';
import { LeadService } from '@/services/leadService';
import { StudentPortalService } from '@/services/studentPortalService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  programInterest: string[];
  previousEducation: string;
  workExperience: string;
  personalStatement: string;
  howDidYouHear: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

const AVAILABLE_PROGRAMS = [
  'Computer Science',
  'Business Administration', 
  'Healthcare Management',
  'Digital Marketing',
  'Cybersecurity',
  'Data Analytics',
  'Project Management',
  'Graphic Design'
];

const HOW_DID_YOU_HEAR_OPTIONS = [
  'Google Search',
  'Social Media',
  'Friend/Family Referral',
  'Advertisement',
  'Education Fair',
  'Website',
  'Email Campaign',
  'Other'
];

export default function StudentApplication() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    emergencyContactName: '',
    emergencyContactPhone: '',
    programInterest: [],
    previousEducation: '',
    workExperience: '',
    personalStatement: '',
    howDidYouHear: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProgramToggle = (program: string) => {
    setFormData(prev => ({
      ...prev,
      programInterest: prev.programInterest.includes(program)
        ? prev.programInterest.filter(p => p !== program)
        : [...prev.programInterest, program]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 2:
        return !!(formData.address && formData.city && formData.state && formData.zipCode);
      case 3:
        return formData.programInterest.length > 0;
      case 4:
        return !!(formData.personalStatement && formData.howDidYouHear && formData.agreeToTerms);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For public webform submissions, we don't require admin authentication
      // Anonymous leads are allowed by RLS policy: "Allow anonymous lead creation from public forms"
      
      // Create lead as anonymous submission
      const leadData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        source: 'webform' as const,
        program_interest: formData.programInterest,
        notes: `Personal Statement: ${formData.personalStatement}\n\nPrevious Education: ${formData.previousEducation}\n\nWork Experience: ${formData.workExperience}\n\nHow they heard about us: ${formData.howDidYouHear}`,
        utm_source: 'webform',
        utm_medium: 'application',
        user_id: null, // Anonymous submission - no admin user required
        source_details: 'Online Application Form',
        tags: ['webform-application', ...formData.programInterest.map(p => p.toLowerCase().replace(/\s+/g, '-'))]
      };

      const leadResult = await LeadService.createLead(leadData);
      
      if (leadResult.error || !leadResult.data) {
        throw new Error('Failed to create lead: ' + (leadResult.error?.message || 'Unknown error'));
      }
      
      const lead = leadResult.data;

      // Create student portal access record using the new table
      const accessToken = `portal_${lead.id}_${Date.now()}`;
      
      // Create portal access record in the new table
      const { error: portalError } = await supabase
        .from('student_portal_access')
        .insert({
          access_token: accessToken,
          lead_id: lead.id,
          student_name: `${formData.firstName} ${formData.lastName}`,
          application_date: new Date().toISOString(),
          programs_applied: formData.programInterest,
          status: 'active'
        });

      if (portalError) {
        console.error('Error creating portal access:', portalError);
        // Continue anyway, don't fail the whole process
      }
      
      // Create portal configuration for admin management
      const portalConfig = {
        portal_title: `${formData.firstName}'s Student Portal`,
        welcome_message: `Welcome ${formData.firstName}! Track your application progress here.`,
        features: {
          application_tracking: true,
          fee_payments: true,
          message_center: true,
          document_upload: true,
          advisor_contact: true,
          event_registration: true
        },
        custom_settings: {
          lead_id: lead.id,
          access_token: accessToken,
          student_name: `${formData.firstName} ${formData.lastName}`,
          application_date: new Date().toISOString(),
          programs_applied: formData.programInterest
        }
      };

      await StudentPortalService.createOrUpdatePortalConfig(portalConfig);

      // Create welcome content
      const welcomeContent = {
        title: 'Application Submitted Successfully',
        content: `Dear ${formData.firstName},\n\nThank you for submitting your application! We have received your application for the following programs:\n\n${formData.programInterest.map(p => '• ' + p).join('\n')}\n\nOur admissions team will review your application and contact you within 3-5 business days.\n\nYou can track your application status using this portal.`,
        content_type: 'announcement' as const,
        priority: 'high' as const,
        is_published: true,
        publish_date: new Date().toISOString(),
        target_audience: [lead.id]
      };

      await StudentPortalService.createPortalContent(welcomeContent);

      toast({
        title: "Application Submitted Successfully!",
        description: "You will be redirected to your student portal."
      });

      // Redirect to existing student portal
      setTimeout(() => {
        navigate(`/student?token=${accessToken}`);
      }, 2000);

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Address Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h4 className="font-medium">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Program Selection & Background</h3>
            </div>
            
            <div>
              <Label className="text-base font-medium">Programs of Interest *</Label>
              <p className="text-sm text-muted-foreground mb-3">Select all programs you're interested in:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {AVAILABLE_PROGRAMS.map((program) => (
                  <div key={program} className="flex items-center space-x-2">
                    <Checkbox
                      id={program}
                      checked={formData.programInterest.includes(program)}
                      onCheckedChange={() => handleProgramToggle(program)}
                    />
                    <Label htmlFor={program} className="text-sm">{program}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="previousEducation">Previous Education</Label>
              <Textarea
                id="previousEducation"
                placeholder="Tell us about your educational background..."
                value={formData.previousEducation}
                onChange={(e) => handleInputChange('previousEducation', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="workExperience">Work Experience</Label>
              <Textarea
                id="workExperience"
                placeholder="Describe your relevant work experience..."
                value={formData.workExperience}
                onChange={(e) => handleInputChange('workExperience', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Final Details</h3>
            </div>

            <div>
              <Label htmlFor="personalStatement">Personal Statement *</Label>
              <Textarea
                id="personalStatement"
                placeholder="Tell us why you want to join our programs and your career goals..."
                value={formData.personalStatement}
                onChange={(e) => handleInputChange('personalStatement', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="howDidYouHear">How did you hear about us? *</Label>
              <Select value={formData.howDidYouHear} onValueChange={(value) => handleInputChange('howDidYouHear', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {HOW_DID_YOU_HEAR_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  required
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the <span className="text-primary underline cursor-pointer">Terms and Conditions</span> and 
                  <span className="text-primary underline cursor-pointer"> Privacy Policy</span> *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToMarketing"
                  checked={formData.agreeToMarketing}
                  onCheckedChange={(checked) => handleInputChange('agreeToMarketing', checked)}
                />
                <Label htmlFor="agreeToMarketing" className="text-sm">
                  I would like to receive marketing communications about programs, events, and opportunities
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Application</h1>
          <p className="text-gray-600">Complete your application to get started on your educational journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              Please fill out all required fields to complete your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}