import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Award,
  Activity,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  conversionRate: number;
  conversionTrend: number;
  avgResponseTime: number;
  responseTrend: number;
  dailyCompletions: number;
  completionTrend: number;
  yieldPrediction: number;
  predictionTrend: number;
}

export function RealTimeAnalyticsWidget() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    conversionRate: 0,
    conversionTrend: 0,
    avgResponseTime: 0,
    responseTrend: 0,
    dailyCompletions: 0,
    completionTrend: 0,
    yieldPrediction: 0,
    predictionTrend: 0
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get recent completions for trend analysis
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const { data: todayActions } = await supabase
        .from('student_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', today.toISOString().split('T')[0]);

      const { data: yesterdayActions } = await supabase
        .from('student_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', yesterday.toISOString().split('T')[0])
        .lt('completed_at', today.toISOString().split('T')[0]);

      const { data: weekActions } = await supabase
        .from('student_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', lastWeek.toISOString().split('T')[0]);

      // Calculate analytics
      const todayCount = todayActions?.length || 0;
      const yesterdayCount = yesterdayActions?.length || 0;
      const weekCount = weekActions?.length || 0;

      // Calculate trends
      const completionTrend = yesterdayCount > 0 
        ? ((todayCount - yesterdayCount) / yesterdayCount) * 100 
        : todayCount > 0 ? 100 : 0;

      // Calculate average response time (mock calculation)
      const avgResponseHours = weekCount > 0 ? Math.random() * 4 + 1 : 0;
      const responseTrend = Math.random() * 20 - 10; // Random trend for demo

      // Calculate conversion metrics (mock for demo)
      const conversionRate = Math.min(85, Math.max(45, 65 + Math.random() * 20));
      const conversionTrend = Math.random() * 10 - 5;

      // Yield prediction based on recent activity
      const yieldPrediction = Math.min(95, Math.max(60, 75 + (todayCount * 2)));
      const predictionTrend = Math.random() * 15 - 7.5;

      setAnalytics({
        conversionRate,
        conversionTrend,
        avgResponseTime: avgResponseHours,
        responseTrend,
        dailyCompletions: todayCount,
        completionTrend,
        yieldPrediction,
        predictionTrend
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    
    // Refresh analytics every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Activity className="h-3 w-3 text-muted-foreground" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Real-Time Analytics</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadAnalytics}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Conversion Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Conversion Rate</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold">{analytics.conversionRate.toFixed(1)}%</span>
            {getTrendIcon(analytics.conversionTrend)}
            <span className={`text-xs ${getTrendColor(analytics.conversionTrend)}`}>
              {analytics.conversionTrend > 0 ? '+' : ''}{analytics.conversionTrend.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Response Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Avg Response</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold">{analytics.avgResponseTime.toFixed(1)}h</span>
            {getTrendIcon(analytics.responseTrend)}
            <span className={`text-xs ${getTrendColor(analytics.responseTrend)}`}>
              {analytics.responseTrend > 0 ? '+' : ''}{analytics.responseTrend.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Daily Completions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Today's Actions</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold">{analytics.dailyCompletions}</span>
            {getTrendIcon(analytics.completionTrend)}
            <span className={`text-xs ${getTrendColor(analytics.completionTrend)}`}>
              {analytics.completionTrend > 0 ? '+' : ''}{analytics.completionTrend.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Yield Prediction */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Yield Forecast</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold">{analytics.yieldPrediction.toFixed(0)}%</span>
            {getTrendIcon(analytics.predictionTrend)}
            <span className={`text-xs ${getTrendColor(analytics.predictionTrend)}`}>
              {analytics.predictionTrend > 0 ? '+' : ''}{analytics.predictionTrend.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="pt-2 border-t">
          <div className="flex justify-center">
            <Badge 
              variant={analytics.conversionRate > 70 ? "default" : "secondary"}
              className="text-xs"
            >
              {analytics.conversionRate > 80 ? "🔥 Hot Streak" : 
               analytics.conversionRate > 70 ? "🎯 On Target" : 
               "📈 Building Momentum"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}