import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, MessageSquare, Calendar, User, Target, Zap, RefreshCw } from 'lucide-react';
import { Lead } from '@/types/lead';
import { useToast } from '@/components/ui/use-toast';

interface AIAssistantProps {
  lead: Lead;
}

interface AIRecommendation {
  id: string;
  type: 'action' | 'insight' | 'alert';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  confidence: number;
  action?: {
    label: string;
    type: 'email' | 'call' | 'task' | 'meeting';
  };
}

export function AIUnifiedAssistant({ lead }: AIAssistantProps) {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [aiScore, setAiScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateAIRecommendations();
  }, [lead]);

  const generateAIRecommendations = async () => {
    setLoading(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newRecommendations: AIRecommendation[] = [];
      const leadAge = (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60);
      
      // High priority recommendations
      if (leadAge < 4) {
        newRecommendations.push({
          id: 'hot-lead',
          type: 'alert',
          priority: 'high',
          title: 'Hot Lead - Immediate Action Required',
          description: 'Lead is very fresh and highly qualified. Contact within 30 minutes for optimal conversion.',
          confidence: 96,
          action: { label: 'Call Now', type: 'call' }
        });
      }

      if (lead.lead_score && lead.lead_score > 80) {
        newRecommendations.push({
          id: 'high-score',
          type: 'action',
          priority: 'high',
          title: 'High-Value Lead Detected',
          description: 'Lead score indicates strong conversion potential. Prioritize with senior advisor.',
          confidence: 89,
          action: { label: 'Assign Senior Advisor', type: 'task' }
        });
      }

      // Program-specific recommendations
      if (lead.program_interest && lead.program_interest.length > 0) {
        newRecommendations.push({
          id: 'program-match',
          type: 'insight',
          priority: 'medium',
          title: 'Program Interest Identified',
          description: `Show ${lead.program_interest.join(', ')} success stories and career outcomes.`,
          confidence: 82,
          action: { label: 'Send Program Materials', type: 'email' }
        });
      }

      // Communication timing
      const timezone = getTimezoneFromCountry(lead.country);
      const bestTime = getBestContactTime(timezone);
      newRecommendations.push({
        id: 'timing',
        type: 'insight',
        priority: 'medium',
        title: 'Optimal Contact Window',
        description: `Best time to contact: ${bestTime} (${timezone})`,
        confidence: 75,
        action: { label: 'Schedule Call', type: 'meeting' }
      });

      // International student specific
      if (lead.country && lead.country !== 'United States') {
        newRecommendations.push({
          id: 'international',
          type: 'action',
          priority: 'medium',
          title: 'International Student Support',
          description: 'Highlight visa assistance, orientation programs, and international community.',
          confidence: 78,
          action: { label: 'Send International Guide', type: 'email' }
        });
      }

      setRecommendations(newRecommendations);
      setAiScore(calculateAIScore(lead, newRecommendations));
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAIScore = (lead: Lead, recommendations: AIRecommendation[]): number => {
    let score = lead.lead_score || 50;
    
    // Adjust based on recommendations
    const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
    const avgConfidence = recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length;
    
    score += highPriorityCount * 10;
    score = (score + avgConfidence) / 2;
    
    return Math.min(Math.max(score, 0), 100);
  };

  const getTimezoneFromCountry = (country?: string): string => {
    const timezones: Record<string, string> = {
      'United States': 'EST/PST',
      'Canada': 'EST/PST', 
      'United Kingdom': 'GMT',
      'Australia': 'AEST',
      'India': 'IST',
      'Germany': 'CET',
      'France': 'CET'
    };
    return timezones[country || ''] || 'UTC';
  };

  const getBestContactTime = (timezone: string): string => {
    return '10 AM - 4 PM';
  };

  const executeAction = async (recommendation: AIRecommendation) => {
    toast({
      title: "Action Executed",
      description: `${recommendation.action?.label} initiated for ${lead.first_name} ${lead.last_name}`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'action': return <Target className="h-4 w-4" />;
      case 'insight': return <Brain className="h-4 w-4" />;
      case 'alert': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Assistant
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">AI Score</div>
              <div className="text-2xl font-bold text-blue-600">{Math.round(aiScore)}%</div>
            </div>
            <Button size="sm" variant="outline" onClick={generateAIRecommendations}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lead Summary */}
        <div className="p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{lead.first_name} {lead.last_name}</span>
            <Badge variant="outline">{lead.status}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {lead.email} • {lead.country} • Score: {lead.lead_score}
          </div>
          {lead.program_interest && lead.program_interest.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Interested in: </span>
              {lead.program_interest.map((program, index) => (
                <Badge key={index} variant="secondary" className="mr-1 text-xs">
                  {program}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Smart Recommendations</h4>
          {recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recommendations available</p>
          ) : (
            recommendations.slice(0, 4).map((rec) => (
              <div key={rec.id} className="p-3 bg-white rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(rec.type)}
                    <span className="font-medium text-sm">{rec.title}</span>
                    <Badge className={getPriorityColor(rec.priority)} variant="outline">
                      {rec.priority}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {rec.confidence}% confidence
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                {rec.action && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => executeAction(rec)}
                    className="text-xs"
                  >
                    {rec.action.label}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-3 border-t">
          <h4 className="font-medium text-sm mb-3">Quick Actions</h4>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline">
              <MessageSquare className="h-3 w-3 mr-1" />
              Send Email
            </Button>
            <Button size="sm" variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              Schedule Call
            </Button>
            <Button size="sm" variant="outline">
              <User className="h-3 w-3 mr-1" />
              Assign Advisor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}