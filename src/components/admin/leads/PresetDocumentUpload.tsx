import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RequestDocumentDialog } from './RequestDocumentDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload,
  File,
  Check,
  X,
  Eye,
  Trash2,
  AlertCircle,
  FileText,
  Image,
  FileType,
  CheckCircle,
  Clock,
  Edit,
  Download,
  Plus
} from 'lucide-react';
import { presetDocumentService, PresetDocumentRequirement, UploadedDocument } from '@/services/presetDocumentService';
import { supabase } from '@/integrations/supabase/client';

interface PresetDocumentUploadProps {
  leadId: string;
  leadName?: string;
  programName: string;
  documents: UploadedDocument[];
  onDocumentUploaded: () => void;
  onDocumentDeleted: () => void;
  onStatusUpdated: () => void;
}

export const PresetDocumentUpload: React.FC<PresetDocumentUploadProps> = ({
  leadId,
  leadName = 'the student',
  programName,
  documents,
  onDocumentUploaded,
  onDocumentDeleted,
  onStatusUpdated
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingRequirementId, setUploadingRequirementId] = useState<string | null>(null);
  const [reviewingDoc, setReviewingDoc] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<string>('');
  const [reviewComments, setReviewComments] = useState<string>('');
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requirements, setRequirements] = useState<PresetDocumentRequirement[]>([]);
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { toast } = useToast();

  // Fetch requirements from database including linked document templates from entry requirements
  useEffect(() => {
    const fetchRequirements = async () => {
      setRequirementsLoading(true);
      try {
        const trimmedProgramName = programName?.trim();
        if (!trimmedProgramName) {
          setRequirements([]);
          return;
        }

        // Fetch program from database
        const { data: programs, error } = await supabase
          .from('programs')
          .select('document_requirements, entry_requirements')
          .ilike('name', `%${trimmedProgramName}%`)
          .limit(1);

        if (error) {
          console.error('Error fetching program:', error);
          setRequirements([]);
          return;
        }

        const program = programs?.[0];
        let docReqs: PresetDocumentRequirement[] = [];

        // Parse direct document requirements
        if (program?.document_requirements && Array.isArray(program.document_requirements)) {
          docReqs = (program.document_requirements as any[]).map((req, idx) => ({
            id: req.id || `doc-req-${idx}`,
            name: req.name || 'Unknown Document',
            description: req.description || '',
            required: req.mandatory ?? true,
            programName: trimmedProgramName
          }));
        }

        // Extract linked document templates from entry requirements
        const rawEntryReqs = program?.entry_requirements;
        const linkedDocIds: string[] = [];
        
        if (rawEntryReqs && Array.isArray(rawEntryReqs)) {
          for (const req of rawEntryReqs as any[]) {
            if (req.linkedDocumentTemplates && Array.isArray(req.linkedDocumentTemplates)) {
              linkedDocIds.push(...req.linkedDocumentTemplates);
            }
          }
        }

        // Deduplicate and fetch linked document templates
        const uniqueLinkedDocIds = [...new Set(linkedDocIds)];
        if (uniqueLinkedDocIds.length > 0) {
          const { data: templates, error: templateError } = await supabase
            .from('document_templates')
            .select('id, name, description, mandatory')
            .in('id', uniqueLinkedDocIds);

          if (!templateError && templates && templates.length > 0) {
            const existingIds = new Set(docReqs.map(r => r.id));
            const newDocReqs = templates
              .filter(t => !existingIds.has(t.id))
              .map(t => ({
                id: t.id,
                name: t.name,
                description: t.description || '',
                required: t.mandatory,
                programName: trimmedProgramName
              }));
            docReqs = [...docReqs, ...newDocReqs];
          }
        }

        // Fallback to preset service if no requirements found
        if (docReqs.length === 0) {
          docReqs = await presetDocumentService.getPresetRequirementsAsync(trimmedProgramName);
        }

        setRequirements(docReqs);
      } catch (error) {
        console.error('Error fetching requirements:', error);
        setRequirements([]);
      } finally {
        setRequirementsLoading(false);
      }
    };

    fetchRequirements();
  }, [programName]);

  // Calculate progress based on fetched requirements
  const progress = {
    total: requirements.filter(r => r.required).length,
    uploaded: documents.length,
    approved: documents.filter(doc => doc.admin_status === 'approved').length,
    pending: documents.filter(doc => doc.admin_status === 'pending').length,
    rejected: documents.filter(doc => doc.admin_status === 'rejected').length,
    isComplete: requirements.filter(r => r.required).every(req => 
      documents.some(doc => doc.requirement_id === req.id && doc.admin_status === 'approved')
    )
  };

  const handleFileSelect = (requirementId: string) => {
    fileInputRefs.current[requirementId]?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, requirementId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if document already exists for this requirement
    const existingDoc = documents.find(doc => doc.requirement_id === requirementId);
    if (existingDoc) {
      toast({
        title: 'Document already uploaded',
        description: 'This requirement already has a document. Please delete it first if you want to replace it.',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select a file smaller than 10MB',
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a PDF, image, or document file',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadingRequirementId(requirementId);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      await presetDocumentService.uploadDocument(
        leadId,
        file,
        requirementId,
        programName
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: 'Upload successful',
        description: 'Document has been uploaded successfully'
      });

      // Reset file input
      if (fileInputRefs.current[requirementId]) {
        fileInputRefs.current[requirementId]!.value = '';
      }

      onDocumentUploaded();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      setUploadingRequirementId(null);
      setUploadProgress(0);
    }
  };

  const handleStatusUpdate = async () => {
    if (!reviewingDoc || !reviewStatus) return;

    try {
      await presetDocumentService.updateDocumentStatus(
        reviewingDoc,
        reviewStatus,
        reviewComments
      );
      toast({
        title: 'Status updated',
        description: 'Document status has been updated successfully'
      });
      setReviewingDoc(null);
      setReviewStatus('');
      setReviewComments('');
      onStatusUpdated();
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update document status',
        variant: 'destructive'
      });
    }
  };

  const handleQuickApprove = async (documentId: string) => {
    try {
      await presetDocumentService.updateDocumentStatus(documentId, 'approved', 'Quick approved');
      toast({
        title: 'Approved',
        description: 'Document has been approved'
      });
      onStatusUpdated();
    } catch (error) {
      console.error('Approve error:', error);
      toast({
        title: 'Approval failed',
        description: 'Failed to approve document',
        variant: 'destructive'
      });
    }
  };

  const handleQuickReject = async (documentId: string) => {
    try {
      await presetDocumentService.updateDocumentStatus(documentId, 'rejected', 'Quick rejected');
      toast({
        title: 'Rejected',
        description: 'Document has been rejected'
      });
      onStatusUpdated();
    } catch (error) {
      console.error('Reject error:', error);
      toast({
        title: 'Rejection failed',
        description: 'Failed to reject document',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await presetDocumentService.deleteDocument(documentId);
      toast({
        title: 'Document deleted',
        description: 'Document has been deleted successfully'
      });
      onDocumentDeleted();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete document',
        variant: 'destructive'
      });
    }
  };

  const handleViewDocument = async (filePath: string) => {
    try {
      const url = await presetDocumentService.getDocumentUrl(filePath);
      window.open(url, '_blank');
    } catch (error) {
      console.error('View error:', error);
      toast({
        title: 'View failed',
        description: 'Failed to open document',
        variant: 'destructive'
      });
    }
  };

  const handleBulkDownload = async () => {
    const approvedDocuments = documents.filter(doc => doc.admin_status === 'approved');
    
    if (approvedDocuments.length === 0) {
      toast({
        title: 'No approved documents',
        description: 'There are no approved documents to download',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Downloading documents',
      description: `Preparing ${approvedDocuments.length} document(s) for download...`
    });

    try {
      for (const doc of approvedDocuments) {
        const url = await presetDocumentService.getDocumentUrl(doc.file_path);
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.document_name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Small delay between downloads to avoid browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast({
        title: 'Download complete',
        description: `Successfully downloaded ${approvedDocuments.length} document(s)`
      });
    } catch (error) {
      console.error('Bulk download error:', error);
      toast({
        title: 'Download failed',
        description: 'Failed to download some documents',
        variant: 'destructive'
      });
    }
  };

  const getFileIcon = (documentType: string) => {
    if (documentType.includes('image')) return <Image className="h-4 w-4" />;
    if (documentType.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <FileType className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { variant: 'secondary' as const, text: 'Pending Review', icon: Clock },
      approved: { variant: 'default' as const, text: 'Approved', icon: CheckCircle },
      rejected: { variant: 'destructive' as const, text: 'Rejected', icon: X }
    };
    
    const config = configs[status as keyof typeof configs] || { variant: 'outline' as const, text: status, icon: AlertCircle };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getUploadedDocument = (requirementId: string) => {
    return documents.find(doc => doc.requirement_id === requirementId);
  };

  if (requirementsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Document Progress for {programName}
            <Badge variant={progress.isComplete ? 'default' : 'secondary'}>
              {progress.approved}/{progress.total} Approved
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progress.total > 0 ? (progress.approved / progress.total) * 100 : 0} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{progress.approved} approved</span>
              <span>{progress.pending} pending</span>
              <span>{progress.rejected} rejected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consolidated Requirements List */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Upload and manage all required documents for this program</CardDescription>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRequestDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Document
              </Button>
              {documents.filter(doc => doc.admin_status === 'approved').length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All Approved
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requirements.map((req) => {
              const uploadedDoc = getUploadedDocument(req.id);
              const isUploading = uploadingRequirementId === req.id;
              
              return (
                <div key={req.id} className="border rounded-lg p-4 space-y-3">
                  {/* Requirement Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{req.name}</h4>
                        {req.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                    </div>
                    
                    {/* Upload Status Icon */}
                    <div className="flex-shrink-0">
                      {uploadedDoc?.admin_status === 'approved' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : uploadedDoc ? (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <div className="h-5 w-5 border-2 rounded-full border-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Upload Section or Uploaded Document */}
                  {!uploadedDoc ? (
                    <div className="flex items-center gap-2">
                      <input
                        ref={(el) => { fileInputRefs.current[req.id] = el; }}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, req.id)}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      
                      {isUploading ? (
                        <div className="flex-1 space-y-2">
                          <div className="text-sm text-muted-foreground">Uploading...</div>
                          <Progress value={uploadProgress} className="w-full" />
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleFileSelect(req.id)}
                          className="w-full sm:w-auto"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                      )}
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        PDF, JPG, PNG, DOC, DOCX (max 10MB)
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-muted/30 rounded-md p-3">
                      {/* Document Info */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getFileIcon(uploadedDoc.document_type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-sm truncate">{uploadedDoc.document_name}</h5>
                            {getStatusBadge(uploadedDoc.admin_status)}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{(uploadedDoc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>Uploaded: {new Date(uploadedDoc.created_at).toLocaleDateString()}</span>
                          </div>
                          {uploadedDoc.admin_comments && (
                            <div className="mt-2 p-2 bg-background rounded border border-border">
                              <p className="text-xs font-medium text-foreground">Admin Comment:</p>
                              <p className="text-xs text-muted-foreground italic">
                                {uploadedDoc.admin_comments}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Document Actions */}
                      <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDocument(uploadedDoc.file_path)}
                          title="View document"
                          className="flex-1 sm:flex-none"
                        >
                          <Eye className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>

                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={async () => {
                            try {
                              const url = await presetDocumentService.getDocumentUrl(uploadedDoc.file_path);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = uploadedDoc.document_name;
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              toast({
                                title: 'Download started',
                                description: 'Document is being downloaded'
                              });
                            } catch (error) {
                              console.error('Download error:', error);
                              toast({
                                title: 'Download failed',
                                description: 'Failed to download document',
                                variant: 'destructive'
                              });
                            }
                          }}
                          title="Download document"
                          className="flex-1 sm:flex-none"
                        >
                          <Download className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                        
                        {uploadedDoc.admin_status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                              onClick={() => handleQuickApprove(uploadedDoc.id)}
                              title="Approve document"
                            >
                              <Check className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Approve</span>
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="flex-1 sm:flex-none"
                              onClick={() => handleQuickReject(uploadedDoc.id)}
                              title="Reject document"
                            >
                              <X className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Reject</span>
                            </Button>
                          </>
                        )}
                        
                        {uploadedDoc.admin_status === 'approved' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                            onClick={() => {
                              setReviewingDoc(uploadedDoc.id);
                              setReviewStatus('rejected');
                            }}
                            title="Change to rejected"
                          >
                            <X className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Reject</span>
                          </Button>
                        )}
                        
                        {uploadedDoc.admin_status === 'rejected' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 hover:bg-green-50 flex-1 sm:flex-none"
                            onClick={() => handleQuickApprove(uploadedDoc.id)}
                            title="Change to approved"
                          >
                            <Check className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Approve</span>
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setReviewingDoc(uploadedDoc.id);
                            setReviewStatus(uploadedDoc.admin_status);
                            setReviewComments(uploadedDoc.admin_comments || '');
                          }}
                          className="flex-1 sm:flex-none"
                        >
                          <Edit className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Review</span>
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteDocument(uploadedDoc.id)}
                          title="Delete document"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Request Document Dialog */}
      <RequestDocumentDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        leadId={leadId}
        leadName={leadName}
        programName={programName}
        onRequestSent={() => {
          onDocumentUploaded();
        }}
      />

      {/* Review Dialog */}
      <Dialog open={!!reviewingDoc} onOpenChange={(open) => !open && setReviewingDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={reviewStatus} onValueChange={setReviewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Comments</label>
              <Textarea
                placeholder="Add comments (optional)"
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewingDoc(null)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={!reviewStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};