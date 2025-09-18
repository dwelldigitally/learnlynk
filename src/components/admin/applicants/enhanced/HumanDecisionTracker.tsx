import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Applicant } from "@/types/applicant";
import { 
  User, 
  Brain, 
  CheckCircle, 
  X, 
  AlertTriangle,
  Clock,
  Eye,
  MessageSquare,
  FileText
} from "lucide-react";

interface HumanDecisionTrackerProps {
  applicant: Applicant;
}

export const HumanDecisionTracker: React.FC<HumanDecisionTrackerProps> = ({ applicant }) => {
  const decisions = [
    {
      id: '1',
      timestamp: '2024-01-16T10:30:00Z',
      type: 'override',
      decision: 'Approved despite AI flag',
      decisionMaker: { type: 'human', name: 'Dr. Sarah Wilson' },
      aiRecommendation: 'Flag for review - GPA below threshold',
      humanReasoning: 'Exceptional extracurricular achievements and leadership experience compensate for slightly lower GPA. Strong interview performance.',
      confidence: 'high',
      category: 'academic_assessment'
    },
    {
      id: '2',
      timestamp: '2024-01-15T14:20:00Z',
      type: 'agreement',
      decision: 'Document approved',
      decisionMaker: { type: 'ai', name: 'AI Assistant' },
      aiRecommendation: 'Approve - meets all requirements',
      humanReasoning: null,
      confidence: 'high',
      category: 'document_review'
    },
    {
      id: '3',
      timestamp: '2024-01-14T09:15:00Z',
      type: 'manual',
      decision: 'Interview scheduled',
      decisionMaker: { type: 'human', name: 'Prof. Michael Chen' },
      aiRecommendation: 'Schedule within 48 hours',
      humanReasoning: 'Candidate shows exceptional potential. Priority scheduling recommended.',
      confidence: 'medium',
      category: 'scheduling'
    }
  ];

  const pendingReviews = [
    {
      item: 'Financial Aid Application',
      aiRecommendation: 'Approve with conditions',
      confidence: 78,
      flaggedReason: 'Income documentation incomplete'
    },
    {
      item: 'Program Fit Assessment',
      aiRecommendation: 'Needs human review',
      confidence: 65,
      flaggedReason: 'Mixed signals in application materials'
    }
  ];

  const getDecisionIcon = (type: string) => {
    switch (type) {
      case 'override': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'agreement': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'manual': return <User className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDecisionMakerIcon = (type: string) => {
    return type === 'human' ? 
      <User className="h-4 w-4 text-blue-600" /> : 
      <Brain className="h-4 w-4 text-primary" />;
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Decision Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Human-AI Decision Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-muted-foreground">Human Decisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">AI Decisions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">2</div>
              <div className="text-sm text-muted-foreground">AI Overrides</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Human Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-warning" />
            Pending Human Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingReviews.map((review, index) => (
            <Card key={index} className="border-l-4 border-l-warning">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium">{review.item}</h4>
                    <div className="text-sm text-muted-foreground">
                      AI Recommendation: {review.aiRecommendation}
                    </div>
                    <div className="text-sm text-warning">
                      Flagged: {review.flaggedReason}
                    </div>
                    <Badge variant="outline">
                      {review.confidence}% AI confidence
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Decision History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Decision History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {decisions.map((decision) => (
            <Card key={decision.id} className="border-l-4 border-l-primary/20">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Decision Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDecisionIcon(decision.type)}
                      <div>
                        <h4 className="font-medium">{decision.decision}</h4>
                        <div className="text-sm text-muted-foreground">
                          {new Date(decision.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getDecisionMakerIcon(decision.decisionMaker.type)}
                      <span className="text-sm font-medium">
                        {decision.decisionMaker.name}
                      </span>
                    </div>
                  </div>

                  {/* AI vs Human */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">AI Recommendation</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {decision.aiRecommendation}
                      </p>
                    </div>
                    
                    {decision.humanReasoning && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">Human Reasoning</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                          {decision.humanReasoning}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Decision Metadata */}
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <Badge variant="outline">{decision.category}</Badge>
                    <span className={`text-sm ${getConfidenceColor(decision.confidence)}`}>
                      {decision.confidence} confidence
                    </span>
                    {decision.type === 'override' && (
                      <Badge variant="secondary">Override</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Add Decision Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Add Decision Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Document your reasoning for any AI overrides or manual decisions..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button>
              <FileText className="h-4 w-4 mr-1" />
              Save Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};