import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Filter,
  Target,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface AnalyticsData {
  decisionOutcomes: { name: string; value: number; change: number }[];
  performanceComparison: { 
    configuration: string; 
    accuracy: number; 
    speed: number; 
    roi: number;
    decisions: number;
  }[];
  conversionFunnel: { stage: string; students: number; conversionRate: number }[];
  impactAnalysis: {
    totalDecisions: number;
    successfulOutcomes: number;
    avgConfidenceIncrease: number;
    estimatedROI: number;
    timesSaved: number;
  };
  biasMetrics: { category: string; score: number; threshold: number }[];
  monthlyTrends: { month: string; decisions: number; accuracy: number; satisfaction: number }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

export function AIAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('accuracy');

  const analyticsData: AnalyticsData = {
    decisionOutcomes: [
      { name: 'Enrollment Recommendations', value: 1247, change: 12.5 },
      { name: 'Priority Assignments', value: 892, change: -3.2 },
      { name: 'Follow-up Timing', value: 634, change: 8.7 },
      { name: 'Document Reviews', value: 423, change: 15.3 },
      { name: 'Risk Assessments', value: 298, change: 5.1 }
    ],
    performanceComparison: [
      { configuration: 'Current Model v3.2', accuracy: 87.5, speed: 1.2, roi: 340, decisions: 2847 },
      { configuration: 'Previous Model v3.1', accuracy: 82.1, speed: 1.8, roi: 285, decisions: 2156 },
      { configuration: 'Baseline Model v2.5', accuracy: 78.3, speed: 2.1, roi: 198, decisions: 1892 },
      { configuration: 'A/B Test Model', accuracy: 89.2, speed: 1.1, roi: 378, decisions: 856 }
    ],
    conversionFunnel: [
      { stage: 'Initial Contact', students: 10000, conversionRate: 100 },
      { stage: 'Information Provided', students: 7800, conversionRate: 78 },
      { stage: 'Application Started', students: 4680, conversionRate: 60 },
      { stage: 'Application Submitted', students: 3276, conversionRate: 70 },
      { stage: 'Enrolled', students: 1965, conversionRate: 60 }
    ],
    impactAnalysis: {
      totalDecisions: 8492,
      successfulOutcomes: 7428,
      avgConfidenceIncrease: 23.8,
      estimatedROI: 340000,
      timesSaved: 1247
    },
    biasMetrics: [
      { category: 'Geographic Bias', score: 92, threshold: 85 },
      { category: 'Age Group Bias', score: 88, threshold: 85 },
      { category: 'Program Type Bias', score: 94, threshold: 85 },
      { category: 'Socioeconomic Bias', score: 81, threshold: 85 },
      { category: 'Gender Bias', score: 96, threshold: 85 }
    ],
    monthlyTrends: [
      { month: 'Jan', decisions: 2100, accuracy: 82, satisfaction: 78 },
      { month: 'Feb', decisions: 2350, accuracy: 84, satisfaction: 81 },
      { month: 'Mar', decisions: 2800, accuracy: 86, satisfaction: 83 },
      { month: 'Apr', decisions: 3200, accuracy: 87, satisfaction: 85 },
      { month: 'May', decisions: 3150, accuracy: 88, satisfaction: 87 },
      { month: 'Jun', decisions: 3400, accuracy: 87, satisfaction: 89 }
    ]
  };

  const getBiasColor = (score: number, threshold: number) => {
    if (score >= threshold) return 'text-success';
    if (score >= threshold - 10) return 'text-warning';
    return 'text-destructive';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {analyticsData.impactAnalysis.totalDecisions.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Decisions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-success" />
              <div>
                <div className="text-2xl font-bold">
                  {analyticsData.impactAnalysis.successfulOutcomes.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Successful Outcomes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <div>
                <div className="text-2xl font-bold">
                  +{analyticsData.impactAnalysis.avgConfidenceIncrease}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence Increase</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(analyticsData.impactAnalysis.estimatedROI)}
                </div>
                <div className="text-sm text-muted-foreground">Estimated ROI</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {analyticsData.impactAnalysis.timesSaved}h
                </div>
                <div className="text-sm text-muted-foreground">Hours Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="outcomes">Decision Outcomes</TabsTrigger>
          <TabsTrigger value="bias">Bias Detection</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.performanceComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="configuration" fontSize={10} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="accuracy" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.conversionFunnel.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <span className="text-sm text-muted-foreground">
                          {stage.students.toLocaleString()} ({stage.conversionRate}%)
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${stage.conversionRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Decision Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.decisionOutcomes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.decisionOutcomes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Decision Outcomes with Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.decisionOutcomes.map((outcome) => (
                    <div key={outcome.name} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <div className="font-medium">{outcome.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {outcome.value.toLocaleString()} decisions
                        </div>
                      </div>
                      <Badge 
                        variant={outcome.change > 0 ? "default" : "destructive"}
                        className={outcome.change > 0 ? "bg-success/10 text-success border-success/20" : ""}
                      >
                        {outcome.change > 0 ? '+' : ''}{outcome.change.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fairness & Bias Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.biasMetrics.map((metric) => (
                  <div key={metric.category} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{metric.category}</span>
                      <span className={`font-bold ${getBiasColor(metric.score, metric.threshold)}`}>
                        {metric.score}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          metric.score >= metric.threshold ? 'bg-success' :
                          metric.score >= metric.threshold - 10 ? 'bg-warning' : 'bg-destructive'
                        }`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Threshold: {metric.threshold}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}