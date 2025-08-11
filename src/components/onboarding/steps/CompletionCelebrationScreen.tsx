import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OnboardingService } from '@/services/onboardingService';

interface CompletionCelebrationScreenProps {
  data: any;
  onboardingData: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const CompletionCelebrationScreen: React.FC<CompletionCelebrationScreenProps> = ({
  onboardingData,
  onNext
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);

  const handleEnterDashboard = async () => {
    setIsSaving(true);
    setSaveErrors([]);

    try {
      // Save all onboarding data to the database
      const { success, errors } = await OnboardingService.saveOnboardingData(onboardingData || {});
      
      if (success) {
        // Clear onboarding data and mark as complete
        await OnboardingService.clearOnboardingData();
        
        toast({
          title: "Welcome to your dashboard!",
          description: "Your onboarding data has been successfully saved.",
        });
        
        onNext();
      } else {
        setSaveErrors(errors);
        
        toast({
          title: "Some data couldn't be saved",
          description: "You can continue to your dashboard, but some configurations may need to be set up again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during completion:', error);
      setSaveErrors([error instanceof Error ? error.message : 'Unknown error occurred']);
      
      toast({
        title: "Error completing setup",
        description: "There was an error saving your data. You can still access your dashboard.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative mb-6">
          <CheckCircle className="w-20 h-20 text-success mx-auto" />
          <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          🎉 Congratulations!
        </h3>
        <p className="text-muted-foreground text-lg">
          Your institution is now fully configured and ready to use Learnlynk.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Institution Profile</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="flex items-center justify-between">
            <span>Programs ({onboardingData.programs?.length || 0})</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="flex items-center justify-between">
            <span>Payment Processing</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="flex items-center justify-between">
            <span>Lead Capture Forms</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
        </CardContent>
      </Card>

      {saveErrors.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-2">Some issues occurred while saving your data:</h4>
                <ul className="text-sm text-destructive/80 space-y-1">
                  {saveErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Button onClick={handleEnterDashboard} size="lg" disabled={isSaving} className="bg-primary hover:bg-primary-hover">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving Your Setup...
            </>
          ) : (
            <>
              Enter Your Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CompletionCelebrationScreen;