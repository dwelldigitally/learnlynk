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
  Zap,
  Users,
  Settings,
  Brain,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIAgent } from "@/hooks/useAIAgent";

// Step Components
import { AgentIdentityStep } from "./steps/AgentIdentityStep";
import { CoreConfigurationStep } from "./steps/CoreConfigurationStep";
import { FilterRulesStep } from "./steps/FilterRulesStep";
import { TasksAutomationStep } from "./steps/TasksAutomationStep";
import { AdvancedSettingsStep } from "./steps/AdvancedSettingsStep";
import { ReviewActivationStep } from "./steps/ReviewActivationStep";
import { CongratulationsStep } from "./steps/CongratulationsStep";

export interface AIAgentData {
  // Step 1: Identity & Personality
  name: string;
  description: string;
  avatar: string | null;
  personality: 'professional' | 'friendly' | 'enthusiastic' | 'empathetic' | 'custom';
  customPersonality?: string;
  response_style: 'professional' | 'friendly' | 'casual';
  communication_tone: 'formal' | 'conversational' | 'warm' | 'direct';

  // Step 2: Core Configuration
  max_concurrent_leads: number;
  handoff_threshold: number;
  working_hours_start: string;
  working_hours_end: string;
  timezone: string;
  response_time_target: number;
  escalation_conditions: string[];

  // Step 3: Lead Filtering & Assignment
  specializations: string[];
  lead_sources: string[];
  priority_criteria: Record<string, any>;
  geographic_preferences: string[];
  program_preferences: string[];

  // Step 4: Tasks & Automation
  auto_follow_up: boolean;
  follow_up_intervals: number[];
  task_templates: string[];
  sequence_preferences: string[];
  notification_settings: Record<string, boolean>;

  // Step 5: Advanced Settings
  conversation_flows: Record<string, any>;
  integration_settings: Record<string, any>;
  reporting_preferences: string[];
  security_settings: Record<string, any>;
  compliance_requirements: string[];

  // Step 6: Review & Activation
  activation_mode: 'immediate' | 'scheduled' | 'manual';
  activation_date?: string;
  test_leads_count: number;
  performance_expectations: Record<string, any>;
}

interface AIAgentWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAgent?: any;
  onSave: (agent: any) => void;
}

const WIZARD_STEPS = [
  {
    id: 'identity',
    title: 'Agent Identity & Personality',
    description: 'Define your AI agent\'s name, appearance, and personality traits',
    icon: Bot,
    color: 'text-blue-600'
  },
  {
    id: 'configuration',
    title: 'Core Configuration',
    description: 'Set capacity limits, working hours, and handoff preferences',
    icon: Settings,
    color: 'text-green-600'
  },
  {
    id: 'filtering',
    title: 'Lead Filtering & Assignment',
    description: 'Configure which leads your agent will handle',
    icon: Users,
    color: 'text-purple-600'
  },
  {
    id: 'automation',
    title: 'Tasks & Automation',
    description: 'Set up automated workflows and task management',
    icon: Zap,
    color: 'text-orange-600'
  },
  {
    id: 'advanced',
    title: 'Advanced Settings',
    description: 'Configure integrations, security, and conversation flows',
    icon: Brain,
    color: 'text-indigo-600'
  },
  {
    id: 'review',
    title: 'Review & Activation',
    description: 'Review your configuration and activate your AI agent',
    icon: Trophy,
    color: 'text-emerald-600'
  }
];

export function AIAgentWizard({ open, onOpenChange, editingAgent, onSave }: AIAgentWizardProps) {
  const { toast } = useToast();
  const { createAgent, updateAgent } = useAIAgent();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);

  const [agentData, setAgentData] = useState<AIAgentData>({
    // Default values
    name: "",
    description: "",
    avatar: null,
    personality: 'professional',
    response_style: 'professional',
    communication_tone: 'conversational',
    max_concurrent_leads: 25,
    handoff_threshold: 75,
    working_hours_start: "09:00",
    working_hours_end: "17:00",
    timezone: "UTC",
    response_time_target: 2,
    escalation_conditions: [],
    specializations: [],
    lead_sources: [],
    priority_criteria: {},
    geographic_preferences: [],
    program_preferences: [],
    auto_follow_up: true,
    follow_up_intervals: [1, 3, 7],
    task_templates: [],
    sequence_preferences: [],
    notification_settings: {},
    conversation_flows: {},
    integration_settings: {},
    reporting_preferences: [],
    security_settings: {},
    compliance_requirements: [],
    activation_mode: 'immediate',
    test_leads_count: 5,
    performance_expectations: {}
  });

  // Initialize with editing agent data
  useEffect(() => {
    if (editingAgent && open) {
      setAgentData(prev => ({
        ...prev,
        name: editingAgent.name || "",
        description: editingAgent.description || "",
        response_style: editingAgent.response_style || 'professional',
        max_concurrent_leads: editingAgent.max_concurrent_leads || 25,
        handoff_threshold: editingAgent.handoff_threshold || 75,
        // Map other existing fields...
      }));
    }
  }, [editingAgent, open]);

  // Auto-save draft functionality
  const autoSave = useCallback(() => {
    if (agentData.name.trim()) {
      localStorage.setItem('aiAgentWizardDraft', JSON.stringify({
        currentStep,
        agentData,
        lastSaved: new Date().toISOString()
      }));
    }
  }, [currentStep, agentData]);

  useEffect(() => {
    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [autoSave]);

  // Load draft on open
  useEffect(() => {
    if (open && !editingAgent) {
      const draft = localStorage.getItem('aiAgentWizardDraft');
      if (draft) {
        try {
          const { currentStep: savedStep, agentData: savedData } = JSON.parse(draft);
          setCurrentStep(savedStep);
          setAgentData(savedData);
          toast({
            title: "Draft Loaded",
            description: "Your previous progress has been restored."
          });
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  }, [open, editingAgent, toast]);

  const updateAgentData = useCallback((updates: Partial<AIAgentData>) => {
    setAgentData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Identity
        return agentData.name.trim().length > 0 && agentData.description.trim().length > 0;
      case 1: // Configuration
        return agentData.max_concurrent_leads > 0 && agentData.handoff_threshold > 0;
      case 2: // Filtering
        return agentData.specializations.length > 0;
      case 3: // Automation
        return true; // Optional configurations
      case 4: // Advanced
        return true; // Optional configurations
      case 5: // Review
        return true; // Review step
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
        response_style: agentData.response_style,
        max_concurrent_leads: agentData.max_concurrent_leads,
        handoff_threshold: agentData.handoff_threshold,
        personality: agentData.personality,
        configuration: {
          working_hours: {
            start: agentData.working_hours_start,
            end: agentData.working_hours_end,
            timezone: agentData.timezone
          },
          communication: {
            tone: agentData.communication_tone,
            response_time_target: agentData.response_time_target
          },
          specializations: agentData.specializations,
          automation: {
            auto_follow_up: agentData.auto_follow_up,
            follow_up_intervals: agentData.follow_up_intervals,
            notification_settings: agentData.notification_settings
          },
          advanced: {
            conversation_flows: agentData.conversation_flows,
            integration_settings: agentData.integration_settings,
            security_settings: agentData.security_settings
          }
        }
      };

      let result;
      if (editingAgent) {
        result = await updateAgent(editingAgent.id, agentPayload);
      } else {
        result = await createAgent(agentPayload);
      }

      if (result) {
        setCreatedAgentId(result.id || editingAgent?.id);
        setIsCompleted(true);
        
        // Clear draft
        localStorage.removeItem('aiAgentWizardDraft');
        
        toast({
          title: "Success!",
          description: `AI agent "${agentData.name}" has been ${editingAgent ? 'updated' : 'created'} successfully.`
        });
      }
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
      setAgentData({
        name: "",
        description: "",
        avatar: null,
        personality: 'professional',
        response_style: 'professional',
        communication_tone: 'conversational',
        max_concurrent_leads: 25,
        handoff_threshold: 75,
        working_hours_start: "09:00",
        working_hours_end: "17:00",
        timezone: "UTC",
        response_time_target: 2,
        escalation_conditions: [],
        specializations: [],
        lead_sources: [],
        priority_criteria: {},
        geographic_preferences: [],
        program_preferences: [],
        auto_follow_up: true,
        follow_up_intervals: [1, 3, 7],
        task_templates: [],
        sequence_preferences: [],
        notification_settings: {},
        conversation_flows: {},
        integration_settings: {},
        reporting_preferences: [],
        security_settings: {},
        compliance_requirements: [],
        activation_mode: 'immediate',
        test_leads_count: 5,
        performance_expectations: {}
      });
      // Call the onSave callback to refresh the parent component
      onSave({ reload: true });
    }
    onOpenChange(false);
  };

  const renderStepContent = () => {
    if (isCompleted) {
      return (
        <CongratulationsStep 
          agentData={agentData}
          agentId={createdAgentId}
          onClose={handleClose}
        />
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <AgentIdentityStep 
            data={agentData} 
            updateData={updateAgentData} 
          />
        );
      case 1:
        return (
          <CoreConfigurationStep 
            data={agentData} 
            updateData={updateAgentData} 
          />
        );
      case 2:
        return (
          <FilterRulesStep 
            data={agentData} 
            updateData={updateAgentData} 
          />
        );
      case 3:
        return (
          <TasksAutomationStep 
            data={agentData} 
            updateData={updateAgentData} 
          />
        );
      case 4:
        return (
          <AdvancedSettingsStep 
            data={agentData} 
            updateData={updateAgentData} 
          />
        );
      case 5:
        return (
          <ReviewActivationStep 
            data={agentData} 
            updateData={updateAgentData}
            onSave={handleSave}
            isSaving={isSaving}
          />
        );
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
              {editingAgent ? 'Edit AI Agent' : 'Create New AI Agent'}
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
            
            {/* Current Step Info */}
            <div className="text-center">
              <h3 className="font-semibold text-lg">
                {WIZARD_STEPS[currentStep]?.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {WIZARD_STEPS[currentStep]?.description}
              </p>
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