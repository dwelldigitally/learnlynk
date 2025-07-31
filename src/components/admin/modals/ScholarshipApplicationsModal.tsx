import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScholarshipApplication {
  id: string;
  studentName: string;
  studentId: string;
  email: string;
  gpa: number;
  submittedDate: string;
  status: "pending" | "awarded" | "rejected";
  essayScore?: number;
  documentsComplete: boolean;
  awardAmount?: number;
  rejectionReason?: string;
}

interface ScholarshipApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarship: {
    id: string;
    name: string;
    totalBudget: number;
    availableBudget: number;
  };
}

export const ScholarshipApplicationsModal = ({ 
  isOpen, 
  onClose, 
  scholarship 
}: ScholarshipApplicationsModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("submittedDate");
  const [selectedApplication, setSelectedApplication] = useState<ScholarshipApplication | null>(null);

  // Mock data - replace with actual data
  const mockApplications: ScholarshipApplication[] = [
    {
      id: "1",
      studentName: "Sarah Johnson",
      studentId: "STU001",
      email: "sarah.johnson@email.com",
      gpa: 3.8,
      submittedDate: "2024-01-15",
      status: "pending",
      essayScore: 85,
      documentsComplete: true,
    },
    {
      id: "2", 
      studentName: "Michael Chen",
      studentId: "STU002",
      email: "michael.chen@email.com",
      gpa: 3.9,
      submittedDate: "2024-01-12",
      status: "awarded",
      essayScore: 92,
      documentsComplete: true,
      awardAmount: 2500,
    },
    {
      id: "3",
      studentName: "Emily Rodriguez",
      studentId: "STU003", 
      email: "emily.rodriguez@email.com",
      gpa: 3.2,
      submittedDate: "2024-01-20",
      status: "rejected",
      essayScore: 65,
      documentsComplete: false,
      rejectionReason: "Incomplete documentation",
    },
  ];

  const pendingApplications = mockApplications.filter(app => app.status === "pending");
  const awardedApplications = mockApplications.filter(app => app.status === "awarded");
  const rejectedApplications = mockApplications.filter(app => app.status === "rejected");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending Review</Badge>;
      case "awarded":
        return <Badge className="bg-green-100 text-green-800">Awarded</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAwardScholarship = (applicationId: string, amount: number) => {
    console.log(`Awarding ${amount} to application ${applicationId}`);
    // Implement award logic
  };

  const handleRejectApplication = (applicationId: string, reason: string) => {
    console.log(`Rejecting application ${applicationId}: ${reason}`);
    // Implement reject logic  
  };

  const ApplicationTable = ({ applications, showActions = false }: { applications: ScholarshipApplication[], showActions?: boolean }) => (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submittedDate">Submission Date</SelectItem>
            <SelectItem value="gpa">GPA</SelectItem>
            <SelectItem value="studentName">Student Name</SelectItem>
            <SelectItem value="essayScore">Essay Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>GPA</TableHead>
            <TableHead>Essay Score</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{application.studentName}</div>
                  <div className="text-sm text-muted-foreground">{application.studentId}</div>
                  <div className="text-sm text-muted-foreground">{application.email}</div>
                </div>
              </TableCell>
              <TableCell>{application.gpa}</TableCell>
              <TableCell>{application.essayScore || "N/A"}</TableCell>
              <TableCell>{application.submittedDate}</TableCell>
              <TableCell>
                <Badge variant={application.documentsComplete ? "default" : "destructive"}>
                  {application.documentsComplete ? "Complete" : "Incomplete"}
                </Badge>
              </TableCell>
              <TableCell>{getStatusBadge(application.status)}</TableCell>
              {showActions && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedApplication(application)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {application.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleAwardScholarship(application.id, 2500)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectApplication(application.id, "")}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {scholarship.name} - Applications
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Budget: ${scholarship.availableBudget.toLocaleString()} / ${scholarship.totalBudget.toLocaleString()} available
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Awarded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{awardedApplications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedApplications.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
            <TabsTrigger value="awarded">Awarded ({awardedApplications.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
            <TabsTrigger value="all">All ({mockApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ApplicationTable applications={pendingApplications} showActions={true} />
          </TabsContent>

          <TabsContent value="awarded">
            <ApplicationTable applications={awardedApplications} />
          </TabsContent>

          <TabsContent value="rejected">
            <ApplicationTable applications={rejectedApplications} />
          </TabsContent>

          <TabsContent value="all">
            <ApplicationTable applications={mockApplications} showActions={true} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};