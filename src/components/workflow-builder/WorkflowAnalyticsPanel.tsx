import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Clock,
  BarChart3,
  Activity
} from 'lucide-react';
import { WorkflowExecutionService } from '@/services/workflowExecutionService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface WorkflowAnalyticsPanelProps {
  workflowId?: string;
}

export function WorkflowAnalyticsPanel({ workflowId }: WorkflowAnalyticsPanelProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!workflowId) {
        setLoading(false);
        return;
      }

      try {
        const data = await WorkflowExecutionService.getWorkflowAnalytics(workflowId);
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [workflowId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!workflowId) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Available</h3>
            <p className="text-muted-foreground max-w-md">
              Save your workflow first to start tracking analytics and execution history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = analytics || {
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    exitedEnrollments: 0,
    completionRate: 0,
    stepDistribution: {}
  };

  const statusData = [
    { name: 'Active', value: stats.activeEnrollments, color: 'hsl(var(--primary))' },
    { name: 'Completed', value: stats.completedEnrollments, color: 'hsl(142, 76%, 36%)' },
    { name: 'Exited', value: stats.exitedEnrollments, color: 'hsl(var(--destructive))' }
  ].filter(d => d.value > 0);

  const stepData = Object.entries(stats.stepDistribution).map(([step, count]) => ({
    step: `Step ${parseInt(step) + 1}`,
    count
  }));

  return (
    <ScrollArea className="h-full">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Workflow Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Track enrollments, completions, and performance metrics
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
                  <div className="text-sm text-muted-foreground">Total Enrollments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.activeEnrollments}</div>
                  <div className="text-sm text-muted-foreground">Active Now</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.completedEnrollments}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enrollment Status</CardTitle>
              <CardDescription>Distribution by current status</CardDescription>
            </CardHeader>
            <CardContent>
              {statusData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Leads by Step</CardTitle>
              <CardDescription>Where are leads in the workflow?</CardDescription>
            </CardHeader>
            <CardContent>
              {stepData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stepData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="step" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No active enrollments
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest workflow executions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Activity tracking will appear here once the workflow is active</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
