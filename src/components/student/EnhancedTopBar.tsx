import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useStudentPortalContext } from '@/pages/StudentPortal';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { StreamlinedUserMenu } from './StreamlinedUserMenu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationCenter } from './NotificationCenter';
import { User, Calendar, GraduationCap, MessageSquare, Bell, TrendingUp, AlertTriangle, Menu } from 'lucide-react';
import defaultStudentAvatar from '@/assets/default-student-avatar.jpg';

interface EnhancedTopBarProps {
  onToggleSidebar?: () => void;
  useDummyData?: boolean;
  onToggleDummyData?: () => void;
  showMenuIcon?: boolean;
}

export const EnhancedTopBar: React.FC<EnhancedTopBarProps> = ({
  onToggleSidebar,
  useDummyData,
  onToggleDummyData,
  showMenuIcon = false
}) => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { session, isLoading: sessionLoading } = useStudentPortalContext();

  // Generate a stable student ID based on user's unique identifier
  const generateStableStudentId = useMemo(() => {
    if (profile?.student_id) return profile.student_id;
    if (session?.id) return session.id.slice(-8);
    
    // Generate stable ID based on user email or ID
    const baseId = user?.id || user?.email || 'default';
    // Create a simple hash of the base ID to get consistent numbers
    let hash = 0;
    for (let i = 0; i < baseId.length; i++) {
      const char = baseId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const stableNumber = Math.abs(hash).toString().slice(-6).padStart(6, '0');
    return `WCC${stableNumber}`;
  }, [profile?.student_id, session?.id, user?.id, user?.email]);

  // Memoized display data to prevent flickering - wait for profile data to load
  const displayData = useMemo(() => {
    // If profile is still loading, show a consistent loading state
    if (profileLoading && !profile) {
      return {
        name: 'Loading...',
        studentId: generateStableStudentId,
        email: user?.email || 'student@wcc.ca',
        phone: 'Loading...',
        program: 'Loading...',
        semester: 'Current Term',
        status: 'Active',
        lastLogin: new Date().toLocaleDateString(),
        avatar: user?.user_metadata?.avatar_url || defaultStudentAvatar,
        isLoading: true
      };
    }

    // Once profile data is available or loading is complete, show actual data
    return {
      name: profile?.first_name && profile?.last_name 
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : session?.student_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student',
      studentId: generateStableStudentId,
      email: profile?.email || session?.email || user?.email || 'student@wcc.ca',
      phone: profile?.phone || 'Not provided',
      program: session?.programs_applied?.[0] || 'Not enrolled',
      semester: 'Current Term',
      status: session?.status || 'Active',
      lastLogin: new Date().toLocaleDateString(),
      avatar: profile?.avatar_url || user?.user_metadata?.avatar_url || defaultStudentAvatar,
      isLoading: false
    };
  }, [profile, session, user, generateStableStudentId, profileLoading]);
  return <div className="px-4 sm:px-6 py-3 sm:py-5 space-y-3 sm:space-y-4 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-40 backdrop-blur-sm">
        {/* Student Profile Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="p-3 sm:p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left Section - Student Profile */}
              <div className="flex items-center gap-3 sm:gap-5">
                {/* Avatar and Name Section */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ring-2 ring-violet-200 dark:ring-violet-800 shadow-lg overflow-hidden">
                      {displayData.isLoading ? (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                      ) : (
                        <img 
                          src={displayData.avatar} 
                          alt="Student Profile" 
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultStudentAvatar;
                          }}
                        />
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  
                  <div className="flex flex-col">
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {displayData.isLoading ? (
                        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      ) : (
                        displayData.name
                      )}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                      <span className="text-xs sm:text-sm text-violet-600 dark:text-violet-400 font-medium">
                        ID: {displayData.studentId}
                      </span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 text-xs px-2 py-1 self-start">
                        {displayData.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Academic Information Cards */}
                

                {/* Acceptance Likelihood & Urgency - Hidden on mobile, visible on larger screens */}
                <div className="hidden xl:flex items-center gap-4 ml-8">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200/50 dark:border-green-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-green-900 dark:text-green-100 font-bold text-sm">92%</span>
                        <span className="text-green-600 dark:text-green-400 text-xs">Acceptance Likelihood</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200/50 dark:border-orange-800/50 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-800/50 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-orange-900 dark:text-orange-100 font-semibold text-sm">12 Seats Left</span>
                        <span className="text-orange-600 dark:text-orange-400 text-xs font-medium">Apply Soon!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Menu Button - Only show on mobile */}
                {showMenuIcon && onToggleSidebar && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onToggleSidebar}
                    className="lg:hidden h-8 w-8 p-0 hover:bg-muted"
                  >
                    <Menu className="w-4 h-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                )}
                <Button asChild variant="ghost" size="sm" className="h-8 sm:h-10 px-2 sm:px-4 relative bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 rounded-lg transition-colors">
                  <Link to="/student/messages">
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden md:inline ml-2 font-medium">Messages</span>
                    <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center border-2 border-white dark:border-slate-800">2</Badge>
                  </Link>
                </Button>
                
                <NotificationCenter>
                  <Button variant="ghost" size="sm" className="h-8 sm:h-10 px-2 sm:px-4 relative bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 rounded-lg transition-colors">
                    <Bell className="w-4 h-4" />
                    <span className="hidden md:inline ml-2 font-medium">Alerts</span>
                    <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-orange-500 text-white text-xs h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center border-2 border-white dark:border-slate-800">5</Badge>
                  </Button>
                </NotificationCenter>
                
                <StreamlinedUserMenu 
                  useDummyData={useDummyData}
                  onToggleDummyData={onToggleDummyData}
                />
              </div>
            </div>
          </div>
        </div>
    </div>;
};