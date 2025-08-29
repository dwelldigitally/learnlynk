import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, CheckCircle, AlertCircle, X, Camera, FileImage, Download } from "lucide-react";
import { motion } from "framer-motion";
import { usePageEntranceAnimation, useStaggeredReveal } from "@/hooks/useAnimations";
import { useStudentPortalContext } from "@/pages/StudentPortal";
import { useDocumentUpload, useStudentDocuments } from "@/hooks/useStudentPortalIntegration";
import { toast } from "@/hooks/use-toast";

const DocumentUpload: React.FC = () => {
  const { sessionId, leadId, isLoading } = useStudentPortalContext();
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [notes, setNotes] = useState("");
  const pageAnimation = usePageEntranceAnimation();
  const staggerAnimation = useStaggeredReveal(0.1);

  // Get existing documents and upload mutation
  const { data: documents, isLoading: documentsLoading } = useStudentDocuments(sessionId);
  const uploadMutation = useDocumentUpload();

  // Transform database documents to match UI expectations
  const uploadedDocuments = documents?.map((doc, index) => ({
    id: doc.id,
    name: doc.document_name,
    type: doc.document_type,
    status: doc.admin_status,
    uploadDate: new Date(doc.created_at).toISOString().split('T')[0],
    size: doc.file_size ? `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB` : 'Unknown',
    reviewComments: doc.admin_comments || null
  })) || [];

  const documentRequirements = [
    { id: "transcript", name: "Academic Transcript", required: true },
    { id: "language-test", name: "English Language Test", required: true },
    { id: "personal-statement", name: "Personal Statement", required: true },
    { id: "recommendation-letter", name: "Letter of Recommendation", required: false },
    { id: "portfolio", name: "Portfolio/Work Samples", required: false },
    { id: "financial-docs", name: "Financial Documents", required: false },
    { id: "passport", name: "Passport Copy", required: true },
    { id: "other", name: "Other Supporting Documents", required: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'under-review':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      case 'under-review':
      case 'pending':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0 || !selectedRequirement || !sessionId || !leadId) {
      toast({
        title: "Upload Error",
        description: "Please select a requirement type and ensure you're logged in.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const file = files[0];
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload document
      await uploadMutation.mutateAsync({
        sessionId,
        leadId,
        documentData: {
          document_name: file.name,
          document_type: selectedRequirement,
          file_size: file.size,
          requirement_id: selectedRequirement,
          metadata: {
            original_name: file.name,
            upload_notes: notes,
            mime_type: file.type
          }
        }
      });

      clearInterval(interval);
      setUploadProgress(100);
      
      // Reset form
      setSelectedRequirement("");
      setNotes("");
      
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (isLoading || documentsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto p-6 space-y-8 max-w-7xl"
      {...pageAnimation}
    >
      <motion.div {...staggerAnimation}>
        <h1 className="text-3xl font-bold text-foreground">Document Upload</h1>
        <p className="text-muted-foreground mt-2">
          Upload your required documents for application review. All documents should be in PDF format.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div {...staggerAnimation}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Document
              </CardTitle>
              <CardDescription>
                Select the document type and upload your file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="requirement">Document Type *</Label>
                <Select value={selectedRequirement} onValueChange={setSelectedRequirement}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentRequirements.map((req) => (
                      <SelectItem key={req.id} value={req.id}>
                        {req.name} {req.required && "*"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drop your file here, or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF files only, max 10MB
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={!selectedRequirement || isUploading}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={!selectedRequirement || isUploading}
                  >
                    Choose File
                  </Button>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information about this document..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isUploading}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Requirements Checklist */}
        <motion.div {...staggerAnimation}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Required Documents
              </CardTitle>
              <CardDescription>
                Track your document submission progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documentRequirements.map((req) => {
                  const uploaded = uploadedDocuments.find(doc => doc.type === req.id);
                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${
                          uploaded 
                            ? uploaded.status === 'approved' ? 'bg-emerald-100' : 'bg-amber-100'
                            : 'bg-gray-100'
                        }`}>
                          {uploaded ? getStatusIcon(uploaded.status) : <FileText className="h-4 w-4 text-gray-500" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{req.name}</p>
                          {req.required && (
                            <p className="text-xs text-red-600">Required</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {uploaded ? (
                          <Badge className={getStatusColor(uploaded.status)}>
                            {uploaded.status.replace('-', ' ')}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Uploaded Documents */}
      <motion.div {...staggerAnimation}>
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              View and manage your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {doc.uploadDate} • {doc.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusIcon(doc.status)}
                          <span className="ml-1">{doc.status.replace('-', ' ')}</span>
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {doc.reviewComments && (
                      <div className="pl-11">
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Review Comments:</p>
                          <p className="text-sm text-muted-foreground">{doc.reviewComments}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DocumentUpload;