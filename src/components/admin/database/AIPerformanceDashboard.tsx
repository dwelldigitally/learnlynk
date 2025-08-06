import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Users,
  Bot,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  PieChart,
  LineChart,
  Brain
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  unit: string;
  description: string;
}

interface AgentPerformance {
  id: string;
  name: string;
  type: string;
  successRate: number;
  responseTime: number;
  costPerAction: number;
  actionsCount: number;
  uptime: number;
  errorRate: number;
  trend: 'up' | 'down' | 'stable';
}

const AIPerformanceDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedAgentType, setSelectedAgentType] = useState('all');

  const overallMetrics: PerformanceMetric[] = [
    {
      id: '1',
      name: 'Total AI Actions',
      value: 15247,
      change: 12.5,
      changeType: 'increase',
      unit: 'actions',
      description: 'Total actions executed by all AI agents'
    },
    {
      id: '2',
      name: 'Average Success Rate',
      value: 94.2,
      change: 2.1,
      changeType: 'increase',
      unit: '%',
      description: 'Success rate across all AI agents'
    },
    {
      id: '3',
      name: 'Total Cost',
      value: 1247.86,
      change: -8.3,
      changeType: 'decrease',
      unit: '$',
      description: 'Total AI operation costs'
    },
    {
      id: '4',
      name: 'Average Response Time',
      value: 1.2,
      change: -15.2,
      changeType: 'decrease',
      unit: 's',
      description: 'Average response time across all agents'
    },
    {
      id: '5',
      name: 'Cost per Conversion',
      value: 3.47,
      change: -12.1,
      changeType: 'decrease',
      unit: '$',
      description: 'Average cost per successful conversion'
    },
    {
      id: '6',
      name: 'System Uptime',
      value: 99.97,
      change: 0.1,
      changeType: 'increase',
      unit: '%',
      description: 'Overall AI system availability'
    }
  ];

  const agentPerformance: AgentPerformance[] = [
    {
      id: '1',
      name: 'Conversation AI Agent',
      type: 'communication',
      successRate: 96.2,
      responseTime: 0.85,
      costPerAction: 0.03,
      actionsCount: 2847,
      uptime: 99.9,
      errorRate: 0.8,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Predictive Analytics Agent',
      type: 'analysis',
      successRate: 94.7,
      responseTime: 1.2,
      costPerAction: 0.15,
      actionsCount: 1205,
      uptime: 99.8,
      errorRate: 1.2,
      trend: 'stable'
    },
    {
      id: '3',
      name: 'Content Generation Agent',
      type: 'automation',
      successRate: 89.3,
      responseTime: 2.1,
      costPerAction: 0.08,
      actionsCount: 856,
      uptime: 98.5,
      errorRate: 2.3,
      trend: 'down'
    },
    {
      id: '4',
      name: 'Quality Assurance Agent',
      type: 'intelligence',
      successRate: 98.1,
      responseTime: 0.65,
      costPerAction: 0.05,
      actionsCount: 423,
      uptime: 99.95,
      errorRate: 0.3,
      trend: 'up'
    }
  ];

  const timeRanges = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const agentTypes = [
    { value: 'all', label: 'All Agents' },
    { value: 'communication', label: 'Communication' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'automation', label: 'Automation' },
    { value: 'intelligence', label: 'Intelligence' }
  ];

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') return `$${value.toFixed(2)}`;
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 's') return `${value.toFixed(2)}s`;
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">AI Performance Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into AI agent performance and cost optimization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedAgentType} onValueChange={setSelectedAgentType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {overallMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  {getChangeIcon(metric.changeType)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatValue(metric.value, metric.unit)}
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`${
                      metric.changeType === 'increase' ? 'text-green-600' : 
                      metric.changeType === 'decrease' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground ml-1">vs last period</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Success rate and response time over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Performance trends chart</p>
                  <p className="text-sm">Success rate and response time visualization</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
                <CardDescription>Cost breakdown by agent type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Cost distribution chart</p>
                  <p className="text-sm">Spending breakdown by agent category</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">High Performance Agents</h4>
                    <p className="text-sm text-muted-foreground">Quality Assurance and Conversation AI agents are exceeding targets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Optimization Opportunity</h4>
                    <p className="text-sm text-muted-foreground">Content Generation Agent has higher error rate - consider retraining</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Cost Optimization</h4>
                    <p className="text-sm text-muted-foreground">12% cost reduction achieved through model optimization this month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid gap-4">
            {agentPerformance.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.type}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(agent.trend)}
                      <Badge variant="outline">{agent.trend}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Success Rate</Label>
                      <p className="text-sm font-medium">{agent.successRate}%</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Response Time</Label>
                      <p className="text-sm font-medium">{agent.responseTime}s</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Cost/Action</Label>
                      <p className="text-sm font-medium">${agent.costPerAction}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Actions</Label>
                      <p className="text-sm font-medium">{agent.actionsCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Uptime</Label>
                      <p className="text-sm font-medium">{agent.uptime}%</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Error Rate</Label>
                      <p className="text-sm font-medium">{agent.errorRate}%</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Detailed Analytics
                    </Button>
                    <Button size="sm" variant="outline">
                      <Target className="h-3 w-3 mr-1" />
                      Optimize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Detailed cost analysis by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Cost breakdown visualization</p>
                  <p className="text-sm">Model usage, API calls, and infrastructure costs</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization</CardTitle>
                <CardDescription>Recommendations to reduce costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Cost optimization insights</p>
                  <p className="text-sm">Model efficiency and usage optimization recommendations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Metrics</CardTitle>
              <CardDescription>AI agent efficiency and productivity analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <Zap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Efficiency metrics dashboard</p>
                <p className="text-sm">Productivity, automation rates, and time savings</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Historical performance and trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Performance trends analysis</p>
                <p className="text-sm">Long-term performance patterns and predictions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to improve performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>AI optimization recommendations</p>
                <p className="text-sm">Intelligent suggestions for performance improvement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPerformanceDashboard;