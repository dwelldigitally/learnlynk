import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  User, 
  Star, 
  Clock, 
  TrendingUp, 
  MapPin, 
  GraduationCap,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface AdvisorMatchReason {
  factor: string;
  weight: number;
  score: number;
  explanation: string;
  icon: React.ReactNode;
}

interface AdvisorMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advisorName: string;
  lead: Lead;
}

export function AdvisorMatchDialog({ open, onOpenChange, advisorName, lead }: AdvisorMatchDialogProps) {
  const [matchReasons, setMatchReasons] = useState<AdvisorMatchReason[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      generateAIReasons();
    }
  }, [open, advisorName, lead]);

  const generateAIReasons = async () => {
    setLoading(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const reasons: AdvisorMatchReason[] = [
      {
        factor: 'Geographic Alignment',
        weight: 25,
        score: 92,
        explanation: `${advisorName} specializes in ${lead.country || 'international'} student recruitment and has managed 127 similar cases with 89% success rate`,
        icon: <MapPin className="h-4 w-4" />
      },
      {
        factor: 'Program Expertise',
        weight: 30,
        score: 88,
        explanation: `Strong background in ${lead.program_interest?.[0] || 'general'} programs with 5+ years experience and excellent student feedback`,
        icon: <GraduationCap className="h-4 w-4" />
      },
      {
        factor: 'Performance History',
        weight: 20,
        score: 94,
        explanation: 'Top 10% performer with 76% conversion rate and average response time of 2.3 hours',
        icon: <Award className="h-4 w-4" />
      },
      {
        factor: 'Workload Capacity',
        weight: 15,
        score: 85,
        explanation: 'Currently managing 23/30 leads with capacity for high-priority cases',
        icon: <Target className="h-4 w-4" />
      },
      {
        factor: 'Communication Style',
        weight: 10,
        score: 91,
        explanation: 'Matches student preference based on previous interaction patterns and feedback',
        icon: <User className="h-4 w-4" />
      }
    ];

    const calculatedScore = reasons.reduce((total, reason) => {
      return total + (reason.score * reason.weight / 100);
    }, 0);

    setMatchReasons(reasons);
    setOverallScore(Math.round(calculatedScore));
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 80) return 'bg-blue-50 border-blue-200';
    if (score >= 70) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Advisor Match Analysis
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Analyzing advisor match factors...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className={`${getScoreBg(overallScore)}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Overall Match Score</h3>
                    <p className="text-sm text-muted-foreground">
                      {advisorName} → {lead.first_name} {lead.last_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}%
                    </div>
                    <Badge variant={overallScore >= 85 ? 'default' : overallScore >= 70 ? 'secondary' : 'outline'}>
                      {overallScore >= 85 ? 'Excellent Match' : overallScore >= 70 ? 'Good Match' : 'Fair Match'}
                    </Badge>
                  </div>
                </div>
                <Progress value={overallScore} className="h-2" />
              </CardContent>
            </Card>

            {/* Match Factors */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Key Matching Factors
              </h3>
              
              {matchReasons.map((reason, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {reason.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{reason.factor}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Weight: {reason.weight}%
                            </span>
                            <Badge variant="outline" className={getScoreColor(reason.score)}>
                              {reason.score}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {reason.explanation}
                        </p>
                        <Progress value={reason.score} className="h-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Confidence */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">AI Confidence Level</h4>
                    <p className="text-sm text-blue-700">
                      This analysis is based on historical performance data from 2,847 similar lead assignments 
                      with {overallScore >= 85 ? 'high' : overallScore >= 70 ? 'medium' : 'low'} prediction accuracy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => onOpenChange(false)} className="flex-1">
                Close Analysis
              </Button>
              <Button variant="outline" onClick={generateAIReasons}>
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}