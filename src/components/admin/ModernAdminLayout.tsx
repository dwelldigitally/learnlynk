import { Outlet, useLocation } from 'react-router-dom';
import { TopNavigationBar } from './TopNavigationBar';
import { ConfigurationSidebar } from './ConfigurationSidebar';

interface ModernAdminLayoutProps {
  children?: React.ReactNode;
}

export function ModernAdminLayout({ children }: ModernAdminLayoutProps) {
  const location = useLocation();

  // Check if we're on a configuration page
  const isConfigurationPage = location.pathname.startsWith('/admin/configuration') || 
                               location.pathname.startsWith('/admin/setup') ||
                               location.pathname.startsWith('/admin/profile') ||
                               location.pathname.startsWith('/admin/notifications');

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Top Navigation Bar - Always visible */}
      <TopNavigationBar />
      
      <div className="flex pt-14 sm:pt-16 lg:pt-20 w-full">
        {/* Configuration Sidebar - Only for configuration pages */}
        {isConfigurationPage && (
          <ConfigurationSidebar />
        )}
        
        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
