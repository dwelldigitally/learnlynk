
import React, { useState, useRef } from "react";
import { Upload, FileText, Eye, MessageSquare, Scan, Download, Trash2, CheckCircle, AlertCircle, Clock, ChevronDown, Info, Star, Target } from "lucide-react";
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
    <div className="space-y-8 p-6 bg-background min-h-screen">
      {/* Header with Program Selection and Quick Actions */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground px-8 py-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <h1 className="text-3xl font-bold">Document Hub</h1>
            </div>
            <p className="text-primary-foreground/80 text-lg">Track and manage your application documents</p>
            
            <Popover open={isProgramPopoverOpen} onOpenChange={setIsProgramPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="secondary" className="mt-3 px-4 py-2 flex items-center gap-2 font-semibold">
                  📋 {selectedProgram}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-background z-50" align="start">
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-3">Select Program</h3>
                  <div className="space-y-2">
                    {availablePrograms.map((program) => (
                      <div 
                        key={program}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-muted ${
                          selectedProgram === program ? 'border-primary bg-primary/10' : 'border-border'
                        }`}
                        onClick={() => handleProgramChange(program)}
                      >
                        <p className="font-medium">{program}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          ID: {studentApplications[program].id}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="text-center">
            <div className="mb-2">
              <div className="text-4xl font-bold">{completedRequirements}</div>
              <div className="text-primary-foreground/80 text-sm">of {currentApplication.requirements.length} completed</div>
            </div>
            <div className="w-24">
              <Progress 
                value={(completedRequirements / currentApplication.requirements.length) * 100} 
                className="bg-primary-foreground/20 h-2" 
              />
            </div>
          </div>
        </div>
        
        {/* Progress Message */}
        <Alert className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
          <Star className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {completedRequirements === currentApplication.requirements.length 
              ? "🎉 Excellent! All documents completed. Your application is ready for review."
              : `📋 ${currentApplication.requirements.length - completedRequirements} more documents needed to complete your application.`
            }
          </AlertDescription>
        </Alert>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{totalDocuments}</div>
              <div className="text-sm text-muted-foreground">Total Docs</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentApplication.documents.filter(doc => doc.status === 'approved').length}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentApplication.documents.filter(doc => doc.status === 'under-review').length}</div>
              <div className="text-sm text-muted-foreground">In Review</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentApplication.documents.filter(doc => doc.status === 'rejected').length}</div>
              <div className="text-sm text-muted-foreground">Needs Action</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Document Requirements */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Document Requirements</h2>
            <p className="text-muted-foreground mt-1">Upload and track your application documents</p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {currentApplication.requirements.length} requirements
          </Badge>
        </div>
        
        <div className="space-y-4">
          {currentApplication.requirements.map((requirement) => {
            const requirementDocuments = currentApplication.documents.filter(doc => doc.requirementId === requirement.id);
            const hasApproved = requirementDocuments.some(doc => doc.status === 'approved');
            
            return (
              <Card key={requirement.id} className={`p-6 transition-all hover:shadow-md ${hasApproved ? 'border-green-200 bg-green-50/30' : ''}`}>
                <div className="space-y-4">
                  {/* Requirement Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${hasApproved ? 'bg-green-100' : 'bg-muted'}`}>
                          {hasApproved ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{requirement.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {requirement.mandatory && <Badge variant="destructive" className="text-xs">Required</Badge>}
                            {hasApproved && <Badge variant="default" className="text-xs bg-green-100 text-green-800">Complete</Badge>}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground ml-12">{requirement.description}</p>
                      
                      <div className="flex items-center gap-4 ml-12 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          <span>Formats: {requirement.acceptedFormats.join(', ')}</span>
                        </div>
                        <span>•</span>
                        <span>Max: {requirement.maxSize}MB</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => {
                        setSelectedRequirement(requirement.id);
                        fileInputRef.current?.click();
                      }}
                      disabled={uploadingTo === requirement.id}
                      size="sm"
                      className="ml-4"
                    >
                      {uploadingTo === requirement.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {requirementDocuments.length === 0 ? "Upload" : "Add File"}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Documents List */}
                  {requirementDocuments.length > 0 && (
                    <div className="ml-12 space-y-3 border-t pt-4">
                      {requirementDocuments.map((document) => (
                        <div key={document.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{document.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {document.type} • {(document.size / 1024).toFixed(1)} KB • {document.uploadDate.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(document.status)} border-0`}
                            >
                              {getStatusIcon(document.status)}
                              <span className="ml-1 capitalize">{document.status.replace('-', ' ')}</span>
                            </Badge>
                            
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => performOCR(document)}
                                disabled={ocrLoading === document.id}
                                className="h-8 w-8 p-0"
                              >
                                {ocrLoading === document.id ? (
                                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Eye className="w-3 h-3" />
                                )}
                              </Button>
                              
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteDocument(document.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {requirementDocuments.length === 0 && (
                    <Alert className="ml-12">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No documents uploaded yet. Click "Upload" to add your {requirement.name.toLowerCase()}.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
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
