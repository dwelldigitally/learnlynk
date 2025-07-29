import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, DollarSign, GraduationCap, Clock, Award } from "lucide-react";

const FinancialAid: React.FC = () => {
  const [tuitionCost, setTuitionCost] = useState<number>(15000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(3000);

  const scholarships = [
    {
      name: "Academic Excellence Scholarship",
      amount: "$2,500",
      deadline: "March 15, 2024",
      requirements: "Minimum 85% average",
      eligible: true
    },
    {
      name: "Indigenous Student Bursary",
      amount: "$1,500",
      deadline: "April 1, 2024",
      requirements: "Indigenous heritage verification",
      eligible: false
    },
    {
      name: "Single Parent Support Fund",
      amount: "$1,200",
      deadline: "May 15, 2024",
      requirements: "Single parent with dependents",
      eligible: true
    },
    {
      name: "Career Transition Grant",
      amount: "$3,000",
      deadline: "June 1, 2024",
      requirements: "Career change documentation",
      eligible: true
    }
  ];

  const paymentPlans = [
    {
      name: "Full Payment",
      discount: "5% discount",
      amount: `$${(tuitionCost * 0.95).toLocaleString()}`,
      description: "Pay full tuition upfront"
    },
    {
      name: "3-Month Plan",
      discount: "2% discount",
      amount: `$${((tuitionCost * 0.98) / 3).toLocaleString()} x 3`,
      description: "Split into 3 monthly payments"
    },
    {
      name: "6-Month Plan",
      discount: "No discount",
      amount: `$${(tuitionCost / 6).toLocaleString()} x 6`,
      description: "Split into 6 monthly payments"
    },
    {
      name: "12-Month Plan",
      discount: "2% interest",
      amount: `$${((tuitionCost * 1.02) / 12).toLocaleString()} x 12`,
      description: "Extended payment plan"
    }
  ];

  const calculateAffordability = () => {
    const monthlyPayment = tuitionCost / 12;
    const percentage = (monthlyPayment / monthlyIncome) * 100;
    
    if (percentage <= 20) return { status: "Great", color: "bg-green-500", text: "Highly affordable" };
    if (percentage <= 35) return { status: "Good", color: "bg-yellow-500", text: "Manageable" };
    return { status: "Challenging", color: "bg-red-500", text: "Consider financial aid" };
  };

  const affordability = calculateAffordability();

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
                    <Button className="w-full">Apply Now</Button>
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
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <Badge variant="outline">{plan.discount}</Badge>
                  </div>
                  <p className="text-2xl font-bold">{plan.amount}</p>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <Button variant="outline" className="w-full">Select Plan</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Affordability Calculator
              </CardTitle>
              <CardDescription>
                Calculate if your chosen program fits your budget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tuition">Total Program Cost</Label>
                  <Input
                    id="tuition"
                    type="number"
                    value={tuitionCost}
                    onChange={(e) => setTuitionCost(Number(e.target.value))}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income</Label>
                  <Input
                    id="income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    placeholder="3000"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold">Affordability Assessment</h3>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${affordability.color}`}></div>
                  <span className="font-medium">{affordability.status}</span>
                  <span className="text-gray-600">- {affordability.text}</span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly payment (12-month plan):</span>
                    <span className="font-medium">${(tuitionCost / 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Percentage of income:</span>
                    <span className="font-medium">{((tuitionCost / 12 / monthlyIncome) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Financial Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Apply for multiple scholarships to maximize funding</li>
                  <li>• Consider part-time work during studies</li>
                  <li>• Explore government student loans and grants</li>
                  <li>• Budget for additional costs like books and supplies</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialAid;