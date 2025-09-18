import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ApplicationService, ApplicationData } from "@/services/applicationService";
import { useStudentPortalContext } from "@/pages/StudentPortal";

// Import step components
import PersonalInfoStep from "./steps/PersonalInfoStep";
import EducationBackgroundStep from "./steps/EducationBackgroundStep";
import WorkExperienceStep from "./steps/WorkExperienceStep";
import EssayStep from "./steps/EssayStep";
import QuestionsStep from "./steps/QuestionsStep";
import DocumentsStep from "./steps/DocumentsStep";
import PaymentStep from "./steps/PaymentStep";
import ReviewSubmitStep from "./steps/ReviewSubmitStep";

interface ApplicationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationCreated: (application: ApplicationData) => void;
  editingApplication?: ApplicationData | null;
}

const steps = [
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
  isOpen,
  onClose,
  onApplicationCreated,
  editingApplication
}) => {
  const { leadId } = useStudentPortalContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    program_name: '',
    status: 'draft',
    stage: 'personal_info',
    progress: 0,
    application_data: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing application data if editing
  useEffect(() => {
    if (editingApplication) {
      setApplicationData(editingApplication);
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
      progress: Math.round(((currentStep + 1) / steps.length) * 100)
    };
    setApplicationData(updatedData);
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
    const stepData = applicationData.application_data[steps[currentStep].id] || {};
    
    switch (steps[currentStep].id) {
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
    const stepData = applicationData.application_data[steps[currentStep].id] || {};
    
    switch (steps[currentStep].id) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{steps[currentStep].title}</h3>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-muted/20">
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
              <Button variant="outline" onClick={handleSaveAndExit} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save & Exit
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button onClick={handleSubmitApplication} disabled={isLoading || !isStepValid()}>
                  Submit Application
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={!isStepValid()}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationWizard;