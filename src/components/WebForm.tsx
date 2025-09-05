import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { STANDARDIZED_PROGRAMS } from '@/constants/programs';

interface WebFormProps {
  onSuccess?: (data: { accessToken: string; portalUrl: string }) => void;
}

export const WebForm: React.FC<WebFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedIntakeDate, setSelectedIntakeDate] = useState<string>('');
  const [availableIntakeDates, setAvailableIntakeDates] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    programInterest: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle program selection and load intake dates from database
  const handleProgramChange = async (program: string) => {
    handleInputChange('programInterest', program);
    setSelectedIntakeDate(''); // Reset intake date when program changes
    setAvailableIntakeDates([]); // Clear previous intake dates
    
    if (!program) {
      setAvailableIntakeDates([]);
      return;
    }

    try {
      console.log('🔍 Fetching intake dates for program:', program);
      
      const currentDate = new Date();
      
      // Query intakes and join with programs to filter by program name
      const { data: intakes, error } = await supabase
        .from('intakes')
        .select(`
          *,
          programs (
            id,
            name
          )
        `)
        .eq('programs.name', program)
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('💥 Error fetching intakes:', error);
        throw error;
      }
      
      console.log('📅 Found intakes:', intakes);
      
      // Filter for future intakes and open status
      const programIntakes = (intakes || [])
        .filter(intake => {
          const intakeDate = new Date(intake.start_date);
          const isFuture = intakeDate > currentDate;
          const isOpen = intake.status === 'open';
          console.log(`Intake ${intake.name}: Future=${isFuture}, Open=${isOpen}, Date=${intake.start_date}`);
          return isFuture && isOpen;
        })
        .map(intake => ({
          id: intake.id,
          name: intake.name,
          start_date: intake.start_date,
          capacity: intake.capacity
        }))
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
      
      console.log('✅ Filtered program intakes:', programIntakes);
      setAvailableIntakeDates(programIntakes);
      
    } catch (error) {
      console.error('💥 Error fetching intake dates:', error);
      setAvailableIntakeDates([]);
      // Don't show error toast to users for this, as it's not critical
    }
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
      const selectedIntake = availableIntakeDates.find(d => d.id === selectedIntakeDate);
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
          preferredIntakeId: selectedIntakeDate || null
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
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {STANDARDIZED_PROGRAMS.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="intakeDate">Preferred Intake Date</Label>
            <Select 
              value={selectedIntakeDate} 
              onValueChange={setSelectedIntakeDate}
              disabled={!formData.programInterest || availableIntakeDates.length === 0 || isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.programInterest ? "Select intake date (optional)" : "Select program first"} />
              </SelectTrigger>
              <SelectContent>
                {availableIntakeDates.map((intake) => (
                  <SelectItem key={intake.id} value={intake.id}>
                    {intake.name} - {new Date(intake.start_date).toLocaleDateString()} ({intake.capacity} spots total)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.programInterest && availableIntakeDates.length === 0 && (
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