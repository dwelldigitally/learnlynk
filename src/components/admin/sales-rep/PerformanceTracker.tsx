import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Target, TrendingUp, Award, Users, Phone, Mail, Calendar, Trophy } from 'lucide-react';

interface PerformanceMetrics {
  daily: {
    calls_target: number;
    calls_made: number;
    emails_target: number;
    emails_sent: number;
    meetings_target: number;
    meetings_booked: number;
  };
  weekly: {
    leads_target: number;
    leads_converted: number;
    revenue_target: number;
    revenue_generated: number;
  };
  monthly: {
    conversion_rate: number;
    average_deal_size: number;
    response_time_avg: number;
  };
  team_comparison: {
    my_rank: number;
    total_reps: number;
    top_performer: string;
    my_score: number;
    team_average: number;
  };
}

export function PerformanceTracker() {
  const isMobile = useIsMobile();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    loadPerformanceMetrics();
  }, []);

  const loadPerformanceMetrics = async () => {
    try {
      // Enhanced mock performance data with realistic metrics
      const mockMetrics: PerformanceMetrics = {
        daily: {
          calls_target: 25,
          calls_made: 18,
          emails_target: 20,
          emails_sent: 15,
          meetings_target: 4,
          meetings_booked: 3
        },
        weekly: {
          leads_target: 30,
          leads_converted: 22,
          revenue_target: 75000,
          revenue_generated: 68500
        },
        monthly: {
          conversion_rate: 28.5,
          average_deal_size: 3200,
          response_time_avg: 3.8
        },
        team_comparison: {
          my_rank: 2,
          total_reps: 15,
          top_performer: 'Alex Rodriguez',
          my_score: 94,
          team_average: 76
        }
      };
      
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRankBadge = (rank: number, total: number) => {
    if (rank === 1) return { variant: 'default' as const, label: '🏆 #1', color: 'text-yellow-600' };
    if (rank <= 3) return { variant: 'secondary' as const, label: `🥉 #${rank}`, color: 'text-orange-600' };
    if (rank <= total / 2) return { variant: 'outline' as const, label: `#${rank}`, color: 'text-blue-600' };
    return { variant: 'destructive' as const, label: `#${rank}`, color: 'text-red-600' };
  };

  if (loading || !metrics) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" />
            Performance Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-20"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const rankBadge = getRankBadge(metrics.team_comparison.my_rank, metrics.team_comparison.total_reps);

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="w-4 h-4" />
          Performance Tracker
          <Badge variant={rankBadge.variant} className="ml-auto">
            {rankBadge.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Daily Targets */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Today's Targets</h3>
            <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-3")}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Calls</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metrics.daily.calls_made}</span>
                      <span className="text-muted-foreground">/ {metrics.daily.calls_target}</span>
                    </div>
                    <Progress 
                      value={calculateProgress(metrics.daily.calls_made, metrics.daily.calls_target)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Emails</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metrics.daily.emails_sent}</span>
                      <span className="text-muted-foreground">/ {metrics.daily.emails_target}</span>
                    </div>
                    <Progress 
                      value={calculateProgress(metrics.daily.emails_sent, metrics.daily.emails_target)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Meetings</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metrics.daily.meetings_booked}</span>
                      <span className="text-muted-foreground">/ {metrics.daily.meetings_target}</span>
                    </div>
                    <Progress 
                      value={calculateProgress(metrics.daily.meetings_booked, metrics.daily.meetings_target)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Weekly Performance */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">This Week</h3>
            <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Lead Conversions</span>
                    </div>
                    <Badge variant="outline">
                      {((metrics.weekly.leads_converted / metrics.weekly.leads_target) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{metrics.weekly.leads_converted} converted</span>
                      <span className="text-muted-foreground">/ {metrics.weekly.leads_target} target</span>
                    </div>
                    <Progress 
                      value={calculateProgress(metrics.weekly.leads_converted, metrics.weekly.leads_target)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Revenue Generated</span>
                    </div>
                    <Badge variant="outline">
                      ${(metrics.weekly.revenue_generated / 1000).toFixed(0)}K
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>${(metrics.weekly.revenue_generated / 1000).toFixed(0)}K</span>
                      <span className="text-muted-foreground">/ ${(metrics.weekly.revenue_target / 1000).toFixed(0)}K</span>
                    </div>
                    <Progress 
                      value={calculateProgress(metrics.weekly.revenue_generated, metrics.weekly.revenue_target)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Team Comparison */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Team Performance</h3>
            <Card>
              <CardContent className="p-4">
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <Trophy className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                    <div className="text-lg font-bold">{metrics.team_comparison.my_rank}</div>
                    <div className="text-xs text-muted-foreground">Your Rank</div>
                  </div>
                  
                  <div className="text-center">
                    <Award className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                    <div className="text-lg font-bold">{metrics.team_comparison.my_score}</div>
                    <div className="text-xs text-muted-foreground">Your Score</div>
                  </div>
                  
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                    <div className="text-lg font-bold">{metrics.team_comparison.team_average}</div>
                    <div className="text-xs text-muted-foreground">Team Avg</div>
                  </div>
                  
                  <div className="text-center">
                    <Target className="w-6 h-6 mx-auto mb-1 text-green-500" />
                    <div className="text-lg font-bold">
                      +{metrics.team_comparison.my_score - metrics.team_comparison.team_average}
                    </div>
                    <div className="text-xs text-muted-foreground">Above Avg</div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Top Performer: <span className="font-medium text-foreground">{metrics.team_comparison.top_performer}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}