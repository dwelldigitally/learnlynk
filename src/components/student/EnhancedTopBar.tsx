import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useStudentPortalContext } from '@/pages/StudentPortal';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { StreamlinedUserMenu } from './StreamlinedUserMenu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  GraduationCap, 
  MessageSquare, 
  Bell
} from 'lucide-react';

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
  const { user } = useAuth();
  const { profile } = useProfile();
  const { session } = useStudentPortalContext();

  // Get display data based on dummy data setting
  const displayData = useDummyData ? {
    name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Sarah Johnson',
    studentId: profile?.student_id || 'WCC1047859',
    email: profile?.email || 'sarah.johnson@student.wcc.ca',
    phone: profile?.phone || '+1 (604) 555-0123',
    program: 'Computer Information Systems',
    semester: 'Fall 2024 - Semester 3',
    status: 'Active',
    lastLogin: new Date().toLocaleDateString()
  } : {
    name: session?.student_name || user?.email?.split('@')[0] || 'Student',
    studentId: session?.id?.slice(-8) || 'WCC' + Math.random().toString().slice(-6),
    email: session?.email || user?.email || 'student@wcc.ca',
    phone: profile?.phone || 'Not provided',
    program: session?.program || 'Not enrolled',
    semester: 'Current Term',
    status: 'Active',
    lastLogin: new Date().toLocaleDateString()
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-40 backdrop-blur-sm">
      <div className="px-6 py-5 space-y-4">
        {/* Navigation Row */}
        <div className="flex items-center justify-between">
          <BreadcrumbNavigation onToggleSidebar={onToggleSidebar} />
          <StreamlinedUserMenu 
            useDummyData={useDummyData}
            onToggleDummyData={onToggleDummyData}
          />
        </div>

        {/* Student Profile Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="p-5">
            <div className="flex items-center justify-between">
              {/* Left Section - Student Profile */}
              <div className="flex items-center gap-5">
                {/* Avatar and Name Section */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ring-2 ring-violet-200 dark:ring-violet-800 shadow-lg">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">{displayData.name}</h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-violet-600 dark:text-violet-400 font-medium">ID: {displayData.studentId}</span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 text-xs px-2 py-1">
                        {displayData.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Academic Information Cards */}
                <div className="hidden lg:flex items-center gap-4 ml-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-blue-900 dark:text-blue-100 font-semibold text-sm">{displayData.program}</span>
                        <span className="text-blue-600 dark:text-blue-400 text-xs">Program</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200/50 dark:border-purple-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-800/50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-purple-900 dark:text-purple-100 font-semibold text-sm">{displayData.semester}</span>
                        <span className="text-purple-600 dark:text-purple-400 text-xs">Current Term</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Action Buttons */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-10 px-4 relative bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2 font-medium">Messages</span>
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center border-2 border-white dark:border-slate-800">2</Badge>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-10 px-4 relative bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 rounded-lg transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2 font-medium">Alerts</span>
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center border-2 border-white dark:border-slate-800">5</Badge>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};