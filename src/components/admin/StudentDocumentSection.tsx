import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  AlertCircle,
  Upload
} from "lucide-react";
import { ProgramApplication, ApplicationDocument } from "@/types/application";

interface StudentDocumentSectionProps {
  applications: ProgramApplication[];
}

const StudentDocumentSection: React.FC<StudentDocumentSectionProps> = ({ applications }) => {
  const [selectedDocument, setSelectedDocument] = useState<(ApplicationDocument & { programName: string; applicationId: string }) | null>(null);
  const [comment, setComment] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Combine all documents from all applications
  const allDocuments = applications.flatMap(app => 
    app.documents.map(doc => ({
      ...doc,
      programName: app.programName,
      applicationId: app.id
    }))
  ) as (ApplicationDocument & { programName: string; applicationId: string })[];

  const filteredDocuments = allDocuments.filter(doc => {
    if (activeFilter === "all") return true;
    return doc.status === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      case "under-review": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      case "under-review": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "pending": return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleApproveDocument = (documentId: string) => {
    console.log(`Approving document ${documentId}`);
    // Update document status logic here
  };

  const handleRejectDocument = (documentId: string, reason: string) => {
    console.log(`Rejecting document ${documentId} with reason: ${reason}`);
    // Update document status logic here
  };

  const handleAddComment = (documentId: string, commentText: string) => {
    console.log(`Adding comment to document ${documentId}: ${commentText}`);
    // Add comment logic here
    setComment("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const documentStats = {
    total: allDocuments.length,
    pending: allDocuments.filter(d => d.status === 'pending').length,
    underReview: allDocuments.filter(d => d.status === 'under-review').length,
    approved: allDocuments.filter(d => d.status === 'approved').length,
    rejected: allDocuments.filter(d => d.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{documentStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{documentStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold">{documentStats.underReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{documentStats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{documentStats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Management */}
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="under-review">Under Review</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeFilter}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{document.name}</p>
                            <p className="text-xs text-muted-foreground">{document.type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{document.programName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{document.uploadDate.toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatFileSize(document.size)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(document.status)}
                          <Badge variant={getStatusColor(document.status)}>
                            {document.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {document.comments.length > 0 ? (
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-xs">{document.comments.length}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedDocument(document)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-3 w-3" />
                          </Button>
                          {document.status === 'pending' || document.status === 'under-review' ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleApproveDocument(document.id)}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleRejectDocument(document.id, "Please re-submit")}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Detail Modal/Panel */}
      {selectedDocument && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Details: {selectedDocument.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDocument(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="font-medium">{selectedDocument.programName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upload Date</p>
                <p className="font-medium">{selectedDocument.uploadDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">File Size</p>
                <p className="font-medium">{formatFileSize(selectedDocument.size)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusColor(selectedDocument.status)}>
                  {selectedDocument.status.replace('-', ' ')}
                </Badge>
              </div>
            </div>

            {/* OCR Text */}
            {selectedDocument.ocrText && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Extracted Text (OCR)</p>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  {selectedDocument.ocrText}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Comments</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedDocument.comments.map((comment) => (
                  <div key={comment.id} className="p-2 border rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
                {selectedDocument.comments.length === 0 && (
                  <p className="text-sm text-muted-foreground">No comments yet</p>
                )}
              </div>
            </div>

            {/* Add Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Comment</label>
              <Textarea
                placeholder="Add a comment about this document..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleAddComment(selectedDocument.id, comment)}
                  disabled={!comment.trim()}
                >
                  Add Comment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600"
                  onClick={() => handleApproveDocument(selectedDocument.id)}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                  onClick={() => handleRejectDocument(selectedDocument.id, comment || "Please re-submit")}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDocumentSection;