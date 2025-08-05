import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Target,
  Clock,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AIAnalyticsData {
  overview: {
    totalFeatureUsage: number;
    activeFeatures: number;
    conversionImpact: number;
    efficiencyGain: number;
    costSavings: number;
  };
  featurePerformance: Array<{
    feature: string;
    usage: number;
    impact: number;
    roi: number;
    status: 'excellent' | 'good' | 'average' | 'poor';
  }>;
  conversionTrends: Array<{
    date: string;
    withAI: number;
    withoutAI: number;
  }>;
  automationMetrics: Array<{
    metric: string;
    value: number;
    change: number;
    target: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    score_predictions: number;
    auto_followups: number;
    document_processing: number;
    meeting_scheduling: number;
  }>;
}

export function AIAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AIAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate loading analytics data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData({
        overview: {
          totalFeatureUsage: 2847,
          activeFeatures: 6,
          conversionImpact: 23.4,
          efficiencyGain: 37.8,
          costSavings: 12500
        },
        featurePerformance: [
          { feature: 'AI Scoring', usage: 95, impact: 89, roi: 340, status: 'excellent' },
          { feature: 'Auto Follow-ups', usage: 87, impact: 76, roi: 280, status: 'good' },
          { feature: 'Document Processing', usage: 72, impact: 82, roi: 220, status: 'good' },
          { feature: 'Smart Scheduling', usage: 45, impact: 65, roi: 150, status: 'average' },
          { feature: 'Conversion Prediction', usage: 91, impact: 78, roi: 190, status: 'good' },
          { feature: 'Workflow Optimization', usage: 34, impact: 58, roi: 120, status: 'poor' }
        ],
        conversionTrends: [
          { date: '2024-01-01', withAI: 28, withoutAI: 22 },
          { date: '2024-01-02', withAI: 32, withoutAI: 24 },
          { date: '2024-01-03', withAI: 29, withoutAI: 21 },
          { date: '2024-01-04', withAI: 35, withoutAI: 26 },
          { date: '2024-01-05', withAI: 31, withoutAI: 23 },
          { date: '2024-01-06', withAI: 38, withoutAI: 27 },
          { date: '2024-01-07', withAI: 36, withoutAI: 25 }
        ],
        automationMetrics: [
          { metric: 'Response Time', value: 2.4, change: -15.2, target: 2.0 },
          { metric: 'Follow-up Rate', value: 89, change: 12.3, target: 85 },
          { metric: 'Document Processing', value: 94, change: 8.7, target: 90 },
          { metric: 'Lead Scoring Accuracy', value: 87, change: 5.4, target: 85 }
        ],
        timeSeriesData: [
          { date: '2024-01-01', score_predictions: 45, auto_followups: 32, document_processing: 28, meeting_scheduling: 15 },
          { date: '2024-01-02', score_predictions: 52, auto_followups: 38, document_processing: 31, meeting_scheduling: 18 },
          { date: '2024-01-03', score_predictions: 48, auto_followups: 35, document_processing: 29, meeting_scheduling: 16 },
          { date: '2024-01-04', score_predictions: 58, auto_followups: 42, document_processing: 35, meeting_scheduling: 22 },
          { date: '2024-01-05', score_predictions: 55, auto_followups: 39, document_processing: 33, meeting_scheduling: 20 },
          { date: '2024-01-06', score_predictions: 61, auto_followups: 45, document_processing: 38, meeting_scheduling: 25 },
          { date: '2024-01-07', score_predictions: 59, auto_followups: 43, document_processing: 36, meeting_scheduling: 23 }
        ]
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'average': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor AI feature performance and impact</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Feature Performance</TabsTrigger>
          <TabsTrigger value="automation">Automation Metrics</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.totalFeatureUsage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">AI feature interactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Features</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overview.activeFeatures}</div>
                <p className="text-xs text-muted-foreground">out of 6 features</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Impact</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+{analyticsData.overview.conversionImpact}%</div>
                <p className="text-xs text-muted-foreground">improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Efficiency Gain</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">+{analyticsData.overview.efficiencyGain}%</div>
                <p className="text-xs text-muted-foreground">time saved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(analyticsData.overview.costSavings)}</div>
                <p className="text-xs text-muted-foreground">this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Trends */}
          <Card>
            <CardHeader>
              <CardTitle>AI Feature Usage Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="score_predictions" stackId="1" stroke="#8884d8" fill="#8884d8" name="Score Predictions" />
                  <Area type="monotone" dataKey="auto_followups" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Auto Follow-ups" />
                  <Area type="monotone" dataKey="document_processing" stackId="1" stroke="#ffc658" fill="#ffc658" name="Document Processing" />
                  <Area type="monotone" dataKey="meeting_scheduling" stackId="1" stroke="#ff7c7c" fill="#ff7c7c" name="Meeting Scheduling" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Feature Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.featurePerformance.map((feature, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{feature.feature}</CardTitle>
                    <Badge className={getStatusColor(feature.status)} variant="secondary">
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{feature.usage}%</span>
                    </div>
                    <Progress value={feature.usage} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Impact</span>
                      <span>{feature.impact}%</span>
                    </div>
                    <Progress value={feature.impact} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">ROI</span>
                    <span className="font-medium text-green-600">{feature.roi}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          {/* Automation Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.automationMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{metric.value}
                        {metric.metric.includes('Time') ? 'h' : '%'}
                      </span>
                      <div className={`flex items-center text-sm ${
                        metric.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change > 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(metric.change)}%
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Target: {metric.target}{metric.metric.includes('Time') ? 'h' : '%'}</span>
                        <span>{metric.value >= metric.target ? 'On track' : 'Below target'}</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          {/* Conversion Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate: AI vs Non-AI Leads</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comparison of conversion rates for leads processed with and without AI features
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.conversionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="withAI" fill="#8884d8" name="With AI" />
                  <Bar dataKey="withoutAI" fill="#82ca9d" name="Without AI" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Impact Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Average Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">With AI</span>
                    <span className="font-bold text-green-600">32.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Without AI</span>
                    <span className="font-bold">24.0%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Improvement</span>
                      <span className="font-bold text-green-600">+36.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Time to Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">With AI</span>
                    <span className="font-bold text-blue-600">5.2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Without AI</span>
                    <span className="font-bold">8.7 days</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Faster by</span>
                      <span className="font-bold text-blue-600">40.2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Cost per Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">With AI</span>
                    <span className="font-bold text-green-600">$127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Without AI</span>
                    <span className="font-bold">$189</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Savings</span>
                      <span className="font-bold text-green-600">$62</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}