import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Send,
  Edit2,
  Eye,
  Settings,
  Bell
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ProgramFeeModal } from "./modals/ProgramFeeModal";
import { PaymentDetailModal } from "./modals/PaymentDetailModal";
import { ScholarshipModal } from "./modals/ScholarshipModal";

const FinancialManagement: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programFeeModal, setProgramFeeModal] = useState({ isOpen: false, mode: 'add', program: null });
  const [paymentDetailModal, setPaymentDetailModal] = useState({ isOpen: false, payment: null });
  const [scholarshipModal, setScholarshipModal] = useState({ isOpen: false, mode: 'add', scholarship: null });
  const { toast } = useToast();
  
  const financialStats = [
    { title: "Ready to Send", amount: "47", change: "+8", icon: Clock, color: "text-orange-600" },
    { title: "Invoices Sent", amount: "132", change: "+23", icon: Send, color: "text-blue-600" },
    { title: "Payments Received", amount: "98", change: "+18", icon: CheckCircle, color: "text-green-600" },
    { title: "Pending Payments", amount: "34", change: "-5", icon: AlertTriangle, color: "text-red-600" },
  ];

  const programs = [
    "Health Care Assistant",
    "Aviation",
    "Education Assistant", 
    "ECE",
    "Hospitality",
    "MLA"
  ];

  const programFees = [
    {
      id: "1",
      program: "Health Care Assistant",
      domesticFee: 15000,
      internationalFee: 25000,
      applicationFee: 150,
      currency: "CAD",
      lastUpdated: "2025-01-15"
    },
    {
      id: "2", 
      program: "Aviation",
      domesticFee: 28000,
      internationalFee: 35000,
      applicationFee: 200,
      currency: "CAD",
      lastUpdated: "2025-01-10"
    },
    {
      id: "3",
      program: "Education Assistant",
      domesticFee: 12000,
      internationalFee: 18000,
      applicationFee: 125,
      currency: "CAD", 
      lastUpdated: "2025-01-12"
    },
    {
      id: "4",
      program: "ECE",
      domesticFee: 16000,
      internationalFee: 22000,
      applicationFee: 175,
      currency: "CAD",
      lastUpdated: "2025-01-08"
    }
  ];

  const applicationPayments = [
    {
      id: "1",
      studentName: "Sarah Johnson",
      studentId: "ST-2025-001",
      program: "Health Care Assistant",
      status: "ready_to_send",
      amount: 150,
      dueDate: "2025-02-01",
      sentDate: null,
      paidDate: null
    },
    {
      id: "2",
      studentName: "Michael Chen", 
      studentId: "ST-2025-002",
      program: "Aviation",
      status: "sent",
      amount: 200,
      dueDate: "2025-01-25",
      sentDate: "2025-01-20",
      paidDate: null
    },
    {
      id: "3",
      studentName: "Emily Rodriguez",
      studentId: "ST-2025-003", 
      program: "Education Assistant",
      status: "received",
      amount: 125,
      dueDate: "2025-01-20",
      sentDate: "2025-01-15",
      paidDate: "2025-01-18"
    },
    {
      id: "4",
      studentName: "David Kim",
      studentId: "ST-2025-004",
      program: "ECE", 
      status: "pending",
      amount: 175,
      dueDate: "2025-01-22",
      sentDate: "2025-01-18",
      paidDate: null
    },
    {
      id: "5",
      studentName: "Lisa Thompson",
      studentId: "ST-2025-005",
      program: "Health Care Assistant",
      status: "pending",
      amount: 150,
      dueDate: "2025-01-15",
      sentDate: "2025-01-10",
      paidDate: null
    }
  ];

  const paymentPlans = [
    {
      id: "1",
      name: "Full Payment - 5% Discount",
      description: "Pay tuition in full before course start",
      discount: 5,
      installments: 1,
      isActive: true
    },
    {
      id: "2", 
      name: "2-Payment Plan",
      description: "50% before start, 50% at midpoint",
      discount: 0,
      installments: 2,
      isActive: true
    },
    {
      id: "3",
      name: "4-Payment Plan",
      description: "Monthly payments over 4 months",
      discount: 0,
      installments: 4,
      isActive: true
    },
    {
      id: "4",
      name: "Extended Plan (6 months)",
      description: "Extended payment plan with small fee",
      discount: -2,
      installments: 6,
      isActive: false
    }
  ];

  const scholarships = [
    {
      id: "1",
      name: "Excellence Scholarship",
      amount: 2500,
      description: "For students with outstanding academic achievements",
      eligibility: "GPA 3.8+, domestic students",
      programs: ["Health Care Assistant", "ECE"],
      applications: 45,
      awarded: 12,
      budget: 30000,
      used: 30000,
      deadline: "2025-03-15",
      renewable: true,
      maxRecipients: 15
    },
    {
      id: "2",
      name: "Need-Based Grant", 
      amount: 1500,
      description: "Financial assistance for students with demonstrated need",
      eligibility: "Household income under $50,000",
      programs: ["All Programs"],
      applications: 78,
      awarded: 35,
      budget: 75000,
      used: 52500,
      deadline: "2025-04-01",
      renewable: false,
      maxRecipients: 50
    },
    {
      id: "3",
      name: "Industry Partnership",
      amount: 3000,
      description: "Sponsored by healthcare industry partners",
      eligibility: "HCA program students, work commitment",
      programs: ["Health Care Assistant"],
      applications: 23,
      awarded: 8,
      budget: 24000,
      used: 24000,
      deadline: "2025-02-28",
      renewable: false,
      maxRecipients: 10
    },
    {
      id: "4",
      name: "International Student Grant",
      amount: 4000,
      description: "Support for international students",
      eligibility: "International students, English proficiency",
      programs: ["Aviation", "Hospitality"],
      applications: 32,
      awarded: 6,
      budget: 40000,
      used: 24000,
      deadline: "2025-03-01",
      renewable: true,
      maxRecipients: 10
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready_to_send":
        return <Badge variant="secondary">Ready to Send</Badge>;
      case "sent":
        return <Badge variant="outline">Sent</Badge>;
      case "received":
        return <Badge variant="default" className="bg-green-600">Received</Badge>;
      case "pending":
        return <Badge variant="destructive">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready_to_send":
        return "border-orange-200";
      case "sent":
        return "border-blue-200";
      case "received":
        return "border-green-200";
      case "pending":
        return "border-red-200";
      default:
        return "border-border";
    }
  };

  const filteredPayments = selectedProgram && selectedProgram !== "all"
    ? applicationPayments.filter(payment => payment.program === selectedProgram)
    : applicationPayments;

  // Modal handlers
  const handleAddProgram = () => {
    setProgramFeeModal({ isOpen: true, mode: 'add', program: null });
  };

  const handleEditProgram = (program: any) => {
    setProgramFeeModal({ isOpen: true, mode: 'edit', program });
  };

  const handleConfigureProgram = (program: any) => {
    setProgramFeeModal({ isOpen: true, mode: 'configure', program });
  };

  const handleSaveProgramFee = (data: any) => {
    toast({
      title: "Success",
      description: `Program fee ${programFeeModal.mode === 'add' ? 'added' : 'updated'} successfully`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your financial data export is being prepared",
    });
  };

  const handleSendInvoice = (paymentId: string) => {
    toast({
      title: "Invoice Sent",
      description: "Payment invoice has been sent to the student",
    });
  };

  const handleSendReminder = (paymentId: string) => {
    toast({
      title: "Reminder Sent",
      description: "Payment reminder has been sent to the student",
    });
  };

  const handleViewPaymentDetail = (payment: any) => {
    setPaymentDetailModal({ isOpen: true, payment });
  };

  const handleEditPayment = (payment: any) => {
    setPaymentDetailModal({ isOpen: false, payment: null });
    toast({
      title: "Edit Payment",
      description: "Payment editing functionality coming soon",
    });
  };

  const handleCreateScholarship = () => {
    setScholarshipModal({ isOpen: true, mode: 'add', scholarship: null });
  };

  const handleEditScholarship = (scholarship: any) => {
    setScholarshipModal({ isOpen: true, mode: 'edit', scholarship });
  };

  const handleSaveScholarship = (data: any) => {
    toast({
      title: "Success",
      description: `Scholarship ${scholarshipModal.mode === 'add' ? 'created' : 'updated'} successfully`,
    });
  };

  const handleViewApplications = (scholarshipId: string) => {
    toast({
      title: "Applications",
      description: "Scholarship applications view coming soon",
    });
  };

  return (
    <div className="space-y-6">
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
          <Button>
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
                  <p className="text-2xl font-bold text-foreground">{stat.amount}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">{stat.change}</span> this week
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
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
                {programFees.map((program) => (
                  <div key={program.id} className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{program.program}</h3>
                        <p className="text-sm text-muted-foreground">Last updated: {program.lastUpdated}</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Domestic Students</Label>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xl font-bold text-primary">${program.domesticFee.toLocaleString()} {program.currency}</p>
                          <p className="text-sm text-muted-foreground">Full program tuition</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">International Students</Label>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xl font-bold text-primary">${program.internationalFee.toLocaleString()} {program.currency}</p>
                          <p className="text-sm text-muted-foreground">Full program tuition</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Application Fee</Label>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xl font-bold text-secondary">${program.applicationFee} {program.currency}</p>
                          <p className="text-sm text-muted-foreground">Non-refundable</p>
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
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program} value={program}>{program}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-1" />
                    Send Reminders
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className={`p-4 border rounded-lg space-y-3 ${getStatusColor(payment.status)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{payment.studentName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {payment.studentId} • {payment.program}</p>
                        <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold">${payment.amount} CAD</p>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {payment.sentDate && (
                        <div>
                          <p className="text-muted-foreground">Sent Date</p>
                          <p className="font-medium">{payment.sentDate}</p>
                        </div>
                      )}
                      {payment.paidDate && (
                        <div>
                          <p className="text-muted-foreground">Paid Date</p>
                          <p className="font-medium text-green-600">{payment.paidDate}</p>
                        </div>
                      )}
                    </div>

                     <div className="flex space-x-2">
                       {payment.status === "ready_to_send" && (
                         <Button size="sm" onClick={() => handleSendInvoice(payment.id)}>
                           <Send className="h-4 w-4 mr-1" />
                           Send Invoice
                         </Button>
                       )}
                       {payment.status === "pending" && (
                         <Button size="sm" variant="outline" onClick={() => handleSendReminder(payment.id)}>
                           <Bell className="h-4 w-4 mr-1" />
                           Send Reminder
                         </Button>
                       )}
                       <Button variant="outline" size="sm" onClick={() => handleViewPaymentDetail(payment)}>
                         <Eye className="h-4 w-4 mr-1" />
                         View Details
                       </Button>
                       <Button variant="outline" size="sm" onClick={() => handleEditPayment(payment)}>
                         <Edit2 className="h-4 w-4 mr-1" />
                         Edit
                       </Button>
                     </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="scholarships" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Scholarship Management</CardTitle>
            <Button onClick={handleCreateScholarship}>
              <Plus className="h-4 w-4 mr-2" />
              Create Scholarship
            </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {scholarships.map((scholarship) => (
                  <div key={scholarship.id} className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{scholarship.name}</h3>
                        <p className="text-sm text-muted-foreground">{scholarship.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">
                            {scholarship.programs.join(", ")}
                          </Badge>
                          <Badge variant="secondary">
                            Deadline: {scholarship.deadline}
                          </Badge>
                          {scholarship.renewable && (
                            <Badge variant="default">Renewable</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${scholarship.amount}</p>
                        <p className="text-sm text-muted-foreground">per recipient</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="text-xl font-semibold">{scholarship.applications}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Awarded</p>
                        <p className="text-xl font-semibold text-green-600">{scholarship.awarded}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max Recipients</p>
                        <p className="text-xl font-semibold">{scholarship.maxRecipients}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Budget Used</p>
                        <p className="text-xl font-semibold">${scholarship.used.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className="text-xl font-semibold">${(scholarship.budget - scholarship.used).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Eligibility Requirements</p>
                        <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget Utilization</span>
                          <span>{Math.round((scholarship.used / scholarship.budget) * 100)}%</span>
                        </div>
                        <Progress value={(scholarship.used / scholarship.budget) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Recipients Progress</span>
                          <span>{scholarship.awarded} / {scholarship.maxRecipients}</span>
                        </div>
                        <Progress value={(scholarship.awarded / scholarship.maxRecipients) * 100} className="h-2" />
                      </div>
                    </div>

                     <div className="flex space-x-2">
                       <Button variant="outline" size="sm" onClick={() => handleViewApplications(scholarship.id)}>
                         <Eye className="h-4 w-4 mr-1" />
                         View Applications ({scholarship.applications})
                       </Button>
                       <Button variant="outline" size="sm" onClick={() => handleEditScholarship(scholarship)}>
                         <Edit2 className="h-4 w-4 mr-1" />
                         Edit Details
                       </Button>
                       <Button size="sm">
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

      {/* Modals */}
      <ProgramFeeModal
        isOpen={programFeeModal.isOpen}
        onClose={() => setProgramFeeModal({ isOpen: false, mode: 'add', program: null })}
        onSave={handleSaveProgramFee}
        program={programFeeModal.program}
        title={
          programFeeModal.mode === 'add' 
            ? "Add Program Fee" 
            : programFeeModal.mode === 'edit'
            ? "Edit Program Fee"
            : "Configure Program"
        }
      />

      <PaymentDetailModal
        isOpen={paymentDetailModal.isOpen}
        onClose={() => setPaymentDetailModal({ isOpen: false, payment: null })}
        payment={paymentDetailModal.payment}
        onSendInvoice={handleSendInvoice}
        onSendReminder={handleSendReminder}
        onEditPayment={handleEditPayment}
      />

      <ScholarshipModal
        isOpen={scholarshipModal.isOpen}
        onClose={() => setScholarshipModal({ isOpen: false, mode: 'add', scholarship: null })}
        onSave={handleSaveScholarship}
        scholarship={scholarshipModal.scholarship}
        title={
          scholarshipModal.mode === 'add' 
            ? "Create Scholarship" 
            : "Edit Scholarship"
        }
      />
    </div>
  );
};

export default FinancialManagement;