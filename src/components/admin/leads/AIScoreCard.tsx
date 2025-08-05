import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Info } from 'lucide-react';
import { Lead } from '@/types/lead';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AIScoreCardProps {
  lead: Lead;
  expanded?: boolean;
}

export function AIScoreCard({ lead, expanded = false }: AIScoreCardProps) {
  const [aiScore, setAiScore] = useState(lead.ai_score || 0);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    engagement: 0,
    profile_completeness: 0,
    timing: 0,
    source_quality: 0,
    behavior: 0
  });
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    // Calculate AI score based on various factors
    calculateAIScore();
  }, [lead]);

  const calculateAIScore = () => {
    // Profile completeness (0-20 points)
    const completeness = calculateProfileCompleteness();
    
    // Source quality (0-20 points)
    const sourceQuality = calculateSourceQuality();
    
    // Engagement (0-25 points)
    const engagement = calculateEngagement();
    
    // Timing (0-20 points)
    const timing = calculateTiming();
    
    // Behavior (0-15 points)
    const behavior = calculateBehavior();

    const breakdown = {
      profile_completeness: completeness,
      source_quality: sourceQuality,
      engagement,
      timing,
      behavior
    };

    const totalScore = Math.round(completeness + sourceQuality + engagement + timing + behavior);
    
    setAiScore(totalScore);
    setScoreBreakdown(breakdown);
    
    // Determine trend (simplified - would be based on historical data)
    if (totalScore > 70) setTrend('up');
    else if (totalScore < 40) setTrend('down');
    else setTrend('stable');
  };

  const calculateProfileCompleteness = (): number => {
    let score = 0;
    if (lead.first_name && lead.last_name) score += 5;
    if (lead.email) score += 5;
    if (lead.phone) score += 3;
    if (lead.country) score += 2;
    if (lead.program_interest && lead.program_interest.length > 0) score += 5;
    return score;
  };

  const calculateSourceQuality = (): number => {
    const sourceScores: Record<string, number> = {
      'web': 15,
      'referral': 20,
      'agent': 18,
      'event': 16,
      'social_media': 12,
      'ads': 10,
      'forms': 14,
      'chatbot': 11,
      'email': 13,
      'phone': 17,
      'walk_in': 19,
      'api_import': 8,
      'csv_import': 6
    };
    return sourceScores[lead.source] || 10;
  };

  const calculateEngagement = (): number => {
    let score = 10; // Base score
    
    // Priority level indicates some level of qualification
    if (lead.priority === 'high') score += 8;
    else if (lead.priority === 'urgent') score += 12;
    else if (lead.priority === 'medium') score += 5;
    else score += 2;
    
    // UTM parameters suggest intentional engagement
    if (lead.utm_campaign || lead.utm_source) score += 5;
    
    return Math.min(score, 25);
  };

  const calculateTiming = (): number => {
    const now = new Date();
    const created = new Date(lead.created_at);
    const hoursSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    
    // Fresher leads get higher scores
    if (hoursSinceCreated < 1) return 20;
    if (hoursSinceCreated < 24) return 15;
    if (hoursSinceCreated < 72) return 10;
    if (hoursSinceCreated < 168) return 5; // 1 week
    return 2;
  };

  const calculateBehavior = (): number => {
    let score = 5; // Base score
    
    // Status progression indicates positive behavior
    if (lead.status === 'contacted') score += 3;
    else if (lead.status === 'qualified') score += 7;
    else if (lead.status === 'nurturing') score += 5;
    else if (lead.status === 'converted') score += 10;
    
    // Notes suggest advisor interaction
    if (lead.notes && lead.notes.length > 10) score += 2;
    
    return Math.min(score, 15);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Hot', variant: 'default' as const };
    if (score >= 60) return { label: 'Warm', variant: 'secondary' as const };
    if (score >= 40) return { label: 'Cool', variant: 'outline' as const };
    return { label: 'Cold', variant: 'destructive' as const };
  };

  const badge = getScoreBadge(aiScore);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI Lead Score
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>AI-powered conversion probability based on multiple factors</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getScoreColor(aiScore)}`}>
              {aiScore}
            </span>
            <span className="text-sm text-muted-foreground">/100</span>
            <TrendingUp className={`h-4 w-4 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>

        <Progress value={aiScore} className="h-2" />

        {expanded && (
          <div className="space-y-3 mt-4">
            <h4 className="text-sm font-medium">Score Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Profile Completeness</span>
                <span className="text-xs font-medium">{scoreBreakdown.profile_completeness}/20</span>
              </div>
              <Progress value={(scoreBreakdown.profile_completeness / 20) * 100} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Source Quality</span>
                <span className="text-xs font-medium">{scoreBreakdown.source_quality}/20</span>
              </div>
              <Progress value={(scoreBreakdown.source_quality / 20) * 100} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Engagement Level</span>
                <span className="text-xs font-medium">{scoreBreakdown.engagement}/25</span>
              </div>
              <Progress value={(scoreBreakdown.engagement / 25) * 100} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Timing Factor</span>
                <span className="text-xs font-medium">{scoreBreakdown.timing}/20</span>
              </div>
              <Progress value={(scoreBreakdown.timing / 20) * 100} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Behavior Signals</span>
                <span className="text-xs font-medium">{scoreBreakdown.behavior}/15</span>
              </div>
              <Progress value={(scoreBreakdown.behavior / 15) * 100} className="h-1" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}