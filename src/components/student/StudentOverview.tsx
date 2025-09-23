
import React, { useState } from "react";
import { Calendar, Clock, Mail, ChevronDown, Star, ArrowRight, CheckCircle, AlertTriangle, AlertCircle, PenTool, ClipboardList, FileText, DollarSign, GraduationCap, Award, TrendingUp, Users, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import AdmissionsProgress from "@/components/student/AdmissionsProgress";
import NewsCard from "@/components/student/NewsCard";
import { SalesAdvisorCard } from "@/components/student/SalesAdvisorCard";
import EventCard from "@/components/student/EventCard";
import { Link, useNavigate } from "react-router-dom";
import AdmissionForm from "@/components/student/AdmissionForm";
import { studentApplications } from "@/data/studentApplications";
import { programWelcomeContent, programNewsAndEvents } from "@/data/programContent";
import { programAlumni } from "@/data/programAlumni";
import advisorNicole from "@/assets/advisor-nicole.jpg";
import AdvisorContactActions from "@/components/student/AdvisorContactActions";
import CampusExplorer from "@/components/student/CampusExplorer";
import QuickProgressTracker from "@/components/student/QuickProgressTracker";
import { toast } from "@/hooks/use-toast";
import { usePageEntranceAnimation, useStaggeredReveal, useCountUp } from "@/hooks/useAnimations";
import { dummyStudentProfile, dummyApplications, dummyMessages, dummyNewsAndEvents } from "@/data/studentPortalDummyData";

const StudentOverview: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState("Health Care Assistant");
  const [intake, setIntake] = useState("15th March 2025");
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isIntakePopoverOpen, setIsIntakePopoverOpen] = useState(false);
  const [isProgramPopoverOpen, setIsProgramPopoverOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingProgram, setPendingProgram] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Animation hooks
  const isLoaded = usePageEntranceAnimation();
  const { visibleItems, ref: staggerRef } = useStaggeredReveal(6, 150);
  
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
  
  // Get current application data
  const currentApplication = studentApplications[selectedProgram];

  // Counter animations for key stats
  const { count: employmentRate, ref: employmentRef } = useCountUp(97, 2000, 0, '', '%');
  const { count: acceptanceLikelihood, ref: acceptanceRef } = useCountUp(currentApplication.acceptanceLikelihood, 1500, 0, '', '%');
  
  // Handle program change with confirmation
  const handleProgramChange = (program: string) => {
    if (program === selectedProgram) {
      setIsProgramPopoverOpen(false);
      return;
    }
    
    setPendingProgram(program);
    setShowConfirmDialog(true);
    setIsProgramPopoverOpen(false);
  };

  // Confirm program change
  const confirmProgramChange = () => {
    if (pendingProgram) {
      setSelectedProgram(pendingProgram);
      const programSchedule = allPrograms[pendingProgram as keyof typeof allPrograms];
      if (programSchedule && programSchedule.length > 0) {
        setIntake(programSchedule[0].date);
      }
      // Reset form if it's expanded
      setIsFormExpanded(false);
    }
    setShowConfirmDialog(false);
    setPendingProgram(null);
  };

  // Cancel program change
  const cancelProgramChange = () => {
    setShowConfirmDialog(false);
    setPendingProgram(null);
  };
  
  const currentWelcomeContent = programWelcomeContent[selectedProgram];
  const currentAlumni = programAlumni[selectedProgram];
  
  // Dynamic program tags (max 2 per program)
  const programTags = {
    "Health Care Assistant": [
      { text: "Most Popular", icon: "🔥" },
      { text: "Study in Surrey Campus", icon: "📍" }
    ],
    "Education Assistant": [
      { text: "PGWP Supported", icon: "✅" },
      { text: "Finish Under 10 Months", icon: "⚡" }
    ],
    "Aviation": [
      { text: "Study in Abbotsford Campus", icon: "📍" },
      { text: "PGWP Supported", icon: "✅" }
    ],
    "Hospitality": [
      { text: "Most Popular", icon: "🔥" },
      { text: "Finish Under 8 Months", icon: "⚡" }
    ],
    "ECE": [
      { text: "Study in Surrey Campus", icon: "📍" },
      { text: "PGWP Supported", icon: "✅" }
    ],
    "MLA": [
      { text: "Finish Under 12 Months", icon: "⚡" },
      { text: "Study in Abbotsford Campus", icon: "📍" }
    ]
  };

  const currentTags = programTags[selectedProgram as keyof typeof programTags] || programTags["Health Care Assistant"];
  
  // Professional unified color scheme for all programs
  const professionalColors = {
    primary: "bg-primary",
    secondary: "bg-card",
    headerBg: "bg-card",
    buttonBg: "bg-primary hover:bg-primary-hover",
    accentColor: "primary"
  };
  
  // Dynamic marketing messages based on program
  const programMarketingMessages = {
    "Health Care Assistant": {
      headline: "Start Your Healthcare Journey",
      subheadline: "Transform lives while building a rewarding career in healthcare",
      bulletPoints: [
        "97% job placement rate within 6 months",
        "Work in hospitals, clinics, and care facilities",
        "Make a difference in people's lives every day"
      ],
      ctaText: "Begin Your Healthcare Career",
      backgroundImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    "Education Assistant": {
      headline: "Shape Tomorrow's Leaders",
      subheadline: "Inspire and support the next generation of learners",
      bulletPoints: [
        "Work alongside certified teachers",
        "Make education accessible for all students",
        "Build a fulfilling career in education"
      ],
      ctaText: "Start Your Education Journey",
      backgroundImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    "Aviation": {
      headline: "Take Flight in Aviation",
      subheadline: "Soar to new heights with a career in the aviation industry",
      bulletPoints: [
        "High-demand industry with growth opportunities",
        "Work with cutting-edge aviation technology",
        "Global career opportunities"
      ],
      ctaText: "Launch Your Aviation Career",
      backgroundImage: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    "Hospitality": {
      headline: "Create Exceptional Experiences",
      subheadline: "Build a career in the dynamic world of hospitality",
      bulletPoints: [
        "Work in luxury hotels and resorts",
        "Develop customer service excellence",
        "Global industry with diverse opportunities"
      ],
      ctaText: "Start Your Hospitality Journey",
      backgroundImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    "ECE": {
      headline: "Nurture Young Minds",
      subheadline: "Build the foundation for children's bright futures",
      bulletPoints: [
        "Work with children during crucial development years",
        "Create engaging learning environments",
        "High demand for qualified ECE professionals"
      ],
      ctaText: "Begin Your ECE Journey",
      backgroundImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    "MLA": {
      headline: "Advance Healthcare Technology",
      subheadline: "Lead innovation in medical laboratory sciences",
      bulletPoints: [
        "Work with state-of-the-art lab equipment",
        "Critical role in patient diagnosis and care",
        "High-paying career with job security"
      ],
      ctaText: "Start Your MLA Career",
      backgroundImage: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  };

  const currentMarketing = programMarketingMessages[selectedProgram as keyof typeof programMarketingMessages] || programMarketingMessages["Health Care Assistant"];
  
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
    <div className={`space-y-10 p-8 bg-background min-h-screen ${isLoaded ? 'animate-fade-up' : 'opacity-0'}`}>

      {/* Enhanced Program Header */}
      <div className="bg-gradient-to-r from-card to-card/95 backdrop-blur-sm border border-border/50 rounded-3xl p-8 mb-10 transition-all duration-500 hover:shadow-xl hover:border-border/80 animate-fade-in">
        {/* Main Program Section */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left: Program Selection & Details */}
          <div className="flex-1 space-y-6">
            {/* Program Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Program</span>
              </div>
              
              <Popover open={isProgramPopoverOpen} onOpenChange={setIsProgramPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="group h-auto p-0 text-left flex flex-col items-start gap-1 hover:bg-transparent transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                        {selectedProgram}
                      </h2>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                        <ChevronDown className="w-4 h-4 text-primary group-hover:rotate-180 transition-transform duration-200" />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
                      Click to change program
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0 bg-background/95 backdrop-blur-sm border border-border/50 z-50" align="start">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg text-foreground">Available Programs</h3>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {Object.keys(allPrograms).map((program) => (
                        <div 
                          key={program}
                          className={`group p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedProgram === program 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-border hover:border-border/80 hover:bg-muted/50'
                          }`}
                          onClick={() => handleProgramChange(program)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {program}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {allPrograms[program as keyof typeof allPrograms].length} intake dates available
                              </p>
                            </div>
                            {selectedProgram === program && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Application Progress - moved from bottom */}
              <div className="mt-6 pt-4 border-t border-border/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Application Progress</p>
                      <p className="text-xs text-muted-foreground">Documents submitted • Financial aid applied</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Next Step</p>
                      <p className="font-semibold text-foreground text-sm">Interview Scheduling</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="px-4"
                      onClick={() => navigate('/student/applications')}
                    >
                      Continue Application
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Duration */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Duration</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">18 months</p>
                  </div>
                </div>
              </div>

              {/* Program Type */}
              <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Credential</p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">Diploma</p>
                  </div>
                </div>
              </div>

              {/* Employment Rate */}
              <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200/50 dark:border-green-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Employment</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">94%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Description */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comprehensive program designed to prepare students for careers in {selectedProgram.toLowerCase()}. 
                Industry-focused curriculum with hands-on experience and real-world applications.
              </p>
            </div>

            {/* Course Curriculum */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <h4 className="font-semibold text-foreground">Course Curriculum</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Core Courses */}
                <div className="bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/20 dark:to-indigo-900/10 rounded-lg p-4 border border-indigo-200/50 dark:border-indigo-800/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <GraduationCap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h5 className="font-medium text-indigo-900 dark:text-indigo-100">Core Courses</h5>
                  </div>
                  <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Fundamentals of {selectedProgram}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Industry Standards & Practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Professional Communication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                      <span>Applied Technology</span>
                    </li>
                  </ul>
                </div>

                {/* Specialized Courses */}
                <div className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-800/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h5 className="font-medium text-emerald-900 dark:text-emerald-100">Specialized Training</h5>
                  </div>
                  <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Advanced {selectedProgram} Techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Clinical/Field Experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Case Studies & Analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>Capstone Project</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Prerequisites & Requirements */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <h4 className="font-semibold text-foreground">Prerequisites & Requirements</h4>
              </div>
              
              <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Academic Requirements
                    </h5>
                    <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                      <li>• High School Diploma or equivalent</li>
                      <li>• Minimum 2.5 GPA</li>
                      <li>• English Proficiency Test</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Additional Requirements
                    </h5>
                    <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                      <li>• Background Check</li>
                      <li>• Health Clearance</li>
                      <li>• Reference Letters (2)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <h4 className="font-semibold text-foreground">Learning Outcomes</h4>
              </div>
              
              <div className="bg-violet-50/50 dark:bg-violet-950/20 rounded-lg p-4 border border-violet-200/50 dark:border-violet-800/30">
                <p className="text-sm text-violet-700 dark:text-violet-300 mb-3">
                  Upon successful completion, graduates will be able to:
                </p>
                <ul className="space-y-2 text-sm text-violet-700 dark:text-violet-300">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    <span>Demonstrate professional competency in {selectedProgram.toLowerCase()} practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    <span>Apply critical thinking and problem-solving skills in real-world scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    <span>Communicate effectively with diverse populations and stakeholders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    <span>Maintain ethical standards and professional development</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Career Paths */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <h4 className="font-semibold text-foreground">Career Opportunities</h4>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-teal-50/50 dark:bg-teal-950/20 rounded-lg p-3 border border-teal-200/50 dark:border-teal-800/30 text-center">
                  <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <p className="text-sm font-medium text-teal-900 dark:text-teal-100">Healthcare Facilities</p>
                </div>
                <div className="bg-pink-50/50 dark:bg-pink-950/20 rounded-lg p-3 border border-pink-200/50 dark:border-pink-800/30 text-center">
                  <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center mx-auto mb-2">
                    <MapPin className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <p className="text-sm font-medium text-pink-900 dark:text-pink-100">Private Practice</p>
                </div>
                <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-lg p-3 border border-orange-200/50 dark:border-orange-800/30 text-center">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mx-auto mb-2">
                    <GraduationCap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Educational Institutions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Intake & Financial Information */}
          <div className="xl:w-80 space-y-6">
            {/* Intake Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Intake Date</span>
              </div>
              
              <Popover open={isIntakePopoverOpen} onOpenChange={setIsIntakePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="group h-12 w-full px-4 bg-background/50 border-border hover:bg-background hover:border-primary/50 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{intake}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:rotate-180 transition-all duration-200" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-background/95 backdrop-blur-sm border border-border/50" align="end">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg text-foreground">Select Intake Date</h3>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {availableIntakes.map((option) => (
                        <div 
                          key={option.date}
                          className={`group p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                            intake === option.date 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-border hover:border-border/80 hover:bg-muted/50'
                          }`}
                          onClick={() => {
                            setIntake(option.date);
                            setIsIntakePopoverOpen(false);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">{option.date}</p>
                                {intake === option.date && (
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {option.seats} seats available
                              </p>
                            </div>
                            <div className="text-right space-y-2">
                              <div className={`text-sm font-semibold px-2 py-1 rounded-md ${
                                option.seats > 15 ? 'text-green-700 bg-green-100' : 
                                option.seats > 5 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'
                              }`}>
                                {option.seats}/{option.totalSeats}
                              </div>
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
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

            {/* Deadline Card */}
            <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-lg p-4 border border-orange-200/50 dark:border-orange-800/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Application Deadline</p>
              </div>
              <p className="text-lg font-bold text-orange-900 dark:text-orange-100">March 15, 2025</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">23 days remaining</p>
            </div>

            {/* Application Stage Tracker */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Application Progress</h4>
              <div className="space-y-3">
                {/* Complete Application */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Complete Application</p>
                      <p className="text-sm text-muted-foreground">Submit your program application</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Complete
                    </span>
                  </div>
                </div>

                {/* Upload Documents */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Upload Documents</p>
                      <p className="text-sm text-muted-foreground">3 documents pending upload</p>
                      <p className="text-xs text-red-600 dark:text-red-400">Due in 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Urgent
                    </span>
                    <Button size="sm" className="ml-2">
                      Upload Now
                    </Button>
                  </div>
                </div>

                {/* Apply for Financial Aid */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Apply for Financial Aid</p>
                      <p className="text-sm text-muted-foreground">FAFSA and aid applications</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Due March 15</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Continue
                    </Button>
                  </div>
                </div>

                {/* Schedule Advisor Meeting */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Schedule Advisor Meeting</p>
                      <p className="text-sm text-muted-foreground">Plan your academic journey</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Financial Overview
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Tuition Fee</span>
                  <span className="font-bold text-foreground">$35,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/30">
                  <span className="text-sm text-green-700 dark:text-green-300">Scholarship Available</span>
                  <span className="font-bold text-green-900 dark:text-green-100">Up to $5,000</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Payment Plans
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Program Brochure
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Connect with Alumni
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Schedule Campus Tour
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Action Cards - Priority Actions */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 ${visibleItems[0] ? 'animate-stagger-1' : 'opacity-0'}`}>
        {/* Start Application - Primary CTA */}
        <Card className="p-6 bg-primary text-primary-foreground hover:shadow-xl transition-all duration-300 hover:scale-[1.05] cursor-pointer border-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <ClipboardList className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-bold text-lg mb-1">Start Application</h3>
            <p className="text-sm opacity-90">Begin your journey today</p>
          </div>
        </Card>

        {/* Upload Documents */}
        <Card className="p-6 bg-accent text-accent-foreground hover:shadow-xl transition-all duration-300 hover:scale-[1.05] cursor-pointer border-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <h3 className="font-bold text-lg mb-1">Upload Documents</h3>
            <p className="text-sm opacity-90">3 pending uploads</p>
          </div>
        </Card>

        {/* Financial Aid */}
        <Card className="p-6 bg-card border hover:shadow-xl transition-all duration-300 hover:scale-[1.05] cursor-pointer relative overflow-hidden group">
          <div className="absolute inset-0 bg-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-muted rounded-lg">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <h3 className="font-bold text-lg mb-1 text-foreground">Financial Aid</h3>
            <p className="text-sm text-muted-foreground">$15,895 available</p>
          </div>
        </Card>

        {/* Schedule Advisor */}
        <Card className="p-6 bg-card border hover:shadow-xl transition-all duration-300 hover:scale-[1.05] cursor-pointer relative overflow-hidden group">
          <div className="absolute inset-0 bg-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-muted rounded-lg">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-1 text-foreground">Schedule Advisor</h3>
            <p className="text-sm text-muted-foreground">Get personalized guidance</p>
          </div>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div ref={staggerRef} className="w-full">
        {/* Main Content - Full Width */}
        <div className={`w-full space-y-10 ${visibleItems[1] ? 'animate-stagger-2' : 'opacity-0'}`}>
          {/* Campus Explorer */}
          <CampusExplorer />

          {/* Latest News & Events */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{currentWelcomeContent.newsTitle}</h3>
              <Link 
                to="/student/news-events"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(() => {
                const newsAndEvents = programNewsAndEvents[selectedProgram] || programNewsAndEvents["Health Care Assistant"];
                const combinedItems = [
                  ...newsAndEvents.news.slice(0, 2).map(item => ({ ...item, itemType: 'news' as const })),
                  ...newsAndEvents.events.slice(0, 1).map(item => ({ ...item, itemType: 'event' as const }))
                ];
                
                return combinedItems.map((item, index) => (
                  <div key={`${item.itemType}-${item.id}`} className={`${visibleItems[4] ? `animate-stagger-${Math.min(index + 4, 5)}` : 'opacity-0'}`}>
                    {item.itemType === 'news' ? (
                      <NewsCard news={item} />
                    ) : (
                      <EventCard event={item} />
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Sales Advisor Section */}
          <div>
            <SalesAdvisorCard />
          </div>

        </div>

      {/* Fixed Full Width Sidebar - Only show when sidebarOpen is true */}
      {sidebarOpen && (
      <div className="fixed inset-0 w-screen h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-[9999] overflow-y-auto">
        <div className={`p-6 space-y-6 ${visibleItems[3] ? 'animate-stagger-4' : 'opacity-0'}`}>
          {/* Sidebar Header with Close Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Student Dashboard</h2>
            <Button variant="ghost" size="sm" className="hover:bg-muted" onClick={() => setSidebarOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18"/>
                <path d="M6 6l12 12"/>
              </svg>
            </Button>
          </div>

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
                
                <div className="pt-2 border-t border-gray-200">
                  <AdvisorContactActions advisorName={advisor.name} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      )}

      {/* Sidebar Toggle Button */}
      <Button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 p-0 shadow-lg"
        size="sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </Button>
      </div>

      {/* Program Change Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="animate-modal-enter">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Change Program?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start an application for <strong>{pendingProgram}</strong>? 
              {isFormExpanded && " This will close your current application form and reset your progress."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelProgramChange}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmProgramChange}>
              Yes, Change Program
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentOverview;
