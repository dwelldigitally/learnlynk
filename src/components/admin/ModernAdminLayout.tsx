import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNavigationBar } from './TopNavigationBar';
import { DynamicSidebar } from './DynamicSidebar';
import { navigationStructure } from '@/data/navigationStructure';

interface ModernAdminLayoutProps {
  children?: React.ReactNode;
}

export function ModernAdminLayout({ children }: ModernAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const location = useLocation();

  // Determine active section from current path
  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    for (const section of navigationStructure.sections) {
      if (section.items.some(item => path.startsWith(item.href))) {
        return section.id;
      }
    }
    return navigationStructure.sections[0].id;
  };

  const currentActiveSection = activeSection || getActiveSectionFromPath();

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // Navigate to the first item in the section
    const section = navigationStructure.sections.find(s => s.id === sectionId);
    if (section && section.items.length > 0) {
      // Don't auto-navigate, let user choose from sidebar
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <TopNavigationBar
        activeSection={currentActiveSection}
        onSectionChange={handleSectionChange}
        onToggleMobileMenu={toggleSidebar}
      />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1 relative">
        {/* Dynamic Sidebar - Hide on home page */}
        {!isHomePage && (
          <DynamicSidebar
            activeSection={currentActiveSection}
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 w-full ${!isHomePage ? 'lg:ml-80' : ''}`}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default ModernAdminLayout;