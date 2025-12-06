import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  X, 
  Download, 
  FileText, 
  User, 
  GraduationCap, 
  Calendar, 
  AlertCircle,
  Loader2,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import { presetDocumentService } from '@/services/presetDocumentService';
import { toast } from 'sonner';
import { PendingDocument, EntryRequirementThreshold } from '@/services/salesRepService';

interface SalesRepDocumentApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PendingDocument | null;
  leadInfo: {
    id: string;
    name: string;
    email: string;
    program: string;
    campus?: string;
  };
  onApproved: () => void;
}

export function SalesRepDocumentApprovalModal({
  isOpen,
  onClose,
  document,
  leadInfo,
  onApproved
}: SalesRepDocumentApprovalModalProps) {
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (document?.file_path) {
      loadDocumentUrl();
    }
  }, [document?.file_path]);

  const loadDocumentUrl = async () => {
    if (!document?.file_path) return;
    setIsLoading(true);
    try {
      const url = await presetDocumentService.getDocumentUrl(document.file_path);
      setDocumentUrl(url);
    } catch (error) {
      console.error('Error loading document URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!document) return;
    setIsApproving(true);
    try {
      await presetDocumentService.updateDocumentStatus(document.id, 'approved', comments || undefined);
      toast.success('Document approved successfully');
      onApproved();
      onClose();
    } catch (error) {
      console.error('Error approving document:', error);
      toast.error('Failed to approve document');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!document) return;
    if (!comments.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setIsRejecting(true);
    try {
      await presetDocumentService.updateDocumentStatus(document.id, 'rejected', comments);
      toast.success('Document rejected');
      onApproved();
      onClose();
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('Failed to reject document');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDownload = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileTypeLabel = (type: string | null) => {
    if (!type) return 'Document';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('image')) return 'Image';
    if (type.includes('word')) return 'Word';
    return type.split('/')[1]?.toUpperCase() || 'Document';
  };

  if (!document) return null;

  const threshold = document.entryRequirement;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {document.document_name}
            <span className="text-muted-foreground font-normal">• {leadInfo.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Document Preview */}
          <div className="flex-[2] border-r border-border flex flex-col">
            <div className="flex-1 bg-muted/30 flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span>Loading document...</span>
                </div>
              ) : documentUrl ? (
                document.document_type?.includes('pdf') ? (
                  <iframe
                    src={documentUrl}
                    className="w-full h-full border-0"
                    title="Document Preview"
                  />
                ) : document.document_type?.includes('image') ? (
                  <img
                    src={documentUrl}
                    alt={document.document_name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <FileText className="w-16 h-16" />
                    <span>Preview not available</span>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download to view
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <FileText className="w-16 h-16" />
                  <span>No document file available</span>
                </div>
              )}
            </div>
            
            {/* File info bar */}
            <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center gap-4 text-sm text-muted-foreground">
              <span>{getFileTypeLabel(document.document_type)}</span>
              <span>•</span>
              <span>{formatFileSize(document.file_size)}</span>
            </div>
          </div>

          {/* Right Panel - Info & Actions */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
            {/* Document Information */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Lead Information
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{leadInfo.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-xs truncate max-w-[150px]">{leadInfo.email}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    Program
                  </span>
                  <span className="font-medium text-xs">{leadInfo.program}</span>
                </div>
                {leadInfo.campus && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Campus</span>
                    <span>{leadInfo.campus}</span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Uploaded
                  </span>
                  <span>{format(new Date(document.created_at), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge 
                    variant="outline" 
                    className={
                      document.admin_status === 'pending' 
                        ? 'border-orange-300 text-orange-600' 
                        : 'border-blue-300 text-blue-600'
                    }
                  >
                    {document.admin_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Threshold Requirements */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Threshold Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                {threshold ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Requirement</span>
                      <span className="font-medium">{threshold.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <Badge variant="secondary" className="capitalize">{threshold.type}</Badge>
                    </div>
                    {threshold.minimumGrade && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Min Grade</span>
                        <span className="font-medium">{threshold.minimumGrade}</span>
                      </div>
                    )}
                    {threshold.minimumScore && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Min Score</span>
                        <span className="font-medium">{threshold.minimumScore}</span>
                      </div>
                    )}
                    {threshold.yearsRequired && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Years Required</span>
                        <span className="font-medium">{threshold.yearsRequired} years</span>
                      </div>
                    )}
                    {threshold.alternatives && (
                      <div className="pt-1">
                        <span className="text-muted-foreground text-xs">Alternatives:</span>
                        <p className="text-xs mt-1">{threshold.alternatives}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    No specific threshold linked
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-sm">Review Comments</Label>
              <Textarea
                id="comments"
                placeholder="Add comments (required for rejection)..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4 space-y-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                >
                  {isApproving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Approve Document
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleReject}
                  disabled={isApproving || isRejecting}
                >
                  {isRejecting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  Reject Document
                </Button>
                <Separator />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownload}
                  disabled={!documentUrl}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Document
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}