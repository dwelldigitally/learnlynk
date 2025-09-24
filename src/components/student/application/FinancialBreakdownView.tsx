import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Calendar, 
  CreditCard, 
  PiggyBank, 
  Award,
  Calculator,
  TrendingUp,
  FileText,
  CheckCircle
} from "lucide-react";
import { PROGRAM_DETAILS, StandardizedProgram } from "@/constants/programs";

interface FinancialBreakdownViewProps {
  program: StandardizedProgram;
  onContinue: () => void;
  onBack: () => void;
}

const FinancialBreakdownView: React.FC<FinancialBreakdownViewProps> = ({
  program,
  onContinue,
  onBack
}) => {
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<string>('full');
  const details = PROGRAM_DETAILS[program];

  // Financial breakdown data
  const financialData = {
    tuition: details.tuition,
    applicationFee: 150,
    materialsFee: 500,
    labFee: program === 'Aviation' || program === 'MLA' ? 750 : 300,
    total: 0
  };

  financialData.total = financialData.tuition + financialData.applicationFee + financialData.materialsFee + financialData.labFee;

  const paymentPlans = [
    {
      id: 'full',
      name: 'Full Payment',
      description: 'Pay the entire amount upfront',
      discount: 0.05,
      schedule: [
        { phase: 'At Enrollment', amount: financialData.total * 0.95, dueDate: 'Upon Acceptance' }
      ]
    },
    {
      id: 'semester',
      name: 'Semester Plan',
      description: 'Split payments by semester',
      discount: 0.02,
      schedule: [
        { phase: 'First Semester', amount: financialData.total * 0.98 * 0.6, dueDate: 'Before Classes Start' },
        { phase: 'Second Semester', amount: financialData.total * 0.98 * 0.4, dueDate: 'Mid-Program' }
      ]
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      description: 'Monthly installments throughout the program',
      discount: 0,
      schedule: Array.from({ length: parseInt(details.duration) }, (_, i) => ({
        phase: `Month ${i + 1}`,
        amount: financialData.total / parseInt(details.duration),
        dueDate: `Month ${i + 1} of Program`
      }))
    }
  ];

  const scholarships = [
    {
      name: 'Academic Excellence',
      amount: 2500,
      type: 'Merit-based',
      eligibility: 'GPA 3.5+ or equivalent'
    },
    {
      name: 'Community Service',
      amount: 1500,
      type: 'Service-based',
      eligibility: '100+ volunteer hours'
    },
    {
      name: 'Early Bird',
      amount: 1000,
      type: 'Timeline-based',
      eligibility: 'Apply 3 months in advance'
    },
    {
      name: 'Indigenous Students',
      amount: 3000,
      type: 'Cultural',
      eligibility: 'Indigenous heritage verification'
    }
  ];

  const selectedPlan = paymentPlans.find(plan => plan.id === selectedPaymentPlan);
  const totalWithDiscount = selectedPlan ? financialData.total * (1 - selectedPlan.discount) : financialData.total;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-primary" onClick={onBack}>Program Details</span>
          <span>/</span>
          <span>Financial Information</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Financial Breakdown</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Understand all costs and explore payment options for {program}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Total Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">Tuition</div>
                    <div className="text-sm text-muted-foreground">Core program fees</div>
                  </div>
                  <div className="text-xl font-bold">${financialData.tuition.toLocaleString()}</div>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Application Fee</div>
                    <div className="text-sm text-muted-foreground">One-time processing fee</div>
                  </div>
                  <div className="font-medium">${financialData.applicationFee}</div>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Materials & Books</div>
                    <div className="text-sm text-muted-foreground">Textbooks and supplies</div>
                  </div>
                  <div className="font-medium">${financialData.materialsFee}</div>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Lab & Equipment Fee</div>
                    <div className="text-sm text-muted-foreground">Specialized equipment access</div>
                  </div>
                  <div className="font-medium">${financialData.labFee}</div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                  <div>
                    <div className="font-bold text-lg">Total Program Cost</div>
                    <div className="text-sm text-muted-foreground">All fees included</div>
                  </div>
                  <div className="text-2xl font-bold text-primary">${financialData.total.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedPaymentPlan} onValueChange={setSelectedPaymentPlan}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="full">Full Payment</TabsTrigger>
                  <TabsTrigger value="semester">Semester Plan</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Plan</TabsTrigger>
                </TabsList>
                
                {paymentPlans.map((plan) => (
                  <TabsContent key={plan.id} value={plan.id} className="space-y-6">
                    <div className="p-6 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{plan.name}</h3>
                          <p className="text-muted-foreground">{plan.description}</p>
                        </div>
                        {plan.discount > 0 && (
                          <Badge className="bg-green-100 text-green-800">
                            Save {(plan.discount * 100)}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid gap-4">
                        {plan.schedule.map((payment, index) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-background border rounded-lg">
                            <div>
                              <div className="font-medium">{payment.phase}</div>
                              <div className="text-sm text-muted-foreground">{payment.dueDate}</div>
                            </div>
                            <div className="text-lg font-bold">${payment.amount.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total with {plan.name}:</span>
                          <span className="text-xl font-bold text-primary">
                            ${(financialData.total * (1 - plan.discount)).toLocaleString()}
                          </span>
                        </div>
                        {plan.discount > 0 && (
                          <div className="text-sm text-green-600 mt-1">
                            You save ${(financialData.total * plan.discount).toLocaleString()}!
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* ROI Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Return on Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Investment Recovery</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">2.1 years</div>
                  <div className="text-sm text-green-700">Average time to recover investment</div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Career Growth</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">15-25%</div>
                  <div className="text-sm text-blue-700">Annual salary increase potential</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Cost:</span>
                  <span className="font-medium">${financialData.total.toLocaleString()}</span>
                </div>
                {selectedPlan?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${(financialData.total * selectedPlan.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Your Total:</span>
                    <span className="text-primary">${totalWithDiscount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Scholarships */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5" />
                Scholarships Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scholarships.map((scholarship, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-sm">{scholarship.name}</div>
                      <Badge variant="outline" className="text-xs">${scholarship.amount}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">{scholarship.type}</div>
                    <div className="text-xs">{scholarship.eligibility}</div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Apply for Scholarships
              </Button>
            </CardContent>
          </Card>

          {/* Financial Aid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Assistance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Government student loans available</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Work-study programs offered</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Payment plan options available</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Financial counseling support</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <Button 
            onClick={onContinue} 
            className="w-full py-6 text-lg"
            size="lg"
          >
            Continue to Requirements
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancialBreakdownView;