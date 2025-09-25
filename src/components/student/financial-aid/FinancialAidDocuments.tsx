import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, Download, Eye } from 'lucide-react';
import { usePageEntranceAnimation } from '@/hooks/useAnimations';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'required' | 'submitted' | 'approved' | 'rejected';
  dueDate: string;
  description: string;
  uploadDate?: string;
  fileSize?: string;
  relatedApplication?: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'FAFSA Form',
    type: 'Federal Form',
    status: 'approved',
    dueDate: '2024-06-30',
    description: 'Free Application for Federal Student Aid',
    uploadDate: '2024-01-15',
    fileSize: '2.3 MB',
    relatedApplication: 'Federal Pell Grant'
  },
  {
    id: '2',
    name: 'Tax Return (2023)',
    type: 'Tax Document',
    status: 'submitted',
    dueDate: '2024-03-15',
    description: 'Previous year tax return for income verification',
    uploadDate: '2024-02-20',
    fileSize: '1.8 MB',
    relatedApplication: 'Academic Excellence Scholarship'
  },
  {
    id: '3',
    name: 'Bank Statements',
    type: 'Financial Document',
    status: 'required',
    dueDate: '2024-03-30',
    description: 'Last 3 months of bank statements',
    relatedApplication: 'Student Emergency Fund'
  },
  {
    id: '4',
    name: 'Scholarship Essay',
    type: 'Essay',
    status: 'submitted',
    dueDate: '2024-03-15',
    description: 'Personal statement for scholarship application',
    uploadDate: '2024-02-28',
    fileSize: '156 KB',
    relatedApplication: 'Academic Excellence Scholarship'
  },
  {
    id: '5',
    name: 'Letter of Recommendation',
    type: 'Reference',
    status: 'required',
    dueDate: '2024-03-15',
    description: 'Academic or professional reference letter',
    relatedApplication: 'Academic Excellence Scholarship'
  }
];

const statusConfig = {
  required: {
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle,
    text: 'Required'
  },
  submitted: {
    color: 'bg-blue-100 text-blue-700',
    icon: Clock,
    text: 'Under Review'
  },
  approved: {
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
    text: 'Approved'
  },
  rejected: {
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle,
    text: 'Rejected'
  }
};

export function FinancialAidDocuments() {
  const controls = usePageEntranceAnimation();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesFilter = filter === 'all' || doc.status === filter;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completionRate = (mockDocuments.filter(doc => doc.status === 'approved').length / mockDocuments.length) * 100;
  const pendingCount = mockDocuments.filter(doc => doc.status === 'required').length;
  const submittedCount = mockDocuments.filter(doc => doc.status === 'submitted').length;

  const handleFileUpload = (documentId: string) => {
    console.log('Uploading file for document:', documentId);
  };

  const handleViewDocument = (documentId: string) => {
    console.log('Viewing document:', documentId);
  };

  const handleDownloadDocument = (documentId: string) => {
    console.log('Downloading document:', documentId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Aid Documents</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your financial aid documentation
          </p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Upload</p>
                <p className="text-2xl font-bold text-red-600">{pendingCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">{submittedCount}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{mockDocuments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'required', label: 'Required' },
                { key: 'submitted', label: 'Submitted' },
                { key: 'approved', label: 'Approved' }
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterOption.key)}
                >
                  {filterOption.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => {
          const StatusIcon = statusConfig[document.status].icon;
          
          return (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{document.name}</CardTitle>
                      <Badge variant="outline">{document.type}</Badge>
                    </div>
                    <p className="text-muted-foreground">{document.description}</p>
                    {document.relatedApplication && (
                      <p className="text-sm text-blue-600">
                        Related to: {document.relatedApplication}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={statusConfig[document.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[document.status].text}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(document.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {document.uploadDate ? (
                      <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                    ) : (
                      <span>Not uploaded</span>
                    )}
                    {document.fileSize && (
                      <span className="ml-4">Size: {document.fileSize}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {document.status === 'required' && (
                      <Button onClick={() => handleFileUpload(document.id)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    )}
                    {document.status !== 'required' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDocument(document.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadDocument(document.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}