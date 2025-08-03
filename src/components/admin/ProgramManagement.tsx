import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useConditionalData } from '@/hooks/useConditionalData';
import { ConditionalDataWrapper } from './ConditionalDataWrapper';
import { DemoDataService } from '@/services/demoDataService';
import { ProgramService } from '@/services/programService';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import ProgramWizard from "./ProgramWizard";
import { ProgramViewModal } from "./modals/ProgramViewModal";
import { ProgramEditModal } from "./modals/ProgramEditModal";
import { ProgramSettingsModal } from "./modals/ProgramSettingsModal";
import { ComprehensiveProgramEditModal } from "./modals/ComprehensiveProgramEditModal";
import { EnhancedPipelinePlanner } from "./EnhancedPipelinePlanner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  DollarSign,
  FileText,
  Eye,
  Settings
} from "lucide-react";

const ProgramManagement: React.FC = () => {
  const { toast } = useToast();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [comprehensiveEditModalOpen, setComprehensiveEditModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Data hooks
  const programsData = useConditionalData(
    ['programs'],
    DemoDataService.getDemoPrograms,
    ProgramService.getPrograms
  );

  // Hook to get enrollment data for real programs
  const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
    queryKey: ['program-enrollment'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {};
      
      // Get all programs for this user
      const { data: programs } = await supabase
        .from('programs')
        .select('id, name')
        .eq('user_id', user.id);

      // Get approved students count per program  
      const { data: approvedStudents } = await supabase
        .from('students')
        .select('program, id')
        .eq('user_id', user.id)
        .eq('stage', 'APPROVED');

      const enrollmentMap: Record<string, { enrolled: number; capacity: number }> = {};
      
      if (programs) {
        for (const program of programs) {
          // Count approved students for this program (match by program name since that's how students reference programs)
          const enrolledCount = approvedStudents?.filter(s => s.program === program.name).length || 0;
          
          enrollmentMap[program.id] = {
            enrolled: enrolledCount,
            capacity: 0 // Will be 0 until intake management is fully implemented
          };
        }
      }
      
      return enrollmentMap;
    },
    enabled: programsData.hasRealData,
    staleTime: 30000 // Cache for 30 seconds
  });

  // Transform real database data to match UI expectations
  const transformProgramData = (dbProgram: any) => {
    const enrollment = enrollmentData?.[dbProgram.id] || { enrolled: 0, capacity: 0 };
    
    return {
      id: dbProgram.id,
      name: dbProgram.name,
      description: dbProgram.description || "No description available",
      duration: dbProgram.duration,
      type: dbProgram.type,
      color: "#3B82F6", // Default color
      status: dbProgram.enrollment_status === 'open' ? 'active' : 'inactive',
      enrolled: enrollment.enrolled,
      capacity: enrollment.capacity,
      tuitionFee: dbProgram.tuition || 0,
      nextIntake: dbProgram.next_intake || new Date().toISOString().split('T')[0],
    };
  };

  // Mock programs data for demo purposes
  const mockPrograms = [
    {
      id: "demo-1",
      name: "Health Care Assistant",
      description: "Comprehensive healthcare training program preparing students for careers in healthcare support.",
      duration: "10 months",
      type: "certificate" as const,
      color: "#3B82F6",
      status: "active" as const,
      enrolled: 245,
      capacity: 280,
      tuitionFee: 15500,
      nextIntake: "2024-04-15",
    },
    {
      id: "demo-2",
      name: "Early Childhood Education",
      description: "Develop skills needed to work with children in various educational settings.",
      duration: "12 months",
      type: "diploma" as const,
      color: "#10B981",
      status: "active" as const,
      enrolled: 156,
      capacity: 180,
      tuitionFee: 18500,
      nextIntake: "2024-05-01",
    }
  ];

  // Use real data if available, otherwise fall back to demo/mock data
  const programs = programsData.hasRealData 
    ? programsData.data.map(transformProgramData)
    : programsData.showEmptyState 
      ? [] 
      : mockPrograms;

  const isLoading = programsData.isLoading || (programsData.hasRealData && enrollmentLoading);

  const handleViewProgram = (program: any) => {
    setSelectedProgram(program);
    setViewModalOpen(true);
  };

  const handleEditProgram = (program: any) => {
    setSelectedProgram(program);
    setEditModalOpen(true);
  };

  const handleSettingsProgram = (program: any) => {
    setSelectedProgram(program);
    setSettingsModalOpen(true);
  };

  const handleComprehensiveEditProgram = (program: any) => {
    setSelectedProgram(program);
    setComprehensiveEditModalOpen(true);
  };

  const handleSaveProgram = (updatedProgram: any) => {
    console.log("Saving program:", updatedProgram);
    toast({
      title: "Program Updated",
      description: `${updatedProgram.name} has been successfully updated.`,
    });
  };

  const handleAddIntake = () => {
    toast({
      title: "Add Intake",
      description: "Intake creation functionality will be implemented here.",
    });
  };

  const handleEditIntake = (programId: string, intakeId: string) => {
    toast({
      title: "Edit Intake", 
      description: `Editing intake ${intakeId} for program ${programId}`,
    });
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Program Management</h1>
          <p className="text-muted-foreground">Manage programs, intakes, and enrollment</p>
        </div>
        <Button onClick={() => setShowWizard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Program
        </Button>
      </div>

      {/* Programs Overview */}
      <ConditionalDataWrapper
        isLoading={isLoading}
        showEmptyState={programsData.showEmptyState}
        hasDemoAccess={programsData.hasDemoAccess}
        hasRealData={programsData.hasRealData}
        emptyTitle="No Programs Found"
        emptyDescription="Create your first program to start managing educational offerings."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: program.color }}
              />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {program.type} • {program.duration}
                    </p>
                  </div>
                  <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                    {program.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {program.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enrollment</span>
                    <span>{program.enrolled}/{program.capacity || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: program.capacity > 0 
                          ? `${Math.min((program.enrolled / program.capacity) * 100, 100)}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                  {program.capacity === 0 && (
                    <p className="text-xs text-muted-foreground">No intake capacity configured</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tuition Fee</p>
                    <p className="font-medium">${program.tuitionFee.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Intake</p>
                    <p className="font-medium">{new Date(program.nextIntake).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewProgram(program)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleComprehensiveEditProgram(program)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSettingsProgram(program)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ConditionalDataWrapper>

      {/* Pipeline Planner */}
      <EnhancedPipelinePlanner />

      <ProgramWizard 
        open={showWizard} 
        onOpenChange={setShowWizard}
        onSave={(program) => {
          console.log('Program created:', program);
          // The wizard now handles database saving and query invalidation
        }}
      />

      {/* View Program Modal */}
      <ProgramViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        program={selectedProgram}
      />

      {/* Edit Program Modal */}
      <ProgramEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        program={selectedProgram}
        onSave={handleSaveProgram}
      />

      {/* Comprehensive Edit Program Modal */}
      <ComprehensiveProgramEditModal
        isOpen={comprehensiveEditModalOpen}
        onClose={() => setComprehensiveEditModalOpen(false)}
        program={selectedProgram}
        onSave={handleSaveProgram}
      />

      {/* Settings Program Modal */}
      <ProgramSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        program={selectedProgram}
      />
    </div>
  );
};

export default ProgramManagement;