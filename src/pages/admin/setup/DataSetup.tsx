import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
// import InitialDataSetupScreen from '@/components/onboarding/steps/InitialDataSetupScreen';
import { Database, Settings } from 'lucide-react';

export const DataSetup = () => {
  const [activeTab, setActiveTab] = useState('initial');
  const [initialData, setInitialData] = useState<any>(null);
  
  const handleInitialDataComplete = (data: any) => {
    setInitialData(data);
    setActiveTab('advanced');
  };

  const handleAdvancedComplete = (data: any) => {
    console.log('Data setup complete:', { initialData, advanced: data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Data Management Setup</h1>
        <p className="text-muted-foreground">
          Import initial data and configure advanced system settings.
        </p>
      </div>

      {/* Setup Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="initial" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Initial Data</span>
              {initialData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Advanced Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="initial" className="mt-6">
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Initial Data Import</h3>
              <p className="text-muted-foreground">
                Import existing data from spreadsheets, other systems, or manual entry tools will be available here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Advanced Configuration</h3>
              <p className="text-muted-foreground">
                Advanced configuration options will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};