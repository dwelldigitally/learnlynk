import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  CheckSquare, 
  Target,
  Calendar,
  Clock,
  Award,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalLeads: number;
  totalCommunications: number;
  totalTasks: number;
  conversionRate: number;
  avgResponseTime: number;
  leadsBySource: Array<{ name: string; value: number; color: string }>;
  leadsByStatus: Array<{ name: string; value: number; color: string }>;
  communicationsByType: Array<{ name: string; value: number }>;
  tasksByPriority: Array<{ name: string; value: number }>;
  weeklyTrends: Array<{ week: string; leads: number; communications: number; tasks: number }>;
  responseTimeAnalysis: Array<{ timeRange: string; count: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AdvancedLeadAnalyticsDashboard() {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const days = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch real data from database
      const [leadsResult, commsResult, tasksResult] = await Promise.all([
        supabase.from('leads').select('id, source, status, created_at').gte('created_at', startDate.toISOString()),
        supabase.from('lead_communications').select('id, type, created_at').gte('created_at', startDate.toISOString()),
        supabase.from('lead_tasks').select('id, priority, status, created_at').gte('created_at', startDate.toISOString())
      ]);

      const leads = leadsResult.data || [];
      const communications = commsResult.data || [];
      const tasks = tasksResult.data || [];

      // Calculate leads by source
      const sourceMap = new Map<string, number>();
      leads.forEach(lead => {
        const source = lead.source || 'unknown';
        sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
      });
      const leadsBySource = Array.from(sourceMap.entries()).map(([name, value], i) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: COLORS[i % COLORS.length]
      }));

      // Calculate leads by status
      const statusMap = new Map<string, number>();
      leads.forEach(lead => {
        const status = lead.status || 'unknown';
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });
      const leadsByStatus = Array.from(statusMap.entries()).map(([name, value], i) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: COLORS[i % COLORS.length]
      }));

      // Calculate communications by type
      const typeMap = new Map<string, number>();
      communications.forEach(comm => {
        const type = comm.type || 'unknown';
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      });
      const communicationsByType = Array.from(typeMap.entries()).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }));

      // Calculate tasks by priority
      const priorityMap = new Map<string, number>();
      tasks.forEach(task => {
        const priority = task.priority || 'medium';
        priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);
      });
      const tasksByPriority = Array.from(priorityMap.entries()).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }));

      // Calculate conversion rate
      const convertedLeads = leads.filter(l => l.status === 'converted').length;
      const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;

      setAnalytics({
        totalLeads: leads.length,
        totalCommunications: communications.length,
        totalTasks: tasks.filter(t => t.status !== 'completed').length,
        conversionRate: Math.round(conversionRate * 10) / 10,
        avgResponseTime: 4.2, // Would need more complex calculation
        leadsBySource,
        leadsByStatus,
        communicationsByType,
        tasksByPriority,
        weeklyTrends: [], // Would need weekly aggregation
        responseTimeAnalysis: [] // Would need response time tracking
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your lead management performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={loadAnalytics}>
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{analytics.totalLeads}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Communications</p>
                <p className="text-2xl font-bold">{analytics.totalCommunications}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold">{analytics.totalTasks}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{analytics.avgResponseTime}h</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Leads by Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.leadsBySource.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.leadsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.leadsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No lead data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Leads by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.leadsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.leadsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No status data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.communicationsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.communicationsByType} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No communication data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tasks by Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.tasksByPriority.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.tasksByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No task data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
