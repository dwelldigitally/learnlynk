import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Program, ProgramWizardState } from "@/types/program";

// Import step components
import BasicInfoStep from "./wizard/BasicInfoStep";
import RequirementsStep from "./wizard/RequirementsStep";
import DocumentsStep from "./wizard/DocumentsStep";
import FeeStructureStep from "./wizard/FeeStructureStep";
import IntakeQuestionsStep from "./wizard/IntakeQuestionsStep";
import IntakeDatesStep from "./wizard/IntakeDatesStep";
import PreviewStep from "./wizard/PreviewStep";

interface ProgramWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProgram?: Program;
  onSave?: (program: Program) => void;
}

const STEPS = [
  { id: 'basic', title: 'Basic Information', description: 'Program name, description, and basic details' },
  { id: 'requirements', title: 'Entry Requirements', description: 'Academic and other admission criteria' },
  { id: 'documents', title: 'Required Documents', description: 'Document requirements and specifications' },
  { id: 'fees', title: 'Fee Structure', description: 'Tuition, payment plans, and scholarships' },
  { id: 'questions', title: 'Custom Questions', description: 'Application form customization' },
  { id: 'intakes', title: 'Intake Dates', description: 'Schedule and capacity management' },
  { id: 'preview', title: 'Review & Preview', description: 'Final review before creating program' }
];

const ProgramWizard: React.FC<ProgramWizardProps> = ({
  open,
  onOpenChange,
  editingProgram,
  onSave
}) => {
  const { toast } = useToast();
  const autoSaveRef = useRef<NodeJS.Timeout>();

  const [wizardState, setWizardState] = useState<ProgramWizardState>(() => ({
    currentStep: 0,
    totalSteps: STEPS.length,
    completed: new Array(STEPS.length).fill(false),
    data: editingProgram || {
      name: '',
      description: '',
      images: [],
      type: 'certificate',
      duration: '',
      campus: [],
      deliveryMethod: 'in-person',
      color: '#3B82F6',
      status: 'draft',
      category: '',
      tags: [],
      urlSlug: '',
      entryRequirements: [],
      documentRequirements: [],
      feeStructure: {
        tuitionFee: 0,
        currency: 'CAD',
        additionalFees: [],
        paymentPlans: [],
        scholarships: []
      },
      customQuestions: [],
      intakes: []
    },
    isDraft: !editingProgram,
    lastSaved: undefined
  }));

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }
    
    autoSaveRef.current = setTimeout(() => {
      setWizardState(prev => ({
        ...prev,
        lastSaved: new Date().toISOString()
      }));
      
      // Save to localStorage for now (would be Supabase in production)
      localStorage.setItem('program-wizard-draft', JSON.stringify(wizardState.data));
      
      toast({
        title: "Draft saved",
        description: "Your progress has been automatically saved.",
        duration: 2000,
      });
    }, 2000);
  }, [wizardState.data, toast]);

  const updateWizardData = useCallback((stepData: Partial<Program>) => {
    setWizardState(prev => ({
      ...prev,
      data: { ...prev.data, ...stepData },
      isDraft: true
    }));
    autoSave();
  }, [autoSave]);

  const validateStep = (stepIndex: number): boolean => {
    const data = wizardState.data;
    
    switch (stepIndex) {
      case 0: // Basic Info
        return !!(data.name && data.description && data.type && data.duration && data.campus?.length);
      case 1: // Requirements
        return true; // Optional step
      case 2: // Documents
        return true; // Optional step
      case 3: // Fee Structure
        return !!(data.feeStructure && data.feeStructure.tuitionFee > 0);
      case 4: // Custom Questions
        return true; // Optional step
      case 5: // Intake Dates
        return !!(data.intakes && data.intakes.length > 0);
      case 6: // Preview
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const isValid = validateStep(wizardState.currentStep);
    
    if (!isValid) {
      toast({
        title: "Incomplete Step",
        description: "Please complete all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setWizardState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
      completed: prev.completed.map((completed, index) => 
        index === prev.currentStep ? true : completed
      )
    }));
  };

  const previousStep = () => {
    setWizardState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  };

  const goToStep = (stepIndex: number) => {
    setWizardState(prev => ({
      ...prev,
      currentStep: stepIndex
    }));
  };

  const handleSave = () => {
    if (!validateStep(wizardState.currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields.",
        variant: "destructive",
      });
      return;
    }

    const programData: Program = {
      ...wizardState.data,
      id: editingProgram?.id || `prog_${Date.now()}`,
      createdAt: editingProgram?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: editingProgram?.createdBy || 'current_user',
      status: 'active'
    } as Program;

    onSave?.(programData);
    
    // Clear draft
    localStorage.removeItem('program-wizard-draft');
    
    toast({
      title: editingProgram ? "Program Updated" : "Program Created",
      description: `${programData.name} has been successfully ${editingProgram ? 'updated' : 'created'}.`,
    });
    
    onOpenChange(false);
  };

  const renderStepContent = () => {
    const stepProps = {
      data: wizardState.data,
      onDataChange: updateWizardData,
      onNext: nextStep,
      onPrevious: previousStep
    };

    switch (wizardState.currentStep) {
      case 0:
        return <BasicInfoStep {...stepProps} />;
      case 1:
        return <RequirementsStep {...stepProps} />;
      case 2:
        return <DocumentsStep {...stepProps} />;
      case 3:
        return <FeeStructureStep {...stepProps} />;
      case 4:
        return <IntakeQuestionsStep {...stepProps} />;
      case 5:
        return <IntakeDatesStep {...stepProps} />;
      case 6:
        return <PreviewStep {...stepProps} onSave={handleSave} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingProgram ? 'Edit Program' : 'Create New Program'}
            {wizardState.isDraft && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Draft
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {editingProgram 
              ? 'Update your program details and configuration' 
              : 'Follow the steps to create a comprehensive program with all required details'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Step {wizardState.currentStep + 1} of {wizardState.totalSteps}
              </span>
              <span className="text-xs text-muted-foreground">
                {wizardState.lastSaved && `Last saved: ${new Date(wizardState.lastSaved).toLocaleTimeString()}`}
              </span>
            </div>
            <Progress 
              value={((wizardState.currentStep + 1) / wizardState.totalSteps) * 100} 
              className="h-2"
            />
          </div>

          {/* Step Navigation */}
          <div className="flex overflow-x-auto gap-1 mb-6 pb-2">
            {STEPS.map((step, index) => (
              <Button
                key={step.id}
                variant={index === wizardState.currentStep ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0"
                onClick={() => goToStep(index)}
              >
                {wizardState.completed[index] && (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {!wizardState.completed[index] && !validateStep(index) && index < wizardState.currentStep && (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {step.title}
              </Button>
            ))}
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[wizardState.currentStep].title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {STEPS[wizardState.currentStep].description}
                </p>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={wizardState.currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {}}>
                <Save className="h-4 w-4 mr-1" />
                Save Draft
              </Button>
              
              {wizardState.currentStep < wizardState.totalSteps - 1 ? (
                <Button onClick={nextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSave} className="bg-primary">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {editingProgram ? 'Update Program' : 'Create Program'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramWizard;