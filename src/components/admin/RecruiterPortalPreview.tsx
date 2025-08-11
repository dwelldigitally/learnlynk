import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Bell,
  FileText,
  MessageSquare,
  BarChart3,
  Upload,
  DollarSign,
  Calendar,
  User,
  Settings,
  LogOut,
  Home,
  Users,
  BookOpen,
  Phone,
  Mail
} from 'lucide-react';
import { 
  usePublishedRecruiterContent,
  useRecruiterPortalConfig 
} from '@/hooks/useRecruiterPortal';

interface RecruiterPortalPreviewProps {
  companyFilter?: string;
}

export default function RecruiterPortalPreview({ companyFilter }: RecruiterPortalPreviewProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: content = [] } = usePublishedRecruiterContent();
  const { data: config } = useRecruiterPortalConfig();

  const portalConfig = {
    portal_title: config?.portal_title || 'Recruiter Portal',
    welcome_message: config?.welcome_message || 'Welcome to your recruiter portal',
    primary_color: config?.primary_color || '#0066cc',
    features: config?.features || {
      application_submission: true,
      commission_tracking: true,
      document_management: true,
      performance_metrics: true,
      communication_center: true,
      training_materials: true,
      company_directory: false,
      automated_notifications: true
    }
  };

  // Mock data for preview
  const mockStats = {
    applications_submitted: 24,
    applications_approved: 18,
    total_commission: 15750.00,
    pending_commission: 3250.00,
    conversion_rate: 75
  };

  const mockApplications = [
    { id: 1, student_name: 'Sarah Johnson', program: 'MBA', status: 'approved', commission: 1500 },
    { id: 2, student_name: 'Michael Chen', program: 'Computer Science', status: 'in_review', commission: 1200 },
    { id: 3, student_name: 'Emma Wilson', program: 'Marketing', status: 'submitted', commission: 1000 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold" style={{ color: portalConfig.primary_color }}>
              {portalConfig.portal_title}
            </h1>
            {companyFilter && (
              <Badge variant="outline">Viewing as: {companyFilter}</Badge>
            )}
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-card min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            
            {portalConfig.features.application_submission && (
              <Button
                variant={activeTab === 'applications' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('applications')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Applications
              </Button>
            )}

            {portalConfig.features.commission_tracking && (
              <Button
                variant={activeTab === 'commission' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('commission')}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Commission
              </Button>
            )}

            {portalConfig.features.performance_metrics && (
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            )}

            {portalConfig.features.document_management && (
              <Button
                variant={activeTab === 'documents' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('documents')}
              >
                <Upload className="w-4 h-4 mr-2" />
                Documents
              </Button>
            )}

            {portalConfig.features.communication_center && (
              <Button
                variant={activeTab === 'messages' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('messages')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
            )}

            {portalConfig.features.training_materials && (
              <Button
                variant={activeTab === 'training' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('training')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Training
              </Button>
            )}

            {portalConfig.features.company_directory && (
              <Button
                variant={activeTab === 'directory' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('directory')}
              >
                <Users className="w-4 h-4 mr-2" />
                Directory
              </Button>
            )}

            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-muted-foreground">{portalConfig.welcome_message}</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Applications</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.applications_submitted}</div>
                    <p className="text-xs text-muted-foreground">Submitted this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.applications_approved}</div>
                    <p className="text-xs text-muted-foreground">Applications approved</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commission</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${mockStats.total_commission.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total earned</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.conversion_rate}%</div>
                    <p className="text-xs text-muted-foreground">Approval rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{app.student_name}</p>
                          <p className="text-sm text-muted-foreground">{app.program}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={app.status === 'approved' ? 'default' : 'secondary'}>
                            {app.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">${app.commission}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Announcements */}
              {content.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {content.slice(0, 3).map((item) => (
                        <div key={item.id} className="border-l-4 pl-4" style={{ borderColor: portalConfig.primary_color }}>
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge variant="outline">{item.content_type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.content.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Student Applications</h2>
                <Button style={{ backgroundColor: portalConfig.primary_color }}>
                  <FileText className="w-4 h-4 mr-2" />
                  New Application
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Application Form</CardTitle>
                  <CardDescription>Submit a new student application</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="Enter first name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Enter last name" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="Enter email address" />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Program</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mba">MBA</SelectItem>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea placeholder="Additional notes..." rows={3} />
                    </div>

                    <Button style={{ backgroundColor: portalConfig.primary_color }}>
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'commission' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Commission Tracking</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      ${mockStats.total_commission.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600">
                      ${mockStats.pending_commission.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: portalConfig.primary_color }}>
                      $4,250
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Commission History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{app.student_name}</p>
                          <p className="text-sm text-muted-foreground">{app.program}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${app.commission}</p>
                          <Badge variant={app.status === 'approved' ? 'default' : 'secondary'}>
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Performance Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Applications to Approvals</span>
                        <span className="font-bold">{mockStats.conversion_rate}%</span>
                      </div>
                      <Progress value={mockStats.conversion_rate} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Goal: 30 applications</span>
                        <span className="font-bold">{mockStats.applications_submitted}/30</span>
                      </div>
                      <Progress value={(mockStats.applications_submitted / 30) * 100} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Other tabs would be similarly implemented */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Messages</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No messages yet</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <Input defaultValue="John" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <Input defaultValue="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" defaultValue="john.doe@recruiter.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input defaultValue="+1 (555) 123-4567" />
                    </div>
                    <Button style={{ backgroundColor: portalConfig.primary_color }}>
                      Update Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
