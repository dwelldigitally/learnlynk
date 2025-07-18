import React, { useState } from "react";
import { CreditCard, FileText, Shield, CheckCircle, DollarSign, Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const PayYourFee: React.FC = () => {
  const { toast } = useToast();
  const [verifications, setVerifications] = useState({
    contractSigned: false,
    policiesRead: false,
    admissionRequirementsVerified: false
  });

  const handleVerificationChange = (field: keyof typeof verifications, checked: boolean) => {
    setVerifications(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const allVerificationsComplete = Object.values(verifications).every(Boolean);

  const handlePayment = () => {
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
        description: "Your application fee has been processed. You will receive a confirmation email shortly."
      });
    }, 2000);
  };

  const invoiceData = {
    invoiceNumber: "INV-2025-001247",
    studentId: "WCC1047859",
    studentName: "Tushar Malhotra",
    program: "Health Care Assistant",
    issueDate: new Date("2025-01-18"),
    dueDate: new Date("2025-02-15"),
    amount: 250.00,
    currency: "CAD"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Pay Your Fee</h1>
        <p className="text-muted-foreground">Complete your application fee payment to secure your spot</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Card */}
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Application Fee Invoice</h2>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Invoice #: {invoiceData.invoiceNumber}</p>
                  <p>Issue Date: {invoiceData.issueDate.toLocaleDateString()}</p>
                  <p>Due Date: {invoiceData.dueDate.toLocaleDateString()}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Payment Due
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
                  <span>Application Processing Fee</span>
                  <span className="font-medium">${invoiceData.amount.toFixed(2)} {invoiceData.currency}</span>
                </div>
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
                <hr className="my-3" />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">${invoiceData.amount.toFixed(2)} {invoiceData.currency}</span>
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

          {/* Verification Requirements */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Pre-Payment Verification
            </h3>
            <p className="text-muted-foreground mb-6">
              Please confirm that you have completed the following steps before proceeding with payment:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/25 transition-colors">
                <Checkbox
                  id="contract"
                  checked={verifications.contractSigned}
                  onCheckedChange={(checked) => handleVerificationChange('contractSigned', checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="contract" className="font-medium cursor-pointer">
                    Student Contract Signed
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I have read, understood, and electronically signed the student enrollment contract.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                    View Contract Document
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/25 transition-colors">
                <Checkbox
                  id="policies"
                  checked={verifications.policiesRead}
                  onCheckedChange={(checked) => handleVerificationChange('policiesRead', checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="policies" className="font-medium cursor-pointer">
                    Policies and Procedures Reviewed
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I have read and agree to abide by all college policies, procedures, and academic standards.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                    View Policies Document
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/25 transition-colors">
                <Checkbox
                  id="requirements"
                  checked={verifications.admissionRequirementsVerified}
                  onCheckedChange={(checked) => handleVerificationChange('admissionRequirementsVerified', checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="requirements" className="font-medium cursor-pointer">
                    Admission Requirements Verified
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I confirm that all required documents have been submitted and all admission requirements have been met.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                    Review Requirements Checklist
                  </Button>
                </div>
              </div>
            </div>

            {allVerificationsComplete && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">All verifications complete!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  You can now proceed with your payment.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="p-6">
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
              className="w-full" 
              size="lg"
              onClick={handlePayment}
              disabled={!allVerificationsComplete}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>

            {!allVerificationsComplete && (
              <p className="text-sm text-muted-foreground text-center mt-3">
                Complete all verifications to enable payment
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