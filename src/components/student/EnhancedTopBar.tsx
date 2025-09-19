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
    <header className="bg-background border-b border-border/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="px-4 py-4 space-y-4">
        {/* First Row - Navigation and User Menu */}
        <div className="flex items-center justify-between">
          {/* Left Section - Breadcrumb & Student Avatar/Name */}
          <div className="flex items-center gap-4">
            <BreadcrumbNavigation onToggleSidebar={onToggleSidebar} />
            
            <div className="flex items-center gap-3 ml-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <div className="hidden sm:block">
                <h2 className="font-medium text-foreground text-sm">{displayData.name}</h2>
              </div>
            </div>
          </div>

          {/* Right Section - User Menu */}
          <StreamlinedUserMenu 
            useDummyData={useDummyData}
            onToggleDummyData={onToggleDummyData}
          />
        </div>

        {/* Second Row - Student Details and Actions */}
        <div className="flex items-center justify-between">
          {/* Left Section - Student ID and Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>ID: {displayData.studentId}</span>
              <Badge variant="secondary" className="text-xs">
                {displayData.status}
              </Badge>
            </div>

            {/* Academic Info */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden lg:inline">{displayData.program}</span>
                <span className="lg:hidden">Program</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{displayData.semester}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Communication Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-3">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Messages</span>
              <Badge variant="destructive" className="ml-1 text-xs">2</Badge>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-8 px-3">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Alerts</span>
              <Badge variant="secondary" className="ml-1 text-xs">5</Badge>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};