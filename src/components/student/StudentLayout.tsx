
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Chatbot from "@/components/Chatbot";
import { Mail, Bell, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NotificationCentre from "@/components/student/NotificationCentre";
import FloatingMarketingMessages from "@/components/student/FloatingMarketingMessages";
import CampusTourBooking from "@/components/student/CampusTourBooking";

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Navigation items for the sidebar
  const navItems = [
    { name: "Overview", path: "/student" },
    { name: "Documents", path: "/student/dashboard", hasUpdate: true },
    { name: "Your Applications", path: "/student/applications" },
    { name: "Academic Planning", path: "/student/academic-planning" },
    { name: "Financial Aid", path: "/student/financial-aid" },
    { name: "Career Services", path: "/student/career-services" },
    { name: "Student Community", path: "/student/community" },
    { name: "Pay Your Fee", path: "/student/fee" },
    { name: "News & Events", path: "/student/news-events" },
    { name: "Life @ WCC", path: "/student/campus-life" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 flex justify-center border-b border-gray-200">
          <img 
            src="/lovable-uploads/120260b6-bc38-4844-841b-c6a5b6067560.png" 
            alt="Western Community College" 
            className="h-14"
          />
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2">
              ?
            </div>
            <div>
              <h3 className="font-medium text-sm">Tushar Malhotra</h3>
              <p className="text-xs text-gray-500">malhotratushar37@gmail.com</p>
            </div>
          </div>
        </div>

        <nav className="p-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center justify-between px-4 py-2 rounded-md text-sm ${
                currentPath === item.path
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{item.name}</span>
              {item.hasUpdate && (
                <Plus className="w-4 h-4 text-blue-600 bg-blue-100 rounded-full p-0.5" />
              )}
            </Link>
          ))}
        </nav>

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

      {/* Chatbot */}
      <Chatbot mode="dashboard" />
    </div>
  );
};

export default StudentLayout;
