import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, Receipt, Settings } from 'lucide-react';
import { PaymentStatsDashboard } from '../payments/PaymentStatsDashboard';
import { PageHeader } from '@/components/modern/PageHeader';
import { InvoiceTemplateTable } from '../payments/InvoiceTemplateTable';
import { ReceiptTemplateTable } from '../payments/ReceiptTemplateTable';
import { PaymentSettingsPanel } from '../payments/PaymentSettingsPanel';

export const PaymentConfiguration = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Payment Configuration"
        subtitle="Manage payment templates, view statistics, and configure payment settings"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Invoice Templates</span>
          </TabsTrigger>
          <TabsTrigger value="receipts" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Receipt Templates</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PaymentStatsDashboard />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Templates</CardTitle>
              <CardDescription>
                Create and manage invoice email templates with customizable content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceTemplateTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Templates</CardTitle>
              <CardDescription>
                Create and manage receipt email templates sent after successful payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReceiptTemplateTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <PaymentSettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
