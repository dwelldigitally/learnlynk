import React, { useState, useEffect } from 'react';
import { ReviewSession } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Eye, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentReviewPanelProps {
  applicantId: string;
  session: ReviewSession;
}

interface DocumentData {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
  requirementId: string | null;
  filePath: string | null;
  fileSize: number | null;
  adminComments: string | null;
  aiAnalysis?: {
    confidence: number;
    score: number;
    keyFindings: string[];
    flags: string[];
    quality: string;
  };
}

// Program requirements benchmarks
const programRequirements = [
  {
    id: 'transcript',
    name: 'Official Academic Transcript',
    description: 'Official transcript from all attended institutions',
    weight: 30
  },
  {
    id: 'statement',
    name: 'Statement of Purpose',
    description: 'Personal statement outlining career goals and program fit',
    weight: 25
  },
  {
    id: 'recommendation',
    name: 'Letters of Recommendation',
    description: 'Two academic or professional references',
    weight: 20
  },
  {
    id: 'resume',
    name: 'Professional Resume/CV',
    description: 'Current resume highlighting relevant experience',
    weight: 15
  },
  {
    id: 'portfolio',
    name: 'Portfolio (Optional)',
    description: 'Work samples demonstrating relevant skills',
    weight: 10
  }
];

export function DocumentReviewPanel({ applicantId, session }: DocumentReviewPanelProps) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch documents from database
  useEffect(() => {
    async function fetchDocuments() {
      if (!applicantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Try to get lead_id from applicant
        const { data: applicant } = await supabase
          .from('applicants')
          .select('master_record_id')
          .eq('id', applicantId)
          .single();

        let leadId = applicant?.master_record_id;

        // Fetch documents for this lead
        const { data: docs, error } = await supabase
          .from('lead_documents')
          .select('*')
          .eq('lead_id', leadId || applicantId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching documents:', error);
          setDocuments([]);
          return;
        }

        const mappedDocs: DocumentData[] = (docs || []).map(doc => ({
          id: doc.id,
          name: doc.document_name || doc.original_filename || 'Unknown Document',
          type: doc.document_type || 'document',
          uploadDate: doc.created_at,
          status: doc.admin_status || 'pending',
          requirementId: doc.requirement_id,
          filePath: doc.file_path,
          fileSize: doc.file_size,
          adminComments: doc.admin_comments,
          aiAnalysis: doc.ai_insight ? {
            confidence: 0.85,
            score: 80,
            keyFindings: [doc.ai_insight],
            flags: [],
            quality: 'high'
          } : undefined
        }));

        setDocuments(mappedDocs);
      } catch (err) {
        console.error('Error in fetchDocuments:', err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [applicantId]);

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
    const variants: Record<string, string> = {
      excellent: 'bg-green-100 text-green-800',
      high: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[quality] || variants.medium}>
        {quality}
      </Badge>
    );
  };

  const handleDocumentAction = async (docId: string, action: 'approve' | 'reject' | 'revision') => {
    try {
      setUpdating(docId);
      
      const statusMap = {
        approve: 'approved',
        reject: 'rejected',
        revision: 'needs_revision'
      };

      const { error } = await supabase
        .from('lead_documents')
        .update({
          admin_status: statusMap[action],
          admin_comments: comments[docId] || null,
          admin_reviewed_at: new Date().toISOString()
        })
        .eq('id', docId);

      if (error) throw error;

      // Update local state
      setDocuments(docs => docs.map(d => 
        d.id === docId 
          ? { ...d, status: statusMap[action], adminComments: comments[docId] || null }
          : d
      ));

      toast.success(`Document ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'marked for revision'}`);
    } catch (err) {
      console.error('Error updating document:', err);
      toast.error('Failed to update document status');
    } finally {
      setUpdating(null);
    }
  };

  const handleBulkApprove = async () => {
    const pendingDocs = documents.filter(doc => doc.status === 'pending');
    for (const doc of pendingDocs) {
      await handleDocumentAction(doc.id, 'approve');
    }
  };

  const getRequirement = (requirementId: string | null) => 
    programRequirements.find(req => req.id === requirementId);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Document List */}
      <div className="w-1/2 p-6 border-r overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Document Review</h2>
          <div className="flex space-x-2">
            <Button 
              onClick={handleBulkApprove} 
              size="sm"
              disabled={documents.filter(d => d.status === 'pending').length === 0}
            >
              Approve All Pending
            </Button>
          </div>
        </div>

        {/* AI Review Summary */}
        {documents.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Review Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{documents.length}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {documents.filter(d => d.status === 'approved').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Approved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600">
                    {documents.filter(d => d.status === 'pending').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {documents.filter(d => d.status === 'rejected').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document List */}
        {documents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No documents uploaded for this applicant</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const requirement = getRequirement(doc.requirementId);
              
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
                            {requirement?.name || doc.type} • {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {doc.status}
                        </Badge>
                        {doc.aiAnalysis && (
                          <div className="text-sm font-medium text-green-600">
                            {doc.aiAnalysis.score}%
                          </div>
                        )}
                      </div>
                    </div>

                    {doc.aiAnalysis && (
                      <div className="mt-3">
                        <div className="text-xs text-muted-foreground mb-1">AI Findings:</div>
                        <div className="flex flex-wrap gap-1">
                          {doc.aiAnalysis.keyFindings.slice(0, 2).map((finding, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {finding}
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
        )}
      </div>

      {/* Document Details */}
      <div className="w-1/2 p-6 overflow-y-auto">
        {selectedDoc ? (
          <div>
            {(() => {
              const doc = documents.find(d => d.id === selectedDoc);
              const requirement = doc ? getRequirement(doc.requirementId) : null;
              
              if (!doc) return null;

              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Document Details</h3>
                    <Badge variant="outline">{requirement?.name || doc.type}</Badge>
                  </div>

                  {/* Document Info */}
                  <Card className="mb-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Document Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">File Name:</span>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uploaded:</span>
                          <span>{new Date(doc.uploadDate).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size:</span>
                          <span>{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

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
                          value={comments[selectedDoc] || doc.adminComments || ''}
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
                          disabled={updating === selectedDoc}
                        >
                          {updating === selectedDoc ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleDocumentAction(selectedDoc, 'revision')}
                          className="flex-1"
                          disabled={updating === selectedDoc}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Request Revision
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleDocumentAction(selectedDoc, 'reject')}
                          disabled={updating === selectedDoc}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Select a document to review</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
