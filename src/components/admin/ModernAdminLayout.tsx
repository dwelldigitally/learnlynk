import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNavigationBar } from './TopNavigationBar';
import { DynamicSidebar } from './DynamicSidebar';
import { AircallWidgetWrapper } from './leads/AircallWidgetProvider';
import { navigationStructure } from '@/data/navigationStructure';
import { useIsMobile, useViewport } from '@/hooks/use-mobile';

interface ModernAdminLayoutProps {
  children?: React.ReactNode;
}

export function ModernAdminLayout({ children }: ModernAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const location = useLocation();
  const isMobile = useIsMobile();
  const { orientation } = useViewport();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

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

  // Check if we're on the home page or configuration pages
  const isHomePage = location.pathname === '/admin';
  const isConfigurationPage = location.pathname.startsWith('/admin/configuration');

  return (
    <AircallWidgetWrapper>
      <div className="min-h-screen bg-background flex flex-col w-full">
        {/* Top Navigation Bar */}
        <TopNavigationBar
          activeSection={currentActiveSection}
          onSectionChange={handleSectionChange}
          onToggleMobileMenu={toggleSidebar}
        />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-1 relative w-full">
          {/* Mobile Overlay */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeSidebar}
            />
          )}

          {/* Dynamic Sidebar - Hide on home page and configuration pages */}
          {!isHomePage && !isConfigurationPage && (
            <DynamicSidebar
              activeSection={currentActiveSection}
              isOpen={sidebarOpen}
              onClose={closeSidebar}
            />
          )}

          {/* Main Content Area */}
          <main className={`flex-1 w-full min-h-screen bg-background/50 transition-all duration-300 ${
            isMobile ? 'p-3' : 'p-6'
          }`}>
            <div className="h-full max-w-full overflow-x-hidden">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </AircallWidgetWrapper>
  );
}

export default ModernAdminLayout;