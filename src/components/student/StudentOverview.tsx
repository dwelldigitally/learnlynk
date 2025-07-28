
import React, { useState } from "react";
import { Calendar, Clock, Mail, ChevronDown, Star, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isIntakePopoverOpen, setIsIntakePopoverOpen] = useState(false);
  const [isProgramPopoverOpen, setIsProgramPopoverOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingProgram, setPendingProgram] = useState<string | null>(null);
  
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
  
  // Get current application data
  const currentApplication = studentApplications[selectedProgram];
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
  
  // Dynamic color schemes for each program
  const programColorSchemes = {
    "Health Care Assistant": {
      primary: "from-emerald-800 to-teal-900",
      secondary: "from-emerald-900/80 to-teal-900/60",
      headerBg: "bg-emerald-800",
      buttonBg: "bg-emerald-700 hover:bg-emerald-600",
      accentColor: "emerald"
    },
    "Education Assistant": {
      primary: "from-blue-800 to-indigo-900",
      secondary: "from-blue-900/80 to-indigo-900/60",
      headerBg: "bg-blue-800",
      buttonBg: "bg-blue-700 hover:bg-blue-600",
      accentColor: "blue"
    },
    "Aviation": {
      primary: "from-sky-800 to-cyan-900",
      secondary: "from-sky-900/80 to-cyan-900/60",
      headerBg: "bg-sky-800",
      buttonBg: "bg-sky-700 hover:bg-sky-600",
      accentColor: "sky"
    },
    "Hospitality": {
      primary: "from-amber-800 to-orange-900",
      secondary: "from-amber-900/80 to-orange-900/60",
      headerBg: "bg-amber-800",
      buttonBg: "bg-amber-700 hover:bg-amber-600",
      accentColor: "amber"
    },
    "ECE": {
      primary: "from-pink-800 to-rose-900",
      secondary: "from-pink-900/80 to-rose-900/60",
      headerBg: "bg-pink-800",
      buttonBg: "bg-pink-700 hover:bg-pink-600",
      accentColor: "pink"
    },
    "MLA": {
      primary: "from-purple-800 to-violet-900",
      secondary: "from-purple-900/80 to-violet-900/60",
      headerBg: "bg-purple-800",
      buttonBg: "bg-purple-700 hover:bg-purple-600",
      accentColor: "purple"
    }
  };

  const currentColors = programColorSchemes[selectedProgram as keyof typeof programColorSchemes] || programColorSchemes["Health Care Assistant"];
  
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
    <div>
      {/* Program Header with Program and Intake Selection */}
      <div className={`${currentColors.headerBg} text-white px-8 py-4 rounded-lg mb-6 flex justify-between items-center transition-colors duration-300`}>
        <div>
          <div className="text-sm text-white/70 mb-1">Select Program</div>
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
        </div>
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
          {/* Dynamic Marketing Hero Section */}
          <Card className={`relative overflow-hidden bg-gradient-to-br ${currentColors.primary} text-white transition-colors duration-500`}>
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src={currentMarketing.backgroundImage}
                alt={`${selectedProgram} Career`}
                className="w-full h-full object-cover opacity-30"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${currentColors.secondary} transition-colors duration-500`}></div>
            </div>
            
            {/* Content */}
            <div className="relative p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {currentTags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-sm font-medium">
                        <span>{tag.icon}</span>
                        {tag.text}
                      </span>
                    ))}
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    {currentMarketing.headline}
                  </h1>
                  
                  <p className="text-xl lg:text-2xl mb-6 text-white/90 leading-relaxed">
                    {currentMarketing.subheadline}
                  </p>
                  
                  {/* Benefits List */}
                  <div className="space-y-3 mb-8">
                    {currentMarketing.bulletPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-3 text-lg">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg"
                      className={`bg-white text-gray-900 hover:bg-gray-100 font-semibold text-lg px-8 py-4 flex items-center gap-3`}
                      onClick={() => setIsFormExpanded(!isFormExpanded)}
                    >
                      {isFormExpanded ? 'Hide Application Form' : currentMarketing.ctaText}
                      <ArrowRight className={`w-5 h-5 transition-transform ${isFormExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                    
                    <Button 
                      size="lg"
                      variant="outline" 
                      className="border-white/30 text-black hover:bg-white/10 hover:text-white font-semibold text-lg px-8 py-4"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                
                {/* Right Image */}
                <div className="lg:w-1/3">
                  <div className="relative">
                    <img 
                      src={currentWelcomeContent.welcomeImage} 
                      alt={`${selectedProgram} Professional`} 
                      className="rounded-2xl w-full h-80 object-cover shadow-2xl border-4 border-white/20"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-xl">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">97%</div>
                        <div className="text-sm text-gray-600">Graduate Employment</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Expandable Application Form */}
          {isFormExpanded && (
            <div className="animate-accordion-down">
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-purple-900">Application Form - {selectedProgram}</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setIsFormExpanded(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <AdmissionForm 
                  onBack={() => setIsFormExpanded(false)}
                />
              </Card>
            </div>
          )}

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
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-900 mb-2">
                {currentApplication.acceptanceLikelihood}%
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">Likelihood Of Acceptance</h3>
              
              {/* Dynamic Progress Bar */}
              <div className="relative mb-4">
                <Progress 
                  value={currentApplication.acceptanceLikelihood} 
                  className="h-3"
                  indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500"
                />
                <div className="flex justify-between text-xs mt-1 text-green-700">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Stage-based Action Prompts */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                {currentApplication.stage === "LEAD_FORM" && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-green-700">📈 Submit your application within the next 10 days</span> to increase your chances by an additional 15%
                  </p>
                )}
                {currentApplication.stage === "SEND_DOCUMENTS" && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-green-700">📋 Upload all required documents quickly</span> to boost your acceptance rate by 10%
                  </p>
                )}
                {currentApplication.stage === "DOCUMENT_APPROVAL" && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-green-700">⏳ Documents under review</span> - acceptance rate increases as documents get approved
                  </p>
                )}
                {currentApplication.stage === "FEE_PAYMENT" && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-green-700">💳 Complete fee payment within 7 days</span> to secure your spot and reach 95% acceptance
                  </p>
                )}
                {currentApplication.stage === "ACCEPTED" && (
                  <p className="text-sm text-green-700">
                    <span className="font-bold">🎉 Congratulations!</span> You have been accepted into the program
                  </p>
                )}
              </div>
            </div>
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

      {/* Program Change Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
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
