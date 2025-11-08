import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle, Clock, Download, User, GraduationCap, Calendar, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DocumentComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isAdvisor: boolean;
}

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
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  ocrText?: string;
  confidence?: number;
  applicationId: string;
  comments: DocumentComment[];
}

interface DocumentTableProps {
  documents: DocumentData[];
  selectedDocuments: string[];
  onSelectDocument: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDocument: (document: DocumentData) => void;
  onApproveDocument: (id: string) => void;
  onRejectDocument: (id: string) => void;
  onDownloadDocument: (id: string) => void;
}

export function DocumentTable({
  documents,
  selectedDocuments,
  onSelectDocument,
  onSelectAll,
  onViewDocument,
  onApproveDocument,
  onRejectDocument,
  onDownloadDocument
}: DocumentTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      case "under-review": return <Eye className="h-4 w-4 text-blue-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      case "under-review": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedDocuments.length === documents.length && documents.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Student & Document</TableHead>
            <TableHead>Program & Campus</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow 
              key={doc.id} 
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => onViewDocument(doc)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={() => onSelectDocument(doc.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {doc.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{doc.studentName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{doc.studentId}</span>
                      <span>•</span>
                      <span>{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {doc.fileType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.fileSize}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{doc.program}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {doc.campus}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(doc.status)} className="gap-1">
                  {getStatusIcon(doc.status)}
                  {doc.status.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityVariant(doc.priority)} className="gap-1">
                  {doc.priority === 'high' && <Star className="h-3 w-3" />}
                  {doc.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {doc.reviewer ? (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {doc.reviewer}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewDocument(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {doc.status !== 'approved' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onApproveDocument(doc.id)}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  {doc.status !== 'rejected' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRejectDocument(doc.id)}
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDownloadDocument(doc.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {documents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No documents found matching your filters
        </div>
      )}
    </div>
  );
}
