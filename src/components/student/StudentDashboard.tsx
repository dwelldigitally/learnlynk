
import React, { useState, useRef } from "react";
import { Upload, FileText, Eye, MessageSquare, Scan, Download, Trash2, CheckCircle, AlertCircle, Clock, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { studentApplications } from "@/data/studentApplications";
import { ApplicationDocument, DocumentComment } from "@/types/application";
import { OCRResultsModal } from "./OCRResultsModal";

const StudentDashboard: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedProgram, setSelectedProgram] = useState("Health Care Assistant");
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState<string | null>(null);
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<ApplicationDocument | null>(null);
  const [isProgramPopoverOpen, setIsProgramPopoverOpen] = useState(false);
  const [ocrModalDocument, setOcrModalDocument] = useState<ApplicationDocument | null>(null);

  // Get current application data
  const currentApplication = studentApplications[selectedProgram];
  const availablePrograms = Object.keys(studentApplications);

  const handleProgramChange = (program: string) => {
    setSelectedProgram(program);
    setIsProgramPopoverOpen(false);
  };

  const handleFileUpload = (requirementId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const requirement = currentApplication.requirements.find(req => req.id === requirementId);
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
        toast({
          title: "Document uploaded successfully",
          description: `${file.name} has been uploaded and is under review`
        });
        setUploadingTo(null);
      }, 2000);
    });
  };

  const performOCR = async (document: ApplicationDocument) => {
    setOcrLoading(document.id);
    
    // Simulate OCR processing
    setTimeout(() => {
      setOcrLoading(null);
      setOcrModalDocument(document);
      toast({
        title: "OCR processing completed",
        description: "Review and verify the extracted information"
      });
    }, 3000);
  };

  const handleOCRSave = (extractedData: Record<string, string>) => {
    toast({
      title: "OCR data saved",
      description: "The extracted information has been saved to the document"
    });
    setOcrModalDocument(null);
  };

  const addComment = (documentId: string) => {
    if (!newComment.trim()) return;

    const comment: DocumentComment = {
      id: Date.now().toString(),
      author: "Tushar Malhotra",
      text: newComment,
      timestamp: new Date(),
      isAdvisor: false
    };

    setNewComment("");
    toast({
      title: "Comment added",
      description: "Your comment has been posted"
    });
  };

  const deleteDocument = (documentId: string) => {
    toast({
      title: "Document deleted",
      description: "The document has been removed"
    });
  };

  const getStatusColor = (status: ApplicationDocument['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ApplicationDocument['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const completedRequirements = currentApplication.requirements.filter(req => 
    currentApplication.documents.some(doc => doc.requirementId === req.id && doc.status === 'approved')
  ).length;

  const totalDocuments = currentApplication.documents.length;

  return (
    <div className="space-y-10 p-8 bg-gradient-to-br from-gray-50/50 to-blue-50/30 min-h-screen">
      {/* Header with Program Selection */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-12 py-10 rounded-2xl shadow-2xl border border-blue-400/30 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Document Management</h1>
              <Popover open={isProgramPopoverOpen} onOpenChange={setIsProgramPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-white text-blue-700 border-blue-200 hover:bg-blue-50 px-4 py-2 flex items-center gap-2 font-semibold shadow-sm">
                    📋 {selectedProgram} Program
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-white z-50" align="start">
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-3 text-gray-900">Select Program</h3>
                    <div className="space-y-2">
                      {availablePrograms.map((program) => (
                        <div 
                          key={program}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                            selectedProgram === program ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                          }`}
                          onClick={() => handleProgramChange(program)}
                        >
                          <p className="font-medium text-gray-900">{program}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Application ID: {studentApplications[program].id}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Progress</div>
            <div className="text-xl font-bold">{completedRequirements}/{currentApplication.requirements.length}</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={(completedRequirements / currentApplication.requirements.length) * 100} className="bg-blue-800" />
        </div>
        
        {/* Motivational Message */}
        <div className="mt-4 text-center">
          <p className="text-blue-100 text-sm">
            🌟 Keep going! You're almost there - complete your documents profile to move forward in your application journey.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="p-8 bg-gradient-to-br from-white via-blue-50/20 to-blue-100/40 hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:scale-105 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-100 rounded-2xl shadow-lg border border-blue-200/50">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalDocuments}</div>
              <div className="text-sm text-muted-foreground">Total Documents</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-8 bg-gradient-to-br from-white via-green-50/20 to-green-100/40 hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:scale-105 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-green-100 rounded-2xl shadow-lg border border-green-200/50">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{currentApplication.documents.filter(doc => doc.status === 'approved').length}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-8 bg-gradient-to-br from-white via-yellow-50/20 to-yellow-100/40 hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:scale-105 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-yellow-100 rounded-2xl shadow-lg border border-yellow-200/50">
              <Clock className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{currentApplication.documents.filter(doc => doc.status === 'under-review').length}</div>
              <div className="text-sm text-muted-foreground">Under Review</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-8 bg-gradient-to-br from-white via-red-50/20 to-red-100/40 hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:scale-105 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-red-100 rounded-2xl shadow-lg border border-red-200/50">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{currentApplication.documents.filter(doc => doc.status === 'rejected').length}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Requirements List */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">Program Requirements</h2>
        
        {currentApplication.requirements.map((requirement) => {
          const requirementDocuments = currentApplication.documents.filter(doc => doc.requirementId === requirement.id);
          
          return (
            <Card key={requirement.id} className="p-10 bg-gradient-to-br from-white via-gray-50/50 to-slate-50/30 hover:shadow-2xl transition-all duration-500 border-0 shadow-xl hover:scale-[1.02] backdrop-blur-sm">
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
                        {requirementDocuments.length === 0 ? "Upload" : "Reupload"}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Document List */}
              {requirementDocuments.length > 0 && (
                <div className="space-y-4 mt-6 border-t pt-6">
                  {requirementDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
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
                            title="Preview document and extract text"
                          >
                            {ocrLoading === document.id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
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

              {requirementDocuments.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No documents uploaded yet. Please upload the required documents to proceed with your application.
                  </AlertDescription>
                </Alert>
              )}
            </Card>
          );
        })}
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

      {/* OCR Results Modal */}
      {ocrModalDocument && (
        <OCRResultsModal
          isOpen={!!ocrModalDocument}
          onClose={() => setOcrModalDocument(null)}
          document={ocrModalDocument}
          onSave={handleOCRSave}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
