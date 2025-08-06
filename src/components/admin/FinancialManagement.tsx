import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus,
  Download,
  Send,
  Edit2,
  Eye,
  Settings,
  MessageSquare,
  Mail,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConditionalData } from '@/hooks/useConditionalData';
import { ConditionalDataWrapper } from './ConditionalDataWrapper';
import { DemoDataService } from '@/services/demoDataService';
import { FinancialService } from '@/services/financialService';
import { ProgramService } from '@/services/programService';
import { EnhancedProgramFeeModal } from "./modals/EnhancedProgramFeeModal";
import { ProgramConfigurationModal } from "./modals/ProgramConfigurationModal";
import { PaymentDetailModal } from "./modals/PaymentDetailModal";
import { ScholarshipModal } from "./modals/ScholarshipModal";
import { BulkPaymentActionModal } from "./modals/BulkPaymentActionModal";

const FinancialManagement = () => {
  const navigate = useNavigate();
  const [programFeeModalOpen, setProgramFeeModalOpen] = useState(false);
  const [programConfigModalOpen, setProgramConfigModalOpen] = useState(false);
  const [paymentDetailModalOpen, setPaymentDetailModalOpen] = useState(false);
  const [scholarshipModalOpen, setScholarshipModalOpen] = useState(false);
  const [bulkPaymentModalOpen, setBulkPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [bulkActionType, setBulkActionType] = useState<"invoice" | "reminder">("reminder");
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [paymentFilters, setPaymentFilters] = useState({
    status: "all",
    dateRange: "all",
    amountRange: "all",
    search: ""
  });

  const { toast } = useToast();

  // Data hooks
  const financialData = useConditionalData(
    ['financial-records'],
    DemoDataService.getDemoFinancialRecords,
    FinancialService.getFinancialRecords
  );
  
  const programsData = useConditionalData(
    ['programs'],
    DemoDataService.getDemoPrograms,
    ProgramService.getPrograms
  );

  // Mock data
  const financialStats = [
    {
      title: "Total Revenue",
      value: "$2,847,500",
      change: "+12.5%",
      trend: "up" as const,
    },
    {
      title: "Outstanding Payments",
      value: "$342,100",
      change: "-8.2%", 
      trend: "down" as const,
    },
    {
      title: "Scholarship Budget",
      value: "$150,000",
      change: "+5.1%",
      trend: "up" as const,
    },
    {
      title: "Collection Rate",
      value: "94.8%",
      change: "+2.3%",
      trend: "up" as const,
    },
  ];

  const mockPrograms = [
    { id: "1", name: "Health Care Assistant" },
    { id: "2", name: "Aviation" },
    { id: "3", name: "Education Assistant" },
    { id: "4", name: "ECE" },
    { id: "5", name: "Hospitality" },
    { id: "6", name: "MLA" },
  ];

  const mockProgramFees = [
    {
      id: "1",
      name: "Health Care Assistant",
      domesticFees: [
        { type: "Tuition Fee", amount: "15000", currency: "CAD", required: true },
        { type: "Application Fee", amount: "150", currency: "CAD", required: true },
      ],
      internationalFees: [
        { type: "Tuition Fee", amount: "25000", currency: "CAD", required: true },
        { type: "Application Fee", amount: "150", currency: "CAD", required: true },
      ],
    },
    {
      id: "2",
      name: "Aviation",
      domesticFees: [
        { type: "Tuition Fee", amount: "28000", currency: "CAD", required: true },
        { type: "Technology Fee", amount: "500", currency: "CAD", required: true },
      ],
      internationalFees: [
        { type: "Tuition Fee", amount: "35000", currency: "CAD", required: true },
        { type: "Technology Fee", amount: "500", currency: "CAD", required: true },
      ],
    },
  ];

  const mockApplicationPayments = [
    {
      id: "1",
      studentName: "Sarah Johnson",
      studentId: "STU001",
      program: "Health Care Assistant",
      amountDue: 150,
      dueDate: "2025-02-01",
      status: "ready",
      email: "sarah.johnson@email.com",
      phone: "(555) 0123",
    },
    {
      id: "2",
      studentName: "Michael Chen",
      studentId: "STU002", 
      program: "Aviation",
      amountDue: 200,
      dueDate: "2025-01-25",
      status: "sent",
      email: "michael.chen@email.com",
      phone: "(555) 0124",
    },
    {
      id: "3",
      studentName: "Emily Rodriguez",
      studentId: "STU003",
      program: "Education Assistant",
      amountDue: 125,
      dueDate: "2025-01-20",
      status: "received",
      email: "emily.rodriguez@email.com",
      phone: "(555) 0125",
    },
  ];

  const mockScholarships = [
    {
      id: "1",
      name: "Excellence Scholarship",
      amount: 2500,
      totalBudget: 30000,
      availableBudget: 15000,
      applications: 45,
      awarded: 6,
      description: "Merit-based scholarship for outstanding students",
    },
    {
      id: "2",
      name: "Need-Based Grant",
      amount: 1500,
      totalBudget: 25000,
      availableBudget: 10000,
      applications: 32,
      awarded: 10,
      description: "Financial assistance for students in need",
    },
  ];

  const filteredPayments = financialData.data.filter(payment => {
    if (selectedProgram !== "all" && payment.program !== selectedProgram) return false;
    if (paymentFilters.status !== "all" && payment.status !== paymentFilters.status) return false;
    if (paymentFilters.search && !payment.student_name.toLowerCase().includes(paymentFilters.search.toLowerCase()) &&
        !payment.id.toLowerCase().includes(paymentFilters.search.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge variant="outline">Ready</Badge>;
      case "sent":
        return <Badge variant="secondary">Sent</Badge>;
      case "received":
        return <Badge className="bg-green-100 text-green-800">Received</Badge>;
      case "pending":
        return <Badge variant="destructive">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExportData = () => {
    console.log("Export data");
    toast({
      title: "Export Started",
      description: "Financial data export is being prepared",
    });
  };

  const handleEditProgram = (program: any) => {
    setSelectedPayment(program);
    setModalMode("edit");
    setProgramFeeModalOpen(true);
  };

  const handleConfigureProgram = (program: any) => {
    setSelectedPayment(program);
    setProgramConfigModalOpen(true);
  };

  const handleAddProgram = () => {
    setSelectedPayment(null);
    setModalMode("add");
    setProgramFeeModalOpen(true);
  };

  const handleSendInvoice = (payment: any) => {
    setSelectedStudents([payment]);
    setBulkActionType("invoice");
    setBulkPaymentModalOpen(true);
  };

  const handleSendReminder = (payment: any) => {
    setSelectedStudents([payment]);
    setBulkActionType("reminder");
    setBulkPaymentModalOpen(true);
  };

  const handleBulkReminder = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select students to send reminders to",
        variant: "destructive",
      });
      return;
    }
    setBulkActionType("reminder");
    setBulkPaymentModalOpen(true);
  };

  const handleStudentSelection = (student: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedStudents(prev => [...prev, student]);
    } else {
      setSelectedStudents(prev => prev.filter(s => s.id !== student.id));
    }
  };

  const handleSelectAll = (students: any[]) => {
    const filteredStudents = students.filter(student => 
      selectedProgram === "all" || student.program === selectedProgram
    );
    setSelectedStudents(filteredStudents);
  };

  const handleViewApplications = (scholarship: any) => {
    navigate(`/admin/scholarships/${scholarship.id}/applications`);
  };

  const handleEditScholarship = (scholarship: any) => {
    setSelectedScholarship(scholarship);
    setScholarshipModalOpen(true);
  };

  const handleAwardScholarship = (scholarship: any) => {
    navigate(`/admin/scholarships/${scholarship.id}/applications`);
  };

  const handleProgramFeeSave = (data: any) => {
    console.log("Program fee data:", data);
    toast({
      title: modalMode === "add" ? "Program Created" : "Program Updated",
      description: modalMode === "add" 
        ? `${data.programName} fee structure has been created successfully`
        : `${data.programName} fee structure has been updated successfully`,
    });
  };

  const handleProgramConfigSave = (data: any) => {
    console.log("Program config data:", data);
    toast({
      title: "Configuration Saved",
      description: "Program configuration has been updated successfully",
    });
  };

  const handleBulkActionConfirm = (data: any) => {
    console.log("Bulk action data:", data);
    toast({
      title: `${bulkActionType === "invoice" ? "Invoices" : "Reminders"} Sent`,
      description: `Successfully sent ${bulkActionType === "invoice" ? "invoices" : "reminders"} to ${selectedStudents.length} students`,
    });
    setSelectedStudents([]);
  };

  const handleScholarshipSave = (data: any) => {
    console.log("Scholarship data:", data);
    toast({
      title: selectedScholarship ? "Scholarship Updated" : "Scholarship Created",
      description: selectedScholarship 
        ? `${data.name} has been updated successfully`
        : `${data.name} has been created successfully`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Management</h1>
          <p className="text-muted-foreground">Manage program fees, application payments, and scholarships</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={handleAddProgram}>
            <Plus className="h-4 w-4 mr-2" />
            Add Program Fees
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span> this month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="fees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fees">Program Fees</TabsTrigger>
          <TabsTrigger value="payments">Application Payments</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
        </TabsList>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Program Fee Structure</CardTitle>
                <Button onClick={handleAddProgram}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockProgramFees.map((program) => (
                  <div key={program.id} className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{program.name}</h3>
                        <p className="text-sm text-muted-foreground">Multiple fee types configured</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProgram(program)}>
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleConfigureProgram(program)}>
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Domestic Students</h4>
                        <div className="space-y-2">
                          {program.domesticFees.map((fee, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                              <span className="text-sm">{fee.type}</span>
                              <span className="font-medium">${fee.amount} {fee.currency}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">International Students</h4>
                        <div className="space-y-2">
                          {program.internationalFees.map((fee, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                              <span className="text-sm">{fee.type}</span>
                              <span className="font-medium">${fee.amount} {fee.currency}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Application Payment Tracking</CardTitle>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search students..."
                    value={paymentFilters.search}
                    onChange={(e) => setPaymentFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-64"
                  />
                  <Select value={paymentFilters.status} onValueChange={(value) => setPaymentFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">All Programs</SelectItem>
                       {programsData.data.map((program) => (
                         <SelectItem key={program.id} value={program.name}>
                           {program.name}
                         </SelectItem>
                       ))}
                     </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleBulkReminder}
                    disabled={selectedStudents.length === 0}
                    variant="outline"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Bulk Reminders ({selectedStudents.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ConditionalDataWrapper
                isLoading={financialData.isLoading}
                showEmptyState={financialData.showEmptyState}
                hasDemoAccess={financialData.hasDemoAccess}
                hasRealData={financialData.hasRealData}
                emptyTitle="No Payment Records Found"
                emptyDescription="Student payment records will appear here once students start making payments."
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedStudents.length === filteredPayments.length && filteredPayments.length > 0}
                          onCheckedChange={() => {
                            if (selectedStudents.length === filteredPayments.length) {
                              setSelectedStudents([]);
                            } else {
                              handleSelectAll(filteredPayments);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedStudents.some(s => s.id === payment.id)}
                            onCheckedChange={(checked) => handleStudentSelection(payment, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.student_name}</div>
                            <div className="text-sm text-muted-foreground">{payment.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{payment.program}</TableCell>
                        <TableCell>${payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.due_date}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleSendInvoice(payment)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Invoice
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder(payment)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reminder
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setPaymentDetailModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
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

        <TabsContent value="scholarships" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Scholarship Management</CardTitle>
                <Button onClick={() => setScholarshipModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scholarship
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockScholarships.map((scholarship) => (
                  <div key={scholarship.id} className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{scholarship.name}</h3>
                        <p className="text-sm text-muted-foreground">{scholarship.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${scholarship.amount}</p>
                        <p className="text-sm text-muted-foreground">per recipient</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="text-xl font-semibold">{scholarship.applications}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Awarded</p>
                        <p className="text-xl font-semibold text-green-600">{scholarship.awarded}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="text-xl font-semibold">${scholarship.totalBudget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Available</p>
                        <p className="text-xl font-semibold">${scholarship.availableBudget.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewApplications(scholarship)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Applications ({scholarship.applications})
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditScholarship(scholarship)}>
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit Details
                      </Button>
                      <Button size="sm" onClick={() => handleAwardScholarship(scholarship)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Award Scholarship
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Program Fee Modal */}
      <EnhancedProgramFeeModal
        isOpen={programFeeModalOpen}
        onClose={() => setProgramFeeModalOpen(false)}
        onSave={handleProgramFeeSave}
        program={selectedPayment}
        title={modalMode === "add" ? "Add New Program" : "Edit Program Fees"}
        mode={modalMode}
      />

      {/* Program Configuration Modal */}
      <ProgramConfigurationModal
        isOpen={programConfigModalOpen}
        onClose={() => setProgramConfigModalOpen(false)}
        onSave={handleProgramConfigSave}
        program={selectedPayment}
        programs={mockPrograms}
      />

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          isOpen={paymentDetailModalOpen}
          onClose={() => setPaymentDetailModalOpen(false)}
          payment={selectedPayment}
          onSendInvoice={handleSendInvoice}
          onSendReminder={handleSendReminder}
          onEditPayment={() => {}}
        />
      )}

      {/* Scholarship Modal */}
      <ScholarshipModal
        isOpen={scholarshipModalOpen}
        onClose={() => setScholarshipModalOpen(false)}
        onSave={handleScholarshipSave}
        scholarship={selectedScholarship}
        title={selectedScholarship ? "Edit Scholarship" : "Create Scholarship"}
      />


      {/* Bulk Payment Action Modal */}
      <BulkPaymentActionModal
        isOpen={bulkPaymentModalOpen}
        onClose={() => setBulkPaymentModalOpen(false)}
        onConfirm={handleBulkActionConfirm}
        selectedStudents={selectedStudents}
        actionType={bulkActionType}
      />
    </div>
  );
};

export default FinancialManagement;