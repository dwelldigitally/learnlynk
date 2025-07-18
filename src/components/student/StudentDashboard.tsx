import React, { useState, useRef } from "react";
import { Upload, FileText, Eye, MessageSquare, Scan, Download, Trash2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  ocrText?: string;
  comments: Comment[];
  requirement: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  isAdvisor: boolean;
}

interface ProgramRequirement {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  acceptedFormats: string[];
  maxSize: number;
  documents: Document[];
}

const StudentDashboard: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState<string | null>(null);
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Program requirements for Health Care Assistant
  const [requirements, setRequirements] = useState<ProgramRequirement[]>([
    {
      id: "transcripts",
      name: "Official Transcripts",
      description: "High school or post-secondary transcripts",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 10, // MB
      documents: []
    },
    {
      id: "immunization",
      name: "Immunization Records",
      description: "Complete immunization history including COVID-19",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      documents: []
    },
    {
      id: "criminal-check",
      name: "Criminal Record Check",
      description: "Recent criminal background check (within 6 months)",
      mandatory: true,
      acceptedFormats: ["PDF"],
      maxSize: 5,
      documents: []
    },
    {
      id: "first-aid",
      name: "First Aid Certificate",
      description: "Valid CPR and First Aid certification",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      documents: []
    },
    {
      id: "photo-id",
      name: "Photo Identification",
      description: "Government-issued photo ID (passport, driver's license)",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      documents: []
    },
    {
      id: "healthcare-experience",
      name: "Healthcare Experience Letter",
      description: "Letter from healthcare employer (if applicable)",
      mandatory: false,
      acceptedFormats: ["PDF", "DOC", "DOCX"],
      maxSize: 5,
      documents: []
    }
  ]);

  const handleFileUpload = (requirementId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const requirement = requirements.find(req => req.id === requirementId);
    if (!requirement) return;

    Array.from(files).forEach(file => {
      // Validate file format
      const fileExtension = file.name.split('.').pop()?.toUpperCase();
      if (!requirement.acceptedFormats.includes(fileExtension || '')) {
        toast({
          title: "Invalid file format",
          description: `Please upload files in one of these formats: ${requirement.acceptedFormats.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      // Validate file size
      if (file.size > requirement.maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${requirement.maxSize}MB`,
          variant: "destructive"
        });
        return;
      }

      setUploadingTo(requirementId);
      
      // Simulate upload
      setTimeout(() => {
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: fileExtension || '',
          size: file.size,
          uploadDate: new Date(),
          status: 'under-review',
          comments: [],
          requirement: requirementId
        };

        setRequirements(prev => prev.map(req => 
          req.id === requirementId 
            ? { ...req, documents: [...req.documents, newDocument] }
            : req
        ));

        setUploadingTo(null);
        toast({
          title: "Document uploaded successfully",
          description: `${file.name} has been uploaded and is under review`
        });
      }, 2000);
    });
  };

  const performOCR = async (document: Document) => {
    setOcrLoading(document.id);
    
    // Simulate OCR processing
    setTimeout(() => {
      const mockOcrText = `Extracted text from ${document.name}:\n\nThis is a sample OCR extraction. In a real implementation, this would contain the actual text content extracted from the document using OCR technology.\n\nDocument details:\n- Date: ${document.uploadDate.toLocaleDateString()}\n- Type: ${document.type}\n- Size: ${(document.size / 1024).toFixed(2)} KB`;
      
      setRequirements(prev => prev.map(req => ({
        ...req,
        documents: req.documents.map(doc => 
          doc.id === document.id 
            ? { ...doc, ocrText: mockOcrText }
            : doc
        )
      })));

      setOcrLoading(null);
      toast({
        title: "OCR completed",
        description: "Text has been extracted from the document"
      });
    }, 3000);
  };

  const addComment = (documentId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Tushar Malhotra",
      text: newComment,
      timestamp: new Date(),
      isAdvisor: false
    };

    setRequirements(prev => prev.map(req => ({
      ...req,
      documents: req.documents.map(doc => 
        doc.id === documentId 
          ? { ...doc, comments: [...doc.comments, comment] }
          : doc
      )
    })));

    setNewComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been posted"
    });
  };

  const deleteDocument = (documentId: string) => {
    setRequirements(prev => prev.map(req => ({
      ...req,
      documents: req.documents.filter(doc => doc.id !== documentId)
    })));
    
    toast({
      title: "Document deleted",
      description: "The document has been removed"
    });
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const completedRequirements = requirements.filter(req => 
    req.documents.some(doc => doc.status === 'approved')
  ).length;

  const totalDocuments = requirements.reduce((sum, req) => sum + req.documents.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Document Management</h1>
            <p className="text-blue-100 mt-1">Health Care Assistant Program</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Progress</div>
            <div className="text-xl font-bold">{completedRequirements}/{requirements.length}</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={(completedRequirements / requirements.length) * 100} className="bg-blue-800" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalDocuments}</div>
              <div className="text-sm text-muted-foreground">Total Documents</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{requirements.reduce((sum, req) => sum + req.documents.filter(doc => doc.status === 'approved').length, 0)}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{requirements.reduce((sum, req) => sum + req.documents.filter(doc => doc.status === 'under-review').length, 0)}</div>
              <div className="text-sm text-muted-foreground">Under Review</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{requirements.reduce((sum, req) => sum + req.documents.filter(doc => doc.status === 'rejected').length, 0)}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Program Requirements</h2>
        
        {requirements.map((requirement) => (
          <Card key={requirement.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{requirement.name}</h3>
                  {requirement.mandatory && <Badge variant="destructive">Required</Badge>}
                </div>
                <p className="text-muted-foreground mt-1">{requirement.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Formats: {requirement.acceptedFormats.join(', ')}</span>
                  <span>Max size: {requirement.maxSize}MB</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedRequirement(requirement.id);
                    fileInputRef.current?.click();
                  }}
                  disabled={uploadingTo === requirement.id}
                  className="flex items-center gap-2"
                >
                  {uploadingTo === requirement.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Document List */}
            {requirement.documents.length > 0 && (
              <div className="space-y-3 mt-4 border-t pt-4">
                {requirement.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {document.type} • {(document.size / 1024).toFixed(2)} KB • {document.uploadDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(document.status)}>
                        {getStatusIcon(document.status)}
                        <span className="ml-1">{document.status.replace('-', ' ')}</span>
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => performOCR(document)}
                          disabled={ocrLoading === document.id}
                          title="Extract text with OCR"
                        >
                          {ocrLoading === document.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Scan className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDocument(document)}
                          title="View comments and communication"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        
                        <Button size="sm" variant="outline" title="Preview document">
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button size="sm" variant="outline" title="Download document">
                          <Download className="w-4 h-4" />
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteDocument(document.id)}
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {requirement.documents.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No documents uploaded yet. Please upload the required documents to proceed with your application.
                </AlertDescription>
              </Alert>
            )}
          </Card>
        ))}
      </div>

      {/* Document Communication Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-background shadow-lg border max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedDocument.name}</h3>
                  <p className="text-muted-foreground">Communication & OCR Results</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDocument(null)}
                >
                  ×
                </Button>
              </div>

              {/* OCR Results */}
              {selectedDocument.ocrText && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Extracted Text (OCR)</h4>
                  <div className="p-3 bg-muted/50 rounded-lg text-sm max-h-48 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{selectedDocument.ocrText}</pre>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="mb-4">
                <h4 className="font-medium mb-3">Comments & Communication</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedDocument.comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No comments yet. Start a conversation with your advisor.</p>
                  ) : (
                    selectedDocument.comments.map((comment) => (
                      <div key={comment.id} className={`p-3 rounded-lg ${comment.isAdvisor ? 'bg-blue-50 ml-8' : 'bg-muted/50 mr-8'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp.toLocaleString()}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Comment */}
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment or question about this document..."
                  className="flex-1"
                />
                <Button
                  onClick={() => addComment(selectedDocument.id)}
                  disabled={!newComment.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (selectedRequirement) {
            handleFileUpload(selectedRequirement, e.target.files);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default StudentDashboard;