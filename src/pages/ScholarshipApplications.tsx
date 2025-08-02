import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, CheckCircle, XCircle, Search, ArrowLeft, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  essay: string;
  transcript: string;
  recommendationLetters: string[];
}

export const ScholarshipApplications = () => {
  const { scholarshipId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("submittedDate");
  const [selectedApplication, setSelectedApplication] = useState<ScholarshipApplication | null>(null);
  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [awardAmount, setAwardAmount] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Mock scholarship data - replace with actual API call
  const scholarship = {
    id: scholarshipId,
    name: "Excellence in STEM Scholarship",
    totalBudget: 50000,
    availableBudget: 35000,
    description: "Supporting outstanding students in Science, Technology, Engineering, and Mathematics fields.",
  };

  // Mock applications data - replace with actual API call
  const mockApplications: ScholarshipApplication[] = [
    {
      id: "1",
      studentName: "Alex Thompson",
      studentId: "STU001",
      email: "sarah.johnson@email.com",
      gpa: 3.8,
      submittedDate: "2024-01-15",
      status: "pending",
      essayScore: 85,
      documentsComplete: true,
      essay: "My passion for environmental science began when I witnessed the effects of climate change...",
      transcript: "transcript_sarah_johnson.pdf",
      recommendationLetters: ["Dr. Smith recommendation", "Prof. Wilson recommendation"],
    },
    {
      id: "2", 
      studentName: "Jordan Smith",
      studentId: "STU002",
      email: "michael.chen@email.com",
      gpa: 3.9,
      submittedDate: "2024-01-12",
      status: "awarded",
      essayScore: 92,
      documentsComplete: true,
      awardAmount: 2500,
      essay: "Innovation in computer science has always been my driving force...",
      transcript: "transcript_michael_chen.pdf",
      recommendationLetters: ["Dr. Garcia recommendation", "Prof. Lee recommendation"],
    },
    {
      id: "3",
      studentName: "Casey Wilson",
      studentId: "STU003", 
      email: "emily.rodriguez@email.com",
      gpa: 3.2,
      submittedDate: "2024-01-20",
      status: "rejected",
      essayScore: 65,
      documentsComplete: false,
      rejectionReason: "Incomplete documentation - missing transcript",
      essay: "Mathematics has always been challenging but rewarding for me...",
      transcript: "",
      recommendationLetters: ["Prof. Davis recommendation"],
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

  const handleAwardScholarship = () => {
    if (!selectedApplication || !awardAmount) return;
    
    console.log(`Awarding $${awardAmount} to application ${selectedApplication.id}`);
    
    toast({
      title: "Scholarship Awarded",
      description: `$${awardAmount} awarded to ${selectedApplication.studentName}`,
    });
    
    setAwardModalOpen(false);
    setAwardAmount("");
    setSelectedApplication(null);
  };

  const handleRejectApplication = () => {
    if (!selectedApplication || !rejectionReason) return;
    
    console.log(`Rejecting application ${selectedApplication.id}: ${rejectionReason}`);
    
    toast({
      title: "Application Rejected",
      description: `Application from ${selectedApplication.studentName} has been rejected`,
      variant: "destructive",
    });
    
    setRejectModalOpen(false);
    setRejectionReason("");
    setSelectedApplication(null);
  };

  const handleViewApplication = (application: ScholarshipApplication) => {
    setSelectedApplication(application);
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
                    <Button size="sm" variant="outline" onClick={() => handleViewApplication(application)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {application.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedApplication(application);
                            setAwardModalOpen(true);
                          }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => {
                            setSelectedApplication(application);
                            setRejectModalOpen(true);
                          }}
                        >
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/admin/financial')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Financial Management
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{scholarship.name}</h1>
          <p className="text-muted-foreground">{scholarship.description}</p>
          <div className="text-sm text-muted-foreground mt-1">
            Budget: ${scholarship.availableBudget.toLocaleString()} / ${scholarship.totalBudget.toLocaleString()} available
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingApplications.length}</div>
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

      {/* Applications Tabs */}
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

      {/* View Application Modal */}
      <Dialog open={!!selectedApplication && !awardModalOpen && !rejectModalOpen} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details - {selectedApplication?.studentName}</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Student ID</Label>
                  <p>{selectedApplication.studentId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p>{selectedApplication.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">GPA</Label>
                  <p>{selectedApplication.gpa}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Essay Score</Label>
                  <p>{selectedApplication.essayScore || "Not scored"}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Essay</Label>
                <div className="mt-1 p-3 border rounded-lg bg-muted">
                  <p className="text-sm">{selectedApplication.essay}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Documents</Label>
                <div className="mt-1 space-y-1">
                  <p className="text-sm">Transcript: {selectedApplication.transcript || "Not submitted"}</p>
                  <p className="text-sm">Recommendation Letters: {selectedApplication.recommendationLetters.length} submitted</p>
                </div>
              </div>

              {selectedApplication.status === "awarded" && (
                <div>
                  <Label className="text-sm font-medium">Award Amount</Label>
                  <p className="text-green-600 font-semibold">${selectedApplication.awardAmount}</p>
                </div>
              )}

              {selectedApplication.status === "rejected" && (
                <div>
                  <Label className="text-sm font-medium">Rejection Reason</Label>
                  <p className="text-red-600">{selectedApplication.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Award Modal */}
      <Dialog open={awardModalOpen} onOpenChange={setAwardModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Award Scholarship - {selectedApplication?.studentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="award-amount">Award Amount ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="award-amount"
                  type="number"
                  placeholder="2500"
                  value={awardAmount}
                  onChange={(e) => setAwardAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Available budget: ${scholarship.availableBudget.toLocaleString()}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAwardModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAwardScholarship} disabled={!awardAmount}>
              Award Scholarship
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application - {selectedApplication?.studentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectApplication} disabled={!rejectionReason}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};