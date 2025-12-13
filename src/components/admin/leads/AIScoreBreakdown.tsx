import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, RefreshCw, TrendingUp, TrendingDown, Minus, Info, Sparkles, History } from 'lucide-react';
import { useAIScoring } from '@/hooks/useAIScoring';
import { AIScoreBreakdown as ScoreBreakdownType } from '@/services/aiScoringService';
import { cn } from '@/lib/utils';

interface AIScoreBreakdownProps {
  leadId: string;
  currentScore?: number;
  currentBreakdown?: ScoreBreakdownType[];
  compact?: boolean;
  onScoreUpdate?: (newScore: number) => void;
}

export function AIScoreBreakdown({ 
  leadId, 
  currentScore, 
  currentBreakdown,
  compact = false,
  onScoreUpdate 
}: AIScoreBreakdownProps) {
  const { calculateScore, isCalculating, getScoreHistory } = useAIScoring();
  const [score, setScore] = useState<number | null>(currentScore ?? null);
  const [breakdown, setBreakdown] = useState<ScoreBreakdownType[]>(currentBreakdown || []);
  const [history, setHistory] = useState<Array<{ ai_score: number; calculated_at: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (currentScore !== undefined) setScore(currentScore);
    if (currentBreakdown) setBreakdown(currentBreakdown);
  }, [currentScore, currentBreakdown]);

  const handleRefresh = async () => {
    const result = await calculateScore(leadId);
    if (result?.success) {
      setScore(result.ai_score);
      setBreakdown(result.score_breakdown);
      onScoreUpdate?.(result.ai_score);
    }
  };

  const loadHistory = async () => {
    const historyData = await getScoreHistory(leadId);
    setHistory(historyData);
    setShowHistory(true);
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-600';
    if (s >= 60) return 'text-blue-600';
    if (s >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 60) return 'bg-blue-500';
    if (s >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Hot Lead';
    if (s >= 60) return 'Warm Lead';
    if (s >= 40) return 'Cool Lead';
    return 'Cold Lead';
  };

  const getImpactIcon = (impact: string) => {
    if (impact === 'positive') return <TrendingUp className="h-3 w-3 text-emerald-500" />;
    if (impact === 'negative') return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const positiveFactors = breakdown.filter(b => b.impact === 'positive').slice(0, 5);
  const negativeFactors = breakdown.filter(b => b.impact === 'negative').slice(0, 3);

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className={cn("flex items-center gap-1", getScoreColor(score || 0))}>
                <Brain className="h-4 w-4" />
                <span className="font-semibold">{score ?? '—'}</span>
              </div>
              {score !== null && (
                <Badge variant="outline" className="text-xs">
                  {getScoreLabel(score)}
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-72 p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">AI Score Breakdown</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2"
                  onClick={handleRefresh}
                  disabled={isCalculating}
                >
                  <RefreshCw className={cn("h-3 w-3", isCalculating && "animate-spin")} />
                </Button>
              </div>
              {positiveFactors.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Positive factors:</span>
                  {positiveFactors.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="truncate">{f.label}</span>
                      <span className="text-emerald-600 font-medium">+{f.points.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
              {negativeFactors.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Negative factors:</span>
                  {negativeFactors.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="truncate">{f.label}</span>
                      <span className="text-red-600 font-medium">{f.points.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">AI Lead Score</CardTitle>
              <p className="text-xs text-muted-foreground">Machine learning powered</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={loadHistory}
              className="h-8 px-2"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isCalculating}
              className="h-8"
            >
              <RefreshCw className={cn("h-4 w-4 mr-1", isCalculating && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold text-white",
            getScoreBgColor(score || 0)
          )}>
            {score ?? '—'}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Badge className={cn(
                score && score >= 60 ? 'bg-emerald-100 text-emerald-800' : 
                score && score >= 40 ? 'bg-amber-100 text-amber-800' : 
                'bg-red-100 text-red-800'
              )}>
                {score !== null ? getScoreLabel(score) : 'Not calculated'}
              </Badge>
              {score !== null && (
                <span className="text-sm text-muted-foreground">
                  Top {score >= 80 ? '10%' : score >= 60 ? '30%' : score >= 40 ? '50%' : '70%'}
                </span>
              )}
            </div>
            <Progress value={score || 0} className="h-2" />
          </div>
        </div>

        {/* Score Breakdown */}
        {breakdown.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Info className="h-4 w-4" />
              Why this score?
            </div>
            
            {positiveFactors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
                  Positive Factors
                </span>
                {positiveFactors.map((factor, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30"
                  >
                    <div className="flex items-center gap-2">
                      {getImpactIcon(factor.impact)}
                      <span className="text-sm">{factor.label}</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      +{factor.points.toFixed(1)} pts
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {negativeFactors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
                  Areas to Improve
                </span>
                {negativeFactors.map((factor, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/30"
                  >
                    <div className="flex items-center gap-2">
                      {getImpactIcon(factor.impact)}
                      <span className="text-sm">{factor.label}</span>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                      {factor.points.toFixed(1)} pts
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Score History */}
        {showHistory && history.length > 0 && (
          <div className="space-y-2 pt-3 border-t">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Score History
            </span>
            <div className="space-y-1">
              {history.slice(0, 5).map((h, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(h.calculated_at).toLocaleDateString()}
                  </span>
                  <span className={cn("font-medium", getScoreColor(h.ai_score))}>
                    {h.ai_score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {breakdown.length === 0 && score === null && (
          <div className="text-center py-4 text-muted-foreground">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click "Refresh" to calculate AI score</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
