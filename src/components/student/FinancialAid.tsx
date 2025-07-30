import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ScholarshipApplication from "./ScholarshipApplication";
import { Calculator, DollarSign, GraduationCap, Clock, Award, MapPin } from "lucide-react";
import { usePageEntranceAnimation, useStaggeredReveal, useCountUp } from "@/hooks/useAnimations";

const FinancialAid: React.FC = () => {
  const { toast } = useToast();
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<string>("");
  
  // Animation hooks
  const isLoaded = usePageEntranceAnimation();
  const { visibleItems, ref: staggerRef } = useStaggeredReveal(6, 150);
  const { count: scholarshipAmount, ref: scholarshipRef } = useCountUp(8500, 2000, 0, '$', '');
  
  // BC Student Loan Calculator state
  const [legalStatus, setLegalStatus] = useState<string>("");
  const [programLength, setProgramLength] = useState<string>("");
  const [familyIncome, setFamilyIncome] = useState<number>(0);
  const [dependents, setDependents] = useState<number>(0);
  const [livingArrangement, setLivingArrangement] = useState<string>("");

  const scholarships = [
    {
      id: 1,
      name: "Academic Excellence Scholarship",
      amount: "$2,500",
      deadline: "March 15, 2024",
      requirements: "Minimum 85% average",
      eligible: true
    },
    {
      id: 2,
      name: "Indigenous Student Bursary",
      amount: "$1,500",
      deadline: "April 1, 2024",
      requirements: "Indigenous heritage verification",
      eligible: false
    },
    {
      id: 3,
      name: "Single Parent Support Fund",
      amount: "$1,200",
      deadline: "May 15, 2024",
      requirements: "Single parent with dependents",
      eligible: true
    },
    {
      id: 4,
      name: "Career Transition Grant",
      amount: "$3,000",
      deadline: "June 1, 2024",
      requirements: "Career change documentation",
      eligible: true
    }
  ];

  const paymentPlans = [
    {
      id: "full",
      name: "Full Payment",
      discount: "5% discount",
      amount: "$14,250",
      description: "Pay full tuition upfront",
      dueDate: "September 1, 2024"
    },
    {
      id: "3month",
      name: "3-Month Plan",
      discount: "2% discount",
      amount: "$4,900 x 3",
      description: "Split into 3 monthly payments",
      dueDate: "September 1, October 1, November 1, 2024"
    },
    {
      id: "6month",
      name: "6-Month Plan",
      discount: "No discount",
      amount: "$2,500 x 6",
      description: "Split into 6 monthly payments",
      dueDate: "September 1 - February 1, 2025"
    },
    {
      id: "12month",
      name: "12-Month Plan",
      discount: "2% interest",
      amount: "$1,275 x 12",
      description: "Extended payment plan",
      dueDate: "September 1, 2024 - August 1, 2025"
    }
  ];

  const calculateBCStudentLoan = () => {
    if (!legalStatus || !programLength || !familyIncome || !livingArrangement) {
      return { eligible: false, estimatedAmount: 0 };
    }

    if (legalStatus !== "citizen" && legalStatus !== "permanent") {
      return { eligible: false, estimatedAmount: 0, reason: "Must be Canadian citizen or permanent resident" };
    }

    // Basic calculation based on program length and family income
    let maxLoan = programLength === "6months" ? 8000 : programLength === "12months" ? 15000 : 0;
    let needBasedReduction = Math.max(0, (familyIncome - 25000) * 0.1);
    let estimatedAmount = Math.max(0, maxLoan - needBasedReduction);

    if (livingArrangement === "athome") {
      estimatedAmount *= 0.8; // Reduced amount for living at home
    }

    return { 
      eligible: true, 
      estimatedAmount: Math.round(estimatedAmount),
      maxLoan 
    };
  };

  const loanEligibility = calculateBCStudentLoan();

  const handlePaymentPlanSelect = (planId: string) => {
    setSelectedPaymentPlan(planId);
    const plan = paymentPlans.find(p => p.id === planId);
    toast({
      title: "Payment Plan Selected",
      description: `Your preference for the ${plan?.name} has been communicated to our admissions team.`
    });
  };

  if (selectedScholarship) {
    return (
      <ScholarshipApplication 
        scholarship={selectedScholarship} 
        onBack={() => setSelectedScholarship(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Aid & Scholarships</h1>
        <p className="text-gray-600 mt-2">Explore funding options to make your education more affordable</p>
      </div>

      <Tabs defaultValue="scholarships" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="payment-plans">Payment Plans</TabsTrigger>
          <TabsTrigger value="calculator">Cost Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="scholarships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Available Scholarships
              </CardTitle>
              <CardDescription>
                Scholarships you're eligible for based on your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scholarships.map((scholarship, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{scholarship.name}</h3>
                      <p className="text-2xl font-bold text-green-600">{scholarship.amount}</p>
                    </div>
                    <Badge variant={scholarship.eligible ? "default" : "secondary"}>
                      {scholarship.eligible ? "Eligible" : "Not Eligible"}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Deadline: {scholarship.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                      <span>Requirements: {scholarship.requirements}</span>
                    </div>
                  </div>
                  {scholarship.eligible && (
                    <Button 
                      className="w-full"
                      onClick={() => setSelectedScholarship(scholarship)}
                    >
                      Apply Now
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Plans
              </CardTitle>
              <CardDescription>
                Choose a payment schedule that works for your budget
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {paymentPlans.map((plan, index) => (
                <div key={index} className={`border rounded-lg p-4 space-y-3 ${selectedPaymentPlan === plan.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <Badge variant="outline">{plan.discount}</Badge>
                  </div>
                  <p className="text-2xl font-bold">{plan.amount}</p>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {plan.dueDate}
                    </div>
                  </div>
                  <Button 
                    variant={selectedPaymentPlan === plan.id ? "default" : "outline"} 
                    className="w-full"
                    onClick={() => handlePaymentPlanSelect(plan.id)}
                  >
                    {selectedPaymentPlan === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                BC Student Loan Calculator
              </CardTitle>
              <CardDescription>
                Check your eligibility for BC student loans and estimate funding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="legalStatus">Legal Status in Canada *</Label>
                  <Select value={legalStatus} onValueChange={setLegalStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizen">Canadian Citizen</SelectItem>
                      <SelectItem value="permanent">Permanent Resident</SelectItem>
                      <SelectItem value="protected">Protected Person</SelectItem>
                      <SelectItem value="temporary">Temporary Resident</SelectItem>
                      <SelectItem value="international">International Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="programLength">Program Length *</Label>
                  <Select value={programLength} onValueChange={setProgramLength}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6months">6 months</SelectItem>
                      <SelectItem value="12months">12 months</SelectItem>
                      <SelectItem value="24months">24 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="familyIncome">Family Income (Annual)</Label>
                  <Input
                    id="familyIncome"
                    type="number"
                    value={familyIncome || ""}
                    onChange={(e) => setFamilyIncome(Number(e.target.value))}
                    placeholder="50000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dependents">Number of Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    value={dependents || ""}
                    onChange={(e) => setDependents(Number(e.target.value))}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="livingArrangement">Living Arrangement *</Label>
                <Select value={livingArrangement} onValueChange={setLivingArrangement}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select arrangement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="athome">Living with parents/family</SelectItem>
                    <SelectItem value="away">Living away from home</SelectItem>
                    <SelectItem value="independent">Independent with dependents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loanEligibility.eligible === false && loanEligibility.reason && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Not Eligible</h3>
                  <p className="text-red-800 text-sm">{loanEligibility.reason}</p>
                </div>
              )}

              {loanEligibility.eligible && (
                <div className="bg-green-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-green-900">✅ Estimated Loan Eligibility</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Maximum loan available:</span>
                      <span className="font-medium">${loanEligibility.maxLoan?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated loan amount:</span>
                      <span className="font-medium text-green-600">${loanEligibility.estimatedAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 BC Student Loan Information</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Interest-free while in studies</li>
                  <li>• Repayment starts 6 months after graduation</li>
                  <li>• Apply through StudentAidBC website</li>
                  <li>• Additional grants may be available</li>
                </ul>
              </div>

              <Button className="w-full" disabled={!loanEligibility.eligible}>
                Apply for BC Student Loan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialAid;