import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  FileType
} from 'lucide-react';
import { documentService, DocumentRequirement, LeadDocument } from '@/services/documentService';

interface DocumentUploadProps {
  leadId: string;
  programName: string;
  documents: LeadDocument[];
  onDocumentUploaded: () => void;
  onDocumentDeleted: () => void;
  onStatusUpdated: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  leadId,
  programName,
  documents,
  onDocumentUploaded,
  onDocumentDeleted,
  onStatusUpdated
}) => {
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedRequirement, setSelectedRequirement] = useState<string>('');
  const [customDocumentName, setCustomDocumentName] = useState('');
  const [reviewingDoc, setReviewingDoc] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<string>('');
  const [reviewComments, setReviewComments] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    loadRequirements();
  }, [programName]);

  const loadRequirements = async () => {
    try {
      const reqs = await documentService.getDocumentRequirements(programName);
      setRequirements(reqs);
    } catch (error) {
      console.error('Error loading requirements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document requirements',
        variant: 'destructive'
      });
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      await documentService.uploadDocument(
        leadId,
        file,
        selectedRequirement,
        customDocumentName || file.name
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: 'Upload successful',
        description: 'Document has been uploaded successfully'
      });

      // Reset form
      setSelectedRequirement('');
      setCustomDocumentName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
      setUploadProgress(0);
    }
  };

  const handleStatusUpdate = async () => {
    if (!reviewingDoc || !reviewStatus) return;

    try {
      await documentService.updateDocumentStatus(reviewingDoc, reviewStatus, reviewComments);
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

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await documentService.deleteDocument(documentId);
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
      const url = await documentService.getDocumentUrl(filePath);
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

  const getFileIcon = (documentType: string) => {
    if (documentType.includes('image')) return <Image className="h-4 w-4" />;
    if (documentType.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <FileType className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { variant: 'secondary' as const, text: 'Pending Review' },
      approved: { variant: 'default' as const, text: 'Approved' },
      rejected: { variant: 'destructive' as const, text: 'Rejected' },
      uploaded: { variant: 'outline' as const, text: 'Uploaded' }
    };
    
    const config = configs[status as keyof typeof configs] || { variant: 'outline' as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getRequirementStatus = (requirementId: string) => {
    const doc = documents.find(d => d.requirement_id === requirementId);
    if (!doc) return null;
    return doc.admin_status;
  };

  const isRequirementComplete = (requirementId: string) => {
    return getRequirementStatus(requirementId) === 'approved';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Document Requirement</label>
              <Select value={selectedRequirement} onValueChange={setSelectedRequirement}>
                <SelectTrigger>
                  <SelectValue placeholder="Select requirement (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific requirement</SelectItem>
                  {requirements.map((req) => (
                    <SelectItem key={req.id} value={req.id}>
                      {req.name} {req.required && '*'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Custom Document Name</label>
              <Input
                placeholder="Enter custom name (optional)"
                value={customDocumentName}
                onChange={(e) => setCustomDocumentName(e.target.value)}
              />
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            
            {uploading ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Uploading...</div>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </div>
                <div className="text-xs text-muted-foreground">
                  PDF, JPG, PNG, DOC, DOCX (max 10MB)
                </div>
                <Button onClick={handleFileSelect} variant="outline">
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Requirements Checklist */}
      {requirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Document Requirements for {programName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requirements.map((req) => {
                const isComplete = isRequirementComplete(req.id);
                const status = getRequirementStatus(req.id);
                
                return (
                  <div key={req.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-1">
                      {isComplete ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : status ? (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <div className="h-4 w-4 border rounded border-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{req.name}</h4>
                        {req.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                        {status && getStatusBadge(status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{req.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-8 w-8 mx-auto mb-2" />
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getFileIcon(doc.document_type)}
                </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{doc.document_name}</h4>
                      {getStatusBadge(doc.admin_status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                    {doc.admin_comments && (
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        Comment: {doc.admin_comments}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDocument(doc.file_path)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setReviewingDoc(doc.id)}
                    >
                      Review
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      {reviewingDoc && (
        <Card>
          <CardHeader>
            <CardTitle>Review Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            
            <div className="flex gap-2">
              <Button onClick={handleStatusUpdate} disabled={!reviewStatus}>
                Update Status
              </Button>
              <Button variant="outline" onClick={() => setReviewingDoc(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};