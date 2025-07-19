
import React, { useState } from "react";
import { Calendar, Clock, Mail, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AdmissionsProgress from "@/components/student/AdmissionsProgress";
import NewsEventCard from "@/components/student/NewsEventCard";
import AdmissionForm from "@/components/student/AdmissionForm";
import { studentApplications } from "@/data/studentApplications";
import { programWelcomeContent } from "@/data/programContent";
import { programAlumni } from "@/data/programAlumni";
import advisorNicole from "@/assets/advisor-nicole.jpg";

const StudentOverview: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState("Health Care Assistant");
  const [intake, setIntake] = useState("15th March 2025");
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [isIntakePopoverOpen, setIsIntakePopoverOpen] = useState(false);
  const [isProgramPopoverOpen, setIsProgramPopoverOpen] = useState(false);
  
  // Program list with their specific intake dates
  const allPrograms = {
    "Health Care Assistant": [
      { date: "15th March 2025", seats: 12, totalSeats: 30 },
      { date: "20th May 2025", seats: 25, totalSeats: 30 },
      { date: "15th September 2025", seats: 8, totalSeats: 30 },
      { date: "10th November 2025", seats: 30, totalSeats: 30 }
    ],
    "Education Assistant": [
      { date: "5th February 2025", seats: 18, totalSeats: 25 },
      { date: "10th June 2025", seats: 20, totalSeats: 25 },
      { date: "1st October 2025", seats: 15, totalSeats: 25 }
    ],
    "Aviation": [
      { date: "20th January 2025", seats: 8, totalSeats: 20 },
      { date: "15th April 2025", seats: 12, totalSeats: 20 },
      { date: "10th August 2025", seats: 16, totalSeats: 20 },
      { date: "5th December 2025", seats: 20, totalSeats: 20 }
    ],
    "Hospitality": [
      { date: "1st March 2025", seats: 22, totalSeats: 35 },
      { date: "1st July 2025", seats: 28, totalSeats: 35 },
      { date: "1st November 2025", seats: 35, totalSeats: 35 }
    ],
    "ECE": [
      { date: "10th February 2025", seats: 14, totalSeats: 30 },
      { date: "25th May 2025", seats: 24, totalSeats: 30 },
      { date: "20th September 2025", seats: 18, totalSeats: 30 }
    ],
    "MLA": [
      { date: "1st January 2025", seats: 10, totalSeats: 15 },
      { date: "1st May 2025", seats: 12, totalSeats: 15 },
      { date: "1st September 2025", seats: 15, totalSeats: 15 }
    ]
  };
  
  // Get current program's intake options
  const availableIntakes = allPrograms[selectedProgram as keyof typeof allPrograms] || allPrograms["Health Care Assistant"];
  
  // Update intake when program changes
  const handleProgramChange = (program: string) => {
    setSelectedProgram(program);
    const programSchedule = allPrograms[program as keyof typeof allPrograms];
    if (programSchedule && programSchedule.length > 0) {
      setIntake(programSchedule[0].date);
    }
    setIsProgramPopoverOpen(false);
  };
  
  // Get current application data
  const currentApplication = studentApplications[selectedProgram];
  const currentWelcomeContent = programWelcomeContent[selectedProgram];
  const currentAlumni = programAlumni[selectedProgram];
  
  // Mock advisor data
  const advisor = {
    name: "Nicole Ye",
    title: "Senior Admissions Advisor",
    email: "nicole@wcc.ca",
    phone: "(604)-594-3500",
    avatar: advisorNicole
  };

  // Show admission form if requested
  if (showAdmissionForm) {
    return <AdmissionForm onBack={() => setShowAdmissionForm(false)} />;
  }

  return (
    <div>
      {/* Program Header with Program and Intake Selection */}
      <div className="bg-purple-900 text-white px-8 py-4 rounded-lg mb-6 flex justify-between items-center">
        <Popover open={isProgramPopoverOpen} onOpenChange={setIsProgramPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-white hover:bg-white/10 p-0 text-xl font-bold flex items-center gap-2">
              {selectedProgram}
              <ChevronDown className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-white z-50" align="start">
            <div className="p-4">
              <h3 className="font-medium text-lg mb-3 text-gray-900">Select Program</h3>
              <div className="space-y-2">
                {Object.keys(allPrograms).map((program) => (
                  <div 
                    key={program}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedProgram === program ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleProgramChange(program)}
                  >
                    <p className="font-medium text-gray-900">{program}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {allPrograms[program as keyof typeof allPrograms].length} intake dates available
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex items-center">
          <span className="mr-2">Select Your Intake</span>
          <Popover open={isIntakePopoverOpen} onOpenChange={setIsIntakePopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-transparent border-white text-white flex items-center gap-2 hover:bg-white/10">
                {intake}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4">
                <h3 className="font-medium text-lg mb-3">Select Intake Date</h3>
                <div className="space-y-3">
                  {availableIntakes.map((option) => (
                    <div 
                      key={option.date}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        intake === option.date ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                      }`}
                      onClick={() => {
                        setIntake(option.date);
                        setIsIntakePopoverOpen(false);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{option.date}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {option.seats} seats available
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            option.seats > 15 ? 'text-green-600' : 
                            option.seats > 5 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {option.seats}/{option.totalSeats}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                option.seats > 15 ? 'bg-green-500' : 
                                option.seats > 5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(option.seats / option.totalSeats) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Section */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Welcome Tushar</h2>
                <p className="mb-4">
                  {currentWelcomeContent.welcomeText}
                </p>
                <Button 
                  className="bg-purple-900 hover:bg-purple-800 text-white flex items-center gap-2"
                  onClick={() => setShowAdmissionForm(true)}
                >
                  Start Application
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src={currentWelcomeContent.welcomeImage} 
                  alt={`${selectedProgram} Professional`} 
                  className="rounded-lg w-full h-48 object-cover"
                />
              </div>
            </div>
          </Card>

          {/* Admissions Progress */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-green-900">Admissions Progress</h3>
              <div className="text-right">
                <div className="text-sm font-medium text-green-700">Application Deadline</div>
                <div className="text-lg font-bold text-green-900">
                  {currentApplication.applicationDeadline}
                </div>
              </div>
            </div>
            <AdmissionsProgress currentStage={currentApplication.stage} />
            
            {/* Next Steps */}
            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-900 mb-2">Next Steps Required:</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                  {currentApplication.nextStep}
                </div>
              </div>
            </div>
          </Card>

          {/* Latest News & Events */}
          <div>
            <h3 className="text-xl font-bold mb-4">{currentWelcomeContent.newsTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentWelcomeContent.events.map((event) => (
                <NewsEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Talk to Alumni */}
          <div>
            <h3 className="text-xl font-bold mb-4">Talk To Alumni</h3>
            <Card className="p-6">
              <div className="flex items-center">
                <div className="w-20 h-20 overflow-hidden rounded-full mr-6">
                  <img src={currentAlumni.avatar} alt="Alumni" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium">{currentAlumni.name}</h4>
                  <p className="text-sm text-gray-600">Class of {currentAlumni.graduationYear}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    "{currentAlumni.testimonial}"
                  </p>
                  <Button variant="outline" className="mt-2 text-xs">Schedule a Call</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Acceptance Likelihood */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Likelihood Of Acceptance</h3>
            <div className="relative mt-2">
              <Progress value={currentApplication.acceptanceLikelihood} className="h-2" />
              <div className="flex justify-between text-xs mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{currentApplication.acceptanceLikelihood}% Chance of acceptance based on current stage</p>
            </div>
            <Button variant="outline" size="sm" className="mt-3">View Details</Button>
          </Card>

          {/* Student Information */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              Student Profile
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Application ID</span>
                  <span className="text-sm font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">{currentApplication.id}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <span className="text-sm font-semibold text-gray-900">Tushar.Malhotra@student.wcc.ca</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Program</span>
                  <span className="text-sm font-semibold text-purple-900">{selectedProgram}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Appointment Calendar */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Schedule Appointment</h3>
            <div className="w-full h-96 border rounded-lg overflow-hidden">
              <iframe 
                src="https://calendly.com/learnlynkapp/30min?embed=true&hide_event_type_details=1&hide_gdpr_banner=1"
                width="100%" 
                height="100%" 
                frameBorder="0"
                title="Schedule appointment"
                className="border-0"
              />
            </div>
          </Card>

          {/* Advisor Contact */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              Your Advisor
            </h3>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-20 h-20 overflow-hidden rounded-full mr-4 border-4 border-blue-100">
                  <img src={advisor.avatar} alt="Advisor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{advisor.name}</h4>
                  <p className="text-sm text-blue-600 font-medium">{advisor.title}</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2 justify-start bg-blue-50 border-blue-200 hover:bg-blue-100">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{advisor.email}</span>
                </Button>
                <Button variant="outline" size="sm" className="w-full bg-blue-50 border-blue-200 hover:bg-blue-100">
                  <span className="text-sm font-medium">{advisor.phone}</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
