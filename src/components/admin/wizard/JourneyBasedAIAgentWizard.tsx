import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Bot,
  Route,
  Shield,
  BookOpen,
  Target,
  BarChart3,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import step components
import { AgentPurposeStep } from "./journey-steps/AgentPurposeStep";
import { AudienceScopeStep } from "./journey-steps/AudienceScopeStep";
import { JourneyIntegrationStep } from "./journey-steps/JourneyIntegrationStep";
import { PolicyConstraintsStep } from "./journey-steps/PolicyConstraintsStep";
import { PlaybookAccessStep } from "./journey-steps/PlaybookAccessStep";
import { ConfidenceSettingsStep } from "./journey-steps/ConfidenceSettingsStep";
import { ReviewLaunchStep } from "./journey-steps/ReviewLaunchStep";
// New interface for journey-based AI agents
export interface JourneyAIAgentData {
  // Agent Purpose & Type
  name: string;
  description: string;
  purpose: 'applicant_nurture' | 'incomplete_docs' | 'interview_followup' | 'high_yield_conversion' | 'custom';
  customPurpose?: string;

  // Audience Scope
  targetCriteria: {
    programs: string[];
    stages: string[];
    geography: string[];
    scoreRange: { min: number; max: number };
    studentType: 'domestic' | 'international' | 'all';
  };
  estimatedAudienceSize: number;

  // Academic Journey Awareness
  journeyPaths: string[];
  autoAdjustByStage: boolean;
  stageSpecificBehaviors: Record<string, any>;

  // Policy Constraints
  dailyActionLimits: { maxActionsPerStudent: number; maxTotalActions: number };
  approvedChannels: ('email' | 'sms' | 'in_app' | 'phone')[];
  toneGuide: 'formal' | 'friendly' | 'casual';
  escalationRules: {
    maxAttempts: number;
    escalateAfterHours: number;
    notifyHumans: boolean;
  };

  // Playbook Access
  availablePlays: string[];
  defaultPlaysByTrigger: Record<string, string>;
  fallbackPlay?: string;

  // Confidence Thresholds
  confidenceSettings: {
    autoActThreshold: number; // >X% auto-act
    askApprovalRange: { min: number; max: number }; // X%-Y% ask approval
    skipThreshold: number; // <X% never act
  };

  // Analytics & Monitoring
  analyticsConfig: {
    trackConversions: boolean;
    trackEngagement: boolean;
    generateReports: boolean;
    alertOnAnomalies: boolean;
  };
}

interface JourneyBasedAIAgentWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAgent?: any;
  onSave: (agent: any) => void;
}

const WIZARD_STEPS = [
  {
    id: 'purpose',
    title: 'Agent Purpose',
    description: 'Define what this AI agent will do and for whom',
    icon: Target,
    color: 'text-blue-600'
  },
  {
    id: 'audience',
    title: 'Audience Scope',
    description: 'Set target criteria and audience parameters',
    icon: Route,
    color: 'text-green-600'
  },
  {
    id: 'journey',
    title: 'Journey Integration',
    description: 'Connect to academic journeys and stages',
    icon: Route,
    color: 'text-purple-600'
  },
  {
    id: 'policies',
    title: 'Policy Constraints',
    description: 'Set guardrails and escalation rules',
    icon: Shield,
    color: 'text-red-600'
  },
  {
    id: 'playbooks',
    title: 'Playbook Access',
    description: 'Choose available actions and plays',
    icon: BookOpen,
    color: 'text-orange-600'
  },
  {
    id: 'confidence',
    title: 'Confidence Settings',
    description: 'Configure decision-making thresholds',
    icon: Brain,
    color: 'text-indigo-600'
  },
  {
    id: 'review',
    title: 'Review & Launch',
    description: 'Review configuration and activate agent',
    icon: BarChart3,
    color: 'text-emerald-600'
  }
];

export function JourneyBasedAIAgentWizard({ open, onOpenChange, editingAgent, onSave }: JourneyBasedAIAgentWizardProps) {
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);

  const [agentData, setAgentData] = useState<JourneyAIAgentData>({
    name: "",
    description: "",
    purpose: 'applicant_nurture',
    targetCriteria: {
      programs: [],
      stages: [],
      geography: [],
      scoreRange: { min: 0, max: 100 },
      studentType: 'all'
    },
    estimatedAudienceSize: 0,
    journeyPaths: [],
    autoAdjustByStage: true,
    stageSpecificBehaviors: {},
    dailyActionLimits: { maxActionsPerStudent: 3, maxTotalActions: 100 },
    approvedChannels: ['email', 'sms'],
    toneGuide: 'friendly',
    escalationRules: {
      maxAttempts: 3,
      escalateAfterHours: 24,
      notifyHumans: true
    },
    availablePlays: [],
    defaultPlaysByTrigger: {},
    confidenceSettings: {
      autoActThreshold: 80,
      askApprovalRange: { min: 60, max: 80 },
      skipThreshold: 60
    },
    analyticsConfig: {
      trackConversions: true,
      trackEngagement: true,
      generateReports: true,
      alertOnAnomalies: true
    }
  });

  // Initialize with editing agent data
  useEffect(() => {
    if (editingAgent && open) {
      setAgentData(prev => ({
        ...prev,
        name: editingAgent.name || "",
        description: editingAgent.description || "",
        // Map other existing fields...
      }));
    }
  }, [editingAgent, open]);

  const updateAgentData = useCallback((updates: Partial<JourneyAIAgentData>) => {
    setAgentData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Purpose
        return agentData.name.trim().length > 0 && agentData.description.trim().length > 0;
      case 1: // Audience
        return agentData.targetCriteria.programs.length > 0;
      case 2: // Journey
        return agentData.journeyPaths.length > 0;
      case 3: // Policies
        return agentData.approvedChannels.length > 0;
      case 4: // Playbooks
        return agentData.availablePlays.length > 0;
      case 5: // Confidence
        return agentData.confidenceSettings.autoActThreshold > 0;
      case 6: // Review
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Incomplete Step",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSave = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      // Map wizard data to agent format
      const agentPayload = {
        name: agentData.name,
        description: agentData.description,
        agent_type: 'lead',
        agent_category: 'journey_based',
        configuration: agentData,
        is_active: true
      };

      onSave(agentPayload);
      setIsCompleted(true);
      
      toast({
        title: "Success!",
        description: `AI agent "${agentData.name}" has been ${editingAgent ? 'updated' : 'created'} successfully.`
      });
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: "Error",
        description: "Failed to save the AI agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isCompleted) {
      setIsCompleted(false);
      setCurrentStep(0);
      setCreatedAgentId(null);
      // Reset agent data
      setAgentData({
        name: "",
        description: "",
        purpose: 'applicant_nurture',
        targetCriteria: {
          programs: [],
          stages: [],
          geography: [],
          scoreRange: { min: 0, max: 100 },
          studentType: 'all'
        },
        estimatedAudienceSize: 0,
        journeyPaths: [],
        autoAdjustByStage: true,
        stageSpecificBehaviors: {},
        dailyActionLimits: { maxActionsPerStudent: 3, maxTotalActions: 100 },
        approvedChannels: ['email', 'sms'],
        toneGuide: 'friendly',
        escalationRules: {
          maxAttempts: 3,
          escalateAfterHours: 24,
          notifyHumans: true
        },
        availablePlays: [],
        defaultPlaysByTrigger: {},
        confidenceSettings: {
          autoActThreshold: 80,
          askApprovalRange: { min: 60, max: 80 },
          skipThreshold: 60
        },
        analyticsConfig: {
          trackConversions: true,
          trackEngagement: true,
          generateReports: true,
          alertOnAnomalies: true
        }
      });
    }
    onOpenChange(false);
  };

  const renderStepContent = () => {
    if (isCompleted) {
      return (
        <div className="text-center py-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Agent Created Successfully!</h3>
          <p className="text-muted-foreground mb-6">
            Your AI agent "{agentData.name}" is now active and ready to start working.
          </p>
          <Button onClick={handleClose}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Done
          </Button>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return <AgentPurposeStep data={agentData} updateData={updateAgentData} />;
      case 1:
        return <AudienceScopeStep data={agentData} updateData={updateAgentData} />;
      case 2:
        return <JourneyIntegrationStep data={agentData} updateData={updateAgentData} />;
      case 3:
        return <PolicyConstraintsStep data={agentData} updateData={updateAgentData} />;
      case 4:
        return <PlaybookAccessStep data={agentData} updateData={updateAgentData} />;
      case 5:
        return <ConfidenceSettingsStep data={agentData} updateData={updateAgentData} />;
      case 6:
        return <ReviewLaunchStep data={agentData} updateData={updateAgentData} onSave={handleSave} isSaving={isSaving} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden flex flex-col">
        {!isCompleted && (
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              {editingAgent ? 'Edit Journey-Based AI Agent' : 'Create Journey-Based AI Agent'}
            </DialogTitle>
            
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Step {currentStep + 1} of {WIZARD_STEPS.length}
                </span>
                <span className="font-medium">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {WIZARD_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <StepIcon className="h-3 w-3" />
                    <span className="hidden sm:block">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </DialogHeader>
        )}

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {!isCompleted && (
          <div className="border-t pt-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < WIZARD_STEPS.length - 1 ? (
                <Button onClick={nextStep} disabled={!validateCurrentStep()}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={!validateCurrentStep() || isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {editingAgent ? 'Update Agent' : 'Create Agent'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}