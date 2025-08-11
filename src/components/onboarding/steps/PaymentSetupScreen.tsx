import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  DollarSign, 
  Shield, 
  Check, 
  ExternalLink,
  AlertCircle,
  Lock,
  Zap
} from 'lucide-react';

interface PaymentSetupScreenProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

interface PaymentConfig {
  stripeConnected: boolean;
  stripeAccountId: string;
  acceptApplicationFees: boolean;
  acceptTuitionPayments: boolean;
  acceptDonations: boolean;
  enablePaymentPlans: boolean;
  enableScholarships: boolean;
  enableRefunds: boolean;
  defaultCurrency: string;
  applicationFeeAmount: string;
  processingFeeHandling: 'absorb' | 'pass_to_customer';
}

const PaymentSetupScreen: React.FC<PaymentSetupScreenProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [config, setConfig] = useState<PaymentConfig>({
    stripeConnected: data?.stripeConnected || false,
    stripeAccountId: data?.stripeAccountId || '',
    acceptApplicationFees: data?.acceptApplicationFees ?? true,
    acceptTuitionPayments: data?.acceptTuitionPayments ?? true,
    acceptDonations: data?.acceptDonations ?? false,
    enablePaymentPlans: data?.enablePaymentPlans ?? true,
    enableScholarships: data?.enableScholarships ?? false,
    enableRefunds: data?.enableRefunds ?? true,
    defaultCurrency: data?.defaultCurrency || 'USD',
    applicationFeeAmount: data?.applicationFeeAmount || '100',
    processingFeeHandling: data?.processingFeeHandling || 'absorb'
  });

  const handleConfigChange = (field: keyof PaymentConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleStripeConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate Stripe Connect flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      handleConfigChange('stripeConnected', true);
      handleConfigChange('stripeAccountId', 'acct_mock_stripe_account_123');
      
      toast({
        title: "Stripe Connected Successfully!",
        description: "Your payment processing is now ready to accept payments.",
      });
      
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Stripe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleComplete = () => {
    onComplete(config);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Stripe Connection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-primary" />
            Stripe Payment Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!config.stripeConnected ? (
            <>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Secure Payment Processing</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Connect your Stripe account to securely process application fees, tuition payments, and more. 
                    Stripe handles all PCI compliance and security requirements.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">What you'll get:</h4>
                  <div className="space-y-2">
                    {[
                      'Secure credit card processing',
                      'Bank transfer (ACH) payments',
                      'Automated payment plans',
                      'Refund management',
                      'Real-time payment analytics',
                      'PCI compliance included'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-2 text-success" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Stripe Features:</h4>
                  <div className="space-y-2">
                    {[
                      'Industry-leading security',
                      'Global payment methods',
                      'Instant payouts available',
                      'Detailed reporting',
                      'Mobile-optimized checkout',
                      '24/7 fraud monitoring'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Shield className="w-4 h-4 mr-2 text-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={handleStripeConnect} 
                  disabled={isConnecting}
                  className="bg-[#635BFF] hover:bg-[#5851F7] text-white"
                >
                  {isConnecting ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Connecting to Stripe...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Connect Stripe Account
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://stripe.com/pricing" target="_blank" rel="noopener noreferrer">
                    View Stripe Pricing
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                By connecting Stripe, you agree to Stripe's{' '}
                <a href="https://stripe.com/legal" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                <Check className="w-5 h-5 text-success" />
                <div>
                  <h4 className="font-medium text-success">Stripe Connected Successfully</h4>
                  <p className="text-sm text-muted-foreground">
                    Account ID: {config.stripeAccountId}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Configuration */}
      {config.stripeConnected && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-success" />
                Payment Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground font-medium">Application Fees</Label>
                    <p className="text-sm text-muted-foreground">Accept payment for application processing</p>
                  </div>
                  <Switch
                    checked={config.acceptApplicationFees}
                    onCheckedChange={(checked) => handleConfigChange('acceptApplicationFees', checked)}
                  />
                </div>

                {config.acceptApplicationFees && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="applicationFeeAmount" className="text-sm">
                      Default Application Fee
                    </Label>
                    <div className="flex items-center space-x-2 max-w-xs">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        id="applicationFeeAmount"
                        type="number"
                        value={config.applicationFeeAmount}
                        onChange={(e) => handleConfigChange('applicationFeeAmount', e.target.value)}
                        placeholder="100"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground font-medium">Tuition Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept tuition and course fees</p>
                  </div>
                  <Switch
                    checked={config.acceptTuitionPayments}
                    onCheckedChange={(checked) => handleConfigChange('acceptTuitionPayments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground font-medium">Donations</Label>
                    <p className="text-sm text-muted-foreground">Accept donations and contributions</p>
                  </div>
                  <Switch
                    checked={config.acceptDonations}
                    onCheckedChange={(checked) => handleConfigChange('acceptDonations', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-accent" />
                Advanced Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground font-medium">Payment Plans</Label>
                    <p className="text-sm text-muted-foreground">Allow students to pay in installments</p>
                  </div>
                  <Switch
                    checked={config.enablePaymentPlans}
                    onCheckedChange={(checked) => handleConfigChange('enablePaymentPlans', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground font-medium">Scholarship Management</Label>
                    <p className="text-sm text-muted-foreground">Handle scholarship awards and discounts</p>
                  </div>
                  <Switch
                    checked={config.enableScholarships}
                    onCheckedChange={(checked) => handleConfigChange('enableScholarships', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground font-medium">Refund Processing</Label>
                    <p className="text-sm text-muted-foreground">Enable automated refund management</p>
                  </div>
                  <Switch
                    checked={config.enableRefunds}
                    onCheckedChange={(checked) => handleConfigChange('enableRefunds', checked)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Default Currency</Label>
                  <select
                    value={config.defaultCurrency}
                    onChange={(e) => handleConfigChange('defaultCurrency', e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Processing Fees</Label>
                  <select
                    value={config.processingFeeHandling}
                    onChange={(e) => handleConfigChange('processingFeeHandling', e.target.value as 'absorb' | 'pass_to_customer')}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="absorb">Institution absorbs fees</option>
                    <option value="pass_to_customer">Pass fees to customer</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Warning for skipping */}
      {!config.stripeConnected && (
        <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900 dark:text-amber-100">Payment Processing Required</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Without payment processing, you won't be able to collect application fees or tuition payments. 
              You can set this up later in the admin panel.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onSkip} className="glass-button">
          {config.stripeConnected ? 'Skip Advanced Setup' : 'Skip Payment Setup'}
        </Button>
        <Button 
          onClick={handleComplete}
          className="bg-primary hover:bg-primary-hover"
        >
          {config.stripeConnected ? 'Save Configuration' : 'Continue Without Payments'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentSetupScreen;