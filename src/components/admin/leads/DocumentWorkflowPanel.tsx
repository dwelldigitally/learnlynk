import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Download, 
  Plus,
  Clock,
  User,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentTypeOptions } from '@/hooks/usePropertyOptions';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_revision';
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
  url?: string;
  required: boolean;
}

interface DocumentWorkflowPanelProps {
  leadId: string;
  documents?: Document[];
}

export function DocumentWorkflowPanel({ leadId, documents = [] }: DocumentWorkflowPanelProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'request_revision'>('approve');
  const [reviewComments, setReviewComments] = useState('');
  const { options: documentTypeOptions } = useDocumentTypeOptions();

  // Demo documents
  const demoDocuments: Document[] = [
    {
      id: '1',
      name: 'High School Transcript.pdf',
      type: 'transcript',
      size: 2.4,
      uploadDate: '2024-01-18T10:30:00Z',
      status: 'approved',
      reviewedBy: 'Sarah Johnson',
      reviewDate: '2024-01-19T14:20:00Z',
      comments: 'GPA meets requirements. All courses verified.',
      required: true,
      url: '#'
    },
    {
      id: '2',
      name: 'Personal Statement.docx',
      type: 'essay',
      size: 1.2,
      uploadDate: '2024-01-19T16:45:00Z',
      status: 'under_review',
      required: true
    },
    {
      id: '3',
      name: 'Letter of Recommendation 1.pdf',
      type: 'recommendation',
      size: 0.8,
      uploadDate: '2024-01-20T09:15:00Z',
      status: 'requires_revision',
      reviewedBy: 'Mike Chen',
      reviewDate: '2024-01-20T11:30:00Z',
      comments: 'Letter needs to be on official letterhead and signed.',
      required: true,
      url: '#'
    },
    {
      id: '4',
      name: 'Portfolio.zip',
      type: 'portfolio',
      size: 15.7,
      uploadDate: '2024-01-15T14:20:00Z',
      status: 'pending',
      required: false
    }
  ];

  const displayDocuments = documents.length > 0 ? documents : demoDocuments;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'requires_revision':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'default',
      rejected: 'destructive',
      requires_revision: 'secondary',
      under_review: 'outline',
      pending: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const formatFileSize = (sizeInMB: number): string => {
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const calculateProgress = (): number => {
    const requiredDocs = displayDocuments.filter(doc => doc.required);
    const approvedRequiredDocs = requiredDocs.filter(doc => doc.status === 'approved');
    return requiredDocs.length > 0 ? (approvedRequiredDocs.length / requiredDocs.length) * 100 : 0;
  };

  const uploadDocument = async () => {
    setIsUploading(true);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Document Uploaded Successfully',
        description: 'The document has been uploaded and is pending review',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading the document. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const reviewDocument = async () => {
    if (!selectedDoc) return;
    
    try {
      // Simulate review action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Review Completed',
        description: `Document has been ${reviewAction.replace('_', ' ')}d`,
        variant: 'default'
      });
      
      setSelectedDoc(null);
      setReviewComments('');
    } catch (error) {
      toast({
        title: 'Review Failed',
        description: 'There was an error processing the review. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Workflow
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Document Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                      {documentTypeOptions.length === 0 && (
                        <SelectItem value="other">Other</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your file here, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Notes (Optional)</label>
                  <Textarea placeholder="Add any notes about this document..." rows={3} />
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={uploadDocument} disabled={isUploading} className="flex-1">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      'Upload Document'
                    )}
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        
        {/* Progress Overview */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Required Documents Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(calculateProgress())}% Complete</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {displayDocuments.length > 0 ? (
            <div className="space-y-3">
              {displayDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(doc.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{doc.name}</h4>
                          {doc.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {doc.type} • {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {doc.status !== 'pending' && doc.reviewedBy && (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3 w-3" />
                          <span>Reviewed by {doc.reviewedBy}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {doc.reviewDate && new Date(doc.reviewDate).toLocaleDateString()}
                        </span>
                      </div>
                      {doc.comments && (
                        <div className="bg-muted rounded p-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-3 w-3 mt-0.5 text-muted-foreground" />
                            <span>{doc.comments}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    {doc.url && (
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    )}
                    {doc.status === 'under_review' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedDoc(doc)}>
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review Document</DialogTitle>
                          </DialogHeader>
                          {selectedDoc && (
                            <div className="space-y-4">
                              <div className="border rounded-lg p-3">
                                <h3 className="font-medium">{selectedDoc.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {selectedDoc.type} • {formatFileSize(selectedDoc.size)}
                                </p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Review Action</label>
                                <Select value={reviewAction} onValueChange={(value) => setReviewAction(value as any)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="approve">Approve</SelectItem>
                                    <SelectItem value="reject">Reject</SelectItem>
                                    <SelectItem value="request_revision">Request Revision</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Comments</label>
                                <Textarea 
                                  value={reviewComments}
                                  onChange={(e) => setReviewComments(e.target.value)}
                                  placeholder="Add review comments..."
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex gap-3">
                                <Button onClick={reviewDocument} className="flex-1">
                                  Submit Review
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedDoc(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground font-medium">No documents uploaded</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Documents will appear here once uploaded
              </p>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload First Document
              </Button>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}