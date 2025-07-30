import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  MessageSquare,
  Filter,
  Download,
  Settings,
  User,
  Calendar,
  Building,
  GraduationCap,
  AlertTriangle,
  Info,
  Star,
  FileCheck,
  Users,
  BarChart
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [activeTab, setActiveTab] = useState('all');

  // Mock data with comprehensive fields
  const documents: DocumentData[] = [
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
  ];

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
                <Button className="w-full" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Document
                </Button>
                <Button variant="destructive" className="w-full" size="sm">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Document
                </Button>
                <Button variant="outline" className="w-full" size="sm">
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

  return (
    <div className="space-y-6">
      {/* Header with Bulk Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
          <p className="text-muted-foreground">Comprehensive document review and approval system</p>
        </div>
        <div className="flex space-x-2">
          {selectedDocuments.length > 0 && (
            <Sheet open={showBulkActions} onOpenChange={setShowBulkActions}>
              <SheetTrigger asChild>
                <Button variant="default">
                  Bulk Actions ({selectedDocuments.length})
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Bulk Actions</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selected {selectedDocuments.length} documents
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => handleBulkAction('approve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Bulk Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleBulkAction('reject')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Bulk Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Bulk Download
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Communication Note</label>
                    <Textarea
                      placeholder="Add a note that will be sent to all selected students..."
                      value={bulkComment}
                      onChange={(e) => setBulkComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Button variant="outline">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[
          { title: "Total Documents", count: stats.total, icon: FileText, color: "text-blue-600", bgColor: "bg-blue-100" },
          { title: "Pending Review", count: stats.pending, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100" },
          { title: "Under Review", count: stats.underReview, icon: Eye, color: "text-blue-600", bgColor: "bg-blue-100" },
          { title: "Approved", count: stats.approved, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
          { title: "Rejected", count: stats.rejected, icon: XCircle, color: "text-red-600", bgColor: "bg-red-100" },
          { title: "High Priority", count: stats.highPriority, icon: AlertTriangle, color: "text-orange-600", bgColor: "bg-orange-100" }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold text-foreground">{stat.count}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search documents..." 
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <Select value={filters.program} onValueChange={(value) => setFilters(prev => ({ ...prev, program: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="Health Care Assistant">Health Care Assistant</SelectItem>
                <SelectItem value="Business Administration">Business Administration</SelectItem>
                <SelectItem value="Aviation Maintenance">Aviation Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.campus} onValueChange={(value) => setFilters(prev => ({ ...prev, campus: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campuses</SelectItem>
                <SelectItem value="Main Campus">Main Campus</SelectItem>
                <SelectItem value="Downtown Campus">Downtown Campus</SelectItem>
                <SelectItem value="Technical Campus">Technical Campus</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.intake} onValueChange={(value) => setFilters(prev => ({ ...prev, intake: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Intake" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intakes</SelectItem>
                <SelectItem value="April 2024">April 2024</SelectItem>
                <SelectItem value="September 2024">September 2024</SelectItem>
                <SelectItem value="June 2024">June 2024</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.studentType} onValueChange={(value) => setFilters(prev => ({ ...prev, studentType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Student Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="domestic">Domestic</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.reviewer} onValueChange={(value) => setFilters(prev => ({ ...prev, reviewer: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Reviewer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviewers</SelectItem>
                <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Documents ({filteredDocuments.length})</span>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Intake</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDocuments([...selectedDocuments, doc.id]);
                        } else {
                          setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.fileType} • {doc.fileSize}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{doc.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{doc.studentName}</span>
                        <p className="text-xs text-muted-foreground">{doc.studentId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{doc.program}</p>
                      <p className="text-xs text-muted-foreground">{doc.campus}</p>
                    </div>
                  </TableCell>
                  <TableCell>{doc.intake}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.studentType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(doc.priority)}>
                      {doc.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.status)}
                      <Badge variant={getStatusColor(doc.status)}>
                        {doc.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{doc.reviewer || 'Unassigned'}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {selectedDocument && <DocumentPreview document={selectedDocument} />}
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDocumentManagement;