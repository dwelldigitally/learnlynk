import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, Star, TrendingUp, User, Mail, Phone } from 'lucide-react';

interface StudentHistoryItem {
  id: string;
  type: 'action' | 'communication' | 'journey_transition' | 'status_change';
  timestamp: string;
  title: string;
  description: string;
  outcome?: 'success' | 'failed' | 'pending';
  metadata?: Record<string, any>;
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  program: string;
  yield_score: number;
  revenue_potential: number;
  current_stage: string;
  journey_name?: string;
  last_contact?: string;
  total_interactions: number;
  conversion_probability: number;
}

interface StudentHistoryPanelProps {
  student: StudentProfile;
  history: StudentHistoryItem[];
}

export function StudentHistoryPanel({ student, history }: StudentHistoryPanelProps) {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'action': return <Star className="h-3 w-3" />;
      case 'communication': return <Mail className="h-3 w-3" />;
      case 'journey_transition': return <TrendingUp className="h-3 w-3" />;
      case 'status_change': return <User className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {/* Student Profile Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <User className="h-4 w-4" />
            <span>Student Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-medium text-sm">{student.name}</div>
              <div className="text-xs text-muted-foreground flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>{student.email}</span>
              </div>
              {student.phone && (
                <div className="text-xs text-muted-foreground flex items-center space-x-1">
                  <Phone className="h-3 w-3" />
                  <span>{student.phone}</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Program</div>
              <div className="text-sm font-medium">{student.program}</div>
              {student.journey_name && (
                <>
                  <div className="text-xs text-muted-foreground">Journey</div>
                  <div className="text-sm">{student.journey_name}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{student.yield_score}%</div>
              <div className="text-xs text-muted-foreground">Yield Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">${(student.revenue_potential / 1000).toFixed(0)}K</div>
              <div className="text-xs text-muted-foreground">Revenue Potential</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{student.conversion_probability}%</div>
              <div className="text-xs text-muted-foreground">Conversion Probability</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <Badge variant="outline" className="text-xs">
                {student.current_stage}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {student.total_interactions} interactions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interaction History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Calendar className="h-4 w-4" />
            <span>Interaction History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {history.map((item, index) => (
                <div key={item.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="flex-shrink-0 p-1 bg-muted rounded-full">
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm truncate">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1 line-clamp-2">
                      {item.description}
                    </div>
                    {item.outcome && (
                      <Badge variant="outline" className={`text-xs ${getOutcomeColor(item.outcome)}`}>
                        {item.outcome}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {history.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No interaction history available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}