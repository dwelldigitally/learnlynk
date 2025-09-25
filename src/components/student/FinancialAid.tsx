import React from "react";
import { DollarSign, Calculator, FileText, Users, GraduationCap, AlertCircle, ArrowRight, Award, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageEntranceAnimation, useStaggeredReveal } from "@/hooks/useAnimations";
import { dummyFinancialAid } from "@/data/studentPortalDummyData";

const FinancialAid: React.FC = () => {
  const isLoaded = usePageEntranceAnimation();
  const { visibleItems, ref: staggerRef } = useStaggeredReveal(6, 150);

  const aidPrograms = [
    {
      title: "Federal Pell Grant",
      amount: "Up to $7,395",
      description: "Need-based aid that doesn't need to be repaid",
      status: "eligible",
      requirements: ["Complete FAFSA", "Demonstrate financial need", "Maintain SAP"]
    },
    {
      title: "State Grant Program",
      amount: "Up to $5,000",
      description: "State-funded assistance for qualifying students",
      status: "pending",
      requirements: ["State residency", "Academic merit", "Income requirements"]
    },
    {
      title: "Merit Scholarship",
      amount: "$3,500",
      description: "Academic achievement-based scholarship",
      status: "awarded",
      requirements: ["3.5+ GPA", "Community service", "Leadership activities"]
    },
    {
      title: "Work-Study Program",
      amount: "$2,000/semester",
      description: "Part-time employment opportunities on campus",
      status: "available",
      requirements: ["FAFSA completion", "Financial need", "Available positions"]
    }
  ];

  const documents = [
    { name: "FAFSA Application", status: "completed", dueDate: "March 1, 2024" },
    { name: "Tax Returns (2023)", status: "submitted", dueDate: "March 15, 2024" },
    { name: "Bank Statements", status: "pending", dueDate: "March 20, 2024" },
    { name: "Verification Worksheet", status: "required", dueDate: "April 1, 2024" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible':
      case 'awarded':
      case 'completed':
      case 'submitted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'available':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'required':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`p-8 max-w-7xl mx-auto space-y-8 ${isLoaded ? 'animate-fade-up' : 'opacity-0'}`}>
      {/* Header */}
      <div className="animate-slide-down">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <DollarSign className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Financial Aid
            </h1>
            <p className="text-muted-foreground">Explore funding options and manage your financial aid applications</p>
          </div>
        </div>
      </div>

      {/* Financial Aid Summary - Enhanced */}
      <div ref={staggerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-10 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Total Aid Awarded</h3>
              <p className="text-3xl font-bold text-green-600 mb-1">$15,895</p>
              <p className="text-sm text-green-700">66% of total cost covered</p>
            </div>
          </div>
        </Card>

        <Card className="p-10 bg-gradient-to-br from-blue-50 to-blue-50 border-blue-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Remaining Cost</h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">$8,105</p>
              <p className="text-sm text-blue-700">Payment plans available</p>
            </div>
          </div>
        </Card>

        <Card className="p-10 bg-gradient-to-br from-purple-50 to-purple-50 border-purple-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">Total Cost</h3>
              <p className="text-3xl font-bold text-purple-600 mb-1">$24,000</p>
              <p className="text-sm text-purple-700">Includes tuition & fees</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Aid Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/student/financial-aid/applications">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Financial Aid Applications</h3>
            <p className="text-muted-foreground text-sm">Manage your aid applications and track progress</p>
          </Card>
        </Link>

        <Link to="/student/financial-aid/calculator">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aid Calculator</h3>
            <p className="text-muted-foreground text-sm">Estimate your financial aid eligibility</p>
          </Card>
        </Link>

        <Link to="/student/financial-aid/documents">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Documents Center</h3>
            <p className="text-muted-foreground text-sm">Upload and manage required documents</p>
          </Card>
        </Link>

        <Link to="/student/financial-aid/awards">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Awards & Disbursements</h3>
            <p className="text-muted-foreground text-sm">View awards and payment schedules</p>
          </Card>
        </Link>

        <Link to="/student/financial-aid/appeals">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Appeals & Special Circumstances</h3>
            <p className="text-muted-foreground text-sm">Submit appeals and special requests</p>
          </Card>
        </Link>

        <Card className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 border-dashed border-2">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-center">Need Help?</h3>
          <p className="text-muted-foreground text-sm text-center">Contact our financial aid office for assistance</p>
          <Button variant="outline" className="w-full mt-4" size="sm">Contact Support</Button>
        </Card>
      </div>

      {/* Aid Programs - Enhanced */}
      <Card className="p-10 bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Available Financial Aid Programs</h2>
        </div>
        <div className="space-y-6">
          {aidPrograms.map((program, index) => (
            <div key={index} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{program.title}</h3>
                    <Badge className={`${getStatusColor(program.status)} border text-xs`}>
                      {program.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{program.description}</p>
                  <div className="text-sm">
                    <span className="font-medium">Requirements: </span>
                    {program.requirements.join(", ")}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{program.amount}</p>
                  {program.status === 'available' && (
                    <Button size="sm" className="mt-2">Apply Now</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Required Documents */}
      <Card className={`p-8 ${visibleItems[4] ? 'animate-stagger-5' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Required Documents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc, index) => (
            <div key={index} className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{doc.name}</h3>
                <Badge className={`${getStatusColor(doc.status)} border text-xs`}>
                  {doc.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Due: {doc.dueDate}</p>
              {doc.status === 'required' && (
                <Button size="sm" variant="outline" className="mt-2">
                  Upload Document
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Action Items */}
      <Card className={`p-8 ${visibleItems[5] ? 'animate-stagger-6' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-semibold">Action Items</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div>
              <h4 className="font-medium">Complete Verification Worksheet</h4>
              <p className="text-sm text-muted-foreground">Required to process your financial aid</p>
            </div>
            <Button size="sm">Complete Now</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <h4 className="font-medium">Schedule Financial Aid Appointment</h4>
              <p className="text-sm text-muted-foreground">Meet with a counselor to discuss your options</p>
            </div>
            <Button size="sm" variant="outline">Schedule</Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions - Updated */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/student/financial-aid/calculator">
          <Button className="h-16 flex flex-col items-center gap-2 w-full">
            <Calculator className="w-5 h-5" />
            Net Price Calculator
          </Button>
        </Link>
        <Button variant="outline" className="h-16 flex flex-col items-center gap-2">
          <Users className="w-5 h-5" />
          Financial Aid Counseling
        </Button>
        <Link to="/student/financial-aid/appeals">
          <Button variant="outline" className="h-16 flex flex-col items-center gap-2 w-full">
            <FileText className="w-5 h-5" />
            Appeal Process
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FinancialAid;