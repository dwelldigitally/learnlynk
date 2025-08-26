import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Sparkles, 
  Clock, 
  Target, 
  TrendingUp, 
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Star,
  ChevronRight
} from 'lucide-react';

interface AIRecommendation {
  id: string;
  type: 'message' | 'timing' | 'alternative_action' | 'follow_up';
  title: string;
  description: string;
  confidence_score: number;
  reasoning: string;
  suggested_content?: string;
  optimal_timing?: string;
  success_probability: number;
  estimated_impact: 'low' | 'medium' | 'high';
}

interface StudentContext {
  id: string;
  name: string;
  yield_score: number;
  last_interaction: string;
  engagement_level: 'low' | 'medium' | 'high';
  preferred_channel: 'email' | 'phone' | 'sms';
  timezone: string;
  response_patterns: {
    best_time: string;
    avg_response_time: number;
    preferred_day: string;
  };
}

interface AIRecommendationsPanelProps {
  recommendations: AIRecommendation[];
  students: StudentContext[];
  selectedActionType: string;
  onApplyRecommendation: (recommendationId: string, content?: string) => void;
}

export function AIRecommendationsPanel({ 
  recommendations, 
  students, 
  selectedActionType,
  onApplyRecommendation 
}: AIRecommendationsPanelProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-3 w-3" />;
      case 'timing': return <Clock className="h-3 w-3" />;
      case 'alternative_action': return <Target className="h-3 w-3" />;
      case 'follow_up': return <ChevronRight className="h-3 w-3" />;
      default: return <Sparkles className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Insights Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Brain className="h-4 w-4 text-primary" />
            <span>AI Recommendations</span>
            <Badge variant="outline" className="text-xs">
              {selectedActionType} Action
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              {getActionIcon(selectedActionType)}
              <span>Optimizing for {selectedActionType} actions</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>{students.length} students selected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Star className="h-4 w-4" />
            <span>Student Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {students.slice(0, 3).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <div className="font-medium text-sm">{student.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Last interaction: {student.last_interaction} • Prefers: {student.preferred_channel}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {student.yield_score}% yield
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Best time: {student.response_patterns.best_time}
                    </div>
                  </div>
                </div>
              ))}
              {students.length > 3 && (
                <div className="text-center text-xs text-muted-foreground py-1">
                  +{students.length - 3} more students
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Sparkles className="h-4 w-4" />
            <span>Smart Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(rec.type)}
                      <span className="font-medium text-sm">{rec.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getConfidenceColor(rec.confidence_score)}`}>
                        {rec.confidence_score}% confidence
                      </Badge>
                      <Badge className={`text-xs ${getImpactColor(rec.estimated_impact)}`}>
                        {rec.estimated_impact} impact
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                  
                  {rec.suggested_content && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium">Suggested Content:</div>
                      <Textarea 
                        value={rec.suggested_content}
                        readOnly
                        className="text-xs h-16 resize-none"
                      />
                    </div>
                  )}
                  
                  {rec.optimal_timing && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Optimal timing: {rec.optimal_timing}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      {rec.success_probability}% success probability
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-6"
                      onClick={() => onApplyRecommendation(rec.id, rec.suggested_content)}
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                  
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View AI reasoning
                    </summary>
                    <div className="mt-2 p-2 bg-muted/50 rounded text-muted-foreground">
                      {rec.reasoning}
                    </div>
                  </details>
                </div>
              ))}
              
              {recommendations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No AI recommendations available</p>
                  <p className="text-xs">Recommendations will appear based on student data and action type</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}