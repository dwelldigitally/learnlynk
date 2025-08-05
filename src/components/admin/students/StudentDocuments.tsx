import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface StudentDocumentsProps {
  student: any;
  onUpdate: () => void;
}

export function StudentDocuments({ student, onUpdate }: StudentDocumentsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    {
      id: 1,
      name: 'Official_Transcript_2024.pdf',
      type: 'Academic Transcript',
      category: 'academic',
      size: '2.3 MB',
      uploadDate: '2024-01-22',
      status: 'approved',
      uploadedBy: 'Emma Johnson',
      reviewer: 'Dr. Sarah Wilson',
      reviewDate: '2024-01-23',
      version: 1
    },
    {
      id: 2,
      name: 'Personal_Statement.pdf',
      type: 'Personal Statement',
      category: 'application',
      size: '1.1 MB',
      uploadDate: '2024-01-23',
      status: 'approved',
      uploadedBy: 'Emma Johnson',
      reviewer: 'Dr. Sarah Wilson',
      reviewDate: '2024-01-24',
      version: 2
    },
    {
      id: 3,
      name: 'Recommendation_Letter_1.pdf',
      type: 'Letter of Recommendation',
      category: 'application',
      size: '0.8 MB',
      uploadDate: '2024-01-24',
      status: 'pending',
      uploadedBy: 'Prof. John Smith',
      reviewer: null,
      reviewDate: null,
      version: 1
    },
    {
      id: 4,
      name: 'TOEFL_Score_Report.pdf',
      type: 'English Proficiency Test',
      category: 'test_scores',
      size: '0.5 MB',
      uploadDate: '2024-01-21',
      status: 'approved',
      uploadedBy: 'ETS Testing Service',
      reviewer: 'Dr. Sarah Wilson',
      reviewDate: '2024-01-22',
      version: 1
    },
    {
      id: 5,
      name: 'Financial_Statement.pdf',
      type: 'Financial Documentation',
      category: 'financial',
      size: '1.5 MB',
      uploadDate: '2024-01-25',
      status: 'rejected',
      uploadedBy: 'Emma Johnson',
      reviewer: 'Finance Office',
      reviewDate: '2024-01-26',
      version: 1,
      rejectionReason: 'Document unclear, please resubmit with higher quality scan'
    }
  ];

  const documentCategories = [
    { key: 'all', label: 'All Documents', count: documents.length },
    { key: 'academic', label: 'Academic', count: documents.filter(d => d.category === 'academic').length },
    { key: 'application', label: 'Application', count: documents.filter(d => d.category === 'application').length },
    { key: 'test_scores', label: 'Test Scores', count: documents.filter(d => d.category === 'test_scores').length },
    { key: 'financial', label: 'Financial', count: documents.filter(d => d.category === 'financial').length }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header with Search and Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Documents</h2>
          <p className="text-muted-foreground">Manage student documents and requirements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {documentCategories.map((category) => (
            <TabsTrigger key={category.key} value={category.key} className="flex items-center gap-2">
              {category.label}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {documentCategories.map((category) => (
          <TabsContent key={category.key} value={category.key} className="space-y-4">
            <div className="grid gap-4">
              {filteredDocuments
                .filter(doc => category.key === 'all' || doc.category === category.key)
                .map((document) => (
                  <Card key={document.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {getStatusIcon(document.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{document.name}</h4>
                              {document.version > 1 && (
                                <Badge variant="outline" className="text-xs">v{document.version}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{document.type}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Size: {document.size}</span>
                              <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                              <span>By: {document.uploadedBy}</span>
                              {document.reviewer && (
                                <span>Reviewed by: {document.reviewer}</span>
                              )}
                            </div>
                            {document.status === 'rejected' && document.rejectionReason && (
                              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-800 dark:text-red-200">
                                <AlertTriangle className="h-3 w-3 inline mr-1" />
                                {document.rejectionReason}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusBadge(document.status)}
                          
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-3 w-3 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-3 w-3 mr-2" />
                                  Edit Info
                                </DropdownMenuItem>
                                {document.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem>
                                      <CheckCircle2 className="h-3 w-3 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <AlertTriangle className="h-3 w-3 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'approved').length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {documents.filter(d => d.status === 'rejected').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}