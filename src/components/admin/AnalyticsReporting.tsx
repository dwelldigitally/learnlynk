import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  GraduationCap,
  DollarSign,
  Calendar,
  FileText,
  MessageSquare,
  Download,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useConditionalAnalytics } from '@/hooks/useConditionalAnalytics';
import { ConditionalDataWrapper } from './ConditionalDataWrapper';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageHeader } from '@/components/modern/PageHeader';
import { GlassCard } from '@/components/modern/GlassCard';
import { ModernCard } from '@/components/modern/ModernCard';

const AnalyticsReporting: React.FC = () => {
  const isMobile = useIsMobile();
  const { data: analyticsDataArray, isLoading, showEmptyState, hasDemoAccess, hasRealData } = useConditionalAnalytics();
  const kpis = [
    { 
      title: "Lead Conversion Rate", 
      value: "23.5%", 
      change: "+2.1%", 
      trend: "up",
      description: "Applications to enrollments"
    },
    { 
      title: "Avg. Processing Time", 
      value: "12.5 days", 
      change: "-1.2 days", 
      trend: "down",
      description: "Application to acceptance"
    },
    { 
      title: "Document Approval Rate", 
      value: "89.2%", 
      change: "+1.8%", 
      trend: "up",
      description: "First submission approval"
    },
    { 
      title: "Revenue per Student", 
      value: "$18,450", 
      change: "+$850", 
      trend: "up",
      description: "Average tuition collected"
    }
  ];

  const programMetrics = [
    {
      program: "Health Care Assistant",
      applications: 245,
      enrollments: 68,
      conversionRate: 27.8,
      revenue: 1245000,
      capacity: 280,
      fillRate: 87.5
    },
    {
      program: "Early Childhood Education", 
      applications: 189,
      enrollments: 45,
      conversionRate: 23.8,
      revenue: 832500,
      capacity: 180,
      fillRate: 86.7
    },
    {
      program: "Aviation Maintenance",
      applications: 134,
      enrollments: 28,
      conversionRate: 20.9,
      revenue: 686000,
      capacity: 120,
      fillRate: 74.2
    },
    {
      program: "Education Assistant",
      applications: 98,
      enrollments: 22,
      conversionRate: 22.4,
      revenue: 341000,
      capacity: 80,
      fillRate: 83.8
    }
  ];

  const leadSources = [
    { source: "Website", leads: 245, conversion: 25.3, cost: 85 },
    { source: "Social Media", leads: 189, conversion: 18.7, cost: 92 },
    { source: "Referrals", leads: 156, conversion: 32.1, cost: 45 },
    { source: "Info Sessions", leads: 134, conversion: 41.2, cost: 120 },
    { source: "Google Ads", leads: 98, conversion: 22.4, cost: 125 }
  ];

  return (
    <ConditionalDataWrapper
      isLoading={isLoading}
      showEmptyState={showEmptyState}
      hasDemoAccess={hasDemoAccess}
      hasRealData={hasRealData}
      emptyTitle="No Analytics Data"
      emptyDescription="Analytics will appear here once you have student data and activities."
      loadingRows={3}
    >
    <div className="p-9 space-y-8">
      {/* Header */}
      <PageHeader
        title="Analytics & Reporting"
        subtitle="Track performance and generate insights"
        action={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Custom Report
            </Button>
          </div>
        }
      />

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <GlassCard key={index} hover>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                    {kpi.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{kpi.description}</span>
                </div>
              </div>
            </CardContent>
          </GlassCard>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Program Performance</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Funnel */}
            <ModernCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Enrollment Funnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { stage: "Website Visitors", count: 15420, percentage: 100 },
                  { stage: "Lead Forms", count: 1854, percentage: 12 },
                  { stage: "Applications", count: 666, percentage: 36 },
                  { stage: "Document Submission", count: 524, percentage: 79 },
                  { stage: "Approved", count: 356, percentage: 68 },
                  { stage: "Enrolled", count: 163, percentage: 46 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.stage}</span>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">{item.count}</span>
                        <span className="ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </ModernCard>

            {/* Monthly Trends */}
            <ModernCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">1,247</p>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">163</p>
                      <p className="text-sm text-muted-foreground">Enrollments</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">13.1%</p>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Chart visualization would appear here showing monthly trends
                    </p>
                  </div>
                </div>
              </CardContent>
            </ModernCard>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Active Applications", value: "89", color: "text-blue-600" },
              { icon: FileText, label: "Documents Pending", value: "45", color: "text-orange-600" },
              { icon: MessageSquare, label: "Unread Messages", value: "23", color: "text-red-600" },
              { icon: Calendar, label: "Events This Month", value: "8", color: "text-green-600" }
            ].map((stat, index) => (
              <GlassCard key={index} hover>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    <div>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <ModernCard>
            <CardHeader>
              <CardTitle>Program Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {programMetrics.map((program, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">{program.program}</h3>
                      <Badge variant="outline">{program.conversionRate}% conversion</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="text-xl font-bold">{program.applications}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Enrollments</p>
                        <p className="text-xl font-bold text-green-600">{program.enrollments}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-bold">${(program.revenue / 1000)}k</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="text-xl font-bold">{program.capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fill Rate</p>
                        <p className="text-xl font-bold">{program.fillRate}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Capacity Utilization</span>
                        <span>{program.fillRate}%</span>
                      </div>
                      <Progress value={program.fillRate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </ModernCard>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <ModernCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Lead Source Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{source.source}</h4>
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span>{source.leads} leads</span>
                          <span>{source.conversion}% conversion</span>
                          <span>${source.cost} cost per lead</span>
                        </div>
                      </div>
                      <Progress value={source.conversion} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </ModernCard>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">$2.45M</p>
                    <p className="text-sm text-muted-foreground">Total Revenue YTD</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold">$156K</p>
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">94.3%</p>
                      <p className="text-sm text-muted-foreground">Collection Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ModernCard>

            <ModernCard>
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Average Payment Time</p>
                    <p className="text-2xl font-bold">8.5 days</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>On-time Payments</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </ModernCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </ConditionalDataWrapper>
  );
};

export default AnalyticsReporting;