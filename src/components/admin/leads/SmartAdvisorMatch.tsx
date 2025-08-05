import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Target, TrendingUp, RefreshCw } from 'lucide-react';
import { Lead } from '@/types/lead';

interface SmartAdvisorMatchProps {
  lead: Lead;
}

interface AdvisorMatch {
  advisorId: string;
  advisorName: string;
  matchReason: string;
  conversionRate: number;
  avgResponseTime: number;
  confidence: number;
  specializations: string[];
}

export function SmartAdvisorMatch({ lead }: SmartAdvisorMatchProps) {
  const [advisorMatch, setAdvisorMatch] = useState<AdvisorMatch | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateAdvisorMatch();
  }, [lead]);

  const calculateAdvisorMatch = async () => {
    setLoading(true);
    
    // Simulate API call to get advisor match
    try {
      // This would typically call an AI service
      const match = await generateAdvisorMatch();
      setAdvisorMatch(match);
    } catch (error) {
      console.error('Failed to calculate advisor match:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAdvisorMatch = async (): Promise<AdvisorMatch> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock advisor data based on lead characteristics
    const advisors = [
      {
        advisorId: '1',
        advisorName: 'Sarah Johnson',
        conversionRate: 0.78,
        avgResponseTime: 45,
        specializations: ['International Students', 'Healthcare Programs']
      },
      {
        advisorId: '2',
        advisorName: 'Michael Chen',
        conversionRate: 0.82,
        avgResponseTime: 32,
        specializations: ['Technology Programs', 'Career Changers']
      },
      {
        advisorId: '3',
        advisorName: 'Emma Rodriguez',
        conversionRate: 0.75,
        avgResponseTime: 38,
        specializations: ['Business Programs', 'Working Professionals']
      }
    ];

    // Simple matching logic based on lead characteristics
    let bestMatch = advisors[0];
    let matchReason = 'Available with good performance history';
    let confidence = 65;

    // International students match
    if (lead.country && lead.country !== 'United States') {
      bestMatch = advisors[0]; // Sarah specializes in international students
      matchReason = 'Specializes in international student recruitment';
      confidence = 88;
    }
    // Tech-related programs
    else if (lead.program_interest?.some(p => 
      p.toLowerCase().includes('computer') || 
      p.toLowerCase().includes('technology') ||
      p.toLowerCase().includes('it')
    )) {
      bestMatch = advisors[1]; // Michael specializes in tech
      matchReason = 'Expert in technology programs and career transitions';
      confidence = 85;
    }
    // Business programs
    else if (lead.program_interest?.some(p => 
      p.toLowerCase().includes('business') || 
      p.toLowerCase().includes('management') ||
      p.toLowerCase().includes('mba')
    )) {
      bestMatch = advisors[2]; // Emma specializes in business
      matchReason = 'High success rate with business program applicants';
      confidence = 82;
    }

    return {
      ...bestMatch,
      matchReason,
      confidence
    };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 65) return 'text-blue-600';
    if (confidence >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return { label: 'High Match', variant: 'default' as const };
    if (confidence >= 65) return { label: 'Good Match', variant: 'secondary' as const };
    if (confidence >= 50) return { label: 'Fair Match', variant: 'outline' as const };
    return { label: 'Low Match', variant: 'destructive' as const };
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Smart Advisor Match
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!advisorMatch) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Smart Advisor Match
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">No advisor match available</p>
          <Button size="sm" variant="outline" onClick={calculateAdvisorMatch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const confidenceBadge = getConfidenceBadge(advisorMatch.confidence);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Smart Advisor Match
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{advisorMatch.advisorName}</p>
            <p className="text-xs text-muted-foreground">{advisorMatch.matchReason}</p>
          </div>
          <Badge variant={confidenceBadge.variant}>{confidenceBadge.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span className="text-muted-foreground">Conversion</span>
            </div>
            <p className="font-medium">{(advisorMatch.conversionRate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-muted-foreground">Response</span>
            </div>
            <p className="font-medium">{advisorMatch.avgResponseTime}min</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Specializations</p>
          <div className="flex flex-wrap gap-1">
            {advisorMatch.specializations.map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${getConfidenceColor(advisorMatch.confidence)}`}>
            {advisorMatch.confidence}% confidence
          </span>
          <Button size="sm" variant="outline" onClick={calculateAdvisorMatch}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}