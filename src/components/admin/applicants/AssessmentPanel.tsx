import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Applicant } from "@/types/applicant";
import { 
  Star, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Brain,
  Target,
  Award,
  BarChart3
} from "lucide-react";

interface AssessmentPanelProps {
  applicant: Applicant;
  onScoreUpdate: (category: string, score: number) => void;
  onNotesUpdate: (notes: string) => void;
}

export const AssessmentPanel: React.FC<AssessmentPanelProps> = ({
  applicant,
  onScoreUpdate,
  onNotesUpdate
}) => {
  const [assessmentNotes, setAssessmentNotes] = useState('');

  // Mock assessment data - in real app, this would come from props/API
  const assessmentCriteria = [
    {
      id: 'academic',
      name: 'Academic Performance',
      score: 85,
      weight: 30,
      maxScore: 100,
      description: 'GPA, test scores, academic achievements'
    },
    {
      id: 'essays',
      name: 'Personal Essays',
      score: 78,
      weight: 25,
      maxScore: 100,
      description: 'Writing quality, personal insight, motivation'
    },
    {
      id: 'experience',
      name: 'Relevant Experience',
      score: 72,
      weight: 20,
      maxScore: 100,
      description: 'Work experience, internships, projects'
    },
    {
      id: 'recommendations',
      name: 'Recommendations',
      score: 88,
      weight: 15,
      maxScore: 100,
      description: 'Quality and strength of recommendation letters'
    },
    {
      id: 'fit',
      name: 'Program Fit',
      score: 80,
      weight: 10,
      maxScore: 100,
      description: 'Alignment with program goals and values'
    }
  ];

  const calculateOverallScore = () => {
    const totalWeightedScore = assessmentCriteria.reduce((sum, criteria) => {
      return sum + (criteria.score * criteria.weight / 100);
    }, 0);
    return Math.round(totalWeightedScore);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'default' as const, text: 'Excellent' };
    if (score >= 80) return { variant: 'secondary' as const, text: 'Very Good' };
    if (score >= 70) return { variant: 'outline' as const, text: 'Good' };
    if (score >= 60) return { variant: 'outline' as const, text: 'Fair' };
    return { variant: 'destructive' as const, text: 'Poor' };
  };

  const overallScore = calculateOverallScore();
  const overallBadge = getScoreBadge(overallScore);

  // AI-powered insights
  const aiInsights = [
    {
      type: 'strength',
      title: 'Strong Academic Background',
      description: 'Applicant demonstrates excellent academic performance with consistent high grades.',
      confidence: 95
    },
    {
      type: 'concern',
      title: 'Limited Work Experience',
      description: 'Consider the impact of limited professional experience on program readiness.',
      confidence: 78
    },
    {
      type: 'opportunity',
      title: 'Great Cultural Fit',
      description: 'Personal statement shows strong alignment with program values and mission.',
      confidence: 88
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'concern': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Overall Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
            <Badge variant={overallBadge.variant} className="mt-2">
              {overallBadge.text}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-success">
                {assessmentCriteria.filter(c => c.score >= 80).length}
              </div>
              <div className="text-xs text-muted-foreground">Strong Areas</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-warning">
                {assessmentCriteria.filter(c => c.score >= 60 && c.score < 80).length}
              </div>
              <div className="text-xs text-muted-foreground">Good Areas</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-destructive">
                {assessmentCriteria.filter(c => c.score < 60).length}
              </div>
              <div className="text-xs text-muted-foreground">Areas of Concern</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detailed Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {assessmentCriteria.map((criteria) => (
            <div key={criteria.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{criteria.name}</h4>
                  <p className="text-sm text-muted-foreground">{criteria.description}</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getScoreColor(criteria.score)}`}>
                    {criteria.score}/{criteria.maxScore}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Weight: {criteria.weight}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress value={criteria.score} className="h-2" />
                <Slider
                  value={[criteria.score]}
                  onValueChange={([value]) => onScoreUpdate(criteria.id, value)}
                  max={criteria.maxScore}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              {criteria.id !== assessmentCriteria[assessmentCriteria.length - 1].id && (
                <Separator />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiInsights.map((insight, index) => (
            <Card key={index} className="border-l-4 border-l-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Confidence:
                      </span>
                      <Progress value={insight.confidence} className="h-1 w-20" />
                      <span className="text-xs text-muted-foreground">
                        {insight.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Assessment Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Add detailed assessment notes, observations, and recommendations..."
            value={assessmentNotes}
            onChange={(e) => setAssessmentNotes(e.target.value)}
            rows={4}
          />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Character count: {assessmentNotes.length}
            </span>
            <Button onClick={() => onNotesUpdate(assessmentNotes)}>
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Recommend for Approval</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">Flag for Review</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">Add to Waitlist</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Request Interview</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};