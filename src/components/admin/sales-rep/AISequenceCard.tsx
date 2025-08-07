import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Users, 
  Mail, 
  Play,
  Pause,
  Settings,
  Plus,
  ArrowRight,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

interface AISequence {
  id: string;
  name: string;
  type: 'nurture' | 'onboarding' | 'reactivation' | 'follow_up';
  status: 'active' | 'paused' | 'draft';
  leads_enrolled: number;
  completion_rate: number;
  next_action: string;
  next_action_time: string;
  ai_suggestion?: string;
  color: string;
}

export function AISequenceCard() {
  const isMobile = useIsMobile();
  const [sequences, setSequences] = useState<AISequence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    try {
      // Mock AI sequences with suggestions
      const mockSequences: AISequence[] = [
        {
          id: '1',
          name: 'MBA Inquiry Nurture',
          type: 'nurture',
          status: 'active',
          leads_enrolled: 24,
          completion_rate: 68,
          next_action: 'Send follow-up email',
          next_action_time: '2:00 PM',
          ai_suggestion: 'AI suggests adding personalized program comparison for better engagement',
          color: 'bg-gradient-to-br from-green-500 to-green-600'
        },
        {
          id: '2',
          name: 'Application Onboarding',
          type: 'onboarding',
          status: 'active',
          leads_enrolled: 12,
          completion_rate: 85,
          next_action: 'Schedule intake calls',
          next_action_time: '4:00 PM',
          color: 'bg-gradient-to-br from-blue-500 to-blue-600'
        },
        {
          id: '3',
          name: 'Dormant Lead Reactivation',
          type: 'reactivation',
          status: 'paused',
          leads_enrolled: 8,
          completion_rate: 45,
          next_action: 'Review and optimize',
          next_action_time: 'Paused',
          ai_suggestion: 'AI recommends updating email templates - current open rate is below industry average',
          color: 'bg-gradient-to-br from-orange-500 to-orange-600'
        }
      ];
      
      setSequences(mockSequences);
    } catch (error) {
      console.error('Failed to load sequences:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      case 'draft': return <Settings className="w-3 h-3" />;
      default: return <Play className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-orange-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Sequences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-24"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600" />
          AI Sequences
          <Badge variant="secondary" className="ml-auto">
            {sequences.filter(s => s.status === 'active').length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Sequences */}
        <div className="space-y-3">
          {sequences.slice(0, 2).map((sequence) => (
            <div
              key={sequence.id}
              className={cn(
                "relative p-4 rounded-lg text-white overflow-hidden",
                sequence.color
              )}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2">
                  <Zap className="w-8 h-8" />
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1 rounded", getStatusColor(sequence.status))}>
                      {getStatusIcon(sequence.status)}
                    </div>
                    <h4 className="font-medium text-sm">{sequence.name}</h4>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                    {sequence.leads_enrolled} leads
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span>Completion Rate</span>
                    <span>{sequence.completion_rate}%</span>
                  </div>
                  <Progress 
                    value={sequence.completion_rate} 
                    className="h-1.5 bg-white/20"
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Next: {sequence.next_action_time}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-white hover:bg-white/20">
                    Manage
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        {sequences.some(s => s.ai_suggestion) && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Brain className="w-3 h-3" />
              AI Suggestions
            </h4>
            {sequences
              .filter(s => s.ai_suggestion)
              .map((sequence) => (
                <div
                  key={`suggestion-${sequence.id}`}
                  className="p-3 bg-purple-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-purple-100 rounded">
                      <Brain className="w-3 h-3 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-purple-800 mb-2">
                        {sequence.ai_suggestion}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-6 px-2 text-xs border-purple-300 text-purple-700 hover:bg-purple-100">
                          Apply
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-purple-600 hover:bg-purple-100">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Plus className="w-3 h-3 mr-1" />
            New Sequence
          </Button>
          <Button size="sm" variant="ghost">
            <Target className="w-3 h-3 mr-1" />
            Templates
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {sequences.reduce((sum, s) => sum + s.leads_enrolled, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {Math.round(sequences.reduce((sum, s) => sum + s.completion_rate, 0) / sequences.length)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg. Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {sequences.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}