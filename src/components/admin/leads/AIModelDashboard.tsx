import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  RefreshCw, 
  TrendingUp, 
  Database, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Sparkles,
  Target,
  Download,
  Play
} from 'lucide-react';
import { useAIScoring } from '@/hooks/useAIScoring';
import { cn } from '@/lib/utils';

export function AIModelDashboard() {
  const { 
    model, 
    trainingStats, 
    isTraining, 
    isBackfilling,
    isScoringAll,
    progress,
    trainModel, 
    loadModel, 
    loadTrainingStats,
    getModelAccuracy,
    backfillTrainingData,
    scoreAllLeads,
    trainAndScoreAll
  } = useAIScoring();
  
  const [accuracy, setAccuracy] = useState<{ total: number; accurate: number; accuracy_rate: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        loadModel(),
        loadTrainingStats(),
        getModelAccuracy().then(setAccuracy)
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [loadModel, loadTrainingStats, getModelAccuracy]);

  const handleTrainModel = async () => {
    await trainModel(true);
    await loadModel();
    const newAccuracy = await getModelAccuracy();
    setAccuracy(newAccuracy);
  };

  const handleBackfill = async () => {
    await backfillTrainingData();
    await loadTrainingStats();
  };

  const handleScoreAll = async () => {
    await scoreAllLeads();
  };

  const handleTrainAndScore = async () => {
    await trainAndScoreAll();
    await loadModel();
  };

  const modelType = model?.performance_metrics?.type;
  const isAITrained = modelType === 'ai_trained';
  const confidence = model?.performance_metrics?.confidence;
  const isProcessing = isTraining || isBackfilling || isScoringAll;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Scoring Model</h2>
          <p className="text-muted-foreground">
            Train and manage your institution's AI lead scoring model
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={handleBackfill} disabled={isProcessing}>
            <Download className={cn("h-4 w-4 mr-2", isBackfilling && "animate-pulse")} />
            {isBackfilling ? 'Backfilling...' : 'Backfill Data'}
          </Button>
          <Button variant="outline" onClick={handleScoreAll} disabled={isProcessing || !model}>
            <Play className={cn("h-4 w-4 mr-2", isScoringAll && "animate-pulse")} />
            {isScoringAll ? 'Scoring...' : 'Score All Leads'}
          </Button>
          <Button onClick={handleTrainAndScore} disabled={isProcessing}>
            <Brain className={cn("h-4 w-4 mr-2", isTraining && "animate-pulse")} />
            {isTraining ? 'Training...' : 'Train & Score'}
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      {progress && progress.total > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {isBackfilling ? 'Capturing training data...' : isScoringAll ? 'Scoring leads...' : 'Processing...'}
              </span>
              <span className="text-sm text-muted-foreground">
                {progress.completed} / {progress.total}
              </span>
            </div>
            <Progress value={(progress.completed / progress.total) * 100} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Model Status</p>
                <div className="flex items-center gap-2 mt-2">
                  {model ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-lg font-semibold">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <span className="text-lg font-semibold">Not Trained</span>
                    </>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Model Version</p>
                <p className="text-3xl font-bold mt-2">v{model?.model_version || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Training Data</p>
                <p className="text-3xl font-bold mt-2">{trainingStats?.total || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Accuracy</p>
                <p className="text-3xl font-bold mt-2">
                  {accuracy ? `${accuracy.accuracy_rate.toFixed(0)}%` : '—'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Training Data</TabsTrigger>
          <TabsTrigger value="weights">Feature Weights</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {isAITrained ? (
                    <>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">AI-Trained Model</p>
                        <p className="text-sm text-muted-foreground">
                          Learned from {model?.training_sample_size || 0} historical leads
                        </p>
                      </div>
                    </>
                  ) : model ? (
                    <>
                      <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Rule-Based Fallback</p>
                        <p className="text-sm text-muted-foreground">
                          Using predefined scoring rules (need more training data)
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">No Model</p>
                        <p className="text-sm text-muted-foreground">
                          Click "Train Model" to get started
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {confidence !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Model Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{(confidence * 100).toFixed(0)}%</span>
                      <Badge variant={confidence >= 0.7 ? 'default' : confidence >= 0.5 ? 'secondary' : 'destructive'}>
                        {confidence >= 0.7 ? 'High' : confidence >= 0.5 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                    <Progress value={confidence * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Based on pattern analysis of converted vs lost leads
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {model?.last_trained_at && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4" />
                    Last trained: {new Date(model.last_trained_at).toLocaleString()}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleTrainModel} disabled={isTraining}>
                    Retrain Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Data Requirements</CardTitle>
              <CardDescription>
                The AI model learns from your historical lead outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium">Converted Leads</span>
                  </div>
                  <p className="text-2xl font-bold">{trainingStats?.converted || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    {trainingStats && trainingStats.converted >= trainingStats.min_required
                      ? '✓ Sufficient data'
                      : `Need ${trainingStats?.min_required || 10} minimum`}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Lost Leads</span>
                  </div>
                  <p className="text-2xl font-bold">{trainingStats?.lost || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    {trainingStats && trainingStats.lost >= trainingStats.min_required
                      ? '✓ Sufficient data'
                      : `Need ${trainingStats?.min_required || 10} minimum`}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <p className="text-2xl font-bold">{trainingStats?.pending || 0}</p>
                  <p className="text-xs text-muted-foreground">
                    Leads without final outcome
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {trainingStats?.ready_for_training ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <span className="font-medium">Ready for AI training</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">More data needed for AI training</span>
                      </>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleBackfill} disabled={isProcessing}>
                    <Download className="h-4 w-4 mr-2" />
                    Backfill from Existing Leads
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {trainingStats?.ready_for_training
                    ? 'You have enough historical data to train an AI model'
                    : `Collect at least ${trainingStats?.min_required || 10} converted and ${trainingStats?.min_required || 10} lost leads. Use "Backfill" to capture data from existing leads.`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Weights</CardTitle>
              <CardDescription>
                How much each factor influences the AI score
              </CardDescription>
            </CardHeader>
            <CardContent>
              {model?.feature_weights && Object.keys(model.feature_weights).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(model.feature_weights)
                    .sort((a, b) => Math.abs(Number(b[1])) - Math.abs(Number(a[1])))
                    .slice(0, 15)
                    .map(([feature, weight]) => {
                      const numWeight = Number(weight);
                      const isPositive = numWeight > 0;
                      return (
                        <div key={feature} className="flex items-center gap-3">
                          <div className="w-40 text-sm truncate" title={feature}>
                            {feature.replace(/_/g, ' ')}
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <Progress 
                              value={Math.abs(numWeight) * 100} 
                              className={cn(
                                "h-2 flex-1",
                                isPositive ? "[&>div]:bg-emerald-500" : "[&>div]:bg-red-500"
                              )}
                            />
                            <span className={cn(
                              "text-sm font-medium w-16 text-right",
                              isPositive ? "text-emerald-600" : "text-red-600"
                            )}>
                              {isPositive ? '+' : ''}{(numWeight * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No feature weights available</p>
                  <p className="text-sm">Train the model to see feature weights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>
                Key patterns discovered by the AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              {model?.performance_metrics?.key_insights?.length ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Insights</h4>
                    <ul className="space-y-2">
                      {model.performance_metrics.key_insights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {model.performance_metrics.top_positive_factors?.length && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-emerald-600">Top Positive Indicators</h4>
                      <div className="flex flex-wrap gap-2">
                        {model.performance_metrics.top_positive_factors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="bg-emerald-50 text-emerald-700">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {model.performance_metrics.top_negative_factors?.length && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-red-600">Warning Signs</h4>
                      <div className="flex flex-wrap gap-2">
                        {model.performance_metrics.top_negative_factors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="bg-red-50 text-red-700">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No AI insights available yet</p>
                  <p className="text-sm">Train the model with sufficient data to see insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
