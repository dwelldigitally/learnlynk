import React, { useState } from "react";
import { Calendar, ChevronDown, CheckCircle, Clock, FileText, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { dummyStudentProfile } from "@/data/studentPortalDummyData";

const StudentOverview: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState("Health Care Assistant");
  const [intake, setIntake] = useState("15th March 2025");
  const [isProgramPopoverOpen, setIsProgramPopoverOpen] = useState(false);

  // Simplified program list
  const programs = [
    "Health Care Assistant",
    "Education Assistant", 
    "Aviation",
    "Hospitality",
    "ECE",
    "MLA"
  ];

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen">
      
      {/* Clean Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Welcome back, {dummyStudentProfile.firstName}
        </h1>
        <p className="text-muted-foreground">Here's your application status</p>
      </div>

      {/* Current Program Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              CURRENT PROGRAM
            </div>
            
            <Popover open={isProgramPopoverOpen} onOpenChange={setIsProgramPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-foreground">{selectedProgram}</h2>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-2">
                  {programs.map((program) => (
                    <div 
                      key={program}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedProgram === program 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => {
                        setSelectedProgram(program);
                        setIsProgramPopoverOpen(false);
                      }}
                    >
                      <p className="font-medium text-foreground">{program}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <p className="text-sm text-muted-foreground">Click to change program</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              INTAKE DATE
            </div>
            <p className="text-lg font-semibold text-foreground">{intake}</p>
          </div>
        </div>
      </Card>

      {/* Application Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Application Progress</h3>
          <span className="text-sm text-muted-foreground">Next: Interview Scheduling</span>
        </div>
        
        <div className="space-y-4">
          <Progress value={65} className="h-2" />
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Documents submitted • Financial aid applied</span>
            <span className="font-medium text-foreground">65% Complete</span>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => navigate('/student/applications')}
          >
            Continue Application
          </Button>
        </div>
      </Card>

      {/* Action Items */}
      <div className="grid gap-4 md:grid-cols-3">
        
        {/* Upload Documents */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground mb-1">Upload Documents</h4>
              <p className="text-sm text-muted-foreground mb-3">3 documents pending upload</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/student/documents')}
              >
                Upload Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Financial Aid */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground mb-1">Apply for Financial Aid</h4>
              <p className="text-sm text-muted-foreground mb-3">FAFSA and aid applications</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/student/financial-aid')}
              >
                Continue
              </Button>
            </div>
          </div>
        </Card>

        {/* Schedule Meeting */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground mb-1">Schedule Advisor Meeting</h4>
              <p className="text-sm text-muted-foreground mb-3">Plan your academic journey</p>
              <Button 
                size="sm" 
                variant="outline"
              >
                Schedule
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="p-4 border-l-4 border-l-primary">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Application Deadline</h4>
            <p className="text-sm text-muted-foreground">
              March 15, 2025 • 23 days remaining
            </p>
          </div>
        </div>
      </Card>

      {/* Financial Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Financial Overview</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tuition Fee</span>
            <span className="font-semibold text-foreground">$35,000</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Scholarship Available</span>
            <span className="font-semibold text-primary">Up to $5,000</span>
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/student/fee')}
            >
              View Payment Options
            </Button>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default StudentOverview;