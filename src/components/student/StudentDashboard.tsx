
import React, { useState } from "react";
import { Calendar, Clock, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Student, AdmissionStep, NewsEvent, AdvisorProfile } from "@/types/student";
import AdmissionsProgress from "@/components/student/AdmissionsProgress";
import AppointmentCalendar from "@/components/student/AppointmentCalendar";
import NewsEventCard from "@/components/student/NewsEventCard";
import healthcareWelcome from "@/assets/healthcare-welcome.jpg";
import ucatMaster from "@/assets/ucat-master.jpg";
import ucatScore from "@/assets/ucat-score.jpg";
import ucatUltimate from "@/assets/ucat-ultimate.jpg";
import advisorNicole from "@/assets/advisor-nicole.jpg";
import authorAhmed from "@/assets/author-ahmed.jpg";
import authorSarah from "@/assets/author-sarah.jpg";
import authorRobert from "@/assets/author-robert.jpg";
import alumniNicole from "@/assets/alumni-nicole.jpg";

const StudentDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("personal");
  const [intake, setIntake] = useState("15th March 2025");
  
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
  
  // Mock news and events data
  const newsEvents: NewsEvent[] = [
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
  ];

  return (
    <div>
      {/* Program Header with Intake Selection */}
      <div className="bg-purple-900 text-white px-8 py-4 rounded-lg mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">{student.program}</h2>
        <div className="flex items-center">
          <span className="mr-2">Select Your Intake</span>
          <Button variant="outline" className="bg-transparent border-white text-white flex items-center gap-2">
            {intake}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="personal" className="mb-6">
        <TabsList className="border-b border-gray-200 w-full justify-start">
          <TabsTrigger value="personal" className="text-sm px-6 py-3">Personal Details</TabsTrigger>
          <TabsTrigger value="education" className="text-sm px-6 py-3">Education</TabsTrigger>
          <TabsTrigger value="work" className="text-sm px-6 py-3">Work Experience</TabsTrigger>
          <TabsTrigger value="documents" className="text-sm px-6 py-3">Documents</TabsTrigger>
          <TabsTrigger value="fee" className="text-sm px-6 py-3">Registration Fee</TabsTrigger>
        </TabsList>
      </Tabs>

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
                <Button className="bg-purple-900 hover:bg-purple-800 text-white flex items-center gap-2">
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

          {/* Form Fields */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="First Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Last Name" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </Button>
            </div>
          </Card>

          {/* Admissions Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Admissions Stage</h3>
            <AdmissionsProgress currentStage={student.stage} />
          </Card>

          {/* Latest News & Events */}
          <div>
            <h3 className="text-xl font-bold mb-4">Latest HCA News & Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newsEvents.map((event) => (
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
              <div className="flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="10"
                    strokeDasharray={`${student.acceptanceLikelihood * 3.14}, 1000`}
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-green-500">{student.acceptanceLikelihood}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              If you apply before 26/05/2025
            </p>
          </Card>

          {/* Advisor Card */}
          <Card className="p-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                <img 
                  src={advisor.avatar} 
                  alt={advisor.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-medium text-center">{advisor.name}</h3>
              <p className="text-sm text-gray-500 text-center">{advisor.title}</p>
              
              <div className="flex items-center space-x-3 mt-3">
                <a href={`mailto:${advisor.email}`} className="flex items-center text-gray-500 hover:text-blue-600">
                  <Mail size={16} className="mr-1" />
                  <span className="text-xs">{advisor.email}</span>
                </a>
                <a href={`tel:${advisor.phone}`} className="flex items-center text-gray-500 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone mr-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span className="text-xs">{advisor.phone}</span>
                </a>
              </div>
            </div>
          </Card>

          {/* Calendar */}
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-3">Select a Date & Time</h3>
            <AppointmentCalendar />
            <Button className="w-full mt-4 bg-gray-500 hover:bg-gray-600">Book An Appointment</Button>
          </Card>

          {/* AI Chatbot Badge */}
          <div className="fixed bottom-20 right-20 bg-blue-500 text-white p-3 rounded-full shadow-lg w-64 flex items-center">
            <div className="bg-white rounded-full p-1 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="blue" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <div className="text-xs">Hi! I'm Aura, Your 24/7 AI</div>
              <div className="text-xs">Admissions Advisor <span className="underline cursor-pointer">Chat Now</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
