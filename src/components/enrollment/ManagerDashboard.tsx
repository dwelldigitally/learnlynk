import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Users, 
  Clock, 
  TrendingUp, 
  Target,
  ChevronRight,
  Settings,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlaysService } from '@/services/playsService';

interface PlayPerformance {
  id: string;
  name: string;
  play_type: string;
  is_active: boolean;
  actions_generated: number;
  actions_completed: number;
  conversion_rate: number;
  avg_response_time: number;
  revenue_impact: number;
}

interface OutcomeMetrics {
  responseTime: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  actionsPerCounselor: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  conversionRate: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export function ManagerDashboard() {
  const [playPerformance, setPlayPerformance] = useState<PlayPerformance[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        loadPlayPerformance(),
        loadOutcomeMetrics()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadPlayPerformance = async () => {
    const { data: plays, error: playsError } = await supabase
      .from('plays')
      .select('*')
      .order('created_at', { ascending: false });

    if (playsError) throw playsError;

    // Get action counts for each play
    const playStats = await Promise.all(
      (plays || []).map(async (play) => {
        const { data: actions, error: actionsError } = await supabase
          .from('student_actions')
          .select('*')
          .eq('play_id', play.id);

        if (actionsError) throw actionsError;

        const totalActions = actions?.length || 0;
        const completedActions = actions?.filter(a => a.status === 'completed').length || 0;
        const conversionRate = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

        // Calculate average response time (mock for demo)
        const avgResponseTime = Math.floor(Math.random() * 120) + 15; // 15-135 minutes

        return {
          id: play.id,
          name: play.name,
          play_type: play.play_type,
          is_active: play.is_active,
          actions_generated: totalActions,
          actions_completed: completedActions,
          conversion_rate: Math.round(conversionRate),
          avg_response_time: avgResponseTime,
          revenue_impact: Math.floor(Math.random() * 50000) + 10000 // Mock revenue impact
        };
      })
    );

    setPlayPerformance(playStats);
  };

  const loadOutcomeMetrics = async () => {
    // Mock outcome metrics for demo
    setOutcomes({
      responseTime: {
        current: 32,
        previous: 45,
        trend: 'down' // Better
      },
      actionsPerCounselor: {
        current: 18,
        previous: 12,
        trend: 'up' // Better
      },
      conversionRate: {
        current: 24,
        previous: 19,
        trend: 'up' // Better
      }
    });
  };

  const handleTogglePlay = async (playId: string, isActive: boolean) => {
    try {
      await PlaysService.togglePlay(playId, isActive);
      
      // Update local state
      setPlayPerformance(prev => 
        prev.map(play => 
          play.id === playId ? { ...play, is_active: isActive } : play
        )
      );
      
      toast.success(`Play ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling play:', error);
      toast.error('Failed to toggle play');
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
    return <div className="h-4 w-4" />;
  };

  const getPlayTypeIcon = (playType: string) => {
    switch (playType) {
      case 'immediate_response': return <Clock className="h-4 w-4" />;
      case 'nurture_sequence': return <Users className="h-4 w-4" />;
      case 'document_follow_up': return <Target className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  const getPlayTypeLabel = (playType: string) => {
    switch (playType) {
      case 'immediate_response': return 'Speed-to-Lead';
      case 'nurture_sequence': return 'Nurture Sequence';
      case 'document_follow_up': return 'Document Chase';
      case 'interview_scheduler': return 'Interview Scheduler';
      case 'deposit_follow_up': return 'Deposit Follow-up';
      default: return playType;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor play performance and outcome metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Full Report
          </Button>
        </div>
      </div>

      {/* Outcome Metrics */}
      {outcomes && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              {getTrendIcon(outcomes.responseTime.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outcomes.responseTime.current}m</div>
              <p className="text-xs text-muted-foreground">
                {outcomes.responseTime.trend === 'down' ? '-' : '+'}
                {Math.abs(outcomes.responseTime.current - outcomes.responseTime.previous)}m from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actions/Counselor/Day</CardTitle>
              {getTrendIcon(outcomes.actionsPerCounselor.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outcomes.actionsPerCounselor.current}</div>
              <p className="text-xs text-muted-foreground">
                +{outcomes.actionsPerCounselor.current - outcomes.actionsPerCounselor.previous} from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Application Completion</CardTitle>
              {getTrendIcon(outcomes.conversionRate.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outcomes.conversionRate.current}%</div>
              <p className="text-xs text-muted-foreground">
                +{outcomes.conversionRate.current - outcomes.conversionRate.previous}% from last period
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Play Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Playbook Performance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Active plays and their impact on key metrics
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {playPerformance.map(play => (
              <div key={play.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getPlayTypeIcon(play.play_type)}
                    <div>
                      <div className="font-medium">{play.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getPlayTypeLabel(play.play_type)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <div className="font-medium">{play.actions_generated}</div>
                      <div className="text-muted-foreground">Actions</div>
                    </div>
                    <div>
                      <div className="font-medium">{play.conversion_rate}%</div>
                      <div className="text-muted-foreground">Completion</div>
                    </div>
                    <div>
                      <div className="font-medium">{play.avg_response_time}m</div>
                      <div className="text-muted-foreground">Avg Response</div>
                    </div>
                    <div>
                      <div className="font-medium">${play.revenue_impact.toLocaleString()}</div>
                      <div className="text-muted-foreground">Impact</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={play.is_active ? 'default' : 'secondary'}>
                    {play.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  <Switch
                    checked={play.is_active}
                    onCheckedChange={(checked) => handleTogglePlay(play.id, checked)}
                  />
                  
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {playPerformance.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No plays configured yet. Create your first play to see performance metrics.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}