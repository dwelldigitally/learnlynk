import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, Users, MessageSquare, FileCheck, Calendar, Target, AlertTriangle } from 'lucide-react';

interface BehaviorPattern {
  id: string;
  type: 'engagement' | 'conversion' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  frequency: number;
  lastDetected: string;
}

interface LeadBehavior {
  leadId: string;
  name: string;
  score: number;
  patterns: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  lastActivity: string;
}

const BehaviorAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');

  const behaviorPatterns: BehaviorPattern[] = [
    {
      id: '1',
      type: 'engagement',
      title: 'High Email Engagement',
      description: 'Leads who open emails within 2 hours consistently',
      confidence: 94,
      impact: 'high',
      frequency: 156,
      lastDetected: '2 hours ago'
    },
    {
      id: '2',
      type: 'risk',
      title: 'Ghosting Pattern',
      description: 'Sudden drop in communication after initial interest',
      confidence: 87,
      impact: 'high',
      frequency: 43,
      lastDetected: '1 hour ago'
    },
    {
      id: '3',
      type: 'conversion',
      title: 'Document Upload Correlation',
      description: 'High conversion rate after document submission',
      confidence: 91,
      impact: 'high',
      frequency: 78,
      lastDetected: '30 minutes ago'
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Weekend Browser Activity',
      description: 'Increased engagement during weekend hours',
      confidence: 73,
      impact: 'medium',
      frequency: 124,
      lastDetected: '4 hours ago'
    }
  ];

  const leadBehaviors: LeadBehavior[] = [
    {
      leadId: '1',
      name: 'Sarah Johnson',
      score: 92,
      patterns: ['High Email Engagement', 'Document Upload Correlation'],
      riskLevel: 'low',
      recommendation: 'Fast-track application review',
      lastActivity: '2 hours ago'
    },
    {
      leadId: '2',
      name: 'Michael Chen',
      score: 34,
      patterns: ['Ghosting Pattern', 'Low Engagement'],
      riskLevel: 'high',
      recommendation: 'Initiate reactivation campaign',
      lastActivity: '5 days ago'
    },
    {
      leadId: '3',
      name: 'Emily Rodriguez',
      score: 78,
      patterns: ['Weekend Browser Activity', 'Moderate Engagement'],
      riskLevel: 'medium',
      recommendation: 'Schedule weekend follow-up',
      lastActivity: '1 day ago'
    }
  ];

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'engagement': return 'bg-success text-success-foreground';
      case 'conversion': return 'bg-primary text-primary-foreground';
      case 'risk': return 'bg-destructive text-destructive-foreground';
      case 'opportunity': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'engagement': return MessageSquare;
      case 'conversion': return Target;
      case 'risk': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      default: return Brain;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Behavior Analytics</h2>
          <p className="text-muted-foreground">AI-powered insights into student and lead behavior patterns</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patterns">Behavior Patterns</TabsTrigger>
          <TabsTrigger value="leads">Lead Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patterns</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{behaviorPatterns.length}</div>
                <p className="text-xs text-muted-foreground">detected this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Impact</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {behaviorPatterns.filter(p => p.impact === 'high').length}
                </div>
                <p className="text-xs text-muted-foreground">patterns require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(behaviorPatterns.reduce((acc, p) => acc + p.confidence, 0) / behaviorPatterns.length)}%
                </div>
                <p className="text-xs text-muted-foreground">prediction accuracy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Occurrences</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {behaviorPatterns.reduce((acc, p) => acc + p.frequency, 0)}
                </div>
                <p className="text-xs text-muted-foreground">this period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            {behaviorPatterns.map((pattern) => {
              const IconComponent = getPatternIcon(pattern.type);
              return (
                <Card key={pattern.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{pattern.title}</CardTitle>
                          <CardDescription>{pattern.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getPatternColor(pattern.type)}>
                          {pattern.type}
                        </Badge>
                        <Badge variant="outline" className={getImpactColor(pattern.impact)}>
                          {pattern.impact} impact
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="text-lg font-semibold text-foreground">{pattern.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Frequency</p>
                        <p className="text-lg font-semibold text-foreground">{pattern.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Detected</p>
                        <p className="text-lg font-semibold text-foreground">{pattern.lastDetected}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid gap-4">
            {leadBehaviors.map((lead) => (
              <Card key={lead.leadId} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lead.name}</CardTitle>
                        <CardDescription>Behavior Score: {lead.score}/100</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(lead.riskLevel)}>
                        {lead.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Detected Patterns</p>
                      <div className="flex flex-wrap gap-2">
                        {lead.patterns.map((pattern, index) => (
                          <Badge key={index} variant="secondary">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">AI Recommendation</p>
                        <p className="text-sm font-medium text-foreground">{lead.recommendation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Activity</p>
                        <p className="text-sm font-medium text-foreground">{lead.lastActivity}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>AI-powered predictions and forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Predictive analytics dashboard will be available here</p>
                <p className="text-sm">Enrollment predictions, conversion forecasts, and risk assessments</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Recommendations</CardTitle>
              <CardDescription>Actionable insights and suggested optimizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>AI recommendations engine will be available here</p>
                <p className="text-sm">Personalized action plans and optimization suggestions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BehaviorAnalytics;