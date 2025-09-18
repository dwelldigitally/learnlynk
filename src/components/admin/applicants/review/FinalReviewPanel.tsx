import React from 'react';
import { ReviewSession } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface FinalReviewPanelProps {
  applicantId: string;
  session: ReviewSession;
  onComplete: () => void;
}

// Mock final review data
const mockFinalSummary = {
  sections: {
    documents: { score: 92, status: 'completed', comments: 'All required documents submitted and approved' },
    essays: { score: 87, status: 'completed', comments: 'Strong essays with clear goals and good writing' },
    background: { score: 89, status: 'completed', comments: 'Excellent academic and professional background' },
    assessment: { score: 85, status: 'completed', comments: 'High likelihood of success and enrollment' }
  },
  overallScore: 88,
  recommendation: 'Accept',
  timeSpent: 45,
  reviewerNotes: 'Strong candidate with excellent qualifications',
  nextSteps: ['Send acceptance letter', 'Schedule orientation', 'Process enrollment'],
  concerns: [],
  conditions: []
};

export function FinalReviewPanel({ applicantId, session, onComplete }: FinalReviewPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'accept': return 'bg-green-100 text-green-800';
      case 'reject': return 'bg-red-100 text-red-800';
      case 'waitlist': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Final Review Summary</h2>
      
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Overall Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(mockFinalSummary.overallScore)}`}>
                {mockFinalSummary.overallScore}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={getRecommendationColor(mockFinalSummary.recommendation)}>
                {mockFinalSummary.recommendation}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Review Time: {mockFinalSummary.timeSpent}m
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 p-3 rounded">
            <div className="text-sm font-medium mb-1">Reviewer Notes:</div>
            <p className="text-sm text-muted-foreground">{mockFinalSummary.reviewerNotes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Section Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Section Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(mockFinalSummary.sections).map(([section, data]) => (
              <div key={section} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium capitalize">{section}</h4>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className={`font-medium ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{data.comments}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Application Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Documents:</span>
                <span className="font-medium">12/12 Submitted</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Essays:</span>
                <span className="font-medium">3/3 Reviewed</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GPA:</span>
                <span className="font-medium">3.8/4.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Experience:</span>
                <span className="font-medium">3 Years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AI Score:</span>
                <span className="font-medium">85%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockFinalSummary.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start text-sm">
                  <span className="text-primary mr-2">{index + 1}.</span>
                  {step}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Review Completion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-3 rounded">
            <div className="text-sm font-medium text-green-800">Ready to Submit</div>
            <p className="text-xs text-green-700 mt-1">
              All sections have been reviewed and scored. This application is ready for final decision.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button onClick={onComplete} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Final Review
            </Button>
            <Button variant="outline" className="flex-1">
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}