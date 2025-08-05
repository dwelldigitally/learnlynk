import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Clock, MessageSquare, TrendingUp, RefreshCw, Phone, Mail } from 'lucide-react';
import { Lead } from '@/types/lead';

interface AIInsightsProps {
  lead: Lead;
  expanded?: boolean;
}

interface AIInsight {
  type: 'timing' | 'communication' | 'strategy' | 'urgency';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestedAction?: string;
}

export function AIInsightsPanel({ lead, expanded = false }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateInsights();
  }, [lead]);

  const generateInsights = async () => {
    setLoading(true);
    
    try {
      const aiInsights = await calculateAIInsights();
      setInsights(aiInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAIInsights = async (): Promise<AIInsight[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const insights: AIInsight[] = [];
    
    // Timing insights
    const leadAge = (new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60);
    const timezone = getTimezoneFromLocation(lead.country);
    const bestCallTime = getBestCallTime(timezone);
    
    insights.push({
      type: 'timing',
      title: 'Optimal Contact Time',
      description: `Best time to call is ${bestCallTime} in their timezone (${timezone})`,
      confidence: 85,
      actionable: true,
      suggestedAction: 'Schedule call'
    });

    // Communication style insights
    if (lead.source === 'web' || lead.source === 'forms') {
      insights.push({
        type: 'communication',
        title: 'Digital-First Preference',
        description: 'Lead came through digital channels - likely prefers email/SMS over calls initially',
        confidence: 78,
        actionable: true,
        suggestedAction: 'Send email first'
      });
    }

    // Urgency insights
    if (leadAge < 2) {
      insights.push({
        type: 'urgency',
        title: 'Hot Lead Alert',
        description: 'Lead is very fresh - contact within next 2 hours for highest conversion',
        confidence: 92,
        actionable: true,
        suggestedAction: 'Priority contact'
      });
    } else if (leadAge > 72) {
      insights.push({
        type: 'urgency',
        title: 'Re-engagement Needed',
        description: 'Lead is getting cold - consider special offer or urgent follow-up',
        confidence: 74,
        actionable: true,
        suggestedAction: 'Send special offer'
      });
    }

    // Program-specific insights
    if (lead.program_interest?.length > 0) {
      const programs = lead.program_interest.join(', ');
      insights.push({
        type: 'strategy',
        title: 'Program-Specific Approach',
        description: `Focus conversation on ${programs} - show specific career outcomes and success stories`,
        confidence: 80,
        actionable: true,
        suggestedAction: 'Prepare program materials'
      });
    }

    // International student insights
    if (lead.country && lead.country !== 'United States') {
      insights.push({
        type: 'strategy',
        title: 'International Student Support',
        description: 'Emphasize visa support, orientation programs, and international student community',
        confidence: 88,
        actionable: true,
        suggestedAction: 'Share international resources'
      });
    }

    // Priority-based insights
    if (lead.priority === 'high' || lead.priority === 'urgent') {
      insights.push({
        type: 'urgency',
        title: 'High-Priority Lead',
        description: 'Lead marked as high priority - ensure senior advisor handles this inquiry',
        confidence: 95,
        actionable: true,
        suggestedAction: 'Escalate to senior advisor'
      });
    }

    return insights.slice(0, expanded ? 6 : 3);
  };

  const getTimezoneFromLocation = (country?: string): string => {
    // Simplified timezone mapping
    const timezones: Record<string, string> = {
      'United States': 'EST/PST',
      'Canada': 'EST/PST',
      'United Kingdom': 'GMT',
      'Australia': 'AEST',
      'India': 'IST',
      'China': 'CST',
      'Japan': 'JST',
      'Germany': 'CET',
      'France': 'CET',
      'Brazil': 'BRT'
    };
    return timezones[country || ''] || 'UTC';
  };

  const getBestCallTime = (timezone: string): string => {
    // Simplified best call time logic
    const now = new Date();
    const currentHour = now.getHours();
    
    // Suggest optimal calling hours (9 AM - 6 PM in their timezone)
    if (timezone.includes('EST')) {
      return '10 AM - 4 PM EST';
    } else if (timezone.includes('PST')) {
      return '10 AM - 4 PM PST';
    } else if (timezone === 'GMT') {
      return '9 AM - 5 PM GMT';
    }
    return '10 AM - 4 PM local time';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'timing': return <Clock className="h-4 w-4" />;
      case 'communication': return <MessageSquare className="h-4 w-4" />;
      case 'strategy': return <TrendingUp className="h-4 w-4" />;
      case 'urgency': return <Lightbulb className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-blue-600';
    if (confidence >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          AI Insights
          <Button size="sm" variant="ghost" onClick={generateInsights}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">No insights available</p>
        ) : (
          insights.map((insight, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{insight.title}</p>
                    <span className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                  {insight.actionable && insight.suggestedAction && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {insight.suggestedAction}
                    </Badge>
                  )}
                </div>
              </div>
              {index < insights.length - 1 && <hr className="my-2" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}