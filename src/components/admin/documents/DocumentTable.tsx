import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  FileText,
  Download,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentData {
  id: string;
  name: string;
  studentName: string;
  studentId: string;
  program: string;
  campus: string;
  uploadDate: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  fileType: string;
  priority: 'low' | 'medium' | 'high';
  requirement: string;
}

interface DocumentTableProps {
  documents: DocumentData[];
  selectedDocuments: string[];
  onSelectDocument: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onDocumentClick: (id: string) => void;
  onAction: (documentId: string, action: string) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  selectedDocuments,
  onSelectDocument,
  onSelectAll,
  onDocumentClick,
  onAction
}) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      'approved': { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      'rejected': { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      'under-review': { variant: 'secondary' as const, icon: Eye, color: 'text-blue-600' },
      'pending': { variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'high': 'destructive' as const,
      'medium': 'secondary' as const,
      'low': 'outline' as const
    };
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {priority}
      </Badge>
    );
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No documents found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your filters or search query to find documents
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedDocuments.length === documents.length && documents.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Requirement</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow 
              key={doc.id}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={() => onSelectDocument(doc.id)}
                />
              </TableCell>
              <TableCell onClick={() => onDocumentClick(doc.id)}>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.fileType}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell onClick={() => onDocumentClick(doc.id)}>
                <div>
                  <p className="font-medium">{doc.studentName}</p>
                  <p className="text-xs text-muted-foreground">{doc.studentId}</p>
                </div>
              </TableCell>
              <TableCell onClick={() => onDocumentClick(doc.id)}>
                <div>
                  <p className="text-sm">{doc.program}</p>
                  <p className="text-xs text-muted-foreground">{doc.campus}</p>
                </div>
              </TableCell>
              <TableCell onClick={() => onDocumentClick(doc.id)}>
                <p className="text-sm">{doc.requirement}</p>
              </TableCell>
              <TableCell onClick={() => onDocumentClick(doc.id)}>
                {getStatusBadge(doc.status)}
              </TableCell>
              <TableCell onClick={() => onDocumentClick(doc.id)}>
                {getPriorityBadge(doc.priority)}
              </TableCell>
              <TableCell onClick={() => onDocumentClick(doc.id)}>
                <p className="text-sm">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onDocumentClick(doc.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction(doc.id, 'download')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction(doc.id, 'approve')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction(doc.id, 'reject')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
