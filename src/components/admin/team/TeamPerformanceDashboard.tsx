import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target,
  Clock,
  Award,
  Activity,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from "recharts";

interface TeamPerformance {
  teamId: string;
  teamName: string;
  metrics: {
    productivity: number;
    efficiency: number;
    satisfaction: number;
    retention: number;
  };
  trends: {
    productivity: number;
    efficiency: number;
    satisfaction: number;
  };
  goals: {
    name: string;
    target: number;
    current: number;
    deadline: string;
  }[];
  members: {
    id: string;
    name: string;
    performance: number;
    workload: number;
    skills: string[];
  }[];
}

const TeamPerformanceDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const performanceData: TeamPerformance[] = [
    {
      teamId: 'admissions',
      teamName: 'Admissions Team',
      metrics: {
        productivity: 92,
        efficiency: 88,
        satisfaction: 91,
        retention: 96
      },
      trends: {
        productivity: 5.2,
        efficiency: 3.1,
        satisfaction: -1.2
      },
      goals: [
        { name: 'Q1 Enrollment Target', target: 500, current: 387, deadline: '2024-03-31' },
        { name: 'Response Time < 2hrs', target: 95, current: 89, deadline: '2024-02-29' },
        { name: 'Lead Conversion Rate', target: 25, current: 23.5, deadline: '2024-03-15' }
      ],
      members: [
        { id: '1', name: 'Nicole Adams', performance: 95, workload: 78, skills: ['lead_qualification', 'program_counseling'] },
        { id: '2', name: 'Robert Smith', performance: 88, workload: 65, skills: ['team_management', 'strategic_planning'] },
        { id: '3', name: 'John Parker', performance: 91, workload: 82, skills: ['document_review', 'student_support'] }
      ]
    },
    {
      teamId: 'finance',
      teamName: 'Finance Team',
      metrics: {
        productivity: 89,
        efficiency: 94,
        satisfaction: 87,
        retention: 98
      },
      trends: {
        productivity: 2.8,
        efficiency: 4.5,
        satisfaction: 1.9
      },
      goals: [
        { name: 'Payment Processing Automation', target: 90, current: 76, deadline: '2024-04-15' },
        { name: 'Financial Aid Approval Time', target: 3, current: 4.2, deadline: '2024-03-01' }
      ],
      members: [
        { id: '4', name: 'Sarah Kim', performance: 93, workload: 71, skills: ['financial_planning', 'compliance'] },
        { id: '5', name: 'Mike Chen', performance: 87, workload: 85, skills: ['accounting', 'reporting'] }
      ]
    }
  ];

  const weeklyProductivityData = [
    { week: 'W1', productivity: 85, efficiency: 82, satisfaction: 88 },
    { week: 'W2', productivity: 87, efficiency: 85, satisfaction: 89 },
    { week: 'W3', productivity: 89, efficiency: 87, satisfaction: 87 },
    { week: 'W4', productivity: 92, efficiency: 88, satisfaction: 91 }
  ];

  const workloadDistribution = [
    { name: 'Under 70%', value: 2, color: '#10b981' },
    { name: '70-85%', value: 8, color: '#f59e0b' },
    { name: 'Over 85%', value: 3, color: '#ef4444' }
  ];

  const skillsData = [
    { skill: 'Lead Qualification', proficiency: 92, demand: 'High' },
    { skill: 'Program Counseling', proficiency: 88, demand: 'High' },
    { skill: 'Document Review', proficiency: 85, demand: 'Medium' },
    { skill: 'Financial Planning', proficiency: 91, demand: 'Medium' },
    { skill: 'Team Management', proficiency: 78, demand: 'High' }
  ];

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const selectedTeamData = selectedTeam === 'all' 
    ? performanceData.reduce((acc, team) => ({
        metrics: {
          productivity: acc.metrics.productivity + team.metrics.productivity,
          efficiency: acc.metrics.efficiency + team.metrics.efficiency,
          satisfaction: acc.metrics.satisfaction + team.metrics.satisfaction,
          retention: acc.metrics.retention + team.metrics.retention
        },
        goals: [...acc.goals, ...team.goals],
        members: [...acc.members, ...team.members]
      }), { metrics: { productivity: 0, efficiency: 0, satisfaction: 0, retention: 0 }, goals: [], members: [] })
    : performanceData.find(team => team.teamId === selectedTeam);

  const avgMetrics = selectedTeam === 'all' && selectedTeamData ? {
    productivity: Math.round(selectedTeamData.metrics.productivity / performanceData.length),
    efficiency: Math.round(selectedTeamData.metrics.efficiency / performanceData.length),
    satisfaction: Math.round(selectedTeamData.metrics.satisfaction / performanceData.length),
    retention: Math.round(selectedTeamData.metrics.retention / performanceData.length)
  } : selectedTeamData?.metrics;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Performance Dashboard</h2>
          <p className="text-muted-foreground">Monitor team productivity, goals, and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('quarter')}
          >
            Quarter
          </Button>
        </div>
      </div>

      {/* Team Selector */}
      <div className="flex space-x-2">
        <Button
          variant={selectedTeam === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTeam('all')}
        >
          All Teams
        </Button>
        {performanceData.map(team => (
          <Button
            key={team.teamId}
            variant={selectedTeam === team.teamId ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTeam(team.teamId)}
          >
            {team.teamName}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Productivity", value: avgMetrics?.productivity || 0, icon: Activity, trend: 5.2 },
          { title: "Efficiency", value: avgMetrics?.efficiency || 0, icon: Target, trend: 3.1 },
          { title: "Satisfaction", value: avgMetrics?.satisfaction || 0, icon: Award, trend: -1.2 },
          { title: "Retention", value: avgMetrics?.retention || 0, icon: Users, trend: 0.8 }
        ].map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}%</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm ml-1 ${metric.trend > 0 ? 'text-green-600' : metric.trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {metric.trend > 0 ? '+' : ''}{metric.trend}%
                    </span>
                  </div>
                </div>
                <metric.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          <TabsTrigger value="workload">Workload Analysis</TabsTrigger>
          <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyProductivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="productivity" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="satisfaction" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Workload Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <RechartsPieChart data={workloadDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={120}>
                      {workloadDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {workloadDistribution.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedTeamData?.goals.map((goal, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">{goal.name}</h4>
                    <Badge variant={goal.current >= goal.target ? 'default' : 'secondary'}>
                      {Math.round((goal.current / goal.target) * 100)}%
                    </Badge>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="mb-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{goal.current} / {goal.target}</span>
                    <span>Due: {goal.deadline}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Member Workload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedTeamData?.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <div className="flex space-x-2 mt-1">
                          {member.skills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Performance: {member.performance}%</p>
                        <p className="text-sm text-muted-foreground">Workload: {member.workload}%</p>
                      </div>
                      <Progress value={member.workload} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsData.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{skill.skill}</h4>
                      <Badge variant={skill.demand === 'High' ? 'default' : 'secondary'}>
                        {skill.demand} Demand
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">{skill.proficiency}%</span>
                      <Progress value={skill.proficiency} className="w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamPerformanceDashboard;