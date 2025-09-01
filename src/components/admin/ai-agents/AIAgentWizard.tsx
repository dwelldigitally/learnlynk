import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { AIAgentWizardData } from "@/types/ai-agent";
import { AgentPurposeStep } from "./wizard-steps/AgentPurposeStep";
import { ConfidenceThresholdsStep } from "./wizard-steps/ConfidenceThresholdsStep";
import { PersonalityToneStep } from "./wizard-steps/PersonalityToneStep";
import { ChannelsStep } from "./wizard-steps/ChannelsStep";
import { IntegrationStep } from "./wizard-steps/IntegrationStep";
import { GuardrailsStep } from "./wizard-steps/GuardrailsStep";
import { ReviewLaunchStep } from "./wizard-steps/ReviewLaunchStep";

const STEPS = [
  { id: 1, title: "Agent Purpose", description: "Define scope and boundaries" },
  { id: 2, title: "Confidence Thresholds", description: "Set decision-making levels" },
  { id: 3, title: "Personality & Tone", description: "Configure communication style" },
  { id: 4, title: "Allowed Channels", description: "Select communication methods" },
  { id: 5, title: "Journey Integration", description: "Connect with journeys and plays" },
  { id: 6, title: "Guardrails", description: "Set safety boundaries" },
  { id: 7, title: "Review & Launch", description: "Finalize and deploy agent" }
];

interface AIAgentWizardProps {
  onComplete: (data: AIAgentWizardData) => void;
  onCancel: () => void;
}

export function AIAgentWizard({ onComplete, onCancel }: AIAgentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AIAgentWizardData>({
    name: "",
    description: "",
    scope: "",
    functionalBoundaries: [],
    confidenceThresholds: {
      fullAutoAction: 90,
      suggestionOnly: { min: 60, max: 89 },
      noAction: 60
    },
    personality: {
      tone: 'friendly',
      messageTemplates: {}
    },
    allowedChannels: {
      email: true,
      sms: false,
      whatsapp: false,
      phone: false
    },
    journeyIntegration: {
      canOverrideSteps: false,
      canTriggerPlays: true,
      allowedJourneys: [],
      allowedPlays: []
    },
    guardrails: {
      maxMessagesPerDay: 5,
      forbiddenTopics: [],
      excludedStudentGroups: [],
      complianceRules: ['FERPA', 'PIPEDA']
    }
  });

  const updateData = (updates: Partial<AIAgentWizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.name && data.scope && data.functionalBoundaries.length > 0;
      case 2:
        return data.confidenceThresholds.fullAutoAction >= data.confidenceThresholds.suggestionOnly.max;
      case 3:
        return data.personality.tone;
      case 4:
        return Object.values(data.allowedChannels).some(Boolean);
      case 5:
        return true; // Optional step
      case 6:
        return data.guardrails.maxMessagesPerDay > 0;
      default:
        return true;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AgentPurposeStep data={data} updateData={updateData} />;
      case 2:
        return <ConfidenceThresholdsStep data={data} updateData={updateData} />;
      case 3:
        return <PersonalityToneStep data={data} updateData={updateData} />;
      case 4:
        return <ChannelsStep data={data} updateData={updateData} />;
      case 5:
        return <IntegrationStep data={data} updateData={updateData} />;
      case 6:
        return <GuardrailsStep data={data} updateData={updateData} />;
      case 7:
        return <ReviewLaunchStep data={data} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create AI Agent</h1>
        <p className="text-muted-foreground">
          Build an autonomous agent that can handle admissions counselor tasks
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step.id < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : step.id === currentStep
                  ? 'bg-primary/20 text-primary border-2 border-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < STEPS.length && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : prevStep}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}