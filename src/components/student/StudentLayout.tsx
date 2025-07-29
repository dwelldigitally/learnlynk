
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Chatbot from "@/components/Chatbot";
import { Mail, Bell, Plus, Home, FileText, ClipboardList, Calendar, DollarSign, Briefcase, CreditCard, Newspaper, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NotificationCentre from "@/components/student/NotificationCentre";
import FloatingMarketingMessages from "@/components/student/FloatingMarketingMessages";
import CampusTourBooking from "@/components/student/CampusTourBooking";
import ProfileSettings from "@/components/student/ProfileSettings";
import { Button } from "@/components/ui/button";

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation items for the sidebar
  const navItems = [
    { name: "Overview", path: "/student", icon: Home },
    { name: "Documents", path: "/student/dashboard", icon: FileText, hasUpdate: true },
    { name: "Your Applications", path: "/student/applications", icon: ClipboardList },
    { name: "Academic Planning", path: "/student/academic-planning", icon: Calendar },
    { name: "Financial Aid", path: "/student/financial-aid", icon: DollarSign },
    { name: "Career Services", path: "/student/career-services", icon: Briefcase },
    { name: "Pay Your Fee", path: "/student/fee", icon: CreditCard },
    { name: "News & Events", path: "/student/news-events", icon: Newspaper },
    { name: "Life @ WCC", path: "/student/campus-life", icon: MapPin },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-sidebar border-r border-sidebar-border shadow-sm h-full overflow-hidden transition-all duration-300`}>
        {/* Collapse/Expand Button */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {!isCollapsed && (
            <img 
              src="/lovable-uploads/120260b6-bc38-4844-841b-c6a5b6067560.png" 
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium mr-3">
                T
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Tushar Malhotra</h3>
                <p className="text-xs text-gray-500">malhotratushar37@gmail.com</p>
              </div>
              <div className="text-xs text-gray-400">Edit</div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="p-4 border-b border-gray-200 flex flex-col items-center space-y-3">
            <img 
              src="/lovable-uploads/120260b6-bc38-4844-841b-c6a5b6067560.png" 
              alt="WCC" 
              className="h-8 w-8 object-contain"
            />
            <div 
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium cursor-pointer"
              onClick={() => setIsProfileOpen(true)}
            >
              T
            </div>
          </div>
        )}

        <nav className="p-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} py-4 rounded-md text-sm transition-colors mb-2 ${
                  currentPath === item.path
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="flex items-center">
                  <Icon size={16} className={isCollapsed ? '' : 'mr-5'} />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && item.hasUpdate && (
                  <Plus className="w-4 h-4 text-blue-600 bg-blue-100 rounded-full p-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-gray-200 space-y-3">
            <a 
              href="#" 
              className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 text-sm"
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
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold flex items-center">
              Hey Tushar <span className="ml-2">👋</span>
            </h1>
          </div>
          
          {/* Center Section - Marketing Messages */}
          <div className="flex-1 flex justify-center">
            <FloatingMarketingMessages />
          </div>
          
          {/* Right Section */}
          <div className="flex-1 flex items-center justify-end space-x-4">
            <div className="text-right text-sm">
              <div>Student Id: WCC1047859</div>
              <div className="text-gray-500">Tushar.Malhotra@student.wcc.ca</div>
            </div>
            <Link to="/student/messages" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Mail size={20} />
            </Link>
            <NotificationCentre />
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
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
