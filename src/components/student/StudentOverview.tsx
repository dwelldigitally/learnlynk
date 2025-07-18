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
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Student Information</h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Student ID</span>
                <span className="text-xs font-medium">{student.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Email</span>
                <span className="text-xs font-medium">{student.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Program</span>
                <span className="text-xs font-medium">{student.program}</span>
              </div>
            </div>
          </Card>

          {/* Appointment Calendar */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Upcoming Appointments</h3>
            <AppointmentCalendar />
          </Card>

          {/* Advisor Contact */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Your Advisor</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 overflow-hidden rounded-full mr-3">
                <img src={advisor.avatar} alt="Advisor" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{advisor.name}</h4>
                <p className="text-xs text-gray-600">{advisor.title}</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <Button variant="outline" size="sm" className="w-full text-xs flex items-center gap-2">
                <Mail className="w-3 h-3" />
                {advisor.email}
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                {advisor.phone}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;