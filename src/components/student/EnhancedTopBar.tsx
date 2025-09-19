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
        {/* Navigation Row */}
        <div className="flex items-center justify-between">
          <BreadcrumbNavigation onToggleSidebar={onToggleSidebar} />
          <StreamlinedUserMenu 
            useDummyData={useDummyData}
            onToggleDummyData={onToggleDummyData}
          />
        </div>

        {/* Student Information Row */}
        <div className="flex items-center justify-between">
          {/* Left Section - Student Profile */}
          <div className="flex items-center gap-4">
            {/* Avatar and Name Section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center ring-2 ring-primary/20">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-primary-foreground" />
                )}
              </div>
              
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground">{displayData.name}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>ID: {displayData.studentId}</span>
                  <Badge variant="secondary" className="text-xs h-5">
                    {displayData.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="hidden lg:flex items-center gap-6 ml-6 pl-6 border-l border-border/50">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-medium">{displayData.program}</span>
                  <span className="text-muted-foreground text-xs">Program</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-medium">{displayData.semester}</span>
                  <span className="text-muted-foreground text-xs">Current Term</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-9 px-4 relative">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Messages</span>
              <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">2</Badge>
            </Button>
            
            <Button variant="ghost" size="sm" className="h-9 px-4 relative">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Alerts</span>
              <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">5</Badge>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};