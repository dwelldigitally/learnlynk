import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PaymentSetupScreen from '@/components/onboarding/steps/PaymentSetupScreen';
// import IntegrationsSetupScreen from '@/components/onboarding/steps/IntegrationsSetupScreen';
// import EventsSetupScreen from '@/components/onboarding/steps/EventsSetupScreen';
import { CreditCard, Zap, Calendar } from 'lucide-react';

export const BusinessSetup = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [integrationsData, setIntegrationsData] = useState<any>(null);
  
  const handlePaymentComplete = (data: any) => {
    setPaymentData(data);
    setActiveTab('integrations');
  };

  const handleIntegrationsComplete = (data: any) => {
    setIntegrationsData(data);
    setActiveTab('events');
  };

  const handleEventsComplete = (data: any) => {
    console.log('Business setup complete:', { paymentData, integrationsData, events: data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Business Setup</h1>
        <p className="text-muted-foreground">
          Configure payment processing, third-party integrations, and event management.
        </p>
      </div>

      {/* Setup Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payment" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Payment Setup</span>
              {paymentData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Integrations</span>
              {integrationsData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payment" className="mt-6">
            <PaymentSetupScreen
              data={paymentData}
              onComplete={handlePaymentComplete}
              onNext={() => setActiveTab('integrations')}
              onSkip={() => setActiveTab('integrations')}
            />
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <div className="text-center py-12">
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Integrations Setup</h3>
              <p className="text-muted-foreground">
                Third-party integrations and API connections will be available here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Events Setup</h3>
              <p className="text-muted-foreground">
                Event management and scheduling tools will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};