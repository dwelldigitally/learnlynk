import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileService } from '@/services/profileService';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import SelectiveWebsiteScanner from './steps/SelectiveWebsiteScanner';
import CompanySetupScreen from './steps/CompanySetupScreen';

const STEPS = [
  {
    id: 'website',
    title: 'Website Scan',
    description: 'Quickly analyze your institution website',
    optional: true
  },
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Essential institution details',
    optional: false
  }
];

export const SimplifiedOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<any>({
    websiteData: null,
    companyData: null
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleWebsiteScanComplete = (data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      websiteData: data
    }));
    setCurrentStep(1);
  };

  const handleWebsiteScanSkip = () => {
    setCurrentStep(1);
  };

  const handleBasicInfoComplete = async (data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      companyData: data
    }));

    // Mark onboarding as complete
    if (user) {
      const { error } = await ProfileService.completeOnboarding(user.id);
      
      if (error) {
        console.error('Error completing onboarding:', error);
        toast.error('Failed to complete onboarding');
        return;
      }

      toast.success('Welcome! Let\'s complete your setup.');
      navigate('/admin/setup');
    }
  };

  const renderStep = () => {
    const step = STEPS[currentStep];
    
    switch (step.id) {
      case 'website':
        return (
          <SelectiveWebsiteScanner
            data={onboardingData.websiteData}
            onComplete={handleWebsiteScanComplete}
            onNext={() => setCurrentStep(1)}
            onSkip={handleWebsiteScanSkip}
          />
        );
      
      case 'basic-info':
        return (
          <CompanySetupScreen
            data={onboardingData.companyData}
            websiteData={onboardingData.websiteData}
            onComplete={handleBasicInfoComplete}
            onNext={() => handleBasicInfoComplete(onboardingData.companyData)}
            onSkip={() => {}} // No skip on basic info
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome to Your Institution Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Let's get you started in just 2 quick steps
              </p>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Step {currentStep + 1} of {STEPS.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {STEPS.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-1 ${
                    index === currentStep ? 'text-primary font-medium' : ''
                  }`}
                >
                  <span>{step.title}</span>
                  {step.optional && (
                    <span className="text-muted-foreground/60">(optional)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderStep()}
      </main>
    </div>
  );
};

export default SimplifiedOnboarding;
