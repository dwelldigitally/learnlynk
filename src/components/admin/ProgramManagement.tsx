import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgramWizard from "./ProgramWizard";
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
  Settings
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ProgramManagement: React.FC = () => {
  const { toast } = useToast();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [comprehensiveEditModalOpen, setComprehensiveEditModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const programs = [
    {
      id: "1",
      name: "Health Care Assistant",
      description: "Comprehensive healthcare training program preparing students for careers in healthcare support.",
      shortDescription: "Healthcare training program",
      marketingCopy: "",
      images: [],
      duration: "10 months",
      type: "certificate" as const,
      campus: ["Surrey Campus"],
      deliveryMethod: "in-person" as const,
      color: "#3B82F6",
      status: "active" as const,
      category: "Healthcare",
      tags: ["healthcare", "support", "training"],
      urlSlug: "health-care-assistant",
      entryRequirements: [
        {
          id: "req-1",
          type: "academic",
          title: "High School Diploma",
          description: "Grade 12 graduation or equivalent",
          mandatory: true,
          minimumGrade: "C+",
          details: "Must include English 12 and Biology 11 or 12"
        },
        {
          id: "req-2", 
          type: "health",
          title: "Medical Clearance",
          description: "Current immunizations and health screening",
          mandatory: true,
          details: "Required for clinical placements"
        }
      ],
      documentRequirements: [
        {
          id: "doc-1",
          name: "Official Transcripts",
          description: "High school and post-secondary transcripts",
          mandatory: true,
          acceptedFormats: ["PDF", "JPG", "PNG"],
          maxSize: 5,
          stage: "Application",
          order: 1,
          instructions: "Submit official transcripts from all institutions attended"
        },
        {
          id: "doc-2",
          name: "Immunization Records", 
          description: "Proof of required vaccinations",
          mandatory: true,
          acceptedFormats: ["PDF", "JPG"],
          maxSize: 3,
          stage: "Pre-enrollment",
          order: 2,
          instructions: "Must include MMR, Hepatitis B, and TB screening"
        }
      ],
      feeStructure: {
        domesticFees: [
          {
            id: "fee-1",
            type: "Tuition Fee",
            amount: 15500,
            currency: "CAD",
            required: true,
            description: "Main program tuition fee for domestic students"
          },
          {
            id: "fee-2", 
            type: "Technology Fee",
            amount: 350,
            currency: "CAD",
            required: true,
            description: "Technology and equipment usage fee"
          }
        ],
        internationalFees: [
          {
            id: "fee-3",
            type: "Tuition Fee", 
            amount: 22500,
            currency: "CAD",
            required: true,
            description: "Main program tuition fee for international students"
          },
          {
            id: "fee-4",
            type: "Technology Fee",
            amount: 350,
            currency: "CAD", 
            required: true,
            description: "Technology and equipment usage fee"
          },
          {
            id: "fee-5",
            type: "International Student Services Fee",
            amount: 750,
            currency: "CAD",
            required: true,
            description: "Additional services and support for international students"
          }
        ],
        paymentPlans: [],
        scholarships: [],
      },
      customQuestions: [],
      intakes: [
        { 
          id: "intake-1",
          date: "2024-04-15", 
          capacity: 70, 
          enrolled: 65, 
          status: "open" as const,
          applicationDeadline: "2024-04-01",
          notifications: []
        },
        { 
          id: "intake-2",
          date: "2024-07-15", 
          capacity: 70, 
          enrolled: 45, 
          status: "open" as const,
          applicationDeadline: "2024-07-01",
          notifications: []
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "admin",
      // Legacy fields for display
      enrolled: 245,
      capacity: 280,
      tuitionFee: 15500, // Using domestic tuition for display
      nextIntake: "2024-04-15",
    },
    {
      id: "2",
      name: "Early Childhood Education",
      description: "Develop skills needed to work with children in various educational settings.",
      shortDescription: "Early childhood education",
      marketingCopy: "",
      images: [],
      duration: "12 months",
      type: "diploma" as const,
      campus: ["Vancouver Campus"],
      deliveryMethod: "in-person" as const,
      color: "#10B981",
      status: "active" as const,
      category: "Education",
      tags: ["education", "children", "teaching"],
      urlSlug: "early-childhood-education",
      entryRequirements: [
        {
          id: "req-3",
          type: "academic",
          title: "High School Diploma",
          description: "Grade 12 graduation or equivalent",
          mandatory: true,
          minimumGrade: "B",
          details: "Must include English 12 and Psychology or Child Development course"
        },
        {
          id: "req-4",
          type: "experience", 
          title: "Volunteer Experience",
          description: "20 hours of volunteer work with children",
          mandatory: false,
          details: "Recommended but not required for admission"
        }
      ],
      documentRequirements: [
        {
          id: "doc-3",
          name: "Official Transcripts",
          description: "High school transcripts showing completion",
          mandatory: true,
          acceptedFormats: ["PDF", "JPG", "PNG"],
          maxSize: 5,
          stage: "Application",
          order: 1,
          instructions: "Submit official high school transcripts"
        },
        {
          id: "doc-4",
          name: "Criminal Record Check",
          description: "Clear criminal background check",
          mandatory: true,
          acceptedFormats: ["PDF"],
          maxSize: 2,
          stage: "Pre-enrollment", 
          order: 2,
          instructions: "Must be completed within 6 months of program start"
        }
      ],
      feeStructure: {
        domesticFees: [
          {
            id: "fee-6",
            type: "Tuition Fee",
            amount: 18500,
            currency: "CAD",
            required: true,
            description: "Main program tuition fee for domestic students"
          },
          {
            id: "fee-7",
            type: "Books & Materials",
            amount: 650,
            currency: "CAD",
            required: true,
            description: "Required textbooks and learning materials"
          }
        ],
        internationalFees: [
          {
            id: "fee-8",
            type: "Tuition Fee",
            amount: 26500,
            currency: "CAD",
            required: true,
            description: "Main program tuition fee for international students"
          },
          {
            id: "fee-9",
            type: "Books & Materials",
            amount: 650,
            currency: "CAD",
            required: true,
            description: "Required textbooks and learning materials"
          },
          {
            id: "fee-10",
            type: "International Student Services Fee",
            amount: 950,
            currency: "CAD",
            required: true,
            description: "Additional services and support for international students"
          }
        ],
        paymentPlans: [],
        scholarships: [],
      },
      customQuestions: [],
      intakes: [
        { 
          id: "intake-3",
          date: "2024-05-01", 
          capacity: 45, 
          enrolled: 42, 
          status: "open" as const,
          applicationDeadline: "2024-04-15",
          notifications: []
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "admin",
      // Legacy fields for display
      enrolled: 156,
      capacity: 180,
      tuitionFee: 18500, // Using domestic tuition for display
      nextIntake: "2024-05-01",
    }
  ];

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
    // Here you would update the programs list in state or make an API call
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
                  <span>{program.enrolled}/{program.capacity}</span>
                </div>
                <Progress value={(program.enrolled / program.capacity) * 100} className="h-2" />
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

      {/* Detailed Management Tabs */}
      <Tabs defaultValue="intakes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="intakes">Intake Management</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="marketing">Marketing & Assets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="intakes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Intake Management</CardTitle>
                <Button onClick={() => handleAddIntake()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Intake
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {programs.map((program) => (
                  <div key={program.id} className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: program.color }}
                      />
                      {program.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {program.intakes.map((intake, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">
                                {new Date(intake.date).toLocaleDateString()}
                              </p>
                              <Badge variant={
                                intake.status === 'open' ? 'default' :
                                intake.status === 'planning' ? 'outline' : 'secondary'
                              }>
                                {intake.status}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Enrolled</span>
                                <span>{intake.enrolled}/{intake.capacity}</span>
                              </div>
                              <Progress 
                                value={(intake.enrolled / intake.capacity) * 100} 
                                className="h-1" 
                              />
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleEditIntake(program.id, `intake-${index}`)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => toast({ title: "Calendar", description: "Calendar view coming soon" })}
                              >
                                <Calendar className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Program Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configure document requirements and admission criteria for each program.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>Marketing & Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage program images, marketing copy, and promotional materials.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Program Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View enrollment trends, conversion rates, and program performance metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProgramWizard 
        open={showWizard} 
        onOpenChange={setShowWizard}
        onSave={(program) => {
          console.log('Program created:', program);
          toast({
            title: "Program Created",
            description: `${program.name} has been successfully created.`,
          });
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