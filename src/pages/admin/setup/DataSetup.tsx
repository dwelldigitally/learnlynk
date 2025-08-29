import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Settings } from 'lucide-react';

export const DataSetup = () => {
  const [activeTab, setActiveTab] = useState('initial');
  const [initialData, setInitialData] = useState<any>(null);
  const [advancedData, setAdvancedData] = useState<any>(null);
  
  const handleInitialDataComplete = (data: any) => {
    setInitialData(data);
    setActiveTab('advanced');
  };

  const handleAdvancedComplete = (data: any) => {
    setAdvancedData(data);
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
              {advancedData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="initial" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Initial Data Import</h3>
                <p className="text-muted-foreground">
                  Import your existing data to get started quickly with your institution setup.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Student Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Import existing student records, enrollment history, and contact information.
                    </p>
                    <Button variant="outline" className="w-full">
                      Import Students
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Program Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Import course catalogs, program requirements, and curriculum details.
                    </p>
                    <Button variant="outline" className="w-full">
                      Import Programs
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => handleInitialDataComplete({})}>
                  Skip Data Import
                </Button>
                <Button onClick={() => handleInitialDataComplete({ imported: true })}>
                  Continue to Advanced
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Advanced Configuration</h3>
                <p className="text-muted-foreground">
                  Configure advanced system settings and preferences for your institution.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">System Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure timezone, date formats, academic calendar settings.
                    </p>
                    <Button variant="outline" className="w-full">
                      Configure System
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Email Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Customize automated email templates for admissions and communications.
                    </p>
                    <Button variant="outline" className="w-full">
                      Edit Templates
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => handleAdvancedComplete({})}>
                  Use Defaults
                </Button>
                <Button onClick={() => handleAdvancedComplete({ configured: true })}>
                  Complete Setup
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};