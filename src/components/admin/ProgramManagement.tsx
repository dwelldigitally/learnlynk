import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useConditionalData } from '@/hooks/useConditionalData';
import { ConditionalDataWrapper } from './ConditionalDataWrapper';
import { DemoDataService } from '@/services/demoDataService';
import { ProgramService } from '@/services/programService';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ProgramViewModal } from "./modals/ProgramViewModal";
import { ProgramEditModal } from "./modals/ProgramEditModal";
import { ProgramSettingsModal } from "./modals/ProgramSettingsModal";
import { ComprehensiveProgramEditModal } from "./modals/ComprehensiveProgramEditModal";
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
  Settings,
  RefreshCw,
  GraduationCap,
  Clock
} from "lucide-react";
import { PageHeader } from "@/components/modern/PageHeader";
import { ModernCard } from "@/components/modern/ModernCard";
import { InfoBadge } from "@/components/modern/InfoBadge";
import { MetadataItem } from "@/components/modern/MetadataItem";

const ProgramManagement: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    navigate(`/admin/programs/edit?edit=${program.id}`);
  };

  const handleSettingsProgram = (program: any) => {
    setSelectedProgram(program);
    setSettingsModalOpen(true);
  };

  const handleComprehensiveEditProgram = (program: any) => {
    setSelectedProgram(program);
    setComprehensiveEditModalOpen(true);
  };

  const handleSaveProgram = async (updatedProgram: any) => {
    try {
      if (updatedProgram.id) {
        await ProgramService.updateProgram(updatedProgram.id, {
          name: updatedProgram.name,
          description: updatedProgram.description,
          type: updatedProgram.type,
          duration: updatedProgram.duration,
          tuition: updatedProgram.tuitionFee,
          requirements: updatedProgram.requirements
        });
        
        // Refresh data
        programsData.refetch();
        
        toast({
          title: "Program Updated",
          description: `${updatedProgram.name} has been successfully updated.`,
        });
      }
    } catch (error) {
      console.error("Error saving program:", error);
      toast({
        title: "Error",
        description: "Failed to update program. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshData = async () => {
    console.log('Force refreshing all program data...');
    // Clear cache completely and refetch
    queryClient.removeQueries({ queryKey: ['programs'] });
    await queryClient.invalidateQueries({ queryKey: ['programs'] });
    await programsData.refetch();
    
    toast({
      title: "Data Refreshed",
      description: "Program data has been completely refreshed with latest JSONB fields.",
    });
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Program Management"
        subtitle="Manage programs, intakes, and enrollment"
      />

      <div className="mb-6 flex justify-end gap-2">
        <Button variant="outline" onClick={handleRefreshData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        <Button size="lg" onClick={() => navigate('/admin/programs/new')}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ModernCard key={program.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-foreground mb-1 truncate">
                      {program.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {program.type} • {program.duration}
                    </p>
                    <InfoBadge variant={program.status === 'active' ? 'success' : 'secondary'}>
                      {program.status.toUpperCase()}
                    </InfoBadge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {program.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Enrollment</span>
                      <span>{program.enrolled}/{program.capacity || 0}</span>
                    </div>
                    <Progress 
                      value={program.capacity > 0 ? (program.enrolled / program.capacity) * 100 : 0} 
                      className="h-2"
                    />
                    {program.capacity === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">No intake capacity configured</p>
                    )}
                  </div>

                  <MetadataItem
                    icon={DollarSign}
                    label="Tuition Fee"
                    value={`$${program.tuitionFee.toLocaleString()}`}
                  />

                  <MetadataItem
                    icon={Calendar}
                    label="Next Intake"
                    value={new Date(program.nextIntake).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleViewProgram(program)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleComprehensiveEditProgram(program)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSettingsProgram(program)}
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </ModernCard>
          ))}
        </div>
      </ConditionalDataWrapper>

      {/* No longer using ProgramWizard dialog - now navigates to separate page */}

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