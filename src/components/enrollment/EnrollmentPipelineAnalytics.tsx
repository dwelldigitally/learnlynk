import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Users, Target, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';

interface PipelineStageData {
  stage: string;
  count: number;
  percentage: number;
  conversionRate: number;
  averageTime: number; // days
}

interface ConversionTrendData {
  date: string;
  inquiries: number;
  applications: number;
  enrollments: number;
  conversionRate: number;
}

export function EnrollmentPipelineAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [pipelineData, setPipelineData] = useState<PipelineStageData[]>([]);
  const [trendData, setTrendData] = useState<ConversionTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipelineData();
    loadTrendData();
  }, [selectedPeriod]);

  const loadPipelineData = async () => {
    try {
      // Mock pipeline data - in real implementation this would come from database
      const mockPipelineData: PipelineStageData[] = [
        {
          stage: 'Inquiry',
          count: 1250,
          percentage: 100,
          conversionRate: 45.6,
          averageTime: 2
        },
        {
          stage: 'Application Started',
          count: 570,
          percentage: 45.6,
          conversionRate: 67.2,
          averageTime: 5
        },
        {
          stage: 'Application Submitted',
          count: 383,
          percentage: 30.6,
          conversionRate: 78.3,
          averageTime: 8
        },
        {
          stage: 'Admitted',
          count: 300,
          percentage: 24,
          conversionRate: 85.7,
          averageTime: 12
        },
        {
          stage: 'Enrolled',
          count: 257,
          percentage: 20.6,
          conversionRate: 100,
          averageTime: 0
        }
      ];

      setPipelineData(mockPipelineData);
    } catch (error) {
      console.error('Error loading pipeline data:', error);
    }
  };

  const loadTrendData = async () => {
    try {
      // Mock trend data - in real implementation this would come from database
      const dates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const mockTrendData: ConversionTrendData[] = dates.map(date => ({
        date,
        inquiries: Math.floor(Math.random() * 50) + 30,
        applications: Math.floor(Math.random() * 25) + 15,
        enrollments: Math.floor(Math.random() * 15) + 8,
        conversionRate: Math.random() * 10 + 15
      }));

      setTrendData(mockTrendData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trend data:', error);
      setLoading(false);
    }
  };

  const formatFunnelData = () => {
    return pipelineData.map((stage, index) => ({
      value: stage.count,
      name: stage.stage,
      fill: `hsl(${220 + index * 20}, 70%, ${60 - index * 5}%)`
    }));
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <span className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalInquiries = pipelineData[0]?.count || 0;
  const totalEnrollments = pipelineData[pipelineData.length - 1]?.count || 0;
  const overallConversionRate = totalInquiries > 0 ? (totalEnrollments / totalInquiries) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline Analytics</h1>
          <p className="text-muted-foreground">
            Enrollment funnel analysis and conversion tracking
          </p>
        </div>
        
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inquiries</p>
                <p className="text-2xl font-bold text-foreground">{totalInquiries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                <p className="text-2xl font-bold text-foreground">{totalEnrollments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">{overallConversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Time to Enroll</p>
                <p className="text-2xl font-bold text-foreground">27 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="value"
                    data={formatFunnelData()}
                    isAnimationActive
                  >
                    <LabelList position="center" fill="#fff" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value as string).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inquiries" 
                    stroke="hsl(220, 70%, 60%)" 
                    strokeWidth={2}
                    name="Inquiries"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="hsl(240, 70%, 55%)" 
                    strokeWidth={2}
                    name="Applications"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="enrollments" 
                    stroke="hsl(260, 70%, 50%)" 
                    strokeWidth={2}
                    name="Enrollments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stage Details */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => {
              const previousStage = pipelineData[index - 1];
              const dropOffRate = previousStage ? 
                ((previousStage.count - stage.count) / previousStage.count) * 100 : 0;
              
              return (
                <div key={stage.stage} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{stage.stage}</h4>
                      <p className="text-sm text-muted-foreground">
                        Avg. {stage.averageTime} days
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{stage.count}</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">{stage.percentage.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">of Total</p>
                    </div>
                    
                    {index > 0 && (
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(stage.conversionRate, 50)}
                          <span className={`text-lg font-semibold ${
                            dropOffRate > 30 ? 'text-red-600' : 
                            dropOffRate > 15 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {stage.conversionRate.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Conversion</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}