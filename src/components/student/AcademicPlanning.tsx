import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { BookOpen, Clock, CheckCircle, AlertCircle, Calendar as CalendarIcon, GraduationCap, PlayCircle, FileText, Users, MapPin, Star } from "lucide-react";
import { usePageEntranceAnimation, useStaggeredReveal } from "@/hooks/useAnimations";

const AcademicPlanning: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  // Animation hooks
  const isLoaded = usePageEntranceAnimation();
  const { visibleItems, ref: staggerRef } = useStaggeredReveal(4, 200);

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
      description: "Foundational concepts in healthcare delivery and patient care. This course covers basic healthcare principles, patient rights, and introduction to the healthcare system.",
      status: "completed",
      credits: 3,
      duration: "8 weeks",
      instructor: "Dr. Sarah Chen",
      learningOutcomes: [
        "Understand healthcare delivery systems",
        "Identify patient rights and responsibilities",
        "Apply basic healthcare principles"
      ],
      modules: [
        "Healthcare System Overview",
        "Patient-Centered Care",
        "Ethics in Healthcare",
        "Professional Communication"
      ]
    },
    {
      code: "HCA102", 
      name: "Human Anatomy & Physiology",
      deliveryMode: "In-Person",
      prerequisites: [],
      description: "Comprehensive study of human body systems and their functions. Includes laboratory sessions for hands-on learning of anatomical structures.",
      status: "current",
      credits: 4,
      duration: "12 weeks",
      instructor: "Prof. Michael Rodriguez",
      learningOutcomes: [
        "Identify major body systems and functions",
        "Analyze physiological processes",
        "Demonstrate laboratory techniques"
      ],
      modules: [
        "Cellular Biology",
        "Musculoskeletal System", 
        "Cardiovascular System",
        "Respiratory System",
        "Nervous System"
      ]
    },
    {
      code: "HCA201",
      name: "Personal Care Skills",
      deliveryMode: "In-Person",
      prerequisites: ["HCA101"],
      description: "Hands-on training in personal care assistance including bathing, dressing, mobility assistance, and maintaining patient dignity and privacy.",
      status: "upcoming",
      credits: 3,
      duration: "10 weeks",
      instructor: "Linda Thompson, RN",
      learningOutcomes: [
        "Perform personal care assistance safely",
        "Maintain patient dignity and privacy",
        "Use proper body mechanics"
      ],
      modules: [
        "Personal Hygiene Assistance",
        "Mobility and Transfer Techniques",
        "Nutrition and Feeding",
        "Infection Control"
      ]
    },
    {
      code: "HCA202",
      name: "Communication in Healthcare", 
      deliveryMode: "Hybrid",
      prerequisites: ["HCA101"],
      description: "Effective communication with patients, families, and healthcare teams. Covers therapeutic communication, documentation, and cultural sensitivity.",
      status: "upcoming",
      credits: 2,
      duration: "6 weeks",
      instructor: "Dr. Jennifer Walsh",
      learningOutcomes: [
        "Apply therapeutic communication techniques",
        "Document patient interactions effectively",
        "Demonstrate cultural sensitivity"
      ],
      modules: [
        "Therapeutic Communication",
        "Documentation Standards",
        "Cultural Competency",
        "Team Communication"
      ]
    },
    {
      code: "HCA301",
      name: "Mental Health Support",
      deliveryMode: "In-Person",
      prerequisites: ["HCA201", "HCA202"],
      description: "Supporting patients with mental health challenges, recognizing signs of distress, and implementing appropriate interventions under supervision.",
      status: "upcoming",
      credits: 3,
      duration: "8 weeks",
      instructor: "Dr. Robert Kim",
      learningOutcomes: [
        "Recognize mental health indicators",
        "Apply appropriate interventions",
        "Support patient emotional well-being"
      ],
      modules: [
        "Mental Health Basics",
        "Crisis Intervention",
        "Therapeutic Activities",
        "Support Strategies"
      ]
    },
    {
      code: "HCA302",
      name: "Clinical Practicum",
      deliveryMode: "In-Person",
      prerequisites: ["HCA201", "HCA202", "HCA301"],
      description: "Supervised hands-on experience in real healthcare settings. Students work with experienced professionals to apply learned skills in practice.",
      status: "upcoming",
      credits: 5,
      duration: "16 weeks",
      instructor: "Various Clinical Supervisors",
      learningOutcomes: [
        "Apply theoretical knowledge in practice",
        "Demonstrate professional competence",
        "Integrate all program learning"
      ],
      modules: [
        "Clinical Orientation",
        "Supervised Practice",
        "Performance Evaluation",
        "Professional Development"
      ]
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

  

  const getProgressPercentage = () => {
    const completedCourses = courses.filter(course => course.status === "completed").length;
    return Math.round((completedCourses / courses.length) * 100);
  };

  const getCourseStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "current":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "upcoming":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-subtle ${isLoaded ? 'animate-fade-up' : 'opacity-0'}`}>
      {/* Modern Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Course Catalog</h1>
              <p className="text-muted-foreground text-lg">Explore your academic journey and course content</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">{currentProgram.name}</span>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                Progress: {getProgressPercentage()}% Complete
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Course Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {courses.map((course, index) => (
            <Card key={index} className={`group hover:shadow-elegant transition-all duration-300 border-muted/40 ${visibleItems[index] ? 'animate-stagger-1' : 'opacity-0'}`} ref={index === 0 ? staggerRef : undefined}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-foreground">{course.code}</h3>
                        <Badge className={getCourseStatusColor(course.status)}>
                          {getStatusIcon(course.status)}
                          <span className="ml-1 capitalize">{course.status}</span>
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground">{course.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {course.credits} Credits
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.instructor}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                
                <div className="flex items-center gap-2">
                  <Badge variant={course.deliveryMode === "Online" ? "default" : course.deliveryMode === "In-Person" ? "secondary" : "outline"}>
                    <MapPin className="h-3 w-3 mr-1" />
                    {course.deliveryMode}
                  </Badge>
                </div>

                {course.prerequisites.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Prerequisites:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.prerequisites.map((prereq, prereqIndex) => (
                        <Badge key={prereqIndex} variant="outline" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Learning Outcomes
                  </h4>
                  <ul className="space-y-1">
                    {course.learningOutcomes.map((outcome, outcomeIndex) => (
                      <li key={outcomeIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <PlayCircle className="h-4 w-4" />
                    Course Modules
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="bg-muted/50 rounded-lg p-2 text-xs text-muted-foreground">
                        {module}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Tabs */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-background">Academic Calendar</TabsTrigger>
            <TabsTrigger value="prerequisites" className="data-[state=active]:bg-background">Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-muted/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-muted/40 pointer-events-auto"
                  />
                </CardContent>
              </Card>
              
              <Card className="border-muted/40">
                <CardHeader>
                  <CardTitle className="text-foreground">Important Dates</CardTitle>
                  <CardDescription>Key academic calendar events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {academicCalendar.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-muted/40 rounded-lg hover:bg-muted/30 transition-colors">
                      <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">{item.event}</div>
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prerequisites" className="space-y-4">
            <Card className="border-muted/40">
              <CardHeader>
                <CardTitle className="text-foreground">Program Requirements</CardTitle>
                <CardDescription>
                  Required certifications and documentation for your program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {prerequisites.map((prereq, index) => (
                  <div key={index} className="border border-muted/40 rounded-lg p-4 space-y-3 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(prereq.status)}
                        <div>
                          <h3 className="font-semibold text-foreground">{prereq.name}</h3>
                          {prereq.expiryDate && (
                            <p className="text-sm text-muted-foreground">Expires: {prereq.expiryDate}</p>
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
    </div>
  );
};

export default AcademicPlanning;