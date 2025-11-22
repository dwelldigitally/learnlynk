import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgramPropertiesTab } from './properties/ProgramPropertiesTab';
import { DocumentPropertiesTab } from './properties/DocumentPropertiesTab';
import { PaymentPropertiesTab } from './properties/PaymentPropertiesTab';
import { CustomFieldsPropertiesTab } from './properties/CustomFieldsPropertiesTab';
import { Settings, GraduationCap, FileText, Wallet, Sliders } from 'lucide-react';
import { PageHeader } from '@/components/modern/PageHeader';

export function PropertiesManagement() {
  const [activeTab, setActiveTab] = useState('program');

  return (
    <div className="w-full h-full p-6 space-y-6">
      <PageHeader 
        title="Properties Management"
        subtitle="Manage system properties and custom configurations"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="fields" className="flex items-center gap-2 py-3">
            <Sliders className="w-4 h-4" />
            <span>Custom Fields</span>
          </TabsTrigger>
          <TabsTrigger value="program" className="flex items-center gap-2 py-3">
            <GraduationCap className="w-4 h-4" />
            <span>Program</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2 py-3">
            <FileText className="w-4 h-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2 py-3">
            <Wallet className="w-4 h-4" />
            <span>Payments</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="fields" className="mt-0">
            <CustomFieldsPropertiesTab />
          </TabsContent>

          <TabsContent value="program" className="mt-0">
            <ProgramPropertiesTab />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <DocumentPropertiesTab />
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <PaymentPropertiesTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
