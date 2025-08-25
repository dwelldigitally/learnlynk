import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface RealtimeMetrics {
  decisionsPerHour: number;
  avgProcessingTime: number;
  successRate: number;
  confidenceDistribution: { range: string; count: number }[];
  recentDecisions: {
    id: string;
    timestamp: string;
    type: string;
    confidence: number;
    outcome: 'success' | 'pending' | 'failed';
    processingTime: number;
  }[];
  performanceTrend: { time: string; decisions: number; confidence: number }[];
}

export function AIRealtimeMonitor() {
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    decisionsPerHour: 45,
    avgProcessingTime: 1.2,
    successRate: 87.5,
    confidenceDistribution: [
      { range: '0.9-1.0', count: 156 },
      { range: '0.8-0.9', count: 89 },
      { range: '0.7-0.8', count: 34 },
      { range: '0.6-0.7', count: 12 },
      { range: '0.5-0.6', count: 5 }
    ],
    recentDecisions: [
      {
        id: 'dec_001',
        timestamp: new Date(Date.now() - 2000).toISOString(),
        type: 'enrollment_recommendation',
        confidence: 0.92,
        outcome: 'success',
        processingTime: 0.8
      },
      {
        id: 'dec_002',
        timestamp: new Date(Date.now() - 15000).toISOString(),
        type: 'priority_assignment',
        confidence: 0.85,
        outcome: 'pending',
        processingTime: 1.1
      },
      {
        id: 'dec_003',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        type: 'follow_up_timing',
        confidence: 0.78,
        outcome: 'success',
        processingTime: 0.9
      }
    ],
    performanceTrend: [
      { time: '00:00', decisions: 12, confidence: 0.85 },
      { time: '04:00', decisions: 8, confidence: 0.88 },
      { time: '08:00', decisions: 35, confidence: 0.82 },
      { time: '12:00', decisions: 42, confidence: 0.90 },
      { time: '16:00', decisions: 38, confidence: 0.87 },
      { time: '20:00', decisions: 28, confidence: 0.89 }
    ]
  });

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        decisionsPerHour: prev.decisionsPerHour + Math.floor(Math.random() * 5) - 2,
        avgProcessingTime: Math.max(0.1, prev.avgProcessingTime + (Math.random() - 0.5) * 0.1),
        successRate: Math.max(70, Math.min(100, prev.successRate + (Math.random() - 0.5) * 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Timer className="h-4 w-4 text-warning" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
            <span className="text-sm font-medium">
              {isLive ? 'Live Monitoring' : 'Monitoring Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="px-3 py-1 text-xs bg-secondary hover:bg-secondary-hover rounded-md transition-colors"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">{metrics.decisionsPerHour}</div>
                <div className="text-sm text-muted-foreground">Decisions/Hour</div>
              </div>
              <Activity className="h-8 w-8 text-primary/60" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-success mr-1" />
              <span className="text-success">+12% from last hour</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-accent">{metrics.avgProcessingTime.toFixed(1)}s</div>
                <div className="text-sm text-muted-foreground">Avg Processing</div>
              </div>
              <Clock className="h-8 w-8 text-accent/60" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingDown className="h-3 w-3 text-success mr-1" />
              <span className="text-success">-0.3s from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-success">{metrics.successRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <TrendingUp className="h-8 w-8 text-success/60" />
            </div>
            <Progress value={metrics.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-warning">3</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning/60" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              2 Performance, 1 Threshold
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>24-Hour Performance Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="decisions" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Decisions Stream */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Decisions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.recentDecisions.map((decision) => (
                <div key={decision.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getOutcomeIcon(decision.outcome)}
                    <div>
                      <div className="font-medium text-sm">{decision.type.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(decision.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-xs">
                      <div className="font-medium">{(decision.confidence * 100).toFixed(0)}%</div>
                      <div className="text-muted-foreground">{decision.processingTime}s</div>
                    </div>
                    {getOutcomeBadge(decision.outcome)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Confidence Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Confidence Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.confidenceDistribution.map((item, index) => (
                <div key={item.range} className="flex items-center justify-between">
                  <div className="text-sm font-medium">{item.range}</div>
                  <div className="flex items-center space-x-3 flex-1 ml-4">
                    <Progress 
                      value={(item.count / 200) * 100} 
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}