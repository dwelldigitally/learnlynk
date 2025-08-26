import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { PolicyData, PolicyWizardProps } from "@/types/policy";
import PolicyBasicInfoStep from "./PolicyBasicInfoStep";
import PolicyTypeStep from "./PolicyTypeStep";
import PolicyConfigurationStep from "./PolicyConfigurationStep";
import PolicyConditionsStep from "./PolicyConditionsStep";
import PolicyPreviewStep from "./PolicyPreviewStep";

const steps = [
  {
    title: "Basic Information",
    description: "Define policy name, category, and priority"
  },
  {
    title: "Policy Type",
    description: "Select the type of policy to create"
  },
  {
    title: "Configuration",
    description: "Set up policy rules and settings"
  },
  {
    title: "Conditions & Triggers",
    description: "Define when the policy should apply"
  },
  {
    title: "Preview & Test",
    description: "Review and validate the policy"
  }
];

const PolicyWizard: React.FC<PolicyWizardProps> = ({
  onClose,
  onSave,
  editingPolicy
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [policyData, setPolicyData] = useState<PolicyData>({
    // Basic Info
    name: editingPolicy?.name || "",
    description: editingPolicy?.description || "",
    category: editingPolicy?.category || "communication",
    icon: editingPolicy?.icon || "Shield",
    priority: editingPolicy?.priority || "medium",
    isActive: editingPolicy?.isActive ?? true,
    
    // Policy Type & Settings
    policyType: editingPolicy?.policyType || "custom",
    settings: editingPolicy?.settings || {},
    
    // Conditions & Rules
    conditions: editingPolicy?.conditions || [],
    triggers: editingPolicy?.triggers || [],
    
    // Advanced Settings
    expectedLift: editingPolicy?.expectedLift || 0,
    enforceOverrides: editingPolicy?.enforceOverrides ?? false,
    bypassConditions: editingPolicy?.bypassConditions || [],
    
    // Metadata
    tags: editingPolicy?.tags || [],
    isTemplate: editingPolicy?.isTemplate ?? false,
    
    ...editingPolicy
  });

  const updatePolicyData = (updates: Partial<PolicyData>) => {
    setPolicyData(prev => ({ ...prev, ...updates }));
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

  const handleSave = () => {
    onSave(policyData);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PolicyBasicInfoStep
            data={policyData}
            onDataChange={updatePolicyData}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <PolicyTypeStep
            data={policyData}
            onDataChange={updatePolicyData}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );
      case 2:
        return (
          <PolicyConfigurationStep
            data={policyData}
            onDataChange={updatePolicyData}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );
      case 3:
        return (
          <PolicyConditionsStep
            data={policyData}
            onDataChange={updatePolicyData}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );
      case 4:
        return (
          <PolicyPreviewStep
            data={policyData}
            onDataChange={updatePolicyData}
            onSave={handleSave}
            onPrevious={prevStep}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return policyData.name.trim() !== "" && policyData.description.trim() !== "";
      case 1:
        return policyData.policyType !== "custom" || policyData.policyType !== undefined;
      case 2:
        return true; // Configuration is optional for some policy types
      case 3:
        return true; // Conditions are optional
      case 4:
        return true; // Preview step is always valid
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold">
              {editingPolicy ? "Edit Policy" : "Create New Policy"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index === currentStep
                    ? "text-primary font-medium"
                    : index < currentStep
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs">{step.description}</div>
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Step Content */}
        <div className="mt-6 min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
                disabled={!isStepValid()}
              >
                <Save className="h-4 w-4" />
                {editingPolicy ? "Save Changes" : "Create Policy"}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyWizard;