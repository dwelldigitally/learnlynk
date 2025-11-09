import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLeadDocuments } from '@/hooks/useLeadData';
import { FileText, Upload, CheckCircle, XCircle, AlertTriangle, Eye, Download, Check, X, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { documentService } from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';
import { RequirementVerificationPanel } from '@/components/admin/documents/RequirementVerificationPanel';
import { supabase } from '@/integrations/supabase/client';
import { MasterRequirement, VerificationStatus } from '@/types/requirement';

interface RealDataDocumentsProps {
  leadId: string;
}

export function RealDataDocuments({ leadId }: RealDataDocumentsProps) {
  const { documents, loading, error, refetch } = useLeadDocuments(leadId);
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [availableRequirements, setAvailableRequirements] = useState<MasterRequirement[]>([]);
  const [selectedRequirementId, setSelectedRequirementId] = useState<string>('');

  useEffect(() => {
    loadAvailableRequirements();
  }, []);

  const loadAvailableRequirements = async () => {
    const { data, error } = await supabase
      .from('master_requirements')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error loading requirements:', error);
      return;
    }

    setAvailableRequirements(data as any);
  };

  const handleApprove = async (documentId: string) => {
    try {
      await documentService.updateDocumentStatus(documentId, 'approved');
      toast({
        title: "Document Approved",
        description: "The document has been approved successfully.",
      });
      refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to approve document",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (documentId: string) => {
    try {
      await documentService.updateDocumentStatus(documentId, 'rejected');
      toast({
        title: "Document Rejected",
        description: "The document has been rejected.",
      });
      refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject document",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      uploaded: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      missing: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleLinkRequirement = async () => {
    if (!selectedDocument || !selectedRequirementId) return;

    try {
      await (supabase as any)
        .from('student_document_uploads')
        .update({ requirement_id: selectedRequirementId })
        .eq('id', selectedDocument.id);

      toast({
        title: 'Requirement Linked',
        description: 'Document has been linked to the requirement'
      });

      setShowLinkDialog(false);
      setSelectedRequirementId('');
      refetch();
    } catch (error) {
      console.error('Error linking requirement:', error);
      toast({
        title: 'Error',
        description: 'Failed to link requirement',
        variant: 'destructive'
      });
    }
  };

  const getLinkedRequirement = (requirementId?: string) => {
    if (!requirementId) return null;
    return availableRequirements.find(req => req.id === requirementId);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading documents...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents ({documents.length})
          </CardTitle>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents uploaded</p>
            <p className="text-sm text-muted-foreground">Documents will appear here once uploaded</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(doc.status)}
                      <div>
                        <p className="font-medium">{doc.document_name}</p>
                        <p className="text-sm text-muted-foreground">{doc.document_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      {doc.required && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                    {doc.upload_date && (
                      <div>
                        <span className="font-medium">Uploaded:</span> {format(new Date(doc.upload_date), 'PPP')}
                      </div>
                    )}
                    {doc.file_size && (
                      <div>
                        <span className="font-medium">Size:</span> {formatFileSize(doc.file_size)}
                      </div>
                    )}
                  </div>

                  {doc.ai_insight && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">AI Insight</p>
                      <p className="text-sm text-blue-800">{doc.ai_insight}</p>
                    </div>
                  )}

                  {doc.admin_comments && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">Admin Comments</p>
                      <p className="text-sm text-muted-foreground">{doc.admin_comments}</p>
                    </div>
                  )}

                  {/* Requirement Verification Section */}
                  <div className="border-t pt-4">
                    {doc.requirement_id ? (
                      <RequirementVerificationPanel
                        documentId={doc.id}
                        requirement={getLinkedRequirement(doc.requirement_id)}
                        currentStatus={(doc.requirement_verification_status || 'not_checked') as VerificationStatus}
                        currentExtractedValue={doc.extracted_value}
                        currentNotes={doc.requirement_notes}
                        onVerificationComplete={refetch}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-3">No requirement linked</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowLinkDialog(true);
                          }}
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          Link Requirement
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 border-t pt-4">
                    {doc.file_path && (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                    {doc.status !== 'approved' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleApprove(doc.id)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    )}
                    {doc.status !== 'rejected' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(doc.id)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    )}
                    <div className="text-xs text-muted-foreground ml-auto">
                      Updated {format(new Date(doc.updated_at), 'PPP')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Link Requirement Dialog */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Document to Requirement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Requirement</Label>
                <select
                  className="w-full p-2 border rounded-md bg-background"
                  value={selectedRequirementId}
                  onChange={(e) => setSelectedRequirementId(e.target.value)}
                >
                  <option value="">Choose a requirement...</option>
                  {availableRequirements.map((req) => (
                    <option key={req.id} value={req.id}>
                      {req.name} {req.minimum_value && `(Min: ${req.minimum_value})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleLinkRequirement}
                  className="flex-1"
                  disabled={!selectedRequirementId}
                >
                  Link Requirement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setSelectedRequirementId('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}