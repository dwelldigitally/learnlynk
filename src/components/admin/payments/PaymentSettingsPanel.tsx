import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, DollarSign, CreditCard } from 'lucide-react';
import { SUPPORTED_CURRENCIES, Currency } from '@/utils/currency';

export const PaymentSettingsPanel = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Currency Settings</CardTitle>
          <CardDescription>Supported currencies for payment processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Supported Currencies</Label>
              <div className="flex gap-2 mt-2">
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <Badge key={currency} variant="secondary" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {currency}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              These currencies are available for invoice and payment processing
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Types</CardTitle>
          <CardDescription>Common payment categories used in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Tuition', 'Application Fee', 'Deposit', 'Materials Fee', 'Lab Fee'].map((type) => (
              <div key={type} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm font-medium text-foreground">{type}</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Integration Status</CardTitle>
          <CardDescription>Current payment processing configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Stripe Integration</p>
                <p className="text-xs text-muted-foreground">
                  Payment processing is available via Stripe
                </p>
              </div>
              <Badge className="ml-auto bg-green-100 text-green-800 border-green-200">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Terms</CardTitle>
          <CardDescription>Default payment terms and conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Default Due Date</span>
              <span className="font-medium text-foreground">30 days from invoice date</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Payment Methods</span>
              <span className="font-medium text-foreground">Credit Card, Bank Transfer</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Late Payment Grace Period</span>
              <span className="font-medium text-foreground">7 days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
