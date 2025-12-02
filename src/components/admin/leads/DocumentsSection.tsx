import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Download, Eye, Plus, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Lead } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { documentService, LeadDocument } from '@/services/documentService';

interface DocumentsSectionProps {
  lead: Lead;
  onUpdate: () => void;
}

export function DocumentsSection({ lead, onUpdate }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [lead.id]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getLeadDocuments(lead.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Error",
        description: "Please select a file and document type",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const newDocument = await documentService.uploadDocument(
        lead.id,
        selectedFile,
        undefined,
        documentName || selectedFile.name
      );

      setDocuments(prev => [newDocument, ...prev]);
      setSelectedFile(null);
      setDocumentType('');
      setDocumentName('');
      setUploadDialogOpen(false);
      onUpdate();

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleStatusUpdate = async (documentId: string, newStatus: string, reviewComments?: string) => {
    try {
      await documentService.updateDocumentStatus(documentId, newStatus, reviewComments);
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              admin_status: newStatus, 
              admin_reviewed_at: new Date().toISOString(),
              admin_comments: reviewComments || doc.admin_comments
            }
          : doc
      ));

      toast({
        title: "Success",
        description: `Document ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating document status:', error);
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive"
      });
    }
  };

  const handleViewDocument = async (doc: LeadDocument) => {
    if (!doc.file_path) {
      toast({
        title: "Error",
        description: "Document file not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = await documentService.getDocumentUrl(doc.file_path);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error getting document URL:', error);
      toast({
        title: "Error",
        description: "Failed to open document",
        variant: "destructive"
      });
    }
  };

  const handleDownloadDocument = async (doc: LeadDocument) => {
    if (!doc.file_path) {
      toast({
        title: "Error",
        description: "Document file not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = await documentService.getDocumentUrl(doc.file_path);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.original_filename || doc.document_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'under_review': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status?: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'under_review': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const documentTypes = [
    { value: 'transcript', label: 'Academic Transcript' },
    { value: 'personal_statement', label: 'Personal Statement' },
    { value: 'cv_resume', label: 'CV/Resume' },
    { value: 'identification', label: 'ID/Passport' },
    { value: 'language_certificate', label: 'Language Certificate' },
    { value: 'recommendation_letter', label: 'Recommendation Letter' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'other', label: 'Other' }
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents ({documents.length})
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document-file">Select File</Label>
                  <Input
                    id="document-file"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
                
                <div>
                  <Label>Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="document-name">Document Name (Optional)</Label>
                  <Input
                    id="document-name"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Enter a custom name for this document"
                  />
                </div>
                
                <Button 
                  onClick={handleFileUpload} 
                  disabled={!selectedFile || !documentType || uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm mt-1">Upload the first document to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{doc.document_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {documentTypes.find(t => t.value === doc.document_type)?.label || doc.document_type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>Uploaded {format(new Date(doc.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(doc.admin_status)}
                      <Badge variant={getStatusVariant(doc.admin_status)} className="text-xs">
                        {(doc.admin_status || 'pending').replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {doc.admin_comments && (
                  <div className="bg-muted/50 p-2 rounded text-sm">
                    <span className="font-medium">Comments: </span>
                    {doc.admin_comments}
                  </div>
                )}

                {doc.ai_insight && (
                  <div className="bg-primary/5 p-2 rounded text-sm">
                    <span className="font-medium">AI Insight: </span>
                    {doc.ai_insight}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewDocument(doc)}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)}>
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  
                  {doc.admin_status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(doc.id, 'approved', 'Document approved')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(doc.id, 'rejected', 'Document rejected - please resubmit')}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
