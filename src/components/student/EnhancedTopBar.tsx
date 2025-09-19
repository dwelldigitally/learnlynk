import React from 'react';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { GlobalSearchBar } from './GlobalSearchBar';
import { QuickActionsCenter } from './QuickActionsCenter';
import { StreamlinedUserMenu } from './StreamlinedUserMenu';
import { ContextualHelp } from './ContextualHelp';
import { StudentInfoDisplay } from './StudentInfoDisplay';

interface EnhancedTopBarProps {
  onToggleSidebar?: () => void;
  useDummyData?: boolean;
  onToggleDummyData?: () => void;
}

export const EnhancedTopBar: React.FC<EnhancedTopBarProps> = ({
  onToggleSidebar,
  useDummyData,
  onToggleDummyData
}) => {
  return (
    <header className="bg-background border-b border-border/50 backdrop-blur-sm sticky top-0 z-40">
      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Left Section - Breadcrumb & Navigation */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <BreadcrumbNavigation onToggleSidebar={onToggleSidebar} />
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <GlobalSearchBar />
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <GlobalSearchBar isMobile />
          </div>
          <QuickActionsCenter />
          <ContextualHelp />
          <StreamlinedUserMenu 
            useDummyData={useDummyData}
            onToggleDummyData={onToggleDummyData}
          />
        </div>
      </div>

      {/* Student Information Bar */}
      <StudentInfoDisplay useDummyData={useDummyData} />
    </header>
  );
};