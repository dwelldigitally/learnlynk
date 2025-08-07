import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Brain, 
  Mail, 
  Phone, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Plus
} from 'lucide-react';

interface AIRecommendation {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'follow_up' | 'nurture' | 'escalate';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  lead_name?: string;
  lead_id?: string;
  confidence_score: number;
  estimated_impact: string;
  action_items: string[];
  timeframe: string;
  reasoning: string;
}

interface AISequence {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed';
  leads_enrolled: number;
  completion_rate: number;
  next_action: string;
  type: 'nurture' | 'onboarding' | 'reactivation' | 'upsell';
}

export function AIActionCenter() {
  const isMobile = useIsMobile();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [sequences, setSequences] = useState<AISequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'sequences'>('recommendations');

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    try {
      // Mock AI recommendations
      const mockRecommendations: AIRecommendation[] = [
        {
          id: '1',
          type: 'call',
          priority: 'high',
          title: 'Urgent: Call Sarah Johnson',
          description: 'Sarah opened your email 3 times and visited pricing page. High buying intent detected.',
          lead_name: 'Sarah Johnson',
          lead_id: 'lead-1',
          confidence_score: 92,
          estimated_impact: 'High conversion probability (85%)',
          action_items: ['Call within next 2 hours', 'Prepare pricing discussion', 'Have application form ready'],
          timeframe: 'Next 2 hours',
          reasoning: 'Multiple email opens + pricing page visits + previous positive responses indicate strong buying intent.'
        },
        {
          id: '2',
          type: 'email',
          priority: 'medium',
          title: 'Send follow-up to Michael Chen',
          description: 'Michael hasn\'t responded to your last email. AI suggests a different approach.',
          lead_name: 'Michael Chen',
          lead_id: 'lead-2',
          confidence_score: 78,
          estimated_impact: 'Medium engagement boost',
          action_items: ['Use "question-based" template', 'Include success story', 'Add calendar link'],
          timeframe: 'Today',
          reasoning: 'Lead shows pattern of responding better to question-based emails rather than feature lists.'
        },
        {
          id: '3',
          type: 'nurture',
          priority: 'medium',
          title: 'Enroll 5 leads in nurture sequence',
          description: 'These leads are not ready to buy but show long-term potential.',
          confidence_score: 85,
          estimated_impact: 'Improved pipeline health',
          action_items: ['Review lead scores', 'Select appropriate sequence', 'Set up automated nurture'],
          timeframe: 'This week',
          reasoning: 'Leads with medium scores (60-75) and specific behavior patterns benefit from structured nurturing.'
        }
      ];

      const mockSequences: AISequence[] = [
        {
          id: '1',
          name: 'MBA Inquiry Nurture',
          status: 'running',
          leads_enrolled: 24,
          completion_rate: 68,
          next_action: 'Send Day 3 follow-up email',
          type: 'nurture'
        },
        {
          id: '2',
          name: 'Application Onboarding',
          status: 'running',
          leads_enrolled: 12,
          completion_rate: 85,
          next_action: 'Schedule intake calls',
          type: 'onboarding'
        },
        {
          id: '3',
          name: 'Dormant Lead Reactivation',
          status: 'paused',
          leads_enrolled: 8,
          completion_rate: 45,
          next_action: 'Review and optimize',
          type: 'reactivation'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setSequences(mockSequences);
    } catch (error) {
      console.error('Failed to load AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'follow_up': return <Clock className="w-4 h-4" />;
      case 'nurture': return <TrendingUp className="w-4 h-4" />;
      case 'escalate': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSequenceStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600';
      case 'paused': return 'text-orange-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const executeRecommendation = (rec: AIRecommendation) => {
    console.log('Executing recommendation:', rec);
    // Implement action execution logic here
  };

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Action Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-24"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600" />
          AI Action Center
          <Badge variant="secondary" className="ml-auto">
            {recommendations.length} suggestions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'recommendations' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('recommendations')}
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              Recommendations
            </Button>
            <Button
              variant={activeTab === 'sequences' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('sequences')}
            >
              <Zap className="w-3 h-3 mr-1" />
              Sequences
            </Button>
          </div>

          {/* AI Recommendations */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-colors",
                    getPriorityColor(rec.priority)
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(rec.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {rec.confidence_score}% confidence
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {rec.description}
                      </p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="text-xs">
                          <span className="font-medium">Impact:</span> {rec.estimated_impact}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Timeframe:</span> {rec.timeframe}
                        </div>
                      </div>
                      
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground mb-2">
                          View action items & reasoning
                        </summary>
                        <div className="space-y-2 p-2 bg-background/50 rounded">
                          <div>
                            <span className="font-medium">Action Items:</span>
                            <ul className="list-disc list-inside ml-2 mt-1">
                              {rec.action_items.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium">AI Reasoning:</span>
                            <p className="mt-1">{rec.reasoning}</p>
                          </div>
                        </div>
                      </details>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => executeRecommendation(rec)}
                      className="flex-shrink-0"
                    >
                      Execute
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Sequences */}
          {activeTab === 'sequences' && (
            <div className="space-y-4">
              {sequences.map((seq) => (
                <Card key={seq.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{seq.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getSequenceStatusColor(seq.status))}
                        >
                          {seq.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-muted-foreground">Enrolled</div>
                        <div className="font-medium">{seq.leads_enrolled} leads</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Completion</div>
                        <div className="font-medium">{seq.completion_rate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Next Action</div>
                        <div className="font-medium truncate">{seq.next_action}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">
                <Plus className="w-3 h-3 mr-1" />
                Create New Sequence
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}