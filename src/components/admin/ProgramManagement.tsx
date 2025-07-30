import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgramWizard from "./ProgramWizard";
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
  const [showWizard, setShowWizard] = useState(false);

  const programs = [
    {
      id: "1",
      name: "Health Care Assistant",
      description: "Comprehensive healthcare training program preparing students for careers in healthcare support.",
      duration: "10 months",
      type: "Certificate",
      campus: "Surrey Campus",
      color: "#3B82F6",
      status: "active",
      enrolled: 245,
      capacity: 280,
      tuitionFee: 15500,
      nextIntake: "2024-04-15",
      intakes: [
        { date: "2024-04-15", capacity: 70, enrolled: 65, status: "open" },
        { date: "2024-07-15", capacity: 70, enrolled: 45, status: "open" },
        { date: "2024-10-15", capacity: 70, enrolled: 12, status: "open" },
        { date: "2025-01-15", capacity: 70, enrolled: 0, status: "planning" }
      ]
    },
    {
      id: "2",
      name: "Early Childhood Education",
      description: "Develop skills needed to work with children in various educational settings.",
      duration: "12 months",
      type: "Diploma",
      campus: "Vancouver Campus",
      color: "#10B981",
      status: "active",
      enrolled: 156,
      capacity: 180,
      tuitionFee: 18500,
      nextIntake: "2024-05-01",
      intakes: [
        { date: "2024-05-01", capacity: 45, enrolled: 42, status: "open" },
        { date: "2024-09-01", capacity: 45, enrolled: 23, status: "open" },
        { date: "2025-01-01", capacity: 45, enrolled: 8, status: "open" }
      ]
    },
    {
      id: "3",
      name: "Aviation Maintenance",
      description: "Technical training for aircraft maintenance and aerospace industry careers.",
      duration: "18 months",
      type: "Diploma",
      campus: "Richmond Campus",
      color: "#8B5CF6",
      status: "active",
      enrolled: 89,
      capacity: 120,
      tuitionFee: 24500,
      nextIntake: "2024-06-01",
      intakes: [
        { date: "2024-06-01", capacity: 30, enrolled: 28, status: "open" },
        { date: "2024-10-01", capacity: 30, enrolled: 15, status: "open" }
      ]
    }
  ];


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
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
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
                <Button>
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
                              <Button variant="outline" size="sm" className="flex-1">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
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
          // Add to programs list
        }}
      />
    </div>
  );
};

export default ProgramManagement;