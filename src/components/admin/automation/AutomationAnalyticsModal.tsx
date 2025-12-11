import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, CheckCircle2, XCircle, Clock, TrendingUp,
  Download, RefreshCw
} from 'lucide-react';
import { HotSheetCard } from '@/components/hotsheet/HotSheetCard';
import { IconContainer } from '@/components/hotsheet/IconContainer';
import { PastelBadge } from '@/components/hotsheet/PastelBadge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AutomationService, type Automation, type AutomationAnalytics } from '@/services/automationService';
import { format } from 'date-fns';

interface AutomationAnalyticsModalProps {
  automation: Automation | null;
  open: boolean;
  onClose: () => void;
}

const COLORS = ['hsl(var(--primary))', 'hsl(142, 76%, 36%)', 'hsl(45, 93%, 47%)', 'hsl(0, 84%, 60%)'];

export function AutomationAnalyticsModal({ automation, open, onClose }: AutomationAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<AutomationAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (automation && open) {
      loadAnalytics();
    }
  }, [automation, open]);

  const loadAnalytics = async () => {
    if (!automation) return;
    setLoading(true);
    try {
      const data = await AutomationService.getAutomationAnalytics(automation.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!automation) return null;

  const pieData = analytics ? [
    { name: 'Active', value: analytics.activeEnrollments, color: 'hsl(var(--primary))' },
    { name: 'Completed', value: analytics.completedEnrollments, color: 'hsl(142, 76%, 36%)' },
    { name: 'Exited', value: analytics.exitedEnrollments, color: 'hsl(0, 84%, 60%)' },
  ].filter(d => d.value > 0) : [];

  const stepData = analytics ? Object.entries(analytics.stepDistribution).map(([step, count]) => ({
    step: `Step ${parseInt(step) + 1}`,
    count
  })) : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analytics: {automation.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <HotSheetCard padding="md" radius="xl">
                  <div className="flex items-center gap-3">
                    <IconContainer color="primary" size="md">
                      <Users className="h-4 w-4" />
                    </IconContainer>
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalEnrollments}</p>
                      <p className="text-xs text-muted-foreground">Total Enrolled</p>
                    </div>
                  </div>
                </HotSheetCard>

                <HotSheetCard padding="md" radius="xl">
                  <div className="flex items-center gap-3">
                    <IconContainer color="sky" size="md">
                      <Clock className="h-4 w-4" />
                    </IconContainer>
                    <div>
                      <p className="text-2xl font-bold">{analytics.activeEnrollments}</p>
                      <p className="text-xs text-muted-foreground">Active Now</p>
                    </div>
                  </div>
                </HotSheetCard>

                <HotSheetCard padding="md" radius="xl">
                  <div className="flex items-center gap-3">
                    <IconContainer color="emerald" size="md">
                      <CheckCircle2 className="h-4 w-4" />
                    </IconContainer>
                    <div>
                      <p className="text-2xl font-bold">{analytics.completedEnrollments}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </HotSheetCard>

                <HotSheetCard padding="md" radius="xl">
                  <div className="flex items-center gap-3">
                    <IconContainer color="amber" size="md">
                      <TrendingUp className="h-4 w-4" />
                    </IconContainer>
                    <div>
                      <p className="text-2xl font-bold">{analytics.completionRate}%</p>
                      <p className="text-xs text-muted-foreground">Completion Rate</p>
                    </div>
                  </div>
                </HotSheetCard>
              </div>

              {/* Charts */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="leads">Enrolled Leads</TabsTrigger>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Status Distribution */}
                    <HotSheetCard padding="lg" radius="xl">
                      <h4 className="font-semibold mb-4">Enrollment Status</h4>
                      {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                          No enrollment data yet
                        </div>
                      )}
                    </HotSheetCard>

                    {/* Step Distribution */}
                    <HotSheetCard padding="lg" radius="xl">
                      <h4 className="font-semibold mb-4">Active by Step</h4>
                      {stepData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={stepData}>
                            <XAxis dataKey="step" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                          No step distribution data
                        </div>
                      )}
                    </HotSheetCard>
                  </div>
                </TabsContent>

                <TabsContent value="leads" className="pt-4">
                  <HotSheetCard padding="lg" radius="xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Enrolled Leads</h4>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    {analytics.enrolledLeads.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {analytics.enrolledLeads.map((lead, index) => (
                          <div 
                            key={lead.id || index} 
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium">{lead.name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{lead.email || 'No email'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {lead.currentStep !== undefined && (
                                <span className="text-sm text-muted-foreground">
                                  Step {lead.currentStep + 1}
                                </span>
                              )}
                              <PastelBadge 
                                color={lead.status === 'active' ? 'emerald' : lead.status === 'completed' ? 'sky' : 'rose'}
                                size="sm"
                              >
                                {lead.status}
                              </PastelBadge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        No leads enrolled yet
                      </div>
                    )}
                  </HotSheetCard>
                </TabsContent>

                <TabsContent value="activity" className="pt-4">
                  <HotSheetCard padding="lg" radius="xl">
                    <h4 className="font-semibold mb-4">Recent Activity</h4>
                    {analytics.recentActivity.length > 0 ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {analytics.recentActivity.map((activity, index) => (
                          <div 
                            key={activity.id || index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              activity.status === 'completed' ? 'bg-emerald-500' :
                              activity.status === 'failed' ? 'bg-rose-500' : 'bg-amber-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {activity.step_type || activity.action_type || 'Step executed'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.created_at && format(new Date(activity.created_at), 'MMM dd, HH:mm')}
                              </p>
                            </div>
                            <PastelBadge 
                              color={activity.status === 'completed' ? 'emerald' : activity.status === 'failed' ? 'rose' : 'amber'}
                              size="sm"
                            >
                              {activity.status}
                            </PastelBadge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        No recent activity
                      </div>
                    )}
                  </HotSheetCard>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No analytics data available
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
