import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { GlassCard } from "@/components/modern/GlassCard";
import { motion } from "framer-motion";
import { BookOpen, Clock, CheckCircle, AlertCircle, Calendar as CalendarIcon, GraduationCap, PlayCircle, FileText, Users, MapPin, Star, Target, ArrowRight, Trophy } from "lucide-react";

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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "current":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "upcoming":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "current":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "upcoming":
        return "bg-muted/50 text-muted-foreground border-border/50";
      default:
        return "bg-muted/50 text-muted-foreground border-border/50";
    }
  };

  const getProgressPercentage = () => {
    const completedCourses = courses.filter(course => course.status === "completed").length;
    return Math.round((completedCourses / courses.length) * 100);
  };

  const getCourseStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "current":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "upcoming":
        return "bg-muted/50 text-muted-foreground border-border/50";
      default:
        return "bg-muted/50 text-muted-foreground border-border/50";
    }
  };

  return (
    <div className="min-h-screen hero-gradient">
      {/* Modern Header */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
                    Course Catalog
                  </h1>
                  <p className="text-muted-foreground text-lg mt-1">
                    Explore your academic journey and course content
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-6 min-w-[280px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{currentProgram.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentProgram.duration} Program</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-primary">{getProgressPercentage()}% Complete</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Trophy className="h-3 w-3" />
                    <span>{courses.filter(c => c.status === "completed").length} of {courses.length} courses completed</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Course Grid */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">Course Overview</h2>
            <p className="text-muted-foreground">Detailed information about each course in your program</p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {courses.map((course, index) => (
              <motion.div
                key={course.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <GlassCard hover className="h-full">
                  <div className="p-6 space-y-6">
                    {/* Course Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-foreground">{course.code}</h3>
                            <Badge className={getCourseStatusColor(course.status)}>
                              {getStatusIcon(course.status)}
                              <span className="ml-1 capitalize">{course.status}</span>
                            </Badge>
                          </div>
                          <h4 className="text-lg font-semibold text-foreground mb-2">{course.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {course.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {course.credits} Credits
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Course Description */}
                    <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                    
                    {/* Course Details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge variant={course.deliveryMode === "Online" ? "default" : course.deliveryMode === "In-Person" ? "secondary" : "outline"}>
                          <MapPin className="h-3 w-3 mr-1" />
                          {course.deliveryMode}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {course.instructor}
                        </div>
                      </div>

                      {course.prerequisites.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-foreground">Prerequisites:</h5>
                          <div className="flex flex-wrap gap-2">
                            {course.prerequisites.map((prereq, prereqIndex) => (
                              <Badge key={prereqIndex} variant="outline" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Learning Outcomes */}
                      <div className="space-y-3">
                        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          Learning Outcomes
                        </h5>
                        <ul className="space-y-2">
                          {course.learningOutcomes.map((outcome, outcomeIndex) => (
                            <li key={outcomeIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Course Modules */}
                      <div className="space-y-3">
                        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-primary" />
                          Course Modules
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          {course.modules.map((module, moduleIndex) => (
                            <div key={moduleIndex} className="bg-muted/30 border border-border/50 rounded-lg p-3 text-xs text-muted-foreground font-medium">
                              {module}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Tabs defaultValue="calendar" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-muted/30 backdrop-blur-xl">
              <TabsTrigger value="calendar" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Academic Calendar
              </TabsTrigger>
              <TabsTrigger value="prerequisites" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Requirements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <GlassCard>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Calendar</h3>
                    </div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border border-border/30 bg-background/50"
                    />
                  </div>
                </GlassCard>
                
                <GlassCard>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Important Dates</h3>
                    <p className="text-muted-foreground text-sm mb-6">Key academic calendar events</p>
                    <div className="space-y-4">
                      {academicCalendar.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 border border-border/30 rounded-lg bg-background/30 hover:bg-background/50 transition-all duration-200">
                          <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-foreground">{item.event}</div>
                            <div className="text-xs text-muted-foreground">{item.date}</div>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">{item.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </TabsContent>

            <TabsContent value="prerequisites" className="space-y-6">
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Program Requirements</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Required certifications and documentation for your program
                  </p>
                  <div className="space-y-4">
                    {prerequisites.map((prereq, index) => (
                      <div key={index} className="border border-border/30 rounded-lg p-4 bg-background/30 hover:bg-background/50 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(prereq.status)}
                            <div>
                              <h4 className="font-semibold text-foreground">{prereq.name}</h4>
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
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AcademicPlanning;