import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lead } from '@/types/lead';

interface CompactLeadScoreProps {
  lead: Lead;
  className?: string;
}

export function CompactLeadScore({ lead, className = '' }: CompactLeadScoreProps) {
  const [aiScore, setAiScore] = useState(lead.ai_score || 0);
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

    const totalScore = Math.round(completeness + sourceQuality + engagement + timing + behavior);
    
    setAiScore(totalScore);
    
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
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Hot', variant: 'default' as const };
    if (score >= 60) return { label: 'Warm', variant: 'secondary' as const };
    if (score >= 40) return { label: 'Cool', variant: 'outline' as const };
    return { label: 'Cold', variant: 'destructive' as const };
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  const badge = getScoreBadge(aiScore);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center justify-center w-16 h-16 rounded-full border-2 ${getScoreColor(aiScore)} ${className}`}>
            <div className="text-center">
              <div className="text-lg font-bold leading-none">{aiScore}</div>
              <div className="flex items-center justify-center mt-0.5">
                {getTrendIcon()}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="font-medium">AI Lead Score</span>
              <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              AI-powered conversion probability based on profile completeness, engagement level, timing, source quality, and behavior signals.
            </p>
            <div className="text-xs">
              <div className="font-medium">Score: {aiScore}/100</div>
              <div className="text-muted-foreground">
                Trend: {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}