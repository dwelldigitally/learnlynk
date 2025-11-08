import React, { useState, useMemo } from "react";
import { DocumentHeader } from "./documents/DocumentHeader";
import { DocumentFilters } from "./documents/DocumentFilters";
import { DocumentTable } from "./documents/DocumentTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText,
  MessageSquare,
  Star,
  User,
  GraduationCap,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Clock,
} from "lucide-react";

interface DocumentData {
  id: string;
  name: string;
  studentName: string;
  studentId: string;
  program: string;
  campus: string;
  intake: string;
  uploadDate: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  fileType: string;
  fileSize: string;
  requirement: string;
  studentType: 'domestic' | 'international';
  reviewer?: string;
  ocrText?: string;
  confidence?: number;
  applicationId: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  comments: DocumentComment[];
}

interface DocumentComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isAdvisor: boolean;
}

interface DocumentStandard {
  id: string;
  requirementType: string;
  studentType: 'domestic' | 'international';
  program: string;
  acceptedFormats: string[];
  minScore?: number;
  maxAge?: number;
  description: string;
  examples: string[];
}

interface FilterState {
  search: string;
  program: string;
  campus: string;
  intake: string;
  status: string;
  studentType: string;
  documentType: string;
  priority: string;
  reviewer: string;
  dateRange: string;
}

const EnhancedDocumentManagement: React.FC = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    program: 'all',
    campus: 'all',
    intake: 'all',
    status: 'all',
    studentType: 'all',
    documentType: 'all',
    priority: 'all',
    reviewer: 'all',
    dateRange: 'all'
  });
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkComment, setBulkComment] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [documents, setDocuments] = useState<DocumentData[]>([
    {
      id: "1",
      name: "High School Transcript",
      studentName: "Sarah Johnson",
      studentId: "STU-2024-001",
      program: "Health Care Assistant",
      campus: "Main Campus",
      intake: "April 2024",
      uploadDate: "2024-01-15",
      status: "pending",
      fileType: "PDF",
      fileSize: "2.3 MB",
      requirement: "Academic Records",
      studentType: "domestic",
      ocrText: "OFFICIAL TRANSCRIPT\nHigh School Diploma\nGPA: 3.8/4.0\nGraduation Date: June 2023",
      confidence: 95,
      applicationId: "APP-2024-001",
      priority: "medium",
      tags: ["urgent", "complete"],
      comments: []
    },
    {
      id: "2",
      name: "IELTS Test Results",
      studentName: "Li Wei",
      studentId: "STU-2024-002",
      program: "Business Administration",
      campus: "Downtown Campus",
      intake: "September 2024",
      uploadDate: "2024-01-14",
      status: "under-review",
      fileType: "PDF",
      fileSize: "1.8 MB",
      requirement: "Language Proficiency",
      studentType: "international",
      reviewer: "Dr. Smith",
      ocrText: "IELTS Academic Test Report\nOverall Band Score: 7.5\nListening: 8.0, Reading: 7.5, Writing: 7.0, Speaking: 7.5",
      confidence: 98,
      applicationId: "APP-2024-002",
      priority: "high",
      tags: ["international", "verified"],
      comments: [
        {
          id: "c1",
          author: "Dr. Smith",
          text: "Score meets requirements. Verifying authenticity with test center.",
          timestamp: "2024-01-15T10:30:00Z",
          isAdvisor: true
        }
      ]
    },
    {
      id: "3",
      name: "Government ID",
      studentName: "Emma Davis",
      studentId: "STU-2024-003",
      program: "Aviation Maintenance",
      campus: "Technical Campus",
      intake: "June 2024",
      uploadDate: "2024-01-13",
      status: "approved",
      fileType: "PDF",
      fileSize: "3.1 MB",
      requirement: "Identity Verification",
      studentType: "domestic",
      reviewer: "Jane Doe",
      confidence: 92,
      applicationId: "APP-2024-003",
      priority: "low",
      tags: ["verified", "complete"],
      comments: []
    }
  ]);

  // Mock standards data
  const documentStandards: DocumentStandard[] = [
    {
      id: "std-1",
      requirementType: "Language Proficiency",
      studentType: "international",
      program: "Business Administration",
      acceptedFormats: ["IELTS", "TOEFL", "PTE"],
      minScore: 6.5,
      description: "Minimum IELTS overall band score of 6.5 with no individual band below 6.0",
      examples: ["IELTS Academic Test Report", "TOEFL iBT Score Report"]
    },
    {
      id: "std-2",
      requirementType: "Academic Records",
      studentType: "domestic",
      program: "Health Care Assistant",
      acceptedFormats: ["Official Transcript", "Diploma"],
      description: "High school diploma or equivalent with minimum 70% average in core subjects",
      examples: ["Official High School Transcript", "GED Certificate"]
    }
  ];

  // Filtering logic
  const filteredDocuments = useMemo(() => {
    const baseFiltered = documents.filter(doc => {
      const matchesSearch = !filters.search || 
        doc.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        doc.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
        doc.studentId.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesProgram = filters.program === 'all' || doc.program === filters.program;
      const matchesCampus = filters.campus === 'all' || doc.campus === filters.campus;
      const matchesIntake = filters.intake === 'all' || doc.intake === filters.intake;
      const matchesStatus = filters.status === 'all' || doc.status === filters.status;
      const matchesStudentType = filters.studentType === 'all' || doc.studentType === filters.studentType;
      const matchesPriority = filters.priority === 'all' || doc.priority === filters.priority;
      const matchesReviewer = filters.reviewer === 'all' || doc.reviewer === filters.reviewer;

      return matchesSearch && matchesProgram && matchesCampus && matchesIntake && 
             matchesStatus && matchesStudentType && matchesPriority && matchesReviewer;
    });

    // Further filter by active tab if not 'all'
    if (activeTab === 'all') {
      return baseFiltered;
    } else {
      return baseFiltered.filter(doc => doc.status === activeTab);
    }
  }, [documents, filters, activeTab]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = documents.length;
    const pending = documents.filter(d => d.status === 'pending').length;
    const underReview = documents.filter(d => d.status === 'under-review').length;
    const approved = documents.filter(d => d.status === 'approved').length;
    const rejected = documents.filter(d => d.status === 'rejected').length;
    const highPriority = documents.filter(d => d.priority === 'high').length;

    return { total, pending, underReview, approved, rejected, highPriority };
  }, [documents]);

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
      case "under-review": return <Eye className="h-4 w-4 text-blue-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const handleBulkAction = (action: 'approve' | 'reject' | 'assign') => {
    console.log(`Bulk ${action} for documents:`, selectedDocuments);
    console.log('Bulk comment:', bulkComment);
    // Implementation for bulk actions
    setSelectedDocuments([]);
    setBulkComment('');
    setShowBulkActions(false);
  };

  const handleDocumentAction = (documentId: string, action: 'approve' | 'reject') => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: action === 'approve' ? 'approved' : 'rejected', reviewer: 'Current User' }
          : doc
      )
    );
    console.log(`${action} document:`, documentId);
  };

  const handleDownloadDocument = (documentId: string) => {
    console.log('Download document:', documentId);
    // Implementation for document download
  };

  const handleStudentClick = (studentId: string) => {
    console.log('Navigate to student detail:', studentId);
    // Implementation would navigate to student detail page
    // For now, could open a modal or navigate to /admin/students/STU-2024-001
  };

  const handleViewAllStudentDocuments = (studentId: string, studentName: string) => {
    // Filter documents to show only those from this student
    setFilters(prev => ({
      ...prev,
      search: studentName
    }));
    console.log('View all documents for student:', studentId, studentName);
  };

  const handleDocumentClick = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      setSelectedDocument(document);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const DocumentPreview = ({ document }: { document: DocumentData }) => {
    const [activePreviewTab, setActivePreviewTab] = useState('document');
    const [newComment, setNewComment] = useState('');
    
    const relevantStandards = documentStandards.filter(
      std => std.requirementType === document.requirement &&
             std.studentType === document.studentType &&
             std.program === document.program
    );

    return (
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.name} - {document.studentName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Preview */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="ocr">OCR Text</TabsTrigger>
                <TabsTrigger value="standards">Standards</TabsTrigger>
              </TabsList>

              <TabsContent value="document" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Document Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted h-96 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Document preview would appear here</p>
                        <p className="text-sm text-muted-foreground mt-2">{document.fileType} • {document.fileSize}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ocr" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      OCR Extracted Text 
                      <Badge variant="secondary">
                        {document.confidence}% confidence
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {document.ocrText || "No OCR text available"}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="standards" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Document Standards & Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relevantStandards.map(standard => (
                      <div key={standard.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{standard.requirementType}</h4>
                            <p className="text-sm text-muted-foreground">{standard.description}</p>
                          </div>
                        </div>
                        
                        {standard.minScore && (
                          <div className="mt-2">
                            <Badge variant="outline">
                              Minimum Score: {standard.minScore}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Accepted Formats:</p>
                          <div className="flex gap-1">
                            {standard.acceptedFormats.map(format => (
                              <Badge key={format} variant="secondary" className="text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Document Details & Actions */}
          <div className="space-y-4">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{document.studentName}</p>
                    <p className="text-xs text-muted-foreground">{document.studentId}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{document.program}</p>
                    <p className="text-xs text-muted-foreground">{document.campus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{document.intake}</p>
                    <p className="text-xs text-muted-foreground">Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(document.priority)}>
                    {document.priority} priority
                  </Badge>
                  <Badge variant={getStatusColor(document.status)}>
                    {document.status.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="flex gap-1 flex-wrap">
                  {document.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleDocumentAction(document.id, 'approve')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Document
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleDocumentAction(document.id, 'reject')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Document
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleDownloadDocument(document.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {document.comments.map(comment => (
                    <div key={comment.id} className="text-sm border rounded p-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{comment.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                  />
                  <Button size="sm" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    );
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      program: 'all',
      campus: 'all',
      intake: 'all',
      status: 'all',
      studentType: 'all',
      documentType: 'all',
      priority: 'all',
      reviewer: 'all',
      dateRange: 'all'
    });
  };

  const handleExport = () => {
    console.log('Export documents');
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-6">
          <DocumentHeader
            searchQuery={filters.search}
            onSearchChange={(query) => setFilters(prev => ({ ...prev, search: query }))}
            selectedCount={selectedDocuments.length}
            onBulkApprove={() => handleBulkAction('approve')}
            onBulkReject={() => handleBulkAction('reject')}
            onExport={handleExport}
            stats={stats}
          >
            <DocumentFilters
              filters={{
                program: filters.program,
                campus: filters.campus,
                intake: filters.intake,
                status: filters.status,
                studentType: filters.studentType,
                priority: filters.priority,
                reviewer: filters.reviewer
              }}
              onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
              onClearFilters={handleClearFilters}
            />
          </DocumentHeader>
        </div>
      </div>

      <div className="flex-1 p-6">
        <DocumentTable
          documents={filteredDocuments}
          selectedDocuments={selectedDocuments}
          onSelectDocument={(id) => {
            setSelectedDocuments(prev =>
              prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
            );
          }}
          onSelectAll={handleSelectAll}
          onViewDocument={(doc) => setSelectedDocument(doc)}
          onApproveDocument={(id) => handleDocumentAction(id, 'approve')}
          onRejectDocument={(id) => handleDocumentAction(id, 'reject')}
          onDownloadDocument={handleDownloadDocument}
        />
      </div>

      {/* Document Preview Dialog */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DocumentPreview document={selectedDocument} />
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedDocumentManagement;