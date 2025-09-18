import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  maxSize: number; // in MB
  category: 'academic' | 'personal' | 'professional' | 'additional';
  examples?: string[];
}

interface UploadedDocument {
  id: string;
  requirementId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
  status: 'uploaded' | 'processing' | 'approved' | 'rejected';
  filePath?: string;
  adminComments?: string;
}

interface DocumentsData {
  documents?: UploadedDocument[];
}

interface DocumentsStepProps {
  data: DocumentsData;
  onUpdate: (data: DocumentsData) => void;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState<DocumentsData>({
    documents: [],
    ...data
  });

  const [uploading, setUploading] = useState<string | null>(null);

  // Predefined document requirements
  const documentRequirements: DocumentRequirement[] = [
    {
      id: 'official_transcript',
      name: 'Official Academic Transcript',
      description: 'Official transcript from your most recent educational institution',
      required: true,
      acceptedFormats: ['PDF'],
      maxSize: 10,
      category: 'academic',
      examples: ['University transcript', 'College transcript', 'High school transcript']
    },
    {
      id: 'diploma_certificate',
      name: 'Diploma/Degree Certificate',
      description: 'Copy of your diploma or degree certificate',
      required: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: 5,
      category: 'academic'
    },
    {
      id: 'passport_id',
      name: 'Passport or Government ID',
      description: 'Valid passport or government-issued identification',
      required: true,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: 5,
      category: 'personal'
    },
    {
      id: 'cv_resume',
      name: 'CV/Resume',
      description: 'Current curriculum vitae or resume',
      required: true,
      acceptedFormats: ['PDF', 'DOC', 'DOCX'],
      maxSize: 5,
      category: 'professional'
    },
    {
      id: 'english_proficiency',
      name: 'English Proficiency Test Results',
      description: 'TOEFL, IELTS, or equivalent test scores (if applicable)',
      required: false,
      acceptedFormats: ['PDF'],
      maxSize: 5,
      category: 'academic',
      examples: ['TOEFL score report', 'IELTS results', 'Cambridge certificate']
    },
    {
      id: 'recommendation_letters',
      name: 'Letters of Recommendation',
      description: 'Professional or academic recommendation letters',
      required: false,
      acceptedFormats: ['PDF'],
      maxSize: 5,
      category: 'professional',
      examples: ['Professor recommendation', 'Employer reference', 'Professional mentor letter']
    },
    {
      id: 'portfolio',
      name: 'Portfolio or Work Samples',
      description: 'Portfolio showcasing your work or achievements (if applicable)',
      required: false,
      acceptedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: 20,
      category: 'professional'
    },
    {
      id: 'financial_proof',
      name: 'Proof of Financial Support',
      description: 'Bank statements or financial documentation',
      required: false,
      acceptedFormats: ['PDF'],
      maxSize: 10,
      category: 'additional'
    }
  ];

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const handleFileUpload = async (requirementId: string, file: File) => {
    const requirement = documentRequirements.find(req => req.id === requirementId);
    if (!requirement) return;

    // Validate file size
    if (file.size > requirement.maxSize * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${requirement.maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toUpperCase();
    if (!fileExtension || !requirement.acceptedFormats.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: `Only ${requirement.acceptedFormats.join(', ')} files are allowed`,
        variant: "destructive"
      });
      return;
    }

    setUploading(requirementId);

    try {
      // Mock file upload - in real implementation, this would upload to storage
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDocument: UploadedDocument = {
        id: crypto.randomUUID(),
        requirementId,
        fileName: file.name,
        fileSize: file.size,
        fileType: fileExtension,
        uploadDate: new Date(),
        status: 'uploaded',
        filePath: `uploads/${file.name}`
      };

      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), newDocument]
      }));

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully`
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  const removeDocument = (documentId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.filter(doc => doc.id !== documentId) || []
    }));
    
    toast({
      title: "Document Removed",
      description: "Document has been removed from your application"
    });
  };

  const getDocumentForRequirement = (requirementId: string) => {
    return formData.documents?.find(doc => doc.requirementId === requirementId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'personal':
        return 'bg-green-100 text-green-800';
      case 'professional':
        return 'bg-purple-100 text-purple-800';
      case 'additional':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate progress
  const requiredDocuments = documentRequirements.filter(req => req.required);
  const uploadedRequiredDocuments = requiredDocuments.filter(req => 
    getDocumentForRequirement(req.id)
  );
  const progress = requiredDocuments.length > 0 
    ? Math.round((uploadedRequiredDocuments.length / requiredDocuments.length) * 100)
    : 0;

  // Group requirements by category
  const requirementsByCategory = documentRequirements.reduce((acc, req) => {
    if (!acc[req.category]) {
      acc[req.category] = [];
    }
    acc[req.category].push(req);
    return acc;
  }, {} as Record<string, DocumentRequirement[]>);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'academic':
        return 'Academic Documents';
      case 'personal':
        return 'Personal Documents';
      case 'professional':
        return 'Professional Documents';
      case 'additional':
        return 'Additional Documents';
      default:
        return 'Documents';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold">Document Upload Progress</h4>
            <p className="text-muted-foreground">
              Upload all required documents to complete your application
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{progress}%</div>
            <div className="text-sm text-muted-foreground">
              {uploadedRequiredDocuments.length} / {requiredDocuments.length} required
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Document Requirements by Category */}
      {Object.entries(requirementsByCategory).map(([category, requirements]) => (
        <Card key={category} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h5 className="text-lg font-semibold">{getCategoryLabel(category)}</h5>
            <Badge className={getCategoryColor(category)}>
              {requirements.length} document{requirements.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="space-y-4">
            {requirements.map((requirement) => {
              const uploadedDoc = getDocumentForRequirement(requirement.id);
              const isUploading = uploading === requirement.id;

              return (
                <Card key={requirement.id} className="p-4 border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h6 className="font-medium">{requirement.name}</h6>
                        {requirement.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{requirement.description}</p>
                    </div>
                  </div>

                  {/* File specifications */}
                  <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    <Badge variant="outline">
                      Max {requirement.maxSize}MB
                    </Badge>
                    <Badge variant="outline">
                      {requirement.acceptedFormats.join(', ')}
                    </Badge>
                  </div>

                  {/* Examples */}
                  {requirement.examples && requirement.examples.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Examples:</p>
                      <div className="flex flex-wrap gap-1">
                        {requirement.examples.map((example, index) => (
                          <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload area or uploaded file */}
                  {uploadedDoc ? (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(uploadedDoc.status)}
                        <div>
                          <p className="font-medium text-sm">{uploadedDoc.fileName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{(uploadedDoc.fileSize / 1024 / 1024).toFixed(2)}MB</span>
                            <span>•</span>
                            <span>{uploadedDoc.uploadDate.toLocaleDateString()}</span>
                            <Badge className={`${getStatusColor(uploadedDoc.status)} text-xs`}>
                              {uploadedDoc.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(uploadedDoc.id)}
                          className="text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your file here, or click to browse
                          </p>
                          <input
                            type="file"
                            accept={requirement.acceptedFormats.map(format => `.${format.toLowerCase()}`).join(',')}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(requirement.id, file);
                              }
                            }}
                            className="hidden"
                            id={`upload-${requirement.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`upload-${requirement.id}`)?.click()}
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin comments for rejected documents */}
                  {uploadedDoc?.status === 'rejected' && uploadedDoc.adminComments && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-1">Admin Feedback:</p>
                      <p className="text-sm text-red-700">{uploadedDoc.adminComments}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </Card>
      ))}

      {/* Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="text-lg font-semibold mb-3 text-blue-900">Document Upload Guidelines</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>File Quality:</strong> Ensure documents are clear, legible, and high-resolution</p>
          <p>• <strong>Official Documents:</strong> Submit official or certified copies when required</p>
          <p>• <strong>Language:</strong> Documents in languages other than English may require certified translations</p>
          <p>• <strong>File Names:</strong> Use descriptive file names for easy identification</p>
          <p>• <strong>Security:</strong> All uploaded documents are encrypted and securely stored</p>
        </div>
      </Card>
    </div>
  );
};

export default DocumentsStep;