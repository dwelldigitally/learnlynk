import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentData {
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'paypal' | 'scholarship_waiver';
  amount?: number;
  currency?: string;
  paymentCompleted?: boolean;
  transactionId?: string;
  paymentDate?: Date;
  cardDetails?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
  };
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  scholarshipInfo?: {
    scholarshipType?: string;
    referenceNumber?: string;
    approvedAmount?: number;
  };
  termsAccepted?: boolean;
}

interface PaymentStepProps {
  data: PaymentData;
  onUpdate: (data: PaymentData) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState<PaymentData>({
    amount: 150, // Default application fee
    currency: 'USD',
    paymentCompleted: false,
    termsAccepted: false,
    ...data
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof PaymentData] as object,
        [field]: value
      }
    }));
  };

  const handlePayment = async () => {
    if (!formData.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to proceed with payment.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setFormData(prev => ({
        ...prev,
        paymentCompleted: true,
        transactionId,
        paymentDate: new Date()
      }));

      toast({
        title: "Payment Successful!",
        description: `Your application fee has been processed. Transaction ID: ${transactionId}`
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (formData.paymentCompleted) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="text-lg font-semibold text-green-900">Payment Completed Successfully!</h4>
              <p className="text-green-700">Your application fee has been processed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-sm font-medium text-green-800">Transaction ID</Label>
              <p className="text-sm text-green-700 font-mono">{formData.transactionId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-green-800">Amount Paid</Label>
              <p className="text-sm text-green-700">
                {formatAmount(formData.amount || 0, formData.currency || 'USD')}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-green-800">Payment Date</Label>
              <p className="text-sm text-green-700">
                {formData.paymentDate?.toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-green-800">Payment Method</Label>
              <p className="text-sm text-green-700 capitalize">
                {formData.paymentMethod?.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Next Steps:</strong> Your application is now ready for final review and submission. 
              Please proceed to the review step to complete your application.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-6 h-6 text-primary" />
          <h4 className="text-lg font-semibold">Application Fee Payment</h4>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">Application Processing Fee</p>
            <p className="text-2xl font-bold text-primary">
              {formatAmount(formData.amount || 0, formData.currency || 'USD')}
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 text-sm">
            One-time payment
          </Badge>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            This fee covers the processing and review of your application. 
            Payment is required to complete your application submission.
          </p>
        </div>
      </Card>

      {/* Payment Method Selection */}
      <Card className="p-6">
        <h5 className="text-lg font-semibold mb-4">Select Payment Method</h5>
        
        <RadioGroup
          value={formData.paymentMethod || ''}
          onValueChange={(value) => updateField('paymentMethod', value)}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="w-4 h-4" />
                Credit/Debit Card
                <Badge variant="outline" className="ml-auto">Instant</Badge>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-4 h-4 bg-blue-600 rounded-full" />
                PayPal
                <Badge variant="outline" className="ml-auto">Instant</Badge>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="bank_transfer" id="bank_transfer" />
              <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-4 h-4 bg-green-600 rounded" />
                Bank Transfer
                <Badge variant="outline" className="ml-auto">1-3 days</Badge>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="scholarship_waiver" id="scholarship_waiver" />
              <Label htmlFor="scholarship_waiver" className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="w-4 h-4 bg-yellow-600 rounded" />
                Scholarship/Fee Waiver
                <Badge variant="outline" className="ml-auto">Requires approval</Badge>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </Card>

      {/* Payment Details based on selected method */}
      {formData.paymentMethod === 'credit_card' && (
        <Card className="p-6">
          <h5 className="text-lg font-semibold mb-4">Card Information</h5>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardholderName">Cardholder Name *</Label>
              <Input
                id="cardholderName"
                value={formData.cardDetails?.cardholderName || ''}
                onChange={(e) => updateNestedField('cardDetails', 'cardholderName', e.target.value)}
                placeholder="Enter cardholder name"
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={formData.cardDetails?.cardNumber || ''}
                onChange={(e) => updateNestedField('cardDetails', 'cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  value={formData.cardDetails?.expiryDate || ''}
                  onChange={(e) => updateNestedField('cardDetails', 'expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={formData.cardDetails?.cvv || ''}
                  onChange={(e) => updateNestedField('cardDetails', 'cvv', e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {formData.paymentMethod === 'scholarship_waiver' && (
        <Card className="p-6">
          <h5 className="text-lg font-semibold mb-4">Scholarship/Fee Waiver Information</h5>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="scholarshipType">Scholarship Type *</Label>
              <Select 
                value={formData.scholarshipInfo?.scholarshipType || ''} 
                onValueChange={(value) => updateNestedField('scholarshipInfo', 'scholarshipType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scholarship type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merit">Merit-based Scholarship</SelectItem>
                  <SelectItem value="need">Need-based Financial Aid</SelectItem>
                  <SelectItem value="fee_waiver">Application Fee Waiver</SelectItem>
                  <SelectItem value="partner">Partner Institution Discount</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input
                id="referenceNumber"
                value={formData.scholarshipInfo?.referenceNumber || ''}
                onChange={(e) => updateNestedField('scholarshipInfo', 'referenceNumber', e.target.value)}
                placeholder="Enter scholarship reference number"
              />
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Fee waivers and scholarships require administrative approval. 
                  You may proceed with your application, but payment verification may take 1-3 business days.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Billing Address (for card payments) */}
      {formData.paymentMethod === 'credit_card' && (
        <Card className="p-6">
          <h5 className="text-lg font-semibold mb-4">Billing Address</h5>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={formData.billingAddress?.street || ''}
                onChange={(e) => updateNestedField('billingAddress', 'street', e.target.value)}
                placeholder="Enter street address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.billingAddress?.city || ''}
                  onChange={(e) => updateNestedField('billingAddress', 'city', e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={formData.billingAddress?.state || ''}
                  onChange={(e) => updateNestedField('billingAddress', 'state', e.target.value)}
                  placeholder="Enter state/province"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.billingAddress?.zipCode || ''}
                  onChange={(e) => updateNestedField('billingAddress', 'zipCode', e.target.value)}
                  placeholder="Enter ZIP/postal code"
                  required
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Terms and Conditions */}
      <Card className="p-6">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => updateField('termsAccepted', checked)}
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-primary underline">payment terms and conditions</a>
            {' '}and understand that application fees are non-refundable. 
            I authorize the processing of this payment for my application.
          </Label>
        </div>
      </Card>

      {/* Security Notice */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-green-600" />
          <h6 className="font-semibold text-green-900">Secure Payment Processing</h6>
        </div>
        <p className="text-sm text-green-800">
          Your payment information is encrypted and processed securely. 
          We use industry-standard security measures to protect your financial data.
        </p>
      </Card>

      {/* Payment Button */}
      <Card className="p-6">
        <Button
          onClick={handlePayment}
          disabled={!formData.paymentMethod || !formData.termsAccepted || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pay {formatAmount(formData.amount || 0, formData.currency || 'USD')}
            </div>
          )}
        </Button>
      </Card>
    </div>
  );
};

export default PaymentStep;