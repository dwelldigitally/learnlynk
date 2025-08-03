import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { IntakeManagement } from "../IntakeManagement";
import { ProgramService } from "@/services/programService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IntakeService } from "@/services/intakeService";

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
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch intakes for the program
  const { data: intakes = [] } = useQuery({
    queryKey: ['intakes', program?.id],
    queryFn: () => program?.id ? IntakeService.getIntakesByProgramId(program.id) : Promise.resolve([]),
    enabled: isOpen && !!program?.id,
  });

  React.useEffect(() => {
    if (isOpen && program) {
      console.log('ComprehensiveProgramEditModal - Original program data:', program);
      
      // Transform database program data to UI format
      // Cast to any to handle potential database field name differences
      const dbProgram = program as any;
      
      // Handle JSONB data that may come as strings or objects
      const parseJSONBField = (field: any) => {
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return field;
          }
        }
        return field || [];
      };

      const transformedProgram = {
        ...program,
        // Map JSONB fields back to UI format (handle both camelCase and snake_case)
        entryRequirements: parseJSONBField(dbProgram.entry_requirements) || parseJSONBField(program.entryRequirements) || [],
        documentRequirements: parseJSONBField(dbProgram.document_requirements) || parseJSONBField(program.documentRequirements) || [],
        customQuestions: parseJSONBField(dbProgram.custom_questions) || parseJSONBField(program.customQuestions) || [],
        feeStructure: parseJSONBField(dbProgram.fee_structure) || parseJSONBField(program.feeStructure) || {
          domesticFees: [],
          internationalFees: [],
          paymentPlans: [],
          scholarships: []
        },
        // Extract metadata back to top level if stored in metadata JSONB
        metadata: parseJSONBField(dbProgram.metadata) || {},
      };

      // Extract metadata fields to top level
      const metadata = transformedProgram.metadata || {};
      const finalProgram = {
        ...transformedProgram,
        images: metadata.images || program.images || [],
        campus: metadata.campus || program.campus || [],
        deliveryMethod: metadata.deliveryMethod || program.deliveryMethod || 'in-person',
        color: metadata.color || program.color || '#3B82F6',
        status: metadata.status || program.status || 'draft',
        category: metadata.category || program.category || '',
        tags: metadata.tags || program.tags || [],
        urlSlug: metadata.urlSlug || program.urlSlug || '',
        shortDescription: metadata.shortDescription || program.shortDescription || '',
        marketingCopy: metadata.marketingCopy || program.marketingCopy || ''
      };
      
      console.log('ComprehensiveProgramEditModal - Transformed program data:', finalProgram);
      console.log('Entry Requirements:', finalProgram.entryRequirements);
      console.log('Document Requirements:', finalProgram.documentRequirements);
      console.log('Fee Structure:', finalProgram.feeStructure);
      
      setEditingProgram(finalProgram);
      setHasChanges(false);
    }
  }, [isOpen, program]);

  const handleDataChange = (newData: Partial<Program>) => {
    setEditingProgram(prev => ({ ...prev, ...newData }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!editingProgram || !program || isSaving) return;

    setIsSaving(true);
    try {
      // Use ProgramService to update the program properly
      await ProgramService.updateProgram(program.id, editingProgram);
      
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      
      // Call the onSave callback with the editing program data
      onSave(editingProgram as Program);
      
      toast({
        title: "Program Updated",
        description: "The program has been successfully updated.",
      });
      onClose();
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "Error",
        description: "Failed to update program. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
      label: "Intake Management",
      icon: Calendar,
      component: IntakeManagement,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Program: {program.name}
          </DialogTitle>
          <DialogDescription>
            Edit all aspects of the program including requirements, fees, and intake details.
          </DialogDescription>
          <div className="flex items-center gap-2 mt-2">
            {hasChanges && (
              <span className="text-sm text-amber-600 font-medium">
                Unsaved changes
              </span>
            )}
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || isSaving}
              size="sm"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
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
                    {tab.id === 'intakes' ? (
                      <IntakeManagement
                        programId={program?.id || ''}
                        intakes={intakes}
                        onIntakeChange={() => {
                          queryClient.invalidateQueries({ queryKey: ['intakes', program?.id] });
                          setHasChanges(true);
                        }}
                      />
                    ) : (
                      <StepComponent
                        data={editingProgram}
                        onDataChange={handleDataChange}
                        onNext={() => {}} // Not needed for editing
                        onPrevious={() => {}} // Not needed for editing
                        programId={program?.id || ''}
                        intakes={intakes}
                      />
                    )}
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