import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Users, Globe, ArrowRight, BookOpen } from 'lucide-react';
import { MasterJourneyService } from '@/services/masterJourneyService';
import { toast } from 'sonner';

interface MasterJourneySetupWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function MasterJourneySetupWizard({ onComplete, onSkip }: MasterJourneySetupWizardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMasterTemplates, setHasMasterTemplates] = useState(false);
  const [step, setStep] = useState<'check' | 'setup' | 'complete'>('check');

  useEffect(() => {
    checkMasterTemplates();
  }, []);

  const checkMasterTemplates = async () => {
    try {
      const exists = await MasterJourneyService.checkMasterTemplatesExist();
      setHasMasterTemplates(exists);
      
      if (exists) {
        setStep('complete');
      } else {
        setStep('setup');
      }
    } catch (error) {
      console.error('Error checking master templates:', error);
      setStep('setup');
    }
  };

  const createMasterTemplates = async () => {
    setIsLoading(true);
    try {
      await MasterJourneyService.createMasterTemplates();
      setHasMasterTemplates(true);
      setStep('complete');
      toast.success('Master journey templates created successfully!');
    } catch (error) {
      console.error('Error creating master templates:', error);
      toast.error('Failed to create master templates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'check') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Checking Master Journey Templates
          </CardTitle>
          <CardDescription>
            Verifying your journey template configuration...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'complete') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Master Journey Templates Ready
          </CardTitle>
          <CardDescription>
            Your master journey templates are configured and ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Master templates for both domestic and international students are now available. 
              These templates will be automatically applied to all programs unless you create custom journeys.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end gap-2">
            <Button onClick={onComplete} className="flex items-center gap-2">
              Continue to Journey Management <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Master Journey Setup Required
        </CardTitle>
        <CardDescription>
          Before you can manage academic journeys, you need to set up master journey templates for different student types.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            Master journey templates define the standard enrollment process for your institution. 
            These templates will be applied to all programs by default, ensuring consistency across your offerings.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Domestic Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">Standard process:</div>
              <ul className="text-sm space-y-1">
                <li>• Lead Capture</li>
                <li>• Application Start</li>
                <li>• Prerequisites Review</li>
                <li>• Document Submission</li>
                <li>• Admission Interview</li>
                <li>• Admission Decision</li>
                <li>• Contract Signing</li>
                <li>• Deposit Payment</li>
                <li>• Enrollment Complete</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                International Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">Enhanced process:</div>
              <ul className="text-sm space-y-1">
                <li>• Lead Capture</li>
                <li>• Application Start</li>
                <li>• Prerequisites Review</li>
                <li>• English Proficiency Test</li>
                <li>• Document Submission</li>
                <li>• Admission Interview</li>
                <li>• Admission Decision</li>
                <li>• Visa Application Support</li>
                <li>• Contract Signing</li>
                <li>• Deposit Payment</li>
                <li>• Enrollment Complete</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip For Now
          </Button>
          <Button 
            onClick={createMasterTemplates}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Templates...
              </>
            ) : (
              <>
                Create Master Templates <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}