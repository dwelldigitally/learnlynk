import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePublicPrograms, Program } from '@/hooks/usePrograms';
import { usePublicIntakesByProgramName, Intake } from '@/hooks/useIntakes';

interface WebFormProps {
  onSuccess?: (data: { accessToken: string; portalUrl: string }) => void;
}

export const WebForm: React.FC<WebFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedIntakeId, setSelectedIntakeId] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    programInterest: ''
  });

  // Fetch programs and intakes from database
  const { data: programs = [], isLoading: programsLoading } = usePublicPrograms();
  const { data: availableIntakes = [], isLoading: intakesLoading } = usePublicIntakesByProgramName(formData.programInterest);

  // Reset intake when program changes
  useEffect(() => {
    setSelectedIntakeId('');
  }, [formData.programInterest]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle program selection
  const handleProgramChange = (program: string) => {
    handleInputChange('programInterest', program);
    setSelectedIntakeId(''); // Reset intake date when program changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.programInterest) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Include intake date information in notes if selected
      const selectedIntake = availableIntakes.find(d => d.id === selectedIntakeId);
      const intakeInfo = selectedIntake 
        ? `${formData.programInterest}\n\nPreferred Intake: ${selectedIntake.name} (${new Date(selectedIntake.start_date).toLocaleDateString()})`
        : formData.programInterest;

      const { data, error } = await supabase.functions.invoke('submit-document-form', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: '',
          country: '',
          programInterest: [formData.programInterest],
          notes: `Application submitted via webform for ${intakeInfo}`,
          applicationType: 'webform',
          preferredIntakeId: selectedIntakeId || null
        }
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      
      toast({
        title: "Application Submitted!",
        description: "You will be redirected to your student portal shortly."
      });

      // Call success callback or redirect
      if (onSuccess && data?.portalUrl && data?.accessToken) {
        setTimeout(() => {
          onSuccess({
            accessToken: data.accessToken,
            portalUrl: data.portalUrl
          });
        }, 2000);
      } else if (data?.portalUrl) {
        setTimeout(() => {
          window.location.href = data.portalUrl;
        }, 2000);
      }

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Application Submitted!</CardTitle>
          <CardDescription>
            Thank you for your interest. You'll be redirected to your student portal shortly.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Apply Now</CardTitle>
        <CardDescription>
          Start your educational journey with us
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="programInterest">Program of Interest *</Label>
            <Select 
              value={formData.programInterest} 
              onValueChange={handleProgramChange}
              disabled={isSubmitting || programsLoading}
            >
              <SelectTrigger>
                {programsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading programs...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select a program" />
                )}
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.name}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!programsLoading && programs.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">No programs available at this time</p>
            )}
          </div>

          <div>
            <Label htmlFor="intakeDate">Preferred Intake Date</Label>
            <Select 
              value={selectedIntakeId} 
              onValueChange={setSelectedIntakeId}
              disabled={!formData.programInterest || intakesLoading || availableIntakes.length === 0 || isSubmitting}
            >
              <SelectTrigger>
                {intakesLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading intakes...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={formData.programInterest ? "Select intake date (optional)" : "Select program first"} />
                )}
              </SelectTrigger>
              <SelectContent>
                {availableIntakes.map((intake) => (
                  <SelectItem key={intake.id} value={intake.id}>
                    {intake.name} - {new Date(intake.start_date).toLocaleDateString()} {intake.capacity && `(${intake.capacity} spots)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.programInterest && !intakesLoading && availableIntakes.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">No upcoming intake dates available for this program</p>
            )}
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
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};