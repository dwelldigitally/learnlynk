import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNavigationBar } from './TopNavigationBar';
import { AdminSidebar } from './AdminSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

import { navigationStructure } from '@/data/navigationStructure';
import { useIsMobile, useViewport } from '@/hooks/use-mobile';

interface ModernAdminLayoutProps {
  children?: React.ReactNode;
}

export function ModernAdminLayout({ children }: ModernAdminLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const location = useLocation();

  // Determine active section from current path
  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    
    // Handle specific detail page patterns
    if (path.startsWith('/admin/leads/')) {
      return 'leads-marketing';
    }
    if (path.startsWith('/admin/students/')) {
      return 'students-applications';
    }
    if (path.startsWith('/admin/programs/')) {
      return 'data-management';
    }
    if (path.startsWith('/admin/workflows/')) {
      return 'data-management';
    }
    if (path.startsWith('/admin/requirements/')) {
      return 'data-management';
    }
    if (path.startsWith('/admin/analytics/')) {
      return 'analytics-reports';
    }
    if (path.startsWith('/admin/reports/')) {
      return 'analytics-reports';
    }
    
    // Find section by exact or prefix match
    for (const section of navigationStructure.sections) {
      if (section.items.some(item => path === item.href || path.startsWith(item.href + '/'))) {
        return section.id;
      }
    }
    
    // Default to leads-marketing if no match found
    return 'leads-marketing';
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

  // Check if we're on the home page or configuration pages
  const isHomePage = location.pathname === '/admin';
  const isConfigurationPage = location.pathname.startsWith('/admin/configuration');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex flex-col w-full">
        {/* Top Navigation Bar */}
        <TopNavigationBar
          activeSection={currentActiveSection}
          onSectionChange={handleSectionChange}
        />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-1 w-full">
          {/* Admin Sidebar - Hide on home page and configuration pages */}
          {!isHomePage && !isConfigurationPage && (
            <AdminSidebar activeSection={currentActiveSection} />
          )}

          {/* Main Content Area */}
          <SidebarInset>
            <main className="flex-1 w-full p-6">
              <div className="max-w-full overflow-x-hidden">
                {children || <Outlet />}
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ModernAdminLayout;