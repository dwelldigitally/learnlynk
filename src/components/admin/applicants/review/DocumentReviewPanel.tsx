import React, { useState } from 'react';
import { ReviewSession } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DocumentReviewPanelProps {
  applicantId: string;
  session: ReviewSession;
}

// Program requirements and benchmarks
const programRequirements = [
  {
    id: 'transcript',
    name: 'Official Academic Transcript',
    description: 'Official transcript from all attended institutions',
    benchmark: {
      minGPA: 3.0,
      preferredGPA: 3.5,
      requiredCourses: ['Statistics', 'Research Methods', 'Mathematics']
    },
    weight: 30
  },
  {
    id: 'statement',
    name: 'Statement of Purpose',
    description: 'Personal statement outlining career goals and program fit',
    benchmark: {
      minWordCount: 500,
      maxWordCount: 1000,
      requiredElements: ['Career goals', 'Research interests', 'Program alignment']
    },
    weight: 25
  },
  {
    id: 'recommendation',
    name: 'Letters of Recommendation',
    description: 'Two academic or professional references',
    benchmark: {
      minCount: 2,
      preferredSources: ['Academic supervisors', 'Research mentors', 'Direct supervisors'],
      requiredElements: ['Specific examples', 'Academic/professional performance', 'Potential assessment']
    },
    weight: 20
  },
  {
    id: 'resume',
    name: 'Professional Resume/CV',
    description: 'Current resume highlighting relevant experience',
    benchmark: {
      maxPages: 2,
      requiredSections: ['Education', 'Experience', 'Skills', 'Achievements']
    },
    weight: 15
  },
  {
    id: 'portfolio',
    name: 'Portfolio (Optional)',
    description: 'Work samples demonstrating relevant skills',
    benchmark: {
      formats: ['PDF', 'URL'],
      maxSize: '10MB'
    },
    weight: 10
  }
];

// Mock document data aligned with requirements
const mockDocuments = [
  {
    id: '1',
    name: 'Academic Transcript.pdf',
    type: 'transcript',
    uploadDate: '2024-01-15',
    status: 'pending',
    requirementId: 'transcript',
    aiAnalysis: {
      confidence: 0.92,
      score: 88,
      keyFindings: ['GPA: 3.8/4.0', 'Strong science grades', 'Statistics course completed'],
      flags: [],
      quality: 'high',
      benchmarkCompliance: {
        gpaCheck: { status: 'pass', value: 3.8, requirement: 3.5 },
        requiredCourses: { status: 'pass', completed: ['Statistics', 'Research Methods'], missing: ['Mathematics'] }
      }
    }
  },
  {
    id: '2',
    name: 'Statement of Purpose.pdf',
    type: 'statement',
    uploadDate: '2024-01-16',
    status: 'pending',
    requirementId: 'statement',
    aiAnalysis: {
      confidence: 0.87,
      score: 85,
      keyFindings: ['Clear career goals', 'Research interests defined', 'Program alignment strong'],
      flags: ['Minor grammar issues'],
      quality: 'high',
      benchmarkCompliance: {
        wordCount: { status: 'pass', value: 750, min: 500, max: 1000 },
        requiredElements: { status: 'pass', present: ['Career goals', 'Research interests', 'Program alignment'] }
      }
    }
  },
  {
    id: '3',
    name: 'Recommendation Letter 1.pdf',
    type: 'recommendation',
    uploadDate: '2024-01-17',
    status: 'pending',
    requirementId: 'recommendation',
    aiAnalysis: {
      confidence: 0.95,
      score: 92,
      keyFindings: ['Academic supervisor', 'Specific research examples', 'Strong potential assessment'],
      flags: [],
      quality: 'excellent',
      benchmarkCompliance: {
        source: { status: 'pass', type: 'Academic supervisor' },
        elements: { status: 'pass', present: ['Specific examples', 'Academic performance', 'Potential assessment'] }
      }
    }
  },
  {
    id: '4',
    name: 'Professional Resume.pdf',
    type: 'resume',
    uploadDate: '2024-01-18',
    status: 'pending',
    requirementId: 'resume',
    aiAnalysis: {
      confidence: 0.90,
      score: 87,
      keyFindings: ['2 pages', 'Relevant experience', 'Technical skills highlighted'],
      flags: [],
      quality: 'high',
      benchmarkCompliance: {
        length: { status: 'pass', pages: 2, max: 2 },
        sections: { status: 'pass', present: ['Education', 'Experience', 'Skills', 'Achievements'] }
      }
    }
  }
];

export function DocumentReviewPanel({ applicantId, session }: DocumentReviewPanelProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'needs_revision':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getQualityBadge = (quality: string) => {
    const variants = {
      excellent: 'bg-green-100 text-green-800',
      high: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[quality as keyof typeof variants] || variants.medium}>
        {quality}
      </Badge>
    );
  };

  const handleDocumentAction = (docId: string, action: 'approve' | 'reject' | 'revision') => {
    // Update document status in session
    console.log(`${action} document ${docId}`);
  };

  const handleBulkApprove = () => {
    mockDocuments.forEach(doc => {
      if (doc.aiAnalysis.score >= 80) {
        handleDocumentAction(doc.id, 'approve');
      }
    });
  };

  const getRequirement = (requirementId: string) => 
    programRequirements.find(req => req.id === requirementId);

  const getBenchmarkStatus = (doc: any) => {
    const compliance = doc.aiAnalysis.benchmarkCompliance;
    if (!compliance) return 'unknown';
    
    const checks = Object.values(compliance);
    const allPass = checks.every((check: any) => check.status === 'pass');
    const anyFail = checks.some((check: any) => check.status === 'fail');
    
    if (allPass) return 'pass';
    if (anyFail) return 'fail';
    return 'partial';
  };

  return (
    <div className="h-full flex">
      {/* Document List */}
      <div className="w-1/2 p-6 border-r">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Document Review</h2>
          <div className="flex space-x-2">
            <Button onClick={handleBulkApprove} size="sm">
              Approve Ready
            </Button>
            <Button variant="outline" size="sm">
              AI Auto-Review
            </Button>
          </div>
        </div>

        {/* AI Review Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">AI Review Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-xs text-muted-foreground">Overall Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">92%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">8m</div>
                <div className="text-xs text-muted-foreground">Est. Review</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Requirements */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Program Requirements</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {programRequirements.map((req) => {
                const matchingDocs = mockDocuments.filter(doc => doc.requirementId === req.id);
                const isComplete = matchingDocs.length > 0;
                
                return (
                  <div key={req.id} className="flex items-center justify-between text-xs">
                    <span className={isComplete ? 'text-foreground' : 'text-muted-foreground'}>
                      {req.name}
                    </span>
                    <Badge 
                      variant={isComplete ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {isComplete ? 'Submitted' : 'Missing'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Document List */}
        <div className="space-y-3">
          {mockDocuments.map((doc) => {
            const requirement = getRequirement(doc.requirementId);
            const benchmarkStatus = getBenchmarkStatus(doc);
            
            return (
              <Card 
                key={doc.id}
                className={`cursor-pointer transition-colors ${
                  selectedDoc === doc.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedDoc(doc.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(doc.status)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {requirement?.name} • {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {getQualityBadge(doc.aiAnalysis.quality)}
                      <div className="text-sm font-medium text-green-600">
                        {doc.aiAnalysis.score}%
                      </div>
                    </div>
                  </div>

                  {/* Benchmark Compliance */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Benchmark:</span>
                      <Badge 
                        variant={benchmarkStatus === 'pass' ? 'default' : benchmarkStatus === 'fail' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {benchmarkStatus === 'pass' ? 'Meets Requirements' : 
                         benchmarkStatus === 'fail' ? 'Below Standard' : 'Partial'}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1">Key Findings:</div>
                    <div className="flex flex-wrap gap-1">
                      {doc.aiAnalysis.keyFindings.slice(0, 2).map((finding, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {finding}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {doc.aiAnalysis.flags.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">Flags:</div>
                      <div className="flex flex-wrap gap-1">
                        {doc.aiAnalysis.flags.map((flag, idx) => (
                          <Badge key={idx} variant="destructive" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Document Details */}
      <div className="w-1/2 p-6">
        {selectedDoc ? (
          <div>
            {(() => {
              const doc = mockDocuments.find(d => d.id === selectedDoc);
              const requirement = doc ? getRequirement(doc.requirementId) : null;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Document Details</h3>
                    <Badge variant="outline">{requirement?.name}</Badge>
                  </div>

                  {/* Requirement Benchmarks */}
                  {requirement && (
                    <Card className="mb-4">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Requirement Benchmarks</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Weight:</span>
                            <span className="font-medium">{requirement.weight}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Description:</span>
                            <p className="text-foreground mt-1">{requirement.description}</p>
                          </div>
                          {requirement.benchmark && (
                            <div className="mt-3">
                              <div className="text-muted-foreground mb-1">Benchmarks:</div>
                              <div className="space-y-1">
                                {Object.entries(requirement.benchmark).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                                    <span className="font-medium">
                                      {Array.isArray(value) ? value.join(', ') : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              );
            })()}
            
            {/* Document Viewer Placeholder */}
            <Card className="mb-6">
              <CardContent className="p-8 text-center text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p>Document preview would appear here</p>
                <p className="text-sm">PDF/Image viewer integration</p>
              </CardContent>
            </Card>

            {/* Review Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Review Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Comments</label>
                  <Textarea
                    placeholder="Add your review comments..."
                    value={comments[selectedDoc] || ''}
                    onChange={(e) => setComments(prev => ({
                      ...prev,
                      [selectedDoc]: e.target.value
                    }))}
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleDocumentAction(selectedDoc, 'approve')}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDocumentAction(selectedDoc, 'revision')}
                    className="flex-1"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Request Revision
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleDocumentAction(selectedDoc, 'reject')}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p>Select a document to review</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}