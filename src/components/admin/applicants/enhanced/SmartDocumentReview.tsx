import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Applicant } from "@/types/applicant";
import { 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Zap,
  Download,
  X,
  Check,
  Clock,
  Flag
} from "lucide-react";

interface SmartDocumentReviewProps {
  applicant: Applicant;
  onDocumentAction: (action: string, document: string) => void;
  onApproveAll: () => void;
}

export const SmartDocumentReview: React.FC<SmartDocumentReviewProps> = ({
  applicant,
  onDocumentAction,
  onApproveAll
}) => {
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  // Mock documents with AI analysis
  const documents = [
    {
      id: '1',
      name: 'Academic_Transcript_2023.pdf',
      status: 'approved',
      aiAnalysis: {
        confidence: 95,
        score: 92,
        keyFindings: ['GPA: 3.8/4.0', 'Strong STEM performance', 'Consistent grades'],
        flags: [],
        quality: 'excellent'
      }
    },
    {
      id: '2', 
      name: 'Personal_Statement.pdf',
      status: 'under-review',
      aiAnalysis: {
        confidence: 88,
        score: 85,
        keyFindings: ['Clear motivation', 'Relevant experience', 'Good writing quality'],
        flags: ['Length exceeds recommended 500 words'],
        quality: 'good'
      }
    },
    {
      id: '3',
      name: 'Recommendation_Letter_1.pdf', 
      status: 'flagged',
      aiAnalysis: {
        confidence: 76,
        score: 65,
        keyFindings: ['Generic content', 'Limited specific examples'],
        flags: ['Potentially template-based', 'Lacks program-specific details'],
        quality: 'needs-review'
      }
    },
    {
      id: '4',
      name: 'Certificate_English.jpg',
      status: 'rejected',
      aiAnalysis: {
        confidence: 92,
        score: 35,
        keyFindings: ['Document visible', 'Text readable'],
        flags: ['Low image quality', 'Potential authenticity concerns'],
        quality: 'poor'
      }
    }
  ];

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-blue-600';
      case 'needs-review': return 'text-warning';
      case 'poor': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'excellent': return { variant: 'default' as const, text: 'Excellent' };
      case 'good': return { variant: 'secondary' as const, text: 'Good' };
      case 'needs-review': return { variant: 'outline' as const, text: 'Needs Review' };
      case 'poor': return { variant: 'destructive' as const, text: 'Poor Quality' };
      default: return { variant: 'outline' as const, text: 'Unknown' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected': return <X className="h-4 w-4 text-destructive" />;
      case 'flagged': return <Flag className="h-4 w-4 text-warning" />;
      case 'under-review': return <Eye className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const aiSummary = {
    totalScore: 79,
    recommendation: "3 documents ready for approval, 1 requires attention",
    confidence: 87,
    timeToReview: "~5 minutes remaining"
  };

  return (
    <div className="space-y-6">
      {/* AI Review Summary */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Document Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{aiSummary.totalScore}</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
              <Progress value={aiSummary.totalScore} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{aiSummary.confidence}%</div>
              <div className="text-sm text-muted-foreground">AI Confidence</div>
              <Progress value={aiSummary.confidence} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-lg font-medium">{aiSummary.timeToReview}</div>
              <div className="text-sm text-muted-foreground">Est. Review Time</div>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">AI Recommendation</div>
                <div className="text-sm text-blue-700">{aiSummary.recommendation}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Smart Actions
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant={bulkMode ? "default" : "outline"}
                onClick={() => setBulkMode(!bulkMode)}
              >
                Bulk Mode
              </Button>
              <Button size="sm" onClick={onApproveAll}>
                <Check className="h-4 w-4 mr-1" />
                AI Auto-Approve
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button size="sm" variant="outline" className="justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Ready (3)
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <Flag className="h-4 w-4 mr-2" />
              Flag for Review (1)
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <Eye className="h-4 w-4 mr-2" />
              Request Clarification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document List with AI Analysis */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="border-l-4 border-l-primary/20">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Document Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {getStatusIcon(doc.status)}
                    </div>
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getQualityBadge(doc.aiAnalysis.quality).variant}>
                          {getQualityBadge(doc.aiAnalysis.quality).text}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          AI Score: {doc.aiAnalysis.score}/100
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {doc.status !== 'approved' && (
                      <Button size="sm" onClick={() => onDocumentAction('approve', doc.name)}>
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-muted/50 rounded-lg p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="font-medium">AI Analysis</span>
                    <Badge variant="outline">
                      {doc.aiAnalysis.confidence}% confidence
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Key Findings</h5>
                      <ul className="space-y-1">
                        {doc.aiAnalysis.keyFindings.map((finding, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-success" />
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {doc.aiAnalysis.flags.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">AI Flags</h5>
                        <ul className="space-y-1">
                          {doc.aiAnalysis.flags.map((flag, index) => (
                            <li key={index} className="text-sm text-warning flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-warning" />
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Document Quality Score:</span>
                    <Progress value={doc.aiAnalysis.score} className="h-2 w-32" />
                    <span className={`text-sm font-medium ${getQualityColor(doc.aiAnalysis.quality)}`}>
                      {doc.aiAnalysis.score}/100
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};