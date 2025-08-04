import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, Clock, DollarSign, Download, Filter } from 'lucide-react';

interface AnalyticsData {
  conversionFunnel: Array<{
    stage: string;
    count: number;
    rate: number;
  }>;
  sourcePerformance: Array<{
    source: string;
    leads: number;
    converted: number;
    rate: number;
    cost: number;
    roi: number;
  }>;
  timelineData: Array<{
    date: string;
    leads: number;
    qualified: number;
    converted: number;
  }>;
  advisorPerformance: Array<{
    name: string;
    assigned: number;
    contacted: number;
    converted: number;
    responseTime: number;
    conversionRate: number;
  }>;
  programInterest: Array<{
    program: string;
    leads: number;
    percentage: number;
  }>;
  demographics: {
    countries: Array<{ name: string; count: number; percentage: number }>;
    sources: Array<{ name: string; count: number; color: string }>;
  };
}

export function LeadAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock analytics data - in real app, fetch from API
    setTimeout(() => {
      setAnalyticsData({
        conversionFunnel: [
          { stage: 'Leads Generated', count: 1247, rate: 100 },
          { stage: 'Contacted', count: 892, rate: 71.5 },
          { stage: 'Qualified', count: 456, rate: 36.6 },
          { stage: 'Nurturing', count: 234, rate: 18.8 },
          { stage: 'Converted', count: 89, rate: 7.1 }
        ],
        sourcePerformance: [
          { source: 'Web', leads: 543, converted: 45, rate: 8.3, cost: 2840, roi: 185 },
          { source: 'Social Media', leads: 324, converted: 21, rate: 6.5, cost: 1680, roi: 142 },
          { source: 'Referral', leads: 189, converted: 18, rate: 9.5, cost: 420, roi: 389 },
          { source: 'Events', leads: 134, converted: 5, rate: 3.7, cost: 890, roi: 67 },
          { source: 'Email', leads: 57, converted: 0, rate: 0, cost: 240, roi: -100 }
        ],
        timelineData: [
          { date: '2024-01-01', leads: 42, qualified: 18, converted: 3 },
          { date: '2024-01-02', leads: 38, qualified: 15, converted: 2 },
          { date: '2024-01-03', leads: 51, qualified: 22, converted: 4 },
          { date: '2024-01-04', leads: 45, qualified: 19, converted: 3 },
          { date: '2024-01-05', leads: 48, qualified: 21, converted: 4 },
          { date: '2024-01-06', leads: 36, qualified: 14, converted: 2 },
          { date: '2024-01-07', leads: 44, qualified: 17, converted: 3 }
        ],
        advisorPerformance: [
          { name: 'Nicole Ye', assigned: 89, contacted: 82, converted: 12, responseTime: 2.4, conversionRate: 13.5 },
          { name: 'Sarah Johnson', assigned: 76, contacted: 68, converted: 8, responseTime: 3.1, conversionRate: 10.5 },
          { name: 'Mike Chen', assigned: 65, contacted: 54, converted: 6, responseTime: 4.2, conversionRate: 9.2 },
          { name: 'Emma Wilson', assigned: 58, contacted: 49, converted: 4, responseTime: 3.8, conversionRate: 6.9 }
        ],
        programInterest: [
          { program: 'Health Care Assistant', leads: 456, percentage: 36.6 },
          { program: 'Aviation', leads: 289, percentage: 23.2 },
          { program: 'Education Assistant', leads: 234, percentage: 18.8 },
          { program: 'Hospitality', leads: 156, percentage: 12.5 },
          { program: 'ECE', leads: 89, percentage: 7.1 },
          { program: 'MLA', leads: 23, percentage: 1.8 }
        ],
        demographics: {
          countries: [
            { name: 'Canada', count: 687, percentage: 55.1 },
            { name: 'United States', count: 298, percentage: 23.9 },
            { name: 'United Kingdom', count: 134, percentage: 10.7 },
            { name: 'Australia', count: 89, percentage: 7.1 },
            { name: 'Other', count: 39, percentage: 3.1 }
          ],
          sources: [
            { name: 'Web', count: 543, color: '#3b82f6' },
            { name: 'Social Media', count: 324, color: '#10b981' },
            { name: 'Referral', count: 189, color: '#f59e0b' },
            { name: 'Events', count: 134, color: '#8b5cf6' },
            { name: 'Email', count: 57, color: '#ef4444' }
          ]
        }
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const exportData = () => {
    // In real app, generate and download CSV/Excel file
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Source,Leads,Converted,Conversion Rate\n' +
      analyticsData?.sourcePerformance.map(item => 
        `${item.source},${item.leads},${item.converted},${item.rate}%`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent || '');
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'lead_analytics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Analytics</h1>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const conversionRate = analyticsData.conversionFunnel[0].count > 0 
    ? ((analyticsData.conversionFunnel[4].count / analyticsData.conversionFunnel[0].count) * 100).toFixed(1)
    : '0';

  const totalLeads = analyticsData.conversionFunnel[0].count;
  const totalConverted = analyticsData.conversionFunnel[4].count;
  const avgResponseTime = analyticsData.advisorPerformance.reduce((sum, advisor) => sum + advisor.responseTime, 0) / analyticsData.advisorPerformance.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your lead generation and conversion performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +0.8% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime.toFixed(1)}h</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -15min from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$127K</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +23% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Source Performance</TabsTrigger>
          <TabsTrigger value="advisors">Advisor Performance</TabsTrigger>
          <TabsTrigger value="programs">Program Interest</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.conversionFunnel.map((stage, index) => (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <span className="text-sm text-muted-foreground">
                          {stage.count} ({stage.rate.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stage.rate}%` }}
                        ></div>
                      </div>
                      {index < analyticsData.conversionFunnel.length - 1 && (
                        <div className="flex justify-center mt-2">
                          <div className="w-0.5 h-4 bg-muted"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="qualified"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="converted"
                      stackId="3"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Source Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.sourcePerformance.map((source) => (
                    <div key={source.source} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{source.source}</span>
                        <Badge variant={source.rate > 8 ? 'default' : source.rate > 5 ? 'secondary' : 'outline'}>
                          {source.rate.toFixed(1)}% conversion
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Leads</div>
                          <div className="font-medium">{source.leads}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Converted</div>
                          <div className="font-medium">{source.converted}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">ROI</div>
                          <div className={`font-medium ${source.roi > 100 ? 'text-green-600' : 'text-red-600'}`}>
                            {source.roi > 0 ? '+' : ''}{source.roi}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Source Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Source Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.demographics.sources}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {analyticsData.demographics.sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advisors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advisor Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.advisorPerformance.map((advisor) => (
                  <div key={advisor.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{advisor.name}</span>
                      <Badge variant={advisor.conversionRate > 10 ? 'default' : 'secondary'}>
                        {advisor.conversionRate.toFixed(1)}% conversion
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Assigned</div>
                        <div className="font-medium">{advisor.assigned}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Contacted</div>
                        <div className="font-medium">{advisor.contacted}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Converted</div>
                        <div className="font-medium text-green-600">{advisor.converted}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Response Time</div>
                        <div className="font-medium">{advisor.responseTime.toFixed(1)}h</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Program Interest Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Program Interest Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.programInterest}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="program" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.demographics.countries.map((country) => (
                    <div key={country.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{country.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${country.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-12">
                          {country.percentage.toFixed(1)}%
                        </span>
                        <span className="text-sm font-medium w-12">{country.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}