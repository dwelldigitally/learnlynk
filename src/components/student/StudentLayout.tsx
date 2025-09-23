
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Chatbot from "@/components/Chatbot";
import { Mail, Bell, Plus, Home, FileText, ClipboardList, Calendar, DollarSign, Briefcase, CreditCard, Newspaper, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
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

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [useDummyData, setUseDummyData] = useState(false);
  const { profile } = useProfile();
  const { session } = useStudentPortalContext();

  // Reorganized navigation into user-focused sections
  const navSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      items: [
        { name: "Dashboard", path: "/student", icon: Home, description: "Your overview & next steps" },
        { name: "Start Application", path: "/student/applications", icon: ClipboardList, description: "Begin or continue your application", isHighlighted: true }
      ]
    },
    {
      id: "my-progress",
      title: "My Progress",
      items: [
        { name: "Documents", path: "/student/dashboard", icon: FileText, description: "Upload & track documents", hasUpdate: true },
        { name: "Academic Planning", path: "/student/academic-planning", icon: Calendar, description: "Plan your academic journey" },
        { name: "Financial Aid", path: "/student/financial-aid", icon: DollarSign, description: "Funding & financial support" },
        { name: "Pay Your Fee", path: "/student/fee", icon: CreditCard, description: "Manage payments & fees" }
      ]
    },
    {
      id: "campus-life",
      title: "Campus Life",
      items: [
        { name: "Career Services", path: "/student/career-services", icon: Briefcase, description: "Career guidance & opportunities" },
        { name: "News & Events", path: "/student/news-events", icon: Newspaper, description: "Campus updates & activities" },
        { name: "Life @ WCC", path: "/student/campus-life", icon: MapPin, description: "Explore campus facilities" }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100 w-full">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-16' : 'w-72'} bg-gradient-to-b from-background via-background/95 to-muted/30 border-r border-border/50 shadow-lg backdrop-blur-sm fixed inset-y-0 left-0 z-50 h-screen transition-all duration-300 flex flex-col overflow-hidden`}>
        {/* Collapse/Expand Button */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {!isCollapsed && (
            <img 
              src="/wcc-logo.png" 
              alt="Western Community College" 
              className="h-14"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-8 w-8"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div 
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => setIsProfileOpen(true)}
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium mr-3">
                {profile?.first_name?.[0] || 'S'}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">
                  {useDummyData 
                    ? (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Student')
                    : (session?.student_name || 'Student')
                  }
                </h3>
                <p className="text-xs text-gray-500">
                  {useDummyData 
                    ? (profile?.email || 'student@wcc.ca')
                    : (session?.email || 'student@wcc.ca')
                  }
                </p>
              </div>
              <div className="text-xs text-gray-400">Edit</div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="p-4 border-b border-gray-200 flex flex-col items-center space-y-3">
            <img 
              src="/wcc-logo-red.png" 
              alt="WCC" 
              className="h-8 w-8 object-contain"
            />
            <div 
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium cursor-pointer"
              onClick={() => setIsProfileOpen(true)}
            >
              {profile?.first_name?.[0] || 'S'}
            </div>
          </div>
        )}

        {/* Navigation Links - Sectioned */}
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {navSections.map((section) => (
              <div key={section.id} className="space-y-2">
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        title={isCollapsed ? `${item.name}: ${item.description}` : undefined}
                        className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                          isActive 
                            ? 'bg-gradient-to-r from-primary/90 to-primary text-primary-foreground shadow-lg transform scale-[1.02] ring-2 ring-primary/20' 
                            : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:transform hover:scale-[1.01] hover:shadow-sm'
                        } ${item.isHighlighted ? 'ring-2 ring-primary/30 bg-primary/5' : ''}`}
                      >
                        {/* Highlight glow for important items */}
                        {item.isHighlighted && !isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50 rounded-xl" />
                        )}
                        
                        <div className={`p-2 rounded-lg transition-colors duration-300 ${
                          isActive 
                            ? 'bg-white/20' 
                            : item.isHighlighted 
                              ? 'bg-primary/10' 
                              : 'bg-muted/50 group-hover:bg-muted'
                        }`}>
                          <item.icon className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${
                            isActive 
                              ? 'text-primary-foreground' 
                              : item.isHighlighted 
                                ? 'text-primary' 
                                : 'text-muted-foreground group-hover:text-foreground'
                          }`} />
                        </div>
                        
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm transition-colors duration-300 ${
                              isActive 
                                ? 'text-primary-foreground' 
                                : item.isHighlighted 
                                  ? 'text-primary' 
                                  : 'text-foreground group-hover:text-foreground'
                            }`}>
                              {item.name}
                            </div>
                            <div className={`text-xs leading-tight truncate transition-colors duration-300 ${
                              isActive 
                                ? 'text-primary-foreground/80' 
                                : 'text-muted-foreground group-hover:text-muted-foreground'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        )}
                        
                        {!isCollapsed && item.hasUpdate && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        )}
                        
                        {item.isHighlighted && !isCollapsed && !isActive && (
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-gray-200 space-y-3">
            <a 
              href="#" 
              className="flex items-center justify-center gap-2 px-4 py-2 border border-primary rounded-md text-primary hover:bg-primary-light text-sm"
              onClick={(e) => e.preventDefault()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
              </svg>
              Connect Your LinkedIn
            </a>
            
            <CampusTourBooking />
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-72'} transition-all duration-300`}>
        <EnhancedTopBar 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          useDummyData={useDummyData}
          onToggleDummyData={() => setUseDummyData(!useDummyData)}
        />

        {/* Content */}
        <div key={currentPath} className="p-6" data-scroll-container>
          {children}
        </div>
      </main>

      {/* Profile Settings Modal */}
      <ProfileSettings 
        open={isProfileOpen} 
        onOpenChange={setIsProfileOpen} 
      />

      {/* Chatbot */}
      <Chatbot mode="dashboard" />
    </div>
  );
};

export default StudentLayout;
