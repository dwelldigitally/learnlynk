import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import RequirementsSetupScreen from '@/components/onboarding/steps/RequirementsSetupScreen';
// import FormsSetupScreen from '@/components/onboarding/steps/FormsSetupScreen';
// import LeadCaptureSetupScreen from '@/components/onboarding/steps/LeadCaptureSetupScreen';
import { FileText, FormInput, UserPlus } from 'lucide-react';

export const ApplicationSetup = () => {
  const [activeTab, setActiveTab] = useState('requirements');
  const [requirementsData, setRequirementsData] = useState<any>(null);
  const [formsData, setFormsData] = useState<any>(null);
  
  const handleRequirementsComplete = (data: any) => {
    setRequirementsData(data);
    setActiveTab('forms');
  };

  const handleFormsComplete = (data: any) => {
    setFormsData(data);
    setActiveTab('leadcapture');
  };

  const handleLeadCaptureComplete = (data: any) => {
    console.log('Application setup complete:', { requirementsData, formsData, leadCapture: data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Application Setup</h1>
        <p className="text-muted-foreground">
          Configure application requirements, forms, and lead capture systems.
        </p>
      </div>

      {/* Setup Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requirements" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Requirements</span>
              {requirementsData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center space-x-2">
              <FormInput className="w-4 h-4" />
              <span>Forms</span>
              {formsData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="leadcapture" className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Lead Capture</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="mt-6">
            <RequirementsSetupScreen
              data={requirementsData}
              programs={[]}
              onComplete={handleRequirementsComplete}
              onNext={() => setActiveTab('forms')}
              onSkip={() => setActiveTab('forms')}
            />
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <div className="text-center py-12">
              <FormInput className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Forms Setup</h3>
              <p className="text-muted-foreground">
                Form builder and management tools will be available here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="leadcapture" className="mt-6">
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lead Capture Setup</h3>
              <p className="text-muted-foreground">
                Lead capture and tracking configuration will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};