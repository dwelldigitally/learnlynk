import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PaymentSetupScreen from '@/components/onboarding/steps/PaymentSetupScreen';
import IntegrationsSetupScreen from '@/components/onboarding/steps/IntegrationsSetupScreen';
import EventSetupScreen from '@/components/onboarding/steps/EventSetupScreen';
import { CreditCard, Zap, Calendar } from 'lucide-react';

export const BusinessSetup = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [integrationsData, setIntegrationsData] = useState<any>(null);
  const [eventsData, setEventsData] = useState<any>(null);
  
  const handlePaymentComplete = (data: any) => {
    setPaymentData(data);
    setActiveTab('integrations');
  };

  const handleIntegrationsComplete = (data: any) => {
    setIntegrationsData(data);
    setActiveTab('events');
  };

  const handleEventsComplete = (data: any) => {
    setEventsData(data);
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
              {eventsData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
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
            <IntegrationsSetupScreen
              data={integrationsData}
              onComplete={handleIntegrationsComplete}
              onNext={() => setActiveTab('events')}
              onSkip={() => setActiveTab('events')}
            />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventSetupScreen
              data={eventsData}
              onComplete={handleEventsComplete}
              onNext={() => {}}
              onSkip={() => {}}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};