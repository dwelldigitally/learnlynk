import React, { useState } from "react";
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
  MessageSquare
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useConditionalDocuments } from "@/hooks/useConditionalDocuments";
import { ConditionalDataWrapper } from "./ConditionalDataWrapper";

const DocumentManagement: React.FC = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const { data: documents, isLoading, showEmptyState, hasDemoAccess, hasRealData } = useConditionalDocuments();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
          <p className="text-muted-foreground">Review and approve student documents</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Bulk Approve</Button>
          <Button variant="outline">Bulk Reject</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Pending Review", count: documents.filter(d => d.status === 'pending').length, color: "text-yellow-600", bgColor: "bg-yellow-100" },
          { title: "Under Review", count: documents.filter(d => d.status === 'under_review').length, color: "text-blue-600", bgColor: "bg-blue-100" },
          { title: "Approved", count: documents.filter(d => d.status === 'approved').length, color: "text-green-600", bgColor: "bg-green-100" },
          { title: "Rejected", count: documents.filter(d => d.status === 'rejected').length, color: "text-red-600", bgColor: "bg-red-100" }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <FileText className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending-review" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending-review">Pending Review</TabsTrigger>
          <TabsTrigger value="under-review">Under Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending-review" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search documents..." className="pl-10" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="hca">Health Care Assistant</SelectItem>
                    <SelectItem value="ece">Early Childhood Education</SelectItem>
                    <SelectItem value="aviation">Aviation Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="transcript">Transcripts</SelectItem>
                    <SelectItem value="id">ID Documents</SelectItem>
                    <SelectItem value="language">Language Tests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Documents Pending Review ({documents.filter(d => d.status === 'pending').length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ConditionalDataWrapper
                isLoading={isLoading}
                showEmptyState={showEmptyState}
                hasDemoAccess={hasDemoAccess}
                hasRealData={hasRealData}
                emptyTitle="No Documents to Review"
                emptyDescription="Document submissions will appear here for review."
                loadingRows={5}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.filter(d => d.status === 'pending').map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
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
                              <p className="text-sm text-muted-foreground">{doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : 'Unknown size'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>ST</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{doc.studentId}</span>
                          </div>
                        </TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(doc.status)}
                            <Badge variant={getStatusColor(doc.status)}>
                              {doc.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
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
              </ConditionalDataWrapper>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other status tabs would have similar structure */}
        <TabsContent value="under-review">
          <Card>
            <CardHeader>
              <CardTitle>Documents Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Documents currently being reviewed by team members.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Documents that have been approved and processed.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Documents that were rejected and need resubmission.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManagement;
