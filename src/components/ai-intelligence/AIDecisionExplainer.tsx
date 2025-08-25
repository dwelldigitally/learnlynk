import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Eye, BarChart3 } from 'lucide-react';
import { AIDecisionService } from '@/services/aiDecisionService';
import { AIDecisionLog, AIDecisionExplanation } from '@/types/aiDecisionIntelligence';

interface AIDecisionExplainerProps {
  decisionId?: string;
  showRecentDecisions?: boolean;
}

export function AIDecisionExplainer({ decisionId, showRecentDecisions = true }: AIDecisionExplainerProps) {
  const [decisions, setDecisions] = useState<AIDecisionLog[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<AIDecisionLog | null>(null);
  const [explanation, setExplanation] = useState<AIDecisionExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showRecentDecisions) {
      loadRecentDecisions();
    }
    if (decisionId) {
      loadDecisionExplanation(decisionId);
    }
  }, [decisionId, showRecentDecisions]);

  const loadRecentDecisions = async () => {
    try {
      setIsLoading(true);
      const data = await AIDecisionService.getDecisionLogs({ 
        date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() 
      });
      setDecisions(data.slice(0, 10)); // Show last 10 decisions
    } catch (error) {
      console.error('Error loading decisions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDecisionExplanation = async (id: string) => {
    try {
      setIsLoading(true);
      const explanationData = await AIDecisionService.explainDecision(id);
      setExplanation(explanationData);
    } catch (error) {
      console.error('Error loading explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainDecision = async (decision: AIDecisionLog) => {
    setSelectedDecision(decision);
    await loadDecisionExplanation(decision.id);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInfluenceIcon = (influence: string) => {
    switch (influence) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle2 className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">AI Decision Intelligence</h2>
      </div>

      {showRecentDecisions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Recent AI Decisions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {decisions.map((decision) => (
                <div key={decision.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{decision.decision_type}</Badge>
                      <span className="font-medium">{decision.recommended_action}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <span>Confidence: <span className={getConfidenceColor(decision.confidence_score)}>
                        {(decision.confidence_score * 100).toFixed(0)}%
                      </span></span>
                      <span>{new Date(decision.created_at).toLocaleDateString()}</span>
                      {decision.executed && (
                        <Badge variant="secondary" className="text-xs">Executed</Badge>
                      )}
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExplainDecision(decision)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Explain
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>AI Decision Explanation</DialogTitle>
                      </DialogHeader>
                      {explanation && (
                        <div className="space-y-6">
                          {/* Primary Reasoning */}
                          <Card>
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Brain className="h-5 w-5 text-primary" />
                                  <h3 className="font-semibold">Primary Reasoning</h3>
                                </div>
                                <p className="text-muted-foreground">{explanation.primary_reasoning}</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                      {(explanation.confidence_breakdown.data_quality * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">Data Quality</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                      {(explanation.confidence_breakdown.historical_patterns * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">Historical Patterns</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                      {(explanation.confidence_breakdown.urgency_factors * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">Urgency Factors</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                      {(explanation.confidence_breakdown.program_alignment * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">Program Alignment</div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Tabs defaultValue="factors" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="factors">Contributing Factors</TabsTrigger>
                              <TabsTrigger value="alternatives">Alternative Actions</TabsTrigger>
                              <TabsTrigger value="trust">Trust Indicators</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="factors" className="space-y-4">
                              {explanation.contributing_factors.map((factor, index) => (
                                <Card key={index}>
                                  <CardContent className="pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        {getInfluenceIcon(factor.influence)}
                                        <span className="font-medium">{factor.factor}</span>
                                      </div>
                                      <Badge variant="outline">
                                        Weight: {(factor.weight * 100).toFixed(0)}%
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground mb-2">
                                      Value: <span className="font-medium">{factor.value}</span>
                                    </div>
                                    <Progress value={factor.weight * 100} className="h-2 mb-2" />
                                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </TabsContent>

                            <TabsContent value="alternatives" className="space-y-4">
                              {explanation.alternative_actions.map((alt, index) => (
                                <Card key={index}>
                                  <CardContent className="pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium">{alt.action}</span>
                                      <Badge variant="secondary">
                                        {(alt.probability * 100).toFixed(0)}% probability
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{alt.why_not_chosen}</p>
                                    <Progress value={alt.probability * 100} className="h-2 mt-2" />
                                  </CardContent>
                                </Card>
                              ))}
                            </TabsContent>

                            <TabsContent value="trust" className="space-y-4">
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                      <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {explanation.trust_indicators.similar_decisions_count}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Similar Decisions Made
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-3xl font-bold text-green-600 mb-2">
                                        {(explanation.trust_indicators.success_rate * 100).toFixed(0)}%
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Historical Success Rate
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-3xl font-bold text-purple-600 mb-2">
                                        {(explanation.trust_indicators.data_completeness * 100).toFixed(0)}%
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Data Completeness
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}