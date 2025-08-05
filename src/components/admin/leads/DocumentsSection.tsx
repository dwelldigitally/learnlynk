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

interface LeadDocument {
  id: string;
  lead_id: string;
  name: string;
  type: string;
  file_url: string;
  file_size: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  uploaded_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  comments?: string;
}

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
  const [comments, setComments] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [lead.id]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      // Mock document data for now - in real app would fetch from documents table
      const mockDocuments: LeadDocument[] = [
        {
          id: '1',
          lead_id: lead.id,
          name: 'Academic Transcript.pdf',
          type: 'transcript',
          file_url: '/documents/transcript.pdf',
          file_size: 1024000,
          status: 'approved',
          uploaded_at: '2024-01-10T10:00:00Z',
          reviewed_at: '2024-01-11T15:30:00Z',
          reviewed_by: 'admin@university.edu',
          comments: 'Excellent academic record. All requirements met.'
        },
        {
          id: '2',
          lead_id: lead.id,
          name: 'Personal Statement.docx',
          type: 'personal_statement',
          file_url: '/documents/personal_statement.docx',
          file_size: 512000,
          status: 'under_review',
          uploaded_at: '2024-01-12T14:20:00Z'
        },
        {
          id: '3',
          lead_id: lead.id,
          name: 'Passport Copy.jpg',
          type: 'identification',
          file_url: '/documents/passport.jpg',
          file_size: 2048000,
          status: 'pending',
          uploaded_at: '2024-01-13T09:15:00Z'
        }
      ];
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
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

    try {
      // In real app, would upload to Supabase storage
      const newDocument: LeadDocument = {
        id: `new-${Date.now()}`,
        lead_id: lead.id,
        name: selectedFile.name,
        type: documentType,
        file_url: `/documents/${selectedFile.name}`,
        file_size: selectedFile.size,
        status: 'pending',
        uploaded_at: new Date().toISOString(),
        comments: comments || undefined
      };

      setDocuments(prev => [newDocument, ...prev]);
      setSelectedFile(null);
      setDocumentType('');
      setComments('');
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
    }
  };

  const handleStatusUpdate = async (documentId: string, newStatus: LeadDocument['status'], reviewComments?: string) => {
    try {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: newStatus, 
              reviewed_at: new Date().toISOString(),
              reviewed_by: 'current_user@university.edu',
              comments: reviewComments || doc.comments
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

  const getStatusIcon = (status: LeadDocument['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'under_review': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: LeadDocument['status']) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'under_review': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const formatFileSize = (bytes: number) => {
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
          <div className="text-center py-4">Loading documents...</div>
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
                  <Label htmlFor="document-comments">Comments (Optional)</Label>
                  <Textarea
                    id="document-comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Additional notes about this document..."
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleFileUpload} disabled={!selectedFile || !documentType}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
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
                        <span className="font-medium">{doc.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {documentTypes.find(t => t.value === doc.type)?.label || doc.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>Uploaded {format(new Date(doc.uploaded_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(doc.status)}
                      <Badge variant={getStatusVariant(doc.status)} className="text-xs">
                        {doc.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {doc.comments && (
                  <div className="bg-muted/50 p-2 rounded text-sm">
                    <span className="font-medium">Comments: </span>
                    {doc.comments}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  
                  {doc.status === 'pending' && (
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