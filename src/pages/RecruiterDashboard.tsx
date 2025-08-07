import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Upload, Users, FileText, DollarSign, TrendingUp } from "lucide-react";
import { RecruiterService } from "@/services/recruiterService";
import type { RecruiterApplication } from "@/types/recruiter";
import { format } from "date-fns";
import { toast } from "sonner";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    commissionOwed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get recruiter profile (will fallback to dummy data)
      const recruiterProfile = await RecruiterService.getRecruiterProfile();
      
      if (!recruiterProfile) {
        // This shouldn't happen since we have dummy data fallback
        toast.error("Unable to load recruiter profile");
        return;
      }

      // Get applications and stats (will fallback to dummy data if needed)
      const [applicationsData, statsData] = await Promise.all([
        RecruiterService.getRecruiterApplications(recruiterProfile.id),
        RecruiterService.getRecruiterStats(recruiterProfile.id),
      ]);

      setApplications(applicationsData.slice(0, 5)); // Show latest 5
      setStats(statsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Even if there's an error, let's load dummy data
      const dummyApplications = RecruiterService.getDummyRecruiterApplications();
      const dummyStats = RecruiterService.getDummyRecruiterStats();
      
      setApplications(dummyApplications.slice(0, 5));
      setStats(dummyStats);
      
      toast.error("Using demo data - database connection failed");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'payment_pending':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your recent activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/recruiter/documents')}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          <Button onClick={() => navigate('/recruiter/submit-application')}>
            <Plus className="mr-2 h-4 w-4" />
            Submit New Application
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.round(stats.totalApplications * 0.1)} from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalApplications > 0 
                ? `${Math.round((stats.approvedApplications / stats.totalApplications) * 100)}% approval rate`
                : 'No applications yet'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Owed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.commissionOwed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From approved applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/recruiter/submit-application')}
            >
              <Plus className="h-6 w-6" />
              Submit New Application
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/recruiter/documents')}
            >
              <Upload className="h-6 w-6" />
              Upload Document
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/recruiter/students')}
            >
              <Users className="h-6 w-6" />
              View My Students
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Button variant="outline" onClick={() => navigate('/recruiter/applications')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No applications yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by submitting your first student application.
              </p>
              <Button className="mt-4" onClick={() => navigate('/recruiter/submit-application')}>
                <Plus className="mr-2 h-4 w-4" />
                Submit Application
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/recruiter/applications/${application.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{application.program}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted {format(new Date(application.submitted_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(application.status)}>
                      {formatStatus(application.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">System Update</p>
                <p className="text-sm text-muted-foreground">
                  New document verification features are now available.
                </p>
              </div>
            </div>
            
            {stats.pendingApplications > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Pending Applications</p>
                  <p className="text-sm text-muted-foreground">
                    You have {stats.pendingApplications} applications awaiting review.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}