import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Clock, Target, Zap } from 'lucide-react';

interface MeetingInsight {
  type: 'positive' | 'concern' | 'opportunity' | 'action';
  title: string;
  description: string;
  confidence: number;
}

interface AIMeetingAnalysisProps {
  leadId: string;
  meetingData?: any;
}

export function AIMeetingAnalysis({ leadId, meetingData }: AIMeetingAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);
  
  // Mock analysis data
  const [analysis] = useState({
    overall_sentiment: 0.78,
    engagement_score: 0.85,
    interest_level: 0.92,
    decision_timeline: 'Short (1-3 months)',
    budget_indicators: 'Positive signals detected',
    key_pain_points: [
      'Current system lacks integration capabilities',
      'Team productivity concerns',
      'Scalability issues with growth'
    ],
    decision_makers: ['John Smith (Primary)', 'Sarah Johnson (Influencer)'],
    next_best_actions: [
      'Send technical integration overview',
      'Schedule demo with technical team',
      'Provide ROI calculator',
      'Follow up within 48 hours'
    ]
  });

  const [insights] = useState<MeetingInsight[]>([
    {
      type: 'positive',
      title: 'High Purchase Intent',
      description: 'Lead expressed strong interest and asked about implementation timelines',
      confidence: 0.92
    },
    {
      type: 'opportunity',
      title: 'Budget Authority Confirmed',
      description: 'Lead mentioned having decision-making authority for this purchase',
      confidence: 0.87
    },
    {
      type: 'concern',
      title: 'Competitor Consideration',
      description: 'Lead mentioned evaluating 2-3 other solutions in parallel',
      confidence: 0.75
    },
    {
      type: 'action',
      title: 'Technical Demo Requested',
      description: 'Lead specifically asked for a technical demonstration next week',
      confidence: 0.95
    }
  ]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'concern': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'opportunity': return <Target className="h-4 w-4 text-blue-500" />;
      case 'action': return <Clock className="h-4 w-4 text-purple-500" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-200 bg-green-50';
      case 'concern': return 'border-orange-200 bg-orange-50';
      case 'opportunity': return 'border-blue-200 bg-blue-50';
      case 'action': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          AI Meeting Analysis
          <Badge variant="secondary" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Analyzing meeting content...</p>
          </div>
        ) : (
          <>
            {/* Sentiment Scores */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Sentiment</span>
                  <span className="font-medium">{(analysis.overall_sentiment * 100).toFixed(0)}%</span>
                </div>
                <Progress value={analysis.overall_sentiment * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Engagement Score</span>
                  <span className="font-medium">{(analysis.engagement_score * 100).toFixed(0)}%</span>
                </div>
                <Progress value={analysis.engagement_score * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Interest Level</span>
                  <span className="font-medium">{(analysis.interest_level * 100).toFixed(0)}%</span>
                </div>
                <Progress value={analysis.interest_level * 100} className="h-2" />
              </div>
            </div>

            <Separator />

            {/* Key Insights */}
            <div>
              <h4 className="text-sm font-medium mb-2">AI Insights</h4>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {insights.map((insight, index) => (
                    <div key={index} className={`border rounded-lg p-2 ${getInsightColor(insight.type)}`}>
                      <div className="flex items-start gap-2">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium">{insight.title}</p>
                            <Badge variant="outline" className="text-xs">
                              {(insight.confidence * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Decision Timeline</p>
                <p className="font-medium">{analysis.decision_timeline}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Budget Signals</p>
                <p className="font-medium text-green-600">Positive</p>
              </div>
            </div>

            <Separator />

            {/* Pain Points */}
            <div>
              <h4 className="text-sm font-medium mb-2">Key Pain Points</h4>
              <div className="space-y-1">
                {analysis.key_pain_points.map((point, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Next Actions */}
            <div>
              <h4 className="text-sm font-medium mb-2">AI Recommended Actions</h4>
              <div className="space-y-1">
                {analysis.next_best_actions.slice(0, 3).map((action, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button size="sm" className="w-full">
              <TrendingUp className="h-3 w-3 mr-2" />
              Generate Full Report
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}