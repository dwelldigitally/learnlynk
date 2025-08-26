import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, DollarSign, TrendingUp, Star, Clock } from 'lucide-react';

interface StudentAction {
  id: string;
  action_type: string;
  instruction: string;
  priority: number;
  scheduled_at: string;
  reason_chips?: string[];
  metadata: {
    student_name?: string;
    program?: string;
    yield_score?: number;
    conversion_stage?: 'lead' | 'applicant' | 'enrolled';
    revenue_potential?: number;
    // Journey/Play Traceability
    journey_name?: string;
    stage_name?: string;
    play_name?: string;
    play_category?: string;
    generation_source?: string;
    journey_context?: boolean;
  };
}

interface ConversionOpportunitiesWidgetProps {
  actions: StudentAction[];
  onCompleteAction: (actionId: string) => void;
}

export function ConversionOpportunitiesWidget({ actions, onCompleteAction }: ConversionOpportunitiesWidgetProps) {
  const isOverdue = (scheduledAt: string) => new Date(scheduledAt) < new Date();
  
  // Sort by revenue potential and urgency
  const sortedActions = actions.sort((a, b) => {
    const aRevenue = a.metadata?.revenue_potential || 0;
    const bRevenue = b.metadata?.revenue_potential || 0;
    const aOverdue = isOverdue(a.scheduled_at);
    const bOverdue = isOverdue(b.scheduled_at);
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return bRevenue - aRevenue; // Higher revenue first
  });

  const isDepositReady = (action: StudentAction) => {
    return action.reason_chips?.some(chip => 
      chip.toLowerCase().includes('deposit') || 
      chip.toLowerCase().includes('payment') ||
      chip.toLowerCase().includes('enroll')
    );
  };

  const isDecisionPending = (action: StudentAction) => {
    return action.reason_chips?.some(chip => 
      chip.toLowerCase().includes('decision') || 
      chip.toLowerCase().includes('consideration') ||
      chip.toLowerCase().includes('thinking')
    );
  };

  return (
    <Card className="border-yellow-200 bg-yellow-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2 text-yellow-700">
            <Target className="h-4 w-4" />
            <span>🎯 Conversion Opportunities</span>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
            {actions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversion opportunities</p>
          </div>
        ) : (
          sortedActions.slice(0, 4).map((action) => {
            const overdue = isOverdue(action.scheduled_at);
            const depositReady = isDepositReady(action);
            const decisionPending = isDecisionPending(action);
            const revenuePotential = action.metadata?.revenue_potential || 0;
            
            return (
              <div 
                key={action.id}
                className={`p-3 rounded-lg border ${
                  overdue 
                    ? 'bg-red-100 border-red-300' 
                    : depositReady
                    ? 'bg-green-100 border-green-300'
                    : 'bg-white border-yellow-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {action.metadata?.student_name || 'Student'}
                      </span>
                      
                      {depositReady && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                          <DollarSign className="h-2 w-2 mr-1" />
                          Deposit Ready
                        </Badge>
                      )}
                      
                      {decisionPending && !depositReady && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                          <Clock className="h-2 w-2 mr-1" />
                          Decision Pending
                        </Badge>
                      )}
                      
                      {overdue && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                      {action.instruction}
                    </p>
                    
                    {/* Journey/Play Context */}
                    {(action.metadata?.play_name || action.metadata?.journey_context) && (
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        {action.metadata?.journey_context && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            🎯 {action.metadata.stage_name || 'Journey'}
                          </Badge>
                        )}
                        {action.metadata?.play_name && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            ⚡ {action.metadata.play_name}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <span>{action.metadata?.program || 'Unknown Program'}</span>
                        
                        {action.metadata?.yield_score && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-2 w-2" />
                              <span>{action.metadata.yield_score}% yield</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {revenuePotential > 0 && (
                        <div className="flex items-center space-x-1 text-green-600 font-medium">
                          <TrendingUp className="h-2 w-2" />
                          <span>${(revenuePotential / 1000).toFixed(0)}K</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={depositReady ? "default" : overdue ? "destructive" : "outline"}
                    className={`ml-2 h-6 px-2 text-xs ${
                      depositReady ? 'bg-green-600 hover:bg-green-700' :
                      overdue ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-yellow-100'
                    }`}
                    onClick={() => onCompleteAction(action.id)}
                  >
                    {depositReady ? 'Convert' : 'Follow Up'}
                  </Button>
                </div>
              </div>
            );
          })
        )}
        
        {actions.length > 4 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-yellow-700 hover:bg-yellow-100">
              View all {actions.length} opportunities →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}