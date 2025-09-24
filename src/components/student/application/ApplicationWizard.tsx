import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ApplicationService, ApplicationData } from "@/services/applicationService";
import { useStudentPortalContext } from "@/pages/StudentPortal";
import { StandardizedProgram } from "@/constants/programs";
import { ProgramIntakeDate } from "@/constants/intakeDates";

// Import enhanced step components
import ProgramSelectionStep from "./ProgramSelectionStep";
import ProgramDetailsView from "./ProgramDetailsView";
import FinancialBreakdownView from "./FinancialBreakdownView";
import RequirementsView from "./RequirementsView";
import IntakeSelectionView from "./IntakeSelectionView";

// Import original step components
import PersonalInfoStep from "./steps/PersonalInfoStep";
import EducationBackgroundStep from "./steps/EducationBackgroundStep";
import WorkExperienceStep from "./steps/WorkExperienceStep";
import EssayStep from "./steps/EssayStep";
import QuestionsStep from "./steps/QuestionsStep";
import DocumentsStep from "./steps/DocumentsStep";
import PaymentStep from "./steps/PaymentStep";
import ReviewSubmitStep from "./steps/ReviewSubmitStep";

interface ApplicationWizardProps {
  onClose: () => void;
  onApplicationCreated: (application: ApplicationData) => void;
  editingApplication?: ApplicationData | null;
}

const steps = [
  { id: 'program_selection', title: 'Program Selection', description: 'Choose your program of study' },
  { id: 'program_details', title: 'Program Overview', description: 'Learn about your chosen program' },
  { id: 'financial_breakdown', title: 'Financial Information', description: 'Understand costs and payment options' },
  { id: 'requirements', title: 'Requirements', description: 'Review entry requirements and documents' },
  { id: 'intake_selection', title: 'Intake Selection', description: 'Choose your start date' },
  { id: 'personal_info', title: 'Personal Information', description: 'Basic contact and personal details' },
  { id: 'education', title: 'Education Background', description: 'Academic history and qualifications' },
  { id: 'work_experience', title: 'Experience', description: 'Work, volunteer, and other experiences' },
  { id: 'essays', title: 'Essays', description: 'Personal statements and essays' },
  { id: 'questions', title: 'Program Questions', description: 'Program-specific questions' },
  { id: 'documents', title: 'Documents', description: 'Required document uploads' },
  { id: 'payment', title: 'Payment', description: 'Application fee payment' },
  { id: 'review', title: 'Review & Submit', description: 'Final review and submission' }
];

const ApplicationWizard: React.FC<ApplicationWizardProps> = ({
  onClose,
  onApplicationCreated,
  editingApplication
}) => {
  const { leadId } = useStudentPortalContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<StandardizedProgram | undefined>();
  const [selectedIntake, setSelectedIntake] = useState<ProgramIntakeDate | undefined>();
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    program_name: '',
    status: 'draft',
    stage: 'program_selection',
    progress: 0,
    application_data: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing application data if editing
  useEffect(() => {
    if (editingApplication) {
      setApplicationData({
        ...editingApplication,
        application_data: editingApplication.application_data || {}
      });
      const stepIndex = steps.findIndex(step => step.id === editingApplication.stage);
      setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
    }
  }, [editingApplication]);

  // Auto-save functionality
  useEffect(() => {
    if (applicationData.id && currentStep > 0) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [applicationData, currentStep]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleAutoSave = async () => {
    if (!applicationData.id) return;
    
    setIsSaving(true);
    try {
      await ApplicationService.autoSaveApplication(applicationData.id, applicationData);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateApplicationData = (stepData: any) => {
    const updatedData = {
      ...applicationData,
      application_data: {
        ...applicationData.application_data,
        [steps[currentStep].id]: stepData
      },
      stage: steps[currentStep].id as ApplicationData['stage'],
      progress: Math.round(((currentStep + 1) / steps.length) * 100),
      // Update program name when program is selected
      ...(selectedProgram && { program_name: selectedProgram })
    };
    setApplicationData(updatedData);
  };

  const handleProgramSelection = (program: StandardizedProgram) => {
    setSelectedProgram(program);
    setApplicationData(prev => ({
      ...prev,
      program_name: program,
      application_data: {
        ...prev.application_data,
        program_selection: { selectedProgram: program }
      }
    }));
  };

  const handleIntakeSelection = (intake: ProgramIntakeDate) => {
    setSelectedIntake(intake);
    setApplicationData(prev => ({
      ...prev,
      application_data: {
        ...prev.application_data,
        intake_selection: { selectedIntake: intake }
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = async () => {
    setIsLoading(true);
    try {
      if (applicationData.id) {
        await ApplicationService.updateApplication(applicationData.id, applicationData);
      } else {
        const { data, error } = await ApplicationService.createApplication({
          ...applicationData,
          program_name: applicationData.program_name || 'Draft Application'
        });
        if (error) throw error;
        if (data) {
          setApplicationData(data);
          onApplicationCreated(data);
        }
      }
      
      toast({
        title: "Application Saved",
        description: "Your progress has been saved as a draft."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    setIsLoading(true);
    try {
      const finalData = {
        ...applicationData,
        status: 'submitted' as const,
        progress: 100
      };

      if (applicationData.id) {
        await ApplicationService.updateApplication(applicationData.id, finalData);
      } else {
        const { data, error } = await ApplicationService.createApplication(finalData);
        if (error) throw error;
        if (data) onApplicationCreated(data);
      }

      toast({
        title: "Application Submitted!",
        description: "Your application has been successfully submitted for review."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const stepData = applicationData.application_data?.[steps[currentStep].id] || {};
    
    switch (steps[currentStep].id) {
      case 'program_selection':
        return (
          <ProgramSelectionStep 
            onSelect={handleProgramSelection} 
            selectedProgram={selectedProgram}
          />
        );
      case 'program_details':
        return selectedProgram ? (
          <ProgramDetailsView 
            program={selectedProgram}
            onContinue={nextStep}
            onBack={prevStep}
          />
        ) : null;
      case 'financial_breakdown':
        return selectedProgram ? (
          <FinancialBreakdownView 
            program={selectedProgram}
            onContinue={nextStep}
            onBack={prevStep}
          />
        ) : null;
      case 'requirements':
        return selectedProgram ? (
          <RequirementsView 
            program={selectedProgram}
            onContinue={nextStep}
            onBack={prevStep}
          />
        ) : null;
case 'intake_selection':
  return selectedProgram ? (
    <IntakeSelectionView 
      program={selectedProgram}
      onSelect={handleIntakeSelection}
      onBack={prevStep}
      onContinue={nextStep}
      selectedIntake={selectedIntake}
    />
  ) : null;
      case 'personal_info':
        return <PersonalInfoStep data={stepData} onUpdate={updateApplicationData} />;
      case 'education':
        return <EducationBackgroundStep data={stepData} onUpdate={updateApplicationData} />;
      case 'work_experience':
        return <WorkExperienceStep data={stepData} onUpdate={updateApplicationData} />;
      case 'essays':
        return <EssayStep data={stepData} onUpdate={updateApplicationData} />;
      case 'questions':
        return <QuestionsStep data={stepData} onUpdate={updateApplicationData} />;
      case 'documents':
        return <DocumentsStep data={stepData} onUpdate={updateApplicationData} />;
      case 'payment':
        return <PaymentStep data={stepData} onUpdate={updateApplicationData} />;
      case 'review':
        return <ReviewSubmitStep data={applicationData} onSubmit={handleSubmitApplication} />;
      default:
        return <div>Step not implemented</div>;
    }
  };

  const isStepValid = () => {
    const stepData = applicationData.application_data?.[steps[currentStep].id] || {};
    
    switch (steps[currentStep].id) {
      case 'program_selection':
        return selectedProgram !== undefined;
      case 'program_details':
        return true; // Information step, always valid
      case 'financial_breakdown':
        return true; // Information step, always valid
      case 'requirements':
        return true; // Information step, always valid
      case 'intake_selection':
        return selectedIntake !== undefined;
      case 'personal_info':
        return stepData.firstName && stepData.lastName && stepData.email;
      case 'education':
        return stepData.institutions && stepData.institutions.length > 0;
      case 'work_experience':
        return true; // Optional step
      case 'essays':
        return stepData.essays && stepData.essays.length > 0;
      case 'questions':
        return stepData.responses && Object.keys(stepData.responses).length > 0;
      case 'documents':
        return stepData.documents && stepData.documents.length > 0;
      case 'payment':
        return stepData.paymentCompleted;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {editingApplication ? 'Edit Application' : 'New Application'}
            </h2>
            <div className="flex items-center gap-2">
              {isSaving && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Save className="w-4 h-4 animate-pulse" />
                  Saving...
                </span>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{steps[currentStep].title}</span>
              <span>{applicationData.progress}% Complete</span>
            </div>
            <Progress value={applicationData.progress} className="h-2" />
          </div>
          
          {/* Step indicator */}
          <div className="flex justify-between mt-4 text-xs">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-1 text-center">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className={`${
          ['program_selection', 'program_details', 'financial_breakdown', 'requirements', 'intake_selection'].includes(steps[currentStep].id)
            ? '' // No padding for enhanced steps that manage their own layout
            : 'p-6 bg-background rounded-lg border'
        }`}>
          {['program_selection', 'program_details', 'financial_breakdown', 'requirements', 'intake_selection'].includes(steps[currentStep].id) ? (
            renderStep()
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">{steps[currentStep].title}</h3>
                <p className="text-muted-foreground">{steps[currentStep].description}</p>
              </div>
              {renderStep()}
            </>
          )}
        </div>

        {/* Footer - Only show for form steps, not info steps */}
        {!['program_details', 'financial_breakdown', 'requirements'].includes(steps[currentStep].id) && (
          <div className="p-6 border-t bg-muted/20 rounded-lg">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentStep > 4 && ( // Only show save after intake selection
                  <Button variant="outline" onClick={handleSaveAndExit} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save & Exit
                  </Button>
                )}
                
                {currentStep === steps.length - 1 ? (
                  <Button onClick={handleSubmitApplication} disabled={isLoading || !isStepValid()}>
                    Submit Application
                  </Button>
                ) : (
                  <Button onClick={nextStep} disabled={!isStepValid()}>
                    {steps[currentStep].id === 'intake_selection' ? 'Start Application' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ApplicationWizard;