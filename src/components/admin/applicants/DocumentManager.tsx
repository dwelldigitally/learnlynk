import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Applicant } from "@/types/applicant";
import { 
  FileText, 
  Download, 
  Eye, 
  Check, 
  X, 
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentManagerProps {
  applicant: Applicant;
  onDocumentAction: (action: string, document: string) => void;
  onApproveAll: () => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  applicant,
  onDocumentAction,
  onApproveAll
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const documentCategories = [
    { id: 'transcripts', name: 'Academic Transcripts', required: true },
    { id: 'essays', name: 'Personal Essays', required: true },
    { id: 'recommendations', name: 'Letters of Recommendation', required: true },
    { id: 'certificates', name: 'Certificates', required: false },
    { id: 'portfolio', name: 'Portfolio', required: false },
    { id: 'identity', name: 'Identity Documents', required: true },
  ];

  // Mock document data - in real app, this would come from props/API
  const documents = [
    {
      id: '1',
      name: 'Academic_Transcript_2023.pdf',
      category: 'transcripts',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'approved',
      reviewer: 'Dr. Smith',
      reviewDate: '2024-01-16',
      type: 'pdf'
    },
    {
      id: '2',
      name: 'Personal_Statement.pdf',
      category: 'essays',
      size: '1.2 MB',
      uploadDate: '2024-01-14',
      status: 'under-review',
      reviewer: 'Prof. Johnson',
      reviewDate: null,
      type: 'pdf'
    },
    {
      id: '3',
      name: 'Recommendation_Letter_1.pdf',
      category: 'recommendations',
      size: '856 KB',
      uploadDate: '2024-01-13',
      status: 'pending',
      reviewer: null,
      reviewDate: null,
      type: 'pdf'
    },
    {
      id: '4',
      name: 'Certificate_English.jpg',
      category: 'certificates',
      size: '1.8 MB',
      uploadDate: '2024-01-12',
      status: 'rejected',
      reviewer: 'Dr. Wilson',
      reviewDate: '2024-01-13',
      rejectionReason: 'Image quality too low',
      type: 'image'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'approved': { variant: 'default' as const, text: 'Approved' },
      'under-review': { variant: 'secondary' as const, text: 'Under Review' },
      'pending': { variant: 'outline' as const, text: 'Pending' },
      'rejected': { variant: 'destructive' as const, text: 'Rejected' }
    };
    
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="h-4 w-4 text-success" />;
      case 'rejected': return <X className="h-4 w-4 text-destructive" />;
      case 'under-review': return <Eye className="h-4 w-4 text-warning" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getDocumentStats = () => {
    const total = documents.length;
    const approved = documents.filter(d => d.status === 'approved').length;
    const pending = documents.filter(d => d.status === 'pending').length;
    const underReview = documents.filter(d => d.status === 'under-review').length;
    const rejected = documents.filter(d => d.status === 'rejected').length;
    
    return { total, approved, pending, underReview, rejected };
  };

  const stats = getDocumentStats();

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.underReview}</div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Document Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={onApproveAll}>
                <Check className="h-4 w-4 mr-1" />
                Approve All
              </Button>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Request Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Document List */}
          <div className="space-y-3">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        {getStatusIcon(document.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{document.name}</h4>
                          {getStatusBadge(document.status)}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{document.size}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Uploaded {new Date(document.uploadDate).toLocaleDateString()}
                          </span>
                          {document.reviewer && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {document.reviewer}
                            </span>
                          )}
                        </div>
                        
                        {document.status === 'rejected' && document.rejectionReason && (
                          <div className="mt-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
                            Rejection reason: {document.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {document.status !== 'approved' && (
                            <DropdownMenuItem onClick={() => onDocumentAction('approve', document.name)}>
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {document.status !== 'rejected' && (
                            <DropdownMenuItem onClick={() => onDocumentAction('reject', document.name)}>
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onDocumentAction('request-resubmit', document.name)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Request Resubmit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No documents found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};