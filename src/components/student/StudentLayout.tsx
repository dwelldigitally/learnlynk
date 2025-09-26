import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Bell, Plus, Home, FileText, ClipboardList, Calendar, DollarSign, Briefcase, CreditCard, Newspaper, MapPin, ChevronLeft, ChevronRight, BookOpen, GraduationCap, HelpCircle, Phone, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/auth/UserMenu";
import { useProfile } from "@/hooks/useProfile";
import { useStudentPortalContext } from "@/pages/StudentPortal";
import NotificationCentre from "@/components/student/NotificationCentre";
import FloatingMarketingMessages from "@/components/student/FloatingMarketingMessages";
import CampusTourBooking from "@/components/student/CampusTourBooking";
import ProfileSettings from "@/components/student/ProfileSettings";
import { EnhancedTopBar } from "./EnhancedTopBar";
import { Button } from "@/components/ui/button";
import { ModernChatbot } from "@/components/chatbot/ModernChatbot";
interface StudentLayoutProps {
  children: React.ReactNode;
}
const StudentLayout: React.FC<StudentLayoutProps> = ({
  children
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [useDummyData, setUseDummyData] = useState(false);
  const {
    profile
  } = useProfile();
  const {
    session
  } = useStudentPortalContext();

  // Reorganized navigation into user-focused sections
  const navSections = [{
    id: "getting-started",
    title: "Getting Started",
    items: [{
      name: "Dashboard",
      path: "/student",
      icon: Home,
      description: "Your overview & next steps"
    }, {
      name: "Start Application",
      path: "/student/applications",
      icon: ClipboardList,
      description: "Begin or continue your application",
      isHighlighted: true
    }]
  }, {
    id: "my-progress",
    title: "My Progress",
    items: [{
      name: "Documents",
      path: "/student/dashboard",
      icon: FileText,
      description: "Upload & track documents",
      hasUpdate: true
    }, {
      name: "Academic Planning",
      path: "/student/academic-planning",
      icon: Calendar,
      description: "Plan your academic journey"
    }, {
      name: "Course Catalog",
      path: "/student/course-catalog",
      icon: BookOpen,
      description: "Browse available courses"
    }, {
      name: "Grades",
      path: "/student/grades",
      icon: GraduationCap,
      description: "View your academic progress"
    }, {
      name: "Financial Aid",
      path: "/student/financial-aid",
      icon: DollarSign,
      description: "Funding & financial support"
    }, {
      name: "Pay Your Fee",
      path: "/student/fee",
      icon: CreditCard,
      description: "Manage payments & fees"
    }, {
      name: "Practicum Hub",
      path: "/student/practicum",
      icon: ClipboardList,
      description: "Track practicum progress"
    }]
  }, {
    id: "student-services",
    title: "Student Services",
    items: [{
      name: "Student Support",
      path: "/student/support",
      icon: HelpCircle,
      description: "Get help and assistance"
    }, {
      name: "Emergency Contacts",
      path: "/student/emergency-contacts",
      icon: Phone,
      description: "Important contact information"
    }, {
      name: "Housing",
      path: "/student/housing",
      icon: Building,
      description: "Accommodation information"
    }]
  }, {
    id: "campus-life",
    title: "Campus Life",
    items: [{
      name: "Career Services",
      path: "/student/career-services",
      icon: Briefcase,
      description: "Career guidance & opportunities"
    }, {
      name: "News & Events",
      path: "/student/news-events",
      icon: Newspaper,
      description: "Campus updates & activities"
    }, {
      name: "Life @ WCC",
      path: "/student/campus-life",
      icon: MapPin,
      description: "Explore campus facilities"
    }]
  }];
  return <div className="flex min-h-screen bg-gray-100 w-full">
      {/* Mobile overlay for sidebar */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsCollapsed(true)} 
        />
      )}
      
      {/* Sidebar - Hidden on mobile when collapsed, overlay when open */}
      <aside className={`
        ${isCollapsed ? 'w-16' : 'w-72'} 
        bg-gradient-to-b from-background via-background/95 to-muted/30 
        border-r border-border/50 shadow-lg backdrop-blur-sm 
        fixed inset-y-0 left-0 z-50 h-screen 
        transition-all duration-300 flex flex-col overflow-hidden
        ${isCollapsed 
          ? 'lg:translate-x-0 -translate-x-full lg:w-16' 
          : 'lg:translate-x-0 translate-x-0'
        }
      `}>
        {/* Collapse/Expand Button */}
        <div className="p-2 sm:p-4 flex items-center justify-between border-b border-gray-200">
          {!isCollapsed ? <img src="/wcc-logo.png" alt="Western Community College" className="h-10 sm:h-14" /> : <div className="flex justify-center w-full">
              <img src="/wcc-logo.png" alt="WCC" className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
            </div>}
          {!isCollapsed && <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
              <ChevronLeft size={16} />
            </Button>}
        </div>

        {/* Collapsed toggle button */}
        {isCollapsed && <div className="absolute top-4 -right-3 z-10">
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 h-6 w-6 bg-background border border-border shadow-sm rounded-full">
              <ChevronRight size={14} />
            </Button>
          </div>}

        {!isCollapsed}

        {isCollapsed && <div className="p-3 border-b border-gray-200 flex flex-col items-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium cursor-pointer hover:bg-primary/90 transition-colors" onClick={() => setIsProfileOpen(true)} title="View Profile">
              <span className="text-sm font-medium">
                {profile?.first_name?.[0] || 'S'}
              </span>
            </div>
          </div>}

        {/* Navigation Links - Sectioned */}
        <nav className={`flex-1 ${isCollapsed ? 'px-1 sm:px-2' : 'px-2 sm:px-3'} py-2 sm:py-4`}>
          <div className="space-y-3 sm:space-y-6">
            {navSections.map(section => <div key={section.id} className="space-y-2">
                {!isCollapsed && <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1">
                    {section.title}
                  </h3>}
                <div className="space-y-1">
                  {section.items.map(item => {
                const isActive = location.pathname === item.path;
                if (isCollapsed) {
                  return <Link key={item.name} to={item.path} title={`${item.name}: ${item.description}`} className={`group flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-lg sm:rounded-xl transition-all duration-300 ${isActive ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm'} ${item.isHighlighted ? 'ring-2 ring-primary/30 bg-primary/5' : ''}`}>
                          <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 ${isActive ? 'text-primary-foreground' : item.isHighlighted ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                          
                          {/* Notification dots for collapsed view */}
                          {(item.hasUpdate || item.isHighlighted) && !isActive && <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />}
                        </Link>;
                }
                return <Link key={item.name} to={item.path} className={`group flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 relative overflow-hidden ${isActive ? 'bg-gradient-to-r from-primary/90 to-primary text-primary-foreground shadow-lg transform scale-[1.02] ring-2 ring-primary/20' : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:transform hover:scale-[1.01] hover:shadow-sm'} ${item.isHighlighted ? 'ring-2 ring-primary/30 bg-primary/5' : ''}`}>
                        {/* Highlight glow for important items */}
                        {item.isHighlighted && !isActive && <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50 rounded-lg sm:rounded-xl" />}
                        
                        <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-colors duration-300 ${isActive ? 'bg-white/20' : item.isHighlighted ? 'bg-primary/10' : 'bg-muted/50 group-hover:bg-muted'}`}>
                          <item.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 transition-colors duration-300 ${isActive ? 'text-primary-foreground' : item.isHighlighted ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                        </div>
                        
                        {!isCollapsed && <div className="flex-1 min-w-0">
                            <div className={`font-medium text-xs sm:text-sm transition-colors duration-300 ${isActive ? 'text-primary-foreground' : item.isHighlighted ? 'text-primary' : 'text-foreground group-hover:text-foreground'}`}>
                              {item.name}
                            </div>
                            <div className={`text-xs leading-tight truncate transition-colors duration-300 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground group-hover:text-muted-foreground'} hidden sm:block`}>
                              {item.description}
                            </div>
                          </div>}
                        
                        {!isCollapsed && item.hasUpdate && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-pulse" />}
                        
                        {item.isHighlighted && !isCollapsed && !isActive && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />}
                      </Link>;
              })}
                </div>
              </div>)}
          </div>
        </nav>

        {!isCollapsed && <div className="mt-auto p-2 sm:p-4 border-t border-gray-200 space-y-2 sm:space-y-3">
            <a href="#" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-primary rounded-md text-primary hover:bg-primary-light text-xs sm:text-sm" onClick={e => e.preventDefault()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
              </svg>
              <span className="hidden sm:inline">Connect Your LinkedIn</span>
              <span className="sm:hidden">LinkedIn</span>
            </a>
            
            <CampusTourBooking />
          </div>}
      </aside>

      {/* Main Content */}
      <main key={currentPath} className={`flex-1 lg:ml-16 ${!isCollapsed ? 'lg:ml-72' : ''} transition-all duration-300`}>
        <EnhancedTopBar 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)} 
          useDummyData={useDummyData} 
          onToggleDummyData={() => setUseDummyData(!useDummyData)}
          showMenuIcon={true}
        />

        {/* Content */}
        <div key={currentPath} className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16" data-scroll-container>
          {children}
        </div>
      </main>

      {/* Profile Settings Modal */}
      <ProfileSettings open={isProfileOpen} onOpenChange={setIsProfileOpen} />

      {/* Modern AI Chatbot */}
      <ModernChatbot leadId={session?.lead_id} mode="student" className="z-50" />
    </div>;
};
export default StudentLayout;