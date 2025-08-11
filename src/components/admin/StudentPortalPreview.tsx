import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, 
  Smartphone, 
  Home, 
  FileText, 
  ClipboardList, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  CreditCard, 
  MessageSquare,
  Bell,
  User,
  Settings,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { usePortalContent, usePortalConfig, usePortalMessages } from '@/hooks/useStudentPortal';

interface StudentPortalPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentPortalPreview({ open, onOpenChange }: StudentPortalPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState('overview');

  const { data: portalContent = [] } = usePortalContent();
  const { data: portalConfig } = usePortalConfig();
  const { data: portalMessages = [] } = usePortalMessages();

  // Filter published content
  const publishedContent = portalContent.filter(content => content.is_published);
  const recentMessages = portalMessages.slice(0, 3);

  // Navigation items for the preview
  const navItems = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'documents', name: 'Documents', icon: FileText, enabled: portalConfig?.features?.document_upload },
    { id: 'applications', name: 'Applications', icon: ClipboardList, enabled: portalConfig?.features?.application_tracking },
    { id: 'academic', name: 'Academic Planning', icon: Calendar },
    { id: 'financial', name: 'Financial Aid', icon: DollarSign },
    { id: 'career', name: 'Career Services', icon: Briefcase },
    { id: 'fee', name: 'Pay Your Fee', icon: CreditCard, enabled: portalConfig?.features?.fee_payments },
    { id: 'messages', name: 'Message Centre', icon: MessageSquare, enabled: portalConfig?.features?.message_center },
  ];

  const enabledNavItems = navItems.filter(item => item.enabled !== false);

  const renderPreviewContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Message */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {portalConfig?.welcome_message || 'Welcome to your student portal'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access your documents, track applications, and stay connected with WCC.
                </p>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Latest Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {publishedContent.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No announcements available
                  </p>
                ) : (
                  publishedContent.slice(0, 3).map((content) => (
                    <div key={content.id} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{content.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {content.content}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant={
                              content.content_type === 'alert' ? 'destructive' :
                              content.content_type === 'announcement' ? 'default' :
                              'secondary'
                            }>
                              {content.content_type}
                            </Badge>
                            {content.priority === 'urgent' && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                          </div>
                        </div>
                        {content.content_type === 'alert' ? (
                          <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
                        ) : (
                          <Info className="h-5 w-5 text-blue-500 mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Application Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Application Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Health Care Assistant Program</span>
                    <span className="text-sm text-muted-foreground">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Application Submitted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Documents Reviewed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-yellow-500 bg-yellow-100" />
                      <span className="text-sm">Fee Payment Pending</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Message Centre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMessages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No messages available
                  </p>
                ) : (
                  recentMessages.map((message) => (
                    <div key={message.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {message.message_type === 'warning' ? (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        ) : message.message_type === 'error' ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : message.message_type === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Info className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{message.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {message.content}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={
                            message.priority === 'urgent' ? 'destructive' :
                            message.priority === 'high' ? 'secondary' :
                            'outline'
                          }>
                            {message.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'applications':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Health Care Assistant</h4>
                      <p className="text-sm text-muted-foreground">Application submitted March 15, 2024</p>
                    </div>
                    <Badge>Under Review</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Education Assistant</h4>
                      <p className="text-sm text-muted-foreground">Application submitted February 28, 2024</p>
                    </div>
                    <Badge variant="secondary">Accepted</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{activeSection.replace('_', ' ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section would show content for {activeSection.replace('_', ' ')}.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {portalConfig?.portal_title || 'Student Portal'} - Preview
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className={`mx-auto bg-background border rounded-lg overflow-hidden flex h-full ${
            viewMode === 'mobile' ? 'max-w-md' : 'w-full'
          }`}>
            {/* Sidebar */}
            <aside className={`bg-sidebar border-r ${
              viewMode === 'mobile' ? 'w-16' : 'w-64'
            }`}>
              {/* Header */}
              <div className="p-4 border-b">
                {viewMode === 'desktop' ? (
                  <div>
                    <h2 className="font-semibold text-lg">WCC Portal</h2>
                    <p className="text-sm text-muted-foreground">Student Dashboard</p>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Home className="h-6 w-6" />
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {enabledNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      } ${viewMode === 'mobile' ? 'justify-center' : ''}`}
                      title={viewMode === 'mobile' ? item.name : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      {viewMode === 'desktop' && <span>{item.name}</span>}
                      {viewMode === 'desktop' && activeSection === item.id && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              {/* Header */}
              <header className="bg-background border-b p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold">
                      Hey Student! 👋
                    </h1>
                    {viewMode === 'desktop' && (
                      <p className="text-sm text-muted-foreground">
                        Welcome back to your portal
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </header>

              {/* Content */}
              <div className="p-6">
                {renderPreviewContent()}
              </div>
            </main>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}