import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { BookOpen, Clock, CheckCircle, AlertCircle, Calendar as CalendarIcon, GraduationCap } from "lucide-react";

const AcademicPlanning: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const currentProgram = {
    name: "Health Care Assistant",
    duration: "6 months",
    totalCredits: 180,
    completedCredits: 45,
    startDate: "September 5, 2024",
    expectedGraduation: "March 15, 2025"
  };

  const courses = [
    {
      code: "HCA101",
      name: "Introduction to Health Care",
      credits: 15,
      status: "completed",
      grade: "A-",
      prerequisites: [],
      description: "Foundational concepts in healthcare delivery and patient care"
    },
    {
      code: "HCA102",
      name: "Human Anatomy & Physiology",
      credits: 20,
      status: "completed",
      grade: "B+",
      prerequisites: [],
      description: "Study of human body systems and their functions"
    },
    {
      code: "HCA201",
      name: "Personal Care Skills",
      credits: 25,
      status: "current",
      grade: null,
      prerequisites: ["HCA101"],
      description: "Hands-on training in personal care assistance"
    },
    {
      code: "HCA202",
      name: "Communication in Healthcare",
      credits: 15,
      status: "upcoming",
      grade: null,
      prerequisites: ["HCA101"],
      description: "Effective communication with patients and healthcare teams"
    },
    {
      code: "HCA301",
      name: "Mental Health Support",
      credits: 20,
      status: "upcoming",
      grade: null,
      prerequisites: ["HCA201", "HCA202"],
      description: "Supporting patients with mental health challenges"
    },
    {
      code: "HCA302",
      name: "Clinical Practicum",
      credits: 80,
      status: "upcoming",
      grade: null,
      prerequisites: ["HCA201", "HCA202", "HCA301"],
      description: "Supervised hands-on experience in healthcare settings"
    }
  ];

  const academicCalendar = [
    { date: "March 15, 2024", event: "Course Registration Opens", type: "registration" },
    { date: "April 1, 2024", event: "Spring Break", type: "break" },
    { date: "April 15, 2024", event: "Mid-term Exams", type: "exam" },
    { date: "May 1, 2024", event: "Final Project Due", type: "assignment" },
    { date: "May 15, 2024", event: "Final Exams", type: "exam" },
    { date: "June 1, 2024", event: "Graduation Ceremony", type: "graduation" }
  ];

  const prerequisites = [
    {
      name: "First Aid/CPR Certification",
      status: "completed",
      expiryDate: "March 2026",
      required: true
    },
    {
      name: "Criminal Record Check",
      status: "completed",
      expiryDate: "September 2024",
      required: true
    },
    {
      name: "Immunization Records",
      status: "pending",
      expiryDate: null,
      required: true
    },
    {
      name: "TB Test",
      status: "upcoming",
      expiryDate: null,
      required: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "current":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "upcoming":
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "current":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const progressPercentage = (currentProgram.completedCredits / currentProgram.totalCredits) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Academic Planning</h1>
        <p className="text-gray-600 mt-2">Track your academic progress and plan your educational journey</p>
      </div>

      {/* Program Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Current Program: {currentProgram.name}
          </CardTitle>
          <CardDescription>
            {currentProgram.duration} program • Started {currentProgram.startDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Credits Completed</span>
                <span>{currentProgram.completedCredits} / {currentProgram.totalCredits}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{progressPercentage.toFixed(1)}% complete</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-sm">Expected Graduation</h4>
                <p className="text-lg font-semibold text-green-600">{currentProgram.expectedGraduation}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Remaining Credits</h4>
                <p className="text-lg font-semibold">{currentProgram.totalCredits - currentProgram.completedCredits}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="curriculum" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="calendar">Academic Calendar</TabsTrigger>
          <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
          <TabsTrigger value="planner">Course Planner</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Curriculum
              </CardTitle>
              <CardDescription>
                Your complete program curriculum and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(course.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{course.code}</h3>
                          <Badge className={getStatusColor(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-gray-600">{course.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{course.credits} credits</div>
                      {course.grade && (
                        <div className="text-sm text-green-600 font-medium">{course.grade}</div>
                      )}
                    </div>
                  </div>
                  {course.prerequisites.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Prerequisites:</h4>
                      <div className="flex flex-wrap gap-1">
                        {course.prerequisites.map((prereq, prereqIndex) => (
                          <Badge key={prereqIndex} variant="outline" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
                <CardDescription>Key academic calendar events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {academicCalendar.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded">
                    <div className="text-xs font-medium text-gray-500">{item.date}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.event}</div>
                      <Badge variant="outline" className="text-xs mt-1">{item.type}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prerequisites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Prerequisites</CardTitle>
              <CardDescription>
                Required certifications and documentation for your program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prerequisites.map((prereq, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(prereq.status)}
                      <div>
                        <h3 className="font-semibold">{prereq.name}</h3>
                        {prereq.expiryDate && (
                          <p className="text-sm text-gray-600">Expires: {prereq.expiryDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(prereq.status)}>
                        {prereq.status}
                      </Badge>
                      {prereq.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                  </div>
                  {prereq.status === "pending" && (
                    <Button size="sm" className="w-full">Upload Document</Button>
                  )}
                  {prereq.status === "upcoming" && (
                    <Button size="sm" variant="outline" className="w-full">Schedule Appointment</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Planning Wizard</CardTitle>
              <CardDescription>
                Plan your course sequence and track your path to graduation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Your Academic Plan</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span>Current Semester:</span>
                    <span className="font-medium">Semester 2 of 3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credits This Semester:</span>
                    <span className="font-medium">40 credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span>On Track for Graduation:</span>
                    <span className="font-medium text-green-600">Yes ✓</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Next Semester Recommendations</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">HCA301 - Mental Health Support</span>
                      <div className="text-sm text-gray-600">20 credits • Prerequisites met</div>
                    </div>
                    <Button size="sm">Add to Plan</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">HCA302 - Clinical Practicum</span>
                      <div className="text-sm text-gray-600">80 credits • Prerequisites pending</div>
                    </div>
                    <Button size="sm" variant="outline" disabled>Unavailable</Button>
                  </div>
                </div>
              </div>

              <Button className="w-full">Generate Full Academic Plan</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicPlanning;