import React, { useState } from "react";
import { CreditCard, FileText, Shield, CheckCircle, DollarSign, Calendar, User, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { studentApplications } from "@/data/studentApplications";
import { useCountUp, usePageEntranceAnimation, useStaggeredReveal } from "@/hooks/useAnimations";
import { dummyFees, dummyStudentProfile } from "@/data/studentPortalDummyData";

const PayYourFee: React.FC = () => {
  const { toast } = useToast();
  const [selectedProgram, setSelectedProgram] = useState("Health Care Assistant");
  const [verifications, setVerifications] = useState({
    contractSigned: false,
    policiesRead: false,
    admissionRequirementsVerified: false
  });

  // Animation hooks
  const isLoaded = usePageEntranceAnimation();
  const { visibleItems, ref: staggerRef } = useStaggeredReveal(3, 200);

  const handleVerificationChange = (field: keyof typeof verifications, checked: boolean) => {
    setVerifications(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const allVerificationsComplete = Object.values(verifications).every(Boolean);

  const handlePayment = () => {
    if (invoiceData.status !== "due") {
      toast({
        title: "Payment Not Available",
        description: "This application is not ready for payment yet. Please complete the previous steps first.",
        variant: "destructive"
      });
      return;
    }

    if (!allVerificationsComplete) {
      toast({
        title: "Verification Required",
        description: "Please complete all verification steps before proceeding with payment.",
        variant: "destructive"
      });
      return;
    }

    // Simulate payment processing
    toast({
      title: "Payment Processing",
      description: "Redirecting to secure payment portal..."
    });

    // Simulate redirect delay
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: `Your application fee for ${selectedProgram} has been processed. You will receive a confirmation email shortly.`
      });
    }, 2000);
  };

  const availablePrograms = Object.keys(studentApplications);
  const currentApplication = studentApplications[selectedProgram];

  const getApplicationFee = (programName: string) => {
    // Different programs have different application fees
    const fees: Record<string, number> = {
      "Health Care Assistant": 250.00,
      "Aviation": 350.00,
      "Education Assistant": 200.00,
      "Hospitality": 225.00,
      "ECE": 275.00,
      "MLA": 300.00
    };
    return fees[programName] || 250.00;
  };

  const invoiceData = {
    invoiceNumber: `INV-2025-${currentApplication.id}`,
    applicationId: currentApplication.id,
    studentId: "WCC1047859",
    studentName: "Tushar Malhotra",
    program: selectedProgram,
    issueDate: new Date("2025-01-18"),
    dueDate: new Date("2025-02-15"),
    amount: getApplicationFee(selectedProgram),
    currency: "CAD",
    status: currentApplication.stage === "FEE_PAYMENT" ? "due" : "pending"
  };

  // Counter animation for fee amount
  const { count: animatedAmount, ref: amountRef } = useCountUp(
    invoiceData.amount, 
    1500, 
    0, 
    '$', 
    ` ${invoiceData.currency}`
  );

  return (
    <div className={`space-y-6 ${isLoaded ? 'animate-fade-up' : 'opacity-0'}`}>
      {/* Header */}
      <div className="animate-slide-down">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <CreditCard className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Application Fee Payment
            </h1>
            <p className="text-muted-foreground">
              Complete your application fee payment to secure your spot
            </p>
          </div>
        </div>
      </div>

      <div ref={staggerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Section */}
        <div className={`lg:col-span-2 space-y-6 ${visibleItems[0] ? 'animate-stagger-1' : 'opacity-0'}`}>
          {/* Invoice Card */}
          <Card className="p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Application Fee Invoice</h2>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Invoice #: {invoiceData.invoiceNumber}</p>
                  <p>Issue Date: {invoiceData.issueDate.toLocaleDateString()}</p>
                  <p>Due Date: {invoiceData.dueDate.toLocaleDateString()}</p>
                </div>
              </div>
              <Badge 
                variant={invoiceData.status === "due" ? "destructive" : "secondary"}
                className={invoiceData.status === "due" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
              >
                {invoiceData.status === "due" ? "Payment Due" : "Not Ready for Payment"}
              </Badge>
            </div>

            {/* Student Information */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2 font-medium">{invoiceData.studentName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Student ID:</span>
                  <span className="ml-2 font-medium">{invoiceData.studentId}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Program:</span>
                  <span className="ml-2 font-medium">{invoiceData.program}</span>
                </div>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="border rounded-lg">
              <div className="p-4 border-b bg-muted/25">
                <h3 className="font-medium">Fee Breakdown</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span>Application Processing Fee - {selectedProgram}</span>
                  <span className="font-medium">${invoiceData.amount.toFixed(2)} {invoiceData.currency}</span>
                </div>
                
                {/* Dynamic fee breakdown based on program */}
                {selectedProgram === "Aviation" ? (
                  <>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>• Flight training assessment</span>
                      <span>$200.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>• Aviation medical clearance</span>
                      <span>$100.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>• Administrative processing</span>
                      <span>$50.00</span>
                    </div>
                  </>
                ) : selectedProgram === "ECE" ? (
                  <>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>• Child welfare check</span>
                      <span>$125.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>• Document review and processing</span>
                      <span>$100.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>• Administrative processing</span>
                      <span>$50.00</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>• Document review and processing</span>
                      <span>$150.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>• Administrative processing</span>
                      <span>$75.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>• Background check coordination</span>
                      <span>$25.00</span>
                    </div>
                  </>
                )}
                
                <hr className="my-3" />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span ref={amountRef} className="text-blue-600 animate-counter">{animatedAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Payment Terms & Conditions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Payment is due within 30 days of invoice date</li>
                <li>• Application fee is non-refundable once submitted</li>
                <li>• Payment confirms your commitment to the program</li>
                <li>• Late payments may result in application processing delays</li>
              </ul>
            </div>
          </Card>

        </div>

        {/* Payment Summary Sidebar */}
        <div className={`space-y-6 ${visibleItems[1] ? 'animate-stagger-2' : 'opacity-0'}`}>
          {/* Program Selection */}
          <Card className="p-4 hover:shadow-md transition-all duration-300">
            <h3 className="font-medium mb-3 text-sm">Select Program</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-sm" size="sm">
                  {selectedProgram}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="end">
                <div className="p-3">
                  <h4 className="font-medium mb-3 text-sm">Your Applications</h4>
                  <div className="space-y-2">
                    {availablePrograms.map((program) => {
                      const app = studentApplications[program];
                      return (
                        <div
                          key={program}
                          onClick={() => setSelectedProgram(program)}
                          className="p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{program}</p>
                              <p className="text-xs text-muted-foreground">ID: {app.id}</p>
                              <Badge 
                                variant={app.stage === "FEE_PAYMENT" ? "default" : "secondary"}
                                className="mt-1 text-xs"
                              >
                                {app.stage === "FEE_PAYMENT" ? "Payment Due" : "Not Ready"}
                              </Badge>
                            </div>
                            <span className="text-xs font-medium">
                              ${getApplicationFee(program)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Card>

          {/* Verification Requirements */}
          <Card className="p-4 hover:shadow-md transition-all duration-300">
            <h3 className="font-medium mb-3 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Pre-Payment Verification
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Please confirm completion of these steps:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-2 p-2 border rounded hover:bg-muted/25 transition-colors">
                <Checkbox
                  id="contract"
                  checked={verifications.contractSigned}
                  onCheckedChange={(checked) => handleVerificationChange('contractSigned', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="contract" className="text-sm font-medium cursor-pointer">
                    Student Contract Signed
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enrollment contract electronically signed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 border rounded hover:bg-muted/25 transition-colors">
                <Checkbox
                  id="policies"
                  checked={verifications.policiesRead}
                  onCheckedChange={(checked) => handleVerificationChange('policiesRead', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="policies" className="text-sm font-medium cursor-pointer">
                    Policies Reviewed
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    College policies and procedures reviewed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 border rounded hover:bg-muted/25 transition-colors">
                <Checkbox
                  id="requirements"
                  checked={verifications.admissionRequirementsVerified}
                  onCheckedChange={(checked) => handleVerificationChange('admissionRequirementsVerified', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="requirements" className="text-sm font-medium cursor-pointer">
                    Requirements Verified
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    All admission requirements met
                  </p>
                </div>
              </div>
            </div>

            {allVerificationsComplete && (
              <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded animate-bounce-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 animate-scale-in" />
                  <span className="text-sm font-medium text-green-800">All verified!</span>
                </div>
              </div>
            )}
          </Card>

          {/* Payment Summary */}
          <Card className={`p-6 hover:shadow-md transition-all duration-300 ${visibleItems[2] ? 'animate-stagger-3' : 'opacity-0'}`}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application Fee</span>
                <span className="font-medium">${invoiceData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">$0.00</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-blue-600">${invoiceData.amount.toFixed(2)} {invoiceData.currency}</span>
              </div>
            </div>

            <Button 
              className="w-full transition-colors duration-200" 
              size="lg"
              onClick={handlePayment}
              disabled={!allVerificationsComplete || invoiceData.status !== "due"}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>

            {(!allVerificationsComplete || invoiceData.status !== "due") && (
              <p className="text-sm text-muted-foreground text-center mt-3">
                {invoiceData.status !== "due" 
                  ? "Application not ready for payment yet" 
                  : "Complete all verifications to enable payment"
                }
              </p>
            )}
          </Card>

          {/* Payment Security */}
          <Card className="p-6">
            <h4 className="font-medium mb-3">Secure Payment</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-600" />
                <span>PCI DSS compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Secure payment processing</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                We accept Visa, Mastercard, American Express, and Discover. Your payment information is never stored on our servers.
              </p>
            </div>
          </Card>

          {/* Support Contact */}
          <Card className="p-6">
            <h4 className="font-medium mb-3">Need Help?</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-2">(604) 594-3500</span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2">finance@wcc.ca</span>
              </p>
              <p>
                <span className="text-muted-foreground">Hours:</span>
                <span className="ml-2">Mon-Fri 9AM-5PM PST</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PayYourFee;