import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { PlaybookBasicInfoStep } from "./PlaybookBasicInfoStep";
import { PlaybookTriggerStep } from "./PlaybookTriggerStep";
import { PlaybookSequenceStep } from "./PlaybookSequenceStep";
import { PlaybookSettingsStep } from "./PlaybookSettingsStep";
import { PlaybookPreviewStep } from "./PlaybookPreviewStep";

export interface PlaybookAction {
  id: string;
  type: 'email' | 'sms' | 'call' | 'document' | 'interview' | 'wait';
  title: string;
  config: {
    template?: string;
    subject?: string;
    message?: string;
    priority?: 'low' | 'medium' | 'high';
    documentType?: string;
    waitTime?: { value: number; unit: 'minutes' | 'hours' | 'days' };
    conditions?: any[];
  };
  timing: {
    delay: { value: number; unit: 'minutes' | 'hours' | 'days' };
    executeAt?: string; // specific time
  };
}

export interface PlaybookTrigger {
  type: 'time' | 'event' | 'condition' | 'manual';
  conditions: {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
    value: any;
    logic?: 'AND' | 'OR';
  }[];
  timeConfig?: {
    daysStalled?: number;
    timeWindow?: { start: string; end: string };
    recurring?: boolean;
  };
}

export interface PlaybookData {
  // Basic Info
  name: string;
  description: string;
  category: 'enrollment' | 'retention' | 'engagement' | 'conversion';
  icon: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  
  // Trigger Configuration
  triggers: PlaybookTrigger[];
  triggerLogic: 'ANY' | 'ALL'; // for multiple triggers
  
  // Sequence
  actions: PlaybookAction[];
  maxAttempts: number;
  stopOnSuccess: boolean;
  
  // Advanced Settings
  executionLimits: {
    maxPerDay: number;
    maxPerStudent: number;
    cooldownPeriod: { value: number; unit: 'hours' | 'days' };
  };
  policyCompliance: {
    respectQuietHours: boolean;
    respectPacing: boolean;
    respectStopTriggers: boolean;
  };
  
  // Performance Expectations
  expectedMetrics: {
    completionRate: number;
    averageResponseTime: string;
    estimatedActions: number;
  };
  
  // Test Settings
  testMode: boolean;
  testEmails?: string[];
}

const steps = [
  { id: 1, title: "Basic Info", description: "Name, description, and category" },
  { id: 2, title: "Triggers", description: "When to activate this playbook" },
  { id: 3, title: "Sequence", description: "Actions and timing" },
  { id: 4, title: "Settings", description: "Limits and policy compliance" },
  { id: 5, title: "Preview", description: "Review and test" },
];

interface PlaybookWizardProps {
  onClose: () => void;
  onSave: (playbookData: PlaybookData) => void;
  editingPlaybook?: Partial<PlaybookData>;
}

export const PlaybookWizard: React.FC<PlaybookWizardProps> = ({ 
  onClose, 
  onSave, 
  editingPlaybook 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [playbookData, setPlaybookData] = useState<PlaybookData>({
    name: "",
    description: "",
    category: "enrollment",
    icon: "workflow",
    priority: "medium",
    isActive: false,
    triggers: [{
      type: "condition",
      conditions: [{
        field: "days_stalled",
        operator: "greater_than",
        value: 7
      }]
    }],
    triggerLogic: "ANY",
    actions: [],
    maxAttempts: 3,
    stopOnSuccess: true,
    executionLimits: {
      maxPerDay: 50,
      maxPerStudent: 1,
      cooldownPeriod: { value: 24, unit: "hours" }
    },
    policyCompliance: {
      respectQuietHours: true,
      respectPacing: true,
      respectStopTriggers: true
    },
    expectedMetrics: {
      completionRate: 75,
      averageResponseTime: "2.5h",
      estimatedActions: 25
    },
    testMode: false,
    ...editingPlaybook,
  });

  const updatePlaybookData = (updates: Partial<PlaybookData>) => {
    setPlaybookData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    onSave(playbookData);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PlaybookBasicInfoStep data={playbookData} onUpdate={updatePlaybookData} />;
      case 2:
        return <PlaybookTriggerStep data={playbookData} onUpdate={updatePlaybookData} />;
      case 3:
        return <PlaybookSequenceStep data={playbookData} onUpdate={updatePlaybookData} />;
      case 4:
        return <PlaybookSettingsStep data={playbookData} onUpdate={updatePlaybookData} />;
      case 5:
        return <PlaybookPreviewStep data={playbookData} onUpdate={updatePlaybookData} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return playbookData.name && playbookData.description && playbookData.category;
      case 2:
        return playbookData.triggers.length > 0 && 
               playbookData.triggers.every(t => t.conditions.length > 0);
      case 3:
        return playbookData.actions.length > 0;
      case 4:
        return playbookData.executionLimits.maxPerDay > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {editingPlaybook ? "Edit Custom Playbook" : "Create Custom Playbook"}
            </CardTitle>
            <Button variant="outline" onClick={onClose} size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center space-x-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step.id < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.id === currentStep
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id < currentStep ? <Check className="w-3 h-3" /> : step.id}
                  </div>
                  <span className={step.id === currentStep ? "font-medium" : ""}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh] p-6">
          {renderStep()}
        </CardContent>
        
        <div className="border-t p-6 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex space-x-2">
            {currentStep === steps.length ? (
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Check className="w-4 w-4" />
                <span>{editingPlaybook ? "Update Playbook" : "Create Playbook"}</span>
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};