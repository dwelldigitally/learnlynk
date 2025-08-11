import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GlassCard } from '@/components/modern/GlassCard';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

// Step Components
import CompanySetupScreen from './steps/CompanySetupScreen';
import WebsiteScanningScreen from './steps/WebsiteScanningScreen';
import ProgramSetupScreen from './steps/ProgramSetupScreen';
import RequirementsSetupScreen from './steps/RequirementsSetupScreen';
import FormBuilderScreen from './steps/FormBuilderScreen';
import PaymentSetupScreen from './steps/PaymentSetupScreen';
import EventSetupScreen from './steps/EventSetupScreen';
import TeamSetupScreen from './steps/TeamSetupScreen';
import SystemTrainingScreen from './steps/SystemTrainingScreen';
import CompletionCelebrationScreen from './steps/CompletionCelebrationScreen';

interface OnboardingData {
  company: any;
  websiteData: any;
  programs: any[];
  requirements: any[];
  forms: any[];
  paymentConfig: any;
  events: any[];
  team: any[];
  trainingProgress: any;
}

const ONBOARDING_STEPS = [
  { id: 'company', title: 'Company Setup', description: 'Configure your institution profile' },
  { id: 'website', title: 'Website Analysis', description: 'AI-powered website scanning' },
  { id: 'programs', title: 'Program Setup', description: 'Add your academic programs' },
  { id: 'requirements', title: 'Requirements', description: 'Set up application requirements' },
  { id: 'forms', title: 'Lead Capture', description: 'Create application forms' },
  { id: 'payment', title: 'Payment Setup', description: 'Configure Stripe integration' },
  { id: 'events', title: 'Events (Optional)', description: 'Set up important events' },
  { id: 'team', title: 'Team Setup', description: 'Add team members' },
  { id: 'training', title: 'System Training', description: 'Learn how to use the system' },
  { id: 'completion', title: 'Welcome!', description: 'You are ready to go' }
];

const ComprehensiveOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    company: {},
    websiteData: {},
    programs: [],
    requirements: [],
    forms: [],
    paymentConfig: {},
    events: [],
    team: [],
    trainingProgress: {}
  });
  const [isStepComplete, setIsStepComplete] = useState<boolean[]>(new Array(ONBOARDING_STEPS.length).fill(false));

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep) / (ONBOARDING_STEPS.length - 1)) * 100;

  useEffect(() => {
    // Load saved onboarding progress
    const savedProgress = localStorage.getItem('onboarding-progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setCurrentStep(parsed.currentStep || 0);
        setOnboardingData(parsed.data || onboardingData);
        setIsStepComplete(parsed.completedSteps || isStepComplete);
      } catch (error) {
        console.error('Failed to load onboarding progress:', error);
      }
    }
  }, []);

  const saveProgress = (stepData: any, stepIndex: number = currentStep) => {
    const updatedData = { ...onboardingData };
    const stepKey = ONBOARDING_STEPS[stepIndex].id as keyof OnboardingData;
    updatedData[stepKey] = stepData;
    
    setOnboardingData(updatedData);
    
    const progressData = {
      currentStep: stepIndex,
      data: updatedData,
      completedSteps: isStepComplete
    };
    
    localStorage.setItem('onboarding-progress', JSON.stringify(progressData));
  };

  const handleStepComplete = (stepData: any) => {
    const newCompletedSteps = [...isStepComplete];
    newCompletedSteps[currentStep] = true;
    setIsStepComplete(newCompletedSteps);
    
    saveProgress(stepData);
    
    toast({
      title: "Step Completed!",
      description: `${currentStepData.title} has been configured successfully.`,
    });
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete onboarding
      localStorage.removeItem('onboarding-progress');
      localStorage.setItem('onboarding-completed', 'true');
      navigate('/admin');
      toast({
        title: "Welcome to Learnlynk!",
        description: "Your institution is now fully configured and ready to use.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkipStep = () => {
    handleNext();
  };

  const renderCurrentStep = () => {
    const stepProps = {
      data: onboardingData[ONBOARDING_STEPS[currentStep].id as keyof OnboardingData],
      onComplete: handleStepComplete,
      onNext: handleNext,
      onSkip: handleSkipStep
    };

    switch (ONBOARDING_STEPS[currentStep].id) {
      case 'company':
        return <CompanySetupScreen {...stepProps} />;
      case 'website':
        return <WebsiteScanningScreen {...stepProps} />;
      case 'programs':
        return <ProgramSetupScreen {...stepProps} websiteData={onboardingData.websiteData} />;
      case 'requirements':
        return <RequirementsSetupScreen {...stepProps} programs={onboardingData.programs} />;
      case 'forms':
        return <FormBuilderScreen {...stepProps} />;
      case 'payment':
        return <PaymentSetupScreen {...stepProps} />;
      case 'events':
        return <EventSetupScreen {...stepProps} />;
      case 'team':
        return <TeamSetupScreen {...stepProps} />;
      case 'training':
        return <SystemTrainingScreen {...stepProps} />;
      case 'completion':
        return <CompletionCelebrationScreen {...stepProps} onboardingData={onboardingData} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header with Progress - Full Width */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border w-full">
        <div className="w-full px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img 
                  src="/lovable-uploads/48c3582c-ccc2-44ba-a7b2-4baa993dc1d8.png" 
                  alt="Learnlynk Logo" 
                  className="h-8"
                />
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Institution Setup</h1>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {ONBOARDING_STEPS.length}: {currentStepData.title}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{Math.round(progress)}% Complete</div>
                <div className="text-xs text-muted-foreground">{ONBOARDING_STEPS.length - currentStep - 1} steps remaining</div>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>
      </div>

      {/* Main Content - Centered with Max Width */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {ONBOARDING_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center min-w-[120px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index === currentStep
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="text-xs text-center mt-2">
                  <div className={`font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
              </div>
              {index < ONBOARDING_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 transition-colors ${
                    index < currentStep ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <GlassCard className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">{currentStepData.title}</h2>
            <p className="text-muted-foreground">{currentStepData.description}</p>
          </div>
          
          {renderCurrentStep()}
        </GlassCard>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="glass-button"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous
          </Button>

          <div className="flex space-x-3">
            {ONBOARDING_STEPS[currentStep].id !== 'completion' && (
              <Button
                variant="outline"
                onClick={handleSkipStep}
                className="glass-button"
              >
                Skip This Step
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!isStepComplete[currentStep] && ONBOARDING_STEPS[currentStep].id !== 'completion'}
              className="bg-primary hover:bg-primary-hover neo-button"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveOnboarding;