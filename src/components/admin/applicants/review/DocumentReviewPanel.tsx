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

// Mock document data - would come from API
const mockDocuments = [
  {
    id: '1',
    name: 'Academic Transcript.pdf',
    type: 'transcript',
    uploadDate: '2024-01-15',
    status: 'pending',
    aiAnalysis: {
      confidence: 0.92,
      score: 88,
      keyFindings: ['GPA: 3.8/4.0', 'Strong science grades', 'Consistent performance'],
      flags: [],
      quality: 'high'
    }
  },
  {
    id: '2',
    name: 'Statement of Purpose.pdf',
    type: 'statement',
    uploadDate: '2024-01-16',
    status: 'pending',
    aiAnalysis: {
      confidence: 0.87,
      score: 85,
      keyFindings: ['Clear career goals', 'Well-structured', 'Relevant experience'],
      flags: ['Minor grammar issues'],
      quality: 'high'
    }
  },
  {
    id: '3',
    name: 'Recommendation Letter 1.pdf',
    type: 'recommendation',
    uploadDate: '2024-01-17',
    status: 'pending',
    aiAnalysis: {
      confidence: 0.95,
      score: 92,
      keyFindings: ['Strong endorsement', 'Specific examples', 'Academic excellence'],
      flags: [],
      quality: 'excellent'
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

        {/* Document List */}
        <div className="space-y-3">
          {mockDocuments.map((doc) => (
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
                        Uploaded: {doc.uploadDate}
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
          ))}
        </div>
      </div>

      {/* Document Details */}
      <div className="w-1/2 p-6">
        {selectedDoc ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Document Details</h3>
            
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