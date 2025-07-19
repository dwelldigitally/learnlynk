import React, { useState } from "react";
import { Calendar, Clock, Mail, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Student, AdmissionStep, NewsEvent, AdvisorProfile } from "@/types/student";
import AdmissionsProgress from "@/components/student/AdmissionsProgress";
import AppointmentCalendar from "@/components/student/AppointmentCalendar";
import NewsEventCard from "@/components/student/NewsEventCard";
import AdmissionForm from "@/components/student/AdmissionForm";
import healthcareWelcome from "@/assets/healthcare-welcome.jpg";
import ucatMaster from "@/assets/ucat-master.jpg";
import ucatScore from "@/assets/ucat-score.jpg";
import ucatUltimate from "@/assets/ucat-ultimate.jpg";
import advisorNicole from "@/assets/advisor-nicole.jpg";
import authorAhmed from "@/assets/author-ahmed.jpg";
import authorSarah from "@/assets/author-sarah.jpg";
import authorRobert from "@/assets/author-robert.jpg";
import alumniNicole from "@/assets/alumni-nicole.jpg";

const StudentOverview: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("personal");
  const [intake, setIntake] = useState("15th March 2025");
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [isIntakePopoverOpen, setIsIntakePopoverOpen] = useState(false);
  
  // Mock intake options with availability
  const intakeOptions = [
    { date: "15th March 2025", seats: 12, totalSeats: 30 },
    { date: "20th May 2025", seats: 25, totalSeats: 30 },
    { date: "15th September 2025", seats: 8, totalSeats: 30 },
    { date: "10th November 2025", seats: 30, totalSeats: 30 }
  ];
  
  // Mock student data
  const student: Student = {
    id: "1",
    firstName: "Tushar",
    lastName: "Malhotra",
    email: "Tushar.Malhotra@student.wcc.ca",
    studentId: "WCC1047859",
    program: "Health Care Assistant",
    stage: "SEND_DOCUMENTS",
    acceptanceLikelihood: 80
  };

  // Mock advisor data
  const advisor: AdvisorProfile = {
    name: "Nicole Ye",
    title: "Senior Admissions Advisor",
    email: "nicole@wcc.ca",
    phone: "(604)-594-3500",
    avatar: advisorNicole
  };
  
  // Program-specific blog content
  const getProgramContent = (program: string) => {
    switch (program) {
      case "Health Care Assistant":
        return {
          title: "Latest HCA News & Events",
          events: [
            {
              id: "1",
              title: "Patient Care Excellence Workshop",
              description: "Essential techniques for compassionate patient care and communication",
              image: healthcareWelcome,
              author: {
                name: "Dr. Sarah Mitchell",
                role: "Healthcare Instructor",
                avatar: authorSarah
              },
              duration: "3 Hours",
              lessons: 8
            },
            {
              id: "2",
              title: "Medical Terminology Mastery",
              description: "Comprehensive guide to healthcare terminology and documentation",
              image: ucatScore,
              author: {
                name: "Ahmed Shafi",
                role: "Clinical Expert",
                avatar: authorAhmed
              },
              duration: "5 Hours",
              lessons: 12
            },
            {
              id: "3",
              title: "Infection Control & Safety",
              description: "Critical protocols for maintaining safe healthcare environments",
              image: ucatUltimate,
              author: {
                name: "Mr. Robert Turner",
                role: "Safety Coordinator",
                avatar: authorRobert
              },
              duration: "4 Hours",
              lessons: 10
            }
          ]
        };
      case "Business Administration":
        return {
          title: "Latest Business News & Events",
          events: [
            {
              id: "1",
              title: "Modern Leadership Strategies",
              description: "Develop essential leadership skills for today's business environment",
              image: ucatMaster,
              author: {
                name: "Dr. Sarah Mitchell",
                role: "Business Professor",
                avatar: authorSarah
              },
              duration: "6 Hours",
              lessons: 15
            },
            {
              id: "2",
              title: "Financial Management Fundamentals",
              description: "Master the basics of business finance and budgeting",
              image: ucatScore,
              author: {
                name: "Ahmed Shafi",
                role: "Finance Expert",
                avatar: authorAhmed
              },
              duration: "8 Hours",
              lessons: 20
            },
            {
              id: "3",
              title: "Digital Marketing Trends",
              description: "Stay ahead with the latest digital marketing strategies",
              image: ucatUltimate,
              author: {
                name: "Mr. Robert Turner",
                role: "Marketing Director",
                avatar: authorRobert
              },
              duration: "5 Hours",
              lessons: 12
            }
          ]
        };
      default:
        return {
          title: "Latest Program News & Events",
          events: [
            {
              id: "1",
              title: "MASTER THE UCAT",
              description: "2000+ Practice Questions, 100+ Comprehensive Lessons",
              image: ucatMaster,
              author: {
                name: "Ahmed Shafi",
                role: "Reasoning Expert",
                avatar: authorAhmed
              },
              duration: "10 Hours",
              lessons: 11
            },
            {
              id: "2",
              title: "Score Higher on the UCAT",
              description: "Sixth Edition",
              image: ucatScore,
              author: {
                name: "Dr. Sarah Mitchell",
                role: "Situational Judgment",
                avatar: authorSarah
              },
              duration: "20 Hours",
              lessons: 19
            },
            {
              id: "3",
              title: "The Ultimate UCAT",
              description: "Comprehensive preparation guide",
              image: ucatUltimate,
              author: {
                name: "Mr. Robert Turner",
                role: "Logical Reasoning",
                avatar: authorRobert
              },
              duration: "17 Hours",
              lessons: 15
            }
          ]
        };
    }
  };

  const programContent = getProgramContent(student.program);

  // Show admission form if requested
  if (showAdmissionForm) {
    return <AdmissionForm onBack={() => setShowAdmissionForm(false)} />;
  }

  return (
    <div>
      {/* Program Header with Intake Selection */}
      <div className="bg-purple-900 text-white px-8 py-4 rounded-lg mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">{student.program}</h2>
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
                  {intakeOptions.map((option) => (
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
                <h2 className="text-2xl font-bold mb-4">Welcome {student.firstName}</h2>
                <p className="mb-4">
                  We are so excited that you are applying for the {student.program} Program. 
                  There are 5 steps to apply for the program. You can stop anytime and 
                  continue later.
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
                  src={healthcareWelcome} 
                  alt="Healthcare Professional" 
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
                  {intake === "15th March 2025" ? "1st March 2025" :
                   intake === "20th May 2025" ? "5th May 2025" :
                   intake === "15th September 2025" ? "1st September 2025" :
                   "25th October 2025"}
                </div>
              </div>
            </div>
            <AdmissionsProgress currentStage={student.stage} />
            
            {/* Next Steps */}
            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-gray-900 mb-2">Next Steps Required:</h4>
              <div className="space-y-2">
                {student.stage === "LEAD_FORM" && (
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Complete and submit required documents (Transcripts, ID copy)
                  </div>
                )}
                {student.stage === "SEND_DOCUMENTS" && (
                  <>
                    <div className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                      Upload official transcripts and identification documents
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      Wait for document review and approval
                    </div>
                  </>
                )}
                {student.stage === "DOCUMENT_APPROVAL" && (
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                    Complete fee payment to secure your seat
                  </div>
                )}
                {student.stage === "FEE_PAYMENT" && (
                  <div className="flex items-center text-sm text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Final acceptance confirmation will be sent shortly
                  </div>
                )}
                {student.stage === "ACCEPTED" && (
                  <div className="flex items-center text-sm text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Congratulations! You're all set for your program start date.
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Latest News & Events */}
          <div>
            <h3 className="text-xl font-bold mb-4">{programContent.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {programContent.events.map((event) => (
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
                  <img src={alumniNicole} alt="Alumni" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium">Nicole Ye</h4>
                  <p className="text-sm text-gray-600">Class of 2022</p>
                  <p className="text-sm text-gray-600 mt-1">
                    "I graduated from the Health Care Assistant program and now work at Vancouver General Hospital."
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
              <Progress value={student.acceptanceLikelihood} className="h-2" />
              <div className="flex justify-between text-xs mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{student.acceptanceLikelihood}% Chance of acceptance based on current stage</p>
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
                  <span className="text-sm font-medium text-gray-700">Student ID</span>
                  <span className="text-sm font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">{student.studentId}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <span className="text-sm font-semibold text-gray-900">{student.email}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Program</span>
                  <span className="text-sm font-semibold text-purple-900">{student.program}</span>
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