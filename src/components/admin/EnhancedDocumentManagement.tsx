import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentHeader } from "./documents/DocumentHeader";
import { DocumentStats } from "./documents/DocumentStats";
import { DocumentTable } from "./documents/DocumentTable";
import { DocumentFilters } from "./documents/DocumentFilters";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
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
  const [documents] = useState<DocumentData[]>([
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

  // Filtering logic
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
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
  }, [documents, filters]);

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

  const handleBulkAction = (action: string) => {
    toast({
      title: `Bulk ${action} completed`,
      description: `${selectedDocuments.length} documents processed successfully.`,
    });
    setSelectedDocuments([]);
  };

  const handleDocumentAction = (documentId: string, action: string) => {
    toast({
      title: `Document ${action}d`,
      description: `The document has been ${action}d successfully.`,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (id: string) => {
    setSelectedDocuments(prev =>
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    );
  };

  const handleDocumentClick = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      setSelectedDocument(document);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
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

  const handleStatusClick = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
  };


  return (
    <div className="h-full flex flex-col">
      <DocumentHeader
        searchQuery={filters.search}
        onSearchChange={(value) => handleFilterChange('search', value)}
        selectedCount={selectedDocuments.length}
        onBulkAction={handleBulkAction}
        onShowFilters={() => setShowFilters(true)}
      />

      <DocumentStats
        stats={stats}
        activeStatus={filters.status}
        onStatusClick={handleStatusClick}
      />

      <div className="flex-1 p-6">
        <Card>
          <CardContent className="p-6">
            <DocumentTable
              documents={filteredDocuments}
              selectedDocuments={selectedDocuments}
              onSelectDocument={handleSelectDocument}
              onSelectAll={handleSelectAll}
              onDocumentClick={handleDocumentClick}
              onAction={handleDocumentAction}
            />
          </CardContent>
        </Card>
      </div>

      <DocumentFilters
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedDocument.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Student:</span> {selectedDocument.studentName}
                </div>
                <div>
                  <span className="font-medium">Student ID:</span> {selectedDocument.studentId}
                </div>
                <div>
                  <span className="font-medium">Program:</span> {selectedDocument.program}
                </div>
                <div>
                  <span className="font-medium">Campus:</span> {selectedDocument.campus}
                </div>
                <div>
                  <span className="font-medium">Requirement:</span> {selectedDocument.requirement}
                </div>
                <div>
                  <span className="font-medium">Upload Date:</span>{' '}
                  {new Date(selectedDocument.uploadDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedDocumentManagement;