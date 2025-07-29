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

const DocumentManagement: React.FC = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const documents = [
    {
      id: "1",
      name: "High School Transcript",
      studentName: "Sarah Johnson",
      program: "Health Care Assistant",
      intake: "April 2024",
      uploadDate: "2024-01-15",
      status: "pending",
      fileType: "PDF",
      fileSize: "2.3 MB",
      requirement: "Academic Records"
    },
    {
      id: "2", 
      name: "Government ID",
      studentName: "Michael Chen",
      program: "Early Childhood Education",
      intake: "May 2024",
      uploadDate: "2024-01-14",
      status: "under-review",
      fileType: "PDF", 
      fileSize: "1.8 MB",
      requirement: "Identity Verification"
    },
    {
      id: "3",
      name: "English Proficiency Test",
      studentName: "Emma Davis", 
      program: "Aviation Maintenance",
      intake: "June 2024",
      uploadDate: "2024-01-13",
      status: "approved",
      fileType: "PDF",
      fileSize: "3.1 MB",
      requirement: "Language Proficiency"
    }
  ];

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
          { title: "Pending Review", count: 45, color: "text-yellow-600", bgColor: "bg-yellow-100" },
          { title: "Under Review", count: 23, color: "text-blue-600", bgColor: "bg-blue-100" },
          { title: "Approved Today", count: 67, color: "text-green-600", bgColor: "bg-green-100" },
          { title: "Rejected", count: 8, color: "text-red-600", bgColor: "bg-red-100" }
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
              <CardTitle>Documents Pending Review ({documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
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
                          <span className="font-medium">{doc.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{doc.program}</TableCell>
                      <TableCell>{doc.requirement}</TableCell>
                      <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(doc.status)}
                          <Badge variant={getStatusColor(doc.status)}>
                            {doc.status.replace('-', ' ')}
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
