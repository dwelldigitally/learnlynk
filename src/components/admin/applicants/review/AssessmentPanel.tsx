import React from 'react';
import { ReviewSession } from '@/types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Users, AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface AssessmentPanelProps {
  applicantId: string;
  session: ReviewSession;
}

// Mock AI insights data
const mockAIInsights = {
  overallAssessment: {
    score: 87,
    confidence: 0.92,
    recommendation: 'Strong candidate with high potential'
  },
  graduationLikelihood: {
    score: 89,
    factors: [
      { factor: 'Academic Performance', weight: 0.35, score: 92 },
      { factor: 'Prior Experience', weight: 0.25, score: 88 },
      { factor: 'Time Management', weight: 0.20, score: 85 },
      { factor: 'Financial Stability', weight: 0.20, score: 90 }
    ],
    riskFactors: ['Heavy work schedule may impact study time'],
    strengths: ['Strong academic foundation', 'Relevant work experience', 'Financial preparedness']
  },
  enrollmentLikelihood: {
    score: 78,
    factors: [
      { factor: 'Program Interest', weight: 0.30, score: 85 },
      { factor: 'Financial Readiness', weight: 0.25, score: 90 },
      { factor: 'Geographic Proximity', weight: 0.20, score: 65 },
      { factor: 'Alternative Options', weight: 0.25, score: 70 }
    ],
    riskFactors: ['Located far from campus', 'Applied to competitive alternative programs'],
    strengths: ['High program interest', 'Financial capability', 'Strong motivation']
  },
  behavioralInsights: {
    communicationStyle: 'Professional and articulate',
    motivation: 'High - clear career goals',
    adaptability: 'Good - shown resilience in past challenges',
    teamwork: 'Excellent - leadership roles in volunteer work'
  },
  predictiveMetrics: {
    expectedGPA: 3.7,
    completionTimeframe: '24 months (on-time)',
    employmentProspects: 'Excellent',
    alumniSimilarity: 85
  }
};

export function AssessmentPanel({ applicantId, session }: AssessmentPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">AI Insights</h2>
        <Badge variant="secondary" className="text-xs">
          {Math.round(mockAIInsights.overallAssessment.confidence * 100)}% Confidence
        </Badge>
      </div>
      
      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Overall Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(mockAIInsights.overallAssessment.score)}`}>
                {mockAIInsights.overallAssessment.score}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="flex-1 ml-6">
              <p className="text-sm text-muted-foreground mb-2">AI Recommendation:</p>
              <p className="font-medium">{mockAIInsights.overallAssessment.recommendation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graduation Likelihood */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Likelihood to Graduate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(mockAIInsights.graduationLikelihood.score)}`}>
                  {mockAIInsights.graduationLikelihood.score}%
                </div>
                <div className="text-xs text-muted-foreground">Predicted Success Rate</div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-medium text-muted-foreground">Contributing Factors:</div>
                {mockAIInsights.graduationLikelihood.factors.map((factor, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs">{factor.factor}</span>
                      <span className={`text-xs font-medium ${getScoreColor(factor.score)}`}>
                        {factor.score}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={factor.score} className="h-1 flex-1" />
                      <span className="text-xs text-muted-foreground w-8">
                        {Math.round(factor.weight * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-green-700">Strengths:</div>
                {mockAIInsights.graduationLikelihood.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    {strength}
                  </div>
                ))}
              </div>

              {mockAIInsights.graduationLikelihood.riskFactors.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-amber-700">Risk Factors:</div>
                  {mockAIInsights.graduationLikelihood.riskFactors.map((risk, idx) => (
                    <div key={idx} className="flex items-start text-xs text-amber-600">
                      <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      {risk}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Likelihood */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Likelihood to Enroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(mockAIInsights.enrollmentLikelihood.score)}`}>
                  {mockAIInsights.enrollmentLikelihood.score}%
                </div>
                <div className="text-xs text-muted-foreground">Enrollment Probability</div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-medium text-muted-foreground">Contributing Factors:</div>
                {mockAIInsights.enrollmentLikelihood.factors.map((factor, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs">{factor.factor}</span>
                      <span className={`text-xs font-medium ${getScoreColor(factor.score)}`}>
                        {factor.score}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={factor.score} className="h-1 flex-1" />
                      <span className="text-xs text-muted-foreground w-8">
                        {Math.round(factor.weight * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-green-700">Strengths:</div>
                {mockAIInsights.enrollmentLikelihood.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    {strength}
                  </div>
                ))}
              </div>

              {mockAIInsights.enrollmentLikelihood.riskFactors.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-amber-700">Risk Factors:</div>
                  {mockAIInsights.enrollmentLikelihood.riskFactors.map((risk, idx) => (
                    <div key={idx} className="flex items-start text-xs text-amber-600">
                      <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      {risk}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Behavioral Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Behavioral Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(mockAIInsights.behavioralInsights).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="text-xs font-medium text-right max-w-[60%]">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Predictive Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded ${getScoreBg(mockAIInsights.predictiveMetrics.alumniSimilarity)}`}>
                <div className="text-lg font-bold">{mockAIInsights.predictiveMetrics.expectedGPA}</div>
                <div className="text-xs text-muted-foreground">Expected GPA</div>
              </div>
              <div className="p-3 bg-blue-100 rounded">
                <div className="text-sm font-bold">On-time</div>
                <div className="text-xs text-muted-foreground">Completion</div>
              </div>
              <div className="p-3 bg-green-100 rounded">
                <div className="text-sm font-bold">Excellent</div>
                <div className="text-xs text-muted-foreground">Job Prospects</div>
              </div>
              <div className={`p-3 rounded ${getScoreBg(mockAIInsights.predictiveMetrics.alumniSimilarity)}`}>
                <div className="text-lg font-bold">{mockAIInsights.predictiveMetrics.alumniSimilarity}%</div>
                <div className="text-xs text-muted-foreground">Alumni Match</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}