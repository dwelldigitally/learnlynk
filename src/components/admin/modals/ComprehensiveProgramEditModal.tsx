import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Program } from "@/types/program";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  DollarSign, 
  Users, 
  Calendar, 
  Settings, 
  BookOpen,
  HelpCircle,
  Save
} from "lucide-react";

// Import wizard steps for editing
import BasicInfoStep from "../wizard/BasicInfoStep";
import RequirementsStep from "../wizard/RequirementsStep";
import DocumentsStep from "../wizard/DocumentsStep";
import FeeStructureStep from "../wizard/FeeStructureStep";
import IntakeQuestionsStep from "../wizard/IntakeQuestionsStep";
import IntakeDatesStep from "../wizard/IntakeDatesStep";

interface ComprehensiveProgramEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onSave: (program: Program) => void;
}

export const ComprehensiveProgramEditModal = ({ 
  isOpen, 
  onClose, 
  program, 
  onSave 
}: ComprehensiveProgramEditModalProps) => {
  const [editingProgram, setEditingProgram] = useState<Partial<Program> | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen && program) {
      setEditingProgram({ ...program });
      setHasChanges(false);
    }
  }, [isOpen, program]);

  const handleDataChange = (newData: Partial<Program>) => {
    setEditingProgram(prev => ({ ...prev, ...newData }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!editingProgram || !program) return;

    const updatedProgram: Program = {
      ...program,
      ...editingProgram,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedProgram);
    setHasChanges(false);
    toast({
      title: "Program Updated",
      description: "The program has been successfully updated.",
    });
    onClose();
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close without saving?"
      );
      if (!confirmed) return;
    }
    onClose();
  };

  if (!program || !editingProgram) return null;

  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: BookOpen,
      component: BasicInfoStep,
    },
    {
      id: "requirements",
      label: "Requirements",
      icon: FileText,
      component: RequirementsStep,
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      component: DocumentsStep,
    },
    {
      id: "fees",
      label: "Fee Structure",
      icon: DollarSign,
      component: FeeStructureStep,
    },
    {
      id: "questions",
      label: "Custom Questions",
      icon: HelpCircle,
      component: IntakeQuestionsStep,
    },
    {
      id: "intakes",
      label: "Intake Dates",
      icon: Calendar,
      component: IntakeDatesStep,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Edit Program: {program.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <span className="text-sm text-amber-600 font-medium">
                  Unsaved changes
                </span>
              )}
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges}
                size="sm"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-6">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-1 text-xs"
              >
                <tab.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[calc(90vh-140px)] mt-4">
            {tabs.map((tab) => {
              const StepComponent = tab.component;
              return (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <div className="p-4 border rounded-lg bg-card">
                    <StepComponent
                      data={editingProgram}
                      onDataChange={handleDataChange}
                      onNext={() => {}} // Not needed for editing
                      onPrevious={() => {}} // Not needed for editing
                    />
                  </div>
                </TabsContent>
              );
            })}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};