import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Check, Save, Scan, FileText, Download, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApplicationDocument } from "@/types/application";

interface OCRField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  required?: boolean;
}

interface OCRResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ApplicationDocument;
  onSave: (extractedData: Record<string, string>) => void;
}

const getFieldsForDocumentType = (documentName: string): OCRField[] => {
  const docType = documentName.toLowerCase();
  
  if (docType.includes("transcript") || docType.includes("grades")) {
    return [
      { id: "schoolName", label: "School Name", value: "Vancouver Community College", confidence: 0.95, required: true },
      { id: "grade", label: "Grade/GPA", value: "3.8", confidence: 0.87, required: true },
      { id: "graduationYear", label: "Graduation Year", value: "2023", confidence: 0.92 },
      { id: "studentName", label: "Student Name", value: "John Smith", confidence: 0.98 }
    ];
  }
  
  if (docType.includes("crc") || docType.includes("criminal") || docType.includes("record check")) {
    return [
      { id: "expiryDate", label: "Expiry Date", value: "2025-12-15", confidence: 0.89, required: true },
      { id: "issueDate", label: "Issue Date", value: "2024-01-15", confidence: 0.94 },
      { id: "applicantName", label: "Applicant Name", value: "John Smith", confidence: 0.97 },
      { id: "checkType", label: "Check Type", value: "Enhanced Criminal Record Check", confidence: 0.91 }
    ];
  }
  
  if (docType.includes("immunization") || docType.includes("vaccination")) {
    return [
      { id: "dateTaken", label: "Date Taken", value: "2024-03-20", confidence: 0.88, required: true },
      { id: "immunizationType", label: "Type of Immunization", value: "COVID-19 Vaccine", confidence: 0.93, required: true },
      { id: "administeredBy", label: "Administered By", value: "Vancouver General Hospital", confidence: 0.85 },
      { id: "lotNumber", label: "Lot Number", value: "ABC123", confidence: 0.76 }
    ];
  }
  
  if (docType.includes("photo") || docType.includes("id") || docType.includes("driver") || docType.includes("passport")) {
    return [
      { id: "dateOfBirth", label: "Date of Birth", value: "1995-06-15", confidence: 0.94, required: true },
      { id: "address", label: "Address", value: "123 Main St, Vancouver, BC V6B 1A1", confidence: 0.82, required: true },
      { id: "fullName", label: "Full Name", value: "John William Smith", confidence: 0.96 },
      { id: "idNumber", label: "ID Number", value: "12345678", confidence: 0.91 }
    ];
  }
  
  // Default fields for other document types
  return [
    { id: "fullName", label: "Full Name", value: "John Smith", confidence: 0.95 },
    { id: "date", label: "Date", value: "2024-01-15", confidence: 0.89 },
    { id: "documentNumber", label: "Document Number", value: "DOC-123456", confidence: 0.87 }
  ];
};

export const OCRResultsModal: React.FC<OCRResultsModalProps> = ({
  isOpen,
  onClose,
  document,
  onSave
}) => {
  const { toast } = useToast();
  const [ocrFields, setOcrFields] = useState<OCRField[]>(() => 
    getFieldsForDocumentType(document.name)
  );
  const [newComment, setNewComment] = useState("");

  const handleFieldChange = (fieldId: string, value: string) => {
    setOcrFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, value, confidence: 1.0 } : field
      )
    );
  };

  const handleSave = () => {
    const extractedData = ocrFields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as Record<string, string>);

    onSave(extractedData);
    toast({
      title: "OCR Data Saved",
      description: "Extracted text fields have been saved successfully"
    });
    onClose();
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${document.name}`
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the document"
    });
    setNewComment("");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800 border-green-300";
    if (confidence >= 0.8) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return <Check className="w-3 h-3" />;
    return <AlertTriangle className="w-3 h-3" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Preview - {document.name}
            </div>
            <Button size="sm" variant="outline" onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Document Preview</TabsTrigger>
            <TabsTrigger value="ocr">OCR Results</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Document Preview</p>
                <p className="text-sm">{document.name}</p>
                <p className="text-xs mt-2">Size: {(document.size / 1024).toFixed(2)} KB</p>
                <p className="text-xs">Uploaded: {document.uploadDate.toLocaleDateString()}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ocr" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Extracted Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ocrFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={field.id} className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Badge 
                        className={`text-xs px-2 py-1 flex items-center gap-1 ${getConfidenceColor(field.confidence)}`}
                      >
                        {getConfidenceIcon(field.confidence)}
                        {Math.round(field.confidence * 100)}%
                      </Badge>
                    </div>
                    <Input
                      id={field.id}
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className={field.confidence < 0.8 ? "border-yellow-400 bg-yellow-50" : ""}
                      placeholder={field.label}
                    />
                    {field.confidence < 0.8 && (
                      <p className="text-xs text-yellow-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Low confidence - please verify this field
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-1">OCR Tips</h4>
                <p className="text-xs text-blue-600">
                  Fields with low confidence scores (below 80%) are highlighted. 
                  Please review and correct them if necessary before saving.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Document Comments
              </h3>
              
              {/* Existing Comments */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {document.comments.map((comment) => (
                  <Card key={comment.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={comment.isAdvisor ? "default" : "secondary"}>
                          {comment.isAdvisor ? "Advisor" : "Student"}
                        </Badge>
                        <span className="text-sm font-medium">{comment.author}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp.toLocaleDateString()} {comment.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </Card>
                ))}
                {document.comments.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No comments yet</p>
                  </div>
                )}
              </div>

              {/* Add New Comment */}
              <div className="space-y-2">
                <Label htmlFor="new-comment">Add a comment</Label>
                <Textarea
                  id="new-comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type your comment here..."
                  className="min-h-20"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()} className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Add Comment
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save OCR Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};