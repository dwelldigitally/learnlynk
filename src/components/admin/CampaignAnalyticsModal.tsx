import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CampaignAnalyticsService } from '@/services/campaignAnalyticsService';
import { Campaign } from '@/services/campaignService';
import { format } from 'date-fns';
import { 
  BarChart3, 
  Activity, 
  Users, 
  Play, 
  Pause, 
  Eye, 
  Edit, 
  CheckCircle,
  Clock,
  User,
  TrendingUp
} from 'lucide-react';

interface CampaignAnalyticsModalProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignAnalyticsModal({ campaign, open, onOpenChange }: CampaignAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campaign && open) {
      loadAnalytics();
    }
  }, [campaign, open]);

  const loadAnalytics = async () => {
    if (!campaign) return;
    
    setLoading(true);
    try {
      const [summary, performance] = await Promise.all([
        CampaignAnalyticsService.getCampaignAnalyticsSummary(campaign.id),
        CampaignAnalyticsService.getCampaignPerformance(campaign.id)
      ]);
      setAnalytics({ summary, performance });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, any> = {
      started: Play,
      paused: Pause,
      viewed: Eye,
      executed: Activity,
      edited: Edit,
      completed: CheckCircle,
    };
    const Icon = icons[action] || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      started: 'text-emerald-500',
      paused: 'text-orange-500',
      viewed: 'text-blue-500',
      executed: 'text-purple-500',
      edited: 'text-primary',
      completed: 'text-green-600',
    };
    return colors[action] || 'text-muted-foreground';
  };

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Campaign Analytics
          </DialogTitle>
          <DialogDescription>
            Detailed analytics and activity log for {campaign.name}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : analytics ? (
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 pr-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Total Views</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="text-2xl font-bold">
                        {analytics.performance.metrics.totalViews}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Executions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-emerald-500" />
                      <span className="text-2xl font-bold">
                        {analytics.performance.metrics.totalExecutions}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Total Actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-500" />
                      <span className="text-2xl font-bold">
                        {analytics.summary.totalActions}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Unique Users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span className="text-2xl font-bold">
                        {analytics.summary.uniqueUsers}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign Started Info */}
              {analytics.performance.metrics.startedBy && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Campaign Started By
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">User ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {analytics.performance.metrics.startedBy}
                        </code>
                      </div>
                      {analytics.performance.metrics.startedAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Started At:</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(analytics.performance.metrics.startedAt), 'PPp')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Actions Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(analytics.summary.actionsByType).map(([action, count]) => (
                      <div
                        key={action}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className={getActionColor(action)}>
                            {getActionIcon(action)}
                          </span>
                          <span className="text-sm font-medium capitalize">{action}</span>
                        </div>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest actions on this campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {analytics.summary.recentActions.map((action: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className={`p-2 rounded-lg bg-background ${getActionColor(action.action_type)}`}>
                            {getActionIcon(action.action_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize text-sm">
                                {action.action_type}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {format(new Date(action.created_at), 'MMM dd, HH:mm')}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              User: {action.user_id}
                            </p>
                            {action.action_metadata && typeof action.action_metadata === 'object' && Object.keys(action.action_metadata as object).length > 0 && (
                              <div className="mt-1">
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                  {JSON.stringify(action.action_metadata)}
                                </code>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No analytics data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
