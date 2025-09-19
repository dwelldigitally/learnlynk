import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useStudentPortalContext } from '@/pages/StudentPortal';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { QuickActionsCenter } from './QuickActionsCenter';
import { StreamlinedUserMenu } from './StreamlinedUserMenu';
import { ContextualHelp } from './ContextualHelp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  MessageSquare, 
  Bell,
  Clock
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
      {/* Main Header */}
      <div className="px-4 py-3">
        {/* Top Row - Navigation and Actions */}
        <div className="flex items-center justify-between mb-3">
          {/* Left Section - Breadcrumb & Navigation */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <BreadcrumbNavigation onToggleSidebar={onToggleSidebar} />
          </div>

          {/* Right Section - Actions & User Menu */}
          <div className="flex items-center gap-2">
            <QuickActionsCenter />
            <ContextualHelp />
            <StreamlinedUserMenu 
              useDummyData={useDummyData}
              onToggleDummyData={onToggleDummyData}
            />
          </div>
        </div>

        {/* Bottom Row - Student Information */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-3 border-t border-border/30">
          {/* Student Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{displayData.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>ID: {displayData.studentId}</span>
                  <Badge variant="secondary" className="text-xs">
                    {displayData.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{displayData.email}</span>
              </div>
              {displayData.phone !== 'Not provided' && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{displayData.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Academic Info & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Academic Info */}
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span>{displayData.program}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{displayData.semester}</span>
              </div>
            </div>

            {/* Communication Quick Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-3">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Messages</span>
                <Badge variant="destructive" className="ml-1 text-xs">2</Badge>
              </Button>
              
              <Button variant="ghost" size="sm" className="h-8 px-3">
                <Bell className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Alerts</span>
                <Badge variant="secondary" className="ml-1 text-xs">5</Badge>
              </Button>

              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground ml-2">
                <Clock className="w-3 h-3" />
                <span>Last login: {displayData.lastLogin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Contact Info */}
        <div className="md:hidden mt-2 pt-2 border-t border-border/30 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>{displayData.email}</span>
          </div>
          {displayData.phone !== 'Not provided' && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{displayData.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4" />
            <span>{displayData.program}</span>
          </div>
        </div>
      </div>
    </header>
  );
};