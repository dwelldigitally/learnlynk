import React, { useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Clock,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Program, ProgramWizardState } from "@/types/program";
import { ProgramService } from "@/services/programService";
import { useMvpMode } from "@/contexts/MvpModeContext";

// Import step components
import BasicInfoStep from "@/components/admin/wizard/BasicInfoStep";
import RequirementsStep from "@/components/admin/wizard/RequirementsStep";
import { ProgramJourneyStep } from "@/components/admin/ProgramJourneyStep";
import PracticumConfigurationStep from "@/components/admin/wizard/PracticumConfigurationStep";
import FeeStructureStep from "@/components/admin/wizard/FeeStructureStep";
import IntakeQuestionsStep from "@/components/admin/wizard/IntakeQuestionsStep";
import PreviewStep from "@/components/admin/wizard/PreviewStep";

const STEPS = [
  { id: 'basic', title: 'Basic Information', description: 'Program name, description, and basic details' },
  { id: 'requirements', title: 'Entry Requirements', description: 'Academic and other admission criteria' },
  { id: 'journey', title: 'Academic Journey', description: 'Student journey and workflow configuration' },
  { id: 'practicum', title: 'Practicum Configuration', description: 'Practicum requirements, sites, and competencies' },
  { id: 'fees', title: 'Fee Structure', description: 'Tuition, payment plans, and scholarships' },
  { id: 'questions', title: 'Custom Questions', description: 'Application form customization' },
  { id: 'preview', title: 'Review & Preview', description: 'Final review before creating program' }
];

const ProgramWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const autoSaveRef = useRef<NodeJS.Timeout>();
  const { isMvpMode } = useMvpMode();

  // Check if we're editing an existing program
  const editingProgramId = searchParams.get('edit');
  
  const [wizardState, setWizardState] = useState<ProgramWizardState>(() => ({
    currentStep: 0,
    totalSteps: STEPS.length,
    completed: new Array(STEPS.length).fill(false),
    data: {
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
        domesticFees: [],
        internationalFees: [],
        paymentPlans: [],
        scholarships: []
      },
      customQuestions: [],
      intakes: []
    },
    isDraft: !editingProgramId,
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
      case 2: // Journey
        return true; // Optional step
      case 3: // Practicum 
        return true; // Optional step
      case 4: // Fee Structure
        return !!(data.feeStructure && (data.feeStructure.domesticFees.length > 0 || data.feeStructure.internationalFees.length > 0));
      case 5: // Custom Questions
        return true; // Optional step
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

  const handleSave = async () => {
    if (!validateStep(wizardState.currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Map complete wizard data to database schema - save ALL collected data
      const programData = {
        // Basic fields
        name: wizardState.data.name,
        description: wizardState.data.description,
        type: wizardState.data.type,
        duration: wizardState.data.duration,
        requirements: wizardState.data.entryRequirements?.map(req => req.description || req.title) || [],
        tuition: wizardState.data.feeStructure?.domesticFees?.[0]?.amount || 
                wizardState.data.feeStructure?.internationalFees?.[0]?.amount || 0,
        next_intake: wizardState.data.intakes?.[0]?.date || null,
        enrollment_status: wizardState.data.status === 'active' ? 'open' : 'closed',
        
        // Rich data structures saved to JSONB columns
        entryRequirements: wizardState.data.entryRequirements || [],
        documentRequirements: wizardState.data.documentRequirements || [],
        feeStructure: wizardState.data.feeStructure || {
          domesticFees: [],
          internationalFees: [],
          paymentPlans: [],
          scholarships: []
        },
        customQuestions: wizardState.data.customQuestions || [],
        
        // Additional metadata
        images: wizardState.data.images || [],
        campus: wizardState.data.campus || [],
        deliveryMethod: wizardState.data.deliveryMethod || 'in-person',
        color: wizardState.data.color || '#3B82F6',
        status: wizardState.data.status || 'draft',
        category: wizardState.data.category || '',
        tags: wizardState.data.tags || [],
        urlSlug: wizardState.data.urlSlug || '',
        shortDescription: wizardState.data.shortDescription || '',
        marketingCopy: wizardState.data.marketingCopy || ''
      };

      let savedProgram;
      if (editingProgramId) {
        savedProgram = await ProgramService.updateProgram(editingProgramId, programData);
      } else {
        savedProgram = await ProgramService.createProgram(programData);
      }

      // Invalidate and refetch programs query
      await queryClient.invalidateQueries({ queryKey: ['programs'] });
      
      // Clear draft
      localStorage.removeItem('program-wizard-draft');
      
      toast({
        title: editingProgramId ? "Program Updated" : "Program Created",
        description: `${programData.name} has been successfully ${editingProgramId ? 'updated' : 'created'}.`,
      });
      
      // Navigate back to programs list
      navigate('/admin/programs');
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "Error",
        description: "Failed to save program. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/programs');
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
        return <ProgramJourneyStep {...stepProps} />;
      case 3:
        return <PracticumConfigurationStep {...stepProps} />;
      case 4:
        return <FeeStructureStep {...stepProps} />;
      case 5:
        return <IntakeQuestionsStep {...stepProps} />;
      case 6:
        return <PreviewStep {...stepProps} onSave={handleSave} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {editingProgramId ? 'Edit Program' : 'Create New Program'}
                {wizardState.isDraft && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Draft
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground">
                {editingProgramId 
                  ? 'Update your program details and configuration' 
                  : 'Follow the steps to create a comprehensive program with all required details'
                }
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
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
        <div className="flex overflow-x-auto gap-1 pb-2">
          {STEPS.map((step, index) => {
            // Hide Practicum Configuration in MVP mode
            if (step.id === 'practicum' && isMvpMode) {
              return null;
            }
            
            return (
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
            );
          })}
        </div>

        {/* Step Content */}
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

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
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
                {editingProgramId ? 'Update Program' : 'Create Program'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramWizardPage;