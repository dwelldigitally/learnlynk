import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  CreditCard,
  MessageSquare,
  BookOpen,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { usePublishedContent, usePortalConfig } from '@/hooks/useStudentPortal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PortalAccessData {
  leadId: string;
  studentName: string;
  applicationDate: string;
  programsApplied: string[];
  status: string;
  config: any;
}

export function StudentPortalAccess() {
  const { accessToken } = useParams<{ accessToken: string }>();
  const navigate = useNavigate();
  const [accessData, setAccessData] = useState<PortalAccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: publishedContent } = usePublishedContent();
  const { data: portalConfig } = usePortalConfig();

  useEffect(() => {
    validateAccessAndLoadData();
  }, [accessToken]);

  const validateAccessAndLoadData = async () => {
    if (!accessToken) {
      setError('Invalid access token');
      setLoading(false);
      return;
    }

    try {
      // Use the new student_portal_access table
      const { data: portalAccess, error: accessError } = await supabase
        .from('student_portal_access')
        .select('*')
        .eq('access_token', accessToken)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .single();

      if (accessError || !portalAccess) {
        setError('Access token not found or expired');
        setLoading(false);
        return;
      }

      // Get the lead data to get current status
      if (portalAccess.lead_id) {
        const { data: lead, error: leadError } = await supabase
          .from('leads')
          .select('*')
          .eq('id', portalAccess.lead_id)
          .single();

        if (leadError || !lead) {
          setError('Student application data not found');
          setLoading(false);
          return;
        }

        setAccessData({
          leadId: lead.id,
          studentName: portalAccess.student_name,
          applicationDate: portalAccess.application_date,
          programsApplied: portalAccess.programs_applied || [],
          status: lead.status || 'under_review',
          config: portalAccess
        });
      }

      setLoading(false);
    } catch (err) {
      console.error('Error validating access:', err);
      setError('Failed to validate access. Please try again.');
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'new':
      case 'submitted':
        return 25;
      case 'under_review':
      case 'contacted':
        return 50;
      case 'accepted':
      case 'converted':
        return 100;
      case 'rejected':
        return 0;
      default:
        return 25;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (error || !accessData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Access Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {accessData.studentName.split(' ')[0]}!
              </h1>
              <p className="text-gray-600">Track your application progress and manage your enrollment</p>
            </div>
            
            <Badge className={`px-3 py-1 ${getStatusColor(accessData.status)}`}>
              {formatStatus(accessData.status)}
            </Badge>
          </div>
        </div>

        {/* Application Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{getStatusProgress(accessData.status)}%</span>
                </div>
                <Progress value={getStatusProgress(accessData.status)} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Application Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(accessData.applicationDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Programs Applied</p>
                  <p className="text-sm text-gray-600">
                    {accessData.programsApplied.length} program{accessData.programsApplied.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Expected Response</p>
                  <p className="text-sm text-gray-600">3-5 business days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {publishedContent?.slice(0, 3).map((content, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{content.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(content.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Additional Documents
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Admissions Team
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Application Fee
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Main Portal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="application">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>Review your submitted application information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{accessData.studentName}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Programs Applied For</h4>
                    <div className="flex flex-wrap gap-2">
                      {accessData.programsApplied.map((program, index) => (
                        <Badge key={index} variant="secondary">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Application Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <p className="font-medium">Application Submitted</p>
                          <p className="text-sm text-gray-600">
                            {new Date(accessData.applicationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                        <div>
                          <p className="font-medium">Under Review</p>
                          <p className="text-sm text-gray-600">In progress</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center opacity-50">
                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">Decision</p>
                          <p className="text-sm text-gray-600">Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages & Communications</CardTitle>
                <CardDescription>Stay updated with messages from our admissions team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publishedContent?.map((content, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{content.title}</h4>
                        <Badge variant={
                          content.priority === 'urgent' ? 'destructive' :
                          content.priority === 'high' ? 'default' : 'secondary'
                        }>
                          {content.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{content.content}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(content.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  
                  {(!publishedContent || publishedContent.length === 0) && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No messages yet</p>
                      <p className="text-sm text-gray-400">You'll receive updates here as your application progresses</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="next-steps">
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Here's what happens next in your application process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">What We're Doing</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Reviewing your application materials</li>
                        <li>• Verifying your educational background</li>
                        <li>• Assessing program fit</li>
                        <li>• Preparing admission decision</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">What You Can Do</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Check your email regularly</li>
                        <li>• Prepare for potential interview</li>
                        <li>• Upload any missing documents</li>
                        <li>• Contact us with questions</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 border-l-4 border-primary bg-gray-50">
                    <h4 className="font-medium mb-2">Expected Timeline</h4>
                    <p className="text-sm text-gray-600">
                      Our admissions team typically reviews applications within 3-5 business days. 
                      You'll receive an email notification once a decision has been made. If you have 
                      any questions during this time, please don't hesitate to contact us.
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Admissions Team
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}