import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, MessageSquare, Eye, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import { RecruiterService } from '@/services/recruiterService';
import { useToast } from '@/hooks/use-toast';
import type { RecruiterApplication, RecruiterCommunication, RecruiterDocument } from '@/types/recruiter';

export default function RecruiterApplicationsManagement() {
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<RecruiterApplication | null>(null);
  const [communications, setCommunications] = useState<RecruiterCommunication[]>([]);
  const [documents, setDocuments] = useState<RecruiterDocument[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', feedback: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await RecruiterService.getRecruiterApplications();
      setApplications(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recruiter applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadApplicationDetails = async (applicationId: string) => {
    try {
      const [comms, docs] = await Promise.all([
        RecruiterService.getCommunications(applicationId),
        RecruiterService.getApplicationDocuments(applicationId)
      ]);
      setCommunications(comms);
      setDocuments(docs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load application details",
        variant: "destructive"
      });
    }
  };

  const handleViewApplication = async (application: RecruiterApplication) => {
    setSelectedApplication(application);
    await loadApplicationDetails(application.id);
    setShowDetailModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication) return;

    try {
      await RecruiterService.updateRecruiterApplicationStatus(
        selectedApplication.id,
        statusUpdate.status as any,
        statusUpdate.feedback
      );
      await loadApplications();
      setShowStatusModal(false);
      setStatusUpdate({ status: '', feedback: '' });
      toast({
        title: "Success",
        description: "Application status updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.recruiter?.first_name + ' ' + app.recruiter?.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      submitted: 'bg-blue-100 text-blue-800',
      in_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      payment_pending: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800'
    };
    return <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>{status.replace('_', ' ')}</Badge>;
  };

  const getCommissionStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      paid: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const stats = {
    total: applications.length,
    submitted: applications.filter(app => app.status === 'submitted').length,
    in_review: applications.filter(app => app.status === 'in_review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recruiter Applications</h1>
          <p className="text-muted-foreground">Review and manage applications submitted by external recruiters</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
            <div className="text-sm text-muted-foreground">Submitted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.in_review}</div>
            <div className="text-sm text-muted-foreground">In Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="payment_pending">Payment Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Recruiter</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{app.program}</div>
                      <div className="text-sm text-muted-foreground">{app.intake_date}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {app.recruiter ? (
                      <div>
                        <div className="font-medium">{app.recruiter.first_name} {app.recruiter.last_name}</div>
                        <div className="text-sm text-muted-foreground">{app.recruiter.email}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{app.company?.name || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${app.commission_amount}</div>
                      <div className="text-sm">{getCommissionStatusBadge(app.commission_status)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(app.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewApplication(app)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(app);
                          setStatusUpdate({ status: app.status, feedback: '' });
                          setShowStatusModal(true);
                        }}
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review application information, communications, and documents
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Application Info</h3>
                  <div className="space-y-2">
                    <div><strong>Program:</strong> {selectedApplication.program}</div>
                    <div><strong>Intake Date:</strong> {selectedApplication.intake_date}</div>
                    <div><strong>Status:</strong> {getStatusBadge(selectedApplication.status)}</div>
                    <div><strong>Commission:</strong> ${selectedApplication.commission_amount}</div>
                    <div><strong>Submitted:</strong> {new Date(selectedApplication.submitted_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recruiter Info</h3>
                  {selectedApplication.recruiter && (
                    <div className="space-y-2">
                      <div><strong>Name:</strong> {selectedApplication.recruiter.first_name} {selectedApplication.recruiter.last_name}</div>
                      <div><strong>Email:</strong> {selectedApplication.recruiter.email}</div>
                      <div><strong>Company:</strong> {selectedApplication.company?.name}</div>
                    </div>
                  )}
                </div>
              </div>

              <Tabs defaultValue="communications" className="w-full">
                <TabsList>
                  <TabsTrigger value="communications">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Communications ({communications.length})
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    <FileText className="w-4 h-4 mr-2" />
                    Documents ({documents.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="communications" className="space-y-4">
                  {communications.map((comm) => (
                    <Card key={comm.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={comm.sender_type === 'recruiter' ? 'default' : 'secondary'}>
                            {comm.sender_type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(comm.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comm.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="documents" className="space-y-4">
                  {documents.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{doc.document_name}</div>
                            <div className="text-sm text-muted-foreground">{doc.document_type}</div>
                            <div className="text-sm text-muted-foreground">
                              {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'Size unknown'}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              doc.status === 'approved' ? 'default' : 
                              doc.status === 'rejected' ? 'destructive' : 'secondary'
                            }>
                              {doc.status}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {new Date(doc.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {doc.feedback && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <strong>Feedback:</strong> {doc.feedback}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the status of this application and optionally add feedback
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusUpdate.status}
                onValueChange={(value) => setStatusUpdate(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="payment_pending">Payment Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="feedback">Feedback (optional)</Label>
              <Textarea
                id="feedback"
                value={statusUpdate.feedback}
                onChange={(e) => setStatusUpdate(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Add any feedback or notes..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowStatusModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}