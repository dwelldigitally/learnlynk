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
    startDate: "September 5, 2024"
  };

  const courses = [
    {
      code: "HCA101",
      name: "Introduction to Health Care",
      deliveryMode: "Online",
      prerequisites: [],
      description: "Foundational concepts in healthcare delivery and patient care. This course covers basic healthcare principles, patient rights, and introduction to the healthcare system."
    },
    {
      code: "HCA102", 
      name: "Human Anatomy & Physiology",
      deliveryMode: "In-Person",
      prerequisites: [],
      description: "Comprehensive study of human body systems and their functions. Includes laboratory sessions for hands-on learning of anatomical structures."
    },
    {
      code: "HCA201",
      name: "Personal Care Skills",
      deliveryMode: "In-Person",
      prerequisites: ["HCA101"],
      description: "Hands-on training in personal care assistance including bathing, dressing, mobility assistance, and maintaining patient dignity and privacy."
    },
    {
      code: "HCA202",
      name: "Communication in Healthcare", 
      deliveryMode: "Hybrid",
      prerequisites: ["HCA101"],
      description: "Effective communication with patients, families, and healthcare teams. Covers therapeutic communication, documentation, and cultural sensitivity."
    },
    {
      code: "HCA301",
      name: "Mental Health Support",
      deliveryMode: "In-Person",
      prerequisites: ["HCA201", "HCA202"],
      description: "Supporting patients with mental health challenges, recognizing signs of distress, and implementing appropriate interventions under supervision."
    },
    {
      code: "HCA302",
      name: "Clinical Practicum",
      deliveryMode: "In-Person",
      prerequisites: ["HCA201", "HCA202", "HCA301"],
      description: "Supervised hands-on experience in real healthcare settings. Students work with experienced professionals to apply learned skills in practice."
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
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📚 Program Information</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Program Duration:</span>
                <span className="font-medium">{currentProgram.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span className="font-medium">{currentProgram.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Courses:</span>
                <span className="font-medium">{courses.length} courses</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="curriculum" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="curriculum">Course Offerings</TabsTrigger>
          <TabsTrigger value="calendar">Academic Calendar</TabsTrigger>
          <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Available Courses
                </CardTitle>
                <CardDescription>
                  Courses offered in your program with delivery modes and descriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{course.code}</h3>
                          <Badge variant={course.deliveryMode === "Online" ? "default" : course.deliveryMode === "In-Person" ? "secondary" : "outline"}>
                            {course.deliveryMode}
                          </Badge>
                        </div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-gray-600 mt-2">{course.description}</p>
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

      </Tabs>
    </div>
  );
};

export default AcademicPlanning;