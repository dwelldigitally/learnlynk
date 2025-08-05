import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WorkflowMetrics {
  totalLeads: number;
  conversionRate: number;
  averageResponseTime: number;
  averageConversionTime: number;
  activeAutomations: number;
  teamUtilization: number;
}

interface ConversionFunnel {
  stage: string;
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

export function WorkflowAnalytics() {
  const [metrics, setMetrics] = useState<WorkflowMetrics>({
    totalLeads: 0,
    conversionRate: 0,
    averageResponseTime: 0,
    averageConversionTime: 0,
    activeAutomations: 0,
    teamUtilization: 0
  });

  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadWorkflowMetrics(),
        loadConversionFunnel()
      ]);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkflowMetrics = async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Get leads data
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', thirtyDaysAgo);

    // Get students data for conversion rate (using students table as proxy)
    const { data: students } = await supabase
      .from('students')
      .select('*')
      .gte('created_at', thirtyDaysAgo);

    // Get team capacity data
    const { data: teamData } = await supabase
      .from('advisor_performance')
      .select('*')
      .eq('is_available', true);

    if (leads) {
      const totalLeads = leads.length;
      const convertedLeads = students?.length || 0;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Calculate average response time
      const responseableLeads = leads.filter(lead => 
        lead.created_at && lead.last_contacted_at
      );
      
      const totalResponseTime = responseableLeads.reduce((sum, lead) => {
        const responseTime = new Date(lead.last_contacted_at).getTime() - 
                            new Date(lead.created_at).getTime();
        return sum + (responseTime / (1000 * 60 * 60)); // Convert to hours
      }, 0);

      const averageResponseTime = responseableLeads.length > 0 ? 
        totalResponseTime / responseableLeads.length : 0;

      // Calculate team utilization
      const totalCapacity = teamData?.reduce((sum, advisor) => 
        sum + (advisor.max_daily_assignments || 10), 0) || 0;
      
      const currentLoad = leads.filter(lead => 
        lead.assigned_to && ['new', 'contacted', 'qualified'].includes(lead.status)
      ).length;

      const teamUtilization = totalCapacity > 0 ? (currentLoad / totalCapacity) * 100 : 0;

      setMetrics({
        totalLeads,
        conversionRate,
        averageResponseTime,
        averageConversionTime: 14, // Placeholder
        activeAutomations: 3, // Placeholder
        teamUtilization
      });
    }
  };

  const loadConversionFunnel = async () => {
    const { data: leads } = await supabase
      .from('leads')
      .select('status');

    if (leads) {
      const statusCounts = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const stages = [
        { key: 'new', label: 'New Leads' },
        { key: 'contacted', label: 'Contacted' },
        { key: 'qualified', label: 'Qualified' },
        { key: 'nurturing', label: 'Nurturing' },
        { key: 'converted', label: 'Converted' }
      ];

      const totalLeads = leads.length;
      let previousCount = totalLeads;

      const funnelData = stages.map((stage, index) => {
        const count = statusCounts[stage.key] || 0;
        const conversionRate = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
        const dropOffRate = index > 0 ? 
          ((previousCount - count) / previousCount) * 100 : 0;
        
        previousCount = count;
        
        return {
          stage: stage.label,
          count,
          conversionRate,
          dropOffRate
        };
      });

      setConversionFunnel(funnelData);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Workflow Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Performance insights and optimization opportunities
          </p>
        </div>
        <Button onClick={loadAnalytics} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Leads (30d)</p>
              <p className="text-2xl font-bold text-foreground">{metrics.totalLeads}</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">{metrics.conversionRate.toFixed(1)}%</p>
              <div className="flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+2.3% from target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold text-foreground">{metrics.averageResponseTime.toFixed(1)}h</p>
              <div className="flex items-center text-xs">
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                <span className="text-red-600">Target: 2h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Team Utilization</p>
              <p className="text-2xl font-bold text-foreground">{metrics.teamUtilization.toFixed(0)}%</p>
              <Progress value={metrics.teamUtilization} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-teal-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Active Automations</p>
              <p className="text-2xl font-bold text-foreground">{metrics.activeAutomations}</p>
              <p className="text-xs text-muted-foreground">4 total configured</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Activity className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Time to Convert</p>
              <p className="text-2xl font-bold text-foreground">{metrics.averageConversionTime}d</p>
              <p className="text-xs text-green-600">2d faster than target</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Lead Conversion Funnel
              </CardTitle>
              <CardDescription>
                Track leads through each stage of the workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{stage.stage}</h4>
                        <p className="text-sm text-muted-foreground">{stage.count} leads</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="secondary">
                        {stage.conversionRate.toFixed(1)}% of total
                      </Badge>
                      {index > 0 && stage.dropOffRate > 0 && (
                        <p className="text-xs text-red-600">
                          {stage.dropOffRate.toFixed(1)}% drop-off
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Advisors</CardTitle>
                <CardDescription>Last 30 days performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Johnson", conversion: 87, leads: 24 },
                    { name: "Mike Chen", conversion: 82, leads: 31 },
                    { name: "Emily Davis", conversion: 79, leads: 18 }
                  ].map((advisor) => (
                    <div key={advisor.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{advisor.name}</p>
                        <p className="text-sm text-muted-foreground">{advisor.leads} leads</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {advisor.conversion}% conversion
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average first response by team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { team: "Sales Team A", time: 1.2, trend: "up" },
                    { team: "Sales Team B", time: 2.8, trend: "down" },
                    { team: "Sales Team C", time: 1.9, trend: "up" }
                  ].map((team) => (
                    <div key={team.team} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{team.team}</p>
                        <p className="text-sm text-muted-foreground">{team.time}h avg</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {team.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Optimization Opportunities
              </CardTitle>
              <CardDescription>
                AI-identified improvements for your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">High Response Time Alert</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Average response time is 3.2x higher than target. Consider implementing auto-assignment.
                      </p>
                      <Badge className="bg-orange-100 text-orange-800">
                        Potential +35% conversion improvement
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Lead Scoring Optimization</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Enable AI-powered lead scoring to prioritize high-potential prospects.
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">
                        Potential +20% efficiency improvement
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Automation Opportunity</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Set up follow-up sequences for leads that haven't responded in 3+ days.
                      </p>
                      <Badge className="bg-green-100 text-green-800">
                        Potential +15% re-engagement rate
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}