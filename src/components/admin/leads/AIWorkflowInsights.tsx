import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Zap,
  Users
} from "lucide-react";
import { AIWorkflowService, type AIWorkflowPrediction, type WorkflowOptimization } from "@/services/aiWorkflowService";
import { supabase } from "@/integrations/supabase/client";
import type { Lead } from "@/types/lead";

export function AIWorkflowInsights() {
  const [predictions, setPredictions] = useState<AIWorkflowPrediction[]>([]);
  const [optimizations, setOptimizations] = useState<WorkflowOptimization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    setIsLoading(true);
    try {
      // Get recent high-priority leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .in('status', ['new', 'contacted', 'qualified'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (leads) {
        // Generate AI predictions for each lead
        const predictions = await Promise.all(
          leads.map(lead => AIWorkflowService.predictLeadConversion(lead as any))
        );
        setPredictions(predictions);
      }

      // Get workflow optimizations
      const optimizations = await AIWorkflowService.generateWorkflowOptimizations();
      setOptimizations(optimizations);

    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLeadScore = async (leadId: string) => {
    try {
      await AIWorkflowService.updateLeadAIScore(leadId);
      await loadAIInsights(); // Refresh data
    } catch (error) {
      console.error('Error updating lead score:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const highPotentialLeads = predictions.filter(p => p.conversionProbability > 0.7);
  const atRiskLeads = predictions.filter(p => p.riskFactors.length > 0);
  const averageConversionProb = predictions.length > 0 ? 
    predictions.reduce((sum, p) => sum + p.conversionProbability, 0) / predictions.length : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI Workflow Insights
          </h2>
          <p className="text-sm text-muted-foreground">
            Intelligent predictions and optimization recommendations
          </p>
        </div>
        <Button onClick={loadAIInsights} variant="outline">
          <Zap className="h-4 w-4 mr-2" />
          Refresh Insights
        </Button>
      </div>

      {/* AI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">High Potential Leads</p>
              <p className="text-2xl font-bold text-foreground">{highPotentialLeads.length}</p>
              <p className="text-xs text-green-600">70%+ conversion probability</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">At-Risk Leads</p>
              <p className="text-2xl font-bold text-foreground">{atRiskLeads.length}</p>
              <p className="text-xs text-orange-600">Require immediate attention</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">{(averageConversionProb * 100).toFixed(1)}%</p>
              <Progress value={averageConversionProb * 100} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictions">Lead Predictions</TabsTrigger>
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Lead Conversion Predictions</CardTitle>
              <CardDescription>
                Machine learning predictions for your active leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div 
                    key={prediction.leadId}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLead === prediction.leadId ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setSelectedLead(
                      selectedLead === prediction.leadId ? null : prediction.leadId
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="font-medium text-foreground">Lead #{prediction.leadId.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">
                            Estimated {prediction.timeToConversion} days to convert
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            prediction.conversionProbability > 0.7 ? 'bg-green-100 text-green-800' :
                            prediction.conversionProbability > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {(prediction.conversionProbability * 100).toFixed(0)}% likely
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateLeadScore(prediction.leadId);
                          }}
                        >
                          Update Score
                        </Button>
                      </div>
                    </div>

                    {selectedLead === prediction.leadId && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Recommended Actions:</h4>
                          <ul className="space-y-1">
                            {prediction.recommendedActions.map((action, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {prediction.riskFactors.length > 0 && (
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Risk Factors:</h4>
                            <ul className="space-y-1">
                              {prediction.riskFactors.map((risk, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <AlertCircle className="h-3 w-3 text-orange-600" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {prediction.optimizationSuggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Optimization Tips:</h4>
                            <ul className="space-y-1">
                              {prediction.optimizationSuggestions.map((tip, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Lightbulb className="h-3 w-3 text-blue-600" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Optimizations</CardTitle>
              <CardDescription>
                AI-identified opportunities to improve your processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizations.map((optimization, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        optimization.impact === 'high' ? 'bg-red-100' :
                        optimization.impact === 'medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {optimization.type === 'routing' && <Users className="h-4 w-4" />}
                        {optimization.type === 'timing' && <Clock className="h-4 w-4" />}
                        {optimization.type === 'communication' && <Brain className="h-4 w-4" />}
                        {optimization.type === 'prioritization' && <Target className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground capitalize">
                            {optimization.type} Optimization
                          </h4>
                          <Badge className={
                            optimization.impact === 'high' ? 'bg-red-100 text-red-800' :
                            optimization.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {optimization.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {optimization.description}
                        </p>
                        <p className="text-sm text-foreground mb-2">
                          <strong>Implementation:</strong> {optimization.implementation}
                        </p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            Expected improvement: +{optimization.expectedImprovement}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {optimizations.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">All Systems Optimized</h3>
                    <p className="text-sm text-muted-foreground">
                      No immediate optimization opportunities detected. Your workflow is performing well!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Smart Routing Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-foreground">Advisor Match Accuracy</p>
                    <p className="text-xs text-muted-foreground">
                      AI routing achieves 89% optimal assignment rate
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-foreground">Response Time Prediction</p>
                    <p className="text-xs text-muted-foreground">
                      Current workload suggests 2.3h average response time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-foreground">Peak Performance Hours</p>
                    <p className="text-xs text-muted-foreground">
                      Best conversion rates between 10 AM - 2 PM
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-foreground">Communication Patterns</p>
                    <p className="text-xs text-muted-foreground">
                      Email follow-ups have 34% higher success rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}