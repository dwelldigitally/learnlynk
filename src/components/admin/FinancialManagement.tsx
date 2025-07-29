import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Download
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FinancialManagement: React.FC = () => {
  const financialStats = [
    { title: "Total Revenue", amount: "$2,450,000", change: "+12%", icon: DollarSign, color: "text-green-600" },
    { title: "Outstanding Payments", amount: "$156,750", change: "-8%", icon: AlertTriangle, color: "text-orange-600" },
    { title: "Processed Today", amount: "$23,400", change: "+15%", icon: CheckCircle, color: "text-blue-600" },
    { title: "Pending Approval", amount: "$45,200", change: "+5%", icon: Clock, color: "text-purple-600" },
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
      eligibility: "GPA 3.8+",
      applications: 45,
      awarded: 12,
      budget: 30000,
      used: 30000
    },
    {
      id: "2",
      name: "Need-Based Grant", 
      amount: 1500,
      description: "Financial assistance for students with demonstrated need",
      eligibility: "Financial need assessment",
      applications: 78,
      awarded: 35,
      budget: 75000,
      used: 52500
    },
    {
      id: "3",
      name: "Industry Partnership",
      amount: 3000,
      description: "Sponsored by healthcare industry partners",
      eligibility: "HCA program students",
      applications: 23,
      awarded: 8,
      budget: 24000,
      used: 24000
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Management</h1>
          <p className="text-muted-foreground">Manage payments, scholarships, and financial aid</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
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
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
          <TabsTrigger value="plans">Payment Plans</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue by Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { program: "Health Care Assistant", revenue: 890000, target: 950000 },
                  { program: "Early Childhood Education", revenue: 645000, target: 700000 },
                  { program: "Aviation Maintenance", revenue: 567000, target: 600000 },
                  { program: "Education Assistant", revenue: 348000, target: 400000 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.program}</span>
                      <span className="text-sm text-muted-foreground">
                        ${item.revenue.toLocaleString()} / ${item.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(item.revenue / item.target) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Outstanding Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Outstanding Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { student: "John Smith", amount: 2500, daysOverdue: 15, program: "HCA" },
                  { student: "Maria Garcia", amount: 1800, daysOverdue: 7, program: "ECE" },
                  { student: "David Lee", amount: 3200, daysOverdue: 23, program: "Aviation" },
                  { student: "Sarah Wilson", amount: 1500, daysOverdue: 3, program: "Education" }
                ].map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.student}</p>
                      <p className="text-sm text-muted-foreground">{payment.program} • ${payment.amount}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={payment.daysOverdue > 14 ? 'destructive' : payment.daysOverdue > 7 ? 'secondary' : 'outline'}>
                        {payment.daysOverdue} days
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Payment Plans Configuration</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentPlans.map((plan) => (
                  <div key={plan.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Installments</p>
                        <p className="font-medium">{plan.installments}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Discount/Fee</p>
                        <p className={`font-medium ${plan.discount > 0 ? 'text-green-600' : plan.discount < 0 ? 'text-red-600' : ''}`}>
                          {plan.discount > 0 ? '+' : ''}{plan.discount}%
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        {plan.isActive ? 'Deactivate' : 'Activate'}
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
                <Button>
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
                        <p className="text-sm text-muted-foreground mt-1">
                          Eligibility: {scholarship.eligibility}
                        </p>
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
                        <p className="text-sm text-muted-foreground">Budget Used</p>
                        <p className="text-xl font-semibold">${scholarship.used.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className="text-xl font-semibold">${(scholarship.budget - scholarship.used).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget Utilization</span>
                        <span>{Math.round((scholarship.used / scholarship.budget) * 100)}%</span>
                      </div>
                      <Progress value={(scholarship.used / scholarship.budget) * 100} className="h-2" />
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View Applications</Button>
                      <Button variant="outline" size="sm">Edit Scholarship</Button>
                      <Button variant="outline" size="sm">Award Scholarship</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Generate and download comprehensive financial reports and analytics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;