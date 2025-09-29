import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Building2, Calendar, Clock } from 'lucide-react';
import { 
  useStudentBatches, 
  useSiteCapacity, 
  useUnassignedStudents, 
  useSchedulingSessions 
} from '@/hooks/useScheduling';
import { usePracticumPrograms } from '@/hooks/usePracticum';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export function SchedulingAnalytics() {
  const { user } = useAuth();
  const { data: batches = [] } = useStudentBatches(user?.id || '');
  const { data: siteCapacity = [] } = useSiteCapacity(user?.id || '');
  const { data: unassignedStudents = [] } = useUnassignedStudents(user?.id || '');
  const { data: sessions = [] } = useSchedulingSessions(user?.id || '');
  const { data: programs = [] } = usePracticumPrograms(user?.id || '');

  // Calculate analytics data
  const totalCapacity = siteCapacity.reduce((sum, site) => sum + site.max_capacity, 0);
  const usedCapacity = siteCapacity.reduce((sum, site) => sum + (site.max_capacity - site.available_spots), 0);
  const utilizationRate = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

  // Program-wise distribution
  const programDistribution = programs.map(program => {
    const programCapacity = siteCapacity
      .filter(sc => (sc as any).practicum_programs?.id === program.id)
      .reduce((sum, sc) => sum + sc.max_capacity, 0);
    
    const programUsed = siteCapacity
      .filter(sc => (sc as any).practicum_programs?.id === program.id)
      .reduce((sum, sc) => sum + (sc.max_capacity - sc.available_spots), 0);

    return {
      name: program.program_name,
      capacity: programCapacity,
      used: programUsed,
      available: programCapacity - programUsed,
      utilization: programCapacity > 0 ? (programUsed / programCapacity) * 100 : 0
    };
  });

  // Site utilization data
  const siteUtilization = siteCapacity.reduce((acc, capacity) => {
    const siteName = (capacity as any).practicum_sites?.name || 'Unknown Site';
    if (!acc[siteName]) {
      acc[siteName] = { name: siteName, capacity: 0, used: 0 };
    }
    acc[siteName].capacity += capacity.max_capacity;
    acc[siteName].used += (capacity.max_capacity - capacity.available_spots);
    return acc;
  }, {} as Record<string, { name: string; capacity: number; used: number }>);

  const siteUtilizationData = Object.values(siteUtilization).map(site => ({
    ...site,
    available: site.capacity - site.used,
    utilization: site.capacity > 0 ? (site.used / site.capacity) * 100 : 0
  }));

  // Batch status distribution
  const batchStatusData = [
    { name: 'Draft', value: batches.filter(b => b.status === 'draft').length },
    { name: 'Active', value: batches.filter(b => b.status === 'active').length },
    { name: 'Completed', value: batches.filter(b => b.status === 'completed').length },
    { name: 'Archived', value: batches.filter(b => b.status === 'archived').length }
  ].filter(item => item.value > 0);

  // Recent activity
  const recentSessions = sessions.slice(0, 5).map(session => ({
    name: session.session_name,
    date: new Date(session.started_at).toLocaleDateString(),
    students: session.total_students,
    status: session.status
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Scheduling Analytics</h2>
        <p className="text-muted-foreground">
          Insights into scheduling performance and capacity utilization
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
            <p className="text-xs text-muted-foreground">
              {batches.filter(b => b.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {usedCapacity}/{totalCapacity} spots filled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Students</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduling Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Total sessions run
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Program Capacity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {programDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={programDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="used" fill="hsl(var(--primary))" name="Used" />
                  <Bar dataKey="available" fill="hsl(var(--muted))" name="Available" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No program data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Batch Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {batchStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={batchStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {batchStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No batch data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Site Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Site Utilization Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {siteUtilizationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={siteUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="used" fill="hsl(var(--primary))" name="Used" />
                <Bar dataKey="available" fill="hsl(var(--muted))" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No site utilization data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scheduling Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{session.name}</div>
                    <div className="text-sm text-muted-foreground">{session.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{session.students} students</span>
                    <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                      {session.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No scheduling sessions yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}