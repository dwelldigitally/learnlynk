import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, Users, Target, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AttributionWaterfall } from './AttributionWaterfall';
import { MetricTiles } from './MetricTiles';

interface OutcomeData {
  id: string;
  metric_name: string;
  before_value: number;
  after_value: number;
  time_period: string;
  attribution_source: string;
}

export function OutcomesDashboard() {
  const [outcomes, setOutcomes] = useState<OutcomeData[]>([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>('30');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadOutcomesData();
  }, [selectedTimePeriod]);

  const loadOutcomesData = async () => {
    try {
      const { data, error } = await supabase
        .from('outcome_metrics')
        .select('*')
        .eq('time_period', `${selectedTimePeriod}d`)
        .order('metric_name');

      if (error) throw error;
      setOutcomes(data || []);
    } catch (error) {
      console.error('Error loading outcomes data:', error);
      toast({
        title: "Error",
        description: "Failed to load outcomes data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const responseTimeData = outcomes.find(o => o.metric_name === 'response_time');
  const actionsPerDayData = outcomes.find(o => o.metric_name === 'actions_per_day');
  const conversionData = outcomes.find(o => o.metric_name === 'conversion_rate');

  const calculateImprovement = (before: number, after: number) => {
    const change = ((after - before) / before) * 100;
    return {
      percentage: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      isImprovement: change > 0 || (responseTimeData && responseTimeData.metric_name === 'response_time' && change < 0)
    };
  };

  const attributionData = [
    { name: 'Speed Policy', impact: 34, color: '#10B981' },
    { name: 'Stalled 7-Day', impact: 28, color: '#3B82F6' },
    { name: 'Waste Radar', impact: 22, color: '#F59E0B' },
    { name: 'Other Factors', impact: 16, color: '#6B7280' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Outcomes 30/60/90</h1>
          <p className="text-muted-foreground">
            Board-friendly performance metrics with attribution tracking
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Time Period:</span>
          </div>
          {['30', '60', '90'].map((period) => (
            <Button
              key={period}
              variant={selectedTimePeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimePeriod(period)}
            >
              {period} Days
            </Button>
          ))}
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Response Time */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Median Response Time</span>
              </div>
              {responseTimeData && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  -{calculateImprovement(responseTimeData.before_value, responseTimeData.after_value).percentage}%
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {responseTimeData ? `${Math.round(responseTimeData.after_value)}h` : '4.2h'}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {responseTimeData ? `${Math.round(responseTimeData.before_value)}h` : '8.7h'}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions per Day */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Actions per Counselor/Day</span>
              </div>
              {actionsPerDayData && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +{calculateImprovement(actionsPerDayData.before_value, actionsPerDayData.after_value).percentage}%
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {actionsPerDayData ? Math.round(actionsPerDayData.after_value) : 47}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {actionsPerDayData ? Math.round(actionsPerDayData.before_value) : 31}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-muted-foreground">Offer → Deposit Rate</span>
              </div>
              {conversionData && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +{calculateImprovement(conversionData.before_value, conversionData.after_value).percentage}%
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {conversionData ? `${(conversionData.after_value * 100).toFixed(1)}%` : '73.2%'}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {conversionData ? `${(conversionData.before_value * 100).toFixed(1)}%` : '68.5%'}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attribution Waterfall */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Impact Attribution Waterfall</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AttributionWaterfall data={attributionData} />
        </CardContent>
      </Card>

      {/* Risk Band Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">High Risk Band</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Applications</span>
                <span className="font-semibold">847 → 923</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion</span>
                <span className="font-semibold">61.2% → 67.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Impact</span>
                <Badge className="bg-green-100 text-green-800">+56 deposits</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medium Risk Band</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Applications</span>
                <span className="font-semibold">1,245 → 1,398</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion</span>
                <span className="font-semibold">72.1% → 76.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Impact</span>
                <Badge className="bg-green-100 text-green-800">+164 deposits</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Low Risk Band</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Applications</span>
                <span className="font-semibold">2,156 → 2,089</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion</span>
                <span className="font-semibold">84.3% → 86.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Impact</span>
                <Badge className="bg-green-100 text-green-800">+89 deposits</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}