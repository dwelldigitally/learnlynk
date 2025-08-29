import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StudentPortalService, StudentPortal } from '@/services/studentPortalService';
import { Loader2 } from 'lucide-react';
import StudentLayout from '@/components/student/StudentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function StudentPortalAccess() {
  const { accessToken } = useParams<{ accessToken: string }>();
  const [portal, setPortal] = useState<StudentPortal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortal = async () => {
      if (!accessToken) {
        setError('No access token provided');
        setLoading(false);
        return;
      }

      try {
        const portalData = await StudentPortalService.getPortalByToken(accessToken);
        if (portalData) {
          setPortal(portalData);
        } else {
          setError('Invalid or expired access token');
        }
      } catch (err) {
        console.error('Error fetching portal:', err);
        setError('Failed to load portal');
      } finally {
        setLoading(false);
      }
    };

    fetchPortal();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (error || !portal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>{error || 'Portal not found'}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please check your access token or contact support if you continue to have issues.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Apply portal theme
  const portalConfig = portal.portal_config || {};
  const theme = portalConfig.theme || {};

  const customStyle = {
    '--portal-primary': theme.primary || '#6366f1',
    '--portal-secondary': theme.secondary || '#4f46e5',
    '--portal-accent': theme.accent || '#8b5cf6'
  } as React.CSSProperties;

  return (
    <div style={customStyle}>
      <StudentLayout>
        <PersonalizedDashboard portal={portal} />
      </StudentLayout>
    </div>
  );
}

function PersonalizedDashboard({ portal }: { portal: StudentPortal }) {
  const config = portal.portal_config || {};
  const timeline = config.timeline || {};
  const resources = config.resources || [];
  
  // Calculate application progress (mock data for demo)
  const applicationSteps = [
    { name: 'Application Submitted', completed: true },
    { name: 'Documents Required', completed: false },
    { name: 'Review Process', completed: false },
    { name: 'Final Decision', completed: false }
  ];
  
  const completedSteps = applicationSteps.filter(step => step.completed).length;
  const progressPercent = (completedSteps / applicationSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome, {portal.student_name}!
        </h1>
        <p className="text-lg text-muted-foreground">
          {config.welcomeMessage || `Welcome to your ${portal.program} portal`}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">{portal.program}</Badge>
          {portal.intake_date && (
            <Badge variant="outline">
              Intake: {new Date(portal.intake_date).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Application Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
          <CardDescription>Track your journey to enrollment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}% Complete</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
            
            <div className="space-y-3">
              {applicationSteps.map((step, index) => (
                <div key={step.name} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.completed 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={step.completed ? 'text-foreground' : 'text-muted-foreground'}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
          <CardDescription>Key deadlines for your program</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeline.applicationDeadline && (
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="font-medium">Application Deadline</span>
                <Badge variant="destructive">
                  {new Date(timeline.applicationDeadline).toLocaleDateString()}
                </Badge>
              </div>
            )}
            {timeline.documentSubmission && (
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="font-medium">Document Submission</span>
                <Badge variant="outline">
                  {new Date(timeline.documentSubmission).toLocaleDateString()}
                </Badge>
              </div>
            )}
            {timeline.finalDecision && (
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="font-medium">Final Decision</span>
                <Badge variant="secondary">
                  {new Date(timeline.finalDecision).toLocaleDateString()}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Program Resources */}
      {resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Program Resources</CardTitle>
            <CardDescription>Helpful materials for your {portal.program} journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resources.map((resource: string, index: number) => (
                <div key={index} className="p-3 border rounded hover:bg-muted/50 transition-colors cursor-pointer">
                  <span className="font-medium">{resource}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Things you can do right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-center">
              <h3 className="font-semibold mb-2">Upload Documents</h3>
              <p className="text-sm text-muted-foreground">Submit required documentation</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-center">
              <h3 className="font-semibold mb-2">Schedule Interview</h3>
              <p className="text-sm text-muted-foreground">Book your admission interview</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-center">
              <h3 className="font-semibold mb-2">Contact Advisor</h3>
              <p className="text-sm text-muted-foreground">Get help from your advisor</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}