import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Bot,
  Settings,
  Users,
  Zap,
  Brain,
  Trophy,
  FileCheck,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIAgent } from "@/hooks/useAIAgent";

// Registrar-specific step components
import { RegistrarAgentIdentityStep } from "./steps/RegistrarAgentIdentityStep";
import { RegistrarCoreConfigurationStep } from "./steps/RegistrarCoreConfigurationStep";
import { RegistrarFilterRulesStep } from "./steps/RegistrarFilterRulesStep";
import { RegistrarTasksAutomationStep } from "./steps/RegistrarTasksAutomationStep";
import { RegistrarAdvancedSettingsStep } from "./steps/RegistrarAdvancedSettingsStep";
import { RegistrarReviewActivationStep } from "./steps/RegistrarReviewActivationStep";
import { CongratulationsStep } from "@/components/admin/wizard/steps/CongratulationsStep";

export interface RegistrarAIAgentData {
  // Step 1: Identity & Personality
  name: string;
  description: string;
  avatar: string | null;
  personality: 'detail-oriented' | 'student-focused' | 'compliance-focused' | 'efficient' | 'custom';
  customPersonality?: string;
  processing_style: 'thorough' | 'efficient' | 'strict';
  communication_tone: 'formal' | 'professional' | 'friendly';

  // Step 2: Core Configuration
  max_concurrent_applications: number;
  review_threshold: number;
  working_hours_start: string;
  working_hours_end: string;
  timezone: string;
  processing_time_target: number;
  escalation_conditions: string[];

  // Step 3: Application Filtering & Assignment
  program_specializations: string[];
  application_sources: string[];
  priority_criteria: Record<string, any>;
  geographic_preferences: string[];
  document_types: string[];

  // Step 4: Tasks & Automation
  auto_document_verification: boolean;
  auto_eligibility_check: boolean;
  auto_enrollment_prediction: boolean;
  auto_compliance_monitoring: boolean;
  document_processing_intervals: number[];
  automation_templates: string[];
  notification_settings: Record<string, boolean>;

  // Step 5: Advanced Settings
  document_processing_workflows: Record<string, any>;
  integration_settings: Record<string, any>;
  compliance_requirements: string[];
  audit_settings: Record<string, any>;
  reporting_preferences: string[];

  // Step 6: Review & Activation
  activation_mode: 'immediate' | 'scheduled' | 'manual';
  activation_date?: string;
  test_applications_count: number;
  performance_expectations: Record<string, any>;
}

interface RegistrarAIAgentWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAgent?: any;
  onSave: (agent: any) => void;
}

const REGISTRAR_WIZARD_STEPS = [
  {
    id: 'identity',
    title: 'Basic Info',
    description: 'Define your registrar AI agent\'s name and description',
    icon: Bot,
    color: 'text-blue-600'
  },
  {
    id: 'configuration',
    title: 'Core Settings',
    description: 'Set capacity and program specializations',
    icon: Settings,
    color: 'text-green-600'
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Configure document processing automation',
    icon: Zap,
    color: 'text-orange-600'
  },
  {
    id: 'review',
    title: 'Review & Activate',
    description: 'Review and launch your registrar AI agent',
    icon: Trophy,
    color: 'text-emerald-600'
  }
];

export function RegistrarAIAgentWizard({ open, onOpenChange, editingAgent, onSave }: RegistrarAIAgentWizardProps) {
  const { toast } = useToast();
  const { createAgent, updateAgent } = useAIAgent();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);

  const [agentData, setAgentData] = useState<RegistrarAIAgentData>({
    // Default values for registrar agent
    name: "",
    description: "",
    avatar: null,
    personality: 'detail-oriented',
    processing_style: 'thorough',
    communication_tone: 'professional',
    max_concurrent_applications: 50,
    review_threshold: 85,
    working_hours_start: "08:00",
    working_hours_end: "18:00",
    timezone: "UTC",
    processing_time_target: 4,
    escalation_conditions: [],
    program_specializations: [],
    application_sources: [],
    priority_criteria: {},
    geographic_preferences: [],
    document_types: [],
    auto_document_verification: true,
    auto_eligibility_check: true,
    auto_enrollment_prediction: false,
    auto_compliance_monitoring: true,
    document_processing_intervals: [1, 6, 24],
    automation_templates: [],
    notification_settings: {},
    document_processing_workflows: {},
    integration_settings: {},
    compliance_requirements: [],
    audit_settings: {},
    reporting_preferences: [],
    activation_mode: 'immediate',
    test_applications_count: 10,
    performance_expectations: {}
  });

  // Initialize with editing agent data
  useEffect(() => {
    if (editingAgent && open) {
      setAgentData(prev => ({
        ...prev,
        name: editingAgent.name || "",
        description: editingAgent.description || "",
        processing_style: editingAgent.processing_style || 'thorough',
        max_concurrent_applications: editingAgent.max_concurrent_applications || 50,
        review_threshold: editingAgent.review_threshold || 85,
        // Map other existing fields...
      }));
    }
  }, [editingAgent, open]);

  // Auto-save draft functionality
  const autoSave = useCallback(() => {
    if (agentData.name.trim()) {
      localStorage.setItem('registrarAIAgentWizardDraft', JSON.stringify({
        currentStep,
        agentData,
        lastSaved: new Date().toISOString()
      }));
    }
  }, [currentStep, agentData]);

  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // Load draft on open
  useEffect(() => {
    if (open && !editingAgent) {
      const draft = localStorage.getItem('registrarAIAgentWizardDraft');
      if (draft) {
        try {
          const { currentStep: savedStep, agentData: savedData } = JSON.parse(draft);
          setCurrentStep(savedStep);
          setAgentData(savedData);
          toast({
            title: "Draft Loaded",
            description: "Your previous registrar agent progress has been restored."
          });
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  }, [open, editingAgent, toast]);

  const updateAgentData = useCallback((updates: Partial<RegistrarAIAgentData>) => {
    setAgentData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Identity
        return agentData.name.trim().length > 0 && agentData.description.trim().length > 0;
      case 1: // Configuration
        return agentData.max_concurrent_applications > 0 && agentData.program_specializations.length > 0;
      case 2: // Automation
        return true; // Optional configurations
      case 3: // Review
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

    if (currentStep < REGISTRAR_WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top of dialog content
      setTimeout(() => {
        const dialogContent = document.querySelector('[role="dialog"] .overflow-y-auto');
        if (dialogContent) {
          dialogContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      // Scroll to top of dialog content
      setTimeout(() => {
        const dialogContent = document.querySelector('[role="dialog"] .overflow-y-auto');
        if (dialogContent) {
          dialogContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
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
      // Map wizard data to registrar agent format
      const agentPayload = {
        name: agentData.name,
        description: agentData.description,
        response_style: agentData.processing_style || 'professional',
        max_concurrent_leads: agentData.max_concurrent_applications,
        handoff_threshold: agentData.review_threshold,
        personality: agentData.personality,
        configuration: {
          department: 'registrar',
          processing_style: agentData.processing_style,
          max_concurrent_applications: agentData.max_concurrent_applications,
          review_threshold: agentData.review_threshold,
          working_hours: {
            start: agentData.working_hours_start,
            end: agentData.working_hours_end,
            timezone: agentData.timezone
          },
          communication: {
            tone: agentData.communication_tone,
            processing_time_target: agentData.processing_time_target
          },
          specializations: agentData.program_specializations,
          automation: {
            auto_document_verification: agentData.auto_document_verification,
            auto_eligibility_check: agentData.auto_eligibility_check,
            auto_enrollment_prediction: agentData.auto_enrollment_prediction,
            auto_compliance_monitoring: agentData.auto_compliance_monitoring,
            document_processing_intervals: agentData.document_processing_intervals,
            notification_settings: agentData.notification_settings
          },
          advanced: {
            document_processing_workflows: agentData.document_processing_workflows,
            integration_settings: agentData.integration_settings,
            compliance_requirements: agentData.compliance_requirements,
            audit_settings: agentData.audit_settings
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
        localStorage.removeItem('registrarAIAgentWizardDraft');
        
        toast({
          title: "Success!",
          description: `Registrar AI agent "${agentData.name}" has been ${editingAgent ? 'updated' : 'created'} successfully.`
        });
      }
    } catch (error) {
      console.error('Error saving registrar agent:', error);
      toast({
        title: "Error",
        description: "Failed to save the registrar AI agent. Please try again.",
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
        personality: 'detail-oriented',
        processing_style: 'thorough',
        communication_tone: 'professional',
        max_concurrent_applications: 50,
        review_threshold: 85,
        working_hours_start: "08:00",
        working_hours_end: "18:00",
        timezone: "UTC",
        processing_time_target: 4,
        escalation_conditions: [],
        program_specializations: [],
        application_sources: [],
        priority_criteria: {},
        geographic_preferences: [],
        document_types: [],
        auto_document_verification: true,
        auto_eligibility_check: true,
        auto_enrollment_prediction: false,
        auto_compliance_monitoring: true,
        document_processing_intervals: [1, 6, 24],
        automation_templates: [],
        notification_settings: {},
        document_processing_workflows: {},
        integration_settings: {},
        compliance_requirements: [],
        audit_settings: {},
        reporting_preferences: [],
        activation_mode: 'immediate',
        test_applications_count: 10,
        performance_expectations: {}
      });
      onSave({ reload: true });
    }
    onOpenChange(false);
  };

  const renderStepContent = () => {
    if (isCompleted) {
      // Convert RegistrarAIAgentData to AIAgentData format for CongratulationsStep
      const personalityMapping = {
        'detail-oriented': 'professional',
        'student-focused': 'empathetic',
        'compliance-focused': 'professional',
        'efficient': 'professional',
        'custom': 'custom'
      } as const;

      const responseStyleMapping = {
        'thorough': 'professional',
        'efficient': 'casual',
        'strict': 'professional'
      } as const;

      const communicationToneMapping = {
        'formal': 'formal',
        'professional': 'conversational',
        'friendly': 'warm'
      } as const;

      const adaptedAgentData = {
        name: agentData.name,
        description: agentData.description,
        avatar: agentData.avatar,
        personality: personalityMapping[agentData.personality] || 'professional',
        customPersonality: agentData.customPersonality,
        response_style: responseStyleMapping[agentData.processing_style] || 'professional',
        communication_tone: communicationToneMapping[agentData.communication_tone] || 'conversational',
        max_concurrent_leads: agentData.max_concurrent_applications,
        handoff_threshold: agentData.review_threshold,
        working_hours_start: agentData.working_hours_start,
        working_hours_end: agentData.working_hours_end,
        timezone: agentData.timezone,
        response_time_target: agentData.processing_time_target,
        escalation_conditions: agentData.escalation_conditions,
        specializations: agentData.program_specializations,
        lead_sources: agentData.application_sources,
        priority_criteria: agentData.priority_criteria,
        geographic_preferences: agentData.geographic_preferences,
        program_preferences: [],
        auto_follow_up: agentData.auto_document_verification,
        follow_up_intervals: agentData.document_processing_intervals,
        task_templates: agentData.automation_templates,
        sequence_preferences: [],
        notification_settings: agentData.notification_settings,
        conversation_flows: {},
        integration_settings: agentData.integration_settings,
        reporting_preferences: agentData.reporting_preferences,
        security_settings: {},
        compliance_requirements: agentData.compliance_requirements,
        activation_mode: agentData.activation_mode,
        activation_date: agentData.activation_date,
        test_leads_count: agentData.test_applications_count,
        performance_expectations: agentData.performance_expectations
      };

      return (
        <CongratulationsStep 
          agentData={adaptedAgentData}
          agentId={createdAgentId}
          onClose={handleClose}
        />
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <RegistrarAgentIdentityStep 
            data={agentData} 
            updateData={updateAgentData} 
          />
        );
      case 1:
        return (
          <RegistrarCoreConfigurationStep 
            data={agentData} 
            updateData={updateAgentData} 
          />
        );
      case 2:
        return (
          <RegistrarTasksAutomationStep 
            data={agentData} 
            updateData={updateAgentData} 
          />
        );
      case 3:
        return (
          <RegistrarReviewActivationStep 
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

  const progressPercentage = ((currentStep + 1) / REGISTRAR_WIZARD_STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden flex flex-col">
        {!isCompleted && (
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              {editingAgent ? 'Edit Registrar AI Agent' : 'Create Registrar AI Agent'}
            </DialogTitle>
            
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Step {currentStep + 1} of {REGISTRAR_WIZARD_STEPS.length}
                </span>
                <span className="font-medium">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {REGISTRAR_WIZARD_STEPS.map((step, index) => {
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
        <div className="flex-1 overflow-auto p-6">
          {!isCompleted && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {REGISTRAR_WIZARD_STEPS[currentStep]?.title}
              </h2>
              <p className="text-muted-foreground mt-1">
                {REGISTRAR_WIZARD_STEPS[currentStep]?.description}
              </p>
            </div>
          )}
          {renderStepContent()}
        </div>

        {/* Navigation Footer */}
        {!isCompleted && (
          <div className="border-t p-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {currentStep + 1}/{REGISTRAR_WIZARD_STEPS.length}
              </Badge>
            </div>

            {currentStep === REGISTRAR_WIZARD_STEPS.length - 1 ? (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    Create Agent
                    <Trophy className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}