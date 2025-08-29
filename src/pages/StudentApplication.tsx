import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { StudentPortalService } from '@/services/studentPortalService';
import { FormService } from '@/services/formService';
import { supabase } from '@/integrations/supabase/client';
import { useApplicationPrograms } from '@/hooks/useApplicationPrograms';
import { useApplicationIntakes } from '@/hooks/useApplicationIntakes';
import { CheckCircle, User, GraduationCap, Calendar, FileText, Send, Loader2 } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  programId: string;
  programName: string;
  intakeId: string;
  intakeDate: string;
}


export function StudentApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    programId: '',
    programName: '',
    intakeId: '',
    intakeDate: ''
  });

  // Fetch dynamic data
  const { data: programs = [], isLoading: programsLoading } = useApplicationPrograms();
  const { data: intakes = [], isLoading: intakesLoading } = useApplicationIntakes(formData.programId);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle program selection
  const handleProgramChange = (programId: string) => {
    const selectedProgram = programs.find(p => p.id === programId);
    updateFormData('programId', programId);
    updateFormData('programName', selectedProgram?.name || '');
    // Reset intake selection when program changes
    updateFormData('intakeId', '');
    updateFormData('intakeDate', '');
  };

  // Handle intake selection  
  const handleIntakeChange = (intakeId: string) => {
    const selectedIntake = intakes.find(i => i.id === intakeId);
    updateFormData('intakeId', intakeId);
    updateFormData('intakeDate', selectedIntake?.start_date || '');
  };

  const validateForm = (): boolean => {
    return formData.firstName.trim() !== '' && 
           formData.lastName.trim() !== '' && 
           formData.email.trim() !== '' &&
           formData.programId.trim() !== '';
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create student portal
      const portalData = {
        student_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        program: formData.programName,
        intake_date: formData.intakeDate
      };

      const portal = await StudentPortalService.createStudentPortal(portalData);

      // Create lead in admin system
      const leadData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        program_interest: [formData.programName],
        source: 'web' as const,
        status: 'new' as const,
        priority: 'medium' as const,
        notes: `Application submitted for ${formData.programName}${formData.intakeDate ? `. Intake: ${new Date(formData.intakeDate).toLocaleDateString()}` : ''}`,
        utm_source: 'student_application',
        utm_medium: 'web_form',
        utm_campaign: 'portal_creation'
      };

      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (leadError) throw leadError;

      // Create form submission record
      const submissionData = {
        form_id: 'student-application',
        submission_data: formData,
        student_portal_id: portal.id,
        lead_id: lead.id
      };

      await FormService.createFormSubmission('student-application', submissionData);

      setAccessToken(portal.access_token);
      setIsSuccess(true);

      toast({
        title: "Application Submitted!",
        description: "Your student portal has been created successfully.",
      });

    } catch (error) {
      console.error('Error creating student portal:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error processing your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePortalAccess = () => {
    window.open(`/student-portal/${accessToken}`, '_blank');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl text-primary">Application Successful!</CardTitle>
            <CardDescription className="text-lg">
              Your personalized student portal has been created
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">What's Next?</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Access your personalized portal for {formData.programName}</li>
                <li>• Track your application progress</li>
                <li>• Upload required documents</li>
                <li>• Connect with your admissions advisor</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handlePortalAccess} className="flex-1">
                Access Your Portal
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                Return to Home
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Portal Access Token: <code className="bg-muted px-2 py-1 rounded">{accessToken}</code></p>
              <p className="mt-1">Save this token to access your portal anytime</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Apply to Our College</h1>
          <p className="text-xl text-muted-foreground">Create your personalized student portal</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <User className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Student Application</CardTitle>
            <CardDescription>Tell us about yourself and your program interest</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    placeholder="Enter your country"
                  />
                </div>
              </div>

              {/* Program Selection */}
              <div>
                <Label htmlFor="program">Program of Interest *</Label>
                <Select 
                  value={formData.programId} 
                  onValueChange={handleProgramChange}
                  disabled={programsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={programsLoading ? "Loading programs..." : "Select a program"} />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{program.name}</span>
                          {program.type && (
                            <span className="text-sm text-muted-foreground">{program.type}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {programsLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading available programs...
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="intakeDate">Preferred Intake Date (Optional)</Label>
                <Select 
                  value={formData.intakeId} 
                  onValueChange={handleIntakeChange}
                  disabled={intakesLoading || !formData.programId}
                >
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={
                        !formData.programId 
                          ? "Please select a program first" 
                          : intakesLoading 
                            ? "Loading intake dates..." 
                            : "Select an intake date (optional)"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {intakes.map((intake) => (
                      <SelectItem key={intake.id} value={intake.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(intake.start_date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            {intake.delivery_method && `${intake.delivery_method} • `}
                            {intake.study_mode && `${intake.study_mode} • `}
                            {intake.campus && `${intake.campus} campus`}
                          </div>
                          {intake.application_deadline && (
                            <span className="text-xs text-orange-600">
                              Apply by: {new Date(intake.application_deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {intakesLoading && formData.programId && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading available intake dates...
                  </div>
                )}
                {formData.programId && intakes.length === 0 && !intakesLoading && (
                  <p className="text-sm text-orange-600 mt-1">
                    No upcoming intakes available for this program. Please contact admissions for more information.
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                onClick={handleSubmit} 
                disabled={!validateForm() || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}